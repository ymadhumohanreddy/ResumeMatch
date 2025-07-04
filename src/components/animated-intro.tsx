'use client';

import { Rocket } from 'lucide-react';
import { useEffect, useState } from 'react';

const INTRO_KEY = 'intro-played';

export function AnimatedIntro() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // This effect runs only on the client
    const hasPlayed = localStorage.getItem(INTRO_KEY);

    if (!hasPlayed) {
      setIsVisible(true); // Show intro if it has not been played
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 2500); // Start fading out after 2.5 seconds

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        localStorage.setItem(INTRO_KEY, 'true');
      }, 3000); // Completely hide after 3 seconds (2500ms + 500ms fade)

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative">
        <Rocket className="h-24 w-24 animate-rocket-fly text-primary" />
      </div>
      <h1 className="mt-4 animate-fade-in-slow text-3xl font-bold tracking-tight text-foreground">
        Resume Matcher
      </h1>
    </div>
  );
}
