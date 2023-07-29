import { FC, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { useCodeContext } from "@/context/code-context";
import { X } from "lucide-react";

const OutputConsole: FC = () => {
  const { consoleIsVisible, toggleConsoleVisiblity } = useCodeContext();

  return (
    <Transition
      as={Fragment}
      show={consoleIsVisible}
      enter="transition-all duration-300 ease-out"
      enterFrom="opacity-90 transform translate-y-full"
      enterTo="opacity-100 transform translate-y-0"
      leave="transition ease-in-out duration-300 ease-out"
      leaveFrom="opacity-100 transform translate-y-0"
      leaveTo="opacity-90 transform translate-y-full"
    >
      <div className="fixed inset-x-0 bottom-0 z-50 text-white bg-gray-900 border-t-2 border-zinc-50 ring-1 ring-zinc-500 h-36 shadow-white rounded-t-md max-h-fit">
        <div className="flex justify-between px-4 py-2">
          <span className="font-bold">Console</span>
          <button
            onClick={toggleConsoleVisiblity}
            className="focus:outline-none"
          >
            <X />
          </button>
        </div>
        <div className="px-4 py-2 overflow-y-auto">
          Output content goes here...
        </div>
      </div>
    </Transition>
  );
};

export default OutputConsole;
