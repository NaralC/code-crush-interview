import ModalProvider from "@/components/providers/modal-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
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
        <Component {...pageProps} />
        <ModalProvider />
        <ToastProvider />
      </QueryClientProvider>
    </main>
  );
}
