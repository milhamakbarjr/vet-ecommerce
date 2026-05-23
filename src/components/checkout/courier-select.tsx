import { Check, Clock, Truck } from "lucide-react";

import { Price } from "@/components/product/price";
import { couriers } from "@/data/couriers";
import { cn } from "@/lib/utils";

interface CourierSelectProps {
	selectedId: string | null;
	onSelect: (id: string) => void;
}

export function CourierSelect({ selectedId, onSelect }: CourierSelectProps) {
	return (
		<div className="flex flex-col gap-3">
			{couriers.map((courier) => {
				const active = courier.id === selectedId;
				return (
					<button
						key={courier.id}
						type="button"
						onClick={() => onSelect(courier.id)}
						aria-pressed={active}
						className={cn(
							"flex min-h-[64px] items-center gap-3 rounded-xl border bg-card p-4 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
							active
								? "border-primary ring-1 ring-primary"
								: "border-border hover:border-primary/40 hover:bg-muted/50",
						)}
					>
						<span
							className={cn(
								"flex size-11 shrink-0 items-center justify-center rounded-lg",
								active
									? "bg-primary text-primary-foreground"
									: "bg-secondary text-primary",
							)}
						>
							<Truck className="size-5" aria-hidden="true" />
						</span>
						<span className="min-w-0 flex-1">
							<span className="block font-semibold text-foreground">
								{courier.name}
							</span>
							<span className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
								<Clock className="size-3.5" aria-hidden="true" />
								Estimasi tiba {courier.etaDays}
							</span>
						</span>
						<span className="flex shrink-0 items-center gap-3">
							<Price value={courier.fee} size="md" />
							<span
								className={cn(
									"flex size-6 items-center justify-center rounded-full border transition-colors",
									active
										? "border-primary bg-primary text-primary-foreground"
										: "border-border",
								)}
								aria-hidden="true"
							>
								{active ? <Check className="size-3.5" /> : null}
							</span>
						</span>
					</button>
				);
			})}
		</div>
	);
}
