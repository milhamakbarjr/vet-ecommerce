import { Link } from "@tanstack/react-router";
import { CalendarClock, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSubscriptions } from "@/context/subscriptions";
import { formatDateID } from "@/lib/format";
import { cn } from "@/lib/utils";

interface UpcomingDeliveryWidgetProps {
	className?: string;
}

/**
 * Self-contained "Pengiriman Berikutnya" widget (FR-36). Reads the soonest
 * active, non-paused subscription from useSubscriptions.upcoming and renders a
 * reminder card with a CTA to the management page. Renders nothing when there
 * is no upcoming delivery, so it is safe to mount anywhere (e.g. the home page).
 *
 * SSR note: subscription state hydrates from localStorage on mount, so we wait
 * for a mounted flag before rendering to avoid a hydration mismatch.
 */
export function UpcomingDeliveryWidget({
	className,
}: UpcomingDeliveryWidgetProps) {
	const { upcoming } = useSubscriptions();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted || !upcoming) return null;

	return (
		<section
			aria-label="Pengiriman langganan berikutnya"
			className={cn(
				"flex flex-col gap-4 rounded-2xl border border-primary/20 bg-secondary/40 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5",
				className,
			)}
		>
			<div className="flex items-center gap-4">
				<span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<CalendarClock className="size-6" aria-hidden="true" />
				</span>
				<div className="min-w-0">
					<p className="text-xs font-semibold uppercase tracking-wide text-primary">
						Pengiriman berikutnya
					</p>
					<p className="truncate font-display text-base font-semibold text-foreground">
						{upcoming.productName}
					</p>
					<p className="text-sm text-muted-foreground">
						{upcoming.quantity} item, tiba{" "}
						{formatDateID(upcoming.nextDeliveryDate)}
					</p>
				</div>
			</div>
			<Button
				variant="outline"
				size="lg"
				className="shrink-0 self-start sm:self-auto"
				render={<Link to="/account/subscriptions" />}
			>
				Kelola langganan
				<ChevronRight className="size-4" />
			</Button>
		</section>
	);
}
