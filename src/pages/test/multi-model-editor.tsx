import React, { useState, useEffect, useRef } from "react";
import type { editor } from "monaco-editor";
import Editor from "@monaco-editor/react";

type CodeState = {
  [fileName: string]: {
    name: string;
    language: string;
    value: string;
  };
};

const initialState: CodeState = {
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: `
    console.log('This is JS');
  `
  },
  "style.css": {
    name: "style.css",
    language: "css",
    value: `
    * {
      margin: 0;
    }
  `
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: `
    <!DOCTYPE html>
    <html lang="en">
    </html>
  `
  }
};

export default function MultiModelEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [codeState, setCodeState] = useState<CodeState>(initialState)
  const [language, setFileName] = useState<string>(Object.keys(initialState)[0]);

  // This is static
  const file = codeState[language];

  useEffect(() => editorRef.current?.focus(), [file.name]);

  return (
    <>
      <strong>{language}</strong>
      <div>{JSON.stringify(codeState)}</div>

      <div>
        <label htmlFor="langs">Choose a lang:</label>
        <select
          name="langs"
          id="langs"
          onChange={(e) => setFileName(e.target.value)}
          value={language}
        >
          <option value="script.js">js</option>
          <option value="style.css">css</option>
          <option value="index.html">html</option>
        </select>
      </div>

      <Editor
        height="80vh"
        theme="vs-dark"
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
        onMount={(editor) => (editorRef.current = editor)}
        onChange={(value, _) => {
          setCodeState(prev => ({
            ...prev,
            [language]: {
              language: file.language,
              name: file.name,
              value: value!
            }
          }))
        }}
      />
    </>
  );
}
