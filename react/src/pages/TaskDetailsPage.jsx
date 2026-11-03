import { Link, useParams } from "react-router";

import { ROUTES } from "@/constants/routes";

function TaskDetailsPage() {
  // useParams: URL-এর ":id" অংশের মান দেয়। ⚠️ সবসময় স্ট্রিং ("2", সংখ্যা 2 নয়)
  const { id } = useParams();

  return (
    <div className="space-y-4">
      <Link
        to={ROUTES.TASKS}
        className="text-sm font-medium text-brand-700 hover:underline"
      >
        ← Back to tasks
      </Link>
      <h1 className="text-2xl font-bold">Task #{id}</h1>
      <p className="text-content-muted">বিস্তারিত এখানে আসবে (M6)।</p>
    </div>
  );
}

export default TaskDetailsPage;