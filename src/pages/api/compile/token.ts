import { LANGUAGE_ID } from "@/lib/constant";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

type Data = {
  content: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { code, language } = JSON.parse(req.body);
    const parsedCode = z.string().parse(code);
    const parsedLanguage = z
      .enum(["typescript", "c#", "python", "java"])
      .parse(language);

    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&fields=*",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
          "X-RapidAPI-Host": process.env.RAPIDAPI_HOST!,
        },
        body: JSON.stringify({
          language_id: LANGUAGE_ID[parsedLanguage],
          source_code: parsedCode,
          stdin: "SnVkZ2Uw",
        }),
      }
    );

    const { token, message } = await response.json();

    // TODO: Handle exceeded API call quota
    if (message) {
      return res.status(500).json({ content: z.string().parse(message) });
    }
    return res.status(200).json({ content: z.string().parse(token) });
  }

  res.status(400).json({ content: "Method not allowed" });
}
