import { useCodeContext } from "@/context/code-context";
import { useNoteContext } from "@/context/note-context";
import { EVENT } from "@/lib/constant";
import supabaseClient from "@/lib/supa-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

const useBroadcast = (roomId: string, myUserName: string) => {
  // States
  const {
    latestCodeRef,
    dispatchCode,
    dispatchAsync,
    dispatchConsole
  } = useCodeContext();
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
          dispatchCode({
            type: "UPDATE_CODE",
            payload: newCode
          })
        }
      )
      .on(
        "broadcast",
        { event: EVENT.MOUSE_UPDATE }, // Filtering events
        ({
          payload,
        }: Payload<{
          x: number;
          y: number;
        }>) => {
          const { x, y } = payload!;

          console.log(`Mouse position from other client ${x} ${y}`);
        }
      )
      .on(
        "broadcast",
        { event: EVENT.COMPILE_UPDATE }, // Filtering events
        ({
          payload,
        }: Payload<{
          status: boolean;
          output: string;
        }>) => {
          const { status, output } = payload!;

          dispatchAsync({
            type: "SET_IS_COMPILING",
            payload: status
          })

          if (status === true) return;

          dispatchAsync({
            type: "SET_IS_COMPILING",
            payload: status
          })
          dispatchConsole({
            type: "SET_CONSOLE_VISIBLE",
            payload: true
          })
          dispatchConsole({
            type: "SET_CONSOLE_OUTPUT",
            payload: output
          })
        }
      )
      .on(
        "broadcast",
        { event: EVENT.SAVE_UPDATE }, // Filtering events
        ({
          payload,
        }: Payload<{
          status: boolean;
        }>) => {
          const { status } = payload!;
          dispatchAsync({
            type: "SET_IS_SAVING",
            payload: status
          })
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
