import { useCodeContext } from "@/context/code-context";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { z } from "zod";

const useSaveCode = () => {
  const { latestCodeRef, dispatchAsync } = useCodeContext();

  const { isLoading: isSaving, mutate: handleSave } = useMutation({
    mutationKey: ["saveCode"],
    mutationFn: async () => {
      dispatchAsync({
        type: "SET_IS_SAVING",
        payload: true,
      });
      
      const response = await fetch("/api/db", {
        method: "PATCH",
        body: JSON.stringify({
          code: latestCodeRef.current,
        }),
      });

      const { content } = await response.json();
      return z.string().parse(content);
    },
    onSuccess: (data) => toast.success(data),
    onError: (error) => toast.error("Failed to save"),
    onSettled: () =>
      dispatchAsync({
        type: "SET_IS_SAVING",
        payload: false,
      }),
  });

  return {
    handleSave,
    isSaving,
  };
};

export default useSaveCode;
