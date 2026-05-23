import { Badge } from "@/components/ui/badge";
import { statusLabel } from "@/data/mock-user";
import type { OrderStatus } from "@/data/types";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

const STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
	payment_pending: "outline",
	processing: "secondary",
	packed: "secondary",
	in_transit: "default",
	delivered: "default",
	cancelled: "destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
	return <Badge variant={STATUS_VARIANT[status]}>{statusLabel(status)}</Badge>;
}
