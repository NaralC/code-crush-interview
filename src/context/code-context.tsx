import {
  Dispatch,
  FC,
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

type CodeState = {
  code: string;
  language: string;
};

type ConsoleState = {
  consoleOutput: string;
  isConsoleVisible: boolean;
};

type AsyncState = {
  isCompiling: boolean;
  isSaving: boolean;
};

type CodeAction = {
  type: "UPDATE_CODE" | "SET_LANGUAGE";
  payload: string;
};

type ConsoleAction =
  | {
      type: "SET_CONSOLE_VISIBLE";
      payload: boolean;
    }
  | {
      type: "SET_CONSOLE_OUTPUT";
      payload: string;
    };

type AsyncAction = {
  type: "SET_IS_COMPILING" | "SET_IS_SAVING";
  payload: boolean;
};

const initialCodeState = (): CodeState => {
  return {
    code: "",
    language: "typescript",
  };
};

const initialConsoleState = (): ConsoleState => ({
  consoleOutput: "",
  isConsoleVisible: false,
});

const initialAsyncState = (): AsyncState => ({
  isCompiling: false,
  isSaving: false,
});

const codeReducer = (state: CodeState, action: CodeAction): CodeState => {
  switch (action.type) {
    case "UPDATE_CODE":
      return { ...state, code: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    default:
      return state;
  }
};

const consoleReducer = (
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

const asyncReducer = (state: AsyncState, action: AsyncAction): AsyncState => {
  switch (action.type) {
    case "SET_IS_COMPILING":
      return { ...state, isCompiling: action.payload };
    case "SET_IS_SAVING":
      return { ...state, isSaving: action.payload };
    default:
      return state;
  }
};

export const CodeContext = createContext<
  | {
      codeState: CodeState;
      latestCodeRef: MutableRefObject<string>;
      dispatchCode: Dispatch<CodeAction>;
      consoleState: ConsoleState;
      dispatchConsole: Dispatch<ConsoleAction>;
      asyncState: AsyncState;
      dispatchAsync: Dispatch<AsyncAction>;
    }
  | undefined
>(undefined);

export const CodeContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [codeState, dispatchCode] = useReducer(
    codeReducer,
    {
      code: "",
      language: "typescript",
      consoleOutput: "",
    },
    initialCodeState
  );

  const latestCodeRef = useRef<string>(codeState.code);
  useEffect(() => {
    latestCodeRef.current = codeState.code;
  }, [codeState.code]);

  const [consoleState, dispatchConsole] = useReducer(
    consoleReducer,
    {
      consoleIsVisible: false,
      isCompiling: false,
      isSaving: false,
    },
    initialConsoleState
  );

  const [asyncState, dispatchAsync] = useReducer(
    asyncReducer,
    {
      isCompiling: false,
      isSaving: false,
    },
    initialAsyncState
  );

  return (
    <CodeContext.Provider
      value={{
        codeState,
        latestCodeRef,
        dispatchCode,
        consoleState,
        dispatchConsole,
        asyncState,
        dispatchAsync,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};

export const useCodeContext = () => {
  const context = useContext(CodeContext);

  if (context === undefined) throw new Error("Code context undefined");

  return context;
};
