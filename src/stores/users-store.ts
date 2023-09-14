import { create } from "zustand";

type State = { otherUsers: UsersList; myUsername: string };

type Action = {
  setOtherUsers: (newList: any) => void;
  setMyUsername: (newUsername: any) => void;
};

const initialState: State = {
  myUsername: "",
  otherUsers: {},
};

export const useUsersStore = create<State & Action>()((set, get) => ({
  ...initialState,
  setOtherUsers: (newList) =>
    set(() => ({
      otherUsers: newList,
    })),
  setMyUsername: (newUsername) =>
    set(() => ({
      myUsername: newUsername,
    })),
}));
