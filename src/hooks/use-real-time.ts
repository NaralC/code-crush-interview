import { EVENT } from "@/lib/constant";
import supabaseClient from "@/lib/supa-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { nanoid } from "nanoid";
import { useUsersStore } from "@/stores/users-store";
import { useCodeStore } from "@/stores/code-store";
import { useNoteStore } from "@/stores/note-store";
import { useHintsSolutionModal } from "./modals/use-hint-solution-modal";
import useModalStore from "../stores/modal-store";

const useRealTime = (
  roomId: string,
  name: string,
  setRoomName: (newName: string) => void,
) => {
  // const { setOpen, setType, setBody } = useHintsSolutionModal();
  const { hintsSolutionModal: { setOpen, setType, setBody } } = useModalStore();
  const userId = useMemo(() => `user-${nanoid(4)}`, []);
  const supaClient = supabaseClient;

  // States
  const { latestCodeRef, dispatchConsole, dispatchAsync, dispatchCode } =
    useCodeStore();

  // States
  const { setOtherUsers, latestRoleRef } = useUsersStore();
  const editorRef = useNoteStore((state) => state.editorRef);

  // Refs and Utils
  const realTimeRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabaseClient.channel(roomId, {
      config: {
        broadcast: {
          self: false,
          ack: false,
        },
        presence: {
          key: userId,
        },
      },
    });

    // Broadcast
    channel
      .on(
        "broadcast",
        { event: EVENT.NEW_JOIN }, // Filtering events
        async (
          payload: Payload<{
            message: string;
          }>
        ) => {
          // toast(String(payload.payload?.message));

          // Send the latest code and note state to the new comer
          channel.send({
            type: "broadcast",
            event: EVENT.CODE_UPDATE,
            payload: {
              message: latestCodeRef.current,
            },
          });

          const noteData = await editorRef.current?.save();
          if (!noteData?.blocks.length) return;

          setTimeout(() => {
            channel.send({
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
            payload: newCode,
          });
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
            payload: status,
          });

          if (status === true) return;

          dispatchAsync({
            type: "SET_IS_COMPILING",
            payload: status,
          });
          dispatchConsole({
            type: "SET_CONSOLE_VISIBLE",
            payload: true,
          });
          dispatchConsole({
            type: "SET_CONSOLE_OUTPUT",
            payload: output,
          });
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
            payload: status,
          });
        }
      )
      .on(
        "broadcast",
        { event: EVENT.HINT_SOLUTION_SHOW }, // Filtering events
        ({
          payload,
        }: Payload<{
          type: HintsOrSolution;
          body: any;
        }>) => {
          const { type, body } = payload!;

          setOpen();
          setType(type);
          setBody(body);
        }
      )
      
    // Presence
    channel
      .on("presence", { event: "sync" }, async () => {
        const presenceState = channel.presenceState();
        const transformedState: Record<string, any> = {};

        for (const key in presenceState) {
          if (presenceState[key].length > 0) {
            transformedState[key] = presenceState[key][0];
          }
        }

        setOtherUsers(transformedState);

        const { data, error } = await supaClient
          .from("interview_rooms")
          .update({
            participants: transformedState,
          })
          .eq("room_id", roomId)
          .select();
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        toast.success(`${newPresences[0]["name"]} just joined!`);

        channel.send({
          type: "broadcast",
          event: EVENT.ROLE_SWAP,
          payload: {
            role: latestRoleRef.current,
          },
        });
      })
      .on("presence", { event: "leave" }, async ({ leftPresences }) => {
        toast.error(`${leftPresences[0]["name"]} just left!`);

        const presenceState = channel.presenceState();
        const transformedState: Record<string, any> = {};

        for (const key in presenceState) {
          if (presenceState[key].length > 0) {
            transformedState[key] = presenceState[key][0];
          }
        }

        const { data, error } = await supaClient
          .from("interview_rooms")
          .update({
            participants: transformedState,
          })
          .eq("room_id", roomId)
          .select();
      });

    // Postgres changes
    channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "interview_rooms",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        // @ts-ignore
        const { name } = payload["new"];
        setRoomName(name);
      }
    );

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        // Synchronized states between players
        const status = await channel.track({
          name,
          online_at: new Date().toISOString(),
        });

        // toast("Fetching code state from other players...");

        // Request the latest code state from other users
        channel.send({
          type: "broadcast",
          event: EVENT.NEW_JOIN,
          payload: {
            message: "Ayo guys may I have the code and note please 💀❓",
          },
        });
      }
    });

    realTimeRef.current = channel;

    return () => {
      channel.unsubscribe();
      supabaseClient.removeChannel(channel);
      realTimeRef.current = null;
    };
  }, []);

  return {
    realTimeRef,
    userId: userId,
  };
};

export default useRealTime;
