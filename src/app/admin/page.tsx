import { redirect } from "next/navigation";

export default async function AdminPage() {
  // Redirect to dashboard as the main admin page
  return redirect("/admin/dashboard");
}
