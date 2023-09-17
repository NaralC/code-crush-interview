// Components and UI
import { Button } from "@/components/ui/button";
import { Code2, Globe2, Paperclip } from "lucide-react";
import BackgroundParticles from "@/components/custom/background-particles";
import CreateRoomModal from "@/components/custom/modals/create-room-modal";
import JoinRoomModal from "@/components/custom/modals/join-room-modal";

// Next.js/React Stuff
import { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";

// Hooks and Utility
import { cn } from "@/lib/utils";
import BrowseRoomsModal from "@/components/custom/modals/browse-rooms-modal";
import useModalStore from "@/stores/modal-store";

type Room = Database["public"]["Tables"]["interview_rooms"]["Row"];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseClient = createPagesServerClient<Database>(ctx);

  const { data, error } = await supabaseClient
    .from("interview_rooms")
    .select("room_id, created_at, name, description, participants, type");

  if (error) {
    return {
      props: {
        rooms: null,
      },
    };
  }

  return {
    props: {
      rooms: error ? null : data,
    },
  };
};

const Home: NextPage<{ rooms: Room[] }> = ({ rooms }) => {
  // Modals
  // const createRoomModal = useCreateRoomModal();
  const { createRoomModal, joinRoomModal } = useModalStore();
  // const joinRoomModal = useJoinRoomModal();

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
        <p className="text-6xl font-bold text-center md:text-8xl text-shadow-2xl">
          Code Crush
        </p>
        <p className="mb-8 text-2xl font-normal text-center md:text-4xl text-balance text-shadow-2xl">
          Interviewing — the ultimate leverage for career progression. Practice
          now.
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
            Join a Room by ID
          </Button>
          <Button
            className={cn(
              "ring-1 ring-zinc-50/25 filter",
              animation ? "shadow-lg shadow-white blur-none" : "blur-sm"
            )}
            // onClick={() => {
            //   joinRoomModal.setOpen();
            // }}
          >
            <Globe2 className="mr-2" />
            Browse Rooms
          </Button>
        </div>

        <CreateRoomModal />
        <JoinRoomModal />
        <BrowseRoomsModal />
        <BackgroundParticles />
      </main>
    </>
  );
};

export default Home;
