import supabaseClient from "@/lib/supa-client";

const EVENT = {
  NEW_JOIN: "new-join",
  CLICK: "click",
};

const useBroadcast = () => {
  const broadcastChannel = supabaseClient.channel("room-1", {
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
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        joinFunction();
      }
    });

  // Publish
  const joinFunction = () => {
    broadcastChannel.send({
      type: "broadcast",
      event: EVENT.NEW_JOIN,
      payload: {
        message: "someone just joined lmao",
      },
    });
  };

  const clickFunction = () => {
    broadcastChannel.send({
      type: "broadcast",
      event: EVENT.CLICK,
      payload: {
        message: "who the fuck clicked",
      },
    });
  };

  // TODO: Clean up when leave
  const cleanUp = () => {
    broadcastChannel.subscribe();
    supabaseClient.removeChannel(broadcastChannel);
  };

  return { broadcastChannel, clickFunction };
};

export default useBroadcast;
