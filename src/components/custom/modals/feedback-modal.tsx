import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import Modal from "@/components/ui/modal";
import { FC } from "react";
import { useFeedbackModal } from "@/hooks/modals/use-feedback-modal";

const feedbackSchema = z.object({
  subject: z.string().min(1, {
    message: "Subject cannot be empty",
  }),
  description: z.string().optional(),
});

const FeedbackModal: FC = () => {
  const { isOpen, setOpen, setClose } = useFeedbackModal();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      subject: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof feedbackSchema>) => {
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
      title="Leave Feedback"
      isOpen={isOpen}
      setClose={setClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid items-center w-full gap-5">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="What's the matter?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <>
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <TextareaAutosize
                        placeholder="Elaborate on it! We'd love to hear back"
                        {...field}
                        className="w-full px-3 py-3 overflow-hidden text-sm bg-transparent border rounded-md appearance-none resize-none border-input focus:outline-none"
                      />
                    </FormControl>
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

export default FeedbackModal;
