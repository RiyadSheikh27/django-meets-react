import { Outlet } from "react-router";

function AuthLayout() {
  return (
    // items-center + justify-center: দুই দিকেই মাঝখানে (flex-এর কেন্দ্রীকরণ কৌশল)
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <p className="text-center text-2xl font-bold text-brand-700">
          Todo App
        </p>
        <main className="rounded-xl border border-line bg-surface p-6 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AuthLayout;