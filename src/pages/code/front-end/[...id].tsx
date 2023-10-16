import SackpackEditor from "@/components/custom/editors/sandpack-editor";
import UtilityBar from "@/components/custom/utility-bar";
import useRealTime from "@/hooks/use-real-time";
import { useCodeStore } from "@/stores/code-store";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import type { OutputData } from "@editorjs/editorjs";
import type { NextPage, GetServerSideProps } from "next";
import { useEffect, useRef, useState } from "react";
import useWebRTC from "@/hooks/use-webrtc";
import useMousePosition from "@/hooks/use-mouse-position";
import useModalStore from "@/stores/modal-store";
import supabaseClient from "@/lib/supa-client";
import { useNoteStore } from "@/stores/note-store";
import throttle from "lodash.throttle";
import { EVENT } from "@/lib/constant";
import toast from "react-hot-toast";
import Cursors from "@/components/custom/cursors";
import OutputConsole from "@/components/custom/output-console";
import HintsSolutionModal from "@/components/custom/modals/hints-solution-modal";
import EndInterviewModal from "@/components/custom/modals/end-interview-modal";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import AudioVideoCall from "@/components/custom/audio-video-call";
import Split from "react-split";
import NotionLikeEditor from "@/components/custom/editors/notion-like-editor";

// Sandpacks
import ExperimentalSandpack from "./experimental-sandpack";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { SandpackWithLiveCodeState } from "@/pages/code/front-end/test-sanpack-live-state";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseClient = createPagesServerClient<Database>(ctx);

  const { id: roomId, userName } = ctx.query;
  const { data: rooms, error: roomsError } = await supabaseClient
    .from("interview_rooms")
    .select("*")
    .eq("room_id", roomId);

  if (roomsError || !roomId || !userName) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const {
    code_state,
    room_id,
    name,
    participants,
    type,
    finished,
    note_state,
  } = rooms[0];

  const { data: questions, error: questionsError } = await supabaseClient
    .from("questions")
    .select("title, body, hints, solution, id")
    .eq("type", type);

  if (participants) {
    const userCount = Object.keys(participants!).length;

    if (userCount >= 2) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }
  
  return {
    props: {
      initialCodeState: code_state,
      roomId: room_id,
      roomName: name,
      userName,
      finished,
      questions,
      initialNoteState: note_state,
    },
  };
};

const FrontEndPage: NextPage<{
  initialCodeState: Record<string, { value: string }>;
  initialNoteState: OutputData;
  roomId: string;
  roomName: string;
  userName: string;
  finished: boolean;
  questions: Question[];
}> = ({
  initialCodeState,
  initialNoteState,
  roomId,
  roomName: initialRoomName,
  userName,
  finished,
  questions,
}) => {
  // States
  const [isFinished, setIsFinished] = useState<boolean>(finished);
  const [roomName, setRoomName] = useState<string>(initialRoomName);
  const { realTimeRef, userId } = useRealTime(
    roomId,
    userName,
    (newName) => setRoomName(newName),
    isFinished,
    () => setIsFinished(true)
  );
  const { myVideo, partnerVideo, host } = useWebRTC(realTimeRef);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const { dispatchCode, codeState } = useCodeStore();
  const { x, y } = useMousePosition();
  const {
    endInterviewModal: { setOpen, setClose },
  } = useModalStore();
  const { editorRef, editorIsMounted } = useNoteStore();
  const supa = supabaseClient;

  const sendMousePosition = throttle(() => {
    realTimeRef.current?.send({
      type: "broadcast",
      event: EVENT.MOUSE_UPDATE,
      payload: { x, y, userName, userId },
    });
  }, 200);

  const effectRan = useRef(false);
  useEffect(() => {
    if (effectRan.current === false) {
      dispatchCode({
        type: "SET_CODE_STORE",
        payload: initialCodeState
      })

      // for (const language in initialCodeState) {
      //   const value = initialCodeState[language].value;

      //   dispatchCode({
      //     type: "UPDATE_CODE_BY_LANGUAGE",
      //     payload: {
      //       language,
      //       value,
      //     },
      //   });
      // }

      if (isFinished)
        toast(
          "This interview is marked as finished. Editing text is no longer allowed.",
          {
            duration: 4000,
          }
        );
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     editorRef.current?.render(initialNoteState)
  //   }, 1000);

  //   return () => clearTimeout(timeout)
  // }, [editorIsMounted]);

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

      <main className="flex flex-col w-full h-screen">
        {/* <Cursors realTimeRef={realTimeRef} /> */}
        <UtilityBar
          realTimeRef={realTimeRef}
          roomName={roomName}
          roomId={roomId}
          finished={false}
          type={"front_end"}
        />
        <Split className="flex flex-row h-screen p-12 cursor-grab bg-gradient-to-b from-black via-slate-900 to-slate-800">
          <div className="w-full h-full bg-black rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
            {/* <SandpackWithLiveCodeState /> */}
              <SackpackEditor
                template={
                  codeState.language === "react"
                    ? "react-ts"
                    : codeState.language === "angular"
                    ? "angular"
                    : "vue-ts"
                }
                finished={isFinished}
              />
              {/* <ExperimentalSandpack
                template={"vite-react-ts"}
                finished={false}
              /> */}
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
        {/* {!!finished && (
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

export default FrontEndPage;
