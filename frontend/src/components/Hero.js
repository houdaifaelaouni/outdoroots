import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { IMAGES } from "@/data/destinations";

const LINES = ["Chile, composed", "entirely around you."];

const STATS = [
  { value: "03", label: "Epic regions" },
  { value: "100%", label: "Bespoke" },
  { value: "EUR", label: "Live pricing" },
];

export const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 240]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.3]);

  const scrollToBuilder = () => {
    document.getElementById("builder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      data-testid="hero-section"
      className="relative min-h-[94vh] flex items-end overflow-hidden bg-[#0B192C] text-[#FDFBF7]"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="Patagonian glacier at dusk"
          className="h-[125%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B192C]/70 via-[#0B192C]/30 to-[#0B192C]" />
      </motion.div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pb-20 pt-40">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="font-mono text-xs uppercase tracking-[0.35em] text-[#D4A373] mb-8"
        >
          Bespoke expeditions · Est. at the end of the world
        </motion.p>

        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[1.04]">
          {LINES.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                initial={{ y: "115%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3 + i * 0.18, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {i === 1 ? <em className="text-[#D4A373]">{line}</em> : line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8 }}
          className="mt-8 max-w-xl text-base sm:text-lg text-[#FDFBF7]/75 leading-relaxed"
        >
          Patagonia's ice, the Atacama's stars, Santiago's tables — assemble your own
          expedition, watch the price take shape live, and let our team execute every detail.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8 }}
          className="mt-12 flex flex-wrap items-end gap-x-14 gap-y-8"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-serif text-4xl sm:text-5xl">{s.value}</div>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#FDFBF7]/60 mt-2">
                {s.label}
              </div>
            </div>
          ))}
          <button
            data-testid="hero-begin-button"
            onClick={scrollToBuilder}
            className="group mb-1 inline-flex items-center gap-3 rounded-full border border-[#FDFBF7]/30 px-7 py-3.5 text-sm tracking-wide transition-colors duration-300 hover:bg-[#FDFBF7] hover:text-[#0B192C]"
          >
            Begin composing
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
