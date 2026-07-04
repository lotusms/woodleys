import { notFound } from "next/navigation";
import OrderDetailPage from "@/components/orders/OrderDetailPage";
import { DEMO_PROFILE_ID, getSampleOrderById } from "@/lib/orders-sample-data";
import { getSampleProfileById } from "@/lib/profile-sample-data";
import { sitePageTitle } from "@/config";

export async function generateMetadata({ params }) {
  const { orderId } = await params;
  const order = getSampleOrderById(decodeURIComponent(String(orderId || "")));
  if (!order) return {};
  return {
    title: sitePageTitle(`Order ${order.id}`),
    robots: { index: false, follow: false },
  };
}

export default async function DemoProfileOrderDetailPage({ params }) {
  const { id, orderId } = await params;
  const profile = getSampleProfileById(id);
  if (!profile || id !== DEMO_PROFILE_ID) notFound();

  const order = getSampleOrderById(decodeURIComponent(String(orderId || "")));
  if (!order || order.demoProfileId !== id) notFound();

  return <OrderDetailPage ordersBasePath={`/profile/${id}/orders`} />;
}
