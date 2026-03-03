
"use client";

import { useState } from "react";
import { updateGroupStatus } from "@/app/actions/faculty";
import { useRouter } from "next/navigation";

export default function GroupStatusActions({
    groupId,
    currentStatus
}: {
    groupId: number,
    currentStatus: "PENDING" | "APPROVED" | "REJECTED"
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (status: "APPROVED" | "REJECTED") => {
        setLoading(true);
        try {
            await updateGroupStatus(groupId, status);
            router.refresh();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status");
        } finally {
            setLoading(false);
        }
    };

    if (currentStatus !== 'PENDING') {
        return null; // Don't show actions if already decided (or maybe allow changing? userreq didn't specify, stick to simple)
        // Actually, sometimes you want to change decision. Let's allow it if strictly requested, but PENDING usually implies flow.
        // The previous list view allowed changing from PENDING.
        // Let's keep it simple: Only show if PENDING for now, or maybe small buttons if already done? 
        // The list view code: {group.approval_status === 'PENDING' && (...)}
        // So I will stick to that pattern.
    }

    return (
        <div className="flex space-x-3 mt-4">
            <button
                onClick={() => handleStatusChange('APPROVED')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
                {loading ? 'Updating...' : 'Approve Group'}
            </button>
            <button
                onClick={() => handleStatusChange('REJECTED')}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
                {loading ? 'Updating...' : 'Reject Group'}
            </button>
        </div>
    );
}
