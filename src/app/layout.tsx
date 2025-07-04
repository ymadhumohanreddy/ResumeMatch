import type {Metadata} from 'next';
import { AnimatedIntro } from '@/components/animated-intro';
import {ThemeProvider} from '@/components/theme-provider';
import {AuthProvider} from '@/hooks/use-auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'ResumeWise',
  description: 'Optimize Your Resume. Land Your Dream Job.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <AnimatedIntro />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
