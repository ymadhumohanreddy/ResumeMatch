'use client';

import {useMemo, useState} from 'react';
import type {AnalyzeResumeOutput} from '@/ai/flows/resume-analysis';
import {analyzeResume} from '@/ai/flows/resume-analysis';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ClipboardCheck,
  Download,
  FileText,
  Lightbulb,
  Loader2,
  Sparkles,
  ThumbsUp,
  UploadCloud,
} from 'lucide-react';
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Progress} from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function ResumeMatcherSection() {
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] =
    useState<AnalyzeResumeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const {toast} = useToast();

  const progress = useMemo(() => Math.round((step / 3) * 100), [step]);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF or DOCX file.',
        variant: 'destructive',
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File Too Large',
        description: 'Please upload a file smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setResumeFile(file);
    setIsLoading(true);
    setLoadingMessage('Parsing your resume...');
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      let text = '';
      if (file.type === 'application/pdf') {
        const pdf = await pdfjs.getDocument(new Uint8Array(arrayBuffer))
          .promise;
        const numPages = pdf.numPages;
        const pageTexts = [];
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map(item => ('str' in item ? item.str : ''))
            .join(' ');
          pageTexts.push(pageText);
        }
        text = pageTexts.join('\n');
      } else {
        const result = await mammoth.extractRawText({arrayBuffer});
        text = result.value;
      }
      setResumeText(text);
      setStep(2);
    } catch (e) {
      console.error(e);
      setError('Failed to parse the resume file. Please try another file.');
      toast({
        title: 'Parsing Error',
        description:
          'Could not read the resume file. It might be corrupted or in an unsupported format.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both your resume and the job description.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setLoadingMessage('Our AI is analyzing your documents...');
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResume({resumeText, jobDescription});
      setAnalysisResult(result);
      setStep(3);
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

  const downloadOptimizedResume = () => {
    if (!analysisResult?.optimizedResumeText) return;
    const blob = new Blob([analysisResult.optimizedResumeText], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download =
      `${resumeFile?.name.split('.')[0]}_optimized.txt` ||
      'optimized_resume.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setStep(1);
    setResumeFile(null);
    setResumeText('');
    setJobDescription('');
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-semibold">{loadingMessage}</p>
          <p className="text-muted-foreground">This may take a few moments.</p>
        </div>
      );
    }

    switch (step) {
      case 1:
        return (
          <div className="p-8 text-center">
            <h3 className="mb-2 text-2xl font-semibold tracking-tight">
              Upload Your Resume
            </h3>
            <p className="mb-6 text-muted-foreground">
              Let's start by uploading your current resume (PDF or DOCX, max
              5MB).
            </p>
            <div
              className="relative cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/50 p-12 transition-colors hover:border-primary"
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                handleFileChange(e.dataTransfer.files[0]);
              }}
            >
              <input
                type="file"
                id="resume-upload"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                onChange={e => handleFileChange(e.target.files?.[0] || null)}
                accept=".pdf,.docx"
              />
              <div className="flex flex-col items-center">
                <UploadCloud className="mb-4 h-12 w-12 text-muted-foreground" />
                <p className="font-semibold">Drag & drop your file here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>
            </div>
            {resumeFile && (
              <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
                <FileText className="mr-2 h-4 w-4" />
                <span>{resumeFile.name}</span>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="p-8">
            <h3 className="mb-2 text-2xl font-semibold tracking-tight">
              Paste Job Description
            </h3>
            <p className="mb-6 text-muted-foreground">
              Now, paste the full job description into the box below.
            </p>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              className="min-h-[300px] text-sm"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleAnalyze} disabled={!jobDescription.trim()}>
                Analyze Now
              </Button>
            </div>
          </div>
        );
      case 3:
        if (error) {
          return (
            <div className="p-8">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center text-destructive">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Analysis Error
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{error}</p>
                  <Button onClick={resetForm} className="mt-4">
                    Start Over
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        }
        if (!analysisResult) return null;

        if (!analysisResult.isResume) {
          return (
            <div className="p-8">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="flex items-center text-destructive">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Document Analysis Failed
                  </CardTitle>
                  <CardDescription>
                    The uploaded document does not appear to be a resume.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analysisResult.rejectionReason && (
                    <p className="mb-4 text-muted-foreground">
                      <strong>Reason:</strong> {analysisResult.rejectionReason}
                    </p>
                  )}
                  <Button onClick={resetForm}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Try Again with a
                    Different File
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        }

        return (
          <div className="space-y-8 p-4 sm:p-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="optimized">Optimized Resume</TabsTrigger>
                <TabsTrigger value="tips">Tailoring Tips</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-primary" />
                      Your Instant Insights
                    </CardTitle>
                    <CardDescription>
                      Here’s how your resume stacks up against the job
                      description.
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
                          value={analysisResult.compatibilityScore ?? 0}
                          className="h-4"
                        />
                        <span className="text-2xl font-bold text-primary">
                          {analysisResult.compatibilityScore ?? 0}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="flex items-center text-lg font-medium">
                        <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
                        Suggested Keywords
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Consider adding these keywords from the job description.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysisResult.suggestedKeywords &&
                        analysisResult.suggestedKeywords.length > 0 ? (
                          analysisResult.suggestedKeywords.map(
                            (keyword, index) => (
                              <Badge key={index} variant="outline">
                                {keyword}
                              </Badge>
                            )
                          )
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
                        These skills are in the job description but seem to be
                        missing.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {analysisResult.missingSkills &&
                        analysisResult.missingSkills.length > 0 ? (
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
              </TabsContent>
              <TabsContent value="optimized" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ClipboardCheck className="mr-2 h-5 w-5 text-green-500" />
                      Optimized Resume
                    </CardTitle>
                    <CardDescription>
                      We've rewritten your resume to better target this job.
                      Review and download it below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      readOnly
                      className="min-h-[300px] bg-muted/50 text-sm"
                      value={analysisResult.optimizedResumeText ?? ''}
                    />
                    <Button
                      onClick={downloadOptimizedResume}
                      className="mt-4"
                      disabled={!analysisResult.optimizedResumeText}
                    >
                      <Download className="mr-2 h-4 w-4" /> Download Optimized
                      Resume
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="tips" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ThumbsUp className="mr-2 h-5 w-5 text-blue-500" />
                      Tailoring Tips
                    </CardTitle>
                    <CardDescription>
                      Use these tips to adapt your resume for other similar
                      jobs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                      {analysisResult.tailoringTips?.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="text-center">
              <Button onClick={resetForm} size="lg">
                Analyze Another Job
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="try-it" className="container py-20 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Get Instant Feedback
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Follow the steps to see how your resume matches a job.
        </p>
      </div>

      <Card className="mx-auto mt-10 max-w-5xl">
        <div className="border-b p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">Step {step} of 3</span>
            <span className="text-sm text-muted-foreground">
              {step === 1
                ? 'Upload Resume'
                : step === 2
                  ? 'Add Job Description'
                  : 'View Insights'}
            </span>
          </div>
          <Progress value={progress} className="h-2 w-full" />
        </div>
        <div className="animate-in fade-in duration-500">{renderContent()}</div>
      </Card>
    </section>
  );
}
