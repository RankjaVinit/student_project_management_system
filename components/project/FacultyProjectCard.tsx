type AcademicYear = {
  academic_year_id: number;
  year_name: string;
  semester: number;
  is_active: boolean;
};

type FacultyProject = {
  assignment_id: number;
  staff_id: number;
  subject_name: string;
  max_members: number;
  total_groups: number;
  remaining_students: number;
  academic_year: AcademicYear;
};

function FacultyProjectCard({ project }: { project: FacultyProject }) {
  const hasGroups = project.total_groups > 0;

  return (
    <div className="min-w-[300px] rounded-lg border border-[var(--border)] bg-card p-4 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{project.subject_name}</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            {project.academic_year.year_name} · Semester{" "}
            {project.academic_year.semester}
          </p>
        </div>
      </div>

      {/* Meta + Actions */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--muted-foreground)]">
          Max {project.max_members} members / group
        </span>

        {/* {hasGroups ? (
          <button
            className="rounded-md border px-3 py-1 text-sm hover:bg-[var(--background)]"
            onClick={() => console.log("View groups", project.assignment_id)}
          >
            View Groups
          </button>
        ) : (
          <button
            className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:opacity-90"
            onClick={() => console.log("Create group", project.assignment_id)}
          >
            Create Group
          </button>
        )} */}
      </div>

      <div className="mt-4 flex items-center justify-between">
        {/* Group Count */}
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            hasGroups
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {project.total_groups} Groups
        </span>
        {/* Remaining Students */}
        <span className="text-sm text-[var(--muted-foreground)]">
          {project.remaining_students} Students Remaining
        </span>
      </div>
    </div>
  );
}

export default FacultyProjectCard;
