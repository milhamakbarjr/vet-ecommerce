import {
	createFileRoute,
	Link,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { ArrowLeft, PackageX, RotateCcw, Truck } from "lucide-react";
import { toast } from "sonner";

import { AuthGate } from "@/components/account/auth-gate";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { TrackingTimeline } from "@/components/account/tracking-timeline";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/cart";
import { useOrders } from "@/context/orders";
import { getCourier } from "@/data/couriers";
import { estimatedDeliveryDate } from "@/data/mock-user";
import { getPaymentMethod } from "@/data/payments";
import type { Order } from "@/data/types";
import { formatDateID, formatIDR } from "@/lib/format";

export const Route = createFileRoute("/account/orders/$orderId")({
	component: OrderDetailPage,
});

function OrderNotFound() {
	return (
		<div className="py-8">
			<EmptyState
				icon={PackageX}
				title="Pesanan tidak ditemukan"
				description="Pesanan yang kamu cari mungkin sudah dihapus atau tautannya keliru."
				action={
					<Button render={<Link to="/account/orders" />}>
						<ArrowLeft className="size-4" />
						Kembali ke daftar pesanan
					</Button>
				}
			/>
		</div>
	);
}

function SummaryRow({
	label,
	value,
	emphasize,
}: {
	label: string;
	value: string;
	emphasize?: boolean;
}) {
	return (
		<div className="flex items-center justify-between gap-4 text-sm">
			<span
				className={
					emphasize ? "font-medium text-foreground" : "text-muted-foreground"
				}
			>
				{label}
			</span>
			<span
				className={
					emphasize
						? "font-display text-lg font-semibold text-foreground"
						: "text-foreground"
				}
			>
				{value}
			</span>
		</div>
	);
}

function OrderDetail({ order }: { order: Order }) {
	const { addItem } = useCart();
	const navigate = useNavigate();

	const courier = getCourier(order.courierId);
	const payment = getPaymentMethod(order.paymentMethodId);
	const isCancelled = order.status === "cancelled";
	const eta = estimatedDeliveryDate(order.createdAt, order.courierId);

	const buyAgain = () => {
		for (const item of order.items) {
			addItem(item.productId, item.quantity);
		}
		toast.success("Semua item ditambahkan ke keranjang.", {
			action: {
				label: "Lihat keranjang",
				onClick: () => navigate({ to: "/cart" }),
			},
		});
	};

	return (
		<div className="py-8">
			<Link
				to="/account/orders"
				className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="size-4" />
				Kembali ke pesanan
			</Link>

			<header className="mb-6 flex flex-wrap items-start justify-between gap-4">
				<div>
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
							{order.id}
						</h1>
						<OrderStatusBadge status={order.status} />
					</div>
					<p className="mt-1 text-sm text-muted-foreground">
						Dipesan {formatDateID(order.createdAt)}
					</p>
				</div>
				<Button size="lg" onClick={buyAgain}>
					<RotateCcw className="size-4" />
					Beli Lagi
				</Button>
			</header>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="flex flex-col gap-6 lg:col-span-2">
					<section className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 md:p-6">
						<h2 className="mb-4 font-display text-lg font-semibold text-foreground">
							Item pesanan
						</h2>
						<ul className="flex flex-col gap-4">
							{order.items.map((item) => (
								<li key={item.productId} className="flex items-center gap-4">
									{item.image ? (
										<img
											src={item.image}
											alt={item.name}
											loading="lazy"
											className="size-16 shrink-0 rounded-lg object-cover"
										/>
									) : (
										<span className="size-16 shrink-0 rounded-lg bg-muted" />
									)}
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-foreground">
											{item.name}
										</p>
										<p className="text-sm text-muted-foreground">
											{formatIDR(item.price)} × {item.quantity}
										</p>
									</div>
									<p className="shrink-0 text-sm font-medium text-foreground">
										{formatIDR(item.price * item.quantity)}
									</p>
								</li>
							))}
						</ul>
					</section>

					<section className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 md:p-6">
						<h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
							<Truck className="size-5 text-primary" aria-hidden="true" />
							Pelacakan pesanan
						</h2>
						{isCancelled ? (
							<p className="mb-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
								Pesanan ini dibatalkan.
							</p>
						) : (
							<p className="mb-4 text-sm text-muted-foreground">
								Nomor resi{" "}
								<span className="font-medium text-foreground">
									{order.trackingNumber}
								</span>
							</p>
						)}
						<TrackingTimeline order={order} />
					</section>
				</div>

				<div className="flex flex-col gap-6">
					<section className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 md:p-6">
						<h2 className="mb-3 font-display text-lg font-semibold text-foreground">
							Alamat pengiriman
						</h2>
						<div className="text-sm text-muted-foreground">
							<p className="font-medium text-foreground">
								{order.address.recipient}
							</p>
							<p>{order.address.phone}</p>
							<p className="mt-1">
								{order.address.street}, {order.address.kelurahan},{" "}
								{order.address.kecamatan}, {order.address.city},{" "}
								{order.address.province} {order.address.postalCode}
							</p>
						</div>
					</section>

					<section className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 md:p-6">
						<h2 className="mb-3 font-display text-lg font-semibold text-foreground">
							Pengiriman dan pembayaran
						</h2>
						<dl className="flex flex-col gap-3 text-sm">
							<div>
								<dt className="text-xs text-muted-foreground">Kurir</dt>
								<dd className="text-foreground">
									{courier?.name ?? order.courierId}
									{courier ? ` (${courier.etaDays})` : ""}
								</dd>
							</div>
							{!isCancelled ? (
								<div>
									<dt className="text-xs text-muted-foreground">
										Estimasi tiba
									</dt>
									<dd className="text-foreground">{formatDateID(eta)}</dd>
								</div>
							) : null}
							<div>
								<dt className="text-xs text-muted-foreground">
									Metode pembayaran
								</dt>
								<dd className="text-foreground">
									{payment?.name ?? order.paymentMethodId}
								</dd>
							</div>
						</dl>
					</section>

					<section className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 md:p-6">
						<h2 className="mb-4 font-display text-lg font-semibold text-foreground">
							Ringkasan pembayaran
						</h2>
						<div className="flex flex-col gap-2.5">
							<SummaryRow label="Subtotal" value={formatIDR(order.subtotal)} />
							<SummaryRow
								label="Ongkos kirim"
								value={formatIDR(order.deliveryFee)}
							/>
							{order.discount > 0 ? (
								<div className="flex items-center justify-between gap-4 text-sm">
									<span className="text-muted-foreground">Diskon</span>
									<span className="text-primary">
										-{formatIDR(order.discount)}
									</span>
								</div>
							) : null}
							<Separator className="my-1" />
							<SummaryRow
								label="Total"
								value={formatIDR(order.total)}
								emphasize
							/>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

function OrderDetailInner() {
	const { orderId } = useParams({ from: "/account/orders/$orderId" });
	const { getOrder } = useOrders();
	const order = getOrder(orderId);

	if (!order) return <OrderNotFound />;
	return <OrderDetail order={order} />;
}

function OrderDetailPage() {
	return (
		<AuthGate
			title="Masuk untuk melihat detail pesanan"
			description="Detail pesanan tersimpan di akunmu. Masuk dulu untuk melihatnya."
		>
			<OrderDetailInner />
		</AuthGate>
	);
}
