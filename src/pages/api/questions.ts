import type { NextApiRequest, NextApiResponse } from "next";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

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

  // Creating a question
  if (req.method === "POST") {
    const { title, body, hints, solution, type } = JSON.parse(req.body);

    const { data, error } = await supabaseServerClient
      .from("questions")
      .insert({
        title,
        body: { body },
        hints,
        solution,
        type,
      })
      .select();

    if (!data || error) {
      res.status(500).json({ content: "Failed to create question" });
      return;
    }

    return res.status(200).json({ content: "Question created!" });
  }

  // Editing a question
  if (req.method === "PATCH") {
    const { title, body, hints, solution, id } = JSON.parse(req.body);

    const { data, error } = await supabaseServerClient
      .from("questions")
      .update({
        title,
        body: { body },
        hints,
        solution,
      })
      .eq("id", id)
      .select();

    if (!data || error) {
      res.status(500).json({ content: "Failed to edit question" });
      return;
    }

    return res.status(200).json({ content: "Question edited!" });
  }
}
