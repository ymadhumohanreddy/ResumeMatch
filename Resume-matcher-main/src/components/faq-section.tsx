'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is Resume Matcher and how does it work?',
    answer:
      'Resume Matcher is a tool that helps you tailor your resume for a specific job. It uses AI to analyze your resume against a job description, calculates a compatibility score, and identifies key skills and keywords you might be missing.',
  },
  {
    question: 'Is Resume Matcher free to use?',
    answer:
      "Yes, Resume Matcher is completely free to use. It's an open-source project built by the community for the community.",
  },
  {
    question: 'Does Resume Matcher work with Applicant Tracking Systems (ATS)?',
    answer:
      'Yes! The primary goal of Resume Matcher is to help you optimize your resume for ATS. By including relevant keywords and skills from the job description, you significantly increase your chances of passing automated screening.',
  },
  {
    question:
      'How can Resume Matcher help me tailor my resume to specific job descriptions?',
    answer:
      'By providing instant feedback, Resume Matcher shows you exactly what recruiters and their ATS are looking for. You can use the suggested keywords and missing skills to quickly update your resume and make it a perfect fit for the role.',
  },
  {
    question: 'Can I use Resume Matcher for multiple job applications?',
    answer:
      'Absolutely. We encourage you to use it for every job you apply for. Tailoring your resume for each application is one of the most effective strategies for a successful job search.',
  },
];

export function FaqSection() {
  return (
    <section className="container py-20 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="mt-8 w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger className="text-left text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                <p className="leading-relaxed">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
