"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { dummyAssignedProjects, dummyStaff, dummyAcademicYears } from "@/lib/dummyData";

export default function CreateAssignedProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    staff_id: "",
    academic_year_id: "",
    subject_name: "",
    max_members: "4",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const staffOptions = useMemo(
    () =>
      dummyStaff.map((s) => ({
        value: s.staff_id,
        label: s.staff_name,
      })),
    [],
  );

  const academicYearOptions = useMemo(
    () =>
      dummyAcademicYears.map((ay) => ({
        value: ay.academic_year_id,
        label: `${ay.year_name} - Semester ${ay.semester}`,
      })),
    [],
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.staff_id) {
      newErrors.staff_id = "Staff is required";
    }

    if (!formData.academic_year_id) {
      newErrors.academic_year_id = "Academic year is required";
    }

    if (!formData.subject_name.trim()) {
      newErrors.subject_name = "Subject name is required";
    }

    if (!formData.max_members || Number(formData.max_members) < 1) {
      newErrors.max_members = "Max members must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newAssignedProject = {
        assignment_id: Date.now(),
        staff_id: Number(formData.staff_id),
        academic_year_id: Number(formData.academic_year_id),
        subject_name: formData.subject_name,
        max_members: Number(formData.max_members),
        created_at: new Date().toISOString(),
      };

      dummyAssignedProjects.push(newAssignedProject);
      setLoading(false);
      router.push("/admin/projects");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Assign Project
          </h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Assign a project to a faculty member for an academic year
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Staff/Faculty"
              options={[
                { value: "", label: "Select staff..." },
                ...staffOptions,
              ]}
              value={formData.staff_id}
              onChange={(e) =>
                setFormData({ ...formData, staff_id: e.target.value })
              }
              error={errors.staff_id}
              required
            />

            <Select
              label="Academic Year"
              options={[
                { value: "", label: "Select academic year..." },
                ...academicYearOptions,
              ]}
              value={formData.academic_year_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  academic_year_id: e.target.value,
                })
              }
              error={errors.academic_year_id}
              required
            />

            <Input
              label="Subject Name"
              placeholder="e.g., Web Development, Machine Learning"
              value={formData.subject_name}
              onChange={(e) =>
                setFormData({ ...formData, subject_name: e.target.value })
              }
              error={errors.subject_name}
              required
            />

            <Input
              label="Max Members per Group"
              type="number"
              min="1"
              max="10"
              value={formData.max_members}
              onChange={(e) =>
                setFormData({ ...formData, max_members: e.target.value })
              }
              error={errors.max_members}
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Assign Project"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
