import Head from "next/head";
import { NextPage } from "next";
import { Bird, Code2, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import Overlay from "@/components/custom/landing/overlay";
import { useCreateRoomModal } from "@/hooks/modals/use-create-room-modal";
import { useFeedbackModal } from "@/hooks/modals/use-feedback-modal";
import { useJoinRoomModal } from "@/hooks/modals/use-join-room-modal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import BackgroundParticles from "@/components/custom/landing/background-particles";

const Home: NextPage = () => {
  // Modals & Toast
  const { toast } = useToast();
  const createRoomModal = useCreateRoomModal();
  const joinRoomModal = useJoinRoomModal();
  const feedbackModal = useFeedbackModal();

  // Initial load animation
  const [animation, setAnimation] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimation(true);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Code Crush</title>
        <meta name="Code Crush" content="Become an interview pro!" />
      </Head>
      <main
        className={cn(
          "flex flex-col items-center justify-center min-h-screen p-24 transition-all duration-200 delay-100 xl:container",
          animation ? "text-white" : ""
        )}
      >
        <p className="text-6xl font-bold text-center md:text-8xl">Code Crush</p>
        <p className="mb-8 text-2xl font-normal text-center md:text-4xl text-balance">
          Interviewing — the ultimate leverage for career progression. Practice now.
        </p>
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <Button
            className={cn(
              "ring-1 ring-zinc-50/25 filter",
              animation ? "shadow-lg shadow-white blur-none" : "blur-sm"
            )}
            onClick={() => {
              createRoomModal.setOpen();
            }}
          >
            <Code2 className="mr-2" />
            Create a Room
          </Button>
          <Button
            className={cn(
              "ring-1 ring-zinc-50/25 filter",
              animation ? "shadow-lg shadow-white blur-none" : "blur-sm"
            )}
            onClick={() => {
              joinRoomModal.setOpen();
            }}
          >
            <Paperclip className="mr-2" />
            Join a Room
          </Button>
        </div>

        {/* Background Stuff */}
        <Overlay />
        <BackgroundParticles />
      </main>
    </>
  );
};

export default Home;
