
"use client";

import { useState, useEffect } from "react";
import { createGroup, getAvailableAssignments } from "@/app/actions/student";
import { useRouter } from "next/navigation";
import { AssignedProject, Staff } from "@/lib/types"; // Import types if available or defined

type AssignedProjectWithStaff = AssignedProject & { staff?: Staff };

export function CreateGroupClient({ studentId }: { studentId: number }) {
    const router = useRouter();
    const [assignments, setAssignments] = useState<AssignedProjectWithStaff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        project_group_name: "",
        project_title: "",
        project_description: "",
        assigned_project_id: ""
    });

    useEffect(() => {
        // Fetch assignments available for this student (filtered by their year)
        // The backend `getAvailableAssignments` doesn't currently filter out *already taken* subjects 
        // (unless I update it to do so, but client side check or action failure is fine for now).
        // Actually, let's just fetch them.
        getAvailableAssignments(studentId).then(data => {
            setAssignments(data);
            setLoading(false);
        });
    }, [studentId]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const result = await createGroup(studentId, formData);

        if (result.success) {
            router.push("/student/dashboard");
        } else {
            setError(result.error || "Failed to create group");
        }
    };

    if (loading) return <div>Loading available subjects...</div>;

    return (
        <div className="bg-white shadow sm:rounded-lg max-w-2xl mx-auto p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Project Group</h2>

            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleCreate} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Select Subject/Guide</label>
                    <select
                        required
                        value={formData.assigned_project_id}
                        onChange={e => setFormData({ ...formData, assigned_project_id: e.target.value })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                    >
                        <option value="">Select a subject...</option>
                        {assignments.map(a => (
                            <option key={a.assignment_id} value={a.assignment_id}>
                                {a.subject_name} - {a.staff?.staff_name} (Max: {a.max_members})
                            </option>
                        ))}
                    </select>
                    <p className="mt-2 text-sm text-gray-500">
                        Only subjects assigned to your academic year are shown.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Group Name</label>
                    <input
                        type="text"
                        required
                        value={formData.project_group_name}
                        onChange={e => setFormData({ ...formData, project_group_name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g. The Innovators"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Project Title</label>
                    <input
                        type="text"
                        required
                        value={formData.project_title}
                        onChange={e => setFormData({ ...formData, project_title: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        required
                        rows={3}
                        value={formData.project_description}
                        onChange={e => setFormData({ ...formData, project_description: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Create Group
                    </button>
                </div>
            </form>
        </div>
    );
}
