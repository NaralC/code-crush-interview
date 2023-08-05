import SackpackEditor from "@/components/custom/editors/sandpack-editor";
import { cn } from "@/lib/utils";;
import { NextPage } from "next";

const TestPage: NextPage = () => {
  return (
    <main
      className={cn(
        "flex flex-col items-center justify-center min-h-screen p-24 transition-all duration-200 delay-100 xl:container"
      )}
    >
      <SackpackEditor />
    </main>
  );
};

export default TestPage;
