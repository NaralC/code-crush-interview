import { MutableRefObject, createRef } from "react";
import { create } from "zustand";

type State = {
  otherUsers: UsersList;
  myUsername: string;
  role: Roles;
  latestRoleRef: MutableRefObject<Roles>;
};

type Action = {
  setOtherUsers: (newList: any) => void;
  setMyUsername: (newUsername: any) => void;
  setRole: (newRole: Roles) => void;
};

const latestRoleRef = createRef<Roles>() as MutableRefObject<Roles>;

const initialState: State = {
  myUsername: "",
  otherUsers: {},
  role: null,
  latestRoleRef,
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
  setRole: (newRole) =>
    set((state) => {
      latestRoleRef.current = state.role;

      return {
        role: newRole,
        latestRoleRef,
      };
    }),
}));
