
"use client";

import { useState, useEffect } from "react";
import { getFacultyMeetings, createMeeting, getFacultyProjectGroups, getFacultyAssignedProjects } from "@/app/actions/faculty";
import { Select } from "@/components/ui";
import type { AssignedProject } from "@/lib/types";

export function MeetingsClient({ staffId }: { staffId: number }) {
    const [meetings, setMeetings] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]); // For dropdown
    const [assignedProjects, setAssignedProjects] = useState<AssignedProject[]>([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        project_group_id: "",
        meeting_datetime: "",
        meeting_purpose: ""
    });

    useEffect(() => {
        // Fetch meetings
        Promise.all([
            getFacultyMeetings(staffId),
            getFacultyProjectGroups(staffId),
            getFacultyAssignedProjects(staffId),
        ]).then(([meetingData, groupData, assignedProjectData]) => {
            setMeetings(meetingData);
            setGroups(groupData);
            setAssignedProjects(assignedProjectData);
            setSelectedAssignmentId(prev => prev ?? assignedProjectData[0]?.assignment_id ?? null);
        });
    }, [staffId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createMeeting(formData);
        // Refresh
        getFacultyMeetings(staffId).then(setMeetings);
        setShowForm(false);
        setFormData({ project_group_id: "", meeting_datetime: "", meeting_purpose: "" });
    };

    const projectOptions = assignedProjects.map(ap => ({
        value: ap.assignment_id,
        label: ap.subject_name,
    }));

    const visibleGroups = selectedAssignmentId
        ? groups.filter((g) => g.assigned_project_id === selectedAssignmentId)
        : [];

    const visibleMeetings = selectedAssignmentId
        ? meetings.filter((meeting) => meeting.project_group?.assigned_project_id === selectedAssignmentId)
        : [];

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Meetings</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Schedule and manage meetings with your project groups.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        {showForm ? "Cancel" : "Schedule Meeting"}
                    </button>
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
                        setFormData({ ...formData, project_group_id: "" });
                    }}
                    disabled={assignedProjects.length === 0}
                />
            </div>

            {assignedProjects.length === 0 && (
                <div className="mt-6 text-sm text-gray-500">
                    No assigned projects found for this faculty.
                </div>
            )}

            {showForm && (
                <div className="mt-8 bg-white shadow sm:rounded-lg p-6 max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Project Group</label>
                            <select
                                required
                                value={formData.project_group_id}
                                onChange={(e) => setFormData({ ...formData, project_group_id: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                disabled={visibleGroups.length === 0}
                            >
                                <option value="">Select a group</option>
                                {visibleGroups.map(g => (
                                    <option key={g.project_group_id} value={g.project_group_id}>
                                        {g.project_group_name}
                                    </option>
                                ))}
                            </select>
                            {selectedAssignmentId && visibleGroups.length === 0 && (
                                <p className="mt-2 text-sm text-gray-500">
                                    No project groups available for the selected project.
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.meeting_datetime}
                                onChange={(e) => setFormData({ ...formData, meeting_datetime: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Purpose</label>
                            <input
                                type="text"
                                required
                                value={formData.meeting_purpose}
                                onChange={(e) => setFormData({ ...formData, meeting_purpose: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>

                        <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Save
                        </button>
                    </form>
                </div>
            )}

            {assignedProjects.length > 0 && (
                <div className="mt-8 flex flex-col">
                    {visibleMeetings.length === 0 ? (
                        <div className="text-sm text-gray-500">
                            No meetings found for the selected project.
                        </div>
                    ) : (
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                    Group
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Purpose
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {visibleMeetings.map((meeting) => (
                                                <tr key={meeting.project_meeting_id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {meeting.project_group?.project_group_name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {new Date(meeting.meeting_datetime).toLocaleString()}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {meeting.meeting_purpose}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${meeting.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                            {meeting.status}
                                                        </span>
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
