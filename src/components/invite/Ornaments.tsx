export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 32" className={`mx-auto h-7 w-64 text-gold ${className}`} fill="none" stroke="currentColor" aria-hidden>
      <path d="M4 16h110M206 16h110" strokeWidth="0.8" />
      <path d="M114 16c10-10 22-10 30 0-8 10-20 10-30 0zM206 16c-10-10-22-10-30 0 8 10 20 10 30 0z" strokeWidth="0.9" />
      <circle cx="160" cy="16" r="6" strokeWidth="1" />
      <circle cx="160" cy="16" r="2" fill="currentColor" />
      <path d="M160 2v6M160 24v6M146 16h-4M174 16h4" strokeWidth="0.9" />
      <circle cx="98" cy="16" r="1.5" fill="currentColor" />
      <circle cx="222" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CornerPath() {
  return (
    <g fill="none" stroke="currentColor">
      <path d="M2 2h46M2 2v46" strokeWidth="1.2" />
      <path d="M8 8h28M8 8v28" strokeWidth="0.6" />
      <path d="M8 8c14 2 22 10 24 24M14 8c0 10 6 16 18 18" strokeWidth="0.8" />
      <path d="M32 32c6-2 10-6 10-12-6 0-10 4-10 12zM32 32c-2 6-6 10-12 10 0-6 4-10 12-10z" strokeWidth="0.8" />
      <circle cx="32" cy="32" r="2" fill="currentColor" />
      <circle cx="52" cy="2" r="1.4" fill="currentColor" />
      <circle cx="2" cy="52" r="1.4" fill="currentColor" />
    </g>
  );
}

export function Corners() {
  const pos = [
    "left-2 top-2",
    "right-2 top-2 -scale-x-100",
    "left-2 bottom-2 -scale-y-100",
    "right-2 bottom-2 -scale-100",
  ];
  return (
    <>
      {pos.map((p) => (
        <svg key={p} viewBox="0 0 56 56" className={`pointer-events-none absolute h-12 w-12 text-gold sm:h-16 sm:w-16 ${p}`} aria-hidden>
          <CornerPath />
        </svg>
      ))}
    </>
  );
}

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      <p className="eyebrow">{eyebrow}</p>
      <div className="mx-auto mt-4 flex max-w-md items-center gap-4">
        <span className="h-px flex-1 bg-gold/60" />
        <h2 className="font-display text-4xl font-medium italic text-accent sm:text-5xl">{title}</h2>
        <span className="h-px flex-1 bg-gold/60" />
      </div>
      <Divider className="mt-3" />
    </div>
  );
}
