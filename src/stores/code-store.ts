import * as Reducer from "@/lib/reducers/code-context-reducer";
import { Dispatch, MutableRefObject, createRef } from "react";
import { create } from "zustand";

type State = {
  codeState: Reducer.CodeState;
  latestCodeRef: MutableRefObject<string | null>;
  consoleState: Reducer.ConsoleState;
  asyncState: Reducer.AsyncState;
};

type Action = {
  dispatchCode: Dispatch<Reducer.CodeAction>;
  dispatchConsole: Dispatch<Reducer.ConsoleAction>;
  dispatchAsync: Dispatch<Reducer.AsyncAction>;
};

const latestCodeRef = createRef<string | null>() as MutableRefObject<
  string | null
>;
latestCodeRef.current = null;

const initialState: State = {
  codeState: Reducer.initialCodeState(),
  latestCodeRef,
  consoleState: Reducer.initialConsoleState(),
  asyncState: Reducer.initialAsyncState(),
};

export const useCodeStore = create<State & Action>()((set, get) => ({
  ...initialState,
  dispatchCode: (payload) =>
    set((state) => ({
      codeState: Reducer.codeReducer(state.codeState, payload),
    })),
  dispatchAsync: (payload) =>
    set((state) => ({
      asyncState: Reducer.asyncReducer(state.asyncState, payload),
    })),
  dispatchConsole: (payload) =>
    set((state) => ({
      consoleState: Reducer.consoleReducer(state.consoleState, payload),
    })),
}));
