import supabaseClient from "@/lib/supa-client";
import { nanoid } from "nanoid";

const usePresence = () => {
  const id = `user-${nanoid(5)}`;

  const presenceChannel = supabaseClient.channel("room-2", {
    config: {
      presence: {
        key: id,
      },
    },
  });

  // State update when peer joins
  presenceChannel
    .on("presence", { event: "sync" }, () => {
      console.log("Online users: ", presenceChannel.presenceState());
    })
    .on("presence", { event: "join" }, ({ newPresences }) => {
      console.log("New users have joined: ", newPresences);
    })
    .on("presence", { event: "leave" }, ({ leftPresences }) => {
      console.log("Users have left: ", leftPresences);
    });

  presenceChannel.subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      const status = await presenceChannel.track({ user_id: 1 });
      console.log(status);
    }
  });
};

export default usePresence;
