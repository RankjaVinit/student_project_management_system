
"use client";

import { useEffect, useState } from "react";
import { createAssignedProject, getAcademicYears, getAssignedProjects, getStaff } from "@/app/actions/admin";

export default function AssignedProjectsPage() {
    const [assignedProjects, setAssignedProjects] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [academicYears, setAcademicYears] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        staff_id: 1,
        academic_year_id: 1,
        subject_name: "",
        max_members: 4
    });

    useEffect(() => {
        Promise.all([getAssignedProjects(), getStaff(), getAcademicYears()]).then(
            ([assignedData, staffData, yearData]) => {
                setAssignedProjects(assignedData);
                setStaff(staffData);
                setAcademicYears(yearData);
                if (staffData.length > 0) {
                    setFormData(prev => ({ ...prev, staff_id: staffData[0].staff_id }));
                }
                if (yearData.length > 0) {
                    setFormData(prev => ({ ...prev, academic_year_id: yearData[0].academic_year_id }));
                }
            }
        );
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createAssignedProject({
            staff_id: Number(formData.staff_id),
            academic_year_id: Number(formData.academic_year_id),
            subject_name: formData.subject_name,
            max_members: Number(formData.max_members),
        });
        const refreshed = await getAssignedProjects();
        setAssignedProjects(refreshed);
        setShowForm(false);
    };

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">Assigned Projects & Subjects</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of subjects assigned to faculty members for project guidance.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        {showForm ? "Cancel" : "Assign Subject"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="mt-8 bg-white shadow sm:rounded-lg p-6 max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subject Name</label>
                            <input
                                type="text"
                                required
                                value={formData.subject_name}
                                onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Faculty</label>
                            <select
                                value={formData.staff_id}
                                onChange={(e) => setFormData({ ...formData, staff_id: Number(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            >
                                {staff.map((s: any) => (
                                    <option key={s.staff_id} value={s.staff_id}>{s.staff_name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                            <select
                                value={formData.academic_year_id}
                                onChange={(e) => setFormData({ ...formData, academic_year_id: Number(e.target.value) })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            >
                                {academicYears.map((ay: any) => (
                                    <option key={ay.academic_year_id} value={ay.academic_year_id}>
                                        {ay.year_name} (Sem {ay.semester})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Max Members Per Group</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={formData.max_members}
                                onChange={(e) => setFormData({ ...formData, max_members: Number(e.target.value) })}
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


            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Subject
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Faculty
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Academic Year
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Max Members
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {assignedProjects.map((ap) => {
                                        const staffMember = ap.staff || staff.find((s: any) => s.staff_id === ap.staff_id);
                                        const academicYear = ap.academic_year || academicYears.find((ay: any) => ay.academic_year_id === ap.academic_year_id);
                                        return (
                                            <tr key={ap.assignment_id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {ap.subject_name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {staffMember?.staff_name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {academicYear?.year_name} (Sem {academicYear?.semester})
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {ap.max_members}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
