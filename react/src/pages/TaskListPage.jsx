import { Link } from "react-router";

import { getTaskDetailsPath } from "@/constants/routes";

// সাময়িক নকল ডেটা: M4-তে API থেকে আসবে (আকৃতি API-র list response-এর মতোই)
const SAMPLE_TASKS = [
  { id: 1, title: "Buy groceries" },
  { id: 2, title: "Finish React lesson 1" },
  { id: 3, title: "Pay electricity bill" },
];

function TaskListPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Tasks</h1>

      {/* overflow-hidden: ভেতরের hover-রং যেন গোল কোণের বাইরে না বেরোয় */}
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
        {SAMPLE_TASKS.map((task) => (
          <li key={task.id}>
            {/* block: পুরো সারিটাই ক্লিকযোগ্য, বড় ট্যাপ-জায়গা */}
            <Link
              to={getTaskDetailsPath(task.id)}
              className="block px-4 py-3 transition-colors hover:bg-surface-muted focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
            >
              {task.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskListPage;