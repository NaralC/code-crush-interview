import { Button } from "@/components/ui/button";
import { Sandpack } from "@codesandbox/sandpack-react";
import { atomDark, monokaiPro } from "@codesandbox/sandpack-themes";
import { FC } from "react";

const SackpackEditor: FC<{
  template: "vite-react-ts" | "vite-vue-ts" | "angular";
  finished: boolean;
}> = ({ template, finished }) => {
  // TODO: Try integrateion with Monaco https://sandpack.codesandbox.io/docs/guides/integrate-monaco-editor
  // TODO: Implement real-time stuff
  return (
    <>
      <Button
        className="fixed z-40 shadow bottom-6 right-6 shadow-white"
        onClick={() => {}}
      >
        Placeholder
      </Button>
      <Sandpack
        theme={atomDark}
        template={template}
        options={{
          layout: "preview",
          showConsoleButton: true,
          showNavigator: true,
          readOnly: finished,
          showInlineErrors: true,
          showLineNumbers: true,
          wrapContent: true,
          recompileMode: "delayed",
          recompileDelay: 500,
          resizablePanels: true,
          classes: {
            "sp-layout": "sandpack-custom-layout",
            "sp-stack": "sandpack-custom-stack"
          },
        }}
      />
    </>
  );
};

export default SackpackEditor;
