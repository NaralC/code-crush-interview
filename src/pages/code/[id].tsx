import Cursors from "@/components/custom/cursor";
import MonacoEditor from "@/components/custom/editors/monaco-editor";
import NotionLikeEditor from "@/components/custom/editors/notion-like-editor";
import OutputConsole from "@/components/custom/output-console";
import UtilityBar from "@/components/custom/utility-bar";
import useMousePosition from "@/hooks/use-mouse-position";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Split from "react-split";
import useRealTime from "@/hooks/use-real-time";
import throttle from "lodash.throttle";
import { EVENT } from "@/lib/constant";
import AudioVideoCall from "@/components/custom/audio-video-call";
import useWebRTC from "@/hooks/use-webrtc";
import { useCodeStore } from "@/stores/code-store";
import HintsSolutionModal from "@/components/custom/modals/hints-solution-modal";

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

  const { code_state, room_id, name, participants } = data[0];

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
    },
  };
};

const CodingPage: NextPage<{
  initialCodeState: string;
  roomId: string;
  roomName: string;
  userName: string;
}> = ({ initialCodeState, roomId, roomName, userName }) => {
  // States
  const { realTimeRef, userId } = useRealTime(roomId, userName);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const { dispatchCode } = useCodeStore();
  const { x, y } = useMousePosition();
  const { myVideo, partnerVideo, host } = useWebRTC(realTimeRef);

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
        <Cursors realTimeRef={realTimeRef} />
        <UtilityBar realTimeRef={realTimeRef} roomName={roomName} />
        <Split className="flex flex-col h-screen p-12 md:flex-row cursor-grab bg-gradient-to-b from-black via-slate-900 to-slate-800">
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
      </main>

      <HintsSolutionModal />
    </>
  );
};

export default CodingPage;
