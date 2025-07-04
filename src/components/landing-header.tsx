import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Rocket } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function LandingHeader() {
  const navLinks = [
    {
      name: 'Star on GitHub',
      href: 'https://github.com',
    },
    { name: 'Join Discord', href: 'https://discord.com' },
    { name: 'Blogs', href: '#' },
  ];

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
          <Button asChild>
            <a href="#try-it">Try Resume Matcher</a>
          </Button>
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
