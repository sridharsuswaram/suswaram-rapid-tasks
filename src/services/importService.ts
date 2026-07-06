import type { TaskInsert } from "@/types/task";

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function normalizeRow(row: Record<string, unknown>): TaskInsert {
  const voiceTranscript = String(row.voice_transcript ?? row.title ?? "");
  const status = (row.status as TaskInsert["status"]) || "dump";
  return {
    title: String(row.title ?? voiceTranscript.slice(0, 80)),
    voice_transcript: voiceTranscript,
    status,
    scheduled_date: (row.scheduled_date as string) || null,
    scheduled_time: (row.scheduled_time as string) || null,
    reminder_frequency: (row.reminder_frequency as TaskInsert["reminder_frequency"]) || "none",
    priority: (row.priority as TaskInsert["priority"]) || "medium",
    notes: (row.notes as string) || null,
    archive: row.archive === true || row.archive === "true",
    is_dump: row.is_dump !== undefined ? row.is_dump === true || row.is_dump === "true" : status === "dump",
    source: "manual",
  };
}

export function parseCSV(content: string): TaskInsert[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = values[i] ?? "";
    });
    return normalizeRow(row);
  });
}

export function parseJSON(content: string): TaskInsert[] {
  const data = JSON.parse(content);
  const list = Array.isArray(data) ? data : [data];
  return list.map((row) => normalizeRow(row as Record<string, unknown>));
}

export function parseImportFile(filename: string, content: string): TaskInsert[] {
  if (filename.toLowerCase().endsWith(".json")) return parseJSON(content);
  return parseCSV(content);
}
