/* eslint-disable react-hooks/exhaustive-deps */
import supabaseClient from "@/lib/supa-client";
import { nanoid } from "nanoid";
import { faker } from "@faker-js/faker";
import toast from "react-hot-toast";
import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useSharedState from "@/context/shared-state";
import { RealtimeChannel } from "@supabase/supabase-js";

const usePresence = (roomId: string) => {
  // State & Utility
  const { updateUsersList } = useSharedState();
  const name = faker.person.firstName();

  const presenceChannelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const presenceChannel = supabaseClient.channel(`presence-${roomId}`, {
      config: {
        presence: {
          key: name,
        },
      },
    });

    // State update when peer joins
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        console.log("Online users: ", presenceChannel.presenceState());
        updateUsersList(presenceChannel.presenceState());
      })
      .on("presence", { event: "join" }, ({ newPresences }) => {
        toast.success(`${newPresences[0]["name"]} just joined!`);
      })
      .on("presence", { event: "leave" }, ({ leftPresences }) => {
        toast.error(`${leftPresences[0]["name"]} just left!`);
      });

    presenceChannel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const status = await presenceChannel.track({ name });
        // console.log(status);
      }
    });

    presenceChannelRef.current = presenceChannel;

    return () => {
      presenceChannel.unsubscribe();
      presenceChannelRef.current = null;
    };
  }, []);

  return presenceChannelRef;
};

export default usePresence;
