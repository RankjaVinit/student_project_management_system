
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ProjectGroupWithDetails } from "@/lib/types";
import type { AssignedProject } from "@/lib/types";
import { Select } from "@/components/ui";

// Need to define this server action file
// I will create it in the next step.

export function ProjectGroupsClient({ initialStaffId }: { initialStaffId: number }) {
    // We can't easily subscribe to store changes from client without API.
    // So we will just validly load data or rely on router.refresh().
    const [groups, setGroups] = useState<ProjectGroupWithDetails[]>([]);
    const [assignedProjects, setAssignedProjects] = useState<AssignedProject[]>([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Function to fetch groups - in real app avoid this, pass from server.
    // But for "live" updates after action, we might need it or use router.refresh()
    // Since we can't import "store" instance from server to client with same state in all setups,
    // let's rely on a server action to FETCH data too?
    // Or simpler: pass initial data, and use router.refresh() after mutations.

    // Wait, I can't pass `store` methods to client.
    // I will just fetch data via a Server Action used as a glorified API call.
    // OR just assume for this "dummy data" task that I can import store.
    // The issue: Next.js Webpack might bundle a separate instance of `store` for client bundle?
    // If so, the server's `store` changes won't be seen by client `store`.
    // CORRECT APPROACH: Use Server Actions for everything (Require/Response).

    // Implementation note: I'll create `app/actions/faculty.ts` to handle get/post.

    const [error, setError] = useState("");

    useEffect(() => {
        // We need to fetch data client-side if we want to update it without full page reload,
        // or just use router.refresh() to re-run the server component.
        // Let's use a server action to fetch.
        import("@/app/actions/faculty").then(mod => {
            Promise.all([
                mod.getFacultyProjectGroups(initialStaffId),
                mod.getFacultyAssignedProjects(initialStaffId),
            ]).then(([groupData, assignedProjectData]: any) => {
                setGroups(groupData);
                setAssignedProjects(assignedProjectData);
                setSelectedAssignmentId(prev => prev ?? assignedProjectData[0]?.assignment_id ?? null);
                setLoading(false);
            });
        });
    }, [initialStaffId]);

    const handleStatusChange = async (groupId: number, status: "APPROVED" | "REJECTED") => {
        try {
            const { updateGroupStatus } = await import("@/app/actions/faculty");
            await updateGroupStatus(groupId, status);

            // Optimistic update or refetch
            setGroups(prev => prev.map(g =>
                g.project_group_id === groupId ? { ...g, approval_status: status } : g
            ));
        } catch (e) {
            setError("Failed to update status");
        }
    };

    if (loading) return <div>Loading project groups...</div>;

    const projectOptions = assignedProjects.map(ap => ({
        value: ap.assignment_id,
        label: ap.subject_name,
    }));

    const visibleGroups = selectedAssignmentId
        ? groups.filter(g => g.assigned_project_id === selectedAssignmentId)
        : [];

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Project Groups</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage project groups assigned to you.
                    </p>
                </div>
            </div>

            <div className="mt-6 max-w-md">
                <Select
                    label="Assigned Projects"
                    options={projectOptions}
                    value={selectedAssignmentId ?? ""}
                    onChange={(event) => {
                        const nextValue = event.target.value;
                        setSelectedAssignmentId(nextValue ? Number(nextValue) : null);
                    }}
                    disabled={assignedProjects.length === 0}
                />
            </div>

            {error && <div className="text-red-500 mt-2">{error}</div>}

            {assignedProjects.length === 0 && (
                <div className="mt-6 text-sm text-gray-500">
                    No assigned projects found for this faculty.
                </div>
            )}

            {assignedProjects.length > 0 && (
                <div className="mt-8 flex flex-col">
                    {visibleGroups.length === 0 ? (
                        <div className="text-sm text-gray-500">
                            No project groups found for the selected project.
                        </div>
                    ) : (
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Group Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Project Title
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Members
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Status
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                    <span className="sr-only">Actions</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {visibleGroups.map((group) => (
                                                <tr key={group.project_group_id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                                                        <Link href={`/faculty/project-groups/${group.project_group_id}`} className="text-indigo-600 hover:text-indigo-900">
                                                            {group.project_group_name}
                                                        </Link>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <div className="text-gray-900">{group.project_title}</div>
                                                        <div className="text-xs text-gray-400">{group.project_description?.substring(0, 30)}...</div>
                                                    </td>
                                                    <td className="px-3 py-4 text-sm text-gray-500">
                                                        {group.members?.map(m => (
                                                            <div key={m.student_id}>
                                                                {m.student?.student_name} {m.is_group_leader ? '(Leader)' : ''}
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${group.approval_status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                                group.approval_status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'}`}
                                                        >
                                                            {group.approval_status}
                                                        </span>
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        {group.approval_status === 'PENDING' && (
                                                            <div className="space-x-2">
                                                                <button
                                                                    onClick={() => handleStatusChange(group.project_group_id, 'APPROVED')}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(group.project_group_id, 'REJECTED')}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
