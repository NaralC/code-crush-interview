import {
  FC,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { RealtimeChannel } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { EVENT } from "@/lib/constant";
import { useNoteContext } from "@/context/note-context";
import { cn } from "@/lib/utils";

const SharedNoteEditor: FC<{
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
}> = ({ realTimeRef }) => {
  // Editor State
  const { editorRef, editorIsMounted, setEditorIsMounted } = useNoteContext();

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
        onChange: async (api, event) => {
          console.log("Shared note editor changed!", event);

          // TODO: Implement throttling/debounce
          const outputData = await editorRef.current?.save();

          realTimeRef.current?.send({
            type: "broadcast",
            event: EVENT.NOTE_UPDATE,
            payload: {
              message: { ...outputData },
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
          //     endpoint: "/api/link",
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
          //           toast({
          //             variant: "destructive",
          //             title: "Image upload failed.",
          //           });
          //         }

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
          table: Table,
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
          toast("notes changed!");
          try {
            console.log(payload.payload.message);
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

  return (
    <div className="w-full h-full p-4 overflow-y-auto border bg-red-50 grow border-zinc-200">
      <div className="prose prose-stone dark:prose-invert">
        <div id="editor" className="max-h-fit bg-teal-50" />
      </div>
    </div>
  );
};

export default SharedNoteEditor;
