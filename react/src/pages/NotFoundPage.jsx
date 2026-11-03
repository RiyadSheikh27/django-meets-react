import { Link } from "react-router";

import { ROUTES } from "@/constants/routes";

function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="text-content-muted">
        আপনি যে পেজটি খুঁজছেন সেটি নেই বা সরে গেছে।
      </p>
      <Link
        to={ROUTES.TASKS}
        className="font-medium text-brand-700 hover:underline"
      >
        Go to tasks
      </Link>
    </main>
  );
}

export default NotFoundPage;