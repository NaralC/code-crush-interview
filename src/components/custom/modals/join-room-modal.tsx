import { FC } from "react";
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
import { useJoinRoomModal } from "@/hooks/use-join-room-modal";

const joinRoomSchemaFrontend = z.object({
  roomId: z.string().min(1, {
    message: "Room ID cannot be empty.",
  }),
});

const JoinRoomModal: FC = () => {
  const { isOpen, setOpen, setClose } = useJoinRoomModal();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof joinRoomSchemaFrontend>>({
    resolver: zodResolver(joinRoomSchemaFrontend),
    defaultValues: {
      roomId: "d7a1af15-4fea-4207-98e6-b3a97e42f19a",
    },
  });

  const onSubmit = async (values: z.infer<typeof joinRoomSchemaFrontend>) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Modal
      title="Join an Interview Room"
      description="Powered by Pusher"
      isOpen={isOpen}
      setOpen={setOpen}
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
                    <FormControl>
                      <Input placeholder="Input room ID" {...field} />
                    </FormControl>
                    <FormDescription>Join a room by its id.</FormDescription>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <Button className="w-full" type="submit">
              Proceed
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default JoinRoomModal;
