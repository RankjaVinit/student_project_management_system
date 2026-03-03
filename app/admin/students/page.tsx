
"use client";

import { useEffect, useState } from "react";
import { createStudent, getAcademicYears, getStudents } from "@/app/actions/admin";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    student_name: "",
    email: "",
    phone: "",
    academic_year_id: 1 // default
  });

  useEffect(() => {
    Promise.all([getStudents(), getAcademicYears()]).then(([studentData, yearData]) => {
      setStudents(studentData);
      setAcademicYears(yearData);
      if (yearData.length > 0) {
        setFormData(prev => ({ ...prev, academic_year_id: yearData[0].academic_year_id }));
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createStudent({
      student_name: formData.student_name,
      email: formData.email,
      phone: formData.phone,
      academic_year_id: Number(formData.academic_year_id),
    });
    const refreshed = await getStudents();
    setStudents(refreshed);

    setShowForm(false);
    setFormData({ student_name: "", email: "", phone: "", academic_year_id: 1 });
    if (result?.username) {
      alert(`Created student and user account: ${result.username} / password`);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Student Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all students.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowForm(!showForm)}
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            {showForm ? "Cancel" : "Add Student"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-8 bg-white shadow sm:rounded-lg p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                required
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
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
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Academic Year
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {students.map((student) => {
                    const academicYear = student.academic_year || academicYears.find((ay: any) => ay.academic_year_id === student.academic_year_id);
                    return (
                      <tr key={student.student_id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {student.student_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="text-gray-900">{student.email}</div>
                          <div className="text-gray-500">{student.phone}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {academicYear ? `${academicYear.year_name} (Sem ${academicYear.semester})` : '-'}
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
