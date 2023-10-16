// UI
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FaPython, FaReact } from "react-icons/fa";
import NotionLikeEditor from "@/components/custom/editors/notion-like-editor";

// Logic
import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useNoteStore } from "@/stores/note-store";
import { useQuery } from "@tanstack/react-query";
import supabaseClient from "@/lib/supa-client";
import useQuestionsMutation from "@/hooks/use-questions-mutation";
import { Switch } from "@/components/ui/switch";

const QuestionsPage: NextPage = () => {
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<InterviewType>("ds_algo");

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
        .eq("type", selectedQuestionType)
        .order("title", { ascending: true });
      return data;
    },
  });

  const refetchFn = useCallback(() => {
    refetch();
  }, []);

  const { mutate: createQuestion } = useQuestionsMutation<
    Omit<QuestionFromDB, "id">
  >(["create-question"], "POST", refetchFn);

  const { mutate: editQuestion } = useQuestionsMutation<Question>(
    ["edit-question"],
    "PATCH",
    refetchFn
  );

  const { mutate: deleteQuestion } = useQuestionsMutation<{ id: number }>(
    ["delete-question"],
    "DELETE",
    refetchFn
  );

  const toggleQuestionType = useCallback(() => {
    setSelectedQuestionType((prev) =>
      prev === "ds_algo" ? "front_end" : "ds_algo"
    );
  }, []);

  useEffect(() => refetchFn(), [selectedQuestionType]);

  // TODO: Make this page responsive
  return (
    <main className="universal-bg selection:text-black">
      {/* <div className="absolute w-4/6 -translate-x-1/2 -translate-y-1/2 max-w-7xl top-1/2 left-1/2"> */}
        <div className="flex gap-6 text-2xl font-semibold">
          <p>Question Pool</p>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "flex gap-2",
                selectedQuestionType !== "ds_algo" && "saturate-0"
              )}
            >
              <Label
                htmlFor="questions-type"
                className="flex items-center gap-2"
              >
                DSA
              </Label>
              <FaPython className="text-2xl text-yellow-400 transition-colors" />
            </div>
            <Switch
              id="questions-type"
              checked={selectedQuestionType === "ds_algo" ? false : true}
              onCheckedChange={toggleQuestionType}
            />
            <div
              className={cn(
                "flex gap-2",
                selectedQuestionType !== "front_end" && "saturate-0"
              )}
            >
              <FaReact className="text-2xl text-teal-400 transition-colors hover:animate-spin" />
              <Label
                htmlFor="questions-type"
                className="flex items-center gap-2"
              >
                Front-end
              </Label>
            </div>
          </div>
        </div>
        <ScrollArea className="text-white max-h-[450px] px-3">
          {questions?.map((question) => (
            <div className="flex" key={question.id}>
              <div
                className={cn(
                  "pl-4 py-2 border-2 rounded-lg shadow hover:cursor-pointer border-gray-500/25 ring-zinc-500 active:scale-[99%] transition-all hover:shadow-lg last:mb-0 mb-2 grid grid-cols-6 h-12 w-4/5",
                  selectedQuestionId === question.id
                    ? "bg-black text-white"
                    : "bg-white/75 text-black"
                )}
                key={question.id}
                onClick={async () => {
                  const { id, body, title, hints, solution } = question;
                  setSelectedQuestionId(id);
                  setTextInputs({ hints, title, solution });
                  // @ts-ignore
                  editorRef.current?.render(body!.body);
                }}
              >
                <div className="col-span-4 truncate">{question.title}</div>
                <div className="col-span-2 text-right">
                  <div className="flex flex-row items-center gap-3">
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
              <div
                className="w-1/5 my-auto text-sm text-center text-red-500 transition-transform cursor-pointer hover:saturate-200"
                onClick={() => deleteQuestion({ id: question.id })}
              >
                Delete Question
              </div>
            </div>
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
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={async () => {
              const noteData = await editorRef.current?.save();

              createQuestion({
                title: textInputs.title ?? "",
                body: noteData as any,
                hints: textInputs.hints ?? "",
                solution: textInputs.solution ?? "",
                type: selectedQuestionType,
              });
            }}
            className="px-16 shadow shadow-white w-fit"
          >
            Create Question
          </Button>
          <Button
            onClick={async () => {
              const noteData = await editorRef.current?.save();

              editQuestion({
                title: textInputs.title ?? "",
                body: noteData,
                hints: textInputs.hints ?? "",
                solution: textInputs.solution ?? "",
                id: selectedQuestionId!,
              });
            }}
            className="px-16 shadow shadow-white w-fit"
          >
            Edit Question
          </Button>
        </div>
      {/* </div> */}
    </main>
  );
};

export default QuestionsPage;
