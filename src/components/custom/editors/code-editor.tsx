import { Button } from "@/components/ui/button";
import { Editor, Monaco, OnMount } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { FC, useCallback, useEffect, useRef, useState } from "react";

const CodeEditor: FC = () => {
  // Code state
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<string>("typescript");

  // Refs
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null); // for editor text
  const monacoRef = useRef<Monaco | null>(null); // for editor instance

  const handleEditorChange = useCallback(
    (value: string | undefined, event: editor.IModelContentChangedEvent) => {
      if (value === undefined) return;

      setValue(value);
    },
    []
  );

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    if (editorRef) {
      editorRef.current = editor;
    }

    monacoRef.current = monaco;
  };

  const handleEditorWillMount = (monaco: Monaco) => {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };

  const handleEditorValidation = (markers: editor.IMarker[]) => {
    // model markers
    // markers.forEach((marker) => console.log("onValidate:", marker.message));
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
        value={value}
        options={{
          // fontFamily: "Courier New",
          fontLigatures: true,
          selectOnLineNumbers: true,
        }}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
        onValidate={handleEditorValidation}
      />
    </div>
  );
};

export default CodeEditor;
