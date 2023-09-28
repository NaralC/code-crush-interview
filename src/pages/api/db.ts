import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { DEFAULT_ROOM_ID } from "@/lib/constant";
import { v4 as uuidv4 } from "uuid";
import { generateRoomDescription } from "@/lib/faker";

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

  // Creating a new room
  if (req.method === "POST") {
    const { roomName, type } = JSON.parse(req.body);
    const roomId = uuidv4();

    const { data, error } = await supabaseServerClient
      .from("interview_rooms")
      .insert({
        room_id: roomId,
        code_state: "",
        created_at: new Date().toISOString(),
        participants: {},
        description: generateRoomDescription(),
        name: roomName,
        type,
        finished: false
      })
      .select();

    if (!data || error) {
      res.status(500).json({ content: "" });
      return;
    }

    res.status(200).json({ content: roomId });
  }

  // Editing room data
  if (req.method === "PATCH") {
    const { code } = JSON.parse(req.body);

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
    
    console.log(code, data)

    return res.status(200).json({ content: "Saved!" });
  }
}
