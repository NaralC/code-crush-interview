import LandingOverlay from "@/components/custom/landing-overlay";
import { Button } from "@/components/ui/button";
import useBroadcast from "@/hooks/use-broadcast";
import { useCreateRoomModal } from "@/hooks/use-create-room-modal";
import { useFeedbackModal } from "@/hooks/use-feedback-modal";
import { useJoinRoomModal } from "@/hooks/use-join-room-modal";
import { useToast } from "@/hooks/use-toast";
import { Bird, Code2, Paperclip } from "lucide-react";
import { NextPage } from "next";
import Head from "next/head";
import usePresence from "@/hooks/use-presence";
import { useEffect } from "react";
import usePostgresChanges from "@/hooks/use-postgres-changes";

const Home: NextPage = () => {
  // Real-time
  const { clickFunction } = useBroadcast();
  // usePresence();
  // usePostgresChanges();

  // Modals & Toast
  const { toast } = useToast();
  const createRoomModal = useCreateRoomModal();
  const joinRoomModal = useJoinRoomModal();
  const feedbackModal = useFeedbackModal();

  return (
    <>
      <Head>
        <title>Code Crush</title>
        <meta name="Code Crush" content="Become an interview pro!" />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen p-24 transition-all duration-200 delay-100 xl:container">
        <p className="text-6xl font-bold text-center md:text-8xl">Code Crush</p>
        <p className="mb-8 text-2xl font-normal text-center md:text-4xl text-balance">
          Interviewing — the ultimate leverage for career progression. Period.
        </p>
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <Button
            onClick={() => {
              clickFunction();
            }}
          >
            Send real-time stuff yo
          </Button>
          <Button
            onClick={() => {
              createRoomModal.setOpen();
            }}
          >
            <Code2 className="mr-2" />
            Create a Room
          </Button>
          <Button
            onClick={() => {
              joinRoomModal.setOpen();
            }}
          >
            <Paperclip className="mr-2" />
            Join a Room
          </Button>
          <Button
            onClick={() => {
              feedbackModal.setOpen();
            }}
          >
            <Bird className="mr-2" />
            Leave Feedback
          </Button>
        </div>
        <LandingOverlay />
        {/* <RevolvingGrid /> */}
      </main>
    </>
  );
};

export default Home;
