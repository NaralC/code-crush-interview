import { create } from "zustand";

type BasicModal = {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
};

type ModalStore = {
  createRoomModal: BasicModal & {};
  hintsSolutionModal: BasicModal & {
    body: string;
    setBody: (newBody: any) => void;
    type: HintsOrSolution;
    setType: (newType: HintsOrSolution) => void;
  };
  joinRoomModal: BasicModal & {};
  browseRoomsModal: BasicModal & {};
};

const useModalStore = create<ModalStore>((set) => ({
  createRoomModal: {
    isOpen: false,
    setOpen: () =>
      set((state) => ({
        createRoomModal: { ...state.createRoomModal, isOpen: true },
      })),
    setClose: () =>
      set((state) => ({
        createRoomModal: { ...state.createRoomModal, isOpen: false },
      })),
  },
  hintsSolutionModal: {
    isOpen: false,
    setOpen: () =>
      set((state) => ({
        hintsSolutionModal: { ...state.hintsSolutionModal, isOpen: true },
      })),
    setClose: () =>
      set((state) => ({
        hintsSolutionModal: { ...state.hintsSolutionModal, isOpen: false },
      })),
    body: "",
    setBody: (newBody) =>
      set((state) => ({
        hintsSolutionModal: {
          ...state.hintsSolutionModal,
          body: JSON.stringify(newBody, null, 2),
        },
      })),
    type: "hints",
    setType: (newType) =>
      set((state) => ({
        hintsSolutionModal: { ...state.hintsSolutionModal, type: newType },
      })),
  },
  joinRoomModal: {
    isOpen: false,
    setOpen: () =>
      set((state) => ({
        joinRoomModal: { ...state.joinRoomModal, isOpen: true },
      })),
    setClose: () =>
      set((state) => ({
        joinRoomModal: { ...state.joinRoomModal, isOpen: false },
      })),
  },
  browseRoomsModal: {
    isOpen: false,
    setOpen: () =>
      set((state) => ({
        browseRoomsModal: { ...state.browseRoomsModal, isOpen: true },
      })),
    setClose: () =>
      set((state) => ({
        browseRoomsModal: { ...state.browseRoomsModal, isOpen: false },
      })),
  },
}));

export default useModalStore;
