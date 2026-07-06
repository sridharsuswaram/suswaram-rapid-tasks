"use client";

import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PRIORITY_OPTIONS,
  REMINDER_FREQUENCY_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from "@/lib/constants";
import type { ReminderFrequency, Task, TaskPriority, TaskStatus, TaskUpdate } from "@/types/task";

interface EditTaskFormProps {
  task: Task;
  onSave: (patch: TaskUpdate) => void | Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

const STATUS_OPTIONS = STATUS_FILTER_OPTIONS.filter((o) => o.value !== "all") as {
  value: TaskStatus;
  label: string;
}[];

export function EditTaskForm({ task, onSave, onCancel, saving }: EditTaskFormProps) {
  const [transcript, setTranscript] = useState(task.voice_transcript);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [date, setDate] = useState<Date | undefined>(
    task.scheduled_date && isValid(parseISO(`${task.scheduled_date}T00:00:00`))
      ? parseISO(`${task.scheduled_date}T00:00:00`)
      : undefined
  );
  const [time, setTime] = useState(task.scheduled_time?.slice(0, 5) ?? "");
  const [reminder, setReminder] = useState<ReminderFrequency>(task.reminder_frequency);
  const [notes, setNotes] = useState(task.notes ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      voice_transcript: transcript,
      title: transcript.slice(0, 80),
      status,
      priority,
      scheduled_date: date ? format(date, "yyyy-MM-dd") : null,
      scheduled_time: time ? `${time}:00` : null,
      reminder_frequency: reminder,
      notes: notes.trim() || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-card p-4 shadow-soft">
      <div className="space-y-1.5">
        <Label htmlFor="edit-transcript">Transcript</Label>
        <Textarea
          id="edit-transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="min-h-24"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => v && setStatus(v as TaskStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(v) => v && setPriority(v as TaskPriority)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="outline" className="w-full justify-start font-normal">
                  <CalendarIcon className="size-4" />
                  {date ? format(date, "MMM d, yyyy") : "No date"}
                </Button>
              }
            />
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-time">Time</Label>
          <Input id="edit-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Reminder frequency</Label>
        <Select value={reminder} onValueChange={(v) => v && setReminder(v as ReminderFrequency)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REMINDER_FREQUENCY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="edit-notes">Notes</Label>
        <Textarea
          id="edit-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-20"
          placeholder="Add any extra detail…"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
