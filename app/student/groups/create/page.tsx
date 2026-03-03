
import { cookies } from "next/headers";
import { CreateGroupClient } from "./client";
import { prisma } from "@/lib/prisma";

// Reusing the client component which handles creation/joining.
// We might need to adjust it if it redirects to the old /student/group
// But for now, let's wrap it.

export default async function CreateJoinGroupPage() {
    const cookieStore = await cookies();
    const currentUser = JSON.parse(cookieStore.get("currentUser")?.value || "{}");

    if (!currentUser.ref_id) {
        return <div>Error: Student ID not found.</div>;
    }

    const myGroups = await prisma.projectGroup.findMany({
        where: {
            members: { some: { student_id: currentUser.ref_id } },
        },
        include: {
            assigned_project: true,
        },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Find or Create a Project Group</h1>

            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900">Your Current Groups</h2>
                {myGroups.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-500">You are not part of any groups yet.</p>
                ) : (
                    <ul className="mt-4 divide-y divide-gray-200">
                        {myGroups.map(group => (
                            <li key={group.project_group_id} className="py-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{group.project_group_name}</p>
                                        <p className="text-sm text-gray-500">{group.assigned_project?.subject_name || "Subject Not Assigned"}</p>
                                    </div>
                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${group.approval_status === "APPROVED" ? "bg-green-100 text-green-800" :
                                            group.approval_status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-red-100 text-red-800"
                                        }`}>
                                        {group.approval_status}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <CreateGroupClient studentId={currentUser.ref_id} />
        </div>
    );
}
