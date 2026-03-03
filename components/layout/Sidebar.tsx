"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserRole } from "@/lib/types";
import { logout } from "@/lib/auth";

interface SidebarItem {
  label: string;
  href: string;
  icon?: string;
}

interface SidebarProps {
  role: UserRole;
}

const studentMenuItems: SidebarItem[] = [
  { label: "Dashboard", href: "/student/dashboard" },
  { label: "Create/Join Group", href: "/student/groups/create" },
  { label: "Profile", href: "/student/profile" },
];

const facultyMenuItems: SidebarItem[] = [
  { label: "Dashboard", href: "/faculty/dashboard" },
  { label: "Project Groups", href: "/faculty/project-groups" },
  { label: "Meetings", href: "/faculty/meetings" },
  { label: "Assigned Projects", href: "/faculty/assigned-projects" },
  { label: "Profile", href: "/faculty/profile" },
];

const adminMenuItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "Academic Years", href: "/admin/academic-years" },
  { label: "Assigned Projects", href: "/admin/assigned-projects" },
  { label: "Students", href: "/admin/students" },
  { label: "Staff", href: "/admin/staff" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Reports", href: "/admin/reports" },
  { label: "Profile", href: "/admin/profile" },
];

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems =
    role === "STUDENT"
      ? studentMenuItems
      : role === "FACULTY"
      ? facultyMenuItems
      : adminMenuItems;

  return (
    <div className="w-64 bg-[var(--sidebar-bg)] text-[var(--sidebar-foreground)] min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">SPMS</h2>
        <p className="text-sm text-[var(--secondary-light)]">
          Student Project Management
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-[var(--sidebar-active)] text-white"
                    : "hover:bg-[var(--sidebar-hover)] text-[var(--sidebar-foreground)]"
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-[var(--sidebar-hover)]">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-[var(--sidebar-hover)] transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
