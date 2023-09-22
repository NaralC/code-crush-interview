import { FC, Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import { ArrowUp01, BadgeCheck, Expand, MemoryStick, TimerReset, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useCodeStore } from "@/stores/code-store";

const OutputConsole: FC = () => {
  const { consoleState, dispatchConsole } = useCodeStore();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 text-white bg-stone-950 border-t-2 border-zinc-50 ring-1 ring-zinc-500 duration-700 shadow-white rounded-t-md max-h-fit transition-all overflow-y-auto",
          !isExpanded ? "h-56" : "h-[65vh]"
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
        <div className="px-4 py-2 overflow-x-auto">
          <div className="p-4 text-white bg-gray-800 rounded-lg">
            {!!consoleState.consoleOutput ? (
              <>
                <div className="flex items-center mb-2 space-x-1">
                  <MemoryStick />
                  <strong>Memory Used — </strong>
                  <div>{consoleState.consoleOutput.memory} KB</div>
                  {/* <div className="text-sm">
                    <strong>(out of</strong>
                    {consoleState.consoleOutput.memory_limit})
                  </div> */}
                </div>
                <div className="flex items-center mb-2 space-x-1">
                  <TimerReset />
                  <strong>Execution Time — </strong>
                  <div>{consoleState.consoleOutput.time} seconds</div>
                </div>
                <div className="flex items-center mb-2 space-x-1">
                  <BadgeCheck />
                  <strong>Status — </strong>
                  <div>{consoleState.consoleOutput.status.description}</div>
                </div>
                <div className="items-center mb-2 space-x-1">
                  <div className="flex space-x-1">
                    <ArrowUp01 />
                    <strong>Standard Output</strong>
                  </div>
                  <pre className="p-2 whitespace-pre-wrap bg-gray-700 rounded-lg">
                    {consoleState.consoleOutput.stdout}
                  </pre>
                </div>
              </>
            ) : (
              "Empty"
            )}
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default OutputConsole;
