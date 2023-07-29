import { useUsersList } from "@/context/users-list-context";
import { FC, useEffect } from "react";

const UtilityBar: FC = () => {
  const { usersList } = useUsersList();

  return (
    <div className="bg-white border shadow-xl h-14 border-zinc-50">
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
