/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { FC, MutableRefObject, useCallback, useEffect, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useCodeContext } from "@/context/code-context";
import { useUsersList } from "@/context/users-list-context";
import { EVENT } from "@/lib/constant";
import { JetBrains_Mono } from "next/font/google";
import throttle from "lodash.throttle";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] });

const MonacoEditor: FC<{
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
}> = ({ realTimeRef }) => {
  // Code state
  const { codeState, dispatchCode, dispatchConsole } = useCodeContext();
  const { usersList } = useUsersList();

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

      const sendCodeToOtherClients = throttle(() => {
        realTimeRef.current?.send({
          type: "broadcast",
          event: EVENT.CODE_UPDATE,
          payload: {
            message: value,
          },
        });
      });

      sendCodeToOtherClients();
    },

    [codeState.code]
  );

  // editorRef.current?.getPosition()
  // editorRef.current?.getSelections()
  // editorRef.current?.onDidChangeCursorPosition();
  // editorRef.current?.onDidChangeCursorSelection();

  // useEffect(() => {
  //   setInterval(() => {
  //     console.log(editorRef.current?.getPosition())
  //     console.log(editorRef.current?.getSelections())
  //   }, 2000)
  // }, [editorRef.current]); 


  // Refer to: https://www.npmjs.com/package/@monaco-editor/react
  return (
    <>
      {/* <Button
        variant="outline"
        className="fixed inset-x-0 z-50 left-6 bottom-6 w-28"
        onClick={() => {
          alert(editorRef.current?.getValue());
        }}
      >
        Show value
      </Button>
      <Button
        variant="outline"
        className="fixed inset-x-0 z-50 left-36 bottom-6 w-28"
        onClick={() => {
          alert(JSON.stringify(usersList));
        }}
      >
        Show users list
      </Button>
      <Button
        variant="outline"
        className="fixed inset-x-0 z-50 left-[265px] bottom-6 w-28"
        onClick={() =>
          dispatchConsole({
            type: "SET_CONSOLE_VISIBLE",
            payload: true,
          })
        }
      >
        Show output tab
      </Button> */}
      <Editor
        className={cn("m-0 overflow-hidden font-jetbrains p-0 overflow-y-auto", jetBrainsMono.className)}
        height="100%"
        loading={<div>Loading Editor...
          <Loader2 className="animate-spin" />
        </div>}
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
          fontSize: 15
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
