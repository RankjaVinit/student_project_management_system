
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function StudentDashboard() {
  const cookieStore = await cookies();
  const currentUser = JSON.parse(cookieStore.get("currentUser")?.value || "{}");

  if (!currentUser.ref_id) {
    return <div>Error: Student ID not found.</div>;
  }

  const studentId = currentUser.ref_id;

  const student = await prisma.student.findUnique({
    where: { student_id: studentId },
    select: { academic_year_id: true },
  });

  const myGroups = await prisma.projectGroup.findMany({
    where: {
      members: { some: { student_id: studentId } },
    },
    include: {
      assigned_project: {
        include: { staff: true },
      },
      members: {
        include: { student: true },
      },
    },
  });

  const remainingAssignments = await prisma.assignedProject.findMany({
    where: {
      academic_year_id: student?.academic_year_id || undefined,
      projectGroups: { none: { members: { some: { student_id: studentId } } } },
    },
    include: {
      staff: true,
      academic_year: true,
    },
  });

  const groupIds = myGroups.map(g => g.project_group_id);
  const allMeetings = groupIds.length
    ? await prisma.projectMeeting.findMany({
        where: { project_group_id: { in: groupIds } },
      })
    : [];

  const nextMeeting = allMeetings
    .filter(m => m.status === "SCHEDULED" && new Date(m.meeting_datetime) > new Date())
    .sort((a, b) => new Date(a.meeting_datetime).getTime() - new Date(b.meeting_datetime).getTime())[0];


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Student Dashboard</h1>
        <Link href="/student/groups/create" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium">
          + Join/Create New Group
        </Link>
      </div>

      {/* Quick Stats / Status */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{myGroups.length}</dd>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Next Meeting</dt>
          <dd className="mt-1 text-lg font-semibold text-gray-900">
            {nextMeeting
              ? new Date(nextMeeting.meeting_datetime).toLocaleDateString() + " " + new Date(nextMeeting.meeting_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : "No upcoming meetings"}
          </dd>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Pending Approvals</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">
            {myGroups.filter(g => g.approval_status === 'PENDING').length}
          </dd>
        </div>
      </div>

      {/* Projects List */}
      <h2 className="text-lg font-medium text-gray-900 mt-8">My Projects</h2>
      {myGroups.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          You are not part of any project groups yet.
          <div className="mt-4">
            <Link href="/student/groups/create" className="text-indigo-600 hover:text-indigo-900 font-medium">
              Find a project to join &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myGroups.map(group => (
            <Link key={group.project_group_id} href={`/student/groups/${group.project_group_id}`} className="block group">
              <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 hover:border-indigo-500 transition-colors h-full flex flex-col">
                <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 truncate w-2/3">
                    {group.project_group_name}
                  </h3>
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${group.approval_status === "APPROVED" ? "bg-green-100 text-green-800" :
                    group.approval_status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                    {group.approval_status}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 mb-1">
                      {group.assigned_project?.subject_name || "Subject Not Assigned"}
                    </p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {group.project_title}
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-gray-400">
                    {group.members?.length} Members &bull; Guide: {group.assigned_project?.staff?.staff_name || "N/A"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Remaining Assigned Projects */}
      <h2 className="text-lg font-medium text-gray-900 mt-8">Remaining Assigned Projects</h2>
      {remainingAssignments.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          All assigned projects already have groups.
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {remainingAssignments.map(assignment => (
            <div key={assignment.assignment_id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {assignment.subject_name}
                </div>
                <div className="text-sm text-gray-500">
                  Guide: {assignment.staff?.staff_name || "N/A"} &bull; Max members: {assignment.max_members}
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2 sm:mt-0">
                Academic Year: {assignment.academic_year ? `${assignment.academic_year.year_name} (Sem ${assignment.academic_year.semester})` : assignment.academic_year_id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
