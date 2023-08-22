import { FC, Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { Expand, PictureInPicture2, X } from "lucide-react";
import Draggable from "react-draggable"; // The default
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useCodeStore } from "@/stores/code-store";

const OutputConsole: FC = () => {
  const { consoleState, dispatchConsole } = useCodeStore((state) => ({
    dispatchConsole: state.dispatchConsole,
    consoleState: state.consoleState,
  }));
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDraggable, setIsDraggable] = useState<boolean>(false);

  return (
    <Transition
      as={Fragment}
      show={consoleState.isConsoleVisible}
      enter="transition-all duration-400 ease-out"
      enterFrom="opacity-90 transform translate-y-full"
      enterTo="opacity-100 transform translate-y-0"
      leave="transition ease-in duration-400"
      leaveFrom="opacity-100 transform translate-y-0"
      leaveTo="opacity-90 transform translate-y-full"
    >
      {isDraggable ? (
        <Draggable bounds="parent">
          <div
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 text-white bg-stone-950 border-t-2 border-zinc-50 ring-1 ring-zinc-500 shadow-white rounded-md max-h-fit transition-transform duration-100",
              !isExpanded ? "h-36 w-64" : "h-64 w-80"
            )}
          >
            <div className="flex justify-between px-4 py-2 mt-2">
              <span className="font-bold">Console</span>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="p-[1px] focus:outline-none"
                  variant="ghost"
                  size="closeDialog"
                >
                  <Expand />
                </Button>
                <Button
                  onClick={() => setIsDraggable((prev) => !prev)}
                  className="p-[1px] focus:outline-none"
                  variant="ghost"
                  size="closeDialog"
                >
                  <PictureInPicture2 />
                </Button>
              </div>
            </div>
            <div className="px-4 py-2 overflow-y-auto">
              {consoleState.consoleOutput}
            </div>
          </div>
        </Draggable>
      ) : (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 text-white bg-stone-950 border-t-2 border-zinc-50 ring-1 ring-zinc-500 shadow-white rounded-t-md max-h-fit transition-transform duration-100",
            !isExpanded ? "h-40" : "h-[85vh]"
          )}
        >
          <div className="flex justify-between px-4 py-2 mt-2">
            <span className="font-bold">Console</span>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="p-[1px] focus:outline-none"
                variant="ghost"
                size="closeDialog"
              >
                <Expand />
              </Button>
              <Button
                onClick={() => setIsDraggable((prev) => !prev)}
                className="p-[1px] focus:outline-none"
                variant="ghost"
                size="closeDialog"
              >
                <PictureInPicture2 />
              </Button>
              <Button
                onClick={() =>
                  dispatchConsole({
                    type: "SET_CONSOLE_VISIBLE",
                    payload: false,
                  })
                }
                className="focus:outline-none"
                variant="ghost"
                size="closeDialog"
              >
                <X />
              </Button>
            </div>
          </div>
          <div className="px-4 py-2 overflow-y-auto">
            {consoleState.consoleOutput}
          </div>
        </div>
      )}
    </Transition>
  );
};

export default OutputConsole;