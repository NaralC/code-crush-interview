import { FC, Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { useCodeContext } from "@/context/code-context";
import { Expand, PictureInPicture2, X } from "lucide-react";
import Draggable from "react-draggable"; // The default
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const OutputConsole: FC = () => {
  const { consoleIsVisible, setConsoleIsVisible } = useCodeContext();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isDraggable, setIsDraggable] = useState<boolean>(false);

  return (
    <Transition
      as={Fragment}
      show={consoleIsVisible}
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
              "fixed inset-x-0 bottom-0 z-50 text-white bg-gray-900 border-t-2 border-zinc-50 ring-1 ring-zinc-500 shadow-white rounded-md max-h-fit transition-transform duration-100 w-72",
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
              </div>
            </div>
            <div className="px-4 py-2 overflow-y-auto">
              Output content goes here...
            </div>
          </div>
        </Draggable>
      ) : (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 text-white bg-gray-900 border-t-2 border-zinc-50 ring-1 ring-zinc-500 shadow-white rounded-t-md max-h-fit transition-transform duration-100",
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
                onClick={() => setConsoleIsVisible((prev) => !prev)}
                className="focus:outline-none"
                variant="ghost"
                size="closeDialog"
              >
                <X />
              </Button>
            </div>
          </div>
          <div className="px-4 py-2 overflow-y-auto">
            Output content goes here...
          </div>
        </div>
      )}
    </Transition>
  );
};

export default OutputConsole;
