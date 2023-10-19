import { FC, Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { FaPython, FaReact } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Transition } from "@headlessui/react";

import Modal from "@/components/ui/modal";
import toast from "react-hot-toast";
import { Dices, Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import useModalStore from "@/stores/modal-store";
import { generateRoomName, generateUsername } from "@/lib/faker";
import { useMutation } from "@tanstack/react-query";

const createRoomSchema = z
  .object({
    roomName: z.string().min(1, {
      message: "Room name cannot be empty",
    }),
    interviewType: z.enum(["front_end", "ds_algo"], {
      required_error: "You need to select an interview type.",
    }),
    frontEndType: z.enum(["react", "angular", "vue"]).optional(),
    options: z
      .array(z.string())
      .refine((value) => true, {
        message: "You have to select at least one item.",
      })
      .optional(),
    userName: z.string({
      required_error: "Name cannot be empty",
    }),
  })
  .refine(
    ({ interviewType, frontEndType }) => {
      if (interviewType === "front_end") {
        if (!frontEndType) return false;
        return ["react", "angular", "vue"].includes(frontEndType);
      }

      return true;
    },
    {
      message: "You need to select a front-end framework",
      path: ["frontEndType"],
    }
  );

const CreateRoomModal: FC = () => {
  const {
    createRoomModal: { isOpen, setClose },
  } = useModalStore();
  const { toast: debugToast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      roomName: "",
      options: [],
    },
  });

  const interviewType = form.watch("interviewType");

  const { mutate: createRoom, isLoading: isCreatingRoom } = useMutation({
    mutationKey: ["create-room"],
    mutationFn: async (values: z.infer<typeof createRoomSchema>) => {
      debugToast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(values, null, 2)}
            </code>
          </pre>
        ),
      });

      const response = await fetch("/api/db", {
        method: "POST",
        body: JSON.stringify({
          roomName: values.roomName,
          type: values.interviewType,
          frontEndType: interviewType === "front_end" ? values.frontEndType : null
        }),
      });

      if (!response.ok) {
        toast.error("Error creating a room :(");
        return;
      }

      const { content: roomId } = await response.json();
      return roomId as string;
    },
    onMutate: () => toast.loading("Creating a room for you..."),
    onSuccess: (roomId) => {
      toast.success("Wallah! Redirecting you to it!");
      router.push({
        pathname: `/code/${
          interviewType === "ds_algo" ? "ds-algo" : "front-end"
        }/${roomId}`,
        query: {
          userName: form.getValues().userName,
        },
      });
    },
  });

  return (
    <Modal
      title="Create an Interview Room"
      description="Powered by Web Sockets"
      isOpen={isOpen}
      setClose={setClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => createRoom(values))}
          className="space-y-8"
        >
          <div className="grid items-center w-full gap-5">
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Room name</FormLabel>
                    <FormControl className="select-none">
                      <div className="flex items-center justify-between">
                        <Input placeholder="Input room name" {...field} />
                        <Dices
                          className="ml-4 cursor-pointer w-7 h-7"
                          onClick={() => {
                            form.setValue("roomName", generateRoomName());
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      This is the room&apos;s public display name.
                    </FormDescription>
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
                            form.setValue("userName", generateUsername());
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

                              <Transition
                                show={interviewType === "front_end"}
                                enter="transition-all duration-200 ease-out"
                                enterFrom="translate-y-2"
                                enterTo="translate-y-0"
                                leave="transition-all ease-in duration-100"
                                leaveFrom="translate-y-0"
                                leaveTo="translate-y-2"
                              >
                                <FormField
                                  control={form.control}
                                  name="frontEndType"
                                  render={({ field }) => (
                                    <FormItem className="px-1">
                                      <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={
                                          !(interviewType === "front_end")
                                        }
                                      >
                                        <FormControl>
                                          <SelectTrigger className="capitalize">
                                            <SelectValue placeholder="Select a framework" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="inter-font">
                                          {[
                                            {
                                              value: "react",
                                            },
                                            {
                                              value: "angular",
                                            },
                                            {
                                              value: "vue",
                                            },
                                          ].map(({ value }, idx) => (
                                            <SelectItem
                                              key={idx}
                                              value={value}
                                              className="capitalize"
                                            >
                                              {value}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <FormDescription>
                                        Comes with TypeScript and Tailwind.
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </Transition>

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
                <AccordionTrigger>Options</AccordionTrigger>
                <AccordionContent>
                  <FormField
                    control={form.control}
                    name="options"
                    render={() => (
                      <FormItem>
                        {[
                          {
                            id: "password_protection",
                            label: "Protect this room with a password.",
                          },
                          {
                            id: "enable_voice_call",
                            label: "Enable voice call (limits the room to 2 players)",
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
            <Button type="submit" disabled={isCreatingRoom}>
              Proceed {!!isCreatingRoom && <Loader2 className="ml-2 animate-spin" />}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;
