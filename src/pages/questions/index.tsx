// UI
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaPython, FaReact } from "react-icons/fa";
import toast from "react-hot-toast";
import NotionLikeEditor from "@/components/custom/editors/notion-like-editor";

// Logic
import { NextPage } from "next";
import { Fragment, useState } from "react";
import { cn } from "@/lib/utils";
import { useNoteStore } from "@/stores/note-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import supabaseClient from "@/lib/supa-client";

const Questions: NextPage = () => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [textInputs, setTextInputs] = useState<
    Pick<QuestionFromDB, "title" | "hints" | "solution">
  >({
    hints: "",
    solution: "",
    title: "",
  });
  const { editorRef } = useNoteStore();

  const { data: questions, refetch } = useQuery({
    queryKey: ["fetch-questions"],
    queryFn: async () => {
      const { data } = await supabaseClient
        .from("questions")
        .select("*")
        .order("title", { ascending: true });
      return data;
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["edit-question"],
    mutationFn: async (body: Question) => {
      const response = await fetch("/api/questions", {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      const { content } = await response.json();
      return content;
    },
    onSuccess: (data) => {
      refetch();
      toast(data);
    },
  });

  return (
    <main className="flex flex-col justify-center h-screen gap-5 p-12 text-white bg-gradient-to-b from-black via-slate-900 to-slate-800 selection:text-black">
      <div className="text-2xl font-semibold">Question Pool</div>
      <ScrollArea className="text-white h-[450px] px-3">
        {questions?.map((question) => (
          <Fragment key={question.id}>
            <div
              className={cn(
                "pl-4 py-2 border-2 rounded-lg shadow hover:cursor-pointer border-gray-500/25 ring-zinc-500 active:scale-[99%] transition-all hover:shadow-lg last:mb-0 mb-2 grid grid-cols-2 h-12",
                selectedQuestionId === question.id
                  ? "bg-black text-white"
                  : "bg-white/75 text-black"
              )}
              key={question.id}
              onClick={async () => {
                const { id, body, title, hints, solution } = question;
                setSelectedQuestionId(id);
                setTextInputs({ hints, title, solution });
                console.log(body);
                // @ts-ignore
                editorRef.current?.render(body!.body);
              }}
            >
              <div className="col-span-1 truncate">{question.title}</div>
              <div className="col-span-1 text-right">
                <div className="flex flex-col items-center">
                  {question.type === "front_end" ? (
                    <FaReact
                      className={cn(
                        "text-2xl transition-colors hover:animate-spin",
                        selectedQuestionId === question.id
                          ? "text-teal-400"
                          : ""
                      )}
                    />
                  ) : (
                    <FaPython
                      className={cn(
                        "text-2xl transition-colors",
                        selectedQuestionId === question.id
                          ? "text-yellow-400"
                          : ""
                      )}
                    />
                  )}
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </ScrollArea>

      {/* TODO: actually use a form */}
      <div className="font-semibold">
        <Label htmlFor="title" className="text-2xl">
          Title
        </Label>
        <Input
          id="title"
          placeholder="Title..."
          className="text-black"
          value={textInputs.title!}
          onChange={(e) =>
            setTextInputs((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </div>
      <div className="text-2xl font-semibold">Body</div>
      <div className="w-full bg-white rounded-md shadow-lg cursor-auto h-[450px] shadow-white ring ring-zinc-500/30">
        <NotionLikeEditor />
      </div>
      <div className="font-semibold">
        <Label htmlFor="hint" className="text-2xl">
          Hint(s)
        </Label>
        <Input
          id="hint"
          placeholder="Hint(s)..."
          className="text-black"
          value={textInputs.hints!}
          onChange={(e) =>
            setTextInputs((prev) => ({ ...prev, hints: e.target.value }))
          }
        />
      </div>
      <div className="font-semibold">
        <Label htmlFor="solution" className="text-2xl">
          Solution(s)
        </Label>
        <Input
          id="solution"
          placeholder="Solutions..."
          className="text-black"
          value={textInputs.solution!}
          onChange={(e) =>
            setTextInputs((prev) => ({ ...prev, solution: e.target.value }))
          }
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={async () => {
            const noteData = await editorRef.current?.save();

            mutate({
              title: textInputs.title ?? "",
              body: noteData,
              hints: textInputs.hints ?? "",
              solution: textInputs.solution ?? "",
              id: selectedQuestionId!,
            });

            // const response = await fetch("/api/questions", {
            //   method: "PATCH",
            //   body: JSON.stringify({
            //     title: textInputs.title,
            //     body: noteData,
            //     hints: textInputs.hints,
            //     solution: textInputs.solution,
            //     id: selectedQuestionId,
            //   }),
            // });

            // const { content } = await response.json();
            // if (response.ok) toast.success(content);
            // else toast.error(content);
          }}
          className="px-16 shadow shadow-white w-fit"
        >
          Save
        </Button>
      </div>
    </main>
  );
};

export default Questions;
