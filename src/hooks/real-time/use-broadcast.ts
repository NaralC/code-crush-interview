import supabaseClient from "@/lib/supa-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { MutableRefObject, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const EVENT = {
  NEW_JOIN: "kuayma",
  CLICK: "click",
};

const useBroadcast = (roomId: string) => {
  const broadcastRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const broadcastChannel = supabaseClient.channel(roomId, {
      config: {
        broadcast: {
          self: false,
          ack: false,
        },
      },
    });

    // Subscribe
    broadcastChannel
      .on(
        "broadcast",
        { event: EVENT.NEW_JOIN }, // Filtering events
        (payload) => {
          console.log(payload);
        }
      )
      .on(
        "broadcast",
        { event: EVENT.CLICK }, // Filtering events
        (payload) => {
          console.log(payload);
          toast("Someone just clicked");
        }
      );

    broadcastChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // Do something when someone joins
        // This interferes with the presence channel, thus being commented out
        // await broadcastChannel.send({
        //   type: "broadcast",
        //   event: EVENT.NEW_JOIN,
        //   payload: {
        //     message: "someone just joined lmao",
        //   },
        // });
      }
    });

    broadcastRef.current = broadcastChannel;

    return () => {
      broadcastChannel.unsubscribe();
      supabaseClient.removeChannel(broadcastChannel);
      broadcastRef.current = null;
    };
  }, []);

  return broadcastRef;
};

export default useBroadcast;
