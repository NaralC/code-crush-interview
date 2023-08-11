import AudioVideoCall from "@/components/custom/audio-video-call";
import SackpackEditor from "@/components/custom/editors/sandpack-editor";
import MySandpack from "@/components/custom/editors/sandpack-monaco-test";
import useRealTime from "@/hooks/use-real-time";
import { cn } from "@/lib/utils";
import { NextPage } from "next";

const TestPage: NextPage = () => {

  return (
    <main
      className={cn(
        "flex flex-col items-center justify-center min-h-screen p-24 transition-all duration-200 delay-100 bg-black "
      )}
    >
      {/* <SackpackEditor />
      <ExcalidrawEditor /> */}
      {/* <MySandpack /> */}
    </main>
  );
};

export default TestPage;
