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
    time: string,
    version: string,
    blocks: any[]
  }
};

type HintsOrSolution = "hints" | "solution";

// Interviewer has the "Questions" btn
// the other one doesn't
type Roles = "interviewer" | "interviewee" | null

type Room = Database["public"]["Tables"]["interview_rooms"]["Row"];

type QuestionFromDB = Database["public"]["Tables"]["questions"]["Row"];

type CodeFromDB = Database["public"]["Tables"]["interview_rooms"]["Row"]["code_state"];

type CodeUpdate = { language: string; value: string; }

type DropdownContent = { language: string; icon: JSX.Element };

type InterviewType = "front_end" | "ds_algo"
