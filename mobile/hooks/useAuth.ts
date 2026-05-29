import { useApi } from "@/lib/axios";
import { User } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const useAuthCallback = () => {
  const api = useApi();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.apiWithAuth<User>({
        method: "POST",
        url: "/auth/callback",
      });
      return data;
    },
  });
};
