import { useState } from "react";
import Dashboard from "./components/DashBoard/DashBoard";
import type { Task, Status } from "./types";

function mapStatus(s: string): Status {
  switch (s) {
    case "pending":
      return "todo";
    case "in-progress":
      return "in_progress";
    case "completed":
      return "done";
    default:
      return "todo";
  }
}

function makeSeed(): Task[] {
  const raw = [
    {
      id: "1",
      title: "Design landing page",
      description: "Create the initial wireframe and mockups for the landing page.",
      status: "pending",
      priority: "high",
      dueDate: "2025-06-20",
    },
    {
      id: "2",
      title: "Set up CI/CD pipeline",
      description: "Configure GitHub Actions for automated testing and deployment.",
      status: "pending",
      priority: "medium",
      dueDate: "2025-06-18",
    },
    {
      id: "3",
      title: "Fix login bug",
      description: "Resolve the issue where users can't log in with Google OAuth.",
      status: "in-progress",
      priority: "high",
      dueDate: "2025-06-14",
    },
    {
      id: "4",
      title: "Write unit tests",
      description: "Add coverage for the user service module.",
      status: "in-progress",
      priority: "low",
      dueDate: "2025-06-22",
    },
    {
      id: "5",
      title: "Deploy to staging",
      description: "Push the latest build to the staging environment for QA.",
      status: "completed",
      priority: "medium",
      dueDate: "2025-06-10",
    },
  ] as const;

  const now = new Date().toISOString();
  return raw.map((r, i) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    priority: r.priority as Task["priority"],
    status: mapStatus(r.status),
    dueDate: r.dueDate,        
    createdAt: now,
    updatedAt: now,
    order: i + 1,            
  }));
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => makeSeed());

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="px-6 pt-8">
        <h1 className="text-3xl sm:text-4xl font-semibold">Task Manager Dashboard</h1>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <Dashboard tasks={tasks} />
      </main>
    </div>
  );
}

export default App;







































// import { useState } from "react";
// import Dashboard from "./components/DashBoard/DashBoard";
// import type { Task } from "./types";



// function App() {

//   const [tasks, setTasks] = useState([
//   ]);

//   return (
//     <div className="flex flex-col items-center justify-center bg-zinc-900 text-white h-screen">
//       <h1 className="text-5xl pt-10">Task Manager Dashboard</h1>

//       <Dashboard tasks={tasks}/>
//     </div>
//   )
// }

// [
//     {
//       id: "1",
//       title: "Design landing page",
//       description:
//         "Create the initial wireframe and mockups for the landing page.",
//       status: "pending",
//       priority: "high",
//       dueDate: "2025-06-20",
//     },
//     {
//       id: "2",
//       title: "Set up CI/CD pipeline",
//       description:
//         "Configure GitHub Actions for automated testing and deployment.",
//       status: "pending",
//       priority: "medium",
//       dueDate: "2025-06-18",
//     },
//     {
//       id: "3",
//       title: "Fix login bug",
//       description:
//         "Resolve the issue where users can't log in with Google OAuth.",
//       status: "in-progress",
//       priority: "high",
//       dueDate: "2025-06-14",
//     },
//     {
//       id: "4",
//       title: "Write unit tests",
//       description: "Add coverage for the user service module.",
//       status: "in-progress",
//       priority: "low",
//       dueDate: "2025-06-22",
//     },
//     {
//       id: "5",
//       title: "Deploy to staging",
//       description: "Push the latest build to the staging environment for QA.",
//       status: "completed",
//       priority: "medium",
//       dueDate: "2025-06-10",
//     },
//   ]



// export default App;