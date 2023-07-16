import { create } from "zustand"

interface UploadModalStore {
    isOpen: boolean
    setOpen: () => void
    setClose: () => void
}

export const useCreateRoomModal = create<UploadModalStore>((set) => ({
    isOpen: false,
    setOpen: () => set({ isOpen: true }),
    setClose: () => set({ isOpen: false })
}))
