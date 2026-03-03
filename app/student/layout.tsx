
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get("currentUser")?.value;

  if (!currentUser) {
    redirect("/login");
  }

  const user = JSON.parse(currentUser);

  if (user.role !== "STUDENT") {
    redirect("/login");
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <Sidebar role="STUDENT" />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <Header user={user} />
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
