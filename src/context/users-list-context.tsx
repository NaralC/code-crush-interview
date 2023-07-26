import {
  FC,
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

type UsersList = {
  [key: string]: [
    {
      name: string;
      presence_ref: string;
    }
  ];
};

export const UsersListContext = createContext<
  | {
      usersList: UsersList;
      updateUsersList: (newList: any) => void;
    }
  | undefined
>(undefined);

export const UsersListContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [usersList, setUsersList] = useState<UsersList>({
    "...:": [
      {
        name: "...",
        presence_ref: "iansrht98h",
      },
    ],
  });

  const updateUsersList = (newList: UsersList): void => {
    setUsersList(newList);
  };

  return (
    <UsersListContext.Provider
      value={{
        usersList,
        updateUsersList,
      }}
    >
      {children}
    </UsersListContext.Provider>
  );
};

export const useUsersList = () => {
  const context = useContext(UsersListContext);

  if (context === undefined) throw new Error("UsersList context undefined");

  return context;
};
