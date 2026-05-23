import {
	Bird,
	Cat,
	Dog,
	Fish,
	type LucideIcon,
	PawPrint,
	Rabbit,
} from "lucide-react";

import type { PetSpecies } from "@/data/types";
import { cn } from "@/lib/utils";

const SPECIES_ICON: Record<PetSpecies, LucideIcon> = {
	dog: Dog,
	cat: Cat,
	rabbit: Rabbit,
	bird: Bird,
	fish: Fish,
	other: PawPrint,
};

// Each species gets its own warm tint drawn from the palette so the generated
// illustration never collapses into a flat grayscale chip.
const SPECIES_TINT: Record<PetSpecies, string> = {
	dog: "bg-secondary text-primary",
	cat: "bg-accent/40 text-accent-foreground",
	rabbit: "bg-primary/10 text-primary",
	bird: "bg-accent/30 text-accent-foreground",
	fish: "bg-secondary text-primary",
	other: "bg-muted text-primary",
};

const SIZE_CLASS = {
	sm: "size-9 [&_svg]:size-4",
	md: "size-12 [&_svg]:size-6",
	lg: "size-16 [&_svg]:size-8",
} as const;

export function speciesIcon(species: PetSpecies): LucideIcon {
	return SPECIES_ICON[species];
}

interface SpeciesAvatarProps {
	species: PetSpecies;
	size?: keyof typeof SIZE_CLASS;
	className?: string;
}

/**
 * Generated illustrative avatar by species (no photo upload per FR). Uses a
 * per-species lucide glyph on a tinted surface from the palette.
 */
export function SpeciesAvatar({
	species,
	size = "md",
	className,
}: SpeciesAvatarProps) {
	const Icon = SPECIES_ICON[species];
	return (
		<span
			aria-hidden="true"
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full",
				SPECIES_TINT[species],
				SIZE_CLASS[size],
				className,
			)}
		>
			<Icon />
		</span>
	);
}
