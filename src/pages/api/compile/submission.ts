import { LANGUAGE_ID } from "@/lib/constant";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

type Data = {
  content: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { token } = JSON.parse(req.body);
    const parsedToken = z.string().parse(token);

    const url = `https://judge0-ce.p.rapidapi.com/submissions/${parsedToken}?base64_encoded=true&fields=*`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST!,
      },
    };

    const response = await fetch(url, options);
    const result = await response.json();
    return res.status(200).json({
      content: (result),
    });
  }

  res.status(400).json({ content: "Method not allowed" });
}
