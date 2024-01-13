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
import { initOctokit, retrieveSHA, uploadCode } from "@/lib/octokit";

// Refer to https://github.com/supabase/supabase/issues/563 in case I want to add more fields to a user
const AuthPopover: FC = () => {
  const router = useRouter();
  const supa = supabaseClient;

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
        error,
      } = await supa.auth.getSession();

      if (error) {
        console.log(error);
        return;
      }

      setMyData(session);
      supa.auth.onAuthStateChange(async (event, session) => {
        // console.log(session);
        setIsAuthed(true);
        if (session && session.provider_token) {
          window.localStorage.setItem(
            "oauth_provider_token",
            session.provider_token
          );
        }

        if (session && session.provider_refresh_token) {
          window.localStorage.setItem(
            "oauth_provider_refresh_token",
            session.provider_refresh_token
          );
        }

        if (event === "SIGNED_OUT") {
          window.localStorage.removeItem("oauth_provider_token");
          window.localStorage.removeItem("oauth_provider_refresh_token");
        }
      });
    };

    init();
  }, []);

  const [myData, setMyData] = useState<Session | null>(null);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    // console.log(myData);
  }, [myData]);

  return (
    <Popover>
      <PopoverTrigger
        className="absolute cursor-pointer top-10 right-10"
        asChild
      >
        <Avatar className="w-16 h-16 text-black">
          <AvatarImage sizes="" src={myData?.user.user_metadata.avatar_url} />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="-translate-x-12 shadow inter-font shadow-white w-fit">
        <>
          <div className="overflow-y-auto text-center max-h-32">
            {myData ? (
              <>Logged In As {myData.user.user_metadata.user_name}</>
            ) : (
              <>Not Logged In</>
            )}
          </div>
          {!myData ? (
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

              <Button
                disabled={!isAuthed}
                onClick={async () => {
                  try {
                    if (!myData.provider_token) {
                      throw new Error("Provider token not present");
                    }

                    const octokit = initOctokit(myData.provider_token);

                    const sha = await retrieveSHA(octokit, {
                      owner: myData.user.user_metadata.user_name,
                      repo: "index-solid-state-program",
                      path: "README.md",
                    });

                    const data = await uploadCode(octokit, {
                      email: myData.user.user_metadata.email,
                      owner: myData.user.user_metadata.user_name,
                      sha: sha,
                    });

                    console.log(data);
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Create New Repo
              </Button>
            </div>
          )}
        </>
      </PopoverContent>
    </Popover>
  );
};

export default AuthPopover;
