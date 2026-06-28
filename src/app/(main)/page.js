import HomeHero from "@/components/home/HomeHero";
import HomeHeritage from "@/components/home/HomeHeritage";
import HomeFeaturedCategories from "@/components/home/HomeFeaturedCategories";
import HomeCta from "@/components/home/HomeCta";
import { defaultMetadata } from "@/config";

export const metadata = {
  title: defaultMetadata.title,
  description: defaultMetadata.description,
};

export default function Home() {
  return (
    <main>
      <HomeHero />
      <HomeHeritage />
      <HomeFeaturedCategories />
      <HomeCta />
    </main>
  );
}
