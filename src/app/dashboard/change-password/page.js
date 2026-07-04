import { redirect } from "next/navigation";

export default function DashboardChangePasswordPage() {
  redirect("/dashboard/settings#account-security");
}
