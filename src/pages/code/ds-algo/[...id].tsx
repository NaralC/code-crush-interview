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
  const type: InterviewType = "ds_algo"

  const { dispatchCode } = useCodeStore();
  const { realTimeRef, userId } = useRealTimeDsAlgo(
    props.roomId,
    props.userName,
    (newName) => setRoomName(newName),
    isFinished,
    () => setIsFinished(true)
  );

  return (
    <CodingLayout
      {...{
        ...props,
        roomName,
        isFinished,
        userId,
        realTimeRef,
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
  );
};

export default DsAlgoPage;

// const DsAlgoPage: NextPage<{
//   initialCodeState: Record<string, { value: string }>;
//   initialNoteState: OutputData;
//   roomId: string;
//   roomName: string;
//   userName: string;
//   finished: boolean;
//   questions: Question[];
// }> = ({
//   initialCodeState,
//   initialNoteState,
//   roomId,
//   roomName: initialRoomName,
//   userName,
//   finished,
//   questions,
// }) => {
//   // States
//   const [isFinished, setIsFinished] = useState<boolean>(finished);
//   const [roomName, setRoomName] = useState<string>(initialRoomName);
//   // TODO: DS-Algo specific hook
//   const { realTimeRef, userId } = useRealTimeDsAlgo(
//     roomId,
//     userName,
//     (newName) => setRoomName(newName),
//     isFinished,
//     () => setIsFinished(true)
//   );
//   const { myVideo, partnerVideo, host } = useWebRTC(realTimeRef);
//   const [isMuted, setIsMuted] = useState<boolean>(false);
//   const { dispatchCode } = useCodeStore();
//   const { x, y } = useMousePosition();
//   const {
//     endInterviewModal: { setOpen, setClose },
//   } = useModalStore();
//   const supa = supabaseClient;

//   const sendMousePosition = throttle(() => {
//     realTimeRef.current?.send({
//       type: "broadcast",
//       event: EVENT.MOUSE_UPDATE,
//       payload: { x, y, userName, userId },
//     });
//   }, 200);

//   const effectRan = useRef(false);
//   useEffect(() => {
//     if (effectRan.current === false) {
//       for (const language in initialCodeState) {
//         const value = initialCodeState[language].value;

//         dispatchCode({
//           type: "UPDATE_CODE_BY_LANGUAGE",
//           payload: {
//             language,
//             value,
//           },
//         });
//       }

//       if (isFinished)
//         toast(
//           "This interview is marked as finished. Editing text is no longer allowed.",
//           {
//             duration: 4000,
//           }
//         );
//     }

//     return () => {
//       effectRan.current = true;
//     };
//   }, []);

//   const handleEndInterview = async () => {
//     const { error } = await supa
//       .from("interview_rooms")
//       .update({
//         finished: true,
//       })
//       .eq("room_id", roomId)
//       .select();

//     if (error) toast.error("Could not end interview.");
//     setClose();
//   };

//   return (
//     <>
//       <Head>
//         <title>Interview Time!</title>
//         <meta name="Code Crush" content="Code Crush" />
//       </Head>

//       <main
//         className="flex flex-col w-full h-screen"
//         onMouseMove={sendMousePosition}
//       >
//         <>
//           <Cursors realTimeRef={realTimeRef} />
//           <UtilityBar
//             realTimeRef={realTimeRef}
//             roomName={roomName}
//             roomId={roomId}
//             finished={isFinished}
//             type={"ds_algo"}
//           />
//           <Split className="flex flex-row h-screen p-12 cursor-grab bg-gradient-to-b from-black via-slate-900 to-slate-800">
//             <div className="w-full h-full bg-black rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
//               <MonacoEditor
//                 realTimeRef={realTimeRef}
//                 name={userName}
//                 finished={isFinished}
//               />
//             </div>
//             <div className="w-full bg-white rounded-md shadow-lg cursor-auto shadow-white ring ring-zinc-500/30">
//               <NotionLikeEditor
//                 realTimeRef={realTimeRef}
//                 questions={questions}
//                 finished={isFinished}
//                 initialNoteData={initialNoteState}
//               />
//             </div>
//           </Split>
//           <OutputConsole />
//           {/* {!finished && (
//               <AudioVideoCall
//                 isMuted={isMuted}
//                 setIsMuted={setIsMuted}
//                 myVideo={myVideo}
//                 partnerVideo={partnerVideo}
//               />
//             )} */}
//         </>
//       </main>

//       <HintsSolutionModal />
//       <EndInterviewModal handleEndInterview={handleEndInterview} />
//       {!isFinished && (
//         <Button
//           className="fixed z-40 shadow bottom-5 left-5 shadow-white"
//           onClick={setOpen}
//         >
//           End Interview
//         </Button>
//       )}
//     </>
//   );
// };

// export default DsAlgoPage;
