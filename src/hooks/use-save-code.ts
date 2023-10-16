import { useCodeStore } from "@/stores/code-store";
import { useNoteStore } from "@/stores/note-store";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { z } from "zod";

const useSaveCode = (roomId: string) => {
  const { latestWholeCodeStateRef, dispatchAsync, codeState } = useCodeStore();
  const { editorRef } = useNoteStore();

  const { isLoading: isSaving, mutate: handleSave } = useMutation({
    mutationKey: ["save-code"],
    mutationFn: async () => {
      dispatchAsync({
        type: "SET_IS_SAVING",
        payload: true,
      });

      const note = await editorRef.current?.save();

      const response = await fetch("/api/db", {
        method: "PATCH",
        body: JSON.stringify({
          code: codeState.code,
          note,
          roomId
        }),
      });

      const { content } = await response.json();
      return z.string().parse(content);
    },
    onSuccess: (data) => toast.success(data),
    onError: (error) => toast.error((error as Error).message),
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
