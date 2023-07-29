import {
  FC,
  MutableRefObject,
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

export const CodeContext = createContext<
  | {
      code: string;
      updateCode: (newCode: string) => void;
      latestCodeRef: MutableRefObject<string>;
      language: string;
      setLanguage: (newLanguage: string) => void;
      consoleIsVisible: boolean;
      toggleConsoleVisiblity: () => void;
    }
  | undefined
>(undefined);

export const CodeContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [code, setCode] = useState<string>(`
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
    `);

  const latestCodeRef = useRef<string>(code);

  const updateCode = (newCode: string): void => {
    latestCodeRef.current = newCode;
    setCode(newCode);
  };

  const [language, setLanguage] = useState("typescript");
  const [consoleIsVisible, setConsoleIsVisible] = useState<boolean>(false);
  const toggleConsoleVisiblity = () => setConsoleIsVisible((prev) => !prev);

  return (
    <CodeContext.Provider
      value={{
        code,
        updateCode,
        latestCodeRef,
        language,
        setLanguage,
        consoleIsVisible,
        toggleConsoleVisiblity,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};

export const useCodeContext = () => {
  const context = useContext(CodeContext);

  if (context === undefined) throw new Error("Code context undefined");

  return context;
};
