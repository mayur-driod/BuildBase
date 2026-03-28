import GlobeHero from "@/components/hero/GlobeHero"
import { Navbar } from "@/components/navbar/Navbar"
import { DotMatrix } from "@/components/ui/dot-matrix"

export default function Home() {
  return (
    <div className="relative">
      <DotMatrix />
      <Navbar />
      <GlobeHero />
    </div>
  );
}
