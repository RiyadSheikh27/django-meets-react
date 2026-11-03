import { Navigate, Route, Routes } from "react-router";

import AuthLayout from "@/components/layout/AuthLayout";
import MainLayout from "@/components/layout/MainLayout";
import { ROUTES } from "@/constants/routes";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import TaskDetailsPage from "@/pages/TaskDetailsPage";
import TaskListPage from "@/pages/TaskListPage";

function AppRoutes() {
  return (
    <Routes>
        
       <Route
        path={ROUTES.HOME}
        element={<Navigate to={ROUTES.TASKS} replace />}
      />

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path={ROUTES.TASKS} element={<TaskListPage />} />
        <Route path={ROUTES.TASK_DETAILS} element={<TaskDetailsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
}

export default AppRoutes;