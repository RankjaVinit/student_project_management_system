"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { dummyStaff } from "@/lib/dummyData";

export default function CreateStaffPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    staff_name: "",
    email: "",
    phone: "",
    description: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.staff_name.trim()) {
      newErrors.staff_name = "Staff name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
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
      const newStaff = {
        staff_id: Date.now(),
        staff_name: formData.staff_name,
        email: formData.email,
        phone: formData.phone || null,
        description: formData.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      dummyStaff.push(newStaff);
      setLoading(false);
      router.push("/admin/staff");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Add Staff
          </h1>
          <p className="text-[var(--muted-foreground)] mt-2">
            Create a new staff/faculty record
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
              label="Staff Name"
              placeholder="Enter staff name"
              value={formData.staff_name}
              onChange={(e) =>
                setFormData({ ...formData, staff_name: e.target.value })
              }
              error={errors.staff_name}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="staff@example.com"
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
          </div>

          <Textarea
            label="Description (Optional)"
            placeholder="e.g., Senior Professor, Associate Professor"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Staff"}
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
