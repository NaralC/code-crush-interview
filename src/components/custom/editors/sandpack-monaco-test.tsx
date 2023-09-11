import Editor from "@monaco-editor/react";
import {
  useActiveCode,
  SandpackStack,
  FileTabs,
  useSandpack,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
 
function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();
 
  return (
    <SandpackStack style={{ height: "100vh", margin: 0 }}>
      <FileTabs />
      <div style={{ flex: 1, paddingTop: 8, background: "#1e1e1e" }}>
        <Editor
          width="100%"
          height="100%"
          language="typescript"
          theme="vs-dark"
          key={sandpack.activeFile}
          defaultValue={code}
          onChange={(value) => updateCode(value || "")}
        />
      </div>
    </SandpackStack>
  );
}

export default function MySandpack() {
    return (
      <SandpackProvider template="react-ts" theme="dark">
        <SandpackLayout className="w-[85vw]">
          <MonacoEditor />
          <SandpackPreview style={{ height: "100vh" }} />
        </SandpackLayout>
      </SandpackProvider>
    );
  }