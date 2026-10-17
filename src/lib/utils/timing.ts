/**
 * Canonical Demo Join Window Helper
 * Product Rule:
 * - Waiting room may be viewed before the demo.
 * - Enter Demo Room becomes available exactly 10 minutes before scheduled_start_at.
 * - Demo room remains enterable through scheduled_end_at.
 * - Before that window: canJoin is false (reason: 'too_early').
 * - After scheduled_end_at: canJoin is false (reason: 'expired').
 * - Malformed, missing, or non-forward timing (end <= start): canJoin is false (reason: 'invalid_timing').
 * - Fail closed invariant: Never default to start + 30m inside authorization.
 */
export interface DemoJoinWindowEvaluation {
  canJoin: boolean;
  reason?: "too_early" | "expired" | "invalid_timing";
  minutesUntilStart: number;
  minutesUntilEnd: number;
}

export function evaluateDemoJoinWindow(
  scheduledStartAt: string | Date | null | undefined,
  scheduledEndAt?: string | Date | null,
  currentDate: Date = new Date()
): DemoJoinWindowEvaluation {
  if (!scheduledStartAt || !scheduledEndAt) {
    return {
      canJoin: false,
      reason: "invalid_timing",
      minutesUntilStart: 0,
      minutesUntilEnd: 0,
    };
  }

  const startMs = new Date(scheduledStartAt).getTime();
  const endMs = new Date(scheduledEndAt).getTime();

  if (isNaN(startMs) || isNaN(endMs) || endMs <= startMs) {
    return {
      canJoin: false,
      reason: "invalid_timing",
      minutesUntilStart: 0,
      minutesUntilEnd: 0,
    };
  }

  const nowMs = currentDate.getTime();

  // Exactly 10 minutes prior to scheduled start
  const earlyWindowMs = 10 * 60 * 1000;
  const earliestJoinMs = startMs - earlyWindowMs;

  const minutesUntilStart = Math.round((startMs - nowMs) / 60000);
  const minutesUntilEnd = Math.round((endMs - nowMs) / 60000);

  if (nowMs < earliestJoinMs) {
    return {
      canJoin: false,
      reason: "too_early",
      minutesUntilStart,
      minutesUntilEnd,
    };
  }

  if (nowMs > endMs) {
    return {
      canJoin: false,
      reason: "expired",
      minutesUntilStart,
      minutesUntilEnd,
    };
  }

  return {
    canJoin: true,
    minutesUntilStart,
    minutesUntilEnd,
  };
}