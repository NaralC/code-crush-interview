type Payload<T> = {
  type: string;
  event: string;
  payload?: T;
};

type UsersList = {
  [key: string]: {
    name: string;
    presence_ref: string;
    online_at: string;
    cursor: {
      x: number;
      y: number;
    };
  };
};

type Question = {
  id: number;
  title: string;
  body: any;
  hints: string;
  solution: string;
  body: {
    time: string;
    version: string;
    blocks: any[];
  };
};

type CodingPagePropsBasis = {
  initialCodeState: string;
  initialNoteState: OutputData;
  roomId: string;
  roomName: string;
  userName: string;
  finished: boolean;
  questions: Question[];
  frontEndType: "react" | "angular" | "vue";
  voiceCallEnabled: boolean;
};

type HintsOrSolution = "hints" | "solution";

// Interviewer has the "Questions" btn
// the other one doesn't
type Roles = "interviewer" | "interviewee" | null;

type Room = Database["public"]["Tables"]["interview_rooms"]["Row"];

type QuestionFromDB = Database["public"]["Tables"]["questions"]["Row"];

type CodeFromDB =
  Database["public"]["Tables"]["interview_rooms"]["Row"]["code_state"];

type CodeUpdate = { language: string; value: string };
// type CodeUpdate =
//   | { type: "ds_algo"; language: string; value: string }
//   | { type: "front_end"; value: string };

type InterviewType = "front_end" | "ds_algo";
