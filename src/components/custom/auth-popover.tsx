import supabaseClient from "@/lib/supa-client";
import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserSession from "@/hooks/use-user-session";
import { Github } from "lucide-react";
import { Collapse } from "@chakra-ui/transition";

// Refer to https://github.com/supabase/supabase/issues/563 in case I want to add more fields to a user
const AuthPopover: FC = () => {
  const router = useRouter();
  const supa = supabaseClient;
  const { session } = useUserSession(supa);
  const [collapseOpen, setCollapseOpen] = useState<boolean>(false);

  return (
    <Popover>
      <PopoverTrigger
        className="absolute cursor-pointer top-10 right-10"
        asChild
      >
        <Avatar className="w-16 h-16 text-black">
          <AvatarImage sizes="" src={session?.user.user_metadata.avatar_url} />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-48 space-y-2 -translate-x-12 shadow inter-font shadow-white">
        <>
          <div className="overflow-y-auto text-center max-h-32">
            {session ? (
              <>Logged In As {session.user.user_metadata.user_name}</>
            ) : null}
          </div>
          {!session ? (
            <div className="transition active:scale-95">
              <Button
                className="w-full"
                onClick={async () => {
                  await supa.auth.signInWithOAuth({
                    provider: "github",
                    options: {
                      scopes: "repo",
                    },
                  });
                }}
              >
                Sign In With <Github className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                onClick={async () => {
                  await supa.auth.signOut().then(() => router.reload());
                }}
              >
                Sign Out
              </Button>
            </div>
          )}
          <div>
            <button
              className="w-full text-xs font-bold text-center text-gray-500"
              onClick={() => setCollapseOpen((prev) => !prev)}
            >
              {!collapseOpen ? "What's This For?" : "Experimental Feature"}
            </button>
            <Collapse
              startingHeight={0}
              className="text-xs text-center text-gray-500 break-words"
              in={collapseOpen}
            >
              Signing in with GitHub allows you to upload code to your own
              repositories.
            </Collapse>
          </div>
        </>
      </PopoverContent>
    </Popover>
  );
};

export default AuthPopover;
