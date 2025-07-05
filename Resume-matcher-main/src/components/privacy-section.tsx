import { ShieldCheck } from 'lucide-react';

export function PrivacySection() {
  return (
    <section className="bg-muted/50 py-16 sm:py-20">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="flex justify-center">
          <ShieldCheck className="h-16 w-16 text-primary" />
        </div>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">
          Privacy by Design
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Your data is yours. Your resume and the job description are sent to
          our secure backend for AI-powered analysis. This data is used only to
          generate insights for you and is not stored or used for any other
          purpose. Your privacy is our top priority.
        </p>
      </div>
    </section>
  );
}
