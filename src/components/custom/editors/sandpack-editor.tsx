import { Button } from "@/components/ui/button";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";
import {
  Dispatch,
  FC,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import throttle from "lodash.throttle";
import { EVENT } from "@/lib/constant";
import { RealtimeChannel } from "@supabase/supabase-js";

// TODO: Real-time cursors? Refer to https://sandpack.codesandbox.io/docs/advanced-usage/components
// TODO: Try integration with Monaco https://sandpack.codesandbox.io/docs/guides/integrate-monaco-editor

type SandpackEditorProps = {
  finished: boolean;
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
  isLocalChange: boolean;
  setIsLocalChange: Dispatch<SetStateAction<boolean>>;
};

const CodeEditor = ({
  finished,
  realTimeRef,
  isLocalChange,
  setIsLocalChange,
}: SandpackEditorProps) => {
  const { code } = useActiveCode();
  const initialMountRef = useRef(true);

  useEffect(() => {
    if (initialMountRef.current) {
      initialMountRef.current = false;
    } else if (isLocalChange) {
      const broadcastCodeUpdate = throttle(() => {
        realTimeRef.current?.send({
          type: "broadcast",
          event: EVENT.CODE_UPDATE,
          payload: { value: code },
        });
      }, 300);

      broadcastCodeUpdate();
    } else {
      setIsLocalChange(true);
    }
  }, [code]);

  return (
    <>
      <Button
        className="fixed z-40 shadow bottom-6 right-6 shadow-white inter-font"
        onClick={() => {}}
      >
        Placeholder
      </Button>

      {/* <SandpackFileExplorer style={{ height: "300px" }} /> */}
      <SandpackCodeEditor
        showTabs
        readOnly={finished}
        showRunButton
        showInlineErrors
        showLineNumbers
        wrapContent
        style={{ height: "50%" }}
      />

      <div className="flex h-1/2">
        <SandpackPreview
          actionsChildren={
            <button onClick={() => window.alert("Bug reported!")}>
              Report bug
            </button>
          }
          style={{ width: "50%" }}
        />
        <SandpackConsole
          showHeader
          showSetupProgress
          showSyntaxError
          style={{ overflowY: "auto", width: "50%" }}
        />
      </div>
    </>
  );
};

const SackpackEditor: FC<SandpackEditorProps> = (props) => (
  <SandpackLayout>
    <CodeEditor {...props} />
  </SandpackLayout>
);

export default SackpackEditor;
