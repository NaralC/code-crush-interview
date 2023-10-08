import SackpackEditor from "@/components/custom/editors/sandpack-editor";
import UtilityBar from "@/components/custom/utility-bar";
import useRealTime from "@/hooks/use-real-time";
import { useCodeStore } from "@/stores/code-store";
import type { NextPage } from "next";
import React, { useEffect } from "react";

const FrontEndPage: NextPage = ({}) => {
  const { realTimeRef, userId } = useRealTime(
    "idk",
    "Johnny",
    (newName) => {},
    false,
    () => {}
  );
  const { codeState: { language } } = useCodeStore();

  useEffect(() => { console.log(language) }, [language])

  return (
    <main className="flex flex-col w-full h-screen">
      <UtilityBar
        realTimeRef={realTimeRef}
        roomName={"random-room-name"}
        roomId={"idk"}
        finished={false}
        type={"front_end"}
      />
      <div className="flex flex-col justify-center h-full px-5 bg-gradient-to-b from-black via-slate-900 to-slate-800">
        <SackpackEditor />
      </div>
    </main>
  );
};

export default FrontEndPage;
