import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import type { Product } from "@/data/types";
import { track } from "@/lib/analytics";
import { FilterChips } from "./filter-chips";
import {
	applyFilters,
	availableBrands,
	type CatalogFilters,
	defaultFilters,
	hasActiveFilters,
	sortProducts,
} from "./filter-logic";
import { ProductFilters } from "./product-filters";
import { ProductGrid } from "./product-grid";
import { SortSelect } from "./sort-select";

interface SubcategoryOption {
	slug: string;
	name: string;
}

interface CatalogBrowserProps {
	/** The pool of products this browser filters over. */
	base: Product[];
	filters: CatalogFilters;
	onChange: (next: CatalogFilters) => void;
	/** Subcategory options for the filter panel. Omit to hide. */
	subcategoryOptions?: SubcategoryOption[];
	/** Resolve a subcategory slug to a label for chips. */
	subcategoryLabel?: (slug: string) => string;
	/** Fire search_performed analytics on debounced query change (listing page). */
	trackSearch?: boolean;
}

export function CatalogBrowser({
	base,
	filters,
	onChange,
	subcategoryOptions,
	subcategoryLabel,
	trackSearch = false,
}: CatalogBrowserProps) {
	const [mobileOpen, setMobileOpen] = useState(false);

	const brandOptions = useMemo(() => availableBrands(base), [base]);

	const results = useMemo(() => {
		const filtered = applyFilters(base, filters);
		return sortProducts(filtered, filters.sort);
	}, [base, filters]);

	// Fire search_performed after the (already-debounced upstream) query settles.
	const lastTracked = useRef<string | null>(null);
	useEffect(() => {
		if (!trackSearch) return;
		const q = filters.query.trim();
		if (!q) {
			lastTracked.current = null;
			return;
		}
		if (lastTracked.current === q) return;
		lastTracked.current = q;
		track("search_performed", { query: q, results: results.length });
	}, [trackSearch, filters.query, results.length]);

	const resolveSubLabel = (slug: string) => {
		if (subcategoryLabel) return subcategoryLabel(slug);
		const found = subcategoryOptions?.find((s) => s.slug === slug);
		return found?.name ?? slug;
	};

	const clearAll = () =>
		onChange({
			...defaultFilters(),
			query: filters.query,
			sort: filters.sort,
		});

	const activeCount = [
		filters.pets.length,
		filters.brands.length,
		filters.subcategories.length,
		filters.minRating > 0 ? 1 : 0,
		hasActiveFilters({
			...filters,
			pets: [],
			brands: [],
			subcategories: [],
			minRating: 0,
		})
			? 1
			: 0,
	].reduce((a, b) => a + b, 0);

	const filterPanel = (
		<ProductFilters
			filters={filters}
			onChange={onChange}
			subcategoryOptions={subcategoryOptions}
			brandOptions={brandOptions}
		/>
	);

	return (
		<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
			{/* Desktop sidebar */}
			<aside className="hidden w-64 shrink-0 lg:block">
				<div className="sticky top-20 rounded-xl border border-border bg-card p-4">
					<h2 className="mb-2 font-display text-lg font-semibold text-foreground">
						Filter
					</h2>
					{filterPanel}
				</div>
			</aside>

			<div className="min-w-0 flex-1">
				{/* Toolbar */}
				<div className="mb-4 flex items-center justify-between gap-3">
					<p className="text-sm text-muted-foreground" aria-live="polite">
						<span className="font-semibold text-foreground">
							{results.length}
						</span>{" "}
						produk
					</p>

					<div className="flex items-center gap-2">
						{/* Mobile filter trigger */}
						<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
							<SheetTrigger
								render={
									<Button
										variant="outline"
										size="default"
										className="lg:hidden"
										aria-label="Buka filter"
									>
										<SlidersHorizontal className="size-4" />
										Filter
										{activeCount > 0 ? (
											<span className="ml-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-primary-foreground">
												{activeCount}
											</span>
										) : null}
									</Button>
								}
							/>
							<SheetContent side="left" className="w-[88vw] max-w-sm">
								<SheetHeader>
									<SheetTitle className="font-display text-lg">
										Filter
									</SheetTitle>
								</SheetHeader>
								<div className="flex-1 overflow-y-auto px-4">{filterPanel}</div>
								<SheetFooter className="flex-row gap-2">
									<Button
										variant="outline"
										className="flex-1"
										onClick={() => {
											clearAll();
										}}
									>
										Reset
									</Button>
									<Button
										className="flex-1"
										onClick={() => setMobileOpen(false)}
									>
										Lihat {results.length} produk
									</Button>
								</SheetFooter>
							</SheetContent>
						</Sheet>

						<SortSelect
							value={filters.sort}
							onChange={(sort) => onChange({ ...filters, sort })}
						/>
					</div>
				</div>

				{hasActiveFilters(filters) ? (
					<div className="mb-4">
						<FilterChips
							filters={filters}
							onChange={onChange}
							onClearAll={clearAll}
							subcategoryLabel={resolveSubLabel}
						/>
					</div>
				) : null}

				{results.length > 0 ? (
					<ProductGrid products={results} />
				) : (
					<EmptyState
						title="Tidak ada produk yang cocok"
						description={
							filters.query
								? `Kami tidak menemukan hasil untuk "${filters.query}". Coba kata kunci yang lebih umum atau kurangi filter yang aktif.`
								: "Coba kurangi filter yang aktif agar lebih banyak produk muncul."
						}
						action={
							hasActiveFilters(filters) ? (
								<Button variant="outline" onClick={clearAll}>
									Hapus semua filter
								</Button>
							) : null
						}
					/>
				)}
			</div>
		</div>
	);
}
