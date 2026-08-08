const marqueeItems = [
  "High-End Replicas 1:1", "Individual Search", "QC Photo Report",
  "Holy Drip — In Swag We Trust", "New Drop Every Friday", "Curator Service",
];

export default function Marquee() {
    return (
        <div className="w-full overflow-hidden border-y border-white/[0.06] py-3 select-none">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-10 text-white/20 text-[10px] tracking-[4px] uppercase mx-12 font-light">
              {item}<span className="text-white/10">·</span>
            </span>
          ))}
        </div>
      </div>
    )
}