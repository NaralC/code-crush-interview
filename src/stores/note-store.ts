import { MutableRefObject, createRef } from "react";
import { create } from "zustand";
import type Editorjs from "@editorjs/editorjs";

type State = {
  editorIsMounted: boolean;

  editorRef: MutableRefObject<Editorjs | null>;
};

type Action = {
  setEditorIsMounted: (isMounted: boolean) => void;
};

const editorRef =
  createRef<Editorjs | null>() as MutableRefObject<Editorjs | null>;
editorRef.current = null;

const initialState: State = {
  editorIsMounted: false,
  editorRef,
};

export const useNoteStore = create<State & Action>()((set, get) => ({
  ...initialState,
  setEditorIsMounted: (isMounted) =>
    set(() => ({
      editorIsMounted: isMounted,
    })),
}));
