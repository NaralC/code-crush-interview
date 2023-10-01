import supabaseClient from "@/lib/supa-client";
import type { Session } from "@supabase/supabase-js";
import { FC, useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Refer to https://github.com/supabase/supabase/issues/563 in case I want to add more fields to a user
const AuthPopover: FC = ({}) => {
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
      supa.auth.onAuthStateChange((event, session) => {
        console.log(event, session);
      });
    };

    init();
  }, []);

  const [myData, setMyData] = useState<Session | null>(null);

  useEffect(() => {
    console.log(myData);
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
          {!myData && (
            <div className="transition active:scale-95">
              <Auth
                supabaseClient={supa}
                providers={["github"]}
                onlyThirdPartyProviders
                theme="dark"
                appearance={{
                  theme: ThemeSupa,
                  style: {
                    button: {
                      background: "black",
                      color: "white",
                      font: "inherit",
                      fontSize: "0.875rem",
                    },
                  },
                }}
              />
            </div>
          )}
          {myData && (
            <Button
              className="w-full"
              onClick={async () => {
                await supa.auth.signOut().then(() => router.reload());
              }}
            >
              Sign Out
            </Button>
          )}
        </>
      </PopoverContent>
    </Popover>
  );
};

export default AuthPopover;
