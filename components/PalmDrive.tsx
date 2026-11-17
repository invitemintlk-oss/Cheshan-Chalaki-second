"use client";

import { useEffect, useRef, useState } from "react";

// Palms line both verges; the avenue grows with its content, so the count follows its height
const PALM_GAP = 24; // svh between palms on the same side

function palmsFor(count: number) {
  return Array.from({ length: count * 2 }, (_, i) => {
    const side = i % 2 === 0 ? "left" : "right";
    const n = Math.floor(i / 2);
    return {
      side,
      top: n * PALM_GAP + (side === "right" ? PALM_GAP * 0.35 : 0) - 8,
      rot: (i * 47) % 360,
      scale: 0.88 + ((i * 7) % 5) * 0.06,
      delay: -((i * 1.3) % 7),
    };
  });
}

// Rose petals that tumble off the dupatta while the car is moving
const petals = Array.from({ length: 12 }, (_, i) => ({
  x: `${(i * 37) % 70 - 20}%`,
  dx: `${((i * 53) % 140) - 70}px`,
  dur: `${3.2 + ((i * 7) % 5) * 0.45}s`,
  delay: `${-i * 0.55}s`,
  size: 8 + ((i * 5) % 6),
}));

export default function PalmDrive({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [palmCount, setPalmCount] = useState(40);

  // While the page is scrolling the car is "moving": it sways and drops petals
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: number | undefined;
    const onScroll = () => {
      el.classList.add("moving");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => el.classList.remove("moving"), 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const fit = () => {
      const svh = window.innerHeight / 100;
      setPalmCount(Math.ceil(el.offsetHeight / (PALM_GAP * svh)) + 1);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="drive" ref={ref}>
      <div className="road" aria-hidden="true" />

      {palmsFor(palmCount).map((p, i) => (
        <div key={i} className={`palm-wrap ${p.side}`} aria-hidden="true"
          style={{ top: `${p.top}svh`, ["--r" as string]: `${p.rot}deg`, ["--s" as string]: p.scale, ["--pd" as string]: `${p.delay}s` }}>
          <img src="/palm-shadow.webp" alt="" className="palm-shadow" draggable={false} />
          <img src="/palm.webp" alt="" className="palm-img" draggable={false} {...(i < 4 ? { fetchPriority: "high" as const } : { loading: "lazy" as const })} />
        </div>
      ))}

      <div className="drive-flow">{children}</div>

      {/* The car stays pinned in view while the avenue scrolls beneath it */}
      <div className="car-track" aria-hidden="true">
        <div className="car-rig">
          <div className="petals">
            {petals.map((p, i) => (
              <span key={i} className="petal"
                style={{ left: p.x, width: p.size, height: p.size * 0.72, ["--dx" as string]: p.dx, ["--dur" as string]: p.dur, ["--delay" as string]: p.delay }} />
            ))}
          </div>
          <img src="/car-poster-v2.webp" alt="" className="car" draggable={false} fetchPriority="high" />
        </div>
      </div>
    </div>
  );
}
