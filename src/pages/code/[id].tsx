/* eslint-disable react-hooks/rules-of-hooks */
import CodeEditor from "@/components/custom/editors/code-editor";
import SharedNoteEditor from "@/components/custom/editors/shared-note-editor";
import UtilityBar from "@/components/custom/utility-bar";
import useBroadcast from "@/hooks/real-time/use-broadcast";
import usePostgresChanges from "@/hooks/real-time/use-postgres-changes";
import usePresence from "@/hooks/real-time/use-presence";
import { NextPage } from "next";
import Head from "next/head";
import Split from "react-split";

const ROOM_ID = "948u5";

const CodingPage: NextPage = () => {
  // Real-time refs
  const broadcastRef = useBroadcast(ROOM_ID);
  // const presenceRef = usePresence(ROOM_ID);
  // const { schemaChangesRef, tableDBChangesRef, tableFilterChangesRef } =
  //   usePostgresChanges(ROOM_ID);

  return (
    <>
      <Head>
        <title>Interview Time!</title>
        <meta name="Code Crush" content="Code Crush" />
      </Head>
      <UtilityBar />
      <main className="flex flex-col w-full">
        <Split className="flex flex-row h-screen cursor-grab bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
          <div className="cursor-auto bg-zinc-500">
            <CodeEditor realTimeRef={broadcastRef} />
          </div>
          <div className="cursor-auto bg-slate-500">
            <SharedNoteEditor realTimeRef={broadcastRef} />
          </div>
        </Split>
      </main>
    </>
  );
};

export default CodingPage;
