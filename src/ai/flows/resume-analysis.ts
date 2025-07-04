// src/ai/flows/resume-analysis.ts
'use server';

/**
 * @fileOverview Analyzes a resume against a job description to provide a compatibility score,
 * highlight missing skills, and suggest keywords.
 *
 * - analyzeResume - A function that initiates the resume analysis process.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume (PDF or DOCX).'),
  jobDescription: z.string().describe('The job description text.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  compatibilityScore: z
    .number()
    .describe('A score (0-100) indicating the compatibility of the resume with the job description.'),
  missingSkills: z
    .array(z.string())
    .describe('An array of skills mentioned in the job description but not found in the resume.'),
  suggestedKeywords: z
    .array(z.string())
    .describe('An array of keywords from the job description that should be added to the resume.'),
  optimizedResumeText: z
    .string()
    .describe('The full text of the resume, rewritten and optimized to better match the job description based on the provided suggestions.'),
  tailoringTips: z
    .array(z.string())
    .describe('An array of actionable tips for how the user can tailor their resume for multiple similar applications.'),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert career coach and resume writer. Analyze the provided resume text and job description. Your goal is to help the user land this job.

Provide the following analysis:
1.  **Compatibility Score:** An integer score from 0 to 100 representing how well the resume matches the job description.
2.  **Missing Skills:** A list of crucial skills that are present in the job description but missing from the resume.
3.  **Suggested Keywords:** A list of important keywords from the job description that the user should incorporate into their resume.
4.  **Optimized Resume Text:** Rewrite the original resume text to incorporate the suggested keywords and address the missing skills. The result should be a complete, professional resume ready for the user to copy or download. Maintain a professional tone and format.
5.  **Tailoring Tips:** Provide a few actionable tips on how the user can adapt this newly optimized resume for other similar job applications in the future.

Resume Text:
{{{resumeText}}}

Job Description:
{{{jobDescription}}}`,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumePrompt(input);
    return output!;
  }
);
