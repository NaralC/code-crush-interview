// Components and UI
import Cursors from "@/components/custom/cursors";
import MonacoEditor from "@/components/custom/editors/monaco-editor";
import NotionLikeEditor from "@/components/custom/editors/notion-like-editor";
import OutputConsole from "@/components/custom/output-console";
import UtilityBar from "@/components/custom/utility-bar";
import Split from "react-split";
import HintsSolutionModal from "@/components/custom/modals/hints-solution-modal";
import AudioVideoCall from "@/components/custom/audio-video-call";

// Next.js/React Stuff
import { useEffect, useRef, useState } from "react";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

// Hooks and Utility
import useMousePosition from "@/hooks/use-mouse-position";
import useRealTime from "@/hooks/use-real-time";
import useWebRTC from "@/hooks/use-webrtc";
import throttle from "lodash.throttle";
import { EVENT } from "@/lib/constant";
import { useCodeStore } from "@/stores/code-store";
import SackpackEditor from "@/components/custom/editors/sandpack-editor";
import MySandpack from "../../components/custom/editors/sandpack-monaco-test";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import supabaseClient from "@/lib/supa-client";
import EndInterviewModal from "@/components/custom/modals/end-interview-modal";
import useModalStore from "@/stores/modal-store";

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

  const { code_state, room_id, name, participants, type, finished } = rooms[0];

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
      type,
      finished,
      questions,
    },
  };
};

const CodingPage: NextPage<{
  initialCodeState: Record<string, { value: string }>;
  roomId: string;
  roomName: string;
  userName: string;
  type: "front_end" | "ds_algo";
  finished: boolean;
  questions: Question[];
}> = ({
  initialCodeState,
  roomId,
  roomName: initialRoomName,
  userName,
  type,
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
  const { dispatchCode } = useCodeStore();
  const { x, y } = useMousePosition();
  const {
    endInterviewModal: { setOpen, setClose },
  } = useModalStore();
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
      for (const language in initialCodeState) {
        const value = initialCodeState[language].value
        
        dispatchCode({
          type: "UPDATE_CODE_BY_LANGUAGE",
          payload: {
            language,
            value
          },
        });
      }

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
        className="flex flex-col w-full h-screen"
        onMouseMove={sendMousePosition}
      >
        {type === "ds_algo" ? (
          <>
            <Cursors realTimeRef={realTimeRef} />
            <UtilityBar
              realTimeRef={realTimeRef}
              roomName={roomName}
              roomId={roomId}
              finished={isFinished}
            />
            <Split className="flex flex-row h-screen p-12 cursor-grab bg-gradient-to-b from-black via-slate-900 to-slate-800">
              <div className="w-full h-full bg-black rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
                <MonacoEditor
                  realTimeRef={realTimeRef}
                  name={userName}
                  finished={isFinished}
                />
              </div>
              <div className="w-full bg-white rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
                <NotionLikeEditor
                  realTimeRef={realTimeRef}
                  questions={questions}
                  finished={isFinished}
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
          </>
        ) : (
          <>
            <SackpackEditor />
            {/* <MySandpack /> */}
          </>
        )}
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

export default CodingPage;
