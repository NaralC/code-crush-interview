import { MutableRefObject, createRef } from "react";
import { create } from "zustand";

type State = { usersList: UsersList };

type Action = { setUsersList: (newList: any) => void };

const ref = createRef<any>() as MutableRefObject<any>;
ref.current = null;

const initialState: State = {
  usersList: {
    "...:": [
      {
        name: "...",
        presence_ref: "placeholder-ref",
        online_at: "01-20-1990",
      },
    ],
  },
};

export const useUsersListStore = create<State & Action>()((set, get) => ({
  ...initialState,
  setUsersList: (newList) =>
    set({
      usersList: newList,
    }),
}));
