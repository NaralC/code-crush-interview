/* eslint-disable react-hooks/rules-of-hooks */
import Cursor from "@/components/custom/cursor";
import CodeEditor from "@/components/custom/editors/code-editor";
import ExcalidrawEditor from "@/components/custom/editors/excalidraw-editor";
import SharedNoteEditor from "@/components/custom/editors/shared-note-editor";
import OutputConsole from "@/components/custom/output-console";
import UtilityBar from "@/components/custom/utility-bar";
import { Button } from "@/components/ui/button";
import { useCodeContext } from "@/context/code-context";
import useBroadcast from "@/hooks/real-time/use-broadcast";
import usePostgresChanges from "@/hooks/real-time/use-postgres-changes";
import usePresence from "@/hooks/real-time/use-presence";
import useMousePosition from "@/hooks/use-mouse-position";
import { EVENT } from "@/lib/constant";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import throttle from "lodash.throttle";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { FaReact } from "react-icons/fa";
import Split from "react-split";

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
  const [isSaved, setIsSaved] = useState(false);
  // Real-time refs
  const broadcastRef = useBroadcast(roomId, userName);
  // const presenceRef = usePresence(roomId, userName);
  // const { schemaChangesRef, tableDBChangesRef, tableFilterChangesRef } =
  // usePostgresChanges(roomId);

  // States
  const { dispatchCode } = useCodeContext();
  const { x, y } = useMousePosition();

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
      payload: initialCodeState
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
        <UtilityBar realTimeRef={broadcastRef} roomName={roomName} />
        <Split className="flex flex-row h-screen cursor-grab bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
          <div className="bg-black cursor-auto">
            <CodeEditor realTimeRef={broadcastRef} />
          </div>
          <div className="cursor-auto bg-slate-500">
            <SharedNoteEditor realTimeRef={broadcastRef} />
          </div>
        </Split>
        <OutputConsole />
      </main>
    </>
  );
};

export default CodingPage;
