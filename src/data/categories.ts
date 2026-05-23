import type { Category } from "@/data/types";

export const categories: Category[] = [
	{
		slug: "food",
		name: "Makanan & Nutrisi",
		tagline:
			"Pakan harian, makanan basah, dan camilan yang dipilih dokter hewan.",
		image:
			"https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=1200&q=80",
		subcategories: [
			{ slug: "dry-food", name: "Makanan Kering" },
			{ slug: "wet-food", name: "Makanan Basah" },
			{ slug: "treats", name: "Camilan" },
			{ slug: "prescription-diet", name: "Diet Khusus" },
			{ slug: "small-pet-food", name: "Pakan Hewan Kecil" },
		],
		featuredProductIds: ["p-001", "p-004", "p-010", "p-016", "p-021"],
	},
	{
		slug: "health",
		name: "Kesehatan & Obat",
		tagline:
			"Vitamin, obat cacing, dan perawatan rutin untuk hewan kesayangan.",
		image:
			"https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80",
		subcategories: [
			{ slug: "vitamins", name: "Vitamin & Suplemen" },
			{ slug: "flea-tick", name: "Anti Kutu & Caplak" },
			{ slug: "dewormer", name: "Obat Cacing" },
			{ slug: "dental", name: "Perawatan Gigi" },
			{ slug: "skin-coat", name: "Kulit & Bulu" },
		],
		featuredProductIds: ["p-031", "p-034", "p-038", "p-041", "p-044"],
	},
	{
		slug: "supplies",
		name: "Perlengkapan & Aksesori",
		tagline: "Tempat tidur, mainan, dan kebutuhan harian untuk hidup nyaman.",
		image:
			"https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&w=1200&q=80",
		subcategories: [
			{ slug: "bedding", name: "Tempat Tidur" },
			{ slug: "toys", name: "Mainan" },
			{ slug: "grooming", name: "Perawatan & Grooming" },
			{ slug: "feeding-gear", name: "Tempat Makan & Minum" },
			{ slug: "carriers", name: "Tas & Kandang" },
		],
		featuredProductIds: ["p-046", "p-049", "p-052", "p-055", "p-058"],
	},
];
