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
    <footer className="">
      
       
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {year} Resume Matcher. An open-source project. All rights
            reserved.
          </p>
      </div>
    </footer>
  );
}
