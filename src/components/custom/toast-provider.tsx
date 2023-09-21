import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  const { toasts } = useToast();

  return (
    <>
      <Toaster
        position="bottom-left"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 2000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      <RadixToastProvider>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport />
      </RadixToastProvider>
    </>
  );
}
