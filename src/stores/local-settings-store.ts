import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type State = {
  particleBgVisible: boolean;
  toggleParticleBgVisiblity: () => void;
};

export const useLocalSettingsStore = create<State>()(
  persist(
    (set, get) => ({
      particleBgVisible: true,
      toggleParticleBgVisiblity: () =>
        set(({ particleBgVisible }) => ({
          particleBgVisible: !particleBgVisible,
        })),
    }),
    {
      name: "local-settings-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ particleBgVisible: state.particleBgVisible }),
    }
  )
);
