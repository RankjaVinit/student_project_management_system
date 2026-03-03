
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStudentGroups(studentId: number) {
    return prisma.projectGroup.findMany({
        where: {
            members: {
                some: { student_id: studentId },
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

export async function createGroup(studentId: number, data: any) {
    // Check if already in a group for this assignment
    const assignmentId = data.assigned_project_id ? Number(data.assigned_project_id) : null;

    if (assignmentId) {
        const alreadyInGroupForSubject = await prisma.projectGroupMember.findFirst({
            where: {
                student_id: studentId,
                project_group: {
                    assigned_project_id: assignmentId,
                },
            },
        });
        if (alreadyInGroupForSubject) {
            return { success: false, error: "You are already in a group for this subject." };
        }
    }

    const newGroup = await prisma.projectGroup.create({
        data: {
            project_group_name: data.project_group_name,
            assigned_project_id: assignmentId,
            project_title: data.project_title,
            project_description: data.project_description,
            approval_status: "PENDING",
        },
    });

    await prisma.projectGroupMember.create({
        data: {
            project_group_id: newGroup.project_group_id,
            student_id: studentId,
            is_group_leader: true,
        },
    });

    revalidatePath("/student/group");
    revalidatePath("/student/dashboard"); // Update dashboard status
    return { success: true };
}

export async function joinGroup(studentId: number, groupId: number) {
    // Check if group exists
    const group = await prisma.projectGroup.findUnique({
        where: { project_group_id: groupId },
        select: { project_group_id: true, assigned_project_id: true },
    });
    if (!group) return { success: false, error: "Group not found" };

    // Check if student is already in a group for this assignment (or a group with same assigned_project_id)
    // Note: If the group being joined doesn't have an assignment yet (unlikely in this flow but possible), 
    // we might strictly strictly check if they are in *any* group? 
    // The user wants "many subject project", so we check if they are already in a group for THIS assignment.

    if (group.assigned_project_id) {
        const alreadyInGroupForSubject = await prisma.projectGroupMember.findFirst({
            where: {
                student_id: studentId,
                project_group: {
                    assigned_project_id: group.assigned_project_id,
                },
            },
        });
        if (alreadyInGroupForSubject) {
            return { success: false, error: "You are already in a group for this subject." };
        }
    }

    let maxMembers = 4;
    if (group.assigned_project_id) {
        const assignment = await prisma.assignedProject.findUnique({
            where: { assignment_id: group.assigned_project_id },
            select: { max_members: true },
        });
        if (assignment) maxMembers = assignment.max_members;
    }

    const currentMembers = await prisma.projectGroupMember.count({
        where: { project_group_id: groupId },
    });
    if (currentMembers >= maxMembers) {
        return { success: false, error: "Group is full" };
    }

    await prisma.projectGroupMember.create({
        data: {
            project_group_id: groupId,
            student_id: studentId,
            is_group_leader: false,
        },
    });

    revalidatePath("/student/group");
    revalidatePath("/student/dashboard");
    return { success: true };
}

export async function getAvailableAssignments(studentId?: number) {
    let assignments: Array<{ assignment_id: number; academic_year_id: number }> =
        await prisma.assignedProject.findMany({
            select: { assignment_id: true, academic_year_id: true },
        });

    // Filter by student's academic year if studentId is provided
    if (studentId) {
        const student = await prisma.student.findUnique({
            where: { student_id: studentId },
            select: { academic_year_id: true },
        });
        if (student && student.academic_year_id) {
            assignments = assignments.filter(
                (a: { academic_year_id: number }) => a.academic_year_id === student.academic_year_id
            );
        }

        const studentGroups: Array<{ project_group: { assigned_project_id: number | null } }> =
            await prisma.projectGroupMember.findMany({
            where: { student_id: studentId },
            select: { project_group: { select: { assigned_project_id: true } } },
        });
        const assignedProjectIds = new Set(
            studentGroups
                .map((g: { project_group: { assigned_project_id: number | null } }) => g.project_group.assigned_project_id)
                .filter((id: number | null): id is number => id !== null)
        );
        assignments = assignments.filter(
            (a: { assignment_id: number }) => !assignedProjectIds.has(a.assignment_id)
        );
    }

    const assignmentIds = assignments.map((a: { assignment_id: number }) => a.assignment_id);
    const enriched = await prisma.assignedProject.findMany({
        where: { assignment_id: { in: assignmentIds } },
        include: {
            staff: true,
            academic_year: true,
        },
    });

    return enriched;
}
