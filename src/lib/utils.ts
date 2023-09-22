import { RealtimePresenceState } from "@supabase/supabase-js";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTransformedPresenceState(
  presenceState: RealtimePresenceState
): Record<string, any> {
  const transformedState: Record<string, any> = {};

  for (const key in presenceState) {
    if (presenceState[key].length > 0) {
      transformedState[key] = presenceState[key][0];
    }
  }

  return transformedState;
}
