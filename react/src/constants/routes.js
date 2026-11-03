export const ROUTES = Object.freeze({
  HOME: "/",
  LOGIN: "/login",
  TASKS: "/tasks",
  TASK_DETAILS: "/tasks/:id",
});

export const getTaskDetailsPath = (id) => `/tasks/${id}`;