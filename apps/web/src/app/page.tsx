import LandingFeatures from "@/components/pages/landing/features";
import Hero from "@/components/pages/landing/hero";
import { MarqueeComponent } from "@/components/pages/landing/marquee";

export default function Home() {
  return (<>
      <Hero/>
      <LandingFeatures />
      <MarqueeComponent />
  </>
  );
}
