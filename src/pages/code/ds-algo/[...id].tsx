import * as React from "react";
import SackpackEditor from "@/components/custom/editors/sandpack-editor";
import CodingLayout from "@/components/custom/coding-layout";
import { useRealTimeDsAlgo } from "@/hooks/use-real-time";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { useCodeStore } from "@/stores/code-store";
import type { GetServerSideProps, NextPage } from "next";
import type { OutputData } from "@editorjs/editorjs";
import MonacoEditor from "@/components/custom/editors/monaco-editor";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseClient = createPagesServerClient<Database>(ctx);

  const { id: roomId, userName } = ctx.query;
  const { data: rooms, error: roomsError } = await supabaseClient
    .from("interview_rooms")
    .select("*")
    .eq("room_id", roomId);

  if (roomsError || !roomId || !userName) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const {
    code_state,
    room_id,
    name,
    participants,
    type,
    finished,
    note_state,
  } = rooms[0];

  const { data: questions, error: questionsError } = await supabaseClient
    .from("questions")
    .select("title, body, hints, solution, id")
    .eq("type", type);

  if (participants) {
    const userCount = Object.keys(participants!).length;

    if (userCount >= 2) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      initialCodeState: code_state,
      roomId: room_id,
      roomName: name,
      userName,
      finished,
      questions,
      initialNoteState: note_state,
    },
  };
};

type PageProps = CodingPagePropsBasis & {
  initialCodeState: Record<string, { value: string }>;
};

const DsAlgoPage: NextPage<PageProps> = (props) => {
  // DS-Algo specific logic
  const [isFinished, setIsFinished] = React.useState<boolean>(props.finished);
  const [roomName, setRoomName] = React.useState<string>(props.roomName);
  const type: InterviewType = "ds_algo";

  const { dispatchCode } = useCodeStore();
  const { realTimeRef, userId } = useRealTimeDsAlgo(
    props.roomId,
    props.userName,
    (newName) => setRoomName(newName),
    isFinished,
    () => setIsFinished(true)
  );
  const [isRealTimeRefReady, setIsRealTimeRefReady] = React.useState(false);

  React.useEffect(() => {
    if (realTimeRef.current) {
      setIsRealTimeRefReady(true);
    }
  }, [realTimeRef.current]);

  return (
    <>
      {isRealTimeRefReady}
      <CodingLayout
        realTimeRef={realTimeRef}
        {...{
          ...props,
          roomName,
          isFinished,
          userId,
          type,
          fnToRunOnMount: () => {
            // For setting code/note state from db or peer
            for (const language in props.initialCodeState) {
              const value = props.initialCodeState[language].value;

              dispatchCode({
                type: "UPDATE_CODE_BY_LANGUAGE",
                payload: {
                  language,
                  value,
                },
              });
            }
          },
        }}
      >
        <MonacoEditor
          realTimeRef={realTimeRef}
          name={props.userName}
          finished={isFinished}
        />
      </CodingLayout>
    </>
  );
};

export default DsAlgoPage;
