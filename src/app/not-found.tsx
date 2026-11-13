import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-ivory px-6 text-center">
      <span className="size-4 rounded-full bg-ink" />
      <h1 className="font-display text-6xl">
        Lost the <span className="font-accent italic">invitation?</span>
      </h1>
      <p className="max-w-sm text-ink-soft">This page doesn&apos;t exist — but your event page could.</p>
      <Button href="/">Back to the studio</Button>
    </main>
  );
}
