"use client";

import { IconBus, IconLogout, IconUsers } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ROUTES, USER_ROLE } from "@/utils/constants";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

export function NavMain() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="flex flex-col gap-3">
          <SidebarMenuItem
            className={cn(
              "cursor-pointer rounded-md p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              {
                "bg-black text-white": pathname === ROUTES.DASHBOARD,
              }
            )}
          >
            <SidebarMenuButton
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className="cursor-pointer"
              tooltip="Tours and tasks"
            >
              <IconBus />
              <span>Tours and tasks</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {session.data?.user.role === USER_ROLE.ADMIN && (
            <SidebarMenuItem
              onClick={() => router.push(ROUTES.DASHBOARD_MANAGE_USERS)}
              className={cn(
                "cursor-pointer rounded-md p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                {
                  "bg-black text-white":
                    pathname === ROUTES.DASHBOARD_MANAGE_USERS,
                }
              )}
            >
              <SidebarMenuButton
                className="cursor-pointer"
                tooltip="Manage Users"
              >
                <IconUsers />
                <span>Manage Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem
            className={
              "cursor-pointer rounded-md p-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }
          >
            <SidebarMenuButton
              onClick={() => signOut()}
              className="cursor-pointer"
              tooltip="Log out"
            >
              <IconLogout />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
