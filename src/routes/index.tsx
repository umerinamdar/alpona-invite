import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import sealedBg from "@/assets/sealed-backdrop.jpg";
import heroBg from "@/assets/hero-backdrop.jpg";
import waxSeal from "@/assets/wax-seal.png";
import paper from "@/assets/paper-texture.jpg";
import { Corners, Divider, SectionHeading } from "@/components/invite/Ornaments";
import { ScratchCard } from "@/components/invite/ScratchCard";

const COUPLE = { a: "Aarav", b: "Anaya" };
const WEDDING = new Date("2027-02-14T18:30:00+05:30");
const VENUE = "The Grand Pavilion";
const EVENTS = [
  { name: "Gaye Holud", when: "2027-02-13T10:00:00+05:30", note: "Turmeric blessings in the courtyard" },
  { name: "Biye", when: "2027-02-14T18:30:00+05:30", note: "The wedding ceremony under the mandap" },
  { name: "Bou Bhaat", when: "2027-02-15T19:30:00+05:30", note: "Reception dinner & celebrations" },
];
const fmt = (iso: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", ...o }).format(new Date(iso));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aarav & Anaya — 14 February 2027" },
      { name: "description", content: "You are warmly invited to the wedding of Aarav & Anaya at The Grand Pavilion." },
      { property: "og:title", content: "Aarav & Anaya — Wedding Invitation" },
      { property: "og:description", content: "Join us on 14 February 2027 at The Grand Pavilion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { el.classList.add("is-visible"); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [el]);
  return <div ref={setEl} className={`reveal ${className}`}>{children}</div>;
}

function Section({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <section id={id} className="px-5 py-20 sm:py-28">
      <Reveal className="card-frame mx-auto max-w-3xl px-6 py-14 sm:px-14 sm:py-20">
        <Corners />
        {children}
      </Reveal>
    </section>
  );
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, WEDDING.getTime() - (now ?? WEDDING.getTime()));
  const parts = [
    ["Days", Math.floor(diff / 864e5)],
    ["Hours", Math.floor(diff / 36e5) % 24],
    ["Minutes", Math.floor(diff / 6e4) % 60],
    ["Seconds", Math.floor(diff / 1e3) % 60],
  ] as const;
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-6">
      {parts.map(([l, v]) => (
        <div key={l} className="border-y border-gold/50 py-4 text-center">
          <div className="font-display text-3xl tabular-nums text-accent sm:text-5xl">{now === null ? "—" : String(v).padStart(2, "0")}</div>
          <div className="eyebrow mt-1 !text-[0.6rem] sm:!text-xs">{l}</div>
        </div>
      ))}
    </div>
  );
}

function Petals() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 block h-3 w-2 rounded-full bg-gold/80"
          style={{
            left: `${(i * 53) % 100}%`,
            animation: `petal-fall ${7 + (i % 5)}s linear ${i * 0.35}s 2 both`,
            ["--drift" as string]: `${(i % 2 ? 1 : -1) * (20 + i * 3)}px`,
            backgroundColor: i % 3 === 0 ? "var(--accent-soft)" : undefined,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function Invitation() {
  const [open, setOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [rsvp, setRsvp] = useState<string | null>(null);

  const onOpen = () => {
    if (opening) return;
    setOpening(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => setOpen(true), reduce ? 0 : 1300);
  };

  useEffect(() => {
    document.body.style.overflow = open ? "" : "hidden";
  }, [open]);

  const paperStyle = { ["--paper-url" as string]: `url(${paper})` } as CSSProperties;

  return (
    <main className="paper-ground min-h-screen" style={paperStyle}>
      {/* Opening */}
      {!open && (
        <div className={`fixed inset-0 z-50 overflow-hidden bg-foreground transition-opacity duration-1000 ${opening ? "opacity-0 delay-500" : ""}`}>
          <img src={sealedBg} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-xl" />
          <div className="absolute left-1/2 top-1/2 aspect-[3/2] -translate-x-1/2 -translate-y-1/2" style={{ width: "max(min(165vw, 150vh), 100vw)" }}>
            <img src={sealedBg} alt="A sealed invitation envelope on a carved stone ledge" width={1536} height={1024} className="h-full w-full object-cover" />
            <button
              onClick={onOpen}
              aria-label="Tap the seal to open your invitation"
              className={`absolute left-1/2 top-[55%] aspect-square w-[15%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ${opening ? "scale-[2.2] opacity-0" : "animate-seal"}`}
              style={{ filter: "drop-shadow(var(--shadow-seal))" }}
            >
              <img src={waxSeal} alt="" width={816} height={816} className="h-full w-full" />
              <span className="absolute inset-0 flex items-center justify-center font-display text-[clamp(1rem,4.2vw,3rem)] font-medium italic gold-text">
                A<span className="mx-[0.1em] text-[0.7em]">&amp;</span>A
              </span>
            </button>
          </div>
          <p className={`absolute inset-x-0 bottom-10 text-center eyebrow !text-paper-light transition-opacity ${opening ? "opacity-0" : ""}`}>
            Tap the seal to open
          </p>
        </div>
      )}
      {open && <Petals />}

      {/* Hero */}
      <header className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" aria-hidden width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, color-mix(in oklab, var(--paper-light) 55%, transparent) 0%, transparent 60%)" }} />
        <div className={`relative z-10 mx-auto max-w-[min(88vw,34rem)] text-center ${open ? "animate-float-in" : "opacity-0"}`}>
          <p className="eyebrow !text-foreground">Together with their families</p>
          <h1 className="mt-6 font-display text-[clamp(3.2rem,14vw,7.5rem)] font-medium leading-[0.9] text-accent">
            {COUPLE.a}
            <span className="my-2 block text-[0.45em] italic gold-text animate-shimmer">&amp;</span>
            {COUPLE.b}
          </h1>
          <Divider className="mt-6" />
          <div className="card-frame mx-auto mt-6 inline-block px-8 py-5">
            <p className="eyebrow">Request the honour of your presence</p>
            <p className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
              {fmt(WEDDING.toISOString(), { weekday: "long" })} · {fmt(WEDDING.toISOString(), { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="eyebrow mt-2 !tracking-[0.25em]">{VENUE}</p>
          </div>
        </div>
      </header>

      <Section>
        <SectionHeading eyebrow="Counting the moments" title="Until Forever" />
        <Countdown />
      </Section>

      <Section>
        <SectionHeading eyebrow="Our invitation" title="With Blessings" />
        <p className="mx-auto max-w-xl text-center font-display text-xl leading-relaxed text-foreground sm:text-2xl">
          As the conch shells sound and the alpona is drawn, we invite you to share in the sacred union of our families —
          an evening of shubho drishti, sindoor and seven steps.
        </p>
        <div className="mt-10">
          <ScratchCard>
            <span className="eyebrow">Save the date</span>
            <span className="font-display text-3xl text-accent">14 · 02 · 2027</span>
          </ScratchCard>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="The celebrations" title="Ceremonies" />
        <ol className="space-y-10">
          {EVENTS.map((e, i) => (
            <li key={e.name} className="text-center">
              {i > 0 && <Divider className="mb-10 opacity-60" />}
              <h3 className="font-display text-3xl italic text-accent">{e.name}</h3>
              <p className="eyebrow mt-3">
                {fmt(e.when, { weekday: "short", day: "numeric", month: "long" })} · {fmt(e.when, { hour: "numeric", minute: "2-digit" })} IST
              </p>
              <p className="mt-2 text-sm font-light text-muted-foreground">{e.note}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading eyebrow="Where" title="The Venue" />
        <div className="text-center">
          <p className="font-display text-3xl text-foreground">{VENUE}</p>
          <p className="mt-2 text-sm font-light text-muted-foreground">Kolkata, West Bengal</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(VENUE + " Kolkata")}`}
            target="_blank"
            rel="noreferrer"
            className="eyebrow mt-8 inline-block border border-accent bg-accent px-8 py-3 !text-paper-light transition-colors hover:bg-accent-soft"
          >
            Open in Maps
          </a>
        </div>
      </Section>

      <Section id="rsvp">
        <SectionHeading eyebrow="Kindly reply" title="RSVP" />
        {rsvp ? (
          <p className="text-center font-display text-2xl italic text-accent">
            {rsvp === "yes" ? "Thank you — we can't wait to celebrate with you." : "You will be missed. Thank you for letting us know."}
          </p>
        ) : (
          <form
            className="mx-auto max-w-sm space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setRsvp(new FormData(e.currentTarget).get("attend") as string);
            }}
          >
            <label className="block">
              <span className="eyebrow">Your name</span>
              <input required name="name" className="mt-2 w-full border-0 border-b border-gold bg-transparent py-2 font-display text-xl outline-none focus:border-accent" />
            </label>
            <label className="block">
              <span className="eyebrow">Guests</span>
              <input name="guests" type="number" min={1} max={6} defaultValue={1} className="mt-2 w-full border-0 border-b border-gold bg-transparent py-2 font-display text-xl outline-none focus:border-accent" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["yes", "no"] as const).map((v) => (
                <label key={v} className="cursor-pointer">
                  <input type="radio" name="attend" value={v} defaultChecked={v === "yes"} className="peer sr-only" />
                  <span className="eyebrow block border border-gold py-3 text-center peer-checked:bg-accent peer-checked:!text-paper-light">
                    {v === "yes" ? "Joyfully accept" : "Regretfully decline"}
                  </span>
                </label>
              ))}
            </div>
            <button type="submit" className="eyebrow w-full border border-accent bg-accent py-4 !text-paper-light transition-colors hover:bg-accent-soft">
              Send reply
            </button>
          </form>
        )}
      </Section>

      <footer className="pb-16 pt-4 text-center">
        <Divider />
        <p className="mt-4 font-display text-2xl italic text-accent">{COUPLE.a} &amp; {COUPLE.b}</p>
        <p className="eyebrow mt-2">14 · II · MMXXVII</p>
      </footer>
    </main>
  );
}
