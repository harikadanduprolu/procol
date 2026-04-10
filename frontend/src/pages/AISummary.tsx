import React, { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { aiApi } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Loader2, ClipboardCopy, Wand2 } from 'lucide-react';

const sampleTasks = [
  'Finalize project scope and feature list',
  'Review teammate assignments and blockers',
  'Prepare demo slides for deployment review',
  'Fix login timeout issue on production deployment',
];

const AISummary = () => {
  const { toast } = useToast();
  const [tasksText, setTasksText] = useState(sampleTasks.join('\n'));
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tasks = useMemo(
    () => tasksText.split('\n').map((task) => task.trim()).filter(Boolean),
    [tasksText]
  );

  const handleSummarize = async () => {
    if (!tasks.length) {
      toast({
        title: 'Add tasks first',
        description: 'Paste or type at least one task to summarize.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      setSummary('');
      const response = await aiApi.summarizeTasks(tasks);
      setSummary(response.data?.data || 'No summary returned.');
      toast({
        title: 'Summary ready',
        description: 'AI analyzed your tasks successfully.',
      });
    } catch (error) {
      console.error('AI summary failed:', error);
      toast({
        title: 'AI failed',
        description: 'Could not generate summary. Check your OpenAI key and backend logs.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copySummary = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    toast({
      title: 'Copied',
      description: 'Summary copied to clipboard.',
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-black p-8 shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.16),transparent_30%)]" />
            <div className="relative z-10 flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue shadow-lg shadow-neon-blue/20">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold gradient-text">AI Task Summary</h1>
                <p className="text-sm text-zinc-300">Summarize tasks, surface risks, and keep the team aligned.</p>
              </div>
            </div>

            <div className="relative z-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Task Input</CardTitle>
                  <CardDescription className="text-zinc-300">
                    Enter one task per line. The AI will return a summary, insights, pending work, and risks.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={tasksText}
                    onChange={(event) => setTasksText(event.target.value)}
                    rows={12}
                    className="min-h-[320px] border-white/10 bg-black/40 text-white placeholder:text-zinc-500"
                    placeholder="Write tasks here, one per line"
                  />

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleSummarize}
                      disabled={isLoading}
                      className="bg-neon-purple hover:bg-neon-purple/80 text-white"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Summarizing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Wand2 className="h-4 w-4" />
                          Summarize Tasks
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setTasksText(sampleTasks.join('\n'))}
                      className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
                    >
                      Load Example
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-xl">AI Output</CardTitle>
                  <CardDescription className="text-zinc-300">
                    The latest response from the backend AI service appears here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {summary ? (
                    <>
                      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-6 whitespace-pre-wrap text-zinc-100 min-h-[320px]">
                        {summary}
                      </div>
                      <Button
                        variant="outline"
                        onClick={copySummary}
                        className="border-neon-purple text-neon-purple hover:bg-neon-purple/10"
                      >
                        <ClipboardCopy className="mr-2 h-4 w-4" />
                        Copy Summary
                      </Button>
                    </>
                  ) : (
                    <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/30 p-6 text-center text-zinc-400">
                      Run the summarizer to see insights here.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AISummary;
