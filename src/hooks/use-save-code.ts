import { CodeState } from "@/lib/reducers";
import { useCodeStore } from "@/stores/code-store";
import { useNoteStore } from "@/stores/note-store";
import { useActiveCode } from "@codesandbox/sandpack-react";
import type { OutputData } from "@editorjs/editorjs";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { z } from "zod";

const useSaveCode = (roomId: string, state: CodeState | string) => {
  const { dispatchAsync } = useCodeStore();
  const { editorRef } = useNoteStore();

  const { isLoading: isSaving, mutate: handleSave } = useMutation({
    mutationKey: ["save-code"],
    mutationFn: async () => {
      dispatchAsync({
        type: "SET_IS_SAVING",
        payload: true,
      });

      const note = await editorRef.current?.save();

      const body: {
        note?: OutputData;
        roomId: string;
        code: string | Record<string, { value: string }>;
      } = { note, roomId, code: "" };

      // Being type "object" indicates the room's ds-algo
      if (typeof state === "object") body.code = state.code;
      else if (typeof state === "string") body.code = state;

      const response = await fetch("/api/db", {
        method: "PATCH",
        body: JSON.stringify(body),
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
