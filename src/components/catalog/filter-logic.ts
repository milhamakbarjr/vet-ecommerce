import type { CategorySlug, PetSpecies, Product } from "@/data/types";

export type SortKey =
	| "relevance"
	| "price_asc"
	| "price_desc"
	| "most_reviewed"
	| "highest_rated";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: "relevance", label: "Paling Relevan" },
	{ value: "price_asc", label: "Harga Termurah" },
	{ value: "price_desc", label: "Harga Tertinggi" },
	{ value: "most_reviewed", label: "Paling Banyak Diulas" },
	{ value: "highest_rated", label: "Rating Tertinggi" },
];

export const PET_OPTIONS: { value: PetSpecies; label: string }[] = [
	{ value: "dog", label: "Anjing" },
	{ value: "cat", label: "Kucing" },
	{ value: "rabbit", label: "Kelinci" },
	{ value: "bird", label: "Burung" },
	{ value: "fish", label: "Ikan" },
	{ value: "other", label: "Hewan Kecil Lain" },
];

export const PET_LABEL: Record<PetSpecies, string> = {
	dog: "Anjing",
	cat: "Kucing",
	rabbit: "Kelinci",
	bird: "Burung",
	fish: "Ikan",
	other: "Hewan Kecil Lain",
};

export const PRICE_MIN = 0;
export const PRICE_MAX = 500000;

export interface CatalogFilters {
	query: string;
	pets: PetSpecies[];
	brands: string[];
	subcategories: string[];
	priceRange: [number, number];
	minRating: number;
	sort: SortKey;
}

export function defaultFilters(): CatalogFilters {
	return {
		query: "",
		pets: [],
		brands: [],
		subcategories: [],
		priceRange: [PRICE_MIN, PRICE_MAX],
		minRating: 0,
		sort: "relevance",
	};
}

/** Whether any filter beyond sort/query is active (so we can show a clear-all). */
export function hasActiveFilters(f: CatalogFilters): boolean {
	return (
		f.pets.length > 0 ||
		f.brands.length > 0 ||
		f.subcategories.length > 0 ||
		f.minRating > 0 ||
		f.priceRange[0] > PRICE_MIN ||
		f.priceRange[1] < PRICE_MAX
	);
}

function matchesQuery(product: Product, query: string): boolean {
	if (!query) return true;
	const needle = query.trim().toLowerCase();
	if (!needle) return true;
	return (
		product.name.toLowerCase().includes(needle) ||
		product.brand.toLowerCase().includes(needle) ||
		product.description.toLowerCase().includes(needle)
	);
}

/** Apply filters (not sort) to a base list of products. */
export function applyFilters(base: Product[], f: CatalogFilters): Product[] {
	return base.filter((p) => {
		if (!matchesQuery(p, f.query)) return false;
		if (f.pets.length > 0 && !f.pets.some((s) => p.petTypes.includes(s)))
			return false;
		if (f.brands.length > 0 && !f.brands.includes(p.brand)) return false;
		if (f.subcategories.length > 0 && !f.subcategories.includes(p.subcategory))
			return false;
		if (p.price < f.priceRange[0] || p.price > f.priceRange[1]) return false;
		if (f.minRating > 0 && p.rating < f.minRating) return false;
		return true;
	});
}

/** Sort a filtered list. Relevance preserves source order. */
export function sortProducts(list: Product[], sort: SortKey): Product[] {
	const out = [...list];
	switch (sort) {
		case "price_asc":
			out.sort((a, b) => a.price - b.price);
			break;
		case "price_desc":
			out.sort((a, b) => b.price - a.price);
			break;
		case "most_reviewed":
			out.sort((a, b) => b.reviewCount - a.reviewCount);
			break;
		case "highest_rated":
			out.sort((a, b) => b.rating - a.rating);
			break;
		default:
			break;
	}
	return out;
}

/** Distinct brands available in a base set, alphabetised. */
export function availableBrands(base: Product[]): string[] {
	return Array.from(new Set(base.map((p) => p.brand))).sort((a, b) =>
		a.localeCompare(b, "id"),
	);
}

/** Distinct subcategory slugs present in a base set. */
export function availableSubcategories(base: Product[]): string[] {
	return Array.from(new Set(base.map((p) => p.subcategory)));
}

/** Coerce an unknown search param into a known CategorySlug or undefined. */
export function asCategorySlug(value: unknown): CategorySlug | undefined {
	if (value === "food" || value === "health" || value === "supplies")
		return value;
	return undefined;
}

/** Coerce an unknown search param into a known PetSpecies or undefined. */
export function asPetSpecies(value: unknown): PetSpecies | undefined {
	if (
		value === "dog" ||
		value === "cat" ||
		value === "rabbit" ||
		value === "bird" ||
		value === "fish" ||
		value === "other"
	)
		return value;
	return undefined;
}
