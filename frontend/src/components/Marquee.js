const ITEMS = [
  "Torres del Paine",
  "Atacama Stargazing",
  "Private Valparaíso Wineries",
  "Patagonian Ice Trekking",
  "Bespoke Luxury Travel",
  "Grey Glacier Navigation",
];

export const Marquee = () => {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      data-testid="marquee-strip"
      className="py-5 bg-[#F6F2EB] border-y border-[#E6DFD5] overflow-hidden"
    >
      <div className="flex w-max animate-marquee">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center font-mono text-xs uppercase tracking-[0.3em] text-[#5C656E]"
              >
                <span className="px-8">{item}</span>
                <span className="text-[#C87D55] text-[8px]">●</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
