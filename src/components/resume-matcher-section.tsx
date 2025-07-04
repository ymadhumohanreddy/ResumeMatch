'use client';

import { useState } from 'react';
import type { AnalyzeResumeOutput } from '@/ai/flows/resume-analysis';
import { analyzeResume } from '@/ai/flows/resume-analysis';
import { AlertTriangle, Briefcase, FileText, Lightbulb, Loader2, Sparkles } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';

export function ResumeMatcherSection() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please paste both your resume and the job description.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume({ resumeText, jobDescription });
      setAnalysisResult(result);
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
      toast({
        title: 'Analysis Failed',
        description:
          'An unexpected error occurred. Please check your connection and try again.',
        variant: 'destructive',
      });
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const AnalysisResults = () => {
    if (isLoading) {
      return (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Analyzing...
            </CardTitle>
            <CardDescription>
              Our AI is reviewing your documents. This might take a moment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="mt-8 border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Analysis Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      );
    }

    if (!analysisResult) {
      return null;
    }

    return (
      <Card className="mt-8 animate-in fade-in duration-500">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            Your Instant Insights
          </CardTitle>
          <CardDescription>
            Here is how your resume stacks up against the job description.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label
              htmlFor="compatibility-score"
              className="text-lg font-medium"
            >
              Compatibility Score
            </Label>
            <div className="mt-2 flex items-center gap-4">
              <Progress
                id="compatibility-score"
                value={analysisResult.compatibilityScore}
                className="h-4"
              />
              <span className="text-2xl font-bold text-primary">
                {analysisResult.compatibilityScore}%
              </span>
            </div>
          </div>

          <div>
            <h3 className="flex items-center text-lg font-medium">
              <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
              Suggested Keywords
            </h3>
            <p className="text-sm text-muted-foreground">
              Consider adding these keywords from the job description to your
              resume.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysisResult.suggestedKeywords.length > 0 ? (
                analysisResult.suggestedKeywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-yellow-500/50 bg-yellow-500/10 text-yellow-700"
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No specific keywords suggested. Great job!
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="flex items-center text-lg font-medium">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              Missing Skills
            </h3>
            <p className="text-sm text-muted-foreground">
              These skills are in the job description but seem to be missing
              from your resume.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysisResult.missingSkills.length > 0 ? (
                analysisResult.missingSkills.map((skill, index) => (
                  <Badge key={index} variant="destructive">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  It looks like you have all the required skills!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section id="try-it" className="container py-20 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Get Instant Feedback
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Paste your resume and a job description below to see how well they
          match.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="resume"
            className="flex items-center text-lg font-medium"
          >
            <FileText className="mr-2 h-5 w-5" />
            Your Resume
          </Label>
          <Textarea
            id="resume"
            placeholder="Paste the full text of your resume here..."
            className="min-h-[300px] text-sm"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="job-description"
            className="flex items-center text-lg font-medium"
          >
            <Briefcase className="mr-2 h-5 w-5" />
            Job Description
          </Label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description here..."
            className="min-h-[300px] text-sm"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Now'
          )}
        </Button>
      </div>

      <AnalysisResults />
    </section>
  );
}
