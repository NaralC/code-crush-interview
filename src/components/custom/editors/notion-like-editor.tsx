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
import { getAlgoQuestionById, getAllAlgoQuestions } from "@/lib/questions";
import { CornerDownRight, FileQuestion } from "lucide-react";
import { useHintsSolutionModal } from "@/hooks/modals/use-hint-solution-modal";

const NotionLikeEditor: FC<{
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
}> = ({ realTimeRef }) => {
  // Modal
  const { setBody, setOpen, setType } = useHintsSolutionModal();

  // Editor State
  const { editorRef, editorIsMounted, setEditorIsMounted } = useNoteStore(
    (state) => ({
      editorRef: state.editorRef,
      editorIsMounted: state.editorIsMounted,
      setEditorIsMounted: state.setEditorIsMounted,
    })
  );

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

          realTimeRef.current?.send({
            type: "broadcast",
            event: EVENT.NOTE_UPDATE,
            payload: {
              message: { ...noteData },
            },
          });
        },
        placeholder: "Write your solution outline here...",
        inlineToolbar: true,
        // @ts-ignore
        // data: { blocks: initialCodeState["sharedNote"]["blocks"] },
        data: [],
        tools: {
          header: Header,
          // linkTool: {
          //   class: LinkTool,
          //   config: {
          //     endpoint: "/api/link"
          //   },
          // },
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
        readOnly: false, // TODO: Change this when a room's finished
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

      realTimeRef.current?.on(
        "broadcast",
        { event: EVENT.NOTE_UPDATE }, // Filtering events
        (payload) => {
          try {
            if (payload.payload.message.blocks.length < 1) return;
            // toast("notes changed!");
            editorRef.current?.render(payload.payload.message);
          } catch (error) {
            toast.error((error as Error).message);
          }
        }
      );
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

  const handleChangeQuestion = async (id: string) => {
    const question = getAlgoQuestionById(id);

    if (!question) {
      toast.error("Question not found.");
    }

    editorRef.current!.render(question?.body);
    realTimeRef.current?.send({
      type: "broadcast",
      event: EVENT.NOTE_UPDATE,
      payload: {
        message: { ...question?.body },
      },
    });
  };

  return (
    <div className="w-full h-full overflow-y-auto grow">
      <Popover>
        <PopoverTrigger className="z-40" asChild>
          <Button className="fixed shadow bottom-6 right-6 shadow-white">
            Questions
          </Button>
        </PopoverTrigger>
        <PopoverContent className="fixed bottom-12 -right-14 shadow-black drop-shadow">
          <ul>
            {getAllAlgoQuestions().map((question) => (
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

                    realTimeRef.current?.send({
                      type: "broadcast",
                      event: EVENT.HINT_SOLUTION_SHOW,
                      payload: { type: "hints", body: question.hints },
                    });
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

                    realTimeRef.current?.send({
                      type: "broadcast",
                      event: EVENT.HINT_SOLUTION_SHOW,
                      payload: { type: "solution", body: question.solution },
                    });
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
      <div className="prose text-white prose-stone dark:prose-invert">
        <div
          id="editor"
          className="p-3 max-h-fit bg-gradient-to-b from-stone-900 via-stone-800 to-white selection:text-black selection:bg-white min-h-"
        />
      </div>
    </div>
  );
};

export default NotionLikeEditor;
