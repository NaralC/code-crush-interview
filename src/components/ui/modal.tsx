import { Dispatch, FC, Fragment, SetStateAction, useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const Modal: FC<{
  title: string;
  description?: string;
  children: JSX.Element;
  isOpen: boolean;
  setClose: () => void;
}> = ({ title, description, children: content, isOpen, setClose }) => {
  // Controlling Radix dialog state manually: https://github.com/shadcn/ui/issues/386

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => { setClose() }}>
        <DialogContent className="max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <Button
              variant="ghost"
              className="absolute shadow-none right-4 top-4"
              onClick={setClose}
              size="closeDialog"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </Button>
            {content}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Modal;
