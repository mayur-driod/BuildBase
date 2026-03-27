'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, Settings, LogOut, LogIn, UserPlus, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ModeToggle } from '@/components/mode-toggle/modeToggle';
import { useToast } from '@/components/ui/toast';
import { useAppearance } from '@/components/appearance-provider';

export function Navbar() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { appearance } = useAppearance();
  const user = session?.user;
  const isLoading = status === "loading";

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast("Signed out successfully", "success");
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Dynamic glass effect classes based on appearance settings
  const navClasses = appearance.glassEffects && !appearance.reduceTransparency
    ? "fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-white/10"
    : "fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800";

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              BuildBase
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ModeToggle />

            {/* User Menu */}
            {isLoading ? (
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full"
                disabled
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 animate-pulse">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name || "User"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 dark:text-red-400 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      Log in
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="cursor-pointer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign up
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
