import { useSSO } from "@clerk/expo";
import { useState } from "react";

function useAuthSocial() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingStrategy(strategy);
    try {
      const { setActive, createdSessionId } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
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
