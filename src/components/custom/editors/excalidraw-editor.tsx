import { FC, useEffect, useState } from "react";

const ExcalidrawEditor: FC = () => {
  const [Excalidraw, setExcalidraw] = useState(null);
  useEffect(() => {
    import("@excalidraw/excalidraw").then((comp) =>
      setExcalidraw(comp.Excalidraw)
    );
  }, []);
  return <>{Excalidraw && <Excalidraw />}</>;
};

export default ExcalidrawEditor;
