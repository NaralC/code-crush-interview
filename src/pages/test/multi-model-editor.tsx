import React, { useState, useEffect, useRef } from "react";
import type { editor } from "monaco-editor";
import Editor from "@monaco-editor/react";

type CodeState = Record<string, { value: string }>;

const initialState: CodeState = {
  javascript: {
    value: `
  console.log('This is JS');
`,
  },
  css: {
    value: `
    * {
      margin: 0;
    }
  `,
  },
  html: {
    value: `
    <!DOCTYPE html>
    <html lang="en">
    </html>
  `,
  },
};

export default function MultiModelEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [codeState, setCodeState] = useState<CodeState>(initialState);
  const [language, setFileName] = useState<string>(
    Object.keys(initialState)[0]
  );

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
          <option value="javascript">javascript</option>
          <option value="css">css</option>
          <option value="html">html</option>
        </select>
      </div>

      <Editor
        height="80vh"
        theme="vs-dark"
        language={language}
        value={codeState[language].value}
        onMount={(editor) => (editorRef.current = editor)}
        onChange={(value, _) => {
          setCodeState((prev) => ({
            ...prev,
            [language]: {
              value: value!,
            },
          }));
        }}
      />
    </>
  );
}
