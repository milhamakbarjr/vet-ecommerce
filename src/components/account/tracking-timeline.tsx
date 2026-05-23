import { Check } from "lucide-react";

import type { Order, TrackingEvent } from "@/data/types";
import { formatDateID } from "@/lib/format";
import { cn } from "@/lib/utils";

function timeOfDay(iso: string): string {
	const d = new Date(iso);
	const hh = String(d.getHours()).padStart(2, "0");
	const mm = String(d.getMinutes()).padStart(2, "0");
	return `${hh}.${mm}`;
}

/** Index of the latest completed (done) stage, treated as "current". */
function currentIndex(timeline: TrackingEvent[]): number {
	let idx = -1;
	timeline.forEach((event, i) => {
		if (event.done) idx = i;
	});
	return idx;
}

export function TrackingTimeline({ order }: { order: Order }) {
	const { timeline } = order;
	const current = currentIndex(timeline);

	return (
		<ol className="flex flex-col">
			{timeline.map((event, index) => {
				const isCurrent = index === current;
				const isDone = event.done;
				const isLast = index === timeline.length - 1;

				return (
					<li key={`${event.status}-${event.timestamp}`} className="flex gap-4">
						<div className="flex flex-col items-center">
							<span
								className={cn(
									"flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
									isDone
										? "border-primary bg-primary text-primary-foreground"
										: "border-border bg-background text-muted-foreground",
									isCurrent && "ring-4 ring-primary/20",
								)}
							>
								{isDone ? (
									<Check className="size-4" aria-hidden="true" />
								) : (
									<span className="size-2 rounded-full bg-muted-foreground/40" />
								)}
							</span>
							{!isLast ? (
								<span
									className={cn(
										"w-0.5 flex-1",
										isDone ? "bg-primary" : "bg-border",
									)}
								/>
							) : null}
						</div>

						<div className={cn("pb-6", isLast && "pb-0")}>
							<p
								className={cn(
									"text-sm font-medium",
									isCurrent
										? "text-primary"
										: isDone
											? "text-foreground"
											: "text-muted-foreground",
								)}
							>
								{event.label}
								{isCurrent ? (
									<span className="ml-2 text-xs font-normal text-primary">
										Saat ini
									</span>
								) : null}
							</p>
							{isDone ? (
								<p className="mt-0.5 text-xs text-muted-foreground">
									{formatDateID(event.timestamp)}, {timeOfDay(event.timestamp)}{" "}
									WIB
								</p>
							) : (
								<p className="mt-0.5 text-xs text-muted-foreground">Menunggu</p>
							)}
						</div>
					</li>
				);
			})}
		</ol>
	);
}
