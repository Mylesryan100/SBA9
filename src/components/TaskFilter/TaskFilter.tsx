import { useEffect, useMemo, useState } from 'react';
import type { Filters } from '../../types';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const DEBUG = true;
const log = (...a: unknown[]) => DEBUG && console.log('[TaskFilter]', ...a);

interface Props {
  value: Filters;                  
  onChange: (f: Filters) => void; 
  onReset?: () => void;            

const DEFAULTS: Filters = {
  query: '',
  status: 'all',
  priority: 'all',
  sortBy: 'order',
  sortDir: 'asc',
};

function TaskFilter({ value, onChange, onReset }: Props) {
  const [f, setF] = useState<Filters>(value ?? DEFAULTS);

  useEffect(() => {
    log('sync-in from parent', value);
    setF(value ?? DEFAULTS);
  }, [value]);

  useEffect(() => {
    log('emit change', f);
    onChange(f);
  }, [f]);

  const activeCount = useMemo (() => Number(Boolean(f.query.trim())) + Number(f.status !== 'all') + Number(f.priority !== 'all'),
    [f]);

  function clearAll() {
    log('clear all clicked');
    setF({ ...f, query: '', status: 'all', priority: 'all' });
    onReset?.();
  }

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-3 grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative sm:col-span-2">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            className="w-full pl-10 border rounded-lg px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            placeholder="Search title/description"
            value={f.query}
            onChange={(e) => setF({ ...f, query: e.target.value })}
            aria-label="Search tasks"/>
          {f.query && (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setF({ ...f, query: '' })}>
              <XMarkIcon className="h-4 w-4 text-slate-500" />
            </button>
          )}
        </div>

        <select
          className="border rounded-lg px-3 py-2"
          value={f.status}
          onChange={(e) => setF({ ...f, status: e.target.value as Filters['status'] })}
          aria-label="Filter by status">
          <option value="all">All statuses</option>
          <option value="todo">To do</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={f.priority}
          onChange={(e) => setF({ ...f, priority: e.target.value as Filters['priority'] })}
          aria-label="Filter by priority">
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-600 dark:text-slate-300">
          Active filters: <strong>{activeCount}</strong>
        </span>

        {Boolean(f.query.trim()) && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1">
            search: “{f.query}”
            <button
              type="button"
              aria-label="Clear search filter"
              className="hover:text-red-600"
              onClick={() => setF({ ...f, query: '' })}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </span>
        )}
        {f.status !== 'all' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1">
            status: {f.status.replace('_', ' ')}
            <button
              type="button"
              aria-label="Clear status filter"
              className="hover:text-red-600"
              onClick={() => setF({ ...f, status: 'all' })}>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </span>
        )}
        {f.priority !== 'all' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1">
            priority: {f.priority}
            <button
              type="button"
              aria-label="Clear priority filter"
              className="hover:text-red-600"
              onClick={() => setF({ ...f, priority: 'all' })}>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </span>
        )}

        {activeCount > 0 && (
          <button
            type="button"
            className="ml-auto text-slate-700 dark:text-slate-200 px-3 py-1 rounded border hover:bg-slate-50 dark:hover:bg-slate-700"
            onClick={clearAll}>
            Clear
          </button>
        )}
      </div>
    </section>
  );
}

export default TaskFilter;