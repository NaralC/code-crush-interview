import { useUsersList } from "@/context/users-list-context";
import { FC } from "react";

const UtilityBar: FC = () => {
  const { usersList } = useUsersList();

  return (
    <div className="bg-white border shadow-xl h-14 border-zinc-50">
      Online users:
      {Object.keys(usersList).map((key) => {
        const user = usersList[key][0];
        return (
          <div className="inline-flex ml-2" key={user.presence_ref}>
            {user.name}
          </div>
        );
      })}
    </div>
  );
};

export default UtilityBar;
