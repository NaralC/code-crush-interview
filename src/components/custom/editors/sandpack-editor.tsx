import { Sandpack } from "@codesandbox/sandpack-react";
import { FC } from "react";

const SackpackEditor: FC = () => {
  // Options to pick between React, Angular, Vue

  return (
    <div className="border-2 shadow-lg border-zinc-500/30 shadow-white">
      <Sandpack theme="dark" template="vite-react-ts"  />
    </div>
  );
};

export default SackpackEditor;
