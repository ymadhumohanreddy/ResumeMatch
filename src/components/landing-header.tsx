'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, LogOut, Menu, Rocket } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';

export function LandingHeader() {
  const { user, login, logout, loading, isFirebaseEnabled } = useAuth();

  const navLinks = [
    {
      name: 'Star on GitHub',
      href: 'https://github.com/Nithinreddy3093',
    },
    { name: 'Join Discord', href: 'https://discord.com/channels/@me' },
    { name: 'Blogs', href: '#' },
  ];

  const renderAuthButton = () => {
    if (!isFirebaseEnabled) {
      return (
        <Button disabled title="Firebase is not configured">
          Login Disabled
        </Button>
      );
    }

    if (loading) {
      return (
        <Button variant="outline" size="icon" disabled>
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      );
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.photoURL ?? ''}
                  alt={user.displayName ?? 'User'}
                />
                <AvatarFallback>
                  {user.displayName?.charAt(0) ?? 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem disabled>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return <Button onClick={login}>Login with Google</Button>;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Rocket className="mr-2 h-6 w-6" />
          <span className="font-bold">Resume Matcher</span>
        </div>
        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-foreground/60 transition-colors hover:text-foreground/80"
              target={link.href.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          <div className="hidden md:block">{renderAuthButton()}</div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col p-4">
                <div className="mb-4 flex items-center">
                  <Rocket className="mr-2 h-6 w-6" />
                  <span className="font-bold">Resume Matcher</span>
                </div>
                <nav className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-foreground transition-colors hover:text-foreground/80"
                      target={link.href.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                    >
                      {link.name}
                    </a>
                  ))}
                </nav>
                <div className="mt-6 border-t pt-6">
                  {!isFirebaseEnabled ? (
                    <Button
                      disabled
                      className="w-full"
                      title="Firebase is not configured"
                    >
                      Login Disabled
                    </Button>
                  ) : loading ? (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : user ? (
                    <Button
                      onClick={logout}
                      variant="outline"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  ) : (
                    <Button onClick={login} className="w-full">
                      Login with Google
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
