"use client";

import { useState } from "react";
import { createMeeting } from "@/app/actions/faculty";

export default function AddMeetingForm({ groupId }: { groupId: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        meeting_datetime: "",
        meeting_purpose: "",
        meeting_notes: "",
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

        if (!formData.meeting_datetime || !formData.meeting_purpose) {
            setError("Please fill in all required fields");
            setLoading(false);
            return;
        }

        try {
            const result = await createMeeting({
                project_group_id: groupId,
                meeting_datetime: formData.meeting_datetime,
                meeting_purpose: formData.meeting_purpose,
                meeting_notes: formData.meeting_notes || undefined,
            });

            if (result.success) {
                setFormData({ meeting_datetime: "", meeting_purpose: "", meeting_notes: "" });
                setIsOpen(false);
                window.location.reload();
            } else {
                setError(result.error || "Failed to create meeting");
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    + Add Meeting
                </button>
            )}

            {isOpen && (
                <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Add New Meeting</h3>
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
                            <label htmlFor="meeting_datetime" className="block text-sm font-medium text-gray-700">
                                Meeting Date & Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                id="meeting_datetime"
                                name="meeting_datetime"
                                value={formData.meeting_datetime}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="meeting_purpose" className="block text-sm font-medium text-gray-700">
                                Meeting Purpose <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="meeting_purpose"
                                name="meeting_purpose"
                                value={formData.meeting_purpose}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="e.g., Project review, progress discussion, final evaluation..."
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="meeting_notes" className="block text-sm font-medium text-gray-700">
                                Meeting Notes (Optional)
                            </label>
                            <textarea
                                id="meeting_notes"
                                name="meeting_notes"
                                value={formData.meeting_notes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Any additional notes..."
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating..." : "Create Meeting"}
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
