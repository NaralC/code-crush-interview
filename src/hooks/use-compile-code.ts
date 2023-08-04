import { useCodeContext } from "@/context/code-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { z } from "zod";

const useCompileCode = () => {
  const { codeState, dispatchConsole, dispatchAsync } = useCodeContext();

  // Getting a token
  const { data: token, mutate: handleCompile } = useMutation({
    mutationKey: ["token"],
    mutationFn: async () => {
      dispatchAsync({
        type: "SET_IS_COMPILING",
        payload: true,
      });

      const response = await fetch("/api/compile/token", {
        method: "POST",
        body: JSON.stringify({
          code: window.btoa(codeState.code),
          language: codeState.language,
        }),
      });
      const { content } = await response.json();

      // TODO: Exceeded API call quota
      if (content.message) {
        console.log("kuay");
        console.log(content.message);
        throw new Error(content.message);
      }

      return z.string().parse(content);
    },
    onError: (error) => {
      toast.error((error as Error).message);
      dispatchAsync({
        type: "SET_IS_COMPILING",
        payload: false,
      });
    },
    // onSuccess: (data) => console.log(data),
  });

  // Using the token to check fetch submission result
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

      const parsedContent = z
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

      if (![1, 2, 3].includes(parsedContent.status.id)) throw new Error();

      return parsedContent;
    },
    refetchInterval: (data) => {
      if (!data) return 300;

      const { id } = data?.status!;
      return [1, 2].includes(id) ? 300 : false;
    },
    onError: (error) => toast.error("Compilation Error"),
    onSettled: () =>
      dispatchAsync({
        type: "SET_IS_COMPILING",
        payload: false,
      }),
    onSuccess: (data) => {
      toast("Compilation Finished");

      dispatchConsole({
        type: "SET_CONSOLE_OUTPUT",
        payload: JSON.stringify({
          ...data,
          stdout: data.stdout ? window.atob(data.stdout) : "",
        }),
      });
      
      dispatchConsole({
        type: "SET_CONSOLE_VISIBLE",
        payload: true,
      });
    },
    enabled: !!token,
  });

  return {
    handleCompile,
  };
};

export default useCompileCode;
