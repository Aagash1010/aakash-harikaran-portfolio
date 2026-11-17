/**
 * A pure-CSS/SVG sculpture used wherever the WebGL core isn't appropriate:
 * reduced motion, small screens, or while the 3D chunk is loading.
 * It is deliberately an object — not a substitute for the portrait.
 */
export function HeroOrb({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="relative h-full w-full">
        <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(198,255,77,0.14),transparent_62%)] blur-2xl" />
        <div className="orbit-spin absolute inset-[4%] rounded-full border border-white/10" />
        <div className="orbit-spin-reverse absolute inset-[12%] rounded-full border border-dashed border-white/[0.13]" />
        <div className="absolute inset-[2%] rounded-full border border-dashed border-lime/15 [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />

        <div className="float-slow absolute inset-[20%]">
          <svg
            viewBox="0 0 400 400"
            className="h-full w-full drop-shadow-[0_28px_60px_rgba(0,0,0,0.55)]"
          >
            <defs>
              <linearGradient id="orb-metal" x1="18%" y1="0%" x2="86%" y2="100%">
                <stop offset="0%" stopColor="#3a3a3a" />
                <stop offset="48%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0b0b0b" />
              </linearGradient>
              <linearGradient id="orb-facet" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2c2c2c" />
                <stop offset="100%" stopColor="#151515" />
              </linearGradient>
              <linearGradient id="orb-edge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c6ff4d" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#c6ff4d" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#c6ff4d" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Orbital rings */}
            <g fill="none">
              <ellipse
                cx="200"
                cy="200"
                rx="186"
                ry="62"
                stroke="#f5f5f5"
                strokeOpacity="0.16"
                transform="rotate(-18 200 200)"
              />
              <ellipse
                cx="200"
                cy="200"
                rx="168"
                ry="46"
                stroke="#c6ff4d"
                strokeOpacity="0.34"
                transform="rotate(24 200 200)"
              />
              <circle cx="356" cy="158" r="3" fill="#c6ff4d" />
              <circle cx="62" cy="256" r="2" fill="#c6ff4d" fillOpacity="0.7" />
            </g>

            {/* Wireframe shell */}
            <g
              fill="none"
              stroke="#f5f5f5"
              strokeOpacity="0.16"
              strokeWidth="0.8"
              transform="rotate(30 200 200)"
            >
              <polygon points="200,78 305,139 305,261 200,322 95,261 95,139" />
              <polygon points="200,110 277,155 277,245 200,290 123,245 123,155" />
            </g>

            {/* Faceted core */}
            <g stroke="#c6ff4d" strokeOpacity="0.28" strokeWidth="0.9" strokeLinejoin="round">
              <polygon points="200,108 280,154 280,246 200,292 120,246 120,154" fill="url(#orb-metal)" />
              <polygon points="200,108 280,154 200,200 120,154" fill="url(#orb-facet)" />
              <polygon points="280,154 280,246 200,200" fill="#191919" />
              <polygon points="280,246 200,292 200,200" fill="#101010" />
              <polygon points="200,292 120,246 200,200" fill="#1d1d1d" />
              <polygon points="120,246 120,154 200,200" fill="#141414" />
              <polygon points="200,108 120,154 200,200" fill="#232323" fillOpacity="0.85" />
            </g>

            {/* Highlight and energy seams */}
            <g fill="none" strokeLinecap="round">
              <path
                d="M200 108 L200 200 L280 246"
                stroke="url(#orb-edge)"
                strokeWidth="1.4"
              />
              <path
                d="M148 130 L200 108"
                stroke="#f5f5f5"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
              <path
                d="M200 200 L200 292"
                stroke="#c6ff4d"
                strokeOpacity="0.45"
                strokeWidth="0.8"
              />
            </g>

            <circle cx="200" cy="200" r="2.4" fill="#c6ff4d" />
            <circle cx="200" cy="200" r="9" fill="none" stroke="#c6ff4d" strokeOpacity="0.35" />
            <circle
              cx="200"
              cy="200"
              r="17"
              fill="none"
              stroke="#c6ff4d"
              strokeOpacity="0.14"
              strokeDasharray="2 5"
            />
          </svg>
        </div>

        <div className="absolute inset-x-[22%] top-1/2 h-px bg-lime/20" />
        <div className="absolute bottom-[13%] left-1/2 -translate-x-1/2 font-mono text-[7px] uppercase tracking-[0.32em] text-white/35">
          Energy / Core
        </div>
      </div>
    </div>
  );
}
