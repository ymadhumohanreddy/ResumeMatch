'use client';

import {
  Book,
  Github,
  Linkedin,
  MessageCircle,
  Rocket,
  Twitter,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { BlueSkyIcon, ProductHuntIcon } from './icons';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function LandingFooter() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/Nithinreddy3093' },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/nithin-marthala/',
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      href: 'https://discord.com/channels/@me',
    },
    {
      name: 'Product Hunt',
      icon: ProductHuntIcon,
      href: 'https://producthunt.com',
    },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Bluesky', icon: BlueSkyIcon, href: 'https://bsky.app' },
    { name: 'Blog', icon: Book, href: '#' },
  ];
  return (
    <footer className="border-t bg-card py-12">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start">
            <div className="flex items-center">
              <Rocket className="mr-2 h-6 w-6" />
              <h3 className="text-lg font-semibold">Resume Matcher</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Open-source tool to help you land your dream job.
            </p>
          </div>
          <div className="md:mx-auto">
            <h3 className="text-lg font-semibold">Community</h3>
            <div className="mt-2 flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={link.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <link.icon className="h-6 w-6" />
                  <span className="sr-only">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="md:ml-auto">
            <h3 className="text-lg font-semibold">Newsletter (Coming Soon)</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get updates on new features and resume tips.
            </p>
            <form className="mt-4 flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                disabled
                suppressHydrationWarning
              />
              <Button type="submit" disabled>
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {year} Resume Matcher. An open-source project. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
