import DashboardProductForm from "@/components/dashboard/DashboardProductForm";

export default async function EditProductPage({ params }) {
  const { handle } = await params;
  return <DashboardProductForm mode="edit" handle={decodeURIComponent(handle ?? "")} />;
}
