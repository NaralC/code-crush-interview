import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const useUserSession = (supa: SupabaseClient) => {
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

        if (session && session.provider_token) {
          window.localStorage.setItem(
            "oauth_provider_token",
            session.provider_token
          );
          setIsAuthed(true);
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

  return {
    isAuthed,
    session: myData,
  };
};

export default useUserSession;
