import supabaseClient from "@/lib/supa-client";
import type { Session } from "@supabase/supabase-js";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserSession from "@/hooks/use-user-session";

// Refer to https://github.com/supabase/supabase/issues/563 in case I want to add more fields to a user
const AuthPopover: FC = () => {
  const router = useRouter();
  const supa = supabaseClient;
  const { session } = useUserSession(supa);

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
      <PopoverContent className="-translate-x-12 shadow inter-font shadow-white w-fit">
        <>
          <div className="overflow-y-auto text-center max-h-32">
            {session ? (
              <>Logged In As {session.user.user_metadata.user_name}</>
            ) : (
              <>Not Logged In</>
            )}
          </div>
          {!session ? (
            <div className="transition active:scale-95">
              <Button
                className=""
                onClick={async () => {
                  await supa.auth.signInWithOAuth({
                    provider: "github",
                    options: {
                      scopes: "repo",
                    },
                  });
                }}
              >
                Sign In
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
        </>
      </PopoverContent>
    </Popover>
  );
};

export default AuthPopover;
