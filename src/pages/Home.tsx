import React from 'react';
import { ParticleBackground } from '../components/ParticleBackground';
import { Hero } from '../components/Hero';
import { Info } from '../components/Info';
import { Categories } from '../components/Categories';
import { Ranking } from '../components/Ranking';
import { Location } from '../components/Location';
import { Footer } from '../components/Footer';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-white selection:text-brand-black">
      <ParticleBackground />
      
      <main className="relative flex flex-col">
        <Hero />
        <Info />
        <Categories />
        <Ranking />
        <Location />
      </main>

      <Footer />
    </div>
  );
}
