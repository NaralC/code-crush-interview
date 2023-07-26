import useCodeState from "@/context/code-state";
import supabaseClient from "@/lib/supa-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { MutableRefObject, useEffect, useRef } from "react";
import toast from "react-hot-toast";

export const EVENT = {
  NEW_JOIN: "new-join",
  CODE_UPDATE: "code-update"
};

const useBroadcast = (roomId: string) => {
  // States
  const { setCode, code } = useCodeState();

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
          // console.log(payload.payload.message);
          // broadcastChannel.send({
          //   type: "broadcast",
          //   event: EVENT.CODE_UPDATE,
          //   payload: {
          //     message: code,
          //   },
          // });
        }
      )
      .on(
        "broadcast",
        { event: EVENT.CODE_UPDATE }, // Filtering events
        (payload) => {
          console.log(payload.payload.message)
          setCode(payload.payload.message)
        }
      );

    broadcastChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // Do something when someone else joins
        // await broadcastChannel.send({
        //   type: "broadcast",
        //   event: EVENT.CODE_UPDATE,
        //   payload: {
        //     message: code,
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
