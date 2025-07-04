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
  isResume: z
    .boolean()
    .describe('Whether the uploaded document is a resume or not.'),
  compatibilityScore: z
    .number()
    .optional()
    .describe(
      'A score (0-100) indicating the compatibility of the resume with the job description.'
    ),
  missingSkills: z
    .array(z.string())
    .optional()
    .describe(
      'An array of skills mentioned in the job description but not found in the resume.'
    ),
  suggestedKeywords: z
    .array(z.string())
    .optional()
    .describe(
      'An array of keywords from the job description that should be added to the resume.'
    ),
  optimizedResumeText: z
    .string()
    .optional()
    .describe(
      'The full text of the resume, rewritten and optimized to better match the job description based on the provided suggestions.'
    ),
  tailoringTips: z
    .array(z.string())
    .optional()
    .describe(
      'An array of actionable tips for how the user can tailor their resume for multiple similar applications.'
    ),
  rejectionReason: z
    .string()
    .optional()
    .describe(
      'If the document is not a resume, a brief explanation of why.'
    ),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert career coach and resume writer.
First, you MUST determine if the provided "Resume Text" is a professional resume. If it is not a resume (e.g., it is an ID card, a random document, a letter), set the "isResume" field to false and provide a brief explanation in the "rejectionReason" field. In this case, do not fill out any of the other fields.

If the document is a resume, set "isResume" to true and perform the following analysis to help the user land this job:
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
