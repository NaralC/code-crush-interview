import supabaseClient from "@/lib/supa-client";
import { nanoid } from "nanoid";

const usePostgresChanges = () => {
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
        filter: "room_id=eq.d7a1af15-4fea-4207-98e6-b3a97e42f19a",
      },
      (payload) => console.log(payload)
    )
    .subscribe();
};

export default usePostgresChanges;
