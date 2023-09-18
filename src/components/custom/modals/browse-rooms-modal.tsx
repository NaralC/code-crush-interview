// Components and UI
import { Input } from "@/components/ui/input";
import { Dices, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Modal from "@/components/ui/modal";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";

// Next.js/React Stuff
import { FC, useState } from "react";
import { useRouter } from "next/router";

// Hooks and Utility
import { generateUsername } from "@/lib/faker";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useModalStore from "@/stores/modal-store";
import supaClient from "@/lib/supa-client";
import { FaPython, FaReact } from "react-icons/fa";

const browseRoomSchema = z.object({
  username: z.string().min(1, {
    message: "Name cannot be empty",
  }),
});

const BrowseRoomsModal: FC<{ rooms: Room[] }> = ({ rooms }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    browseRoomsModal: { isOpen, setClose },
  } = useModalStore();
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>();

  const form = useForm<z.infer<typeof browseRoomSchema>>({
    resolver: zodResolver(browseRoomSchema),
  });

  const onSubmit = async (values: z.infer<typeof browseRoomSchema>) => {
    if (!selectedRoomId || !selectedRoomId.length) {
      toast.error("Select a room first");
      return;
    }

    // Check if room is full
    const { data, error } = await supaClient
      .from("interview_rooms")
      .select()
      .eq("room_id", selectedRoomId);

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

    setIsLoading(true);

    toast.success("Wallah! Redirecting you to it!");
    router.push({
      pathname: `/code/${selectedRoomId}`,
      query: {
        userName: "Posty",
      },
    });
  };

  const Card: FC<{ room: Room }> = ({ room }) => (
    <div
      className={cn(
        "px-4 py-2 border-2 rounded-lg shadow hover:cursor-pointer border-gray-500/25 ring-zinc-500 active:scale-[99%] transition-all hover:shadow-lg last:mb-0 mb-2 grid grid-cols-6 grid-rows-2",
        selectedRoomId === room.room_id ? "bg-black text-white" : ""
      )}
      key={room.room_id}
      onClick={() => setSelectedRoomId(room.room_id)}
    >
      <div className="col-span-4 grid-rows-1 truncate">{room.name}</div>
      <div className="col-span-1 grid-rows-1 text-right">
        {Object.keys(room.participants ?? {}).length} / 2
      </div>
      <div className="col-span-1 grid-rows-1">
        <div className="flex flex-col items-center">
          {room.type === "front_end" ? (
            <FaReact
              className={cn(
                "text-2xl transition-colors hover:animate-spin",
                selectedRoomId === room.room_id ? "text-teal-400" : ""
              )}
            />
          ) : (
            <FaPython
              className={cn(
                "text-2xl transition-colors",
                selectedRoomId === room.room_id ? "text-yellow-400" : ""
              )}
            />
          )}
        </div>
      </div>
      <div className="col-span-3 grid-rows-1 text-sm break-words">
        {room.description}
      </div>
      <div className="col-span-3 grid-rows-1 pr-5 text-xs text-right">
        <div>Created</div>
        <div>{room.created_at}</div>{" "}
      </div>
    </div>
  );

  return (
    <Modal
      title={"Browse Rooms"}
      isOpen={isOpen}
      setClose={setClose}
      className="max-h-[75vh] overflow-x-clip"
    >
      <>
        <ScrollArea className="max-h-[400px] w-full pr-4">
          {rooms.map((room) => (
            <Card
              room={{
                ...room,
                created_at: new Date(room.created_at!).toLocaleString(),
              }}
              key={room.room_id}
            />
          ))}
        </ScrollArea>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl className="select-none">
                      <div className="flex items-center justify-between">
                        <Input placeholder="Input your name" {...field} />
                        <Dices
                          className="ml-4 cursor-pointer w-7 h-7"
                          onClick={() => {
                            form.setValue("username", generateUsername());
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is how other players see you.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <Button
              disabled={isLoading}
              className="w-full"
              type="submit"
              onSubmit={(e) => e.preventDefault()}
            >
              Proceed
              {!!isLoading && <Loader2 className="ml-2 animate-spin" />}
            </Button>
          </form>
        </Form>
      </>
    </Modal>
  );
};

export default BrowseRoomsModal;
