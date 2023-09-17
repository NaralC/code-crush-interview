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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import { useJoinRoomModal } from "@/hooks/modals/use-join-room-modal";
import { DEFAULT_ROOM_ID } from "@/lib/constant";
import { Badge } from "@/components/ui/badge";
import { Dices, Loader2 } from "lucide-react";
import { faker } from "@faker-js/faker";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import supabaseClient from "@/lib/supa-client";

const joinRoomSchemaFrontend = z.object({
  roomId: z.string().min(1, {
    message: "Room ID cannot be empty.",
  }),
  userName: z.string({
    required_error: "Name cannot be empty",
  }),
});

const JoinRoomModal: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isOpen, setOpen, setClose } = useJoinRoomModal();
  const { toast: debugToast } = useToast();
  const router = useRouter();
  const supaClient = supabaseClient;

  const form = useForm<z.infer<typeof joinRoomSchemaFrontend>>({
    resolver: zodResolver(joinRoomSchemaFrontend),
    defaultValues: {
      roomId: DEFAULT_ROOM_ID,
    },
  });

  const onSubmit = async (values: z.infer<typeof joinRoomSchemaFrontend>) => {
    // debugToast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    // });

    // Check if room is full
    const { data } = await supaClient
      .from("interview_rooms")
      .select("*")
      .eq("room_id", values.roomId);

    const { participants } = data![0];

    if (participants) {
      const userCount = Object.keys(participants!).length;

      if (userCount >= 2) {
        toast.error("Room already full. :(");
        return;
      }
    }

    toast.success("Wallah! Redirecting you to it!");
    router.push({
      pathname: `/code/${values.roomId}`,
      query: {
        userName: values.userName,
      },
    });

    setIsLoading(true);

    // setTimeout(() => {
    //   setIsLoading(false);
    //   setClose();
    // }, 500);
  };

  return (
    <Modal
      title="Join an Interview Room"
      description="Powered by Web Sockets"
      isOpen={isOpen}
      setClose={setClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid items-center w-full gap-5">
            <FormField
              control={form.control}
              name="roomId"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Room ID</FormLabel>
                    <FormControl className="select-none">
                      <Input placeholder="Input your name" {...field} />
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
                        <Input placeholder="Input your name" {...field} />
                        <Dices
                          className="ml-4 cursor-pointer w-7 h-7"
                          onClick={() => {
                            form.setValue(
                              "userName",
                              faker.internet.userName()
                            );
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
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default JoinRoomModal;
