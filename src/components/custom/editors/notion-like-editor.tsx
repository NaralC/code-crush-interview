import { FC, MutableRefObject, useCallback, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RealtimeChannel } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { EVENT } from "@/lib/constant";
import { useNoteStore } from "@/stores/note-store";
import { Button } from "@/components/ui/button";
import { CornerDownRight, FileQuestion } from "lucide-react";
import { useUsersStore } from "@/stores/users-store";
import useModalStore from "@/stores/modal-store";
import { cn } from "@/lib/utils";
import type { OutputData } from "@editorjs/editorjs";

const NotionLikeEditor: FC<{
  realTimeRef?: MutableRefObject<RealtimeChannel | null>;
  finished?: boolean;
  questions?: Question[]
  initialNoteData?: OutputData
}> = ({ realTimeRef, finished, questions, initialNoteData }) => {
  // Modal
  const {
    hintsSolutionModal: { setBody, setOpen, setType },
  } = useModalStore();

  // Editor State
  const { editorRef, editorIsMounted, setEditorIsMounted } = useNoteStore(
    (state) => ({
      editorRef: state.editorRef,
      editorIsMounted: state.editorIsMounted,
      setEditorIsMounted: state.setEditorIsMounted,
    })
  );
  const { latestRoleRef } = useUsersStore();

  const initializeEditor = useCallback(async () => {
    // Check out more here: https://github.com/editor-js/awesome-editorjs#tools
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InLineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady: () => {
          editorRef.current = editor; // Prevents re-initialization
        },
        onChange: async (api, event: CustomEvent) => {
          // console.log("Shared note editor changed!", event);
          // TODO: Implement throttling/debounce
          const noteData = await editorRef.current?.save();
          // if (!noteData?.blocks.length) return;

          if (realTimeRef) {
            realTimeRef.current?.send({
              type: "broadcast",
              event: EVENT.NOTE_UPDATE,
              payload: {
                message: { ...noteData },
              },
            });
          }
        },
        placeholder: "Write your solution outline here...",
        inlineToolbar: true,
        // @ts-ignore
        data: { blocks: initialNoteData?.blocks },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link"
            },
          },
          // image: {
          //   class: ImageTool,
          //   config: {
          //     uploader: {
          //       async uploadByFile(file: File) {
          //         const { data, error } = await supabaseClient.storage
          //           .from("markdown-pics")
          //           .upload(`public/${nanoid()}`, file, {
          //             cacheControl: "3600",
          //             upsert: false,
          //           });

          //         if (error) {
          //           toast.error("Image upload failed :(")
          //         }

          //         toast.success("Image uploaded!")

          //         return {
          //           success: 1,
          //           file: {
          //             url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/markdown-pics/${data?.path}`,
          //           },
          //         };
          //       },
          //     },
          //   },
          // },
          list: List,
          code: Code,
          InLineCode: InLineCode,
          // table: Table,
          embed: Embed,
        },
        readOnly: finished,
      });
    }
  }, [editorRef]);

  useEffect(() => {
    setEditorIsMounted(true);
  }, []);

  const effectRan = useRef(false);
  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      if (realTimeRef) {
        realTimeRef.current?.on(
          "broadcast",
          { event: EVENT.NOTE_UPDATE }, // Filtering events
          (
            payload
            : Payload<{
              message: {
                blocks: Question['body']
              }
            }>
          ) => {
            try {
              if (payload.payload!.message.blocks.length < 1) return;
              // toast("notes changed!");
              console.log(payload.payload?.message);
              editorRef.current?.render(payload.payload!.message);
            } catch (error) {
              toast.error((error as Error).message);
            }
          }
        );
      }
    };

    if (editorIsMounted && effectRan.current === false) {
      init();

      return () => {
        effectRan.current = true;
        if (editorRef.current) editorRef.current = null;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorIsMounted, initializeEditor]);

  const handleChangeQuestion = async (id: number) => {
    const question = questions?.filter(q => q.id === id)[0]

    if (!question) {
      toast.error("Question not found");
    }

    editorRef.current!.render(question?.body.body);

    if (realTimeRef) {
      realTimeRef.current?.send({
        type: "broadcast",
        event: EVENT.NOTE_UPDATE,
        payload: {
          message: { ...question?.body.body },
        },
      });
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      {latestRoleRef.current === "interviewer" && (
        <Popover>
          <PopoverTrigger className="z-40" asChild>
            <Button className="fixed z-40 shadow bottom-6 right-6 shadow-white inter-font">
              Questions
            </Button>
          </PopoverTrigger>
          <PopoverContent className="fixed bottom-12 -right-14 shadow-black drop-shadow inter-font">
            <ul>
              {questions?.map((question) => (
                <li key={question.id} className="px-2 rounded-lg">
                  <div className="flex flex-row">
                    <FileQuestion />
                    {question.title}
                  </div>
                  <div
                    className="flex flex-wrap px-2 text-sm text-gray-500 transition-colors hover:cursor-pointer hover:bg-black hover:text-white rounded-xl"
                    onClick={() => {
                      handleChangeQuestion(question.id);
                    }}
                  >
                    <CornerDownRight className="p-1" />
                    Put Question in Editor
                  </div>
                  <div
                    className="flex flex-wrap px-2 text-sm text-gray-500 transition-colors hover:cursor-pointer hover:bg-black hover:text-white rounded-xl"
                    onClick={() => {
                      setType("hints");
                      setBody(question.hints);
                      setOpen();

                      if (realTimeRef) {
                        realTimeRef.current?.send({
                          type: "broadcast",
                          event: EVENT.HINT_SOLUTION_SHOW,
                          payload: { type: "hints", body: question.hints },
                        });
                      }
                    }}
                  >
                    <CornerDownRight className="p-1" />
                    Show Hint(s)
                  </div>
                  <div
                    className="flex flex-wrap px-2 text-sm text-gray-500 transition-colors hover:cursor-pointer hover:bg-black hover:text-white rounded-xl"
                    onClick={() => {
                      setType("solution");
                      setBody(question.solution);
                      setOpen();

                      if (realTimeRef) {
                        realTimeRef.current?.send({
                          type: "broadcast",
                          event: EVENT.HINT_SOLUTION_SHOW,
                          payload: {
                            type: "solution",
                            body: question.solution,
                          },
                        });
                      }
                    }}
                  >
                    <CornerDownRight className="p-1" />
                    Show Solution
                  </div>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      )}
      <div className="prose text-white prose-stone dark:prose-invert">
        <div
          id="editor"
          className={cn(
            "p-3 max-h-[800px] md:max-h-fit bg-gradient-to-b from-stone-900 via-stone-800 to-white selection:text-black selection:bg-white",
            finished ? "hover:cursor-not-allowed" : ""
          )}
        />
      </div>
    </div>
  );
};

export default NotionLikeEditor;
