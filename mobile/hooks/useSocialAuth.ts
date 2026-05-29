import { useSSO } from "@clerk/expo";
import { useState } from "react";

function useAuthSocial() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    if (loadingStrategy) return; // Prevent multiple simultaneous auth attempts
    setLoadingStrategy(strategy);
    try {
      const { setActive, createdSessionId } = await startSSOFlow({ strategy });
      if (!createdSessionId || !setActive) {
        const providerName = strategy === "oauth_google" ? "Google" : "Apple";
        alert(`Sign-in incomplete ${providerName}`);
      }
    } catch (error) {
      console.error("Social auth error:", error);
      const providerName = strategy === "oauth_google" ? "Google" : "Apple";
      alert(`Failed to sign in with ${providerName}. Please try again.`);
    } finally {
      setLoadingStrategy(null);
    }
  };
  return {
    handleSocialAuth,
    loadingStrategy,
  };
}

export default useAuthSocial;
