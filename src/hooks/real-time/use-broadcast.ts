import { useCodeContext } from "@/context/code-context";
import { useNoteContext } from "@/context/note-context";
import { EVENT } from "@/lib/constant";
import supabaseClient from "@/lib/supa-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const useBroadcast = (roomId: string) => {
  // States
  const { updateCode, latestCodeRef } = useCodeContext();
  const { editorRef } = useNoteContext();

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
        async (
          payload: Payload<{
            message: string;
          }>
        ) => {
          toast(String(payload.payload?.message));

          // Send the latest code and note state to the new comer
          broadcastChannel.send({
            type: "broadcast",
            event: EVENT.CODE_UPDATE,
            payload: {
              message: latestCodeRef.current,
            },
          });

          const noteData = await editorRef.current?.save();
          if (!noteData?.blocks.length) return;

          setTimeout(() => {
            broadcastChannel.send({
              type: "broadcast",
              event: EVENT.NOTE_UPDATE,
              payload: {
                message: { ...noteData },
              },
            });
          }, 1000);
        }
      )
      .on(
        "broadcast",
        { event: EVENT.CODE_UPDATE }, // Filtering events
        (payload) => {
          const newCode = payload.payload.message;
          updateCode(newCode);
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
            message: "Ayo guys may I have the code and note please 💀❓",
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
