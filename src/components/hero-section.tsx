import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="container flex flex-col items-center py-20 text-center md:py-32">
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
        Optimize Your Resume. Land Your Dream Job.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Resume Matcher instantly analyzes your resume against any job
        description, providing a compatibility score and actionable insights to
        help you get past ATS filters.
      </p>
      <div className="mt-8 flex gap-4">
        <Button size="lg" asChild>
          <a href="#try-it">Try Resume Matcher</a>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a
            href="https://github.com/Nithinreddy3093"
            target="_blank"
            rel="noopener noreferrer"
          >
            Star on GitHub
          </a>
        </Button>
      </div>
    </section>
  );
}
