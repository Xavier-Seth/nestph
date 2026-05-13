import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { LocationCollections } from "@/components/home/LocationCollections";
import { MeetOurAgents } from "@/components/home/MeetOurAgents";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedListings />
      <LocationCollections />
      <MeetOurAgents />
    </>
  );
}
