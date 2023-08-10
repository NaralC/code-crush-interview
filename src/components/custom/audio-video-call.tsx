import { Toggle } from "@/components/ui/toggle";
import {
  Dispatch,
  FC,
  MutableRefObject,
  RefObject,
  SetStateAction,
} from "react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import Draggable from "react-draggable";

const AudioVideoCall: FC<{
  isMuted: boolean;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
  myVideo: RefObject<HTMLVideoElement>;
  partnerVideo: RefObject<HTMLVideoElement>;
}> = ({ isMuted, setIsMuted, myVideo, partnerVideo }) => {
  return (
    <Draggable>
      <div className="fixed inset-x-0 bottom-0 left-0 z-50 flex flex-col justify-around w-40 p-1 px-3 text-center bg-white border-2 shadow-2xl hover:cursor-grab ring-1 ring-zinc-300/75 rounded-xl h-72 border-zinc-50">
        {/* Myself */}
        <div className="w-full">
          Myself
          <video autoPlay ref={myVideo} muted={isMuted} />
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
      </div>
    </Draggable>
  );
};

export default AudioVideoCall;
