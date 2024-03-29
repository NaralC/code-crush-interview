// Components and UI
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
import { Button } from "../ui/button";
import {
  CornerDownRight,
  FolderEdit,
  Loader2,
  PlayCircle,
  Save,
  Users2,
} from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  SiAngular,
  SiCsharp,
  SiPython,
  SiReact,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";
import toast from "react-hot-toast";

// Next.js/React Stuff
import {
  type FC,
  FormEvent,
  MutableRefObject,
  useEffect,
  useState,
} from "react";
import useCompileCode from "@/hooks/use-compile-code";

// Hooks and Utility
import { RealtimeChannel } from "@supabase/supabase-js";
import useSaveCode from "@/hooks/use-save-code";
import { EVENT } from "@/lib/constant";
import { useCodeStore } from "@/stores/code-store";
import { useUsersStore } from "@/stores/users-store";
import supabaseClient from "@/lib/supa-client";
import { useActiveCode } from "@codesandbox/sandpack-react";
import { formatRepoName } from "@/lib/utils";
import { FaJava } from "react-icons/fa";

type Props = {
  roomName: string;
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
  roomId: string;
  finished: boolean;
  type: InterviewType; // this hides "Compile" btn and switches out the language dropdown to FE
};

const DsAlgoDropdownContent = [
  { language: "TypeScript", icon: <SiTypescript /> },
  { language: "Python", icon: <SiPython /> },
  { language: "C#", icon: <SiCsharp /> },
  { language: "Java", icon: <FaJava /> },
];

const SaveCodeBtnDsAlgo = ({ finished, roomId }: { finished: boolean; roomId: string; }) => {
  const { asyncState, codeState } = useCodeStore();
  const { handleSave } = useSaveCode(roomId, codeState);

  return (
    <Button
      variant="secondary"
      onClick={() => handleSave()}
      disabled={asyncState.isSaving || finished}
    >
      <div className="hidden md:block">Save</div>
      {asyncState.isSaving ? (
        <Loader2 className="md:ml-1 md:-mr-1 animate-spin" />
      ) : (
        <Save className="md:ml-1 md:-mr-1" />
      )}
    </Button>
  );
};

const SaveCodeBtnFrontEnd = ({ finished, roomId }: { finished: boolean; roomId: string; }) => {
  const { asyncState } = useCodeStore();
  const { code } = useActiveCode();
  const { handleSave } = useSaveCode(roomId, code);

  return (
    <Button
      variant="secondary"
      onClick={() => handleSave()}
      disabled={asyncState.isSaving || finished}
    >
      <div className="hidden md:block">Save</div>
      {asyncState.isSaving ? (
        <Loader2 className="md:ml-1 md:-mr-1 animate-spin" />
      ) : (
        <Save className="md:ml-1 md:-mr-1" />
      )}
    </Button>
  );
};

const UtilityBar: FC<Props> = ({
  roomName,
  realTimeRef,
  roomId,
  finished,
  type,
}) => {
  const supaClient = supabaseClient;
  const [roomNameInput, setRoomNameInput] = useState<string>("");
  const { codeState, consoleState, asyncState, dispatchCode } = useCodeStore();
  const { handleCompile } = useCompileCode();
  const { setRole, role, latestRoleRef } = useUsersStore();

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

  realTimeRef.current?.on(
    "broadcast",
    { event: EVENT.ROLE_SWAP }, // Filtering events
    ({
      payload,
    }: Payload<{
      role: Roles;
    }>) => {
      const { role } = payload!;

      if (!role) return;

      setRole(role === "interviewee" ? "interviewer" : "interviewee");
    }
  );

  const handleChangeRoomName = async (e: FormEvent) => {
    e.preventDefault();

    if (!roomNameInput) return;

    const { data, error } = await supaClient
      .from("interview_rooms")
      .update({
        name: formatRepoName(roomNameInput),
      })
      .eq("room_id", roomId)
      .select();

    if (error) toast.error("Could not change room name :(");
  };

  useEffect(() => {
    dispatchCode({
      type: "SET_LANGUAGE",
      payload: DsAlgoDropdownContent[0].language.toLowerCase(),
    });
  }, []);

  return (
    <div className="z-10 flex flex-row justify-between w-full px-5 py-2 text-white border-b-2 border-zinc-500 bg-slate-900 h-14">
      <Popover>
        <PopoverTrigger className="flex flex-row items-center gap-2">
          <FolderEdit />
          <div>{roomName}</div>
        </PopoverTrigger>
        <PopoverContent className="space-y-2 translate-x-5 drop-shadow-md shadow-black inter-font">
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
        {type === "ds_algo" && (
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
            <SelectContent className="text-white shadow-md bg-gradient-to-b from-black to-slate-700 shadow-white inter-font">
              {DsAlgoDropdownContent.map(({ icon, language }) => (
                <SelectItem
                  className="cursor-pointer"
                  key={language}
                  value={language.toLowerCase()}
                >
                  <div className="flex flex-row gap-3">
                    <div>{icon}</div>
                    <div>{language}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <Button
          disabled={finished}
          variant="secondary"
          onClick={() => {
            setRole(role === "interviewee" ? "interviewer" : "interviewee");

            realTimeRef.current?.send({
              type: "broadcast",
              event: EVENT.ROLE_SWAP,
              payload: {
                role: latestRoleRef.current,
              },
            });
          }}
        >
          <div className="hidden text-sm md:block">
            <div>Swap Roles</div>
            <div className="text-xs text-gray-500 capitalize">
              {latestRoleRef.current}
            </div>
          </div>
          {false ? (
            <Loader2 className="md:ml-1 md:-mr-1 animate-spin" />
          ) : (
            <Users2 className="md:ml-1 md:-mr-1" />
          )}
        </Button>
        {type === "ds_algo" && (
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
        )}
        {type === "ds_algo" && <SaveCodeBtnDsAlgo finished={finished} roomId={roomId} />}
        {type === "front_end" && <SaveCodeBtnFrontEnd finished={finished} roomId={roomId} />}
      </div>
    </div>
  );
};

export default UtilityBar;
