import { FC } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Modal: FC<{
  title: string;
  description?: string;
  children: JSX.Element;
  isOpen: boolean;
  setClose: () => void;
  className?: string;
  hideX?: boolean;
}> = ({
  title,
  description,
  children: content,
  isOpen,
  setClose,
  className,
  hideX,
}) => {
  // Controlling Radix dialog state manually: https://github.com/shadcn/ui/issues/386

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={() => {
          setClose();
        }}
      >
        <DialogContent
          className={cn("max-h-screen overflow-y-auto inter-font", className)}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
            <Button
              variant="ghost"
              className="absolute shadow-none right-4 top-4"
              onClick={setClose}
              size="closeDialog"
            >
              {!hideX && <X className="w-4 h-4" />}
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
