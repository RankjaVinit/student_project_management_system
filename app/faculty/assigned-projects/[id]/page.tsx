import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline"; 

export default async function AssignedProjectDetailPage({ params }: { params: { id: string } }) {
    // Await params for Next.js 15+ compatibility
    const { id } = await params;
    const assignmentId = Number(id);

    const assignment = await prisma.assignedProject.findUnique({
        where: { assignment_id: assignmentId },
        include: {
            academic_year: true,
            projectGroups: {
                include: {
                    members: {
                        include: { student: true },
                    },
                },
            },
        },
    });

    if (!assignment) {
        notFound();
    }

    const year = assignment.academic_year;
    const groups = assignment.projectGroups.map(group => ({
        ...group,
        members_details: group.members,
    }));

    return (
        <div className="space-y-6">
            <div>
                <Link href="/faculty/assigned-projects" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
                    &larr; Back to Subjects
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                    {assignment.subject_name}
                </h1>
                <p className="text-gray-500 mt-2">
                    {year?.year_name} (Semester {year?.semester}) &bull; Max Members: {assignment.max_members}
                </p>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Project Groups ({groups.length})
                    </h3>
                </div>
                {groups.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No groups have formed for this subject yet.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {groups.map(group => (
                            <li key={group.project_group_id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-lg font-medium text-indigo-600 truncate">
                                            {group.project_group_name}
                                        </h4>
                                        <p className="text-sm text-gray-900 font-medium mt-1">
                                            {group.project_title}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {group.project_description}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {group.members_details.map(member => (
                                                <span key={member.project_group_member_id} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.is_group_leader ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {member.student?.student_name} {member.is_group_leader && '👑'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex flex-col items-end space-y-2">
                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${group.approval_status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            group.approval_status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}
                                        >
                                            {group.approval_status}
                                        </span>
                                        <Link
                                            href={`/faculty/project-groups/${group.project_group_id}`}
                                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                        >
                                            View Details &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
