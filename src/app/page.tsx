"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { IconsArcLayout } from "@/components/home/icons-arc-layout";
import { LiveClock } from "@/components/home/live-clock";
import { MicButton } from "@/components/home/mic-button";
import { WaveformBars } from "@/components/home/waveform-bars";
import { QuickTags } from "@/components/tasks/quick-tags";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useVoiceLanguage } from "@/hooks/use-voice-language";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { formatDuration, getQuoteOfTheDay } from "@/lib/utils";
import { createDumpTask, updateTask } from "@/services/tasksService";
import type { Task } from "@/types/task";

export default function HomePage() {
  const { language } = useVoiceLanguage();
  const voice = useVoiceRecorder({ lang: language });
  const [savedTask, setSavedTask] = useState<Task | null>(null);
  const [manualText, setManualText] = useState("");
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [showTagsPanel, setShowTagsPanel] = useState(false);
  const [recordedTranscript, setRecordedTranscript] = useState("");
  const wasRecording = useRef(false);
  const quote = useMemo(() => getQuoteOfTheDay(), []);

  useEffect(() => {
    if (wasRecording.current && !voice.isRecording) {
      const text = voice.transcript.trim();
      if (text) {
        setRecordedTranscript(text);
        setShowTagsPanel(true);
      }
    }
    wasRecording.current = voice.isRecording;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice.isRecording]);

  async function handleSaveWithTags() {
    if (!recordedTranscript) return;
    setSaving(true);
    try {
      const task = await createDumpTask({ voice_transcript: recordedTranscript, tags });
      setSavedTask(task);
      setTags([]);
      setShowTagsPanel(false);
      setRecordedTranscript("");
      toast.success("Task Saved Successfully");
      voice.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setSaving(false);
    }
  }

  function handleMicClick() {
    if (!voice.isRecording) {
      setSavedTask(null);
      setTags([]);
      setShowTagsPanel(false);
      setRecordedTranscript("");
    }
    voice.toggle();
  }

  async function handleTranscriptBlur() {
    if (!savedTask) return;
    try {
      await updateTask(savedTask.id, {
        voice_transcript: savedTask.voice_transcript,
        title: savedTask.voice_transcript.slice(0, 80),
      });
    } catch {
      toast.error("Couldn't save your edit");
    }
  }

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = manualText.trim();
    if (!text) return;
    setSaving(true);
    try {
      const task = await createDumpTask({ voice_transcript: text, source: "manual", tags });
      setSavedTask(task);
      setManualText("");
      setTags([]);
      toast.success("Task Saved Successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center justify-between px-4">
        <div className="w-6" />
        <Logo markClassName="h-6 w-auto" wordmarkClassName="text-lg" />
        <ThemeToggle />
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-16">
        <LiveClock />

        <div className="relative flex flex-col items-center gap-2">
          <MicButton
            isRecording={voice.isRecording}
            onClick={handleMicClick}
            disabled={saving}
          />
          <IconsArcLayout />
        </div>

        <div className="flex h-8 flex-col items-center justify-center">
          {voice.isRecording && (
            <div className="flex items-center gap-3">
              <WaveformBars active />
              <span className="text-sm font-medium tabular-nums text-muted-foreground">
                {formatDuration(voice.elapsedSeconds)}
              </span>
            </div>
          )}
        </div>

        {voice.isRecording && voice.transcript && (
          <p className="max-w-md text-center text-sm text-muted-foreground">{voice.transcript}</p>
        )}

        {showTagsPanel && !savedTask && (
          <motion.div
            className="w-full max-w-md space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuickTags tags={tags} onTagsChange={setTags} />
            <div className="flex gap-2">
              <button
                onClick={handleSaveWithTags}
                disabled={saving}
                className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving..." : "Save Task"}
              </button>
              <button
                onClick={() => {
                  setShowTagsPanel(false);
                  setTags([]);
                  setRecordedTranscript("");
                  voice.reset();
                }}
                className="rounded-lg bg-background px-4 py-2 text-sm font-medium hover:bg-background/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {voice.error && <p className="text-sm text-destructive">{voice.error}</p>}

        {!voice.isSupported && (
          <form onSubmit={handleManualSubmit} className="w-full max-w-md space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Voice input isn&apos;t supported in this browser — type your thought instead.
            </p>
            <Textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-24 rounded-2xl bg-card neu-raised"
            />
            <Button type="submit" className="w-full" disabled={saving || !manualText.trim()}>
              Save to Dump
            </Button>
          </form>
        )}

        <AnimatePresence mode="wait">
          {savedTask && !voice.isRecording && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full max-w-md space-y-2 rounded-2xl bg-card p-4 neu-raised"
            >
              <p className="text-xs font-medium text-muted-foreground">Just saved</p>
              <Textarea
                value={savedTask.voice_transcript}
                onChange={(e) => setSavedTask({ ...savedTask, voice_transcript: e.target.value })}
                onBlur={handleTranscriptBlur}
                className="min-h-16 resize-none border-none bg-transparent p-0 shadow-none! focus-visible:ring-0"
              />
              <Link href="/dump" className="text-xs font-medium text-primary hover:underline">
                View in Task Dump →
              </Link>
            </motion.div>
          )}

          {!voice.isRecording && !savedTask && (
            <motion.p
              key="quote"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-xs text-center text-sm text-muted-foreground italic"
            >
              {quote}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
