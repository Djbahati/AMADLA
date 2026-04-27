import HeroSection from '../component/home/herosection';
import EnergyFlowSection from '../component/home/energyflowsection';
import ServicesSection from '../component/home/servicesection';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <EnergyFlowSection />
      <ServicesSection />
    </div>
  );
}

