import { Button } from "@/components/ui/button";
import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import { Position, editor, Range } from "monaco-editor";
import { FC, MutableRefObject, useCallback, useEffect, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { EVENT } from "@/lib/constant";
import { JetBrains_Mono } from "next/font/google";
import throttle from "lodash.throttle";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useCodeStore } from "@/stores/code-store";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] });

const MonacoEditor: FC<{
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
  name: string;
  finished: boolean;
}> = ({ realTimeRef, name, finished }) => {
  // Code state
  const { codeState, dispatchCode, dispatchConsole } = useCodeStore(
    (state) => ({
      dispatchCode: state.dispatchCode,
      dispatchConsole: state.dispatchConsole,
      codeState: state.codeState,
    })
  );

  // Editor refs
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null); // for editor text
  const monacoRef = useRef<Monaco | null>(null); // for editor instance

  // Editor state changes
  const handleEditorChange = useCallback(
    (value: string | undefined, event: editor.IModelContentChangedEvent) => {
      if (value === undefined) return;

      dispatchCode({
        type: "UPDATE_CODE",
        payload: value,
      });

      const broadcastCodeUpdate = throttle(() => {
        realTimeRef.current?.send({
          type: "broadcast",
          event: EVENT.CODE_UPDATE,
          payload: {
            message: value,
          },
        });
      });

      broadcastCodeUpdate();
    },
    [codeState.code]
  );

  // Refer to: https://www.npmjs.com/package/@monaco-editor/react
  return (
    <>
      <Button
        className="fixed z-40 shadow bottom-6 right-6 shadow-white"
        onClick={() =>
          dispatchConsole({
            type: "SET_CONSOLE_VISIBLE",
            payload: true,
          })
        }
      >
        Show console
      </Button>
      <Editor
        className={cn(
          "m-0 overflow-hidden font-jetbrains p-0 overflow-y-auto",
          finished ? "hover:cursor-not-allowed" : "",
          jetBrainsMono.className
        )}
        height="100%"
        loading={
          <div>
            Loading Editor...
            <Loader2 className="animate-spin" />
          </div>
        }
        theme={"vs-dark"}
        // path={fileName}
        // language={files[fileName].language}
        // value={value[fileName]}
        defaultLanguage={"typescript"}
        language={codeState.language}
        value={codeState.code}
        options={{
          // fontLigatures: true,
          selectOnLineNumbers: true,
          cursorSmoothCaretAnimation: "on",
          cursorBlinking: "smooth",
          fontSize: 15,
          readOnly: finished,
        }}
        onChange={handleEditorChange}
        onMount={(editor, monaco) => {
          if (editorRef) {
            editorRef.current = editor;
          }

          monacoRef.current = monaco;
        }}
        beforeMount={(monaco: Monaco) => {
          monaco.languages.typescript.javascriptDefaults.setEagerModelSync(
            true
          );
        }}
        onValidate={(markers: editor.IMarker[]) => {
          // model markers
          // markers.forEach((marker) => console.log("onValidate:", marker.message));
        }}
      />
      <div className="hidden bg-white ce-toolbar__actions ce-toolbar__actions--opened ce-inline-toolbar__toggler-and-button-wrapper ce-conversion-toolbar ce-conversion-toolbar--showed ce-paragraph" />
    </>
  );
};

export default MonacoEditor;
