import { MarketingNav } from "@/components/layout/MarketingNav";
import { HeroSection } from "@/components/marketing/HeroSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />

      <main className="page-container py-10 sm:py-16 md:py-20">
        <HeroSection />
        <HowItWorks />
        <hr className="mb-14 sm:mb-16" style={{ borderColor: "var(--border)" }} />
        <FeaturesSection />
      </main>

      <footer
        className="border-t py-6 text-center text-xs"
        style={{ borderColor: "var(--border)", color: "var(--fg-muted)" }}
      >
        Radius · H0 Hackathon
      </footer>
    </div>
  );
}
