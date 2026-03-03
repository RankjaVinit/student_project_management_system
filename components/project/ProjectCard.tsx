import Link from "next/link";

type Project = {
  assignment_id: number;
  subject_name: string;
  max_members: number;
  project_group: {
    project_group_id?: number;
    project_group_name: string;
    project_title: string;
    project_description: string;
    approval_status: "APPROVED" | "PENDING" | "REJECTED";
    members_count: number;
  } | null;
};

function ProjectCard({ project }: { project: Project }) {
  // 🔹 CASE 1: No group yet
  if (!project.project_group) {
    return (
      <div className="min-w-[280px] rounded-lg border border-dashed bg-muted/40 p-4">
        <h3 className="text-sm text-muted-foreground">
          {project.subject_name}
        </h3>

        <h2 className="mt-2 text-base font-semibold">No project group yet</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add a project decpription.
        </p>

        <Link href="/student/projects/create">
          <button className="mt-4 w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
            Create Project Group
          </button>
        </Link>
      </div>
    );
  }

  // 🔹 CASE 2: Group exists
  const statusColor =
    project.project_group.approval_status === "APPROVED"
      ? "bg-green-100 text-green-700"
      : project.project_group.approval_status === "PENDING"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  // Only make it clickable if project group exists
  const projectGroupId = project.project_group?.project_group_id;
  
  const cardContent = (
    <div className="min-w-[280px] rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition">
      <h3 className="text-sm text-muted-foreground">{project.subject_name}</h3>

      <h2 className="mt-1 text-lg font-semibold">
        {project.project_group.project_title}
      </h2>

      <p className="text-sm text-muted-foreground">
        {project.project_group.project_group_name}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
        >
          {project.project_group.approval_status}
        </span>

        <span className="text-xs text-muted-foreground">
          {project.project_group.members_count} / {project.max_members} members
        </span>
      </div>
    </div>
  );

  // Only wrap with Link if project group exists
  if (projectGroupId) {
    return (
      <Link href={`/student/projects/${projectGroupId}`}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

export default ProjectCard;
