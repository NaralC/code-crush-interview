/* eslint-disable react-hooks/rules-of-hooks */
import Cursor from "@/components/custom/cursor";
import CodeEditor from "@/components/custom/editors/code-editor";
import ExcalidrawEditor from "@/components/custom/editors/excalidraw-editor";
import SharedNoteEditor from "@/components/custom/editors/shared-note-editor";
import OutputConsole from "@/components/custom/output-console";
import UtilityBar from "@/components/custom/utility-bar";
import { useCodeContext } from "@/context/code-context";
import useBroadcast from "@/hooks/real-time/use-broadcast";
import usePostgresChanges from "@/hooks/real-time/use-postgres-changes";
import usePresence from "@/hooks/real-time/use-presence";
import useMousePosition from "@/hooks/use-mouse-position";
import { EVENT } from "@/lib/constant";
import { Excalidraw } from "@excalidraw/excalidraw";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import throttle from "lodash.throttle";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import Draggable from "react-draggable";
import Split from "react-split";

const ROOM_ID = "948u5";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseClient = createPagesServerClient<Database>(ctx);

  const { id: roomId } = ctx.query;
  const { data, error } = await supabaseClient
    .from("interview_rooms")
    .select("*")
    .eq("room_id", roomId);

  console.log(error);

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
    },
  };
};

const CodingPage: NextPage<{
  initialCodeState: string;
  roomId: string;
  roomName: string;
}> = ({ initialCodeState, roomId, roomName }) => {
  // Real-time refs
  const broadcastRef = useBroadcast(roomId);
  // const presenceRef = usePresence(roomId);
  const { schemaChangesRef, tableDBChangesRef, tableFilterChangesRef } =
    usePostgresChanges(roomId);

  // States
  const { updateCode } = useCodeContext();
  const { x, y } = useMousePosition();

  const sendMousePosition = throttle(() => {
    broadcastRef.current
      ?.send({
        type: "broadcast",
        event: EVENT.MOUSE_UPDATE,
        payload: { x, y },
      })
      .catch(() => {});
  }, 300);

  useEffect(() => {
    updateCode(initialCodeState);
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
        <UtilityBar roomName={roomName} />
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
