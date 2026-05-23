import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Real client-side countdown. Counts down from `seconds` once mounted (SSR-safe:
 * the interval only runs in an effect). Calls `onExpire` once when it hits zero.
 * Bump `resetKey` to restart the timer at the full duration (used by Retry).
 */
export function useCountdown(seconds: number, resetKey: number) {
	const [remaining, setRemaining] = useState(seconds);
	const expiredRef = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: resetKey is a trigger to restart the countdown
	useEffect(() => {
		setRemaining(seconds);
		expiredRef.current = false;
	}, [seconds, resetKey]);

	useEffect(() => {
		const id = setInterval(() => {
			setRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
		}, 1000);
		return () => clearInterval(id);
	}, []);

	const expired = remaining <= 0;
	return { remaining, expired };
}

function pad(n: number): string {
	return String(n).padStart(2, "0");
}

export function formatClock(totalSeconds: number): string {
	const m = Math.floor(totalSeconds / 60);
	const s = totalSeconds % 60;
	return `${pad(m)}:${pad(s)}`;
}

interface CountdownDisplayProps {
	remaining: number;
	className?: string;
}

/** Visual MM:SS display. Turns warm-red as time runs low. */
export function CountdownDisplay({
	remaining,
	className,
}: CountdownDisplayProps) {
	const urgent = remaining > 0 && remaining <= 60;
	return (
		<div
			className={cn(
				"inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5",
				className,
			)}
		>
			<span className="text-xs font-medium text-secondary-foreground/80">
				Selesaikan dalam
			</span>
			<span
				className={cn(
					"font-display text-lg font-bold tabular-nums tracking-tight",
					urgent ? "text-destructive" : "text-foreground",
				)}
				aria-live="polite"
			>
				{formatClock(remaining)}
			</span>
		</div>
	);
}
