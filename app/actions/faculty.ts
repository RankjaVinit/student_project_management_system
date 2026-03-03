
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFacultyProjectGroups(staffId: number) {
    return prisma.projectGroup.findMany({
        where: {
            assigned_project: {
                staff_id: staffId,
            },
        },
        include: {
            assigned_project: {
                include: { staff: true },
            },
            members: {
                include: { student: true },
            },
        },
    });
}

export async function getFacultyAssignedProjects(staffId: number) {
    return prisma.assignedProject.findMany({
        where: { staff_id: staffId },
    });
}

export async function updateGroupStatus(groupId: number, status: "APPROVED" | "REJECTED") {
    const group = await prisma.projectGroup.findUnique({
        where: { project_group_id: groupId },
        select: { project_group_id: true },
    });
    if (!group) return { success: false, error: "Group not found" };

    await prisma.projectGroup.update({
        where: { project_group_id: groupId },
        data: { approval_status: status },
    });

    revalidatePath("/faculty/project-groups");
    return { success: true };
}

export async function getFacultyMeetings(staffId: number) {
    return prisma.projectMeeting.findMany({
        where: {
            project_group: {
                assigned_project: {
                    staff_id: staffId,
                },
            },
        },
        include: {
            project_group: {
                include: {
                    assigned_project: true,
                },
            },
        },
    });
}

export async function createMeeting(data: {
    project_group_id: number;
    meeting_datetime: string;
    meeting_purpose: string;
    meeting_notes?: string;
}) {
    try {
        const group = await prisma.projectGroup.findUnique({
            where: { project_group_id: data.project_group_id },
        });
        
        if (!group) {
            return { success: false, error: "Group not found" };
        }

        const meeting = await prisma.projectMeeting.create({
            data: {
                project_group_id: data.project_group_id,
                meeting_datetime: new Date(data.meeting_datetime),
                meeting_purpose: data.meeting_purpose,
                meeting_notes: data.meeting_notes || null,
                status: "SCHEDULED",
            },
        });

        revalidatePath(`/faculty/project-groups/${data.project_group_id}`);
        return { success: true, meeting };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteMeeting(meetingId: number, groupId: number) {
    try {
        await prisma.projectMeeting.delete({
            where: { project_meeting_id: meetingId },
        });

        revalidatePath(`/faculty/project-groups/${groupId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateMeetingStatus(meetingId: number, status: "SCHEDULED" | "COMPLETED", groupId: number) {
    try {
        await prisma.projectMeeting.update({
            where: { project_meeting_id: meetingId },
            data: { status },
        });

        revalidatePath(`/faculty/project-groups/${groupId}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function publishResult(data: {
    project_group_id: number;
    marks: number;
    remarks?: string;
}) {
    try {
        const existing = await prisma.projectResult.findFirst({
            where: { project_group_id: data.project_group_id },
        });

        if (existing) {
            // Update existing result
            await prisma.projectResult.update({
                where: { result_id: existing.result_id },
                data: {
                    marks: data.marks,
                    remarks: data.remarks || null,
                },
            });
        } else {
            // Create new result
            await prisma.projectResult.create({
                data: {
                    project_group_id: data.project_group_id,
                    marks: data.marks,
                    remarks: data.remarks || null,
                },
            });
        }

        revalidatePath(`/faculty/project-groups/${data.project_group_id}`);
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
