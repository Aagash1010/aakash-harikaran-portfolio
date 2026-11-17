import { Heart, Radio, Sun } from "lucide-react";
import type { Project } from "../../data/profile";

function Frame({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-panel transition-colors duration-500 group-hover:border-accent/30"
      data-cursor-label="VIEW CASE"
    >
      <div aria-hidden className="absolute inset-0 blueprint-grid opacity-35" />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,var(--c-lime-soft),transparent_55%)]"
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5 sm:px-5 sm:py-3">
          <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
            <span className="size-1.5 rounded-full bg-lime" />
            Case study / {project.index}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted/70">
            Abstract preview
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">{children}</div>

        <div className="flex items-center justify-between border-t border-line px-4 py-2.5 font-mono text-[7.5px] uppercase tracking-[0.18em] text-muted sm:px-5">
          <span>{project.stack.slice(0, 3).map((tech) => tech.name).join(" / ")}</span>
          <span className="hidden sm:inline">Beyond the Interface / Selected work</span>
          <span>{project.index} / 04</span>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-3">
        <span className="absolute left-0 top-0 size-3 border-l border-t border-lime/50 transition-all duration-500 group-hover:size-5" />
        <span className="absolute right-0 top-0 size-3 border-r border-t border-lime/50 transition-all duration-500 group-hover:size-5" />
        <span className="absolute bottom-0 left-0 size-3 border-b border-l border-lime/50 transition-all duration-500 group-hover:size-5" />
        <span className="absolute bottom-0 right-0 size-3 border-b border-r border-lime/50 transition-all duration-500 group-hover:size-5" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 translate-y-full bg-gradient-to-t from-lime/[0.06] to-transparent transition-transform duration-700 group-hover:translate-y-0"
      />
    </div>
  );
}

function TourismVisual() {
  return (
    <div className="flex h-full flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mono-label text-lime/90">Route / Customise</p>
          <p className="mt-2 font-display text-lg font-bold uppercase leading-none tracking-[-0.03em] text-ink sm:text-2xl">
            Explore the island.
          </p>
        </div>
        <span className="font-mono text-[8px] tracking-[0.16em] text-muted">LK / 01</span>
      </div>

      <div className="mt-4 flex flex-1 gap-3 sm:gap-5">
        <div className="flex w-[42%] flex-col justify-between border-l border-line pl-3 sm:pl-4">
          {[
            { title: "Destination", meta: "Manage" },
            { title: "Hotel", meta: "Manage" },
            { title: "Guide", meta: "Manage" },
            { title: "Booking", meta: "Manage" },
          ].map((node, index) => (
            <div key={node.title} className="relative flex items-center gap-2.5">
              <span className="relative flex size-2 shrink-0 items-center justify-center">
                <span className="absolute size-2 rounded-full border border-lime/60" />
                <span className="size-0.5 rounded-full bg-lime" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-mono text-[7.5px] uppercase tracking-[0.13em] text-ink sm:text-[8.5px]">
                  {node.title}
                </span>
                <span className="block font-mono text-[6.5px] uppercase tracking-[0.14em] text-muted/60">
                  0{index + 1} / {node.meta}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="relative flex-1 overflow-hidden border border-line/80 bg-base/25">
          <svg
            viewBox="0 0 220 220"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
          >
            {[22, 44, 66, 88].map((radius) => (
              <circle
                key={radius}
                cx="118"
                cy="112"
                r={radius}
                fill="none"
                stroke="var(--c-line)"
                strokeWidth="0.5"
              />
            ))}
            <path
              d="M-10 160 C40 140 32 96 78 88 S138 118 160 76 S196 52 230 38"
              fill="none"
              stroke="var(--c-line)"
              strokeWidth="0.9"
            />
            <path
              d="M-5 190 C40 168 52 148 86 144 S142 154 168 122 S200 104 225 98"
              fill="none"
              stroke="var(--c-line)"
              strokeWidth="0.7"
            />
            <path
              d="M18 176 C56 154 72 150 98 160 S146 166 170 140 S202 124 226 128"
              fill="none"
              stroke="var(--c-line)"
              strokeWidth="0.5"
            />
            <path
              d="M32 176 C62 156 78 124 104 108 S148 126 166 92 S192 52 214 34"
              fill="none"
              stroke="var(--c-accent)"
              strokeWidth="1.1"
              strokeDasharray="4 5"
              className="transition-[stroke-dashoffset] duration-1000 group-hover:[stroke-dashoffset:-36]"
            />
            {[
              [32, 176],
              [104, 108],
              [166, 92],
              [214, 34],
            ].map(([x, y], index) => (
              <g key={index}>
                <circle cx={x} cy={y} r="5.5" fill="var(--c-base)" stroke="var(--c-accent)" strokeWidth="1" />
                <circle cx={x} cy={y} r="1.5" fill="var(--c-accent)" />
              </g>
            ))}
            <circle
              cx="168"
              cy="62"
              r="17"
              fill="none"
              stroke="var(--c-accent)"
              strokeOpacity="0.4"
            />
            <circle cx="168" cy="62" r="8" fill="var(--c-accent)" fillOpacity="0.12" />
          </svg>
          <span className="absolute bottom-2 right-2 hidden font-mono text-[6.5px] uppercase tracking-[0.18em] text-muted/50 sm:block">
            Package map / illustrative
          </span>
          <span className="absolute left-2 top-2 font-mono text-[6.5px] uppercase tracking-[0.18em] text-muted/50">
            07° N / 80° E
          </span>
        </div>
      </div>

      <div className="mt-3 hidden flex-wrap items-center gap-1.5 sm:flex">
        {["Auth", "CRUD", "MySQL"].map((chip) => (
          <span
            key={chip}
            className="border border-line px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.14em] text-muted transition-colors group-hover:border-accent/25 group-hover:text-accent/80"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

function BillingVisual() {
  const bars = [38, 62, 46, 78, 55, 88, 70];
  const invoiceRows: Array<[string, string, string]> = [
    ["Colour print / A4", "02", "480.00"],
    ["Lamination / A3", "01", "350.00"],
    ["ID photo set", "04", "800.00"],
    ["Canvas print 12×18", "01", "2,450.00"],
    ["Document scan", "06", "720.00"],
    ["Photo restoration", "01", "1,800.00"],
    ["Spiral binding", "03", "540.00"],
    ["Frame mount", "02", "1,100.00"],
  ];

  return (
    <div className="relative flex h-full gap-4 p-4 sm:gap-6 sm:p-5">
      <div className="flex w-[40%] flex-col justify-between">
        <div>
          <p className="mono-label text-lime/90">Sales / Overview</p>
          <p className="mt-2 font-display text-lg font-bold uppercase leading-[0.9] tracking-[-0.04em] text-ink sm:text-2xl">
            Billing,
            <br />
            refined.
          </p>
        </div>

        <div className="space-y-1.5">
          {bars.map((height, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 font-mono text-[6px] uppercase tracking-[0.14em] text-muted/60">
                D{index + 1}
              </span>
              <span className="relative h-1 flex-1 overflow-hidden bg-line/60">
                <span
                  className="absolute inset-y-0 left-0 bg-lime/70 transition-all duration-700 group-hover:bg-lime"
                  style={{
                    width: `${height}%`,
                    transitionDelay: `${index * 35}ms`,
                  }}
                />
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["PDF", "LocalStorage", "Reports"].map((chip) => (
            <span
              key={chip}
              className="border border-line px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.14em] text-muted"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="relative flex-1">
        <div
          aria-hidden
          className="absolute -right-1 top-2 font-display text-6xl font-bold leading-none tracking-[-0.06em] text-ink/[0.04] sm:text-8xl"
        >
          INV
        </div>
        <div className="absolute inset-x-1 bottom-2 top-1 flex flex-col border border-line bg-[#f3f3e9] p-3 text-[#10120c] shadow-[0_24px_50px_-24px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-out group-hover:-translate-y-1 group-hover:-rotate-1 sm:p-4">
          <div className="flex items-start justify-between border-b border-black/10 pb-2">
            <div>
              <p className="font-mono text-[5.5px] uppercase tracking-[0.18em] text-black/50">
                Luxmy Digital Color Lab
              </p>
              <p className="mt-1 font-display text-[10px] font-bold uppercase tracking-[-0.02em] sm:text-xs">
                Invoice
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[5.5px] uppercase tracking-[0.12em] text-black/45">
                No. 001
              </p>
              <p className="mt-1 font-mono text-[5px] uppercase tracking-[0.1em] text-black/30">
                Daily report
              </p>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-[1fr_auto_auto] gap-x-3 border-b border-black/10 pb-1 font-mono text-[4.5px] uppercase tracking-[0.14em] text-black/35">
            <span>Item</span>
            <span>Qty</span>
            <span className="text-right">Amount</span>
          </div>

          <div className="mt-1.5 flex flex-1 flex-col justify-between">
            {invoiceRows.map(([item, qty, amount]) => (
              <div
                key={item}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3"
              >
                <span className="truncate font-mono text-[5.5px] tracking-[0.02em] text-black/60">
                  {item}
                </span>
                <span className="font-mono text-[5px] text-black/35">{qty}</span>
                <span className="text-right font-mono text-[5.5px] text-black/70">
                  {amount}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 border-t border-dashed border-black/15 pt-1.5">
            <div className="flex items-center justify-between font-mono text-[5px] uppercase tracking-[0.1em] text-black/40">
              <span>Subtotal</span>
              <span>8,240.00</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between font-mono text-[5px] uppercase tracking-[0.1em] text-black/40">
              <span>Tax</span>
              <span>0.00</span>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-black/20 pt-1">
              <span className="font-mono text-[5.5px] uppercase tracking-[0.14em] text-black/55">
                Total
              </span>
              <span className="font-mono text-[9px] font-bold tracking-[-0.02em]">
                LKR 8,240
              </span>
            </div>
          </div>

          <div className="mt-2 flex items-end justify-between gap-2">
            <div className="flex flex-col gap-0.5 font-mono text-[4.5px] uppercase leading-tight tracking-[0.1em] text-black/35">
              <span>Generated / Digital receipt</span>
              <span>Daily + monthly reports</span>
            </div>
            <div
              aria-hidden
              className="h-5 w-11"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, #10120c 0 1px, transparent 1px 3px)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherVisual() {
  return (
    <div className="relative flex h-full flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="mono-label text-lime/90">Atmosphere / Live</p>
          <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.18em] text-muted/60">
            Location feed / interactive preview
          </p>
        </div>
        <span className="border border-line px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.14em] text-muted">
          REST API
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-between gap-2 py-2">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[clamp(3.5rem,12vw,8rem)] font-bold uppercase leading-none tracking-[-0.07em] text-ink/[0.035]"
        >
          Weather
        </div>

        <div className="relative z-10">
          <div className="flex items-end gap-2 sm:gap-3">
            <span className="font-display text-[clamp(3.6rem,10vw,6.8rem)] font-bold leading-[0.75] tracking-[-0.08em] text-ink">
              27<span className="text-lime">°</span>
            </span>
            <div className="mb-2 flex flex-col gap-1">
              <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-muted">
                Colombo / LK
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[6.5px] uppercase tracking-[0.16em] text-lime">
                <span className="size-1 rounded-full bg-lime" />
                Live conditions
              </span>
            </div>
          </div>
          <p className="mt-3 max-w-[12rem] font-mono text-[7px] uppercase leading-relaxed tracking-[0.16em] text-muted/70">
            City search · API response · Responsive forecast
          </p>
        </div>

        <div className="relative z-10 mr-1 grid size-20 place-items-center sm:size-28">
          <span className="absolute inset-0 rounded-full border border-line/70" />
          <span className="absolute inset-2 rounded-full border border-dashed border-line/50 orbit-spin" />
          <span className="absolute inset-[18%] rounded-full border border-lime/35 bg-[radial-gradient(circle,rgba(198,255,77,0.22),transparent_70%)]" />
          <Sun
            size={28}
            strokeWidth={1.2}
            className="relative text-lime float-slow"
            aria-hidden
          />
          <span className="absolute -bottom-1 right-0 font-mono text-[6px] uppercase tracking-[0.16em] text-muted/50">
            UV / —
          </span>
        </div>
      </div>

      <div className="border-t border-line pt-2.5">
        <div className="flex items-end justify-between gap-2">
          {[34, 58, 42, 72, 50, 64].map((height, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-8 w-full items-end justify-center sm:h-10">
                <span
                  className="w-1/2 bg-lime/25 transition-all duration-500 group-hover:bg-lime/50"
                  style={{ height: `${height}%`, transitionDelay: `${index * 40}ms` }}
                />
              </div>
              <span className="font-mono text-[5.5px] uppercase tracking-[0.1em] text-muted/50">
                {["M", "T", "W", "T", "F", "S"][index]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Esp32Visual() {
  return (
    <div className="flex h-full flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="mono-label text-lime/90">IoT / Health monitor</p>
          <p className="mt-2 font-display text-lg font-bold uppercase leading-none tracking-[-0.03em] text-ink sm:text-xl">
            Heart rate module
          </p>
        </div>
        <Heart size={16} strokeWidth={1.4} className="text-lime" aria-hidden />
      </div>

      <div className="relative mt-3 h-[36%] w-full border-y border-line/70">
        <div aria-hidden className="absolute inset-0 blueprint-grid opacity-30" />
        <svg
          viewBox="0 0 360 110"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M0 70 L52 70 L62 70 L70 42 L80 88 L90 58 L100 70 L148 70 L158 70 L166 46 L176 86 L186 56 L194 70 L242 70 L252 70 L260 38 L270 92 L280 54 L288 70 L336 70 L360 70"
            fill="none"
            stroke="var(--c-accent)"
            strokeWidth="1.4"
            strokeOpacity="0.28"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M0 70 L52 70 L62 70 L70 42 L80 88 L90 58 L100 70 L148 70 L158 70 L166 46 L176 86 L186 56 L194 70 L242 70 L252 70 L260 38 L270 92 L280 54 L288 70 L336 70 L360 70"
            fill="none"
            stroke="var(--c-accent)"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="ecg-sweep"
          />
        </svg>
        <span className="absolute left-1 top-1 font-mono text-[6px] uppercase tracking-[0.16em] text-muted/60">
          Signal / continuous
        </span>
        <span className="absolute bottom-1 right-1 font-mono text-[6px] uppercase tracking-[0.16em] text-lime/80">
          BPM / —
        </span>
      </div>

      <div className="mt-3 grid flex-1 grid-cols-[1fr_1.2fr_1fr] items-center gap-2">
        <div className="border border-line px-2 py-2.5 text-center">
          <span className="block font-mono text-[7px] uppercase tracking-[0.14em] text-ink">
            HR sensor
          </span>
          <span className="mt-1 block font-mono text-[5.5px] uppercase tracking-[0.14em] text-muted/60">
            Input
          </span>
        </div>

        <div className="relative border border-accent/30 bg-lime/[0.035] px-2 py-3 text-center">
          <span className="absolute -left-2 top-1/2 h-px w-2 bg-lime/50" />
          <span className="absolute -right-2 top-1/2 h-px w-2 bg-lime/50" />
          <span className="block font-display text-[10px] font-bold uppercase tracking-[0.02em] text-ink">
            ESP32
          </span>
          <span className="mt-0.5 block font-mono text-[5.5px] uppercase tracking-[0.16em] text-lime/80">
            Process
          </span>
          <div aria-hidden className="absolute -left-1 top-2 flex flex-col gap-1">
            {[0, 1, 2, 3].map((pin) => (
              <span key={pin} className="block size-1 bg-line" />
            ))}
          </div>
          <div aria-hidden className="absolute -right-1 top-2 flex flex-col gap-1">
            {[0, 1, 2, 3].map((pin) => (
              <span key={pin} className="block size-1 bg-line" />
            ))}
          </div>
        </div>

        <div className="border border-line px-2 py-2.5 text-center">
          <span className="block font-mono text-[7px] uppercase tracking-[0.14em] text-ink">
            SIM800L
          </span>
          <span className="mt-1 block font-mono text-[5.5px] uppercase tracking-[0.14em] text-muted/60">
            Transmit
          </span>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {["MPU6050", "GPS", "GSM"].map((chip) => (
            <span
              key={chip}
              className="border border-line px-2 py-1 font-mono text-[6.5px] uppercase tracking-[0.14em] text-muted"
            >
              {chip}
            </span>
          ))}
        </div>
        <span className="hidden items-center gap-1.5 font-mono text-[6.5px] uppercase tracking-[0.14em] text-lime/80 sm:flex">
          <Radio size={10} strokeWidth={1.5} aria-hidden />
          Module 01
        </span>
      </div>
    </div>
  );
}

export function ProjectVisual({ project }: { project: Project }) {
  return (
    <Frame project={project}>
      {project.visual === "tourism" ? <TourismVisual /> : null}
      {project.visual === "billing" ? <BillingVisual /> : null}
      {project.visual === "weather" ? <WeatherVisual /> : null}
      {project.visual === "esp32" ? <Esp32Visual /> : null}
    </Frame>
  );
}
