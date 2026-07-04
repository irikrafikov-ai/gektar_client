import { useState } from 'react';
import { Header } from '../sections/Header';
import { Hero } from '../sections/Hero';
import { Stats } from '../sections/Stats';
import { Calculator } from '../sections/Calculator';
import { VillageProgress } from '../sections/VillageProgress';
import { IncomeCalculator } from '../sections/IncomeCalculator';
import { Visualizer } from '../sections/Visualizer';
import { Lots } from '../sections/Lots';
import { Experts } from '../sections/Experts';
import { Guarantees } from '../sections/Guarantees';
import { AreaComparison } from '../sections/AreaComparison';
import { BuildingRules } from '../sections/BuildingRules';
import { HouseProjects } from '../sections/HouseProjects';
import { HowToBuy } from '../sections/HowToBuy';
import { Reviews } from '../sections/Reviews';
import { WhyUs } from '../sections/WhyUs';
import { FAQ } from '../sections/FAQ';
import { MapSection } from '../sections/MapSection';
import { Footer } from '../sections/Footer';
import { ContactModal } from '../components/ui-custom/ContactModal';
import { Toaster } from '@/components/ui/sonner';

export function HomePage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header onContactClick={() => setIsContactOpen(true)} />
      <main className="relative">
        <Hero onContactClick={() => setIsContactOpen(true)} />
        <div className="relative z-20">
          <Stats />
        </div>
        <VillageProgress />
        <IncomeCalculator />
        <Visualizer />
        <Lots />
        <Calculator />
        <Experts onContactClick={() => setIsContactOpen(true)} />
        <Guarantees />
        <AreaComparison />
        <BuildingRules />
        <HouseProjects onContactClick={() => setIsContactOpen(true)} />
        <HowToBuy />
        <Reviews />
        <WhyUs />
        <FAQ />
        <MapSection />
      </main>
      <Footer onContactClick={() => setIsContactOpen(true)} />
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Toaster />
    </div>
  );
}
