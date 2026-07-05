import HomeHero from "@/components/home/HomeHero";
import HomeWhyWoodleys from "@/components/home/HomeWhyWoodleys";
import HomeShowroomHighlights from "@/components/home/HomeShowroomHighlights";
import HomeShowroomFallback from "@/components/home/HomeShowroomFallback";
import HomeFeaturedCategories from "@/components/home/HomeFeaturedCategories";
import HomeNewReleases from "@/components/home/HomeNewReleases";
import { defaultMetadata, HOME_FEATURED_PRODUCT_HANDLES, HOME_NEW_RELEASE_HANDLES } from "@/config";
import { getFeaturedProducts, getNewReleaseProducts } from "@/lib/catalog/products";

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
      <HomeHero />
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
