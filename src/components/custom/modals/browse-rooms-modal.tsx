import { FC } from "react";
import Modal from "@/components/ui/modal";
import useModalStore from "@/stores/modal-store";
import supaClient from "@/lib/supa-client";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const BrowseRoomsModal: FC<{ rooms: Room[] }> = ({ rooms }) => {
  const {
    browseRoomsModal: { isOpen, setClose },
  } = useModalStore();
  const router = useRouter();

  const handleJoinRoom = async (id: string) => {
    // Check if room is full
    const { data, error } = await supaClient
      .from("interview_rooms")
      .select()
      .eq("room_id", id);

    if (!data) {
      toast.error("Room doesn't exist :(");
      return;
    }

    const { participants } = data[0];

    if (participants) {
      const userCount = Object.keys(participants!).length;

      if (userCount >= 2) {
        toast.error("Room already full. :(");
        return;
      }
    }

    toast.success("Wallah! Redirecting you to it!");
    router.push({
      pathname: `/code/${id}`,
      query: {
        userName: "Posty",
      },
    });
  };

  return (
    <Modal
      title={"Browse Rooms"}
      isOpen={isOpen}
      setClose={setClose}
      className="max-h-[75vh]"
    >
      <div className="flex flex-col gap-3 pr-1 rounded-md">
        {rooms.map((room) => (
          <div
            className="p-2 border-2 rounded-lg shadow hover:cursor-pointer border-gray-500/25 ring-zinc-500 active:scale-[99%] transition hover:shadow-lg"
            key={room.room_id}
            onClick={() => handleJoinRoom(room.room_id)}
          >
            <div>{room.created_at}</div>
            <div>{room.description}</div>
            <div>{room.name}</div>
            <div>{JSON.stringify(room.participants)}</div>
            <div>{room.type}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default BrowseRoomsModal;
