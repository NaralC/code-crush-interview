import { useCodeContext } from "@/context/code-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const useCompileCode = () => {
  const isCompilingRef = useRef<boolean>(false);
  const { code, language, setConsoleIsVisible, setConsoleOutput } =
    useCodeContext();

  const { data: token, mutate: handleCompile } = useMutation({
    mutationKey: ["token"],
    mutationFn: async () => {
      isCompilingRef.current = true;

      const response = await fetch("/api/compile/token", {
        method: "POST",
        body: JSON.stringify({
          code: window.btoa(code),
          language,
        }),
      });
      const { content } = await response.json();

      // TODO: Exceeded API call quota
      if (content.message) {
        console.log('kuay')
        console.log(content.message)
        throw new Error(content.message);
      }

      return z.string().parse(content);
    },
    onError: (error) => {
      toast.error((error as Error).message);
      isCompilingRef.current = false;
    },
    // onSuccess: (data) => console.log(data),
  });

  const { data: output } = useQuery({
    queryKey: ["submission"],
    queryFn: async () => {
      const response = await fetch("/api/compile/submission", {
        method: "POST",
        body: JSON.stringify({
          token,
        }),
      });
      const { content } = await response.json();
      // console.log(content);
      return z
        .object({
          memory: z.number(),
          memory_limit: z.number(),
          status: z.object({
            id: z.number(),
            description: z.string(),
          }),
          stdout: z.string().nullable(),
          time: z.string(),
        })
        .parse(content);
    },
    refetchInterval: (data) => (data?.status.id === 3 ? false : 300),
    onError: (error) => toast.error("Compilation Error"),
    onSettled: () => (isCompilingRef.current = false),
    onSuccess: (data) => {
      toast.success("Compilation Successful");
      setConsoleOutput(
        JSON.stringify({
          ...data,
          stdout: data.stdout ? window.atob(data.stdout) : "",
        })
      );
      setConsoleIsVisible(true);
    },
    enabled: !!token,
  });

  return {
    isCompilingRef,
    handleCompile,
  };
};

export default useCompileCode;
