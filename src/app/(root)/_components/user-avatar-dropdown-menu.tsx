import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserInfoStore } from "@/store/userInfo-store";
import { ACCESS_TOKEN } from "@/utils/contants";
import { getInitialConverter } from "@/utils/initial-converter";
import { LOGIN_ROUTE } from "@/utils/routes";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type UserAvatarDropdownMenuType = {
  isAvatarMenuOpen: boolean;
  setIsOpenAvatarMenuOpen: (value: boolean) => void;
};

export function UserAvatarDropdownMenu({
  isAvatarMenuOpen,
  setIsOpenAvatarMenuOpen,
}: UserAvatarDropdownMenuType) {
  const { user } = useUserInfoStore();

  const initial = getInitialConverter(user?.name || "Guest");

  const { clearUser } = useUserInfoStore();
  const router = useRouter();

  const logoutHandler = () => {
    Cookies.remove(ACCESS_TOKEN);
    clearUser();
    router.push(LOGIN_ROUTE);
  };

  return (
    <DropdownMenu
      open={isAvatarMenuOpen}
      onOpenChange={setIsOpenAvatarMenuOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-60" align="end" sideOffset={20}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem className="group">
            <div className="flex items-center gap-4 ">
              <Avatar className="h-12 w-12">
                {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xs font-semibold group-hover:text-white">
                  {user?.name}
                </h2>
                <p className="text-xs group-hover:text-white">{user?.email}</p>
              </div>
            </div>
            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup> */}

        {/* <DropdownMenuItem disabled>API</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group" onClick={logoutHandler}>
          <p className="group-hover:text-white">Log out</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
