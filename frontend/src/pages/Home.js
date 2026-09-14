import { useEffect } from "react";
import Lenis from "lenis";
import { Link } from "react-router-dom";
import { Mountain, Mail, Phone, KeyRound } from "lucide-react";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Chapters } from "@/components/Chapters";
import { Builder } from "@/components/Builder";
import { usePackageBuilder } from "@/hooks/usePackageBuilder";
import { formatCurrency } from "@/data/destinations";

export default function Home() {
  const builder = usePackageBuilder();

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleExplore = (destId) => {
    builder.setActiveTab(destId);
    const sel = builder.selectedDestinations.find((d) => d.id === destId);
    if (sel && sel.days === 0) builder.handleDaysChange(destId, 3);
    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div data-testid="home-page" className="min-h-screen bg-[#FDFBF7]">
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-[#FDFBF7]/80 border-b border-[#E6DFD5]/70">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <a href="#top" data-testid="nav-logo" className="flex items-center gap-2.5">
            <Mountain className="h-5 w-5 text-[#0B192C]" />
            <span className="font-serif text-lg tracking-tight text-[#0B192C]">
              Chile Travel Builder
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] text-[#5C656E]">
            <a href="#builder" data-testid="nav-builder-link" className="hover:text-[#0B192C] transition-colors">Atelier</a>
            <span data-testid="nav-price-badge" className="text-[#0B192C] font-medium">
              {formatCurrency(builder.grandTotal)}
            </span>
            <Link
              to="/admin"
              data-testid="nav-admin-link"
              className="flex items-center gap-1.5 rounded-full border border-[#E6DFD5] px-4 py-1.5 hover:bg-[#0B192C] hover:text-[#FDFBF7] hover:border-[#0B192C] transition-colors"
            >
              <KeyRound className="h-3 w-3" /> Team
            </Link>
          </nav>
        </div>
      </header>

      <Hero />
      <Marquee />
      <Chapters onExplore={handleExplore} />
      <Builder builder={builder} />

      <footer data-testid="footer" className="bg-[#0B192C] text-[#FDFBF7] mt-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
          <div className="font-serif text-5xl sm:text-7xl tracking-tight leading-[1.05] max-w-3xl">
            The end of the world, <em className="text-[#D4A373]">tailored.</em>
          </div>
          <div className="mt-14 pt-8 border-t border-[#FDFBF7]/15 flex flex-col sm:flex-row justify-between gap-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#FDFBF7]/50">
              Chile Travel Builder · Custom packages executed by our expert team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-[#FDFBF7]/70">
              <a data-testid="footer-email" href="mailto:info@chiletravel.com" className="flex items-center gap-2 hover:text-[#D4A373] transition-colors">
                <Mail className="h-4 w-4" /> info@chiletravel.com
              </a>
              <a data-testid="footer-phone" href="tel:+5621234567" className="flex items-center gap-2 hover:text-[#D4A373] transition-colors">
                <Phone className="h-4 w-4" /> +56 2 1234 5678
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
