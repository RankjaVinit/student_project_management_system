"use client";

import { useState } from "react";
import { deleteMeeting, updateMeetingStatus } from "@/app/actions/faculty";

export default function MeetingActions({ 
    meetingId, 
    groupId,
    currentStatus 
}: { 
    meetingId: number; 
    groupId: number;
    currentStatus: string;
}) {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleStatusChange = async (status: "SCHEDULED" | "COMPLETED") => {
        setLoading(true);
        try {
            const result = await updateMeetingStatus(meetingId, status, groupId);
            if (result.success) {
                window.location.reload();
            } else {
                alert(`Failed to update meeting: ${result.error}`);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this meeting?")) {
            return;
        }

        setLoading(true);
        try {
            const result = await deleteMeeting(meetingId, groupId);
            if (result.success) {
                window.location.reload();
            } else {
                alert(`Failed to delete meeting: ${result.error}`);
            }
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={loading}
            >
                ⋮
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    {currentStatus !== "COMPLETED" && (
                        <button
                            onClick={() => {
                                handleStatusChange("COMPLETED");
                                setIsOpen(false);
                            }}
                            disabled={loading}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            ✓ Mark as Completed
                        </button>
                    )}
                    {currentStatus === "COMPLETED" && (
                        <button
                            onClick={() => {
                                handleStatusChange("SCHEDULED");
                                setIsOpen(false);
                            }}
                            disabled={loading}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 border-b border-gray-200"
                        >
                            ✏ Mark as Scheduled
                        </button>
                    )}
                    <button
                        onClick={() => {
                            handleDelete();
                            setIsOpen(false);
                        }}
                        disabled={loading}
                        className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 border-t border-gray-200"
                    >
                        🗑 Delete
                    </button>
                </div>
            )}
        </div>
    );
}
