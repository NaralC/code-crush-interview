import supabaseClient from "@/lib/supa-client";
import toast from "react-hot-toast";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

const usePostgresChanges = () => {
  const schemaChangesRef = useRef<RealtimeChannel | null>(null);
  const tableDBChangesRef = useRef<RealtimeChannel | null>(null);
  const tableFilterChangesRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Listen to changes by schema
    const schemaChannel = supabaseClient
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        (payload) => {
          console.log(payload);
          toast("schema-db-changes");
        }
      )
      .subscribe();

    // Listen to changes by table
    const tableChannel = supabaseClient
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "interview_rooms",
        },
        (payload) => {
          console.log(payload);
          toast("table-db-changes");
        }
      )
      .subscribe();

    // Listen to changes by filter
    const filterChannel = supabaseClient
      .channel("table-filter-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "interview_rooms",
          filter: "room_id=eq.d7a1af15-4fea-4207-98e6-b3a97e42f19a",
        },
        (payload) => {
          console.log(payload);
          toast("table-filter-changes");
        }
      )
      .subscribe();

    schemaChangesRef.current = schemaChannel;
    tableDBChangesRef.current = tableChannel;
    tableFilterChangesRef.current = filterChannel;

    return () => {
      schemaChannel.unsubscribe();
      tableChannel.unsubscribe();
      filterChannel.unsubscribe();
      schemaChangesRef.current = null;
      tableDBChangesRef.current = null;
      tableFilterChangesRef.current = null;
    };
  }, []);

  return {
    schemaChangesRef,
    tableDBChangesRef,
    tableFilterChangesRef,
  };
};

export default usePostgresChanges;
