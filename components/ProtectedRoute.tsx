"use client";

import { ROUTES, USER_ROLE } from "@/utils/constants";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (typeof window === "undefined" || status === "loading") return;

    if (!session || !session) {
      router.push(ROUTES.SIGNIN);
      return;
    }

    // Limit access for users without admin role.
    if (
      session.user.role !== USER_ROLE.ADMIN &&
      [ROUTES.DASHBOARD_MANAGE_USERS].indexOf(pathname) === -1
    ) {
      router.push(ROUTES.DASHBOARD);
      return;
    }
  }, [status, router, session, pathname]);

  if (!session || !session.user) return null;
  return children;
};
