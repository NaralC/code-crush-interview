import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FC,
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "../ui/button";
import {
  CornerDownRight,
  FolderEdit,
  Loader2,
  PlayCircle,
  Save,
} from "lucide-react";
import useCompileCode from "@/hooks/use-compile-code";
import { RealtimeChannel } from "@supabase/supabase-js";
import useSaveCode from "@/hooks/use-save-code";
import { EVENT } from "@/lib/constant";
import { useCodeStore } from "@/stores/code-store";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import supabaseClient from "@/lib/supa-client";
import toast from "react-hot-toast";

const UtilityBar: FC<{
  roomName: string;
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
  roomId: string;
}> = ({ roomName, realTimeRef, roomId }) => {
  const supaClient = supabaseClient;
  const [roomNameInput, setRoomNameInput] = useState<string>("");
  const { codeState, consoleState, asyncState, dispatchCode } = useCodeStore();

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

  const handleChangeRoomName = async (e: FormEvent) => {
    e.preventDefault();

    if (!roomNameInput) return;

    const { data, error } = await supaClient
      .from("interview_rooms")
      .update({
        name: roomNameInput,
      })
      .eq("room_id", roomId)
      .select();

    if (error) toast.error("Could not change room name :(");
  };

  return (
    <div className="z-10 flex flex-row justify-between w-full px-5 py-2 text-white border-b-2 border-zinc-500 bg-slate-900 h-14">
      <Popover>
        <PopoverTrigger className="flex flex-row items-center gap-2">
          <FolderEdit />
          <div>{roomName}</div>
        </PopoverTrigger>
        <PopoverContent className="space-y-2 translate-x-5 drop-shadow-md shadow-black">
          <Label className="text-base" htmlFor="roomName">
            Change room name?
          </Label>
          <form className="relative flex" onSubmit={handleChangeRoomName}>
            <Input
              id="roomName"
              placeholder={roomName}
              onChange={(e) => setRoomNameInput(e.target.value)}
            />
            <button type="submit" className="bg-transparent">
              <CornerDownRight className="absolute transition-transform top-2 right-3 hover:cursor-pointer hover:scale-105" />
            </button>
          </form>
        </PopoverContent>
      </Popover>

      <div className="flex gap-3">
        <Select
          value={codeState.language}
          onValueChange={(newLanguage: string) =>
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
