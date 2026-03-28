import type { FailoverReason } from "./pi-embedded-helpers.js";

export function shouldAllowCooldownProbeForReason(
  reason: FailoverReason | null | undefined,
): boolean {
  return (
    reason === "rate_limit" ||
    reason === "overloaded" ||
    reason === "billing" ||
    reason === "unknown"
  );
}

export function shouldUseTransientCooldownProbeSlot(
  reason: FailoverReason | null | undefined,
): boolean {
  return reason === "rate_limit" || reason === "overloaded" || reason === "unknown";
}

export function shouldPreserveTransientCooldownProbeSlot(
  reason: FailoverReason | null | undefined,
): boolean {
  return (
    reason === "model_not_found" ||
    reason === "format" ||
    reason === "auth" ||
    reason === "auth_permanent" ||
    reason === "session_expired" ||
    // Rate limits are often per-model (e.g. weekly quota exhaustion),
    // not per-provider. Allow fallback models on the same provider
    // to probe independently instead of being skipped.
    reason === "rate_limit"
  );
}
