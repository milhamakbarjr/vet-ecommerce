import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";

import { AuthGate } from "@/components/account/auth-gate";
import { OrderRow } from "@/components/account/order-row";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/context/orders";

export const Route = createFileRoute("/account/orders/")({
	component: OrdersPage,
});

function OrdersInner() {
	const { orders } = useOrders();

	return (
		<div className="py-8">
			<header className="mb-6">
				<h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
					Pesanan saya
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					Lihat riwayat pesanan dan lacak status pengirimannya.
				</p>
			</header>

			{orders.length === 0 ? (
				<EmptyState
					icon={ShoppingBag}
					title="Belum ada pesanan"
					description="Saat kamu berbelanja, pesananmu akan muncul di sini lengkap dengan status pengirimannya."
					action={
						<Button render={<Link to="/products" />}>Mulai belanja</Button>
					}
				/>
			) : (
				<div className="flex flex-col gap-3">
					{orders.map((order) => (
						<OrderRow key={order.id} order={order} />
					))}
				</div>
			)}
		</div>
	);
}

function OrdersPage() {
	return (
		<AuthGate
			title="Masuk untuk melihat pesanan"
			description="Riwayat pesanan tersimpan di akunmu. Masuk dulu untuk melihatnya."
		>
			<OrdersInner />
		</AuthGate>
	);
}
