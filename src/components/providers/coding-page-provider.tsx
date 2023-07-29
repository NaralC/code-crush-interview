import { CodeContextProvider } from "@/context/code-context";
import { NoteContextProvider } from "@/context/note-context";
import { UsersListContextProvider } from "@/context/users-list-context";
import { FC, ReactNode } from "react";

const CodingPageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <CodeContextProvider>
        <NoteContextProvider>
          <UsersListContextProvider>{children}</UsersListContextProvider>
        </NoteContextProvider>
      </CodeContextProvider>
    </>
  );
};

export default CodingPageProvider;
