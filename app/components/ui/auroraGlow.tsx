import { cn } from "@/lib/utils";

/**
 * Decorative hero background — soft blurred blobs in the product's own
 * status colors (green/yellow/red) instead of a generic purple/blue SaaS
 * gradient. Pure CSS (no JS), so `prefers-reduced-motion` is already
 * handled by the global rule in global.css that zeroes animation durations.
 */
export function AuroraGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div
        className="animate-aurora-drift absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-status-working/25 blur-3xl"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="animate-aurora-drift absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-status-waiting/20 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="animate-aurora-drift absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-status-idle/15 blur-3xl"
        style={{ animationDelay: "-12s" }}
      />
    </div>
  );
}
