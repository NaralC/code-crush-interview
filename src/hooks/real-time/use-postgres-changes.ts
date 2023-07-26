/* eslint-disable react-hooks/exhaustive-deps */
import supabaseClient from "@/lib/supa-client";
import toast from "react-hot-toast";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import { DEFAULT_ROOM_ID } from "@/lib/constant";
import useCodeState from "@/context/code-state";

const usePostgresChanges = (roomId: string) => {
  // States
  const { setCode } = useCodeState();

  // Refs
  const schemaChangesRef = useRef<RealtimeChannel | null>(null);
  const tableDBChangesRef = useRef<RealtimeChannel | null>(null);
  const tableFilterChangesRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    // Listen to changes by schema
    const schemaChannel = supabaseClient
      .channel(`schema-db-changes-${roomId}`)
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
      .channel(`table-db-changes-${roomId}`)
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
      .channel(`table-filter-changes-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "interview_rooms",
          filter: `room_id=eq.${DEFAULT_ROOM_ID}`,
        },
        (payload) => {
          console.log(payload);
          toast("table-filter-changes");

          // @ts-ignore
          const newCode = payload.new.code_state         
          setCode(newCode);
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
