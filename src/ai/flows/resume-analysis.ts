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
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are a resume expert. Analyze the resume text and the job description to provide a compatibility score, highlight missing skills, and suggest keywords. The compatibility score is an integer from 0 to 100. List the missing skills and suggested keywords as arrays of strings.

Resume Text:
{{resumeText}}

Job Description:
{{jobDescription}}`,
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
