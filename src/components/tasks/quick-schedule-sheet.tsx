"use client";

import { format, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITY_OPTIONS, REMINDER_FREQUENCY_OPTIONS } from "@/lib/constants";
import { todayISODate } from "@/lib/utils";
import { scheduleTask } from "@/services/tasksService";
import type { ReminderFrequency, Task, TaskPriority } from "@/types/task";

interface QuickScheduleSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled?: (task: Task) => void;
}

export function QuickScheduleSheet({ task, open, onOpenChange, onScheduled }: QuickScheduleSheetProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("09:00");
  const [reminder, setReminder] = useState<ReminderFrequency>("one_time");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task && open) {
      const initialDate = task.scheduled_date ? parseISO(`${task.scheduled_date}T00:00:00`) : new Date();
      // Sheet content stays mounted between opens, so fields are re-synced
      // from the target task each time it opens rather than only on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDate(isValid(initialDate) ? initialDate : new Date());
      setTime(task.scheduled_time?.slice(0, 5) || "09:00");
      setReminder(task.reminder_frequency === "none" ? "one_time" : task.reminder_frequency);
      setPriority(task.priority);
      setNotes(task.notes ?? "");
    }
  }, [task, open]);

  async function handleSave() {
    if (!task || !date) return;
    setSaving(true);
    try {
      const updated = await scheduleTask(task.id, {
        scheduled_date: format(date, "yyyy-MM-dd"),
        scheduled_time: `${time}:00`,
        reminder_frequency: reminder,
        priority,
        notes: notes.trim() || undefined,
      });
      toast.success("Task scheduled");
      onScheduled?.(updated);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[90vh] w-full rounded-t-3xl sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Quick Schedule</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 pb-2">
          <p className="neu-sunken-sm line-clamp-2 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            {task?.title || task?.voice_transcript}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="outline" className="w-full justify-start font-normal">
                      <CalendarIcon className="size-4" />
                      {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                    </Button>
                  }
                />
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    defaultMonth={date}
                    disabled={{ before: parseISO(`${todayISODate()}T00:00:00`) }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="schedule-time">Time</Label>
              <Input
                id="schedule-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
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

          <div className="space-y-1.5">
            <Label htmlFor="schedule-notes">Notes</Label>
            <Textarea
              id="schedule-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any extra detail…"
              className="min-h-20"
            />
          </div>
        </div>

        <SheetFooter>
          <Button onClick={handleSave} disabled={saving || !date} size="lg" className="w-full">
            {saving ? "Saving…" : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
