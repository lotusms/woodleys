import HomeHero from "@/components/home/HomeHero";
import HomeWhyWoodleys from "@/components/home/HomeWhyWoodleys";
import HomeShowroomHighlights from "@/components/home/HomeShowroomHighlights";
import HomeFeaturedCategories from "@/components/home/HomeFeaturedCategories";
import { defaultMetadata, HOME_FEATURED_PRODUCT_HANDLES } from "@/config";
import { getFeaturedProducts } from "@/lib/catalog/products";

export const metadata = {
  title: defaultMetadata.title,
  description: defaultMetadata.description,
};

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(HOME_FEATURED_PRODUCT_HANDLES);

  return (
    <>
      <HomeHero />
      <HomeWhyWoodleys />
      {featuredProducts.length > 0 ? (
        <HomeShowroomHighlights products={featuredProducts} />
      ) : null}
      <HomeFeaturedCategories />
    </>
  );
}
