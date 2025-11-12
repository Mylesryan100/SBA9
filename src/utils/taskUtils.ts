import { useEffect, useState } from 'react';
import type { Filters, SortDir, SortKey, Task, TaskFormData } from '../types';

/** Toggle to see console traces while developing */
export const DEBUG = false;
const log = (...a: unknown[]) => DEBUG && console.log('[taskUtils]', ...a);

/* ---------------------------------- Dates ---------------------------------- */
export const nowISO = () => new Date().toISOString();

/** True if `iso` is a valid past date (used for overdue cues) */
export const isOverdue = (iso?: string) =>
  iso ? new Date(iso).getTime() < Date.now() : false;

/** Human-friendly date (or em dash if missing) */
export const formatDate = (iso?: string, locale?: string) =>
  iso ? new Date(iso).toLocaleDateString(locale) : '—';

/** Convert yyyy-mm-dd (from <input type="date">) to ISO or undefined */
export const toISODate = (yyyyMmDd?: string) =>
  yyyyMmDd ? new Date(yyyyMmDd).toISOString() : undefined;

/* ----------------------------- LocalStorage hook ---------------------------- */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as T) : initial;
      log('init', key, parsed);
      return parsed;
    } catch (e) {
      console.warn('[useLocalStorage] parse failed:', e);
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      log('persist', key, value);
    } catch (e) {
      console.error('[useLocalStorage] write failed:', e);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

/* ------------------------------- Validation -------------------------------- */
export type FieldErrors = Record<string, string>;

/** Validate Task form values and return a field->message map */
export function validateTask(data: TaskFormData): FieldErrors {
  const e: FieldErrors = {};
  const title = (data.title ?? '').trim();

  if (!title) e.title = 'Title is required';
  else if (title.length > 80) e.title = 'Max 80 characters';

  if (data.description && data.description.length > 1000) {
    e.description = 'Max 1000 characters';
  }

  // Optional: soft warning if dueDate is in the past (do not block)
  // if (data.dueDate && new Date(data.dueDate) < new Date(new Date().toDateString())) {
  //   e.dueDate = 'Due date is in the past';
  // }

  log('validateTask', { data, e });
  return e;
}

/** Convert validated form data into a persisted Task with an order index. */
export function toTask(data: TaskFormData, nextOrder: number): Task {
  const t: Task = {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    priority: data.priority,
    status: data.status,
    dueDate: toISODate(data.dueDate),
    createdAt: nowISO(),
    updatedAt: nowISO(),
    order: nextOrder,
  };
  log('toTask', t);
  return t;
}

/* --------------------------- Filtering & Sorting ---------------------------- */
const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
const priorityRank: Record<Task['priority'], number> = { low: 1, medium: 2, high: 3 };

/** Case-insensitive search across title & description */
function matchesQuery(t: Task, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    t.title.toLowerCase().includes(needle) ||
    (t.description ? t.description.toLowerCase().includes(needle) : false)
  );
}

/** Compare two tasks by a SortKey */
function compareBy(a: Task, b: Task, by: SortKey): number {
  switch (by) {
    case 'title':
      return collator.compare(a.title, b.title);
    case 'priority':
      return priorityRank[a.priority] - priorityRank[b.priority];
    case 'createdAt':
      return (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
    case 'dueDate':
      return (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
    case 'order':
    default:
      return (a.order ?? 0) - (b.order ?? 0);
  }
}

/** Sort tasks with a given key & direction */
export function sortTasks(list: Task[], by: SortKey, dir: SortDir): Task[] {
  const s = [...list].sort((a, b) => compareBy(a, b, by));
  return dir === 'asc' ? s : s.reverse();
}

/** Apply text search + status/priority filters + sorting */
export function applyFilters(list: Task[], f: Filters): Task[] {
  let out = list;

  if (f.query) out = out.filter(t => matchesQuery(t, f.query));
  if (f.status !== 'all') out = out.filter(t => t.status === f.status);
  if (f.priority !== 'all') out = out.filter(t => t.priority === f.priority);

  const sorted = sortTasks(out, f.sortBy, f.sortDir);
  log('applyFilters', { in: list.length, out: sorted.length, f });
  return sorted;
}