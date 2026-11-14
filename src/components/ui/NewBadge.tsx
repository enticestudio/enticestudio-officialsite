/** Small "New" tag for recently added demo designs. */
export function NewBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`eyebrow rounded-full bg-champagne px-3 py-1.5 text-[0.6rem] text-ink shadow-md ${className}`}>
      New
    </span>
  );
}
