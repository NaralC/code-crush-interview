/* eslint-disable react-hooks/rules-of-hooks */
import CodeEditor from "@/components/custom/editors/code-editor";
import SharedNoteEditor from "@/components/custom/editors/shared-note-editor";
import UtilityBar from "@/components/custom/utility-bar";
import { Button } from "@/components/ui/button";
import useSharedState from "@/context/shared-state";
import useBroadcast from "@/hooks/real-time/use-broadcast";
import usePostgresChanges from "@/hooks/real-time/use-postgres-changes";
import usePresence from "@/hooks/real-time/use-presence";
import { toast, useToast } from "@/hooks/use-toast";
import supabaseClient from "@/lib/supa-client";
import { faker } from "@faker-js/faker";
import { NextPage } from "next";
import Head from "next/head";
import { useRef, useEffect } from "react";
import Split from "react-split";

const ROOM_ID = "948u5";

const CodingPage: NextPage = () => {
  // Real-time refs
  const broadcastRef = useBroadcast(ROOM_ID);
  const presenceRef = usePresence(ROOM_ID);
  const { schemaChangesRef, tableDBChangesRef, tableFilterChangesRef } =
    usePostgresChanges(ROOM_ID);

  return (
    <>
      <Head>
        <title>Interview Time!</title>
        <meta name="Code Crush" content="Code Crush" />
      </Head>
      <UtilityBar />
      <Button
        onClick={() => {
          broadcastRef.current?.send({
            type: "broadcast",
            event: "click",
            payload: {
              message: "someone just clicked lmao",
            },
          });
        }}
      >
        Test Broadcast
      </Button>
      <main className="flex flex-col w-full">
        <Split className="flex flex-row h-screen cursor-grab bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
          <div className="cursor-auto bg-zinc-500">
            <CodeEditor />
          </div>
          <div className="cursor-auto bg-slate-500">
            <SharedNoteEditor />
          </div>
        </Split>
      </main>
    </>
  );
};

export default CodingPage;
