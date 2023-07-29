import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BiLogoTypescript, BiLogoPython } from "react-icons/bi";
import { SiChartdotjs, SiCsharp } from "react-icons/si";
import { useUsersList } from "@/context/users-list-context";
import { FC, useEffect } from "react";
import { useCodeContext } from "@/context/code-context";

const UtilityBar: FC = () => {
  const { usersList } = useUsersList();
  const { language, setLanguage } = useCodeContext();

  return (
    <div className="z-10 flex flex-row justify-between px-3 py-2 text-white border-b-2 border-zinc-500 bg-slate-700">
      <div>
        Online users:
        {Object.keys(usersList).map((player) => {
          const { name } = usersList[player][0];

          return (
            <div className="inline-flex ml-2" key={name}>
              {player}
            </div>
          );
        })}
      </div>
      <div>
        <Select
          value={language}
          onValueChange={(newLanguage) => setLanguage(newLanguage)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pick a language..." />
          </SelectTrigger>
          <SelectContent className="shadow shadow-white">
            {["TypeScript", "Python", "C#"].map((language) => (
              <SelectItem key={language} value={language.toLowerCase()}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UtilityBar;
