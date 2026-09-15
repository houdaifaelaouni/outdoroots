import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { destinations, formatCurrency } from "@/data/destinations";

const reveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
};

export const Chapters = ({ onExplore }) => {
  return (
    <section data-testid="chapters-section" className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto">
      <motion.div {...reveal} className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#C87D55] mb-4">
          The manifesto
        </p>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-[#0B192C]">
          Five chapters. One country. Infinite compositions.
        </h2>
      </motion.div>

      <div className="mt-20 sm:mt-28 space-y-24 sm:space-y-32">
        {destinations.map((dest, idx) => {
          const Icon = dest.icon;
          const reversed = idx % 2 === 1;
          return (
            <motion.article
              key={dest.id}
              data-testid={`chapter-${dest.id}`}
              {...reveal}
              className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                reversed ? "" : ""
              }`}
            >
              <div className={`lg:col-span-5 ${reversed ? "lg:order-2" : ""}`}>
                <div className="relative">
                  <div className="overflow-hidden rounded-t-[10rem] rounded-b-2xl border border-[#E6DFD5] shadow-2xl shadow-[#0B192C]/10">
                    <motion.img
                      initial={{ scale: 1.15 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                      src={dest.image}
                      alt={dest.name}
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#0B192C] text-[#FDFBF7] rounded-full px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] whitespace-nowrap">
                    from {formatCurrency(dest.basePrice)} / day / person
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-7 ${reversed ? "lg:order-1 lg:pr-8" : "lg:pl-8"}`}>
                <div className="flex items-baseline gap-5">
                  <span className="font-serif italic text-6xl sm:text-7xl text-[#E6DFD5] leading-none select-none">
                    {dest.chapter}
                  </span>
                  <div>
                    <div className="flex items-center gap-3 text-[#C87D55]">
                      <Icon className="h-4 w-4" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em]">
                        {dest.tagline}
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl sm:text-5xl tracking-tight text-[#0B192C] mt-1">
                      {dest.name}
                    </h3>
                  </div>
                </div>

                <p className="mt-6 text-base leading-relaxed text-[#5C656E] max-w-xl">
                  {dest.longDescription}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {dest.activities.slice(0, 3).map((a) => (
                    <span
                      key={a.id}
                      className="rounded-full border border-[#E6DFD5] bg-white px-4 py-1.5 text-xs text-[#5C656E]"
                    >
                      {a.name}
                    </span>
                  ))}
                  <span className="rounded-full border border-[#E6DFD5] bg-[#F6F2EB] px-4 py-1.5 text-xs text-[#0B192C]">
                    +{dest.activities.length - 3} more
                  </span>
                </div>

                <button
                  data-testid={`chapter-explore-${dest.id}`}
                  onClick={() => onExplore(dest.id)}
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#0B192C] border-b border-[#0B192C]/30 pb-1 transition-colors hover:border-[#C87D55] hover:text-[#C87D55]"
                >
                  Compose this chapter
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};
