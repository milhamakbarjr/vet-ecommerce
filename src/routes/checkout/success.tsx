import { createFileRoute, Link } from "@tanstack/react-router";
import {
	CalendarCheck,
	CheckCircle2,
	Home,
	PackageSearch,
	Repeat,
	X,
} from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/context/orders";
import { courierMaxDays } from "@/data/couriers";
import { getPaymentMethod } from "@/data/payments";
import { formatDateID, formatIDR } from "@/lib/format";

export const Route = createFileRoute("/checkout/success")({
	validateSearch: (search: Record<string, unknown>): { order?: string } => ({
		order: typeof search.order === "string" ? search.order : undefined,
	}),
	component: SuccessPage,
});

function estimatedDelivery(createdAt: string, courierId: string): string {
	const base = new Date(createdAt);
	base.setDate(base.getDate() + courierMaxDays(courierId));
	return formatDateID(base.toISOString());
}

function SuccessPage() {
	const { order: orderId } = Route.useSearch();
	const { getOrder } = useOrders();
	const [upsellDismissed, setUpsellDismissed] = useState(false);

	const order = orderId ? getOrder(orderId) : undefined;

	if (!order) {
		return (
			<div className="py-10">
				<EmptyState
					icon={PackageSearch}
					title="Pesanan tidak ditemukan"
					description="Kami tidak menemukan detail pesanan ini. Coba buka kembali dari daftar pesananmu."
					action={
						<div className="flex flex-wrap justify-center gap-3">
							<Button
								size="lg"
								className="h-11"
								render={<Link to="/account/orders" />}
							>
								Lihat pesanan saya
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="h-11"
								render={<Link to="/" />}
							>
								Kembali ke beranda
							</Button>
						</div>
					}
				/>
			</div>
		);
	}

	const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
	const paymentName = getPaymentMethod(order.paymentMethodId)?.name ?? "";

	return (
		<div className="mx-auto max-w-2xl py-10">
			<div className="flex flex-col items-center text-center">
				<span className="flex size-20 animate-in zoom-in-50 items-center justify-center rounded-full bg-primary/10 text-primary duration-500">
					<CheckCircle2 className="size-12" aria-hidden="true" />
				</span>
				<h1 className="mt-5 font-display text-3xl font-bold text-foreground sm:text-4xl">
					Terima kasih, pesananmu sudah kami terima
				</h1>
				<p className="mt-2 max-w-md text-muted-foreground">
					Pembayaran lewat {paymentName} berhasil. Kami akan segera menyiapkan
					pesananmu dengan penuh perhatian.
				</p>
			</div>

			<div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
				<div className="rounded-xl border border-border bg-card p-4">
					<p className="text-xs text-muted-foreground">Nomor pesanan</p>
					<p className="mt-1 font-display text-lg font-bold tracking-tight text-foreground">
						{order.id}
					</p>
				</div>
				<div className="rounded-xl border border-border bg-card p-4">
					<p className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<CalendarCheck className="size-3.5" aria-hidden="true" />
						Estimasi tiba
					</p>
					<p className="mt-1 font-display text-lg font-bold tracking-tight text-foreground">
						{estimatedDelivery(order.createdAt, order.courierId)}
					</p>
				</div>
			</div>

			<div className="mt-4 rounded-xl border border-border bg-card p-5">
				<div className="flex items-center justify-between gap-3">
					<h2 className="font-display text-lg font-semibold text-foreground">
						Ringkasan pesanan
					</h2>
					<span className="text-sm text-muted-foreground">
						{itemCount} item
					</span>
				</div>
				<ul className="mt-4 flex flex-col gap-3">
					{order.items.map((item) => (
						<li key={item.productId} className="flex gap-3">
							<img
								src={item.image}
								alt={item.name}
								className="size-14 shrink-0 rounded-lg object-cover"
								loading="lazy"
							/>
							<div className="min-w-0 flex-1">
								<p className="line-clamp-1 text-sm font-medium text-foreground">
									{item.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{item.quantity} x {formatIDR(item.price)}
								</p>
							</div>
							<span className="text-sm font-semibold tabular-nums text-foreground">
								{formatIDR(item.price * item.quantity)}
							</span>
						</li>
					))}
				</ul>
				<div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
					<div className="flex justify-between text-muted-foreground">
						<span>Subtotal</span>
						<span className="tabular-nums">{formatIDR(order.subtotal)}</span>
					</div>
					<div className="flex justify-between text-muted-foreground">
						<span>Ongkos kirim</span>
						<span className="tabular-nums">{formatIDR(order.deliveryFee)}</span>
					</div>
					{order.discount > 0 ? (
						<div className="flex justify-between text-primary">
							<span>Diskon</span>
							<span className="tabular-nums">{`- ${formatIDR(order.discount)}`}</span>
						</div>
					) : null}
					<div className="flex justify-between pt-1 text-base font-bold text-foreground">
						<span>Total dibayar</span>
						<span className="tabular-nums">{formatIDR(order.total)}</span>
					</div>
				</div>
			</div>

			<div className="mt-6 flex flex-col gap-3 sm:flex-row">
				<Button
					size="lg"
					className="h-12 flex-1 text-base"
					render={
						<Link
							to="/account/orders/$orderId"
							params={{ orderId: order.id }}
						/>
					}
				>
					<PackageSearch className="size-5" />
					Lacak Pesanan
				</Button>
				<Button
					variant="outline"
					size="lg"
					className="h-12 flex-1 text-base"
					render={<Link to="/" />}
				>
					<Home className="size-5" />
					Lanjut Belanja
				</Button>
			</div>

			{!upsellDismissed ? (
				<div className="mt-8 flex flex-col gap-3 rounded-xl border border-accent/40 bg-accent/10 p-5 sm:flex-row sm:items-center">
					<span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent/30 text-accent-foreground">
						<Repeat className="size-5" aria-hidden="true" />
					</span>
					<div className="min-w-0 flex-1">
						<p className="font-display text-base font-semibold text-foreground">
							Atur auto-replenish biar tidak pernah kehabisan
						</p>
						<p className="mt-0.5 text-sm text-muted-foreground">
							Jadwalkan pengiriman rutin untuk produk favorit hewanmu dan hemat
							5% di setiap pesanan langganan.
						</p>
					</div>
					<div className="flex shrink-0 items-center gap-2">
						<Button
							size="lg"
							className="h-10"
							render={<Link to="/account/subscriptions" />}
						>
							Atur langganan
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="size-10 text-muted-foreground"
							aria-label="Tutup tawaran langganan"
							onClick={() => setUpsellDismissed(true)}
						>
							<X className="size-4" />
						</Button>
					</div>
				</div>
			) : (
				<p className="mt-8 text-center text-sm text-muted-foreground">
					Nanti saja? Tidak masalah. Kamu bisa mengatur langganan kapan pun dari
					halaman akun.
				</p>
			)}
		</div>
	);
}
