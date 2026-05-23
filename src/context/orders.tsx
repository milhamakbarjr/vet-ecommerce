import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { buildTimeline, seedOrders } from "@/data/mock-user";
import type { Address, Order, OrderItem } from "@/data/types";
import { track } from "@/lib/analytics";
import { orderNumber, trackingNumber } from "@/lib/ids";
import { STORAGE_KEYS, safeGet, safeSet } from "@/lib/storage";

export interface PlaceOrderInput {
	items: OrderItem[];
	address: Address;
	courierId: string;
	paymentMethodId: string;
	subtotal: number;
	deliveryFee: number;
	discount: number;
	total: number;
}

interface OrdersValue {
	orders: Order[];
	getOrder: (id: string) => Order | undefined;
	placeOrder: (input: PlaceOrderInput) => Order;
}

const OrdersContext = createContext<OrdersValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
	const [orders, setOrders] = useState<Order[]>([]);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		// Seed once when storage is empty.
		const existing = safeGet<Order[] | null>(STORAGE_KEYS.orders, null);
		if (existing && existing.length > 0) {
			setOrders(existing);
		} else {
			const seeded = seedOrders();
			setOrders(seeded);
			safeSet(STORAGE_KEYS.orders, seeded);
		}
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated) safeSet(STORAGE_KEYS.orders, orders);
	}, [orders, hydrated]);

	const placeOrder = useCallback((input: PlaceOrderInput): Order => {
		const now = new Date();
		const createdAt = now.toISOString();
		const order: Order = {
			id: orderNumber(now),
			createdAt,
			items: input.items,
			address: input.address,
			courierId: input.courierId,
			paymentMethodId: input.paymentMethodId,
			subtotal: input.subtotal,
			deliveryFee: input.deliveryFee,
			discount: input.discount,
			total: input.total,
			status: "processing",
			trackingNumber: trackingNumber(input.courierId),
			timeline: buildTimeline(createdAt, "processing"),
		};
		setOrders((prev) => [order, ...prev]);
		track("order_completed", { orderId: order.id, total: order.total });
		return order;
	}, []);

	const getOrder = useCallback(
		(id: string) => orders.find((o) => o.id === id),
		[orders],
	);

	const value = useMemo<OrdersValue>(
		() => ({ orders, getOrder, placeOrder }),
		[orders, getOrder, placeOrder],
	);

	return (
		<OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
	);
}

export function useOrders(): OrdersValue {
	const ctx = useContext(OrdersContext);
	if (!ctx)
		throw new Error(
			"useOrders must be used within <OrdersProvider> (see <AppProviders>).",
		);
	return ctx;
}
