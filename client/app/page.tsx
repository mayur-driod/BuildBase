import GlobeHero from "@/components/hero/GlobeHero"
import { Navbar } from "@/components/navbar/Navbar"
import IntegrationsSection from "@/components/ui/integrations-component"
import { DotMatrix } from "@/components/ui/dot-matrix"

export default function Home() {
  return (
    <div className="relative">
      <DotMatrix />
      <Navbar />
      <GlobeHero />
      <IntegrationsSection />
    </div>
  );
}
