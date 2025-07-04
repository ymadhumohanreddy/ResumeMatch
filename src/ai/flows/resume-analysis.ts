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
  prompt: `You are an AI assistant with a single, critical task: to validate if a document is a professional resume and, if so, analyze it against a job description.

**VERY IMPORTANT FIRST STEP: VALIDATION**
Before you do anything else, you MUST determine if the provided "Resume Text" is a professional resume. A resume contains sections like "Work Experience," "Education," "Skills," etc.

If the document is NOT a resume (e.g., it is a national ID card like an Aadhar card, a driver's license, a letter, a receipt, a passport, or any other type of document), you MUST set the "isResume" field to \`false\` and provide a brief explanation in the "rejectionReason" field. **You MUST NOT perform any further analysis or fill out any other fields.**

**ONLY IF THE DOCUMENT IS A RESUME:**
If and only if you have confirmed the document is a resume, you must set "isResume" to \`true\` and proceed with the full analysis as follows:

1.  **Optimized Resume Text (Crucial):** This is the most important field. Rewrite the *entire* original resume text. You must incorporate relevant keywords from the job description, address any missing skills, and rephrase sections to better align with the role. The output must be a complete, professional resume, ready to be copied and used. Do not provide just a list of changes; provide the full, rewritten document.

2.  **Compatibility Score:** Based on your analysis, provide an integer score from 0 to 100 representing how well the original resume matches the job description.

3.  **Missing Skills:** List the crucial skills that are present in the job description but are missing from the resume.

4.  **Suggested Keywords:** List important keywords from the job description that the user should ensure are present in their resume.

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
