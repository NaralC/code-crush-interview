import CodeEditor from "@/components/custom/editors/code-editor";
import SharedNoteEditor from "@/components/custom/editors/shared-note-editor";
import { NextPage } from "next";
import Head from "next/head";
import Split from "react-split";

const CodingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Interview Time!</title>
        <meta name="Code Crush" content="Code Crush" />
      </Head>
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
