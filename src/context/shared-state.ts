import { create } from "zustand";

type UsersList = {
  [key: string]: [
    {
      name: string;
      presence_ref: string;
    }
  ];
};

const useSharedState = create<{
  usersList: UsersList;
  updateUsersList: (newList: any) => void;
}>((set) => ({
  usersList: {
    "...:": [
      {
        name: "...",
        presence_ref: "iansrht98h",
      },
    ],
  },
  updateUsersList: (newList: any): void => {
    set({
      usersList: newList,
    });
  },
}));

export default useSharedState;
