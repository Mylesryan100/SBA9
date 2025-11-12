import { useEffect, useState } from 'react';
import type { Filters, SortDir, SortKey, Task, TaskFormData } from '../types';

export const DEBUG = false;
const log = (...a: unknown[]) => DEBUG && console.log('[taskUtils]', ...a);
export const nowISO = () => new Date().toISOString();
export const isOverdue = (iso?: string) =>
  iso ? new Date(iso).getTime() < Date.now() : false;
export const formatDate = (iso?: string, locale?: string) =>
  iso ? new Date(iso).toLocaleDateString(locale) : '—';
export const toISODate = (yyyyMmDd?: string) =>
  yyyyMmDd ? new Date(yyyyMmDd).toISOString() : undefined;
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

export type FieldErrors = Record<string, string>;
export function validateTask(data: TaskFormData): FieldErrors {
  const e: FieldErrors = {};
  const title = (data.title ?? '').trim();
  if (!title) e.title = 'Title is required';
  else if (title.length > 80) e.title = 'Max 80 characters';
  if (data.description && data.description.length > 1000) {
    e.description = 'Max 1000 characters';
  }

  log('validateTask', { data, e });
  return e;
}

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

const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
const priorityRank: Record<Task['priority'], number> = { low: 1, medium: 2, high: 3 };

function matchesQuery(t: Task, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    t.title.toLowerCase().includes(needle) ||
    (t.description ? t.description.toLowerCase().includes(needle) : false)
  );
}

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


export function sortTasks(list: Task[], by: SortKey, dir: SortDir): Task[] {
  const s = [...list].sort((a, b) => compareBy(a, b, by));
  return dir === 'asc' ? s : s.reverse();
}

export function applyFilters(list: Task[], f: Filters): Task[] {
  let out = list;

  if (f.query) out = out.filter(t => matchesQuery(t, f.query));
  if (f.status !== 'all') out = out.filter(t => t.status === f.status);
  if (f.priority !== 'all') out = out.filter(t => t.priority === f.priority);

  const sorted = sortTasks(out, f.sortBy, f.sortDir);
  log('applyFilters', { in: list.length, out: sorted.length, f });
  return sorted;
}