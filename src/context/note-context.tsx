import {
  Dispatch,
  FC,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import type Editorjs from "@editorjs/editorjs";

export const NoteContext = createContext<
  | {
      editorIsMounted: boolean;
      setEditorIsMounted: Dispatch<SetStateAction<boolean>>
      editorRef: MutableRefObject<Editorjs | null | undefined>;
    }
  | undefined
>(undefined);

export const NoteContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [editorIsMounted, setEditorIsMounted] = useState<boolean>(false);
  const editorRef = useRef<Editorjs | null>();

  return (
    <NoteContext.Provider
      value={{
        editorIsMounted,
        setEditorIsMounted,
        editorRef,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNoteContext = () => {
  const context = useContext(NoteContext);

  if (context === undefined) throw new Error("Note context undefined");

  return context;
};
