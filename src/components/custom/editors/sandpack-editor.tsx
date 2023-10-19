import { Button } from "@/components/ui/button";
import {
  Sandpack,
  SandpackCodeEditor,
  SandpackConsole,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { FC } from "react";

const reactTailwindStartingCode = {
  "/App.tsx": {
    active: true,
    code: `export default function Example() {
      return (
      <div className="bg-gray-50">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block">Ready to dive in?</span>
          <span className="block text-indigo-600">Start your free trial today.</span>
        </h2>
        <div className="flex mt-8 lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Get started
            </a>
          </div>
          <div className="inline-flex ml-3 rounded-md shadow">
            <a
              href="#"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-indigo-600 bg-white border border-transparent rounded-md hover:bg-indigo-50"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
      </div>
      )
      }`,
  },
};

const visibleFilesByFramework = {
  "react-ts": ["App.tsx", "styles.css", "/public/index.html"],
  "vue-ts": ["/src/App.vue", "/src/styles.css"],
  angular: ["/src/app/app.component.html", "/src/app/app.component.css", "/src/app/app.component.ts"],
};

// TODO: Real-time cursors? Refer to https://sandpack.codesandbox.io/docs/advanced-usage/components
// TODO: Try integration with Monaco https://sandpack.codesandbox.io/docs/guides/integrate-monaco-editor
// TODO: Implement real-time stuff

const CodeEditor = ({ finished }: { finished: boolean }) => {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  return (
    <>
      {/* <pre>{code}</pre> */}
      <Button
        className="fixed z-40 shadow bottom-6 right-6 shadow-white inter-font"
        onClick={() => {
          updateCode("yo");
        }}
      >
        Placeholder
      </Button>

      {/* <SandpackFileExplorer style={{ height: "300px" }} /> */}
      <SandpackCodeEditor
        showTabs
        readOnly={finished}
        showRunButton
        showInlineErrors
        showLineNumbers
        wrapContent
        style={{ height: "50%" }}
      />

      <div className="flex h-1/2">
        <SandpackPreview
          actionsChildren={
            <button onClick={() => window.alert("Bug reported!")}>
              Report bug
            </button>
          }
        />
        <SandpackConsole showHeader showSetupProgress showSyntaxError />
      </div>
    </>
  );
};

const SackpackEditor: FC<{
  template: "react-ts" | "vue-ts" | "angular";
  finished: boolean;
}> = ({ template, finished }) => {
  return (
    <SandpackProvider
      // files={reactTailwindStartingCode}
      template={template}
      theme={atomDark}
      options={{
        externalResources: ["https://cdn.tailwindcss.com"],
        visibleFiles: visibleFilesByFramework[template],
        classes: {
          "sp-layout": "sandpack-custom-layout",
          "sp-stack": "sandpack-custom-stack",
        },
      }}
      style={{ height: "100%" }}
    >
      <SandpackLayout>
        <CodeEditor finished={finished} />
      </SandpackLayout>
    </SandpackProvider>
  );
};

export default SackpackEditor;
