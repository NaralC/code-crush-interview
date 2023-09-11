import { EVENT, ICE_SERVERS } from "@/lib/constant";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { MutableRefObject, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const useWebRTC = (realTimeRef: MutableRefObject<RealtimeChannel | null>) => {
  // Generic refs (local)
  const host = useRef(false);
  const router = useRouter();
  const mediaIsGrabbed = useRef(false);

  // Webrtc refs (local)
  const rtcConnection = useRef<RTCPeerConnection | null>();
  const myStream = useRef<MediaStream>();

  // Refs for A/V feed, exposed to the outside
  const myVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!realTimeRef.current) {
      toast.error("Failed to establish audio/voice call.");

      setTimeout(() => {
        router.push("/");
      }, 1000);
      return;
    }

    // TODO:
    realTimeRef.current.on("presence", { event: "sync" }, () => {
      const usersCount = Object.values(
        realTimeRef.current!.presenceState()
      ).length;

      if (usersCount === 1) {
        // when subscribing, if you are the first member, you are the host
        host.current = true;
        toast("You are the host!");
      }

      // example only supports 2 users per call
      else if (usersCount > 2) {
        // 3rd+ person joining will get sent back home
        // toast.error("Room already full.");
        // router.push("/");
        return;
      }
      handleRoomJoined();
    });

    // TODO:
    // For the host to accept call
    realTimeRef.current.on(
      "broadcast",
      { event: EVENT.CLIENT_READY }, // Filtering events
      () => {
        console.log("client ready!");
        initiateCall();
      }
    );

    // TODO:
    // For the non-host to accept call
    realTimeRef.current.on(
      "broadcast",
      { event: EVENT.CLIENT_OFFER },
      (
        payload: Payload<{
          offer: RTCSessionDescriptionInit;
        }>
      ) => {
        const { offer } = payload.payload!;

        // offer is sent by the host, so only non-host should handle it
        if (!host.current) {
          handleReceivedOffer(offer);
        }
      }
    );

    // TODO:
    // When receiving this event, the non-host user will call the handleReceivedOffer method and pass it the Offer object
    realTimeRef.current.on(
      "broadcast",
      { event: EVENT.CLIENT_ANSWER }, // Filtering events
      (
        payload: Payload<{
          answer: RTCSessionDescriptionInit;
        }>
      ) => {
        const { answer } = payload.payload!;
        console.log(answer);

        // answer is sent by non-host, so only host should handle it
        if (host.current) {
          handleAnswerReceived(answer as RTCSessionDescriptionInit);
        }
      }
    );

    // TODO:
    // Once the non-host sends the answer, the host is listening for the client-answer event and calls the handleAnswerReceived method
    realTimeRef.current.on(
      "broadcast",
      { event: EVENT.CLIENT_ANSWER }, // Filtering events
      (
        payload: Payload<{
          answer: RTCSessionDescriptionInit;
        }>
      ) => {
        const { answer } = payload.payload!;
        console.log(answer);

        // answer is sent by non-host, so only host should handle it
        if (host.current) {
          handleAnswerReceived(answer as RTCSessionDescriptionInit);
        }
      }
    );

    // TODO:
    // When we create the RTCPeerConnection, it provides us with two (among others) events to subscribe to
    realTimeRef.current.on(
      "broadcast",
      { event: EVENT.CLIENT_ICE_CANDIDATE }, // Filtering events
      (
        payload: Payload<{
          iceCandidate: RTCIceCandidate;
        }>
      ) => {
        const { iceCandidate } = payload.payload!;
        console.log(iceCandidate);

        // answer is sent by non-host, so only host should handle it
        handlerNewIceCandidateMsg(iceCandidate);
      }
    );

    // TODO:
    // when a member leaves the chat
    realTimeRef.current.on(
      "presence",
      { event: "leave" },
      ({ leftPresences }) => {
        handlePeerLeaving();
      }
    );

    return () => {
      if (mediaIsGrabbed.current === true) {
        leaveRoom();
      }
    };
  }, []);

  const handleRoomJoined = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: { width: 1280, height: 720 },
      })
      .then((stream) => {
        /* store reference to the stream and provide it to the video element */
        myStream.current = stream;
        myVideo.current!.srcObject = stream;
        myVideo.current!.onloadedmetadata = () => {
          myVideo.current!.play();
        };
        if (!host.current) {
          // the 2nd peer joining will tell to host they are ready
          // TODO:
          realTimeRef.current?.send({
            type: "broadcast",
            event: EVENT.CLIENT_READY,
            payload: {},
          });
          // channelRef.current!.trigger("client-ready", {});
        }

        mediaIsGrabbed.current = true;
      })
      .catch((err) => {
        /* handle the error */
        console.log((err as Error).message);
      });
  };

  const createPeerConnection = () => {
    // We create a RTC Peer Connection
    const connection = new RTCPeerConnection(ICE_SERVERS);

    // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
    connection.onicecandidate = handleICECandidateEvent;

    // We implement our onTrack method for when we receive tracks
    connection.ontrack = handleTrackEvent;
    connection.onicecandidateerror = (e) => console.log(e);
    return connection;
  };

  const initiateCall = () => {
    if (host.current) {
      rtcConnection.current = createPeerConnection();
      // Host creates offer
      myStream.current?.getTracks().forEach((track) => {
        rtcConnection.current?.addTrack(track, myStream.current!);
      });
      rtcConnection
        .current!.createOffer()
        .then((offer) => {
          rtcConnection.current!.setLocalDescription(offer);
          // 4. Send offer to other peer via pusher
          // Note: 'client-' prefix means this event is not being sent directly from the client
          // This options needs to be turned on in Pusher app settings
          // TODO:
          realTimeRef.current?.send({
            type: "broadcast",
            event: EVENT.CLIENT_OFFER,
            payload: {
              offer,
            },
          });

          toast("Peer has connected!");
          // channelRef.current?.trigger("client-offer", offer);
          // toast({
          //   title: "Peer has connected!",
          // });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleReceivedOffer = (offer: RTCSessionDescriptionInit) => {
    rtcConnection.current = createPeerConnection();
    myStream.current?.getTracks().forEach((track) => {
      // Adding tracks to the RTCPeerConnection to give peer access to it
      rtcConnection.current?.addTrack(track, myStream.current!);
    });

    rtcConnection.current.setRemoteDescription(offer);
    rtcConnection.current
      .createAnswer()
      .then((answer) => {
        rtcConnection.current!.setLocalDescription(answer);
        // TODO:
        realTimeRef.current?.send({
          type: "broadcast",
          event: EVENT.CLIENT_ANSWER,
          payload: {
            answer,
          },
        });

        // channelRef.current?.trigger("client-answer", answer);
        // toast({
        //   title: "Joined as non-host!",
        // });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleAnswerReceived = (answer: RTCSessionDescriptionInit) => {
    rtcConnection
      .current!.setRemoteDescription(answer)
      .catch((error) => console.log(error));
  };

  const handleICECandidateEvent = async (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      // return sentToPusher('ice-candidate', event.candidate)
      // TODO:
      realTimeRef.current?.send({
        type: "broadcast",
        event: EVENT.CLIENT_ICE_CANDIDATE,
        payload: {
          iceCandidate: event.candidate,
        },
      });

      // channelRef.current?.trigger("client-ice-candidate", event.candidate);
    }
  };

  const handlerNewIceCandidateMsg = (incoming: RTCIceCandidate) => {
    // We cast the incoming candidate to RTCIceCandidate
    const candidate = new RTCIceCandidate(incoming);
    rtcConnection
      .current!.addIceCandidate(candidate)
      .catch((error) => console.log(error));
  };

  const handleTrackEvent = (event: RTCTrackEvent) => {
    partnerVideo.current!.srcObject = event.streams[0];
  };

  const handlePeerLeaving = () => {
    host.current = true;

    if (partnerVideo.current?.srcObject) {
      (partnerVideo.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop()); // Stops receiving all track of Peer.
    }

    // Safely closes the existing connection established with the peer who left.
    if (rtcConnection.current) {
      rtcConnection.current.ontrack = null;
      rtcConnection.current.onicecandidate = null;
      rtcConnection.current.close();
      rtcConnection.current = null;
      // toast({
      //   title: "Peer has disconnected. You're now the host",
      // });
    }
  };

  const leaveRoom = () => {
    if (myVideo.current && myVideo.current!.srcObject) {
      (myVideo.current!.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop()); // Stops sending all tracks of User.
    }
    if (partnerVideo.current && partnerVideo.current!.srcObject) {
      (partnerVideo.current!.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop()); // Stops receiving all tracks from Peer.
    }

    // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
    if (rtcConnection.current) {
      rtcConnection.current.ontrack = null;
      rtcConnection.current.onicecandidate = null;
      rtcConnection.current.close();
      rtcConnection.current = null;
    }

    realTimeRef.current?.unsubscribe();

    if (realTimeRef.current) {
      realTimeRef.current.unsubscribe();
      realTimeRef.current.untrack();
    }

    router.push("/");
  };

  return {
    myVideo,
    partnerVideo,
    myStream,
    rtcConnection,
    host
  };
};

export default useWebRTC;
