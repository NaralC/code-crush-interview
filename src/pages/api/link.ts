import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  if (req.method === "GET") {
    const url = new URL(req.url ?? "");
    // const url = new URL("https://codex.so");
    const href = url.searchParams.get("url");
    console.log(href);
    
    if (!href || !url) {
      res
        .status(404)
        .json({ content: "Either url or href is undefined/missing." });
      return;
    }

    const response = await axios.get(href);

    const titleMatch = response.data.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : "";

    const descriptionMatch = response.data.match(
      /<meta name="description" content="(.*?)">/
    );
    const description = descriptionMatch ? descriptionMatch[1] : "";

    const imageMatch = response.data.match(
      /<meta property="og:image" content="(.*?)">/
    );
    const imageUrl = imageMatch ? imageMatch[1] : "";

    res.status(200).json({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    });
  }

  res.status(405).json({ content: "Method now allowed." });
}
