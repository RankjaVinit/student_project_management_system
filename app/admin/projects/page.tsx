
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProjectsPage() {
  const projects = await prisma.projectGroup.findMany({
    include: {
      assigned_project: {
        include: { staff: true },
      },
      members: true,
    },
    orderBy: { project_group_id: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Projects
        </h1>
        <p className="text-gray-500 mt-2">
          View and manage all project groups
        </p>
      </div>
      <div>
        <Link href="/admin/assigned-projects" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-indigo-600 text-white hover:bg-indigo-700 h-10 py-2 px-4">
          Manage Assignments
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 text-sm font-medium text-gray-500">
                  Project Title
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">
                  Group Name
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">
                  Subject
                </th>
                <th className="text-left p-3 text-sm font-medium text-gray-500">
                  Guide
                </th>
                <th className="text-center p-3 text-sm font-medium text-gray-500">
                  Members
                </th>
                <th className="text-center p-3 text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-gray-500">
                    No project groups found
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.project_group_id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3 font-medium text-gray-900">
                      <Link 
                        href={`/admin/project-groups/${project.project_group_id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {project.project_title || "N/A"}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-700">{project.project_group_name}</td>
                    <td className="p-3 text-gray-700">
                      {project.assigned_project?.subject_name || "N/A"}
                    </td>
                    <td className="p-3 text-gray-700">
                      {project.assigned_project?.staff?.staff_name || "N/A"}
                    </td>
                    <td className="p-3 text-center text-gray-700">
                      {project.members?.length || 0}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${project.approval_status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : project.approval_status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {project.approval_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
