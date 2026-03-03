
import { cookies } from "next/headers";
import { MeetingsClient } from "./client";

export default async function MeetingsPage() {
  const cookieStore = await cookies();
  const currentUser = JSON.parse(cookieStore.get("currentUser")?.value || "{}");

  if (!currentUser.ref_id) {
    return <div>Error: Staff ID not found.</div>;
  }

  return <MeetingsClient staffId={currentUser.ref_id} />;
}
