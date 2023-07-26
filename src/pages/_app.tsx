import ModalProvider from "@/components/providers/modal-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { CodeContextProvider } from "@/context/code-context";
import { UsersListContextProvider } from "@/context/users-list-context";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <QueryClientProvider client={queryClient}>
        <CodeContextProvider>
          <UsersListContextProvider>
            <Component {...pageProps} />
            <ModalProvider />
            <ToastProvider />
          </UsersListContextProvider>
        </CodeContextProvider>
      </QueryClientProvider>
    </main>
  );
}
