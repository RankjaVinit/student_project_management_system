
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function FacultyAssignedProjectsPage() {
  const cookieStore = await cookies();
  const currentUser = JSON.parse(cookieStore.get("currentUser")?.value || "{}");

  if (!currentUser.ref_id) {
    return <div>Error: Staff ID not found.</div>;
  }

  const assignedProjects = await prisma.assignedProject.findMany({
    where: { staff_id: currentUser.ref_id },
    include: {
      academic_year: true,
      projectGroups: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Assigned Projects
        </h1>
        <p className="text-gray-500 mt-2">
          Subjects you are guiding this academic year. Select a subject to view its student groups.
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Academic Year
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Members
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assignedProjects.map((project) => {
              const year = project.academic_year;
              const groupsCount = project.projectGroups?.length ?? 0;

              return (
                <tr key={project.assignment_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.subject_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {year?.year_name || "Unknown"} ({year?.semester})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.max_members}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {groupsCount} Groups
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/faculty/assigned-projects/${project.assignment_id}`} className="text-indigo-600 hover:text-indigo-900">
                      View Groups
                    </Link>
                  </td>
                </tr>
              );
            })}
            {assignedProjects.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No subjects assigned.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
