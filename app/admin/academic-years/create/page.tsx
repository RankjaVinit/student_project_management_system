"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { dummyAcademicYears } from "@/lib/dummyData";

export default function CreateAcademicYearPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    year_name: "",
    semester: "",
    is_active: "true",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const semesterOptions = [
    { value: "", label: "Select semester..." },
    { value: "1", label: "Semester 1" },
    { value: "2", label: "Semester 2" },
    { value: "3", label: "Semester 3" },
    { value: "4", label: "Semester 4" },
    { value: "5", label: "Semester 5" },
    { value: "6", label: "Semester 6" },
    { value: "7", label: "Semester 7" },
    { value: "8", label: "Semester 8" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.year_name.trim()) {
      newErrors.year_name = "Year name is required";
    }

    if (!formData.semester) {
      newErrors.semester = "Semester is required";
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
      const newAcademicYear = {
        academic_year_id: Date.now(),
        year_name: formData.year_name,
        semester: Number(formData.semester) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        is_active: formData.is_active === "true",
        created_at: new Date().toISOString(),
      };

      dummyAcademicYears.push(newAcademicYear);
      setLoading(false);
      router.push("/admin/academic-years");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Add Academic Year
          </h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Create a new academic year and semester
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Year Name"
              placeholder="e.g., 2024-25, 2025-26"
              value={formData.year_name}
              onChange={(e) =>
                setFormData({ ...formData, year_name: e.target.value })
              }
              error={errors.year_name}
              required
            />

            <Select
              label="Semester"
              options={semesterOptions}
              value={formData.semester}
              onChange={(e) =>
                setFormData({ ...formData, semester: e.target.value })
              }
              error={errors.semester}
              required
            />

            <Select
              label="Status"
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              value={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Academic Year"}
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
