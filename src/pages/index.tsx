import { Button } from "@/components/ui/button";
import { useCreateRoomModal } from "@/hooks/use-create-room-modal";
import { useFeedbackModal } from "@/hooks/use-feedback-modal";
import { useJoinRoomModal } from "@/hooks/use-join-room-modal";

export default function Home() {
  const createRoomModal = useCreateRoomModal();
  const joinRoomModal = useJoinRoomModal();
  const feedbackModal = useFeedbackModal();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 xl:container">
      <p className="font-bold text-center text-8xl">Code Crush</p>
      <p className="mb-8 text-4xl font-normal text-center text-balance">
        Interviewing — the ultimate leverage for career progression.
        Period.
      </p>
      <div className="flex flex-row items-center justify-between space-x-5">
        <Button
          onClick={() => {
            createRoomModal.setOpen();
          }}
        >
          Create a Room
        </Button>
        <Button
          onClick={() => {
            joinRoomModal.setOpen();
          }}
        >
          Join a Room
        </Button>
        <Button
          onClick={() => {
            feedbackModal.setOpen();
          }}
        >
          Leave Feedback
        </Button>
      </div>
    </main>
  );
}
