
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function FacultyDashboard() {
  const cookieStore = await cookies();
  const currentUser = JSON.parse(cookieStore.get("currentUser")?.value || "{}");

  if (!currentUser.ref_id) {
    return <div>Error: Staff ID not found for user.</div>;
  }

  const staffId = currentUser.ref_id;

  // Get data for this faculty
  const [myAssignedProjects, myProjectGroups] = await Promise.all([
    prisma.assignedProject.findMany({
      where: { staff_id: staffId },
      include: { academic_year: true },
    }),
    prisma.projectGroup.findMany({
      where: {
        assigned_project: { staff_id: staffId },
      },
      include: {
        members: true,
      },
    }),
  ]);
  const pendingApprovals = myProjectGroups.filter(g => g.approval_status === "PENDING");

  // Calculate some stats
  const totalStudents = myProjectGroups.reduce((acc, g) => acc + (g.members?.length || 0), 0);

  const stats = [
    { name: 'My Assigned Subjects', stat: myAssignedProjects.length, icon: 'Book', color: 'bg-blue-500' },
    { name: 'Total Project Groups', stat: myProjectGroups.length, icon: 'UserGroup', color: 'bg-green-500' },
    { name: 'Total Students', stat: totalStudents, icon: 'Users', color: 'bg-indigo-500' },
    { name: 'Pending Approvals', stat: pendingApprovals.length, icon: 'Clock', color: 'bg-yellow-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Faculty Dashboard</h1>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`rounded-md p-3 ${item.color}`}>
                    <span className="text-white text-lg font-bold">
                      {item.icon === 'Book' && '📚'}
                      {item.icon === 'UserGroup' && '👥'}
                      {item.icon === 'Users' && '🎓'}
                      {item.icon === 'Clock' && '⏳'}
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
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">My Assigned Subjects</h2>
        <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {myAssignedProjects.map((ap) => {
              const year = ap.academic_year;
              return (
                <li key={ap.assignment_id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">{ap.subject_name}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Max Members: {ap.max_members}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {year?.year_name} (Sem {year?.semester})
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
