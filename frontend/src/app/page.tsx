import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Stats } from "@/components/landing/Stats";
import { Security } from "@/components/landing/Security";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { Scene3D } from "@/components/landing/Scene3D";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent selection:bg-emerald-500/30 relative">
      <div className="fixed inset-0 -z-10 bg-white dark:bg-black" />
      <Scene3D />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <HowItWorks />
        <Features />
        <Stats />
        <Security />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
