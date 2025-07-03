import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import Logo from "@/assets/Logo.jpg";

const Navbar = () => {
  const {user}= useSelector(store=>store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();
  const logoutHandler = async () => {
    await logoutUser();
  };
  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);


  return (
    <div className="h-16 bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 dark:from-gray-900 dark:via-purple-900 dark:to-pink-800 bg-opacity-80 backdrop-blur-md border-b-0 shadow-md fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <Link to="/home" className="flex items-center gap-3 group">
          {/* Custom SVG Cyber Logo */}
          <span className="inline-block">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="cyberLogoGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#a21caf" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
                </radialGradient>
              </defs>
              <ellipse cx="19" cy="19" rx="18" ry="18" fill="url(#cyberLogoGradient)" opacity="0.18" />
              <path d="M19 6 L31 12 V22 C31 30 19 34 19 34 C19 34 7 30 7 22 V12 Z" fill="#fff" fillOpacity="0.18" stroke="#a21caf" strokeWidth="2" />
              <path d="M19 12 V26" stroke="#a21caf" strokeWidth="2" strokeLinecap="round" />
              <circle cx="19" cy="19" r="3" fill="#a21caf" stroke="#fff" strokeWidth="1.5" />
            </svg>
          </span>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg group-hover:scale-105 transition-transform duration-200">
            ThreatLens
          </span>
        </Link>
        {/* User icons and dark mode icon  */}
        <div className="flex items-center gap-8">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="px-4 py-2 rounded font-bold shadow-md border border-[#0d47a1] text-white bg-[#1976d2] hover:bg-[#0d47a1] focus:outline-none focus:ring-2 focus:ring-[#2979ff] focus:ring-offset-2 transition-all duration-150">
                  Dashboard
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {user.role !== 'admin' && (
                      <DropdownMenuItem>
                        <Link to="/my-learning">My learning</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Link to="/profile">Edit Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logoutHandler}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {user?.role === "instructor" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><Link to="/admin/dashboard">Dashboard</Link></DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/* Mobile device  */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        {/* Mobile Custom Logo */}
        <Link to="/home" className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="19" cy="19" rx="18" ry="18" fill="#a21caf" opacity="0.18" />
            <path d="M19 6 L31 12 V22 C31 30 19 34 19 34 C19 34 7 30 7 22 V12 Z" fill="#fff" fillOpacity="0.18" stroke="#a21caf" strokeWidth="2" />
            <path d="M19 12 V26" stroke="#a21caf" strokeWidth="2" strokeLinecap="round" />
            <circle cx="19" cy="19" r="3" fill="#a21caf" stroke="#fff" strokeWidth="1.5" />
          </svg>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
            ThreatLens
          </span>
        </Link>
        <MobileNavbar user={user}/>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({user}) => {
  const navigate = useNavigate();
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle> <Link to="/">ThreatLens</Link></SheetTitle>
          <DarkMode />
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4">
          <Link to="/my-learning">My Learning</Link>
          <Link to="/profile">Edit Profile</Link>
          <p>Log out</p>
        </nav>
        {user?.role === "instructor" && (
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" className="w-full font-bold shadow-md border border-[#0d47a1] text-white bg-[#1976d2] hover:bg-[#0d47a1] focus:outline-none focus:ring-2 focus:ring-[#2979ff] focus:ring-offset-2 transition-all duration-150" onClick={()=> navigate("/admin/dashboard")}>Dashboard</Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};