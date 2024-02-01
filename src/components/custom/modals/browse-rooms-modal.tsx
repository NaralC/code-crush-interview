// Components and UI
import { Input } from "@/components/ui/input";
import { Dices, Loader2, Mic, MicOff } from "lucide-react";
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
import { FaPython, FaReact, FaAngular, FaVuejs } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";

const browseRoomSchema = z.object({
  username: z.string().min(1),
});

const BrowseRoomsModal: FC<{ rooms: Room[] }> = ({ rooms }) => {
  const {
    browseRoomsModal: { isOpen, setClose },
  } = useModalStore();
  const router = useRouter();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof browseRoomSchema>>({
    resolver: zodResolver(browseRoomSchema),
  });

  const { mutate: joinRoom, isLoading: isJoiningRoom } = useMutation({
    mutationKey: ["join-room-by-id"],
    mutationFn: async (values: z.infer<typeof browseRoomSchema>) => {
      if (!selectedRoomId) throw new Error("Select a room first")

      const response = await fetch(`/api/db?roomId=${selectedRoomId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.content || "Either the room is full or it doesn't exist.");
      }

      const { content: type } = await response.json();
      return { type: type as string, roomId: selectedRoomId };
    },
    onSuccess: (data) => {
      toast.success("Wallah! Redirecting you to it!");
      router.push({
        pathname: `/code/${
          data!.type === "ds_algo" ? "ds-algo" : "front-end"
        }/${data!.roomId}`,
        query: {
          userName: form.getValues().username,
        },
      });
    },
    onError: (error) => {
      toast.error((error as Error).message);
    }
  });

  const Card: FC<{ room: Room }> = ({ room }) => (
    <div
      className={cn(
        "pl-4 py-2 border-2 rounded-lg shadow hover:cursor-pointer border-gray-500/25 ring-zinc-500 active:scale-[99%] transition-all hover:shadow-lg last:mb-0 mb-2 grid grid-cols-6 grid-rows-2",
        selectedRoomId === room.room_id ? "bg-black text-white" : ""
      )}
      key={room.room_id}
      onClick={() => setSelectedRoomId(room.room_id)}
    >
      <div className="col-span-4 grid-rows-1 truncate">{room.name}</div>
      <div className="col-span-1 grid-rows-1 mr-2 text-right">
        {Object.keys(room.participants ?? {}).length} / 2
      </div>
      <div className="flex col-span-1 grid-rows-1 gap-1">
        <div className="flex flex-col items-center">
          {room.type === "front_end" ? (
            room.front_end_type === "react" ? (
              <FaReact
                className={cn(
                  "text-2xl transition-colors hover:animate-spin",
                  selectedRoomId === room.room_id ? "text-teal-400" : ""
                )}
              />
            ) : room.front_end_type === "angular" ? (
              <FaAngular
                className={cn(
                  "text-2xl transition-colors",
                  selectedRoomId === room.room_id ? "text-red-500" : ""
                )}
              />
            ) : (
              <FaVuejs
                className={cn(
                  "text-2xl transition-colors",
                  selectedRoomId === room.room_id ? "text-green-500" : ""
                )}
              />
            )
          ) : (
            <FaPython
              className={cn(
                "text-2xl transition-colors",
                selectedRoomId === room.room_id ? "text-yellow-400" : ""
              )}
            />
          )}
        </div>
        <div>
          {room.enable_voice_call ? (
            <Mic className="text-green-500" />
          ) : (
            <MicOff className="text-red-500" />
          )}
        </div>
      </div>
      <div className="col-span-3 grid-rows-1 text-sm break-words">
        {room.description}
      </div>
      <div className="col-span-3 grid-rows-1 pr-5 text-xs text-right">
        <div className={room.finished ? "text-red-500" : ""}>
          Status: {room.finished ? "Finished" : "Ongoing"}
        </div>
        <div>Created {room.created_at}</div>
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
        <ScrollArea className="max-h-[400px] w-full pr-4" data-cy="room-scroll-area">
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
          <form onSubmit={form.handleSubmit((values) => joinRoom(values))} className="space-y-4">
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
                          data-cy="randomizer-dice"
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
              disabled={isJoiningRoom}
              className="w-full"
              type="submit"
              onSubmit={(e) => e.preventDefault()}
              data-cy="submit"
            >
              Proceed
              {!!isJoiningRoom && <Loader2 className="ml-2 animate-spin" />}
            </Button>
          </form>
        </Form>
      </>
    </Modal>
  );
};

export default BrowseRoomsModal;
