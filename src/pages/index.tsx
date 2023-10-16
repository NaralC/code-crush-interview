// UI
import { Button } from "@/components/ui/button";
import { Code2, Globe2, Paperclip } from "lucide-react";
import {
  TbBrandNextjs,
  TbBrandSupabase,
  TbBrandGithubFilled,
  TbBrandTailwind,
} from "react-icons/tb";
import BackgroundParticles from "@/components/custom/background-particles";
import CreateRoomModal from "@/components/custom/modals/create-room-modal";
import JoinRoomModal from "@/components/custom/modals/join-room-modal";
import BrowseRoomsModal from "@/components/custom/modals/browse-rooms-modal";
import useModalStore from "@/stores/modal-store";
import Link from "next/link";

// Logic
import { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import { cn } from "@/lib/utils";
import AuthPopover from "@/components/custom/auth-popover";
import { useCodeStore } from "@/stores/code-store";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseClient = createPagesServerClient<Database>(ctx);

  const { data, error } = await supabaseClient
    .from("interview_rooms")
    .select(
      "room_id, created_at, name, description, participants, type, finished"
    )
    .order("name", { ascending: true });

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
  const { createRoomModal, joinRoomModal, browseRoomsModal } = useModalStore();
  const { dispatchCode } = useCodeStore();

  // Initial load animation
  const [animation, setAnimation] = useState(false);
  useEffect(() => {
    dispatchCode({
      type: "CLEAR_CODE_STORE",
      payload: null,
    });

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
          "flex flex-col items-center justify-center min-h-screen p-24 transition-all duration-200 delay-100 xl:container selection:text-black selection:bg-white",
          animation ? "text-white" : ""
        )}
      >
        <p className="text-6xl font-bold text-center md:text-8xl text-shadow-2xl ">
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
            onClick={() => {
              browseRoomsModal.setOpen();
            }}
          >
            <Globe2 className="mr-2" />
            Browse Rooms
          </Button>
        </div>

        <div className="fixed flex flex-col items-center justify-center text-lg text-shadow-2xl bottom-5">
          <Link
            className="flex flex-row items-center justify-center gap-2 text-center"
            href={"https://github.com/NaralC/code-crush-interview"}
          >
            Link to
            <TbBrandGithubFilled className="text-3xl" />
          </Link>
          <div className="flex flex-row items-center justify-center gap-2 text-center">
            Powered By
            <TbBrandNextjs
              className={cn(
                "text-3xl",
                animation ? "text-white" : "text-black"
              )}
            />
            <TbBrandTailwind
              className={cn("text-3xl", animation ? "text-sky-500" : "")}
            />
            <TbBrandSupabase
              className={cn(
                "text-3xl",
                animation ? "text-emerald-500" : "text-black"
              )}
            />
          </div>
        </div>

        <CreateRoomModal />
        <JoinRoomModal rooms={rooms} />
        <BrowseRoomsModal rooms={rooms} />
        <BackgroundParticles />
        <AuthPopover />
      </main>
    </>
  );
};

export default Home;
