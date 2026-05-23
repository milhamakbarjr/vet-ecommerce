import type { PetSpecies, Sex, TriState } from "@/data/types";

export const SPECIES_OPTIONS: { value: PetSpecies; label: string }[] = [
	{ value: "dog", label: "Anjing" },
	{ value: "cat", label: "Kucing" },
	{ value: "rabbit", label: "Kelinci" },
	{ value: "bird", label: "Burung" },
	{ value: "fish", label: "Ikan" },
	{ value: "other", label: "Lainnya" },
];

export const SEX_OPTIONS: { value: Sex; label: string }[] = [
	{ value: "male", label: "Jantan" },
	{ value: "female", label: "Betina" },
	{ value: "unknown", label: "Tidak tahu" },
];

export const NEUTERED_OPTIONS: { value: TriState; label: string }[] = [
	{ value: "yes", label: "Sudah" },
	{ value: "no", label: "Belum" },
	{ value: "unknown", label: "Tidak tahu" },
];

const SPECIES_LABEL: Record<PetSpecies, string> = {
	dog: "Anjing",
	cat: "Kucing",
	rabbit: "Kelinci",
	bird: "Burung",
	fish: "Ikan",
	other: "Lainnya",
};

const SEX_LABEL: Record<Sex, string> = {
	male: "Jantan",
	female: "Betina",
	unknown: "Tidak diketahui",
};

export function speciesLabel(species: PetSpecies): string {
	return SPECIES_LABEL[species];
}

export function sexLabel(sex: Sex): string {
	return SEX_LABEL[sex];
}

/** 18 -> "1 tahun 6 bulan"; 5 -> "5 bulan". */
export function formatAge(ageMonths: number): string {
	if (ageMonths <= 0) return "Baru lahir";
	const years = Math.floor(ageMonths / 12);
	const months = ageMonths % 12;
	const parts: string[] = [];
	if (years > 0) parts.push(`${years} tahun`);
	if (months > 0) parts.push(`${months} bulan`);
	return parts.join(" ");
}

/** Age bracket label per FR-09 brackets. */
export function lifestageLabel(ageMonths: number): string {
	if (ageMonths <= 12) return "Anak (Puppy/Kitten)";
	if (ageMonths <= 24) return "Remaja";
	if (ageMonths <= 84) return "Dewasa";
	return "Senior";
}
