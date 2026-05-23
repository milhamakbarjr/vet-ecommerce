import type { ReactNode } from "react";

import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
	subtotal: number;
	deliveryFee: number;
	discount: number;
	total: number;
	/** Promo label shown next to the discount row, e.g. "Diskon 10%". */
	promoLabel?: string | null;
	/** True until a courier is chosen, so we can render "Dihitung saat pengiriman". */
	deliveryPending?: boolean;
	/** Optional content rendered below the totals, e.g. the primary CTA. */
	footer?: ReactNode;
	className?: string;
}

function Row({
	label,
	value,
	emphasis,
	muted,
}: {
	label: ReactNode;
	value: ReactNode;
	emphasis?: boolean;
	muted?: boolean;
}) {
	return (
		<div
			className={cn(
				"flex items-baseline justify-between gap-4",
				emphasis ? "text-base" : "text-sm",
			)}
		>
			<span className={muted ? "text-muted-foreground" : "text-foreground"}>
				{label}
			</span>
			<span
				className={cn(
					"tabular-nums",
					emphasis
						? "font-bold text-foreground"
						: "font-medium text-foreground",
				)}
			>
				{value}
			</span>
		</div>
	);
}

export function OrderSummary({
	subtotal,
	deliveryFee,
	discount,
	total,
	promoLabel,
	deliveryPending,
	footer,
	className,
}: OrderSummaryProps) {
	return (
		<div
			className={cn(
				"rounded-xl border border-border bg-card p-5 ring-1 ring-foreground/5",
				className,
			)}
		>
			<h2 className="font-display text-lg font-semibold text-foreground">
				Ringkasan belanja
			</h2>
			<div className="mt-4 flex flex-col gap-2.5">
				<Row label="Subtotal" value={formatIDR(subtotal)} muted />
				<Row
					label="Ongkos kirim"
					muted
					value={
						deliveryPending ? (
							<span className="text-muted-foreground">
								Dihitung saat pengiriman
							</span>
						) : (
							formatIDR(deliveryFee)
						)
					}
				/>
				{discount > 0 ? (
					<Row
						label={
							<span className="text-primary">
								Diskon{promoLabel ? ` (${promoLabel})` : ""}
							</span>
						}
						value={
							<span className="text-primary">{`- ${formatIDR(discount)}`}</span>
						}
					/>
				) : null}
				<div className="my-1 h-px bg-border" />
				<Row label="Total" value={formatIDR(total)} emphasis />
			</div>
			{footer ? <div className="mt-5">{footer}</div> : null}
		</div>
	);
}
