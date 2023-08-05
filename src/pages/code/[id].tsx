import Cursor from "@/components/custom/cursor";
import MonacoEditor from "@/components/custom/editors/monaco-editor";
import ExcalidrawEditor from "@/components/custom/editors/excalidraw-editor";
import NotionLikeEditor from "@/components/custom/editors/notion-like-editor";
import OutputConsole from "@/components/custom/output-console";
import UtilityBar from "@/components/custom/utility-bar";
import { useCodeContext } from "@/context/code-context";
import useMousePosition from "@/hooks/use-mouse-position";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Split from "react-split";
import useRealTime from "@/hooks/use-real-time";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseClient = createPagesServerClient<Database>(ctx);

  const { id: roomId, userName } = ctx.query;
  const { data, error } = await supabaseClient
    .from("interview_rooms")
    .select("*")
    .eq("room_id", roomId);

  if (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { code_state, room_id, name } = data[0];

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
  const { dispatchCode } = useCodeContext();
  const { x, y } = useMousePosition();

  // Refs
  const { realTimeRef } = useRealTime(roomId, userName);

  // Utils
  const router = useRouter();

  // const sendMousePosition = throttle(() => {
  //   broadcastRef.current
  //     ?.send({
  //       type: "broadcast",
  //       event: EVENT.MOUSE_UPDATE,
  //       payload: { x, y },
  //     })
  //     .catch(() => {});
  // }, 300);

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
        className="flex flex-col w-full"
        // onMouseMove={() => {
        //   sendMousePosition();
        // }}
      >
        {/* <Cursor x={x} y={y} /> */}
        <UtilityBar realTimeRef={realTimeRef} roomName={roomName} />
        <Split className="flex flex-row h-screen cursor-grab bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
          <div className="bg-black cursor-auto">
            <MonacoEditor realTimeRef={realTimeRef} />
          </div>
          <div className="bg-white cursor-auto">
            <NotionLikeEditor realTimeRef={realTimeRef} />
          </div>
        </Split>
        <OutputConsole />
      </main>
    </>
  );
};

export default CodingPage;
