import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export const CHECKOUT_STEPS = [
	{ key: "address", label: "Alamat" },
	{ key: "shipping", label: "Pengiriman" },
	{ key: "payment", label: "Pembayaran" },
	{ key: "review", label: "Ringkasan" },
] as const;

export type CheckoutStepKey = (typeof CHECKOUT_STEPS)[number]["key"];

interface CheckoutStepsProps {
	/** Index of the step currently shown (0-based). */
	current: number;
	/** Jump back to a completed step. Disabled for steps ahead of current. */
	onJump?: (index: number) => void;
}

export function CheckoutSteps({ current, onJump }: CheckoutStepsProps) {
	return (
		<ol className="flex items-center gap-1.5 sm:gap-2">
			{CHECKOUT_STEPS.map((step, index) => {
				const done = index < current;
				const active = index === current;
				const reachable = index <= current && onJump;
				return (
					<li
						key={step.key}
						className="flex flex-1 items-center gap-1.5 sm:gap-2"
					>
						<button
							type="button"
							disabled={!reachable}
							onClick={reachable ? () => onJump(index) : undefined}
							className={cn(
								"flex min-w-0 items-center gap-2 rounded-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
								reachable && "cursor-pointer",
							)}
							aria-current={active ? "step" : undefined}
						>
							<span
								className={cn(
									"flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors sm:size-8 sm:text-sm",
									done && "bg-primary text-primary-foreground",
									active &&
										"bg-primary text-primary-foreground ring-4 ring-primary/20",
									!done &&
										!active &&
										"bg-secondary text-secondary-foreground/70",
								)}
							>
								{done ? (
									<Check className="size-4" aria-hidden="true" />
								) : (
									index + 1
								)}
							</span>
							<span
								className={cn(
									"hidden truncate text-sm font-medium sm:inline",
									active ? "text-foreground" : "text-muted-foreground",
								)}
							>
								{step.label}
							</span>
						</button>
						{index < CHECKOUT_STEPS.length - 1 ? (
							<span
								className={cn(
									"h-0.5 flex-1 rounded-full transition-colors",
									done ? "bg-primary" : "bg-border",
								)}
								aria-hidden="true"
							/>
						) : null}
					</li>
				);
			})}
		</ol>
	);
}
