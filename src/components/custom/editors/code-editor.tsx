/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/components/ui/button";
import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useCodeContext } from "@/context/code-context";
import { useUsersList } from "@/context/users-list-context";
import { EVENT } from "@/lib/constant";
import throttle from "lodash.throttle";

const CodeEditor: FC<{
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

  // Refer to: https://www.npmjs.com/package/@monaco-editor/react
  return (
    <div>
      <Button
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
      </Button>
      <Editor
        className="p-0 m-0 overflow-hidden"
        height="100vh"
        loading={<div>Loading Editor...</div>}
        theme={"vs-dark"}
        // path={fileName}
        // language={files[fileName].language}
        // value={value[fileName]}
        defaultLanguage={"typescript"}
        language={codeState.language}
        value={codeState.code}
        options={{
          // fontFamily: "Courier New",
          fontLigatures: true,
          selectOnLineNumbers: true,
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
      <div className="bg-white ce-toolbar__actions ce-toolbar__actions--opened ce-inline-toolbar__toggler-and-button-wrapper ce-conversion-toolbar ce-conversion-toolbar--showed ce-paragraph" />
    </div>
  );
};

export default CodeEditor;
