import * as React from "react";
import { EVENT } from "@/lib/constant";
import { Button } from "@/components/ui/button";
import UtilityBar from "@/components/custom/utility-bar";
import useWebRTC from "@/hooks/use-webrtc";
import useMousePosition from "@/hooks/use-mouse-position";
import useModalStore from "@/stores/modal-store";
import supabaseClient from "@/lib/supa-client";
import throttle from "lodash.throttle";
import toast from "react-hot-toast";
import Cursors from "@/components/custom/cursors";
import OutputConsole from "@/components/custom/output-console";
import HintsSolutionModal from "@/components/custom/modals/hints-solution-modal";
import EndInterviewModal from "@/components/custom/modals/end-interview-modal";
import Head from "next/head";
import AudioVideoCall from "@/components/custom/audio-video-call";
import Split from "react-split";
import NotionLikeEditor from "@/components/custom/editors/notion-like-editor";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { OutputData } from "@editorjs/editorjs";

import { useState, useRef, useEffect } from "react";
import { Mic, PhoneCall, X } from "lucide-react";
import Pusher, { Members, PresenceChannel } from "pusher-js";
import { useRouter } from "next/router";
import { Collapse } from "@chakra-ui/transition";
import { useToast } from "@/hooks/use-toast";
import Draggable from "react-draggable";
import { cn } from "@/lib/utils";

function VoiceCall({
  username,
  roomName,
}: {
  username: string;
  roomName: string;
}) {
  // Generic states
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const onToggle = () => setIsOpen((prev) => !prev);

  // Generic refs
  const host = useRef(false);
  const router = useRouter();

  // Pusher specific refs
  const pusherRef = useRef<Pusher>();
  const channelRef = useRef<PresenceChannel>();
  // Pusher.logToConsole = true;

  // Webrtc refs
  const rtcConnection = useRef<RTCPeerConnection | null>();
  const myStream = useRef<MediaStream>();

  const myVideo = useRef<HTMLVideoElement>(null);
  const partnerVideo = useRef<HTMLVideoElement>(null);

  const effectRan = useRef(false);
  const mediaIsGrabbed = useRef(false);
  useEffect(() => {
    const init = () => {
      pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_KEY!, {
        authEndpoint: "/api/pusher/auth",
        auth: {
          params: { username },
        },
        cluster: process.env.NEXT_PUBLIC_CLUSTER!,
      });

      channelRef.current = pusherRef.current.subscribe(
        `presence-${roomName}`
      ) as PresenceChannel;

      channelRef.current.bind(
        "pusher:subscription_succeeded",
        (members: Members) => {
          if (members.count === 1) {
            // when subscribing, if you are the first member, you are the host
            host.current = true;

            toast({
              title: "Connected To Audio/Video Call!",
            });
          }

          // example only supports 2 users per call
          if (members.count > 2) {
            // 3+ person joining will get sent back home
            toast({
              title: "Room already full",
              variant: "destructive",
            });

            router.push("/");
            return;
          }
          handleRoomJoined();
        }
      );

      // For the host to accept call
      channelRef.current.bind("client-ready", () => {
        initiateCall();
      });

      // For the non-host to accept call
      channelRef.current.bind(
        "client-offer",
        (offer: RTCSessionDescriptionInit) => {
          // offer is sent by the host, so only non-host should handle it
          if (!host.current) {
            handleReceivedOffer(offer);
          }
        }
      );

      // When receiving this event, the non-host user will call the handleReceivedOffer method and pass it the Offer object
      channelRef.current.bind(
        "client-answer",
        (answer: RTCSessionDescriptionInit) => {
          // answer is sent by non-host, so only host should handle it
          if (host.current) {
            handleAnswerReceived(answer as RTCSessionDescriptionInit);
          }
        }
      );

      // Once the non-host sends the answer, the host is listening for the client-answer event and calls the handleAnswerReceived method
      channelRef.current.bind(
        "client-answer",
        (answer: RTCSessionDescriptionInit) => {
          // answer is sent by non-host, so only host should handle it
          if (host.current) {
            handleAnswerReceived(answer as RTCSessionDescriptionInit);
          }
        }
      );

      // When we create the RTCPeerConnection, it provides us with two (among others) events to subscribe to
      channelRef.current.bind(
        "client-ice-candidate",
        (iceCandidate: RTCIceCandidate) => {
          // answer is sent by non-host, so only host should handle it
          handlerNewIceCandidateMsg(iceCandidate);
        }
      );

      // when a member leaves the chat
      channelRef.current.bind("pusher:member_removed", () => {
        handlePeerLeaving();
      });
    };

    if (effectRan.current === false) {
      init();
      effectRan.current = true;
    }

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
        console.log(stream);
        /* store reference to the stream and provide it to the video element */
        myStream.current = stream;
        myVideo.current!.srcObject = stream;
        myVideo.current!.onloadedmetadata = () => {
          myVideo.current!.play();
        };
        if (!host.current) {
          // the 2nd peer joining will tell to host they are ready
          channelRef.current!.trigger("client-ready", {});
        }

        mediaIsGrabbed.current = true;
      })
      .catch((err) => {
        /* handle the error */
        console.log(err);
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
          channelRef.current?.trigger("client-offer", offer);
          toast({
            title: "Peer has connected!",
          });
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
        channelRef.current?.trigger("client-answer", answer);
        toast({
          title: "Connected To Audio/Video Call!",
        });
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
      channelRef.current?.trigger("client-ice-candidate", event.candidate);
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
      toast({
        title: "Peer Disconnected From Audio/Video Call",
      });
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

    // Unbind all events from the channel
    if (channelRef.current) {
      channelRef.current.unbind_all();
    }

    // Unsubscribe from the channel
    if (pusherRef.current && channelRef.current) {
      pusherRef.current.unsubscribe(channelRef.current.name);
    }

    // Disconnect the Pusher client
    if (pusherRef.current) {
      pusherRef.current.disconnect();
    }

    router.push("/");
  };

  const ICE_SERVERS = {
    // you can add TURN servers here too
    iceServers: [
      {
        urls: "stun:openrelay.metered.ca:80",
      },
      {
        urls: "stun:stun.l.google.com:19302",
      },
      {
        urls: "stun:stun2.l.google.com:19302",
      },
    ],
  };

  return (
    // <Draggable>
    <div className="fixed z-40 shadow bg-slate-900 text-white rounded-lg shadow-white bottom-[72px] left-5 w-fit cursor-grab">
      <Button className={cn(isOpen ? "hidden" : "")} onClick={onToggle}>
        <PhoneCall />
      </Button>
      <Collapse in={isOpen} startingHeight={0}>
        <div className="flex flex-col items-center justify-center gap-2 p-2">
          <Button
            variant="ghost"
            className="absolute shadow-none right-2 top-2"
            onClick={onToggle}
            size="closeDialog"
          >
            <X />
            <span className="sr-only">Close</span>
          </Button>

          <div className="w-32 overflow-y-auto max-h-32">
            <p className="text-xl">Myself</p>
            <video autoPlay ref={myVideo} muted />
          </div>
          <div className="w-32 overflow-y-auto max-h-32">
            <p className="text-xl">Peer</p>
            <video autoPlay ref={partnerVideo} />
          </div>
        </div>
      </Collapse>
    </div>
    // </Draggable>
  );
}

type Props = React.PropsWithChildren<{
  roomId: string;
  userName: string;
  fnToRunOnMount: () => void;
  isFinished: boolean;
  questions: Question[];
  initialNoteState: OutputData;
  userId: string;
  realTimeRef: React.MutableRefObject<RealtimeChannel | null>;
  roomName: string;
  type: InterviewType;
}>;

const CodingLayout: React.FC<Props> = ({
  children, // This is the text editor
  fnToRunOnMount,
  isFinished,
  roomId,
  userName,
  initialNoteState,
  questions,
  realTimeRef,
  userId,
  roomName,
  type,
}) => {
  // States
  const { x, y } = useMousePosition();
  const {
    endInterviewModal: { setOpen, setClose },
  } = useModalStore();
  const supa = supabaseClient;

  const sendMousePosition = throttle(() => {
    realTimeRef.current?.send({
      type: "broadcast",
      event: EVENT.MOUSE_UPDATE,
      payload: { x, y, userName, userId },
    });
  }, 200);

  const effectRan = React.useRef(false);
  React.useEffect(() => {
    if (effectRan.current === false) {
      fnToRunOnMount();

      if (isFinished)
        toast(
          "This interview is marked as finished. Editing text is no longer allowed.",
          { duration: 4000 }
        );
    }

    return () => {
      effectRan.current = true;
    };
  }, []);

  const handleEndInterview = async () => {
    const { error } = await supa
      .from("interview_rooms")
      .update({
        finished: true,
      })
      .eq("room_id", roomId)
      .select();

    if (error) toast.error("Could not end interview.");
    setClose();
  };

  return (
    <>
      <Head>
        <title>Interview Time!</title>
        <meta name="Code Crush" content="Code Crush" />
      </Head>

      <main
        className="flex flex-col w-full h-screen inter-font"
        onMouseMove={sendMousePosition}
      >
        <Cursors realTimeRef={realTimeRef} />
        <UtilityBar
          realTimeRef={realTimeRef}
          roomName={roomName}
          roomId={roomId}
          finished={false}
          type={type}
        />
        <Split className="flex flex-row h-screen p-12 cursor-grab bg-gradient-to-b from-black via-slate-900 to-slate-800">
          <div className="w-full overflow-y-auto bg-black rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
            {children}
          </div>
          <div className="w-full bg-white rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
            <NotionLikeEditor
              realTimeRef={realTimeRef}
              questions={questions}
              finished={isFinished}
              initialNoteData={initialNoteState}
            />
          </div>
        </Split>
        <OutputConsole />
        {/* {!isFinished && <AudioVideoCall realTimeRef={realTimeRef} />} */}
      </main>

      <VoiceCall roomName={roomId} username={userName} />
      <HintsSolutionModal />
      <EndInterviewModal handleEndInterview={handleEndInterview} />
      {!isFinished && (
        <Button
          className="fixed z-40 shadow bottom-5 left-5 shadow-white"
          onClick={setOpen}
        >
          End Interview
        </Button>
      )}
    </>
  );
};

export default CodingLayout;
