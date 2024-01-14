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

// "front end test" -> "front-end-test"
export function formatRepoName(name: string) {
  return name
    .trim() // Remove leading/trailing whitespace
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, ""); // Remove anything that is not a letter, number, or hyphen
}
