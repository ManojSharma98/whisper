import AuthSync from "@/components/AuthSync";
import SocketConnection from "@/components/SocketConnection";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "../global.css";

Sentry.init({
  dsn: "https://a1b50548f39b87e7b2bfb13ba078571a@o4511473745330176.ingest.us.sentry.io/4511473755422720",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.reactNativeTracingIntegration({
      traceFetch: true,
      traceXHR: true,
      enableHTTPTimings: true,
    }),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const queryClient = new QueryClient();

export default Sentry.wrap(function RootLayout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  if (!publishableKey) {
    throw new Error("Add your Clerk Publishable Key to the .env file");
  }
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <AuthSync />
        <SocketConnection />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#0D0D0F" },
          }}
        >
          <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen
            name="new-chat"
            options={{
              animation: "slide_from_bottom",
              presentation: "modal",
              gestureEnabled: true,
            }}
          />
        </Stack>
      </QueryClientProvider>
    </ClerkProvider>
  );
});
