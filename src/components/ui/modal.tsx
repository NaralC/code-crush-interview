import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, FC, Fragment, SetStateAction, useState } from "react";
import { Button } from "./button";
import { X } from "lucide-react";

const Modal: FC<{
  title: string;
  description?: string;
  children: JSX.Element;
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
}> = ({ title, description, children, isOpen, setOpen, setClose }) => {

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-2xl shadow-blue-500 ring ring-teal-50/95">
                  <Dialog.Title
                    as="h3"
                    className="flex justify-between text-lg font-medium leading-6 text-gray-900"
                  >
                    <div>{title}</div>
                    <Button
                      variant="ghost"
                      size="closeDialog"
                      onClick={setClose}
                    >
                      <X />
                    </Button>
                  </Dialog.Title>
                  <div className="my-5 mt-1">
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
