import { Output } from "@/hooks/use-compile-code";

export type CodeState = {
  code: Record<string, { value: string }>;
  language: string;
};

export type ConsoleState = {
  consoleOutput: Output | null;
  isConsoleVisible: boolean;
};

export type AsyncState = {
  isCompiling: boolean;
  isSaving: boolean;
};

export type CodeAction =
  | {
      type: "UPDATE_CODE" | "SET_LANGUAGE";
      payload: string;
    }
  | {
      type: "UPDATE_CODE_BY_LANGUAGE";
      payload: CodeUpdate;
    }
  | {
      type: "CLEAR_CODE_STORE";
      payload: null;
    }
  | {
      type: "SET_CODE_STORE";
      payload: Record<string, { value: string }>;
    };

export type ConsoleAction =
  | {
      type: "SET_CONSOLE_VISIBLE";
      payload: boolean;
    }
  | {
      type: "SET_CONSOLE_OUTPUT";
      payload: Output | null;
    };

export type AsyncAction = {
  type: "SET_IS_COMPILING" | "SET_IS_SAVING";
  payload: boolean;
};

export const initialCodeState = (): CodeState => {
  return {
    code: {},
    language: "typescript",
  };
};

export const initialConsoleState = (): ConsoleState => ({
  consoleOutput: null,
  isConsoleVisible: false,
});

export const initialAsyncState = (): AsyncState => ({
  isCompiling: false,
  isSaving: false,
});

export const codeReducer = (
  state: CodeState,
  action: CodeAction
): CodeState => {
  switch (action.type) {
    case "UPDATE_CODE":
      return {
        ...state,
        code: { ...state.code, [state.language]: { value: action.payload } },
      };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "UPDATE_CODE_BY_LANGUAGE":
      return {
        ...state,
        code: {
          ...state.code,
          [action.payload.language]: { value: action.payload.value },
        },
      };
    case "CLEAR_CODE_STORE":
      return {
        ...state,
        code: {},
      };
    case "SET_CODE_STORE":
      return {
        code: action.payload,
        language: "",
      };
    default:
      return state;
  }
};

export const consoleReducer = (
  state: ConsoleState,
  action: ConsoleAction
): ConsoleState => {
  switch (action.type) {
    case "SET_CONSOLE_OUTPUT":
      return { ...state, consoleOutput: action.payload };
    case "SET_CONSOLE_VISIBLE":
      return { ...state, isConsoleVisible: action.payload };
    default:
      return state;
  }
};

export const asyncReducer = (
  state: AsyncState,
  action: AsyncAction
): AsyncState => {
  switch (action.type) {
    case "SET_IS_COMPILING":
      return { ...state, isCompiling: action.payload };
    case "SET_IS_SAVING":
      return { ...state, isSaving: action.payload };
    default:
      return state;
  }
};
