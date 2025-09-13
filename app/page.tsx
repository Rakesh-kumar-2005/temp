import { Button } from "@/components/ui/button";
import Hero from "./_components/Hero";
import { PopularCityList } from "./_components/PopularCityList";
import InteractiveMap from "./_components/InteractiveMap";

export default function Home() {
  return (
    <div className="scale-90">
      <Hero />
      <PopularCityList />
      <InteractiveMap />
    </div>
  );
}
