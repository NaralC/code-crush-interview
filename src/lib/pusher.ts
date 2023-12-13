import Pusher from "pusher";

export const pusher = new Pusher({
    appId: process.env.NEXT_PUBLIC_APP_ID!,
    key: process.env.NEXT_PUBLIC_KEY!,
    secret: process.env.NEXT_PUBLIC_SECRET!,
    cluster: process.env.NEXT_PUBLIC_CLUSTER!,
    useTLS: true,
  });
  