import React from "react";
import logo from "@/assets/images/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin } from "react-icons/md";
import SearchBox from "./SearchBox";
import { RouteBlogAdd, RouteIndex, RouteProfile, RouteSignIn } from "@/helpers/RouteName";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { IoIosSearch } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import usericon from "@/assets/images/user.png";
import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { removeUser } from "@/redux/user/user.slice";
import { showToast } from "@/helpers/showtoast";
import { getEnv } from "@/helpers/getEnv";


const Topbar = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const avatarAlt = user?.user?.name || "User avatar";
  const dispatch = useDispatch();
  const { toggleSidebar } = useSidebar();
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/logout`,
        {
          method: "get",
          credentials: "include",
        },
      );
      const data = await response.json();
      if (!response.ok) {
        showToast("error", data.message);
        return;
      }
      dispatch(removeUser());
      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full z-20 bg-white border-b">
      <div className="flex justify-between items-center h-16 px-4 md:px-5">
        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
            <IoMenu className="w-6 h-6" />
          </Button>
          <img src={logo} className="cursor-pointer w-24 md:w-[120px]" onClick={() => navigate(RouteIndex)} />
        </div>

        <div className="hidden md:block w-125">
          <SearchBox />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMobileSearch(!showMobileSearch)}>
            <IoIosSearch className="w-6 h-6" />
          </Button>

          {!user.isLoggedIn ? (
            <Button asChild className="rounded-full">
              <Link to={RouteSignIn}>
                <MdLogin />
                Sign In
              </Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                <Avatar>
                  <AvatarImage
                    src={user?.user?.avatar || usericon}
                    alt={avatarAlt}
                    onError={(e) => {
                      e.currentTarget.src = usericon;
                    }}
                  />
                  <AvatarFallback>{(avatarAlt || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                <DropdownMenuLabel>
                  <p className="truncate">{user.user.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={RouteProfile} className="flex items-center gap-2 cursor-pointer">
                    <FaRegUser />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={RouteBlogAdd} className="flex items-center gap-2 cursor-pointer">
                    <FaPlus />
                    Create Blog
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <IoLogOutOutline color="red" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Mobile Search Dropdown */}
      {showMobileSearch && (
        <div className="md:hidden w-full p-3 border-t bg-gray-50 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <SearchBox />
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
