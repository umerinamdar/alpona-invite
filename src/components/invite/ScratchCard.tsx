import { useEffect, useRef, useState } from "react";

export function ScratchCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const foil = css.getPropertyValue("--scratch-foil").trim();
    const bright = css.getPropertyValue("--highlight-bright").trim();
    const ink = css.getPropertyValue("--scratch-ink").trim();
    const r = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, r.width, r.height);
    g.addColorStop(0, foil); g.addColorStop(0.5, bright); g.addColorStop(1, foil);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, r.width, r.height);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
      ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 1, 1);
    }
    ctx.fillStyle = ink;
    ctx.font = "500 11px Jost, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH TO REVEAL", r.width / 2, r.height / 2 + 4);

    let down = false;
    const scratch = (e: PointerEvent) => {
      if (!down) return;
      const b = c.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(e.clientX - b.left, e.clientY - b.top, 22, 0, Math.PI * 2);
      ctx.fill();
    };
    const check = () => {
      down = false;
      const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let clear = 0;
      for (let i = 3; i < d.length; i += 64) if (d[i] === 0) clear++;
      if (clear / (d.length / 64) > 0.45) setDone(true);
    };
    const start = (e: PointerEvent) => { down = true; c.setPointerCapture(e.pointerId); scratch(e); };
    c.addEventListener("pointerdown", start);
    c.addEventListener("pointermove", scratch);
    c.addEventListener("pointerup", check);
    return () => {
      c.removeEventListener("pointerdown", start);
      c.removeEventListener("pointermove", scratch);
      c.removeEventListener("pointerup", check);
    };
  }, []);

  return (
    <div className="relative mx-auto aspect-[2/1] w-full max-w-xs overflow-hidden rounded-sm border border-gold/60">
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface">{children}</div>
      <canvas
        ref={ref}
        aria-label="Scratch to reveal the date"
        className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${done ? "pointer-events-none opacity-0" : ""}`}
      />
    </div>
  );
}
