
"use client";

import { ProjectGroupWithDetails } from "@/lib/types";

interface ReportsClientProps {
    projects: ProjectGroupWithDetails[];
    meetings: any[];
}

export function ReportsClient({ projects, meetings }: Omit<ReportsClientProps, 'results'>) {
    const handleExportExcel = () => {
        alert("Exporting to Excel... (Demo mode)");
    };

    const handleExportPDF = () => {
        alert("Exporting to PDF... (Demo mode)");
    };

    const scheduledMeetings = meetings.filter(m => m.status === 'SCHEDULED').length;
    const completedMeetings = meetings.filter(m => m.status === 'COMPLETED').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Generate reports and view analytics
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExportExcel} className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md">
                        Export Excel
                    </button>
                    <button onClick={handleExportPDF} className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md">
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Project List</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50">
                                <th className="text-left p-3 text-sm font-medium text-gray-500">Project Title</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-500">Group Name</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-500">Subject</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-500">Guide</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-500">Members</th>
                                <th className="text-left p-3 text-sm font-medium text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.project_group_id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3 font-medium text-gray-900">{project.project_title || "N/A"}</td>
                                    <td className="p-3 text-gray-700">{project.project_group_name}</td>
                                    <td className="p-3 text-gray-700">{project.assigned_project?.subject_name || "N/A"}</td>
                                    <td className="p-3 text-gray-700">{project.assigned_project?.staff?.staff_name || "N/A"}</td>
                                    <td className="p-3 text-gray-700">{project.members?.length || 0}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${project.approval_status === "APPROVED" ? "bg-green-100 text-green-800" :
                                            project.approval_status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                                                "bg-red-100 text-red-800"
                                            }`}>
                                            {project.approval_status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="text-sm font-medium text-gray-500">Total Meetings</h4>
                    <p className="text-3xl font-bold mt-2 text-gray-900">{meetings.length}</p>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="text-sm font-medium text-gray-500">Scheduled</h4>
                    <p className="text-3xl font-bold mt-2 text-blue-600">{scheduledMeetings}</p>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h4 className="text-sm font-medium text-gray-500">Completed</h4>
                    <p className="text-3xl font-bold mt-2 text-green-600">{completedMeetings}</p>
                </div>
            </div>
        </div>
    );
}
