import type { LucideIcon } from "lucide-react";
import { Apple, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";

import type { ArticleTopic, PetSpecies } from "@/data/types";

export interface TopicMeta {
	slug: ArticleTopic;
	label: string;
	description: string;
	icon: LucideIcon;
}

/** Topic metadata in Bahasa, ordered for the hub navigation. */
export const TOPICS: TopicMeta[] = [
	{
		slug: "nutrition",
		label: "Nutrisi",
		description: "Pilih makanan yang pas untuk usia dan kebutuhan hewanmu.",
		icon: Apple,
	},
	{
		slug: "preventive",
		label: "Perawatan Preventif",
		description: "Langkah sederhana yang mencegah masalah sebelum muncul.",
		icon: ShieldCheck,
	},
	{
		slug: "symptoms",
		label: "Gejala Umum",
		description: "Kenali tanda yang perlu diwaspadai pada hewan kesayangan.",
		icon: Stethoscope,
	},
	{
		slug: "breed",
		label: "Panduan Ras",
		description: "Cara merawat sesuai karakter dan kebutuhan tiap jenis hewan.",
		icon: HeartPulse,
	},
];

export function topicMeta(slug: ArticleTopic): TopicMeta {
	return TOPICS.find((t) => t.slug === slug) ?? TOPICS[0];
}

/** Pet species offered as filters on the hub plus the symptom checker. */
export const PET_TYPE_FILTERS: { key: PetSpecies; label: string }[] = [
	{ key: "dog", label: "Anjing" },
	{ key: "cat", label: "Kucing" },
	{ key: "rabbit", label: "Kelinci" },
	{ key: "bird", label: "Burung" },
	{ key: "fish", label: "Ikan" },
];

export function petLabel(species: PetSpecies): string {
	return PET_TYPE_FILTERS.find((p) => p.key === species)?.label ?? "Lainnya";
}
