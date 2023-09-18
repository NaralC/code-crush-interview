// Components
import Cursors from "@/components/custom/cursors";
import MonacoEditor from "@/components/custom/editors/monaco-editor";
import NotionLikeEditor from "@/components/custom/editors/notion-like-editor";
import OutputConsole from "@/components/custom/output-console";
import UtilityBar from "@/components/custom/utility-bar";
import Split from "react-split";
import HintsSolutionModal from "@/components/custom/modals/hints-solution-modal";
import AudioVideoCall from "@/components/custom/audio-video-call";

// Next.js/React Stuff
import { MutableRefObject, createRef, useEffect, useState } from "react";
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
import { useUsersStore } from "@/stores/users-store";
import { initialCodeState } from "@/lib/reducers";
import SackpackEditor from "@/components/custom/editors/sandpack-editor";
import MySandpack from "@/components/custom/editors/sandpack-monaco-test";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseClient = createPagesServerClient<Database>(ctx);

  const { id: roomId, userName } = ctx.query;
  const { data, error } = await supabaseClient
    .from("interview_rooms")
    .select("*")
    .eq("room_id", roomId);

  if (error || !roomId || !userName) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { code_state, room_id, name, participants, type } = data[0];

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
    },
  };
};

const CodingPage: NextPage<{
  initialCodeState: string;
  roomId: string;
  roomName: string;
  userName: string;
  type: "front_end" | "ds_algo";
}> = ({
  initialCodeState,
  roomId,
  roomName: initialRoomName,
  userName,
  type,
}) => {
  // States
  const [roomName, setRoomName] = useState<string>(initialRoomName);
  const { realTimeRef, userId } = useRealTime(roomId, userName, (newName) =>
    setRoomName(newName)
  );
  const { myVideo, partnerVideo, host } = useWebRTC(realTimeRef);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const { dispatchCode } = useCodeStore();
  const { x, y } = useMousePosition();

  const sendMousePosition = throttle(() => {
    realTimeRef.current?.send({
      type: "broadcast",
      event: EVENT.MOUSE_UPDATE,
      payload: { x, y, userName, userId },
    });
  }, 200);

  useEffect(() => {
    dispatchCode({
      type: "UPDATE_CODE",
      payload: initialCodeState,
    });
  }, []);

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
            />
            <Split className="flex flex-row h-screen p-12 cursor-grab bg-gradient-to-b from-black via-slate-900 to-slate-800">
              <div className="w-full h-full bg-black rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
                <MonacoEditor realTimeRef={realTimeRef} name={userName} />
              </div>
              <div className="w-full bg-white rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
                <NotionLikeEditor realTimeRef={realTimeRef} />
              </div>
            </Split>
            <OutputConsole />
            {/* <AudioVideoCall
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            myVideo={myVideo}
            partnerVideo={partnerVideo}
          /> */}
          </>
        ) : (
          <>
            <SackpackEditor />
            {/* <MySandpack /> */}
          </>
        )}
      </main>

      <HintsSolutionModal />
    </>
  );
};

export default CodingPage;
