import * as React from "react";
import CodingLayout from "@/components/custom/coding-layout";
import SackpackEditor from "@/components/custom/editors/sandpack-editor";
import { useRealTimeFrontEnd } from "@/hooks/use-real-time";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { SandpackProvider, useActiveCode } from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import type { OutputData } from "@editorjs/editorjs";
import type { NextPage, GetServerSideProps } from "next";

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
    front_end_type,
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
      frontEndType: front_end_type,
    },
  };
};

type PageProps = {
  initialCodeState: string;
  initialNoteState: OutputData;
  roomId: string;
  roomName: string;
  userName: string;
  finished: boolean;
  questions: Question[];
  frontEndType: "react" | "angular" | "vue";
};

type SandPackTemplates = "angular" | "react-ts" | "vue-ts";

const visibleFilesByFramework: Record<SandPackTemplates, string[]> = {
  "react-ts": [
    "App.tsx",
    // "styles.css"
  ],
  "vue-ts": [
    "/src/App.vue",
    // "/src/styles.css"
  ],
  angular: [
    "/src/app/app.component.html",
    "/src/app/app.component.css",
    "/src/app/app.component.ts",
  ],
};

const typeToFrameworkMap: Record<string, SandPackTemplates> = {
  react: "react-ts",
  angular: "angular",
  vue: "vue-ts",
};

const FrontEndpage: NextPage<PageProps> = (props) => (
  <SandpackProvider
    template={typeToFrameworkMap[props.frontEndType]}
    theme={atomDark}
    options={{
      externalResources: ["https://cdn.tailwindcss.com"],
      visibleFiles:
        visibleFilesByFramework[typeToFrameworkMap[props.frontEndType]],
      classes: {
        "sp-layout": "sandpack-custom-layout",
        "sp-stack": "sandpack-custom-stack",
      },
    }}
    style={{ height: "100%" }}
  >
    <InternalFrontEndPage {...props} />
  </SandpackProvider>
);

const InternalFrontEndPage: NextPage<PageProps> = (props) => {
  // Front-end specific logic
  const [isLocalChange, setIsLocalChange] = React.useState(true);
  const [isFinished, setIsFinished] = React.useState<boolean>(props.finished);
  const [roomName, setRoomName] = React.useState<string>(props.roomName);
  const { updateCode } = useActiveCode();
  const { realTimeRef, userId } = useRealTimeFrontEnd(
    props.roomId,
    props.userName,
    (newName) => setRoomName(newName),
    isFinished,
    () => setIsFinished(true),
    setIsLocalChange
  );

  return (
    <CodingLayout
      {...{
        ...props,
        roomName,
        isFinished,
        userId,
        realTimeRef,
        fnToRunOnMount: () => {
          if (props.initialCodeState.length > 0) {
            setTimeout(() => updateCode(props.initialCodeState), 100);
            setIsLocalChange(false);
          }
        },
      }}
    >
      <SackpackEditor
        finished={isFinished}
        realTimeRef={realTimeRef}
        isLocalChange={isLocalChange}
        setIsLocalChange={setIsLocalChange}
      />
    </CodingLayout>
  );
};

export default FrontEndpage;
