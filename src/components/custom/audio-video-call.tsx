import * as React from "react";
import Draggable from "react-draggable";
import useWebRTC from "@/hooks/use-webrtc";
import { Toggle } from "@/components/ui/toggle";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { EVENT } from "@/lib/constant";

const AudioVideoCall: React.FC<{
  realTimeRef: React.MutableRefObject<RealtimeChannel | null>;
}> = ({ realTimeRef }) => {
  const { myVideo, partnerVideo, host } = useWebRTC(realTimeRef);
  const [isMuted, setIsMuted] = React.useState<boolean>(false);

  // React.useEffect(() => console.log(partnerVideo), [partnerVideo]);
  // React.useEffect(() => console.log(myVideo), [myVideo]);

  return (
    <Draggable bounds="parent">
      <div className="fixed inset-x-0 bottom-0 left-0 z-50 flex flex-col justify-around w-40 p-1 px-3 text-center bg-white border-2 shadow-2xl hover:cursor-grab ring-1 ring-zinc-300/75 rounded-xl h-72 border-zinc-50">
        {/* Myself */}
        <div className="w-full">
          Myself
          <video autoPlay ref={myVideo} muted />
          <Toggle
            variant="audio_control"
            aria-label="Toggle mic"
            pressed={isMuted}
            onPressedChange={() => setIsMuted((prev) => !prev)}
            className="w-8 h-8 p-2"
          >
            {!isMuted ? <Mic /> : <MicOff />}
          </Toggle>
          <Toggle
            variant="audio_control"
            aria-label="Toggle video"
            pressed={isMuted}
            onPressedChange={() => setIsMuted((prev) => !prev)}
            className="w-8 h-8 p-2"
          >
            {!isMuted ? <Video /> : <VideoOff />}
          </Toggle>
        </div>

        {/* Peer */}
        <div>
          Peer
          <video autoPlay ref={partnerVideo} />
          <Toggle
            variant="audio_control"
            aria-label="Toggle mic"
            pressed={isMuted}
            onPressedChange={() => setIsMuted((prev) => !prev)}
            className="w-8 h-8 p-2"
          >
            {!isMuted ? <Mic /> : <MicOff />}
          </Toggle>
          <Toggle
            variant="audio_control"
            aria-label="Toggle video"
            pressed={isMuted}
            onPressedChange={() => setIsMuted((prev) => !prev)}
            className="w-8 h-8 p-2"
          >
            {!isMuted ? <Video /> : <VideoOff />}
          </Toggle>
        </div>

        <button
        onClick={() => {
          realTimeRef.current?.send({
            type: "broadcast",
            event: EVENT.CLIENT_READY,
            payload: {},
          });
        }}
      >
        send offer
      </button>
      </div>
    </Draggable>
  );
};

export default AudioVideoCall;
