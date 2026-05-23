import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";

import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import {
	asCategorySlug,
	type CatalogFilters,
	defaultFilters,
} from "@/components/catalog/filter-logic";
import { ProductGrid } from "@/components/catalog/product-grid";
import { EmptyState } from "@/components/common/empty-state";
import { PageSection } from "@/components/common/page-section";
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
import { useCatalog } from "@/context/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$category")({
	beforeLoad: ({ params }) => {
		if (!asCategorySlug(params.category)) {
			throw notFound();
		}
	},
	component: CategoryPage,
	notFoundComponent: CategoryNotFound,
});

function CategoryNotFound() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-16">
			<EmptyState
				title="Kategori tidak ditemukan"
				description="Halaman kategori yang Anda cari tidak tersedia. Telusuri semua produk untuk menemukan kebutuhan hewan kesayangan."
				action={
					<Button render={<Link to="/products" />}>Lihat semua produk</Button>
				}
			/>
		</div>
	);
}

function CategoryPage() {
	const { category: categoryParam } = Route.useParams();
	const { products, getCategory } = useCatalog();
	const slug = asCategorySlug(categoryParam);
	const category = slug ? getCategory(slug) : undefined;

	const [filters, setFilters] = useState<CatalogFilters>(() =>
		defaultFilters(),
	);

	const base = useMemo(
		() => products.filter((p) => p.category === slug),
		[products, slug],
	);

	const featured = useMemo(() => {
		if (!category) return [];
		return category.featuredProductIds
			.map((id) => products.find((p) => p.id === id))
			.filter((p): p is NonNullable<typeof p> => Boolean(p));
	}, [category, products]);

	if (!category || !slug) {
		return <CategoryNotFound />;
	}

	const activeSub = filters.subcategories[0];

	return (
		<div>
			{/* Hero */}
			<section className="relative overflow-hidden border-b border-border bg-secondary/40">
				<div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-8 md:grid-cols-2 md:py-12">
					<div>
						<Breadcrumb className="mb-3">
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink render={<Link to="/" />}>
										Beranda
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbLink render={<Link to="/products" />}>
										Produk
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>{category.name}</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<p className="text-xs font-semibold uppercase tracking-wide text-primary">
							Kategori
						</p>
						<h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">
							{category.name}
						</h1>
						<p className="mt-3 max-w-md text-muted-foreground">
							{category.tagline}
						</p>
					</div>
					<div className="relative aspect-[16/10] overflow-hidden rounded-2xl md:aspect-[4/3]">
						<img
							src={category.image}
							alt={`Produk kategori ${category.name}`}
							className="size-full object-cover"
						/>
					</div>
				</div>
			</section>

			<div className="mx-auto max-w-7xl px-4">
				{/* Subcategory nav */}
				<nav
					aria-label="Subkategori"
					className="-mx-4 flex gap-2 overflow-x-auto px-4 py-5"
				>
					<button
						type="button"
						onClick={() => setFilters((f) => ({ ...f, subcategories: [] }))}
						className={cn(
							"shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
							!activeSub
								? "border-primary bg-primary text-primary-foreground"
								: "border-border text-foreground hover:bg-muted",
						)}
					>
						Semua
					</button>
					{category.subcategories.map((sub) => {
						const active = activeSub === sub.slug;
						return (
							<button
								key={sub.slug}
								type="button"
								onClick={() =>
									setFilters((f) => ({
										...f,
										subcategories: active ? [] : [sub.slug],
									}))
								}
								className={cn(
									"shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
									active
										? "border-primary bg-primary text-primary-foreground"
										: "border-border text-foreground hover:bg-muted",
								)}
							>
								{sub.name}
							</button>
						);
					})}
				</nav>

				{/* Vet-curated featured section */}
				{featured.length > 0 ? (
					<PageSection
						eyebrow="Pilihan Dokter Hewan"
						title="Direkomendasikan untuk Anda"
						description="Produk pilihan tim dokter hewan kami untuk kategori ini."
						action={<VetBadge />}
						className="pt-0"
					>
						<ProductGrid products={featured.slice(0, 4)} />
					</PageSection>
				) : null}

				{/* Full filtered grid */}
				<PageSection title="Semua produk" display>
					<CatalogBrowser
						base={base}
						filters={filters}
						onChange={setFilters}
						subcategoryOptions={category.subcategories}
					/>
				</PageSection>

				<div className="pb-10">
					<Button
						variant="ghost"
						size="sm"
						render={<Link to="/products" />}
						className="text-muted-foreground"
					>
						<ArrowLeft className="size-4" />
						Lihat semua kategori
					</Button>
				</div>
			</div>
		</div>
	);
}
