import { FC, useState } from "react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import { Dices, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import supabaseClient from "@/lib/supa-client";
import useModalStore from "@/stores/modal-store";
import { generateUsername } from "@/lib/faker";
import { useMutation } from "@tanstack/react-query";

const joinRoomSchemaFrontend = z.object({
  roomId: z.string().min(1, {
    message: "Room ID cannot be empty.",
  }),
  userName: z.string().min(1, {
    message: "Name cannot be empty",
  }),
});

const JoinRoomModal: FC<{ rooms: Room[] }> = ({ rooms }) => {
  const {
    joinRoomModal: { isOpen, setOpen, setClose },
  } = useModalStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof joinRoomSchemaFrontend>>({
    resolver: zodResolver(joinRoomSchemaFrontend),
    defaultValues: {
      roomId: "",
    },
  });

  const { mutate: joinRoom, isLoading: isJoiningRoom } = useMutation({
    mutationKey: ["join-room-by-id"],
    mutationFn: async (values: z.infer<typeof joinRoomSchemaFrontend>) => {
      const response = await fetch(`/api/db?roomId=${values.roomId}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.content || "Either the room is full or it doesn't exist.");
      }

      const { content: type } = await response.json();
      return { type: type as string, roomId: values.roomId };
    },
    onSuccess: (data) => {
      toast.success("Wallah! Redirecting you to it!");
      router.push({
        pathname: `/code/${
          data!.type === "ds_algo" ? "ds-algo" : "front-end"
        }/${data!.roomId}`,
        query: {
          userName: form.getValues().userName,
        },
      });
    },
    onError: (error) => {
      toast.error((error as Error).message);
    }
  });

  return (
    <Modal
      title="Join a Room"
      description="Powered by Web Sockets"
      isOpen={isOpen}
      setClose={setClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => joinRoom(values))}
          className="space-y-8"
        >
          <div className="grid items-center w-full gap-5">
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Room ID</FormLabel>
                    <FormControl className="select-none">
                      <Input
                        placeholder="Input your name"
                        {...field}
                        disabled={isJoiningRoom}
                      />
                    </FormControl>
                    <FormDescription>Join a room by its id.</FormDescription>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl className="select-none">
                      <div className="flex items-center justify-between">
                        <Input
                          placeholder="Input your name"
                          {...field}
                          disabled={isJoiningRoom}
                        />
                        <Dices
                          className="ml-4 cursor-pointer w-7 h-7"
                          onClick={() => {
                            form.setValue("userName", generateUsername());
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
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default JoinRoomModal;
