import { Redirect } from "expo-router";

export default function Index() {
  const isAuthenticated = false; // Replace with your authentication logic

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)" />;
}
