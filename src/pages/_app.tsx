import ModalProvider from "@/components/providers/modal-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <Component {...pageProps} />
      <ModalProvider />
      <ToastProvider />
    </main>
  );
}
