
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import GroupStatusActions from "./actions";
import AddMeetingForm from "./add-meeting-form";
import MeetingActions from "./meeting-actions";
import PublishResultForm from "./publish-result-form";

export default async function FacultyGroupDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const groupId = Number(id);

    const group = await prisma.projectGroup.findUnique({
        where: { project_group_id: groupId },
        include: {
            assigned_project: {
                include: { academic_year: true },
            },
            members: {
                include: { student: { include: { academic_year: true } } },
            },
        },
    });

    if (!group) {
        notFound();
    }

    const [meetings, documents, result] = await Promise.all([
        prisma.projectMeeting.findMany({
            where: { project_group_id: groupId },
            include: {
                attendance: {
                    include: { student: true },
                },
            },
            orderBy: { meeting_datetime: "desc" },
        }),
        prisma.projectDocument.findMany({
            where: { project_group_id: groupId },
            orderBy: { uploaded_at: "desc" },
        }),
        prisma.projectResult.findFirst({
            where: { project_group_id: groupId },
        }),
    ]);

    return (
        <div className="space-y-6">
            <div>
                {/* Back link logic: tricky because we could come from /assigned-projects/[id] OR /project-groups 
                     We can checking referer or just generic "Back". 
                     Or provide breadcrumbs. 
                     For now, Generic Back to Dashboard or clever "Back to Subject" if we know it.
                  */}
                <Link href={`/faculty/assigned-projects/${group.assigned_project_id}`} className="text-sm text-indigo-600 hover:text-indigo-900 mb-4 inline-block">
                    &larr; Back to Subject Groups
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {group.project_group_name}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            {group.project_title}
                        </p>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${group.approval_status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            group.approval_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}>
                        {group.approval_status}
                    </span>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Subject</dt>
                            <dd className="mt-1 text-sm text-gray-900">{group.assigned_project?.subject_name}</dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Academic Year</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {group.assigned_project?.academic_year?.year_name} - Semester {group.assigned_project?.academic_year?.semester}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900">{group.project_description || "No description provided"}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Members ({group.members?.length}/{group.assigned_project?.max_members})</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                                    {group.members?.map(m => (
                                        <li key={m.student_id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                                            <div className="w-0 flex-1 flex items-center">
                                                <span className="ml-2 flex-1 w-0">
                                                    <span className="font-medium">{m.student?.student_name}</span>
                                                    {m.is_group_leader && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Leader</span>}
                                                    <br />
                                                    <span className="text-xs text-gray-500">
                                                        {m.student?.email} • {m.student?.academic_year?.year_name}
                                                    </span>
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Actions</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                <GroupStatusActions groupId={group.project_group_id} currentStatus={group.approval_status} />
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Meetings ({meetings.length})</h3>
                </div>
                <div className="border-t border-gray-200">
                    {meetings.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">No meetings scheduled.</div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {meetings.map(meeting => (
                                <li key={meeting.project_meeting_id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-indigo-600 truncate">
                                                {new Date(meeting.meeting_datetime).toLocaleDateString()} at {new Date(meeting.meeting_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="ml-2 flex items-center gap-2">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                meeting.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                                                meeting.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' : 
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {meeting.status}
                                            </p>
                                            <MeetingActions meetingId={meeting.project_meeting_id} groupId={groupId} currentStatus={meeting.status} />
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm font-medium text-gray-900">
                                                Purpose: {meeting.meeting_purpose || "No purpose specified"}
                                            </p>
                                        </div>
                                    </div>
                                    {meeting.meeting_notes && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-900 font-medium">Notes:</p>
                                            <p className="text-sm text-gray-500">{meeting.meeting_notes}</p>
                                        </div>
                                    )}
                                    {meeting.attendance && meeting.attendance.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-900 font-medium">Attendance ({meeting.attendance.length}):</p>
                                            <div className="mt-1 flex flex-wrap gap-2">
                                                {meeting.attendance.map(att => (
                                                    <span key={att.student_id} className={`text-xs px-2 py-1 rounded-full ${
                                                        att.is_present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {att.student?.student_name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
                    <AddMeetingForm groupId={groupId} />
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Documents</h3>
                </div>
                <div className="border-t border-gray-200">
                    {documents.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">No documents uploaded.</div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {documents.map(doc => (
                                <li key={doc.document_id} className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {doc.document_name || "Document"}
                                            </p>
                                            {doc.file_path && (
                                                <p className="mt-1 text-xs text-gray-500 truncate">{doc.file_path}</p>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {new Date(doc.uploaded_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Result</h3>
                    <PublishResultForm groupId={groupId} existingResult={result} />
                </div>
                <div className="border-t border-gray-200">
                    {!result ? (
                        <div className="p-6 text-center text-gray-500 text-sm">Results not published yet.</div>
                    ) : (
                        <div className="px-4 py-5 sm:px-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Marks</p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">{result.marks ?? "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Published Date</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {result.created_at ? new Date(result.created_at).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>
                            {result.remarks && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Remarks</p>
                                    <p className="mt-1 text-sm text-gray-700">{result.remarks}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
