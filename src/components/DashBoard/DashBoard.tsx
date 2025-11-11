

import { useMemo } from 'react';
import type { Task } from '../../types';
import {ListBulletIcon, CheckBadgeIcon, ClockIcon,} from '@heroicons/react/24/outline';

const DEBUG = true;
const log = (...a: unknown[]) => DEBUG && console.log('[Dashboard]', ...a);

export interface DashboardProps {
  tasks: Task[];
}

function Dashboard({ tasks }: DashboardProps) {
    const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'todo').length;
    const recent = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
    const out = { total, completed, inProgress, pending, recent };
    log('stats', out);
    return out;
  }, [tasks]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          title="Total Tasks"
          value={stats.total}
          Icon={ListBulletIcon}/>
        <StatCard
          title="Completed"
          value={stats.completed}
          Icon={CheckBadgeIcon}/>
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          Icon={ClockIcon}/>
        <StatCard
          title="Pending"
          value={stats.pending}
          Icon={ClockIcon}/>
      </section>
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4">
          <h3 className="font-medium mb-2">Recently Created Tasks</h3>
          {stats.recent.length === 0 ? (
            <p className="text-slate-600">No tasks yet.</p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {stats.recent.map(t => (
                <li key={t.id} className="py-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    {t.description && (
                      <div className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                        {t.description}
                      </div>
                    )}
                    <div className="text-xs text-slate-500">
                      Created {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700">
                    {t.status.replace('_', ' ')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-4">
          <h3 className="font-medium mb-2">Overview</h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            Use the TaskForm to add tasks and TaskFilter to search/filter. This panel can host charts, summaries, or tips.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  Icon,
}: {
  title: string;
  value: number | string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 shadow p-4">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}



export default Dashboard;