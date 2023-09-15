import { create } from "zustand";

interface HintSolutionModal {
  isOpen: boolean;
  setOpen: () => void;
  setClose: () => void;
  body: string;
  setBody: (newBody: any) => void;
  type: HintsOrSolution;
  setType: (newType: HintsOrSolution) => void;
}

export const useHintsSolutionModal = create<HintSolutionModal>((set) => ({
  isOpen: false,
  setOpen: () => set({ isOpen: true }),
  setClose: () => set({ isOpen: false }),
  body: "",
  setBody: (newBody) => set({ body: JSON.stringify(newBody, null, 2) }),
  type: "hints",
  setType: (newType) => set({ type: newType }),
}));
