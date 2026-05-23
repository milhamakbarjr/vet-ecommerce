import { courierMaxDays } from "@/data/couriers";
import { getProductById } from "@/data/products";
import type {
	Address,
	Order,
	OrderItem,
	OrderStatus,
	TrackingEvent,
	User,
} from "@/data/types";

export const DEMO_EMAIL = "demo@petsehat.id";

export const demoAddress: Address = {
	id: "addr-demo-1",
	label: "home",
	recipient: "Sari Wijaya",
	phone: "081234567890",
	street: "Jl. Kemang Raya No. 27, RT 04 RW 02",
	kelurahan: "Bangka",
	kecamatan: "Mampang Prapatan",
	city: "Jakarta Selatan",
	province: "DKI Jakarta",
	postalCode: "12730",
	isDefault: true,
};

export const demoUser: User = {
	id: "user-demo",
	name: "Sari Wijaya",
	email: DEMO_EMAIL,
	phone: "081234567890",
	addresses: [demoAddress],
};

const STATUS_LABELS: Record<OrderStatus, string> = {
	payment_pending: "Menunggu Pembayaran",
	processing: "Sedang Diproses",
	packed: "Dikemas",
	in_transit: "Dalam Pengiriman",
	delivered: "Terkirim",
	cancelled: "Dibatalkan",
};

export function statusLabel(status: OrderStatus): string {
	return STATUS_LABELS[status];
}

const TIMELINE_STAGES: {
	status: OrderStatus;
	label: string;
	offsetHours: number;
}[] = [
	{ status: "payment_pending", label: "Pesanan dibuat", offsetHours: 0 },
	{
		status: "processing",
		label: "Pembayaran diterima, pesanan diproses",
		offsetHours: 2,
	},
	{ status: "packed", label: "Pesanan dikemas", offsetHours: 6 },
	{ status: "in_transit", label: "Pesanan dalam pengiriman", offsetHours: 24 },
	{ status: "delivered", label: "Pesanan tiba di tujuan", offsetHours: 48 },
];

const STATUS_ORDER: OrderStatus[] = [
	"payment_pending",
	"processing",
	"packed",
	"in_transit",
	"delivered",
];

/** Build a tracking timeline from a createdAt date and the order's current status. */
export function buildTimeline(
	createdAtISO: string,
	currentStatus: OrderStatus,
): TrackingEvent[] {
	if (currentStatus === "cancelled") {
		const base = new Date(createdAtISO);
		return [
			{
				status: "payment_pending",
				label: "Pesanan dibuat",
				timestamp: base.toISOString(),
				done: true,
			},
			{
				status: "cancelled",
				label: "Pesanan dibatalkan",
				timestamp: new Date(base.getTime() + 60 * 60 * 1000).toISOString(),
				done: true,
			},
		];
	}

	const currentIndex = STATUS_ORDER.indexOf(currentStatus);
	const base = new Date(createdAtISO);
	return TIMELINE_STAGES.map((stage, index) => ({
		status: stage.status,
		label: stage.label,
		timestamp: new Date(
			base.getTime() + stage.offsetHours * 60 * 60 * 1000,
		).toISOString(),
		done: index <= currentIndex,
	}));
}

function buildItem(productId: string, quantity: number): OrderItem {
	const product = getProductById(productId);
	return {
		productId,
		name: product?.name ?? productId,
		image: product?.images[0] ?? "",
		price: product?.price ?? 0,
		quantity,
	};
}

interface SeedOrderSpec {
	id: string;
	daysAgo: number;
	status: OrderStatus;
	courierId: string;
	paymentMethodId: string;
	items: { productId: string; quantity: number }[];
	discount: number;
}

const SEED_SPECS: SeedOrderSpec[] = [
	{
		id: "PS-20260510-48211",
		daysAgo: 13,
		status: "delivered",
		courierId: "jne",
		paymentMethodId: "gopay",
		items: [
			{ productId: "p-004", quantity: 1 },
			{ productId: "p-013", quantity: 2 },
		],
		discount: 0,
	},
	{
		id: "PS-20260518-15093",
		daysAgo: 5,
		status: "delivered",
		courierId: "sicepat",
		paymentMethodId: "ovo",
		items: [{ productId: "p-031", quantity: 1 }],
		discount: 5000,
	},
	{
		id: "PS-20260521-72640",
		daysAgo: 2,
		status: "in_transit",
		courierId: "jnt",
		paymentMethodId: "va",
		items: [
			{ productId: "p-001", quantity: 1 },
			{ productId: "p-036", quantity: 1 },
		],
		discount: 0,
	},
	{
		id: "PS-20260522-30817",
		daysAgo: 1,
		status: "processing",
		courierId: "sicepat",
		paymentMethodId: "qris",
		items: [{ productId: "p-046", quantity: 1 }],
		discount: 0,
	},
	{
		id: "PS-20260415-90122",
		daysAgo: 38,
		status: "cancelled",
		courierId: "jne",
		paymentMethodId: "dana",
		items: [{ productId: "p-056", quantity: 1 }],
		discount: 0,
	},
];

/** Returns 3-5 seeded past orders for the demo account in reverse chronological order. */
export function seedOrders(): Order[] {
	const now = Date.now();
	const orders = SEED_SPECS.map((spec) => {
		const createdAt = new Date(
			now - spec.daysAgo * 24 * 60 * 60 * 1000,
		).toISOString();
		const items = spec.items.map((i) => buildItem(i.productId, i.quantity));
		const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
		const deliveryFee = courierFeeFallback(spec.courierId);
		const total = Math.max(0, subtotal + deliveryFee - spec.discount);
		const order: Order = {
			id: spec.id,
			createdAt,
			items,
			address: demoAddress,
			courierId: spec.courierId,
			paymentMethodId: spec.paymentMethodId,
			subtotal,
			deliveryFee,
			discount: spec.discount,
			total,
			status: spec.status,
			trackingNumber: `${spec.courierId.toUpperCase()}${spec.id.replace(/\D/g, "").slice(-10)}`,
			timeline: buildTimeline(createdAt, spec.status),
		};
		return order;
	});
	return orders.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

const COURIER_FEES: Record<string, number> = {
	jne: 18000,
	jnt: 16000,
	sicepat: 15000,
};
function courierFeeFallback(courierId: string): number {
	return COURIER_FEES[courierId] ?? 15000;
}

/** Estimated delivery date string from order date plus courier max days. */
export function estimatedDeliveryDate(
	createdAtISO: string,
	courierId: string,
): string {
	const base = new Date(createdAtISO);
	base.setDate(base.getDate() + courierMaxDays(courierId));
	return base.toISOString();
}
