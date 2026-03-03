
import { ReportsClient } from "./client";
import { prisma } from "@/lib/prisma";

export default async function AdminReportsPage() {
  const [projects, meetings] = await Promise.all([
    prisma.projectGroup.findMany({
      include: {
        assigned_project: {
          include: { staff: true },
        },
        members: true,
      },
      orderBy: { project_group_id: "asc" },
    }),
    prisma.projectMeeting.findMany({
      orderBy: { meeting_datetime: "desc" },
    }),
  ]);

  return <ReportsClient projects={projects} meetings={meetings} />;
}
