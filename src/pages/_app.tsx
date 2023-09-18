import { ToastProvider } from "@/components/custom/toast-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <ToastProvider />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </main>
  );
}
