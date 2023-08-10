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
import { TbDeviceDesktopCode } from "react-icons/tb";
import useCompileCode from "@/hooks/use-compile-code";
import { RealtimeChannel } from "@supabase/supabase-js";
import useSaveCode from "@/hooks/use-save-code";
import { EVENT } from "@/lib/constant";

const UtilityBar: FC<{
  roomName: string;
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
}> = ({ roomName, realTimeRef }) => {
  const { usersList } = useUsersList();
  const { codeState, dispatchCode, asyncState, consoleState } =
    useCodeContext();
  const { handleCompile } = useCompileCode();
  const { handleSave } = useSaveCode();

  useEffect(() => {
    if (asyncState.isSaving) {
      realTimeRef.current?.send({
        type: "broadcast",
        event: EVENT.SAVE_UPDATE,
        payload: {
          status: true,
        },
      });
    } else if (!asyncState.isSaving) {
      // TODO: Send whether compilation is successful
      realTimeRef.current?.send({
        type: "broadcast",
        event: EVENT.SAVE_UPDATE,
        payload: {
          status: false,
        },
      });
    }
  }, [asyncState.isSaving]);

  useEffect(() => {
    if (asyncState.isCompiling) {
      realTimeRef.current?.send({
        type: "broadcast",
        event: EVENT.COMPILE_UPDATE,
        payload: {
          status: true,
        },
      });
    } else if (!asyncState.isCompiling) {
      // TODO: Send whether compilation is successful
      realTimeRef.current?.send({
        type: "broadcast",
        event: EVENT.COMPILE_UPDATE,
        payload: {
          status: false,
          output: consoleState.consoleOutput,
        },
      });
    }
  }, [asyncState.isCompiling]);

  return (
    <div className="z-10 flex flex-row justify-between w-full px-3 py-2 text-white border-b-2 border-zinc-500 bg-slate-900 h-14">
      <div className="items-center hidden gap-3 text-xl font-bold transition-all md:flex">
        Code Crush
        <TbDeviceDesktopCode className="w-6 h-6" />
      </div>
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
          value={codeState.language}
          onValueChange={(newLanguage) =>
            dispatchCode({
              type: "SET_LANGUAGE",
              payload: newLanguage,
            })
          }
        >
          <SelectTrigger className="w-[130px] md:w-[180px] bg-slate-900">
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
          disabled={asyncState.isCompiling}
          variant="secondary"
          onClick={() => {
            handleCompile();
          }}
        >
          <div className="hidden md:block">Compile</div>
          {asyncState.isCompiling ? (
            <Loader2 className="md:ml-1 md:-mr-1 animate-spin" />
          ) : (
            <PlayCircle className="md:ml-1 md:-mr-1" />
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            handleSave();
          }}
          disabled={asyncState.isSaving}
        >
          <div className="hidden md:block">Save</div>
          {asyncState.isSaving ? (
            <Loader2 className="md:ml-1 md:-mr-1 animate-spin" />
          ) : (
            <Save className="md:ml-1 md:-mr-1" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default UtilityBar;
