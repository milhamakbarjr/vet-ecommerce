import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PetSpecies } from "@/data/types";
import { formatIDR } from "@/lib/format";
import {
	type CatalogFilters,
	hasActiveFilters,
	PET_LABEL,
	PRICE_MAX,
	PRICE_MIN,
} from "./filter-logic";

interface FilterChipsProps {
	filters: CatalogFilters;
	onChange: (next: CatalogFilters) => void;
	onClearAll: () => void;
	/** Resolve a subcategory slug to a human label. */
	subcategoryLabel: (slug: string) => string;
}

interface Chip {
	key: string;
	label: string;
	remove: () => void;
}

export function FilterChips({
	filters,
	onChange,
	onClearAll,
	subcategoryLabel,
}: FilterChipsProps) {
	if (!hasActiveFilters(filters)) return null;

	const chips: Chip[] = [];

	for (const pet of filters.pets) {
		chips.push({
			key: `pet-${pet}`,
			label: PET_LABEL[pet as PetSpecies],
			remove: () =>
				onChange({ ...filters, pets: filters.pets.filter((p) => p !== pet) }),
		});
	}

	for (const sub of filters.subcategories) {
		chips.push({
			key: `sub-${sub}`,
			label: subcategoryLabel(sub),
			remove: () =>
				onChange({
					...filters,
					subcategories: filters.subcategories.filter((s) => s !== sub),
				}),
		});
	}

	for (const brand of filters.brands) {
		chips.push({
			key: `brand-${brand}`,
			label: brand,
			remove: () =>
				onChange({
					...filters,
					brands: filters.brands.filter((b) => b !== brand),
				}),
		});
	}

	if (filters.minRating > 0) {
		chips.push({
			key: "rating",
			label: `${filters.minRating}+ bintang`,
			remove: () => onChange({ ...filters, minRating: 0 }),
		});
	}

	if (filters.priceRange[0] > PRICE_MIN || filters.priceRange[1] < PRICE_MAX) {
		chips.push({
			key: "price",
			label: `${formatIDR(filters.priceRange[0])} sampai ${formatIDR(filters.priceRange[1])}`,
			remove: () =>
				onChange({ ...filters, priceRange: [PRICE_MIN, PRICE_MAX] }),
		});
	}

	return (
		<div className="flex flex-wrap items-center gap-2">
			{chips.map((chip) => (
				<button
					key={chip.key}
					type="button"
					onClick={chip.remove}
					className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-accent/40 transition-colors hover:bg-secondary/70"
					aria-label={`Hapus filter ${chip.label}`}
				>
					{chip.label}
					<X className="size-3.5" aria-hidden="true" />
				</button>
			))}
			<Button
				type="button"
				variant="ghost"
				size="sm"
				onClick={onClearAll}
				className="h-8 text-muted-foreground"
			>
				Hapus semua
			</Button>
		</div>
	);
}
