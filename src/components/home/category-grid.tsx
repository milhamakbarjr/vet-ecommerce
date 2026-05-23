import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { useCatalog } from "@/context/catalog";

export function CategoryGrid() {
	const { categories } = useCatalog();

	return (
		<div className="grid gap-4 md:grid-cols-3">
			{categories.map((category) => (
				<Link
					key={category.slug}
					to="/products/$category"
					params={{ category: category.slug }}
					className="group/cat relative flex min-h-44 flex-col justify-end overflow-hidden rounded-2xl border border-border outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
				>
					<img
						src={category.image}
						alt={`Produk kategori ${category.name}`}
						loading="lazy"
						className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/cat:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/35 to-transparent" />
					<div className="relative flex items-end justify-between gap-3 p-5">
						<div>
							<h3 className="font-display text-xl font-semibold text-background">
								{category.name}
							</h3>
							<p className="mt-1 max-w-xs text-sm text-background/85">
								{category.tagline}
							</p>
						</div>
						<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background/95 text-primary transition-transform group-hover/cat:translate-x-0.5 group-hover/cat:-translate-y-0.5">
							<ArrowUpRight className="size-5" aria-hidden="true" />
						</span>
					</div>
				</Link>
			))}
		</div>
	);
}
