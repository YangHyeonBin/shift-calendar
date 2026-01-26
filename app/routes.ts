import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("auth/callback", "routes/auth.callbac.tsx"),
] satisfies RouteConfig;
