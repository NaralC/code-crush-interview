import type { RealtimeChannel } from "@supabase/supabase-js";
import * as React from "react";

import { EVENT } from "@/lib/constant";
import { Button } from "@/components/ui/button";
import { useRealTimeFrontEnd } from "@/hooks/use-real-time";
import { useActiveCode } from "@codesandbox/sandpack-react";
import UtilityBar from "@/components/custom/utility-bar";
import useWebRTC from "@/hooks/use-webrtc";
import useMousePosition from "@/hooks/use-mouse-position";
import useModalStore from "@/stores/modal-store";
import supabaseClient from "@/lib/supa-client";
import throttle from "lodash.throttle";
import toast from "react-hot-toast";
import Cursors from "@/components/custom/cursors";
import OutputConsole from "@/components/custom/output-console";
import HintsSolutionModal from "@/components/custom/modals/hints-solution-modal";
import EndInterviewModal from "@/components/custom/modals/end-interview-modal";
import Head from "next/head";
import AudioVideoCall from "@/components/custom/audio-video-call";
import Split from "react-split";
import NotionLikeEditor from "@/components/custom/editors/notion-like-editor";
import type { OutputData } from "@editorjs/editorjs";

// THIS COMPONENT IS FOR HOOKS AND UI COMPONENTS THAT ARE TYPE AGNOSTIC

type Props = React.PropsWithChildren<{
  roomId: string;
  userName: string;
  fnToRunOnMount: () => void;
  isFinished: boolean;
  questions: Question[];
  initialNoteState: OutputData;
  userId: string;
  realTimeRef: React.MutableRefObject<RealtimeChannel | null>;
  roomName: string;
  type: InterviewType
}>;

const CodingLayout: React.FC<Props> = ({
  children, // This is the text editor
  fnToRunOnMount,
  isFinished,
  roomId,
  userName,
  initialNoteState,
  questions,
  realTimeRef,
  userId,
  roomName,
  type
}) => {
  // States
  const { x, y } = useMousePosition();
  const { endInterviewModal: { setOpen, setClose } } = useModalStore();
  const supa = supabaseClient;
  // const { editorRef, editorIsMounted } = useNoteStore();
  // const { myVideo, partnerVideo, host } = useWebRTC(realTimeRef);
  // const [isMuted, setIsMuted] = useState<boolean>(false);

  const sendMousePosition = throttle(() => {
    realTimeRef.current?.send({
      type: "broadcast",
      event: EVENT.MOUSE_UPDATE,
      payload: { x, y, userName, userId },
    });
  }, 200);

  const effectRan = React.useRef(false);
  React.useEffect(() => {
    if (effectRan.current === false) {
      fnToRunOnMount();

      if (isFinished)
        toast(
          "This interview is marked as finished. Editing text is no longer allowed.",
          { duration: 4000 }
        );
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  const handleEndInterview = async () => {
    const { error } = await supa
      .from("interview_rooms")
      .update({
        finished: true,
      })
      .eq("room_id", roomId)
      .select();

    if (error) toast.error("Could not end interview.");
    setClose();
  };

  return (
    <>
      <Head>
        <title>Interview Time!</title>
        <meta name="Code Crush" content="Code Crush" />
      </Head>

      <main
        className="flex flex-col w-full h-screen inter-font"
        onMouseMove={sendMousePosition}
      >
        <Cursors realTimeRef={realTimeRef} />
        <UtilityBar
          realTimeRef={realTimeRef}
          roomName={roomName}
          roomId={roomId}
          finished={false}
          type={type}
        />
        <Split className="flex flex-row h-screen p-12 cursor-grab bg-gradient-to-b from-black via-slate-900 to-slate-800">
          <div className="w-full overflow-y-auto bg-black rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
            {children}
          </div>
          <div className="w-full bg-white rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
            <NotionLikeEditor
              realTimeRef={realTimeRef}
              questions={questions}
              finished={isFinished}
              initialNoteData={initialNoteState}
            />
          </div>
        </Split>
        <OutputConsole />
        {/* {!finished && (
          <AudioVideoCall
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            myVideo={myVideo}
            partnerVideo={partnerVideo}
          />
        )} */}
      </main>

      <HintsSolutionModal />
      <EndInterviewModal handleEndInterview={handleEndInterview} />
      {!isFinished && (
        <Button
          className="fixed z-40 shadow bottom-5 left-5 shadow-white"
          onClick={setOpen}
        >
          End Interview
        </Button>
      )}
    </>
  );
};

export default CodingLayout;
