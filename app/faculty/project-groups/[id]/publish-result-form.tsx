"use client";

import { useState } from "react";
import { publishResult } from "@/app/actions/faculty";

export default function PublishResultForm({ 
    groupId,
    existingResult 
}: { 
    groupId: number;
    existingResult?: { marks: number | null; remarks: string | null } | null;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        marks: existingResult?.marks?.toString() || "",
        remarks: existingResult?.remarks || "",
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!formData.marks) {
            setError("Please enter marks");
            setLoading(false);
            return;
        }

        const marksNum = parseFloat(formData.marks);
        if (isNaN(marksNum) || marksNum < 0) {
            setError("Marks must be a valid positive number");
            setLoading(false);
            return;
        }

        try {
            const result = await publishResult({
                project_group_id: groupId,
                marks: marksNum,
                remarks: formData.remarks || undefined,
            });

            if (result.success) {
                setIsOpen(false);
                window.location.reload();
            } else {
                setError(result.error || "Failed to publish result");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                        existingResult 
                            ? 'bg-blue-600 hover:bg-blue-700' 
                            : 'bg-green-600 hover:bg-green-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        existingResult ? 'focus:ring-blue-500' : 'focus:ring-green-500'
                    }`}
                >
                    {existingResult ? "✎ Edit Result" : "+ Publish Result"}
                </button>
            )}

            {isOpen && (
                <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            {existingResult ? "Edit Result" : "Publish Project Result"}
                        </h3>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setError("");
                            }}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            ✕
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="marks" className="block text-sm font-medium text-gray-700">
                                Marks <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="marks"
                                name="marks"
                                value={formData.marks}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="e.g., 85, 90.5"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">Enter the marks obtained by the group</p>
                        </div>

                        <div>
                            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                                Remarks (Optional)
                            </label>
                            <textarea
                                id="remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Add any feedback or remarks about the project..."
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Publishing..." : "Publish Result"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    setError("");
                                }}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
