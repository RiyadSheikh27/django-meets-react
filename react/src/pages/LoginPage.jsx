import { Link } from "react-router";

import { ROUTES } from "@/constants/routes";

function LoginPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Login</h1>
      <p className="text-sm text-content-muted">ফর্ম এখানে আসবে (M2)।</p>
      {/* সাময়িক: নেভিগেশন পরীক্ষার জন্য */}
      <Link
        to={ROUTES.TASKS}
        className="text-sm font-medium text-brand-700 hover:underline"
      >
        Tasks পেজে যান
      </Link>
    </div>
  );
}

export default LoginPage;