// Type definitions matching the database schema

export type UserRole = "STUDENT" | "FACULTY" | "ADMIN";

export interface User {
  user_id: number;
  username: string;
  password_hash: string;
  role: UserRole;
  ref_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface AcademicYear {
  academic_year_id: number;
  year_name: string;
  semester: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  is_active: boolean;
  created_at: string;
}


export interface Student {
  student_id: number;
  student_name: string;
  phone: string | null;
  email: string | null;
  academic_year_id: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  staff_id: number;
  staff_name: string;
  phone: string | null;
  email: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssignedProject {
  assignment_id: number;
  staff_id: number;
  academic_year_id: number;
  subject_name: string;
  max_members: number;
  created_at: string;
}

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ProjectGroup {
  project_group_id: number;
  project_group_name: string;

  assigned_project_id: number | null;
  project_title: string | null;
  project_description: string | null;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
}

export interface ProjectGroupMember {
  project_group_member_id: number;
  project_group_id: number;
  student_id: number;
  is_group_leader: boolean;
  created_at: string;
}

export type MeetingStatus = "SCHEDULED" | "COMPLETED";

export interface ProjectMeeting {
  project_meeting_id: number;
  project_group_id: number;
  meeting_datetime: string;
  meeting_purpose: string | null;
  meeting_notes: string | null;
  status: MeetingStatus;
  created_at: string;
}

export interface ProjectMeetingAttendance {
  attendance_id: number;
  project_meeting_id: number;
  student_id: number;
  is_present: boolean;
  remarks: string | null;
}

export interface ProjectDocument {
  document_id: number;
  project_group_id: number;
  document_name: string | null;
  file_path: string | null;
  uploaded_by: number | null;
  uploaded_at: string;
}

export interface ProjectResult {
  result_id: number;
  project_group_id: number;
  marks: number | null;
  remarks: string | null;
  created_at: string;
}

// Extended types for UI
export interface ProjectGroupWithDetails extends ProjectGroup {
  assigned_project?: AssignedProject & { staff?: Staff };
  members?: (ProjectGroupMember & { student?: Student })[];
}

export interface MeetingWithDetails extends ProjectMeeting {
  project_group?: ProjectGroup;
  attendance?: (ProjectMeetingAttendance & { student?: Student })[];
}
