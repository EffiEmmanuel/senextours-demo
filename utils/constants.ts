export const HOST_URL = process.env.NEXT_PUBLIC_APP_URL;

export const ROUTES = {
  SIGNIN: "/app/auth/signin",
  SIGNUP: "/app/auth/signup",
  FORGOT_PASSWORD: "/app/auth/forgot-password",
  DASHBOARD: "/app/dashboard",
  DASHBOARD_MANAGE_USERS: "/app/dashboard/manage-users",
};

export const QUERY_KEYS = {
  USERS: "users",
};

export const USER_ROLE = {
  ADMIN: "admin",
  STAFF: "staff",
  USER: "user",
} as const;

export const TABLES = {
  USERS: "users",
  ITINERARIES: "itineraries",
  TOURS: "tours",
};
