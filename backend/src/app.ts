import express from "express";
import mongoose from "mongoose";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());
//Middleware that integrates Clerk authentication into your Express application. It checks the request's cookies and headers for a session JWT and, if found, attaches the Auth object to the request object under the auth key.
app.use(clerkMiddleware());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);
export default app;
