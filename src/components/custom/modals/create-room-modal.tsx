import { FC } from "react";
import { useCreateRoomModal } from "@/hooks/use-create-room-modal";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FaPython, FaReact } from "react-icons/fa";
import { GiTalk } from "react-icons/gi";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

import Modal from "@/components/ui/modal";

const createRoomSchemaFrontend = z.object({
  roomName: z.string().min(1, {
    message: "Room name cannot be empty",
  }),
  interviewType: z.enum(["front_end", "ds_algo", "behavioral"], {
    required_error: "You need to select an interview type.",
  }),
  options: z
    .array(z.string())
    .refine((value) => true, {
      message: "You have to select at least one item.",
    })
    .optional(),
  role: z.enum(["interviewer", "interviewee", "spectator"], {
    required_error: "You need to pick a role.",
  }),
});

const CreateRoomModal: FC = () => {
  const { isOpen, setClose } = useCreateRoomModal();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createRoomSchemaFrontend>>({
    resolver: zodResolver(createRoomSchemaFrontend),
    defaultValues: {
      roomName: "",
      options: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof createRoomSchemaFrontend>) => {
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
    <Modal title="Leave Feedback" isOpen={isOpen} setClose={setClose}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid items-center w-full gap-5">
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Room name</FormLabel>
                    <FormControl>
                      <Input placeholder="Input room name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the room&apos;s public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />

            <Accordion type="single" defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>Interview Type</AccordionTrigger>
                <AccordionContent>
                  <div>
                    <FormField
                      control={form.control}
                      name="interviewType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              // @ts-ignore
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="front_end" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  <div className="flex items-center space-x-2">
                                    <FaReact className="text-2xl transition-colors hover:animate-spin hover:text-teal-400" />
                                    <Label htmlFor="r1">Front-end</Label>
                                    <Badge variant="caution">WIP</Badge>
                                  </div>
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="ds_algo" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  <div className="flex items-center space-x-2">
                                    <FaPython className="text-2xl transition-colors hover:text-yellow-400" />
                                    <Label htmlFor="r2">
                                      Data Structures & Algorithms
                                    </Label>
                                  </div>
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="behavioral" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  <div className="flex items-center space-x-2">
                                    <GiTalk className="text-2xl transition-colors hover:text-green-600" />
                                    <Label htmlFor="r3">
                                      Behavioral / Communication
                                    </Label>
                                    <Badge variant="caution">WIP</Badge>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Advanced Options</AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="options"
                    render={() => (
                      <FormItem>
                        {[
                          {
                            id: "leave_tab_dim_avatar",
                            label:
                              "Dim user avatars should they leave the current browser tab.",
                          },
                          {
                            id: "inactivity_deletion",
                            label:
                              "Delete the room after 3 days of inactivity.",
                          },
                          {
                            id: "password_protection",
                            label: "Protect this room with a password.",
                          },
                        ].map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="options"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start py-1 space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value!,
                                              item.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-medium">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Role</FormLabel>
                  <Select
                    // @ts-ignore
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="interviewer">Interviewer</SelectItem>
                      <SelectItem value="interviewee">Interviewee</SelectItem>
                      <SelectItem value="spectator">Spectator</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Proceed</Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;
