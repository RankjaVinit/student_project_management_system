
"use client";

import { useEffect, useState } from "react";
import { createAcademicYear, getAcademicYears } from "@/app/actions/admin";

export default function AcademicYearsPage() {
  const [years, setYears] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  // note: in a real app, use action/formData/useFormStatus
  const [formData, setFormData] = useState({
    year_name: "",
    semester: 1,
    is_active: true
  });

  useEffect(() => {
    getAcademicYears().then(setYears);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createAcademicYear({
      year_name: formData.year_name,
      semester: Number(formData.semester),
      is_active: formData.is_active,
    });
    const refreshed = await getAcademicYears();
    setYears(refreshed);
    setShowForm(false);
    setFormData({ year_name: "", semester: 1, is_active: true });
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Academic Years</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all academic years and semesters.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowForm(!showForm)}
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            {showForm ? "Cancel" : "Add Academic Year"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-8 bg-white shadow sm:rounded-lg p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Year Name</label>
              <input
                type="text"
                required
                placeholder="e.g. 2024-25"
                value={formData.year_name}
                onChange={(e) => setFormData({ ...formData, year_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label className="ml-2 block text-sm text-gray-900">Is Active</label>
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
                      Year Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Semester
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {years.map((year) => (
                    <tr key={year.academic_year_id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {year.year_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {year.semester}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${year.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {year.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
