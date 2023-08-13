import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = { otherUsers: UsersList; myUsername: string };

type Action = {
  setOtherUsers: (newList: any) => void;
  setMyUsername: (newUsername: any) => void;
};

const initialState: State = {
  myUsername: "",
  otherUsers: {
    "...:": [
      {
        name: "...",
        presence_ref: "placeholder-ref",
        online_at: "01-01-1890",
      },
    ],
  },
};

export const useUsersStore = create<State & Action>()(
  persist(
    (set, get) => ({
      ...initialState,
      setOtherUsers: (newList) =>
        set(() => ({
          otherUsers: newList,
        })),
      setMyUsername: (newUsername) =>
        set(() => ({
          myUsername: newUsername,
        })),
    }),
    {
      name: "users-list-store", // Store key
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ usersList: state.myUsername }), // Partial persistence
    }
  )
);
