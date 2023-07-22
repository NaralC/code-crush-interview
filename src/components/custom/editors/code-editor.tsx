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
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useCodeState from "@/context/code-state";

const CodeEditor: FC = () => {
  // Code state
  const { code, language, setCode, setLanguage } = useCodeState();

  // Editor refs
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null); // for editor text
  const monacoRef = useRef<Monaco | null>(null); // for editor instance

  // Mutations
  const { isLoading, mutate: saveCodeToDB } = useMutation({
    mutationFn: async (code: any) => {
      const response = await fetch("/api/db/save-code", {
        method: "PATCH",
        body: code,
      });

      if (!response.ok) throw new Error("Could not save code to DB");

      return response.json();
    },
    onError: (error) => {
      toast.error((error as Error).message);
    },
    onSuccess: () => toast.success("Code saved to DB"),
  });

  // Editor state changes
  const handleEditorChange = useCallback(
    (value: string | undefined, event: editor.IModelContentChangedEvent) => {
      if (value === undefined) return;

      setCode(value);
      saveCodeToDB(value);
    },
    [code]
  );

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    if (editorRef) {
      editorRef.current = editor;
    }

    monacoRef.current = monaco;
  };

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
      <Editor
        className="p-0 m-0 overflow-hidden"
        height="100vh"
        loading={<div>Loading Editor...</div>}
        theme={"vs-dark"}
        // path={fileName}
        // language={files[fileName].language}
        // value={value[fileName]}
        defaultLanguage={"typescript"}
        language={language}
        defaultValue={`
        type Person = {
          fullName: string;
          age: number;
          height: number;
          weight: number;
        }
      
        const Peter: Person = {
          fullName: "Peter Custard",
          age: 5,
          height: 162,
          weight: 48
        }
        `}
        value={code}
        options={{
          // fontFamily: "Courier New",
          fontLigatures: true,
          selectOnLineNumbers: true,
        }}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
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
    </div>
  );
};

export default CodeEditor;
