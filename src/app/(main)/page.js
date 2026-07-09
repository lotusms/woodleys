import dynamic from "next/dynamic";
import HomeHeroPreload from "@/components/home/HomeHeroPreload";
import HomeHeroStatic from "@/components/home/HomeHeroStatic";
import HomeHeroClientGate from "@/components/home/HomeHeroClientGate";
import HomeWhyWoodleys from "@/components/home/HomeWhyWoodleys";
import HomeShowroomFallback from "@/components/home/HomeShowroomFallback";
import { defaultMetadata, HOME_FEATURED_PRODUCT_HANDLES, HOME_NEW_RELEASE_HANDLES } from "@/config";
import { getFeaturedProducts, getNewReleaseProducts } from "@/lib/catalog/products";

const HomeShowroomHighlights = dynamic(
  () => import("@/components/home/HomeShowroomHighlights"),
  { loading: () => <HomeShowroomFallback /> },
);

const HomeNewReleases = dynamic(
  () => import("@/components/home/HomeNewReleases"),
  {
    loading: () => (
      <div className="min-h-[28rem] bg-ivory py-20 sm:py-24" aria-hidden />
    ),
  },
);

const HomeFeaturedCategories = dynamic(
  () => import("@/components/home/HomeFeaturedCategories"),
);

export const revalidate = 60;

export const metadata = {
  title: defaultMetadata.title,
  description: defaultMetadata.description,
};

export default async function Home() {
  const [featuredProducts, newReleaseProducts] = await Promise.all([
    getFeaturedProducts(HOME_FEATURED_PRODUCT_HANDLES),
    getNewReleaseProducts({ handles: HOME_NEW_RELEASE_HANDLES }),
  ]);

  return (
    <>
      <HomeHeroPreload />
      <div className="home-hero-root relative">
        <HomeHeroStatic />
        <HomeHeroClientGate />
      </div>
      <HomeWhyWoodleys />
      {featuredProducts.length > 0 ? (
        <HomeShowroomHighlights products={featuredProducts} />
      ) : (
        <HomeShowroomFallback />
      )}
      <HomeNewReleases products={newReleaseProducts} />
      <HomeFeaturedCategories />
    </>
  );
}
