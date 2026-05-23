import { Check } from "lucide-react";

import { FREQUENCY_DAYS, FREQUENCY_LABELS } from "@/context/subscriptions";
import type { SubscriptionFrequency } from "@/data/types";
import { cn } from "@/lib/utils";

const FREQUENCY_ORDER: SubscriptionFrequency[] = [
	"biweekly",
	"monthly",
	"bimonthly",
];

const FREQUENCY_BLURB: Record<SubscriptionFrequency, string> = {
	biweekly: "Pas untuk camilan dan kebutuhan yang cepat habis.",
	monthly: "Pilihan paling populer untuk makanan harian.",
	bimonthly: "Cocok untuk stok yang awet seperti suplemen.",
};

interface FrequencyCardsProps {
	value: SubscriptionFrequency;
	onChange: (next: SubscriptionFrequency) => void;
	/** Heading id used for the radiogroup aria-labelledby. */
	labelId?: string;
	className?: string;
}

/**
 * Selectable frequency cards (FR-34). Presented as a keyboard-accessible
 * radiogroup of buttons instead of a dropdown.
 */
export function FrequencyCards({
	value,
	onChange,
	labelId,
	className,
}: FrequencyCardsProps) {
	return (
		<div
			role="radiogroup"
			aria-labelledby={labelId}
			className={cn("grid gap-3 sm:grid-cols-3", className)}
		>
			{FREQUENCY_ORDER.map((freq) => {
				const selected = freq === value;
				return (
					// biome-ignore lint/a11y/useSemanticElements: rich selectable card needs custom markup, not a bare radio input
					<button
						key={freq}
						type="button"
						role="radio"
						aria-checked={selected}
						onClick={() => onChange(freq)}
						className={cn(
							"group relative flex min-h-[44px] flex-col gap-1.5 rounded-xl border p-4 text-left transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
							selected
								? "border-primary bg-primary/5 ring-1 ring-primary/30"
								: "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
						)}
					>
						<span className="flex items-center justify-between gap-2">
							<span className="font-display text-base font-semibold text-foreground">
								{FREQUENCY_LABELS[freq]}
							</span>
							<span
								className={cn(
									"flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
									selected
										? "border-primary bg-primary text-primary-foreground"
										: "border-input text-transparent",
								)}
								aria-hidden="true"
							>
								<Check className="size-3.5" />
							</span>
						</span>
						<span className="text-xs font-medium text-primary">
							Setiap {FREQUENCY_DAYS[freq]} hari
						</span>
						<span className="text-sm text-muted-foreground">
							{FREQUENCY_BLURB[freq]}
						</span>
					</button>
				);
			})}
		</div>
	);
}
