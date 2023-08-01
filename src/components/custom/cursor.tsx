import useMousePosition from "@/hooks/use-mouse-position";
import { RealtimeChannel } from "@supabase/supabase-js";
import throttle from "lodash.throttle";
import { MousePointer2 } from "lucide-react";
import { FC, MutableRefObject } from "react";

const Cursor: FC<{
  x?: number;
  y?: number;
}> = ({ x, y }) => {
  return (
    <>
      <MousePointer2
        className="z-50 rounded-full shadow-xl text-emerald-500 shadow-emerald-300 hue-rotate-180"
        style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
      />
    </>
  );
};

export default Cursor;
