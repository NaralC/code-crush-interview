import { Sandpack } from "@codesandbox/sandpack-react";
import { FC } from "react";

const SackpackEditor: FC = () => {

  return (
    <div className="border-2 shadow-lg border-zinc-500/30 shadow-white">
      <Sandpack theme="dark" template="react-ts"  />
    </div>
  );
};

export default SackpackEditor;
