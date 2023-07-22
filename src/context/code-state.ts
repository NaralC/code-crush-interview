import { create } from "zustand";

const useCodeState = create<{
  code: string;
  setCode: (newCode: string) => void;
  language: string;
  setLanguage: (newLanguage: string) => void;
}>((set) => ({
  code: `
  type Person = {
    fullName: string;
    age: number;
    height: number;
    weight: number;
  }
  
  const Peter: Person = {
    fullName: "Peter Custard",
    age: 5,
    height: 162,
    weight: 48
  }  
  `,
  setCode: (newCode) => {
    set({
      code: newCode,
    });
  },
  language: "typescript",
  setLanguage: (newLanguage) => {
    set({
      language: newLanguage,
    });
  },
}));

export default useCodeState;
