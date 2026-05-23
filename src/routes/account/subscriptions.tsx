import { createFileRoute, Link } from "@tanstack/react-router";
import { LogIn, PackageOpen, Repeat } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { SubscriptionCard } from "@/components/subscriptions/subscription-card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { FREQUENCY_LABELS, useSubscriptions } from "@/context/subscriptions";
import { formatDateID } from "@/lib/format";

export const Route = createFileRoute("/account/subscriptions")({
	component: SubscriptionsPage,
});

function SubscriptionsPage() {
	const { isAuthenticated } = useAuth();
	const { active, subscriptions, pause, cancel, setFrequency, setQuantity } =
		useSubscriptions();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const past = useMemo(
		() => subscriptions.filter((s) => s.status === "cancelled"),
		[subscriptions],
	);

	// Avoid hydration mismatch: storage-backed state is empty on the server.
	if (!mounted) {
		return (
			<div className="mx-auto max-w-4xl px-4 py-10">
				<div className="h-40 animate-pulse rounded-2xl bg-muted/50" />
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16">
				<EmptyState
					icon={LogIn}
					title="Masuk untuk melihat langganan Anda"
					description="Kelola pengiriman rutin hewan kesayangan setelah Anda masuk ke akun PetSehat."
					action={
						<div className="flex flex-wrap justify-center gap-3">
							<Button render={<Link to="/login" />}>Masuk</Button>
							<Button variant="outline" render={<Link to="/products" />}>
								Telusuri produk
							</Button>
						</div>
					}
				/>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-8 md:py-10">
			<header className="mb-6">
				<p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
					<Repeat className="size-3.5" aria-hidden="true" />
					Langganan & Hemat
				</p>
				<h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">
					Langganan saya
				</h1>
				<p className="mt-2 max-w-2xl text-muted-foreground">
					Atur jadwal, jumlah, dan alamat pengiriman rutin. Jeda kapan saja jika
					stok masih cukup.
				</p>
			</header>

			{active.length === 0 ? (
				<EmptyState
					icon={PackageOpen}
					title="Belum ada langganan aktif"
					description="Mulai langganan produk favorit hewan Anda untuk hemat 5% setiap pengiriman dan tidak pernah kehabisan stok."
					action={
						<Button render={<Link to="/products" />}>Mulai Belanja</Button>
					}
				/>
			) : (
				<div className="space-y-4">
					{active.map((sub) => (
						<SubscriptionCard
							key={sub.id}
							subscription={sub}
							onPause={pause}
							onCancel={cancel}
							onSetFrequency={setFrequency}
							onSetQuantity={setQuantity}
						/>
					))}
				</div>
			)}

			{past.length > 0 ? (
				<div className="mt-10">
					<Accordion className="rounded-2xl border border-border bg-card px-4">
						<AccordionItem value="past" className="border-b-0">
							<AccordionTrigger className="font-display text-base font-semibold text-foreground">
								Langganan Sebelumnya ({past.length})
							</AccordionTrigger>
							<AccordionContent>
								<ul className="space-y-3">
									{past.map((sub) => (
										<li
											key={sub.id}
											className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3"
										>
											<img
												src={sub.productImage}
												alt={sub.productName}
												loading="lazy"
												className="size-14 shrink-0 rounded-lg object-cover opacity-80"
											/>
											<div className="min-w-0 flex-1">
												<p className="truncate font-medium text-foreground">
													{sub.productName}
												</p>
												<div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
													<Badge variant="outline">
														{FREQUENCY_LABELS[sub.frequency]}
													</Badge>
													<span>
														Dibatalkan{" "}
														{sub.cancelledAt
															? formatDateID(sub.cancelledAt)
															: formatDateID(sub.createdAt)}
													</span>
												</div>
											</div>
										</li>
									))}
								</ul>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			) : null}
		</div>
	);
}
