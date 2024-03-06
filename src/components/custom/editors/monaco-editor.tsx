import { Button } from "@/components/ui/button";
import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import { Position, editor, Range } from "monaco-editor";
import { FC, MutableRefObject, useCallback, useEffect, useRef } from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import { EVENT } from "@/lib/constant";
import throttle from "lodash.throttle";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useCodeStore } from "@/stores/code-store";
import { useUsersStore } from "@/stores/users-store";

type MonacoEditorProps = {
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
  name: string;
  finished: boolean;
}

const MonacoEditor: FC<MonacoEditorProps> = ({ realTimeRef, name, finished }) => {
  // Code state
  const { codeState, dispatchCode, dispatchConsole, latestLanguageRef } = useCodeStore();

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

      const payload: CodeUpdate = {
        language: latestLanguageRef.current!,
        value,
      };

      const broadcastCodeUpdate = throttle(() => {
        realTimeRef.current?.send({
          type: "broadcast",
          event: EVENT.CODE_UPDATE,
          payload
        });
      });

      broadcastCodeUpdate();
    },
    [codeState.code]
  );

  const { role } = useUsersStore();

  // TODO: Make it autofocus on monaco when a language is changed
  // Refer to: https://www.npmjs.com/package/@monaco-editor/react
  return (
    <>
      <Button
        className={cn("fixed z-40 shadow bottom-6 shadow-white", role === "interviewee" ? "right-40" : "right-10")}
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
          "m-0 overflow-hidden font-jetbrains p-0 overflow-y-auto font-jetbrains",
          finished ? "hover:cursor-not-allowed" : ""
        )}
        height="100%"
        loading={
          <div>
            Loading Editor...
            <Loader2 className="animate-spin" />
          </div>
        }
        theme={"vs-dark"}
        defaultLanguage={"typescript"}
        language={codeState.language}
        value={
          codeState.code[codeState.language]
            ? codeState.code[codeState.language].value
            : ""
        }
        options={{
          fontFamily: "JetBrains Mono", // Controls the editor font
          fontLigatures: true,
          selectOnLineNumbers: true,
          cursorSmoothCaretAnimation: "on",
          cursorBlinking: "smooth",
          fontSize: 14,
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
