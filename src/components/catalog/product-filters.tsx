import { Star } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
	type CatalogFilters,
	PET_OPTIONS,
	PRICE_MAX,
	PRICE_MIN,
} from "./filter-logic";

interface SubcategoryOption {
	slug: string;
	name: string;
}

interface ProductFiltersProps {
	filters: CatalogFilters;
	onChange: (next: CatalogFilters) => void;
	/** Subcategory options to show. Omit to hide the subcategory group (e.g. a category page that drives it via its own nav). */
	subcategoryOptions?: SubcategoryOption[];
	brandOptions: string[];
	className?: string;
}

function FilterGroup({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="border-b border-border py-4 first:pt-0 last:border-b-0">
			<h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
			{children}
		</div>
	);
}

function toggle<T>(list: T[], value: T): T[] {
	return list.includes(value)
		? list.filter((v) => v !== value)
		: [...list, value];
}

function formatPriceLabel(n: number): string {
	if (n >= 1000) return `${Math.round(n / 1000)}rb`;
	return String(n);
}

export function ProductFilters({
	filters,
	onChange,
	subcategoryOptions,
	brandOptions,
	className,
}: ProductFiltersProps) {
	return (
		<div className={cn("flex flex-col", className)}>
			<FilterGroup title="Jenis hewan">
				<div className="flex flex-col gap-2.5">
					{PET_OPTIONS.map((option) => {
						const checked = filters.pets.includes(option.value);
						const id = `filter-pet-${option.value}`;
						return (
							<label
								key={option.value}
								htmlFor={id}
								className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm text-foreground"
							>
								<Checkbox
									id={id}
									checked={checked}
									onCheckedChange={() =>
										onChange({
											...filters,
											pets: toggle(filters.pets, option.value),
										})
									}
								/>
								{option.label}
							</label>
						);
					})}
				</div>
			</FilterGroup>

			{subcategoryOptions && subcategoryOptions.length > 0 ? (
				<FilterGroup title="Kategori">
					<div className="flex flex-col gap-2.5">
						{subcategoryOptions.map((option) => {
							const checked = filters.subcategories.includes(option.slug);
							const id = `filter-subcat-${option.slug}`;
							return (
								<label
									key={option.slug}
									htmlFor={id}
									className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm text-foreground"
								>
									<Checkbox
										id={id}
										checked={checked}
										onCheckedChange={() =>
											onChange({
												...filters,
												subcategories: toggle(
													filters.subcategories,
													option.slug,
												),
											})
										}
									/>
									{option.name}
								</label>
							);
						})}
					</div>
				</FilterGroup>
			) : null}

			<FilterGroup title="Harga">
				<div className="px-1">
					<Slider
						value={filters.priceRange}
						min={PRICE_MIN}
						max={PRICE_MAX}
						step={10000}
						onValueChange={(value) =>
							onChange({
								...filters,
								priceRange: (Array.isArray(value)
									? [value[0], value[1]]
									: [PRICE_MIN, value]) as [number, number],
							})
						}
						aria-label="Rentang harga"
					/>
					<div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
						<span>Rp {formatPriceLabel(filters.priceRange[0])}</span>
						<span>
							Rp {formatPriceLabel(filters.priceRange[1])}
							{filters.priceRange[1] >= PRICE_MAX ? "+" : ""}
						</span>
					</div>
				</div>
			</FilterGroup>

			<FilterGroup title="Rating minimum">
				<div className="flex flex-wrap gap-2">
					{[4, 3, 2, 1].map((rating) => {
						const active = filters.minRating === rating;
						return (
							<button
								key={rating}
								type="button"
								onClick={() =>
									onChange({
										...filters,
										minRating: active ? 0 : rating,
									})
								}
								aria-pressed={active}
								className={cn(
									"inline-flex min-h-9 items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
									active
										? "border-primary bg-primary/10 text-primary"
										: "border-border text-foreground hover:bg-muted",
								)}
							>
								<Star
									className={cn(
										"size-3.5",
										active
											? "fill-accent text-accent"
											: "fill-accent/60 text-accent",
									)}
								/>
								{rating}
								<span aria-hidden="true">+</span>
								<span className="sr-only">bintang ke atas</span>
							</button>
						);
					})}
				</div>
			</FilterGroup>

			{brandOptions.length > 0 ? (
				<FilterGroup title="Merek">
					<div className="flex max-h-56 flex-col gap-2.5 overflow-y-auto pr-1">
						{brandOptions.map((brand) => {
							const checked = filters.brands.includes(brand);
							const id = `filter-brand-${brand.replace(/\s+/g, "-")}`;
							return (
								<label
									key={brand}
									htmlFor={id}
									className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm text-foreground"
								>
									<Checkbox
										id={id}
										checked={checked}
										onCheckedChange={() =>
											onChange({
												...filters,
												brands: toggle(filters.brands, brand),
											})
										}
									/>
									{brand}
								</label>
							);
						})}
					</div>
				</FilterGroup>
			) : null}
		</div>
	);
}
