import Image from "next/image";

/** The Entice Studio wordmark (transparent PNG generated from the supplied logo). */
export function Wordmark({
  tone = "black",
  className = "",
  priority = false,
}: {
  tone?: "black" | "white";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/brand/wordmark-${tone}.png`}
      alt="Entice Studio"
      width={1264}
      height={527}
      priority={priority}
      className={`h-auto ${className}`}
    />
  );
}

export function Monogram({ tone = "black", className = "" }: { tone?: "black" | "white"; className?: string }) {
  return (
    <Image src={`/brand/monogram-${tone}.png`} alt="" width={518} height={604} className={`h-auto ${className}`} />
  );
}
