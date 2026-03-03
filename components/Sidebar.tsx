// Ensure this part is client-safe
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

interface SidebarProps {
  role: "ADMIN" | "FACULTY" | "STUDENT";
}

export function Sidebar({ role }: SidebarProps) {
  // Note: usePathname must be used in a client component.
  // If this runs on server, we can pass active path as prop, or make this a client component.
  // For simplicity, let's make the container client-side or just use simple links.
  // We'll create a ClientSidebar wrapper if needed, but for now let's assume this is imported in a client component or we make this one 'use client'.

  return <SidebarContent role={role} />;
}

function SidebarContent({ role }: SidebarProps) {
  const pathname = usePathname();

  const adminLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "Home" },
    {
      href: "/admin/academic-years",
      label: "Academic Years",
      icon: "Calendar",
    },
    { href: "/admin/staff", label: "Staff", icon: "Users" },
    { href: "/admin/students", label: "Students", icon: "UserPlus" },
    { href: "/admin/projects", label: "Projects", icon: "Folder" },
    {
      href: "/admin/assigned-projects",
      label: "Assigned Projects",
      icon: "Briefcase",
    },
    { href: "/admin/reports", label: "Reports", icon: "BarChart" },
    { href: "/admin/profile", label: "Profile", icon: "User" },
  ];

  const facultyLinks = [
    { href: "/faculty/dashboard", label: "Dashboard", icon: "Home" },
    {
      href: "/faculty/assigned-projects",
      label: "Assigned Projects",
      icon: "Briefcase",
    },
    { href: "/faculty/project-groups", label: "Project Groups", icon: "Users" },
    { href: "/faculty/meetings", label: "Meetings", icon: "Clock" },
    { href: "/faculty/profile", label: "Profile", icon: "User" },
  ];

  const studentLinks = [
    { href: "/student/dashboard", label: "Dashboard", icon: "Home" },
    { href: "/student/groups/create", label: "Create/Join Group", icon: "Users" },
    { href: "/student/profile", label: "Profile", icon: "User" },
  ];

  let links: { href: string; label: string; icon: string }[] = [];
  if (role === "ADMIN") links = adminLinks;
  else if (role === "FACULTY") links = facultyLinks;
  else if (role === "STUDENT") links = studentLinks;

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 space-x-2">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ProjectMgr
              </span>
            </div>
            <nav className="mt-8 flex-1 px-2 bg-white space-y-1">
              {links.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={clsx(
                      isActive
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150",
                    )}
                  >
                    {/* Simple Icon Placeholder - Replace with Lucide or Heroicons if available */}
                    <span
                      className={clsx(
                        isActive
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 shrink-0 h-6 w-6 text-center",
                      )}
                    >
                      {/* We'll use simple text chars as icons to avoid massive efficient dependencies till asked */}
                      {item.icon === "Home" && "🏠"}
                      {item.icon === "Calendar" && "📅"}
                      {item.icon === "Users" && "👥"}
                      {item.icon === "UserPlus" && "👤"}
                      {item.icon === "Briefcase" && "💼"}
                      {item.icon === "Folder" && "📁"}
                      {item.icon === "Clock" && "⏰"}
                      {item.icon === "FileText" && "📄"}
                      {item.icon === "BarChart" && "📊"}
                      {item.icon === "User" && "🧑"}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="shrink-0 flex border-t border-gray-200 p-4">
            <div className="shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="inline-block h-9 w-9 rounded-full bg-gray-300 items-center justify-center text-gray-500">
                  {role[0]}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {role} User
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    View Profile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
