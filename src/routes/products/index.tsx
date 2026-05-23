import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import {
	asCategorySlug,
	asPetSpecies,
	type CatalogFilters,
	defaultFilters,
} from "@/components/catalog/filter-logic";
import { useCatalog } from "@/context/catalog";
import type { CategorySlug, PetSpecies } from "@/data/types";

interface ProductsSearch {
	q?: string;
	category?: CategorySlug;
	pet?: PetSpecies;
}

export const Route = createFileRoute("/products/")({
	validateSearch: (search: Record<string, unknown>): ProductsSearch => {
		const q = typeof search.q === "string" ? search.q : undefined;
		const category = asCategorySlug(search.category);
		const pet = asPetSpecies(search.pet);
		return {
			...(q ? { q } : {}),
			...(category ? { category } : {}),
			...(pet ? { pet } : {}),
		};
	},
	component: ProductsPage,
});

function ProductsPage() {
	const { products, categories } = useCatalog();
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	// Filter state seeded from URL search params.
	const [filters, setFilters] = useState<CatalogFilters>(() => ({
		...defaultFilters(),
		query: search.q ?? "",
		subcategories: [],
		pets: search.pet ? [search.pet] : [],
	}));

	// Local search box value, debounced into filters.query (FR-04, ~300ms).
	const [queryInput, setQueryInput] = useState(search.q ?? "");

	// Keep filters in sync when the header search drives a new ?q= or ?pet=.
	const lastSearchQ = useRef(search.q ?? "");
	useEffect(() => {
		const next = search.q ?? "";
		if (next !== lastSearchQ.current) {
			lastSearchQ.current = next;
			setQueryInput(next);
			setFilters((prev) => ({ ...prev, query: next }));
		}
	}, [search.q]);

	const lastSearchPet = useRef(search.pet);
	useEffect(() => {
		if (search.pet && search.pet !== lastSearchPet.current) {
			lastSearchPet.current = search.pet;
			setFilters((prev) => ({
				...prev,
				pets: prev.pets.includes(search.pet as PetSpecies)
					? prev.pets
					: [...prev.pets, search.pet as PetSpecies],
			}));
		}
	}, [search.pet]);

	useEffect(() => {
		const id = setTimeout(() => {
			setFilters((prev) =>
				prev.query === queryInput ? prev : { ...prev, query: queryInput },
			);
		}, 300);
		return () => clearTimeout(id);
	}, [queryInput]);

	// Base pool honours an optional ?category= scope without locking the user out of widening it.
	const base = useMemo(() => {
		if (search.category)
			return products.filter((p) => p.category === search.category);
		return products;
	}, [products, search.category]);

	// Subcategory options reflect the active category scope, or all when unscoped.
	const subcategoryOptions = useMemo(() => {
		if (search.category) {
			const cat = categories.find((c) => c.slug === search.category);
			return cat?.subcategories ?? [];
		}
		return categories.flatMap((c) => c.subcategories);
	}, [categories, search.category]);

	const subcategoryLabel = useMemo(() => {
		const map = new Map(
			categories.flatMap((c) => c.subcategories).map((s) => [s.slug, s.name]),
		);
		return (slug: string) => map.get(slug) ?? slug;
	}, [categories]);

	const activeCategory = search.category
		? categories.find((c) => c.slug === search.category)
		: undefined;

	return (
		<div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
			<header className="mb-6">
				<h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
					{search.q
						? `Hasil untuk "${search.q}"`
						: activeCategory
							? activeCategory.name
							: "Semua Produk"}
				</h1>
				<p className="mt-1 max-w-2xl text-sm text-muted-foreground">
					{activeCategory
						? activeCategory.tagline
						: "Telusuri kebutuhan hewan kesayangan, semua dipilih dengan panduan dokter hewan."}
				</p>

				{/* Page search box (mirrors header but scoped to listing) */}
				<div className="mt-4 max-w-md">
					<label htmlFor="catalog-search" className="sr-only">
						Cari produk
					</label>
					<input
						id="catalog-search"
						type="search"
						value={queryInput}
						onChange={(e) => {
							const value = e.target.value;
							setQueryInput(value);
							navigate({
								search: (prev) => ({
									...prev,
									q: value.trim() ? value : undefined,
								}),
								replace: true,
							});
						}}
						placeholder="Cari nama, merek, atau kebutuhan..."
						className="h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
					/>
				</div>
			</header>

			<CatalogBrowser
				base={base}
				filters={filters}
				onChange={setFilters}
				subcategoryOptions={subcategoryOptions}
				subcategoryLabel={subcategoryLabel}
				trackSearch
			/>
		</div>
	);
}
