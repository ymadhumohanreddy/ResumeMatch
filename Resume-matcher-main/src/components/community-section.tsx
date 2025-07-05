import { Button } from '@/components/ui/button';

export function CommunitySection() {
  return (
    <section className="bg-primary/10 py-20 md:py-24">
      <div className="container text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Join Our Community
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          We are a community of developers, job seekers, and career experts. Join
          us to contribute, learn, and grow together.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <a
              href="https://discord.com/channels/@me"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="#">Read Our Blog</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
