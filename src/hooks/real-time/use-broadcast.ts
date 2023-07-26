import { useCodeContext } from "@/context/code-context";
import supabaseClient from "@/lib/supa-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const EVENT = {
  NEW_JOIN: "new-join",
  CODE_UPDATE: "code-update",
};

const useBroadcast = (roomId: string) => {
  // States
  const { updateCode, code, latestCodeRef } = useCodeContext();

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
          toast(String(payload.payload.message));

          // Send the latest code state to the newly joined user
          broadcastChannel.send({
            type: "broadcast",
            event: EVENT.CODE_UPDATE,
            payload: {
              message: latestCodeRef.current
            },
          });
        }
      )
      .on(
        "broadcast",
        { event: EVENT.CODE_UPDATE }, // Filtering events
        (payload) => {
          const newCode = payload.payload.message;
          updateCode(newCode)
        }
      );

    broadcastChannel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        toast("Fetching code state from other players...");

        // Request the latest code state from other users
        broadcastChannel.send({
          type: "broadcast",
          event: EVENT.NEW_JOIN,
          payload: {
            message: "Ayo guys may I have the code please 💀❓",
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
