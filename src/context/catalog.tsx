import { createContext, type ReactNode, useContext, useMemo } from "react";

import { articles } from "@/data/articles";
import { categories } from "@/data/categories";
import { guides } from "@/data/guides";
import { products } from "@/data/products";
import type {
	Article,
	Category,
	CategorySlug,
	Guide,
	Lifestage,
	PetProfile,
	PetSpecies,
	Product,
} from "@/data/types";

interface CatalogValue {
	products: Product[];
	getProduct: (idOrSlug: string) => Product | undefined;
	categories: Category[];
	getCategory: (slug: CategorySlug) => Category | undefined;
	articles: Article[];
	getArticle: (slug: string) => Article | undefined;
	guides: Guide[];
	getGuide: (slug: string) => Guide | undefined;
	recommendFor: (profile: PetProfile | null, limit?: number) => Product[];
}

const CatalogContext = createContext<CatalogValue | null>(null);

/** Map an age in months to a lifestage bracket (FR-09). */
export function lifestageForAge(ageMonths: number): Lifestage {
	if (ageMonths <= 12) return "puppy_kitten";
	if (ageMonths <= 24) return "junior";
	if (ageMonths <= 84) return "adult";
	return "senior";
}

export function CatalogProvider({ children }: { children: ReactNode }) {
	const value = useMemo<CatalogValue>(() => {
		const productById = new Map(products.map((p) => [p.id, p]));
		const productBySlug = new Map(products.map((p) => [p.slug, p]));
		return {
			products,
			getProduct: (idOrSlug) =>
				productById.get(idOrSlug) ?? productBySlug.get(idOrSlug),
			categories,
			getCategory: (slug) => categories.find((c) => c.slug === slug),
			articles,
			getArticle: (slug) => articles.find((a) => a.slug === slug),
			guides,
			getGuide: (slug) => guides.find((g) => g.slug === slug),
			recommendFor: (profile, limit = 8) => {
				if (!profile) {
					// No active profile: surface vet-recommended products as a sensible default.
					return products.filter((p) => p.vetRecommended).slice(0, limit);
				}
				const species: PetSpecies = profile.species;
				const stage = lifestageForAge(profile.ageMonths);
				const matches = products.filter(
					(p) => p.petTypes.includes(species) && p.lifestages.includes(stage),
				);
				const ranked = matches.sort((a, b) => {
					if (a.vetRecommended !== b.vetRecommended)
						return a.vetRecommended ? -1 : 1;
					return b.rating - a.rating;
				});
				return ranked.slice(0, limit);
			},
		};
	}, []);

	return (
		<CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
	);
}

export function useCatalog(): CatalogValue {
	const ctx = useContext(CatalogContext);
	if (!ctx)
		throw new Error(
			"useCatalog must be used within <CatalogProvider> (see <AppProviders>).",
		);
	return ctx;
}
