import type { ReactNode } from "react";
import { AlertTriangle, Info, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Icon-only label (no "Note"/"Warning" text) — deliberate, so these don't
 * need per-locale translation the way a text label would. Used directly in
 * MDX source as `<Note>...</Note>` / `<Warning>...</Warning>`; markdown
 * inside the tags still renders normally (bold, code, links), since this
 * only wraps it in a tinted box rather than opting out of `.prose`.
 */
function Callout({
  icon: Icon,
  className,
  children,
}: {
  icon: LucideIcon;
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "my-6 flex gap-3 rounded-lg border-l-4 p-4 text-sm [&_p]:my-0",
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0 space-y-2">{children}</div>
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <Callout
      icon={Info}
      className="border-sky-400 bg-sky-50 text-sky-950 dark:border-sky-500 dark:bg-sky-950/40 dark:text-sky-100"
    >
      {children}
    </Callout>
  );
}

export function Warning({ children }: { children: ReactNode }) {
  return (
    <Callout
      icon={AlertTriangle}
      className="border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-500 dark:bg-amber-950/40 dark:text-amber-100"
    >
      {children}
    </Callout>
  );
}
