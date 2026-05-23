import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Minus,
	Plus,
	ShoppingBag,
	Tag,
	Trash2,
	X,
} from "lucide-react";
import { useState } from "react";

import { OrderSummary } from "@/components/checkout/order-summary";
import { EmptyState } from "@/components/common/empty-state";
import { Price } from "@/components/product/price";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart";
import { useCatalog } from "@/context/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cart")({ component: CartPage });

function QuantityStepper({
	quantity,
	onChange,
	label,
}: {
	quantity: number;
	onChange: (next: number) => void;
	label: string;
}) {
	return (
		<div className="inline-flex items-center rounded-lg border border-border">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="size-11 rounded-r-none"
				aria-label={`Kurangi jumlah ${label}`}
				disabled={quantity <= 1}
				onClick={() => onChange(quantity - 1)}
			>
				<Minus className="size-4" />
			</Button>
			<span
				className="w-10 text-center text-sm font-semibold tabular-nums"
				aria-live="polite"
			>
				{quantity}
			</span>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className="size-11 rounded-l-none"
				aria-label={`Tambah jumlah ${label}`}
				disabled={quantity >= 99}
				onClick={() => onChange(quantity + 1)}
			>
				<Plus className="size-4" />
			</Button>
		</div>
	);
}

function PromoField() {
	const { promo, applyPromo, clearPromo, discount } = useCart();
	const [code, setCode] = useState("");
	const [error, setError] = useState<string | null>(null);

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		const result = applyPromo(code);
		if (result.ok) {
			setError(null);
			setCode("");
		} else {
			setError(result.message);
		}
	};

	if (promo) {
		return (
			<div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
				<div className="flex items-center justify-between gap-3">
					<div className="flex items-center gap-2">
						<span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
							<Tag className="size-4" aria-hidden="true" />
						</span>
						<div>
							<p className="text-sm font-semibold text-foreground">
								{promo.code} aktif
							</p>
							<p className="text-xs text-primary">{promo.label}</p>
						</div>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => clearPromo()}
					>
						<X className="size-4" />
						Hapus
					</Button>
				</div>
				{discount > 0 ? (
					<p className="mt-2 text-xs text-muted-foreground">
						Diskon sudah dihitung di ringkasan belanja.
					</p>
				) : null}
			</div>
		);
	}

	return (
		<form
			onSubmit={submit}
			className="rounded-xl border border-border bg-card p-4"
		>
			<label
				htmlFor="promo-code"
				className="text-sm font-medium text-foreground"
			>
				Punya kode promo?
			</label>
			<div className="mt-2 flex gap-2">
				<Input
					id="promo-code"
					value={code}
					onChange={(e) => {
						setCode(e.target.value);
						if (error) setError(null);
					}}
					placeholder="PETSEHAT10"
					className="h-11 uppercase"
					aria-invalid={error ? true : undefined}
					aria-describedby={error ? "promo-error" : undefined}
				/>
				<Button
					type="submit"
					variant="secondary"
					size="lg"
					className="h-11 shrink-0"
					disabled={!code.trim()}
				>
					Terapkan
				</Button>
			</div>
			{error ? (
				<p
					id="promo-error"
					className="mt-2 text-xs font-medium text-destructive"
				>
					{error}
				</p>
			) : (
				<p className="mt-2 text-xs text-muted-foreground">
					Coba PETSEHAT10 untuk diskon 10% atau GRATIS5 untuk potongan Rp 5.000.
				</p>
			)}
		</form>
	);
}

function CartPage() {
	const { items, setQuantity, removeItem, subtotal, discount, promo } =
		useCart();
	const { getProduct } = useCatalog();

	const lines = items
		.map((item) => {
			const product = getProduct(item.productId);
			return product ? { product, quantity: item.quantity } : null;
		})
		.filter(
			(
				l,
			): l is {
				product: NonNullable<ReturnType<typeof getProduct>>;
				quantity: number;
			} => l !== null,
		);

	if (lines.length === 0) {
		return (
			<div className="py-10">
				<h1 className="font-display text-3xl font-bold text-foreground">
					Keranjang
				</h1>
				<div className="mt-8">
					<EmptyState
						icon={ShoppingBag}
						title="Keranjang kamu masih kosong"
						description="Yuk isi dengan makanan, obat, atau perlengkapan terbaik untuk hewan kesayanganmu."
						action={
							<Button
								size="lg"
								className="h-11"
								render={<Link to="/products" />}
							>
								Mulai belanja
								<ArrowRight className="size-4" />
							</Button>
						}
					/>
				</div>
			</div>
		);
	}

	const total = Math.max(0, subtotal - discount);

	return (
		<div className="py-8 md:py-10">
			<h1 className="font-display text-3xl font-bold text-foreground">
				Keranjang
			</h1>
			<p className="mt-1 text-sm text-muted-foreground">
				{lines.length} produk siap untuk diproses.
			</p>

			<div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
				<div className="flex flex-col gap-4">
					<ul className="flex flex-col gap-4">
						{lines.map(({ product, quantity }) => (
							<li
								key={product.id}
								className="flex gap-4 rounded-xl border border-border bg-card p-4"
							>
								<Link
									to="/product/$slug"
									params={{ slug: product.slug }}
									className="shrink-0 overflow-hidden rounded-lg"
								>
									<img
										src={product.images[0]}
										alt={product.name}
										className="size-20 object-cover sm:size-24"
										loading="lazy"
									/>
								</Link>
								<div className="flex min-w-0 flex-1 flex-col">
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<p className="text-xs text-muted-foreground">
												{product.brand}
											</p>
											<Link
												to="/product/$slug"
												params={{ slug: product.slug }}
												className="line-clamp-2 font-medium text-foreground hover:text-primary"
											>
												{product.name}
											</Link>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="size-9 shrink-0 text-muted-foreground hover:text-destructive"
											aria-label={`Hapus ${product.name} dari keranjang`}
											onClick={() => removeItem(product.id)}
										>
											<Trash2 className="size-4" />
										</Button>
									</div>
									<div className="mt-1">
										<Price value={product.price} size="sm" />
									</div>
									<div className="mt-auto flex items-center justify-between gap-3 pt-3">
										<QuantityStepper
											quantity={quantity}
											label={product.name}
											onChange={(next) => setQuantity(product.id, next)}
										/>
										<Price
											value={product.price * quantity}
											size="md"
											className="justify-end"
										/>
									</div>
								</div>
							</li>
						))}
					</ul>

					<Button
						variant="ghost"
						size="lg"
						className="h-11 self-start"
						render={<Link to="/products" />}
					>
						<ArrowRight className="size-4 rotate-180" />
						Lanjut belanja
					</Button>
				</div>

				<aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
					<PromoField />
					<OrderSummary
						subtotal={subtotal}
						deliveryFee={0}
						discount={discount}
						total={total}
						promoLabel={promo?.label}
						deliveryPending
						footer={
							<Button
								size="lg"
								className={cn("h-12 w-full text-base")}
								render={<Link to="/checkout" />}
							>
								Lanjut ke Checkout
								<ArrowRight className="size-4" />
							</Button>
						}
					/>
					<p className="text-center text-xs text-muted-foreground">
						Ongkos kirim dihitung setelah kamu memilih kurir di langkah
						checkout.
					</p>
				</aside>
			</div>
		</div>
	);
}
