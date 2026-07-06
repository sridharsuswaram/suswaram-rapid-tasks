import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { auth, db } from "@/services/firebase/client";
import { todayISODate } from "@/lib/utils";
import type { Task, TaskInsert, TaskUpdate } from "@/types/task";

const COLLECTION = "tasks";
const tasksCollection = collection(db, COLLECTION);

function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");
  return uid;
}

function nowISO() {
  return new Date().toISOString();
}

function docToTask(snap: QueryDocumentSnapshot<DocumentData>): Task {
  return { id: snap.id, ...snap.data() } as Task;
}

function defaultTaskFields() {
  const now = nowISO();
  return {
    status: "dump" as const,
    created_at: now,
    updated_at: now,
    scheduled_date: null,
    scheduled_time: null,
    reminder_frequency: "none" as const,
    priority: "medium" as const,
    notes: null,
    completed_on: null,
    last_reminded: null,
    archive: false,
    is_dump: true,
    source: "manual" as const,
  };
}

export async function createDumpTask(input: {
  title?: string;
  voice_transcript: string;
  source?: TaskInsert["source"];
}): Promise<Task> {
  const user_id = getUserId();
  const data = {
    ...defaultTaskFields(),
    user_id,
    title: input.title ?? input.voice_transcript.slice(0, 80),
    voice_transcript: input.voice_transcript,
    source: input.source ?? "voice",
    status: "dump" as const,
    is_dump: true,
  };
  const ref = await addDoc(tasksCollection, data);
  return { id: ref.id, ...data };
}

export async function listTasks(): Promise<Task[]> {
  const q = query(tasksCollection, where("user_id", "==", getUserId()), orderBy("created_at", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(docToTask);
}

export async function listByStatus(status: Task["status"]): Promise<Task[]> {
  const q = query(
    tasksCollection,
    where("user_id", "==", getUserId()),
    where("status", "==", status),
    orderBy("created_at", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(docToTask);
}

export async function listByDate(date: string): Promise<Task[]> {
  const q = query(
    tasksCollection,
    where("user_id", "==", getUserId()),
    where("scheduled_date", "==", date),
    orderBy("scheduled_time", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(docToTask);
}

export async function listToday(): Promise<Task[]> {
  return listByDate(todayISODate());
}

export async function getTask(id: string): Promise<Task | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Task) : null;
}

export async function updateTask(id: string, patch: TaskUpdate): Promise<Task> {
  const ref = doc(db, COLLECTION, id);
  // Firestore rejects `undefined` field values outright (unlike the old Supabase
  // client, which silently dropped them via JSON serialization) — strip them so
  // an optional field left blank by a caller doesn't throw.
  const cleanPatch = Object.fromEntries(
    Object.entries({ ...patch, updated_at: nowISO() }).filter(([, value]) => value !== undefined)
  );
  await updateDoc(ref, cleanPatch);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Task not found after update");
  return { id: snap.id, ...snap.data() } as Task;
}

export async function scheduleTask(
  id: string,
  fields: {
    scheduled_date: string;
    scheduled_time: string;
    reminder_frequency: Task["reminder_frequency"];
    priority: Task["priority"];
    notes?: string;
  }
): Promise<Task> {
  return updateTask(id, { ...fields, status: "scheduled", is_dump: false });
}

export async function markComplete(id: string): Promise<Task> {
  return updateTask(id, { status: "completed", completed_on: nowISO() });
}

export async function startTask(id: string): Promise<Task> {
  return updateTask(id, { status: "in_progress" });
}

export async function archiveTask(id: string): Promise<Task> {
  return updateTask(id, { status: "archived", archive: true });
}

export async function cancelTask(id: string): Promise<Task> {
  return updateTask(id, { status: "cancelled" });
}

export async function deleteTask(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function bulkInsert(tasks: TaskInsert[]): Promise<void> {
  const user_id = getUserId();
  const batch = writeBatch(db);
  tasks.forEach((task) => {
    const ref = doc(tasksCollection);
    batch.set(ref, { ...defaultTaskFields(), ...task, user_id });
  });
  await batch.commit();
}

export function subscribeToTasks(userId: string, onChange: () => void) {
  const q = query(tasksCollection, where("user_id", "==", userId));
  return onSnapshot(q, () => onChange(), (err) => console.error("tasks subscription error", err));
}
