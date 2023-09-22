import React, { useState, useEffect, useRef } from "react";
import type { editor } from "monaco-editor";

import Editor from "@monaco-editor/react";
import files from "./files";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiTypescript, SiPython, SiCsharp } from "react-icons/si";

export default function MultiModelEditor() {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [fileName, setFileName] = useState("script.js");

  const file = files[fileName];

  useEffect(() => {
    editorRef.current?.focus();
  }, [file.name]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setFileName(event.target.value);

  return (
    <>
      <strong>{fileName}</strong>

      <div>
        <button
          className="p-2 bg-blue-300 rounded-lg"
          disabled={fileName === "script.js"}
          onClick={() => setFileName("script.js")}
        >
          script.js
        </button>
        <button
          className="p-2 bg-blue-300 rounded-lg"
          disabled={fileName === "style.css"}
          onClick={() => setFileName("style.css")}
        >
          style.css
        </button>
        <button
          className="p-2 bg-blue-300 rounded-lg"
          disabled={fileName === "index.html"}
          onClick={() => setFileName("index.html")}
        >
          index.html
        </button>
      </div>

      <div>
        <label htmlFor="langs">Choose a lang:</label>
        <select
          name="langs"
          id="langs"
          onChange={handleLanguageChange}
          value={fileName}
        >
          <option value="script.js">js</option>
          <option value="style.css">css</option>
          <option value="index.html">html</option>
        </select>
      </div>

      {/* Somewhat working code with Radix-Select */}
      {/* <Select
        value={file.value}
        onValueChange={(newLanguage: string) =>
          setFileName("style.css")
        }
      >
        <SelectTrigger className="w-[130px] md:w-[180px] bg-slate-900 text-white">
          <SelectValue placeholder="Pick a language..." />
        </SelectTrigger>
        <SelectContent className="text-white shadow-md bg-gradient-to-b from-black to-slate-700 shadow-white">
          {[
            { language: "TypeScript", icon: <SiTypescript /> },
            { language: "Python", icon: <SiPython /> },
            { language: "C#", icon: <SiCsharp /> },
          ].map(({ language, icon }) => (
            <SelectItem
              className="cursor-pointer"
              key={language}
              value={language.toLowerCase()}
            >
              <div className="flex flex-row gap-3">
                <div>{icon}</div>
                <div>{language}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}

      <Editor
        height="80vh"
        theme="vs-dark"
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
        onMount={(editor) => (editorRef.current = editor)}
      />
    </>
  );
}
