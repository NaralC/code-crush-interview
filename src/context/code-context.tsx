import * as Reducer from "@/lib/reducers/code-context-reducer";
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

export const CodeContext = createContext<
  | {
      codeState: Reducer.CodeState;
      latestCodeRef: MutableRefObject<string>;
      dispatchCode: Dispatch<Reducer.CodeAction>;
      consoleState: Reducer.ConsoleState;
      dispatchConsole: Dispatch<Reducer.ConsoleAction>;
      asyncState: Reducer.AsyncState;
      dispatchAsync: Dispatch<Reducer.AsyncAction>;
    }
  | undefined
>(undefined);

export const CodeContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [codeState, dispatchCode] = useReducer(
    Reducer.codeReducer,
    {
      code: "",
      language: "typescript",
      consoleOutput: "",
    },
    Reducer.initialCodeState
  );

  const latestCodeRef = useRef<string>(codeState.code);
  useEffect(() => {
    latestCodeRef.current = codeState.code;
  }, [codeState.code]);

  const [consoleState, dispatchConsole] = useReducer(
    Reducer.consoleReducer,
    {
      consoleIsVisible: false,
      isCompiling: false,
      isSaving: false,
    },
    Reducer.initialConsoleState
  );

  const [asyncState, dispatchAsync] = useReducer(
    Reducer.asyncReducer,
    {
      isCompiling: false,
      isSaving: false,
    },
    Reducer.initialAsyncState
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
