import supabaseClient from "@/lib/supa-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { MutableRefObject, useEffect, useRef } from "react";

const usePostgresChanges = () => {
  const postgresRefA = useRef<RealtimeChannel | null>(null);
  const postgresRefB = useRef<RealtimeChannel | null>(null);
  const postgresRefC = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Listen to changes by schema
    const channelA = supabaseClient
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        (payload) => console.log(payload)
      )
      .subscribe();

    // Listen to changes by table
    const channelB = supabaseClient
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "interview_rooms",
        },
        (payload) => console.log(payload)
      )
      .subscribe();

    // Listen to changes by filter
    const channelC = supabaseClient
      .channel("table-filter-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "interview_rooms",
          filter: "creator=eq.naral",
        },
        (payload) => console.log(payload)
      )
      .subscribe();

    postgresRefA.current = channelA;
    postgresRefB.current = channelB;
    postgresRefC.current = channelC;

    return () => {
      channelA.unsubscribe();
      channelB.unsubscribe();
      channelC.unsubscribe();
      supabaseClient.removeAllChannels();
      postgresRefA.current = null;
      postgresRefB.current = null;
      postgresRefC.current = null;
    };
  }, []);

  return {
    schemaChangesRef: postgresRefA,
    tableDBChangesRef: postgresRefB,
    tableFilterChangesRef: postgresRefC,
  };
};

export default usePostgresChanges;
