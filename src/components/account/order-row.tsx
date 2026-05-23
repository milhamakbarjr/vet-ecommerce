import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { OrderStatusBadge } from "@/components/account/order-status-badge";
import type { Order } from "@/data/types";
import { formatDateID, formatIDR } from "@/lib/format";

export function OrderRow({ order }: { order: Order }) {
	const firstItem = order.items[0];
	const extraCount = order.items.length - 1;
	const totalUnits = order.items.reduce((sum, it) => sum + it.quantity, 0);

	return (
		<Link
			to="/account/orders/$orderId"
			params={{ orderId: order.id }}
			className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/50"
		>
			{firstItem?.image ? (
				<img
					src={firstItem.image}
					alt={firstItem.name}
					loading="lazy"
					className="size-16 shrink-0 rounded-lg object-cover"
				/>
			) : (
				<span className="size-16 shrink-0 rounded-lg bg-muted" />
			)}

			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap items-center gap-2">
					<span className="font-medium text-foreground">{order.id}</span>
					<OrderStatusBadge status={order.status} />
				</div>
				<p className="mt-0.5 text-sm text-muted-foreground">
					{formatDateID(order.createdAt)}
				</p>
				<p className="mt-1 truncate text-sm text-foreground">
					{firstItem?.name ?? "Pesanan"}
					{extraCount > 0 ? (
						<span className="text-muted-foreground">
							{" "}
							+{extraCount} item lainnya
						</span>
					) : null}
				</p>
			</div>

			<div className="hidden shrink-0 text-right sm:block">
				<p className="font-semibold text-foreground">
					{formatIDR(order.total)}
				</p>
				<p className="text-xs text-muted-foreground">{totalUnits} unit</p>
			</div>

			<ChevronRight
				className="size-5 shrink-0 text-muted-foreground"
				aria-hidden="true"
			/>
		</Link>
	);
}
