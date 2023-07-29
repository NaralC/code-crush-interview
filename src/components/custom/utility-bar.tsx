import { useUsersList } from "@/context/users-list-context";
import { FC, useEffect } from "react";

const UtilityBar: FC = () => {
  const { usersList } = useUsersList();

  return (
    <div className="z-10 px-3 py-2 text-white border-b-2 border-zinc-500 bg-slate-700">
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
  );
};

export default UtilityBar;
