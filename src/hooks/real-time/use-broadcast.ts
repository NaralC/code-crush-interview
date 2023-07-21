import supabaseClient from "@/lib/supa-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { MutableRefObject, useEffect, useRef } from "react";

const EVENT = {
  NEW_JOIN: "new-join",
  CLICK: "click",
};

const useBroadcast = (): MutableRefObject<RealtimeChannel | null> => {
  const broadcastRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const broadcastChannel = supabaseClient.channel("123", {
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
        }
      );

    broadcastChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await broadcastChannel.send({
          type: "broadcast",
          event: EVENT.NEW_JOIN,
          payload: {
            message: "someone just joined lmao",
          },
        });
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
