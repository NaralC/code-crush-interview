import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeDollarSign, History, Key, UserCircle2 } from "lucide-react";

const Overlay: FC = () => {
  return (
    <>
      <div className="fixed inset-y-0 top-[5vh] right-[10vw]">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center outline-none">
            Naral Chaler
            <Avatar className="w-12 h-12 md:w-20 md:h-20">
              <AvatarImage src="https://github.com/naralc.png" alt="@naralc" />
              <AvatarFallback>NC</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="inline-flex items-center gap-x-2 hover:cursor-pointer">
              <UserCircle2 className="w-5 h-5" />
              Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="items-center gap-x-2 hover:cursor-pointer">
              <History className="w-5 h-5" />
              Interview History
            </DropdownMenuItem>
            <DropdownMenuItem className="items-center gap-x-2 hover:cursor-pointer">
              <Key className="w-5 h-5" />
              Sign in / Sign out
            </DropdownMenuItem>
            <DropdownMenuItem className="items-center gap-x-2 hover:cursor-pointer">
              <BadgeDollarSign className="w-5 h-5" />
              Go Premium
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="fixed bottom-5">Developed by Naral Chaler</div>
    </>
  );
};

export default Overlay;
