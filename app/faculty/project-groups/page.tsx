
import { cookies } from "next/headers";
import { ProjectGroupsClient } from "./client";

export default async function ProjectGroupsPage() {
    const cookieStore = await cookies();
    const currentUser = JSON.parse(cookieStore.get("currentUser")?.value || "{}");

    if (!currentUser.ref_id) {
        return <div>Error: Staff ID not found for user.</div>;
    }

    // Fetch initial data
    const staffId = currentUser.ref_id;

    // We need to pass data that can be serialized. 
    // Store methods return objects that are fine for RSC to Client.
    // Note: Data is "fresh" on render.

    return <ProjectGroupsClient initialStaffId={staffId} />;
}
