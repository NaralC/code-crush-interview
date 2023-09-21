import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

const useQuestionsMutation = <T>(
  mutationKey: string[],
  method: string,
  refetch: () => void
) => {
  return useMutation({
    mutationKey,
    mutationFn: async (body: T) => {
      const response = await fetch("/api/questions", {
        method,
        body: JSON.stringify(body),
      });

      const { content } = await response.json();
      return content;
    },
    onSuccess: (data) => {
      refetch();
      toast(data);
    },
  });
};


export default useQuestionsMutation;
