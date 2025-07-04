import { ShieldCheck } from 'lucide-react';

export function PrivacySection() {
  return (
    <section className="bg-muted/50 py-16 sm:py-20">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="flex justify-center">
          <ShieldCheck className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">
          Privacy by Design
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Your data is yours. All resume and job description processing happens
          directly in your browser. Nothing is ever uploaded or stored on our
          servers. Your privacy is our top priority.
        </p>
      </div>
    </section>
  );
}
