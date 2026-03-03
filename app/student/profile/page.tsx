
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const currentUser = JSON.parse(cookieStore.get("currentUser")?.value || "{}");

  const student = await prisma.student.findUnique({
    where: { student_id: currentUser.ref_id },
    include: { academic_year: true },
  });

  const myGroups = student
    ? await prisma.projectGroup.findMany({
        where: {
          members: { some: { student_id: student.student_id } },
        },
        select: { project_group_id: true, approval_status: true },
      })
    : [];

  const groupIds = myGroups.map(g => g.project_group_id);
  const pendingApprovals = myGroups.filter(g => g.approval_status === "PENDING").length;
  const meetingsCount = groupIds.length
    ? await prisma.projectMeeting.count({
        where: { project_group_id: { in: groupIds } },
      })
    : 0;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Student Profile</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Your details.</p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student?.student_name}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Role</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.role}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student?.email}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student?.phone || "Not Provided"}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Academic Year</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {student?.academic_year ? `${student.academic_year.year_name} (${student.academic_year.semester})` : "Not Assigned"}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Total Groups</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{myGroups.length}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Pending Approvals</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{pendingApprovals}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Meetings Scheduled</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{meetingsCount}</dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">About</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{student?.description || "No description yet."}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
