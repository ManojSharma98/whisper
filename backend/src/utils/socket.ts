import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { User } from "../models/User";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";

interface SocketWithUserID extends Socket {
  userId?: string;
}

// store online users in memory (for demo purposes, consider using Redis for production)
export const onlineUsers: Map<string, string> = new Map<string, string>();

export const initializeSocket = (httpServer: HttpServer) => {
  const allOrigins = [
    "http://localhost:5173",
    "http://localhost:8081",
    process.env.FRONTEND_URL as string,
  ];

  const io = new SocketServer(httpServer, {
    cors: {
      origin: allOrigins,
    },
  });

  // verify token and authenticate user before allowing socket connection
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    try {
      const session = verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      const clerkId = (await session).sub;
      const user = await User.findOne({ clerkId });
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }
      (socket as SocketWithUserID).userId = user._id.toString(); // Attach user ID to socket
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  // Handle socket connections
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${(socket as SocketWithUserID).userId}`);
    const userId = (socket as SocketWithUserID).userId;
    // send list of currently online users to the newly connected user
    socket.emit("onlineUsers", { userIds: Array.from(onlineUsers.keys()) });

    // store user in the online users map
    if (userId) {
      onlineUsers.set(userId, socket.id);
    }
    // notify other users that a new user has come online
    socket.broadcast.emit("user-online", { userId });

    socket.join(`user:${userId}`); // Join a room specific to the user for private messaging

    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`); // Join a room specific to the chat for group messaging
    });
    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`); // Leave a room specific to the chat for group messaging
    });

    socket.on(
      "send-message",
      async (data: { chatId: string; text: string }) => {
        try {
          const { chatId, text } = data;

          const chat = await Chat.findOne({
            _id: chatId,
            participants: userId,
          });
          if (!chat) {
            return socket.emit("socket-error", { message: "Chat not found" });
          }

          const message = await Message.create({
            chat: chatId,
            sender: userId!,
            text,
          });

          chat.lastMessage = message._id;
          chat.lastMessageAt = new Date();
          chat.save();

          await message.populate("sender", "name email avatar");

          // emit the new message to all participants in the chat
          io.to(`chat:${chatId}`).emit("new-message", {
            chatId,
            message,
          });

          for (const participantId of chat.participants) {
            io.to(`user:${participantId.toString()}`).emit(
              "new-message",
              message,
            );
          }
        } catch (err) {
          console.error("Error handling send-message event:", err);
          return socket.emit("socket-error", {
            message: "Failed to send message",
          });
        }
      },
    );

    socket.on("typing", async (data: { chatId: string }) => {
      const { chatId } = data;
      socket.to(`chat:${chatId}`).emit("typing", {
        chatId,
        userId,
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${(socket as SocketWithUserID).userId}`);
      const userId = (socket as SocketWithUserID).userId;
      if (userId) {
        onlineUsers.delete(userId);
        // notify other users that this user has gone offline
        socket.broadcast.emit("user-offline", { userId });
      }
    });
  });
  return io;
};
