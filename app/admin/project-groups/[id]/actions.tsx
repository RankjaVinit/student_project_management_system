"use client";

import { useState } from "react";
import { updateGroupStatus } from "@/app/actions/faculty";

export default function AdminGroupActions({ 
    groupId, 
    currentStatus 
}: { 
    groupId: number; 
    currentStatus: string;
}) {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (status: "APPROVED" | "REJECTED") => {
        if (!confirm(`Are you sure you want to ${status === "APPROVED" ? "approve" : "reject"} this group?`)) {
            return;
        }

        setLoading(true);
        try {
            await updateGroupStatus(groupId, status);
            window.location.reload();
        } catch (error) {
            alert("Failed to update group status");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-3">
            {currentStatus !== "APPROVED" && (
                <button
                    onClick={() => handleStatusChange("APPROVED")}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Approve"}
                </button>
            )}
            {currentStatus !== "REJECTED" && (
                <button
                    onClick={() => handleStatusChange("REJECTED")}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Reject"}
                </button>
            )}
            {currentStatus === "APPROVED" && (
                <span className="text-sm text-gray-600">✓ This group has been approved</span>
            )}
            {currentStatus === "REJECTED" && (
                <span className="text-sm text-gray-600">✗ This group has been rejected</span>
            )}
        </div>
    );
}
