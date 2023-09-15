import { EVENT } from "@/lib/constant";
import { useUsersStore } from "@/stores/users-store";
import { RealtimeChannel } from "@supabase/supabase-js";
import { FC, Fragment, MutableRefObject, useMemo } from "react";

const Cursors: FC<{
  realTimeRef: MutableRefObject<RealtimeChannel | null>;
}> = ({ realTimeRef }) => {
  const { otherUsers, setOtherUsers } = useUsersStore();

  realTimeRef.current?.on(
    "broadcast",
    { event: EVENT.MOUSE_UPDATE },
    ({
      payload,
    }: Payload<{
      x: number;
      y: number;
      userName: string;
      userId: string;
    }>) => {
      const { x, y, userId } = payload!;
      const copy = {...otherUsers}

      copy[userId] = {
        ...otherUsers[userId],
        cursor: {
          x: (x ?? 0) - 25 > window.innerWidth ? window.innerWidth - 25 : x,
          y: (y ?? 0 - 35) > window.innerHeight ? window.innerHeight - 35 : y,
        },
      }
      
      setOtherUsers(copy)
    }
  );

  return (
    <>
      {Object.keys(otherUsers).map((userId) => {
        const { name: username, cursor } = otherUsers[userId];

        if (!cursor) return <></>;
        
        return (
          <Fragment key={userId}>
            <svg
              width="18"
              height="24"
              viewBox="0 0 18 24"
              fill="none"
              className="absolute top-0 left-0 z-50 transition transform pointer-events-none"
              style={{
                color: "red",
                transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.717 2.22918L15.9831 15.8743C16.5994 16.5083 16.1503 17.5714 15.2661 17.5714H9.35976C8.59988 17.5714 7.86831 17.8598 7.3128 18.3783L2.68232 22.7C2.0431 23.2966 1 22.8434 1 21.969V2.92626C1 2.02855 2.09122 1.58553 2.717 2.22918Z"
                fill={"red"}
                stroke={"red"}
                strokeWidth="2"
              />
            </svg>
            <div
              className="absolute top-0 left-0 z-50 text-sm text-white transition transform bg-black rounded-full shadow-lg pointer-events-none drop-shadow"
              style={{
                transform: `translateX(${cursor.x + 20}px) translateY(${
                  cursor.y
                }px)`,
              }}
            >
              <div className="m-1">{username}</div>
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

export default Cursors;
