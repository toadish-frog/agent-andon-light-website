"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * True only after client-side hydration. Solves the same server/client
 * render-mismatch problem a `useState` + `useEffect("mounted")` flag would
 * (e.g. rendering next-themes' resolved theme), without tripping
 * react-hooks/set-state-in-effect's extra-render-pass warning.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
