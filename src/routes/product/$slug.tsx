import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BadgeCheck, Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import { PET_LABEL } from "@/components/catalog/filter-logic";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductGrid } from "@/components/catalog/product-grid";
import { ReviewForm } from "@/components/catalog/review-form";
import { ReviewList } from "@/components/catalog/review-list";
import { EmptyState } from "@/components/common/empty-state";
import { PageSection } from "@/components/common/page-section";
import { Price } from "@/components/product/price";
import { RatingStars } from "@/components/product/rating-stars";
import { VetBadge } from "@/components/product/vet-badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/context/cart";
import { useCatalog } from "@/context/catalog";
import { track } from "@/lib/analytics";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

const SUBSCRIBE_DISCOUNT = 0.05;
const FREQUENCY_LABELS: Record<string, string> = {
	biweekly: "Setiap 2 minggu",
	monthly: "Setiap bulan",
	bimonthly: "Setiap 2 bulan",
};

export const Route = createFileRoute("/product/$slug")({
	component: ProductDetailPage,
	notFoundComponent: ProductNotFound,
});

function ProductNotFound() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-16">
			<EmptyState
				title="Produk tidak ditemukan"
				description="Produk yang Anda cari mungkin sudah tidak tersedia. Telusuri katalog untuk menemukan kebutuhan hewan kesayangan."
				action={
					<Button render={<Link to="/products" />}>Lihat semua produk</Button>
				}
			/>
		</div>
	);
}

function ProductDetailPage() {
	const { slug } = Route.useParams();
	const { getProduct, getCategory } = useCatalog();
	const { addItem } = useCart();
	const product = getProduct(slug);

	const [quantity, setQuantity] = useState(1);
	const [confirmOpen, setConfirmOpen] = useState(false);

	useEffect(() => {
		if (product) track("product_view", { slug: product.slug });
	}, [product]);

	if (!product) {
		throw notFound();
	}

	const category = getCategory(product.category);
	const subName = category?.subcategories.find(
		(s) => s.slug === product.subcategory,
	)?.name;

	const fbt = product.frequentlyBoughtTogether
		.map((id) => getProduct(id))
		.filter((p): p is NonNullable<typeof p> => Boolean(p));

	const subscribePrice = Math.round(product.price * (1 - SUBSCRIBE_DISCOUNT));
	const confirmSubtotal = product.price * quantity;

	const handleAdd = () => {
		addItem(product.id, quantity);
		setConfirmOpen(true);
	};

	return (
		<div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
			<Breadcrumb className="mb-5">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink render={<Link to="/" />}>Beranda</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink
							render={
								<Link
									to="/products/$category"
									params={{ category: product.category }}
								/>
							}
						>
							{category?.name ?? "Produk"}
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{product.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
				{/* Gallery */}
				<div>
					<ProductGallery images={product.images} alt={product.name} />
				</div>

				{/* Buy box */}
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
							{product.brand}
						</p>
						{product.vetRecommended ? <VetBadge compact /> : null}
					</div>

					<h1 className="font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
						{product.name}
					</h1>

					<div className="flex flex-wrap items-center gap-3">
						<RatingStars value={product.rating} count={product.reviewCount} />
						{product.stockStatus === "low_stock" ? (
							<span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
								Stok terbatas
							</span>
						) : (
							<span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
								<Check className="size-3.5" /> Tersedia
							</span>
						)}
					</div>

					<Price
						value={product.price}
						compareAt={product.compareAtPrice}
						size="lg"
					/>

					<p className="text-sm leading-relaxed text-muted-foreground">
						{product.description}
					</p>

					<div className="flex flex-wrap gap-2">
						{product.petTypes.map((pet) => (
							<span
								key={pet}
								className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground"
							>
								{PET_LABEL[pet]}
							</span>
						))}
					</div>

					{/* Quantity + add to cart */}
					<div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
						<div className="flex h-12 items-center rounded-lg border border-border">
							<button
								type="button"
								onClick={() => setQuantity((q) => Math.max(1, q - 1))}
								disabled={quantity <= 1}
								aria-label="Kurangi jumlah"
								className="flex size-12 items-center justify-center text-foreground disabled:opacity-40"
							>
								<Minus className="size-4" />
							</button>
							<span
								className="w-10 text-center text-base font-semibold tabular-nums"
								aria-live="polite"
							>
								{quantity}
							</span>
							<button
								type="button"
								onClick={() => setQuantity((q) => Math.min(99, q + 1))}
								disabled={quantity >= 99}
								aria-label="Tambah jumlah"
								className="flex size-12 items-center justify-center text-foreground disabled:opacity-40"
							>
								<Plus className="size-4" />
							</button>
						</div>

						<Button
							size="lg"
							className="h-12 flex-1 text-base"
							onClick={handleAdd}
						>
							<ShoppingCart className="size-5" />
							Tambah ke Keranjang
						</Button>
					</div>

					{/* Subscribe & Save */}
					{product.subscriptionEligible ? (
						<div className="rounded-xl border border-accent/50 bg-secondary/40 p-4">
							<div className="flex items-center gap-2">
								<BadgeCheck
									className="size-5 text-primary"
									aria-hidden="true"
								/>
								<h2 className="font-display text-base font-semibold text-foreground">
									Langganan & Hemat
								</h2>
								<span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
									Hemat 5%
								</span>
							</div>
							<p className="mt-2 text-sm text-muted-foreground">
								Jadi {formatIDR(subscribePrice)} per pengiriman. Pilih frekuensi
								yang sesuai, atur kapan saja.
							</p>
							<div className="mt-3 flex flex-wrap gap-2">
								{Object.values(FREQUENCY_LABELS).map((label) => (
									<span
										key={label}
										className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
									>
										{label}
									</span>
								))}
							</div>
							<Button
								variant="secondary"
								size="lg"
								className="mt-4 w-full"
								render={
									<Link
										to="/subscribe/$productId"
										params={{ productId: product.id }}
									/>
								}
							>
								Mulai Langganan
							</Button>
						</div>
					) : null}
				</div>
			</div>

			{/* Vet note callout */}
			{product.vetNote ? (
				<div className="mt-10 overflow-hidden rounded-2xl border border-accent/50 bg-secondary/40">
					<div className="flex flex-col gap-3 p-5 md:flex-row md:items-start md:gap-5 md:p-6">
						<span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/30 text-primary">
							<BadgeCheck className="size-6" aria-hidden="true" />
						</span>
						<div>
							<p className="text-xs font-semibold uppercase tracking-wide text-primary">
								Catatan Dokter Hewan
							</p>
							<p className="mt-1.5 text-base leading-relaxed text-foreground">
								&ldquo;{product.vetNote.text}&rdquo;
							</p>
							<p className="mt-2 text-sm font-semibold text-foreground">
								drh. {product.vetNote.vetName}
								<span className="ml-1 font-normal text-muted-foreground">
									{product.vetNote.credential}
								</span>
							</p>
						</div>
					</div>
				</div>
			) : null}

			{/* Specs + ingredients */}
			<div className="mt-10 grid gap-8 lg:grid-cols-2">
				<section>
					<h2 className="mb-3 font-display text-xl font-semibold text-foreground">
						Spesifikasi
					</h2>
					<dl className="overflow-hidden rounded-xl border border-border">
						{Object.entries(product.specs).map(([key, value], i) => (
							<div
								key={key}
								className={cn(
									"grid grid-cols-2 gap-3 px-4 py-3 text-sm",
									i % 2 === 0 ? "bg-card" : "bg-muted/40",
								)}
							>
								<dt className="font-medium text-muted-foreground">{key}</dt>
								<dd className="text-foreground">{value}</dd>
							</div>
						))}
					</dl>
				</section>

				{product.ingredients ? (
					<section>
						<h2 className="mb-3 font-display text-xl font-semibold text-foreground">
							Komposisi
						</h2>
						<p className="rounded-xl border border-border bg-card px-4 py-4 text-sm leading-relaxed text-muted-foreground">
							{product.ingredients}
						</p>
						{subName ? (
							<p className="mt-3 text-xs text-muted-foreground">
								Kategori: {subName}
							</p>
						) : null}
					</section>
				) : null}
			</div>

			{/* Reviews */}
			<PageSection
				title="Ulasan Pembeli"
				display
				description={`${product.rating.toFixed(1)} dari 5 berdasarkan ${product.reviewCount} ulasan`}
			>
				<div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
					<div className="rounded-xl border border-border bg-card p-5">
						<div className="mb-4 flex items-center gap-4 border-b border-border pb-4">
							<span className="font-display text-4xl font-bold text-foreground">
								{product.rating.toFixed(1)}
							</span>
							<div>
								<RatingStars
									value={product.rating}
									size={18}
									showValue={false}
								/>
								<p className="mt-1 text-sm text-muted-foreground">
									{product.reviewCount} ulasan
								</p>
							</div>
						</div>
						<ReviewList reviews={product.reviews} />
					</div>
					<ReviewForm productName={product.name} />
				</div>
			</PageSection>

			{/* Frequently bought together */}
			{fbt.length > 0 ? (
				<PageSection
					title="Sering Dibeli Bersama"
					display
					description="Lengkapi kebutuhan hewan kesayangan dengan produk pendamping."
				>
					<ProductGrid products={fbt} />
				</PageSection>
			) : null}

			{/* Add-to-cart confirmation */}
			<Sheet open={confirmOpen} onOpenChange={setConfirmOpen}>
				<SheetContent side="bottom" className="mx-auto max-w-lg rounded-t-2xl">
					<SheetHeader>
						<SheetTitle className="flex items-center gap-2 font-display text-lg">
							<span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
								<Check className="size-4" />
							</span>
							Ditambahkan ke keranjang
						</SheetTitle>
					</SheetHeader>
					<div className="flex items-center gap-3 px-4">
						<img
							src={product.images[0]}
							alt={product.name}
							className="size-16 rounded-lg border border-border object-cover"
						/>
						<div className="min-w-0 flex-1">
							<p className="line-clamp-2 text-sm font-medium text-foreground">
								{product.name}
							</p>
							<p className="text-sm text-muted-foreground">
								{quantity} x {formatIDR(product.price)}
							</p>
						</div>
						<p className="font-semibold text-foreground">
							{formatIDR(confirmSubtotal)}
						</p>
					</div>
					<SheetFooter className="flex-row gap-2">
						<SheetClose
							render={
								<Button variant="outline" className="flex-1">
									Lanjut Belanja
								</Button>
							}
						/>
						<Button className="flex-1" render={<Link to="/cart" />}>
							Lihat Keranjang
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</div>
	);
}
