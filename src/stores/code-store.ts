import * as Reducer from "@/lib/reducers";
import { Dispatch, MutableRefObject, createRef } from "react";
import { create } from "zustand";

type State = {
  codeState: Reducer.CodeState;
  latestCodeRef: MutableRefObject<string | null>;
  latestLanguageRef: MutableRefObject<string | null>;
  latestWholeCodeStateRef: MutableRefObject<Reducer.CodeState | null>;
  consoleState: Reducer.ConsoleState;
  asyncState: Reducer.AsyncState;
};

type Action = {
  dispatchCode: Dispatch<Reducer.CodeAction>;
  dispatchConsole: Dispatch<Reducer.ConsoleAction>;
  dispatchAsync: Dispatch<Reducer.AsyncAction>;
};

const latestCodeRef = createRef<string | null>() as MutableRefObject<string | null>;
const latestLanguageRef = createRef<string | null>() as MutableRefObject<string | null>;
const latestWholeCodeStateRef = createRef<string | null>() as MutableRefObject<Reducer.CodeState | null>;
latestCodeRef.current = null;
latestLanguageRef.current = null;
latestWholeCodeStateRef.current = null;

const initialState: State = {
  codeState: Reducer.initialCodeState(),
  latestCodeRef,
  latestLanguageRef,
  latestWholeCodeStateRef,
  consoleState: Reducer.initialConsoleState(),
  asyncState: Reducer.initialAsyncState(),
};

export const useCodeStore = create<State & Action>()((set, get) => ({
  ...initialState,
  dispatchCode: (payload) =>
    set((state) => {
      const language = state.codeState.language;
      const code = state.codeState.code[language];

      if (code) latestCodeRef.current = code.value;
      else latestCodeRef.current = "";

      if (language) latestLanguageRef.current = language;
      else latestLanguageRef.current = "";

      latestWholeCodeStateRef.current = state.codeState

      return {
        codeState: Reducer.codeReducer(state.codeState, payload),
        latestCodeRef,
        latestLanguageRef,
        latestWholeCodeStateRef
      };
    }),
  dispatchAsync: (payload) =>
    set((state) => ({
      asyncState: Reducer.asyncReducer(state.asyncState, payload),
    })),
  dispatchConsole: (payload) =>
    set((state) => ({
      consoleState: Reducer.consoleReducer(state.consoleState, payload),
    })),
}));
