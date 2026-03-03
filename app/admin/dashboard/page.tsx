
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [studentsCount, staffCount, activeProjectsCount, pendingProjectsCount, recentProjects] = await Promise.all([
    prisma.student.count(),
    prisma.staff.count(),
    prisma.projectGroup.count({ where: { approval_status: "APPROVED" } }),
    prisma.projectGroup.count({ where: { approval_status: "PENDING" } }),
    prisma.projectGroup.findMany({
      orderBy: { created_at: "desc" },
      take: 5,
    }),
  ]);

  const stats = [
    { name: 'Total Students', stat: studentsCount, icon: 'Users', color: 'bg-blue-500', href: '/admin/students' },
    { name: 'Total Faculty', stat: staffCount, icon: 'UserGroup', color: 'bg-green-500', href: '/admin/staff' },
    { name: 'Active Projects', stat: activeProjectsCount, icon: 'FolderOpen', color: 'bg-indigo-500', href: '/admin/projects' },
    { name: 'Pending Approvals', stat: pendingProjectsCount, icon: 'Clock', color: 'bg-yellow-500', href: '/admin/projects' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`rounded-md p-3 ${item.color}`}>
                    {/* Icon placeholder */}
                    <span className="text-white text-lg font-bold">
                      {item.icon === 'Users' && 'Students'}
                      {item.icon === 'UserGroup' && 'Staff'}
                      {item.icon === 'FolderOpen' && 'Projects'}
                      {item.icon === 'Clock' && 'Wait'}
                    </span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{item.stat}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href={item.href} className="font-medium text-cyan-700 hover:text-cyan-900">
                  View all
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Projects</h2>
        <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentProjects.map((project) => (
              <li key={project.project_group_id}>
                <Link href={`/admin/project-groups/${project.project_group_id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{project.project_group_name}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${project.approval_status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {project.approval_status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {project.project_title}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
