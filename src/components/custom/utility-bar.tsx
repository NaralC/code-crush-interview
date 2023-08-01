import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BiLogoTypescript, BiLogoPython } from "react-icons/bi";
import { SiChartdotjs, SiCsharp } from "react-icons/si";
import { useUsersList } from "@/context/users-list-context";
import { FC, useEffect, useRef } from "react";
import { useCodeContext } from "@/context/code-context";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import toast from "react-hot-toast";

const UtilityBar: FC<{ roomName: string }> = ({ roomName }) => {
  const { usersList } = useUsersList();
  const { code, language, setLanguage, setConsoleIsVisible, setConsoleOutput } =
    useCodeContext();
  const isCompilingRef = useRef<boolean>(false);

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
      return z.string().parse(content);
    },
    onError: () => (isCompilingRef.current = false),
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

  return (
    <div className="z-10 flex flex-row justify-between px-3 py-2 text-white border-b-2 border-zinc-500 bg-slate-800">
      <div>{roomName}</div>
      <div>
        Online users:
        {Object.keys(usersList).map((player) => {
          const { name } = usersList[player][0];

          return (
            <div className="inline-flex ml-2" key={name}>
              {player}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3">
        <Select
          value={language}
          onValueChange={(newLanguage) => setLanguage(newLanguage)}
        >
          <SelectTrigger className="w-[180px] bg-slate-900">
            <SelectValue placeholder="Pick a language..." />
          </SelectTrigger>
          <SelectContent className="text-white shadow-md bg-gradient-to-b from-black to-slate-700 shadow-white">
            {["TypeScript", "Python", "C#"].map((language) => (
              <SelectItem
                className="cursor-pointer"
                key={language}
                value={language.toLowerCase()}
              >
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          disabled={isCompilingRef.current}
          variant="secondary"
          onClick={() => {
            handleCompile();
          }}
        >
          Compile
          {isCompilingRef.current ? (
            <Loader2 className="ml-1 -mr-1 animate-spin" />
          ) : null}
        </Button>
      </div>
    </div>
  );
};

export default UtilityBar;
