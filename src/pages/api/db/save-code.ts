import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { DEFAULT_ROOM_ID } from "@/lib/constant";


type Data = {
  content: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const supabaseServerClient = createPagesServerClient<Database>({
    req,
    res,
  });

  if (req.method === "PATCH") {
    const code = req.body;

    const { data, error } = await supabaseServerClient
      .from("interview_rooms")
      .update({
        code_state: code,
      })
      .eq("room_id", DEFAULT_ROOM_ID)
      .select();

    if (error || data.length < 1) {
      console.log(error);
      throw new Error("Could not save code to DB");
    }

    return res.status(200).json({ content: "Saved!" });
  }
}
