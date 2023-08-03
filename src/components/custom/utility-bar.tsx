import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUsersList } from "@/context/users-list-context";
import { FC, MutableRefObject, useEffect, useRef } from "react";
import { useCodeContext } from "@/context/code-context";
import { Button } from "../ui/button";
import { Loader2, PlayCircle, Save } from "lucide-react";
import useCompileCode from "@/hooks/use-compile-code";
import { RealtimeChannel } from "@supabase/supabase-js";
import useSaveCode from "@/hooks/use-save-code";
import { EVENT } from "@/lib/constant";

const UtilityBar: FC<{
  roomName: string;
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
}> = ({ roomName, realTimeRef }) => {
  const { usersList } = useUsersList();
  const { language, setLanguage, code, isCompiling, consoleOutput, isSaving } =
    useCodeContext();
  const { handleCompile } = useCompileCode();
  const { handleSave } = useSaveCode();

  useEffect(() => {
    if (isSaving) {
      realTimeRef.current?.send({
        type: "broadcast",
        event: EVENT.SAVE_UPDATE,
        payload: {
          status: true,
        },
      });
    } else if (!isSaving) {
      // TODO: Send whether compilation is successful
      realTimeRef.current?.send({
        type: "broadcast",
        event: EVENT.SAVE_UPDATE,
        payload: {
          status: false,
        },
      });
    }
  }, [isSaving]);

  useEffect(() => {
    if (isCompiling) {
      realTimeRef.current?.send({
        type: "broadcast",
        event: EVENT.COMPILE_UPDATE,
        payload: {
          status: true,
        },
      });
    } else if (!isCompiling) {
      // TODO: Send whether compilation is successful
      realTimeRef.current?.send({
        type: "broadcast",
        event: EVENT.COMPILE_UPDATE,
        payload: {
          status: false,
          output: consoleOutput,
        },
      });
    }
  }, [isCompiling]);

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
          disabled={isCompiling}
          variant="secondary"
          onClick={() => {
            handleCompile();
          }}
        >
          Compile
          {isCompiling ? (
            <Loader2 className="hidden ml-1 -mr-1 md:block animate-spin" />
          ) : (
            <PlayCircle className="hidden ml-1 -mr-1 md:block" />
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            handleSave();
          }}
          disabled={isSaving}
        >
          Save
          {isSaving ? (
            <Loader2 className="hidden ml-1 -mr-1 md:block animate-spin" />
          ) : (
            <Save className="hidden ml-1 -mr-1 md:block" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default UtilityBar;
