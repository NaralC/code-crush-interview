import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient<Database>(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}`,
  `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
  {
    realtime: {
      params: {
        eventsPerSecond: 10, // Rate limiting
      },
    },
  }
);

export default supabaseClient;
