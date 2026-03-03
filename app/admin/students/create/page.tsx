"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { dummyStudents, dummyAcademicYears } from "@/lib/dummyData";

export default function CreateStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    student_name: "",
    email: "",
    phone: "",
    academic_year_id: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const academicYearOptions = dummyAcademicYears.map((ay) => ({
    value: ay.academic_year_id,
    label: `${ay.year_name} - Semester ${ay.semester}`,
  }));

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.student_name.trim()) {
      newErrors.student_name = "Student name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.academic_year_id) {
      newErrors.academic_year_id = "Academic year is required";
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
      const newStudent = {
        student_id: Date.now(),
        student_name: formData.student_name,
        email: formData.email,
        phone: formData.phone || null,
        academic_year_id: Number(formData.academic_year_id),
        description: formData.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      dummyStudents.push(newStudent);
      setLoading(false);
      router.push("/admin/students");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Add Student
          </h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Create a new student record
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
              label="Student Name"
              placeholder="Enter student name"
              value={formData.student_name}
              onChange={(e) =>
                setFormData({ ...formData, student_name: e.target.value })
              }
              error={errors.student_name}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              required
            />

            <Input
              label="Phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            <Select
              label="Academic Year"
              options={[
                { value: "", label: "Select academic year..." },
                ...academicYearOptions,
              ]}
              value={formData.academic_year_id}
              onChange={(e) =>
                setFormData({ ...formData, academic_year_id: e.target.value })
              }
              error={errors.academic_year_id}
              required
            />
          </div>

          <Textarea
            label="Description (Optional)"
            placeholder="Additional notes about the student..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Student"}
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
