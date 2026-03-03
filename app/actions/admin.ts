"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAcademicYears() {
  return prisma.academicYear.findMany({
    orderBy: [{ year_name: "desc" }, { semester: "asc" }],
  });
}

export async function createAcademicYear(data: {
  year_name: string;
  semester: number;
  is_active: boolean;
}) {
  await prisma.academicYear.create({
    data: {
      year_name: data.year_name,
      semester: data.semester,
      is_active: data.is_active,
    },
  });
  revalidatePath("/admin/academic-years");
  return { success: true };
}

export async function getStudents() {
  return prisma.student.findMany({
    include: { academic_year: true },
    orderBy: { student_id: "asc" },
  });
}

export async function createStudent(data: {
  student_name: string;
  email: string;
  phone?: string | null;
  academic_year_id: number;
}) {
  const student = await prisma.student.create({
    data: {
      student_name: data.student_name,
      email: data.email,
      phone: data.phone || null,
      academic_year_id: data.academic_year_id,
    },
  });

  const username = data.student_name.split(" ")[0].toLowerCase() + student.student_id;
  await prisma.user.create({
    data: {
      username,
      password_hash: "password",
      role: "STUDENT",
      ref_id: student.student_id,
    },
  });

  revalidatePath("/admin/students");
  return { success: true, username };
}

export async function getStaff() {
  return prisma.staff.findMany({
    orderBy: { staff_id: "asc" },
  });
}

export async function createStaff(data: {
  staff_name: string;
  email: string;
  phone?: string | null;
  description?: string | null;
}) {
  const staff = await prisma.staff.create({
    data: {
      staff_name: data.staff_name,
      email: data.email,
      phone: data.phone || null,
      description: data.description || null,
    },
  });

  const username = data.staff_name.split(" ")[0].toLowerCase() + staff.staff_id;
  await prisma.user.create({
    data: {
      username,
      password_hash: "password",
      role: "FACULTY",
      ref_id: staff.staff_id,
    },
  });

  revalidatePath("/admin/staff");
  return { success: true, username };
}

export async function getAssignedProjects() {
  return prisma.assignedProject.findMany({
    include: {
      staff: true,
      academic_year: true,
    },
    orderBy: { assignment_id: "asc" },
  });
}

export async function createAssignedProject(data: {
  staff_id: number;
  academic_year_id: number;
  subject_name: string;
  max_members: number;
}) {
  await prisma.assignedProject.create({
    data: {
      staff_id: data.staff_id,
      academic_year_id: data.academic_year_id,
      subject_name: data.subject_name,
      max_members: data.max_members,
    },
  });

  revalidatePath("/admin/assigned-projects");
  return { success: true };
}
