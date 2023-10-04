import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: Request) {
  const url = new URL(req.url)
  const href = url.searchParams.get('url')

  if (!href) {
    return new Response('Invalid href', { status: 400 })
  }

  const res = await axios.get(href)

  // Parse the HTML using regular expressions
  const titleMatch = res.data.match(/<title>(.*?)<\/title>/)
  const title = titleMatch ? titleMatch[1] : ''

  const descriptionMatch = res.data.match(
    /<meta name="description" content="(.*?)"/
  )
  const description = descriptionMatch ? descriptionMatch[1] : ''

  const imageMatch = res.data.match(/<meta property="og:image" content="(.*?)"/)
  const imageUrl = imageMatch ? imageMatch[1] : ''

  // Return the data in the format required by the editor tool
  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    })
  )
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {

  try {
    if (req.method === "GET") {
      const url = new URL(req.url!);
      const href = url.searchParams.get("url");
      console.log(href, url);

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
  } catch (error) {
    return res.status(500).json({ content: error as Error });
  }

  return res.status(405).json({ content: "Method now allowed." });
}
