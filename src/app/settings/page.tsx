"use client";

import { Download, LogOut, Moon, Sun, Upload, UserRound } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useVoiceLanguage } from "@/hooks/use-voice-language";
import { APP_NAME, APP_TAGLINE, APP_VERSION, VOICE_LANGUAGE_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { exportTasksAsCSV, exportTasksAsJSON } from "@/services/exportService";
import { parseImportFile } from "@/services/importService";
import { browserNotificationProvider } from "@/services/reminders/browser-provider";
import { bulkInsert, listTasks } from "@/services/tasksService";

const THEME_OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useVoiceLanguage();
  const [notifPermission, setNotifPermission] = useState(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleEnableNotifications(checked: boolean) {
    if (!checked) return;
    const granted = await browserNotificationProvider.requestPermission?.();
    setNotifPermission(granted ? "granted" : "denied");
    if (!granted) toast.error("Notification permission was denied.");
    else toast.success("Browser notifications enabled");
  }

  async function handleExport(format: "csv" | "json") {
    setExporting(true);
    try {
      const tasks = await listTasks();
      if (format === "csv") exportTasksAsCSV(tasks);
      else exportTasksAsJSON(tasks);
      toast.success("Export ready — check your downloads");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const content = await file.text();
      const rows = parseImportFile(file.name, content);
      if (rows.length === 0) {
        toast.error("No tasks found in that file");
        return;
      }
      await bulkInsert(rows);
      toast.success(`Imported ${rows.length} task${rows.length === 1 ? "" : "s"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-1 flex-col">
      <TopBar title="Settings" backHref="/" />

      <div className="flex-1 space-y-6 px-4 pb-10">
        <section className="space-y-3 rounded-2xl bg-card p-4 shadow-soft">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserRound className="size-4" /> {user?.email}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-card p-4 shadow-soft">
          <Label>Theme</Label>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={theme === opt.value ? "default" : "secondary"}
                className={cn("flex-1 gap-1.5", theme === opt.value && "shadow-soft")}
                onClick={() => setTheme(opt.value)}
              >
                <opt.icon className="size-4" /> {opt.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-card p-4 shadow-soft">
          <Label>Voice language</Label>
          <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOICE_LANGUAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="space-y-3 rounded-2xl bg-card p-4 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor="notif-switch">Browser reminders</Label>
              <p className="text-xs text-muted-foreground">
                Get a browser notification when a scheduled task&apos;s reminder is due.
              </p>
            </div>
            <Switch
              id="notif-switch"
              checked={notifPermission === "granted"}
              onCheckedChange={handleEnableNotifications}
            />
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-card p-4 shadow-soft">
          <Label>Export data</Label>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 gap-1.5"
              disabled={exporting}
              onClick={() => handleExport("csv")}
            >
              <Download className="size-4" /> CSV
            </Button>
            <Button
              variant="secondary"
              className="flex-1 gap-1.5"
              disabled={exporting}
              onClick={() => handleExport("json")}
            >
              <Download className="size-4" /> JSON
            </Button>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl bg-card p-4 shadow-soft">
          <Label>Import data</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            className="hidden"
            onChange={handleImportFile}
          />
          <Button
            variant="secondary"
            className="w-full gap-1.5"
            disabled={importing}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="size-4" /> {importing ? "Importing…" : "Choose CSV or JSON file"}
          </Button>
        </section>

        <section className="space-y-1 rounded-2xl bg-card p-4 text-center shadow-soft">
          <p className="font-semibold">{APP_NAME}</p>
          <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
          <p className="text-xs text-muted-foreground">Version {APP_VERSION}</p>
        </section>

        <Button
          variant="destructive"
          className="w-full gap-1.5"
          onClick={async () => {
            await signOut();
            router.push("/login");
          }}
        >
          <LogOut className="size-4" /> Sign out
        </Button>
      </div>
    </main>
  );
}
