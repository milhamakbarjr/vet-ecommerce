import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Price } from "@/components/product/price";
import { RatingStars } from "@/components/product/rating-stars";
import { VetBadge } from "@/components/product/vet-badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart";
import type { Product } from "@/data/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
	product: Product;
	className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
	const { addItem } = useCart();

	const handleAdd = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		addItem(product.id, 1);
		toast.success("Ditambahkan ke keranjang", { description: product.name });
	};

	return (
		<div
			className={cn(
				"group/card relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md",
				className,
			)}
		>
			<Link
				to="/product/$slug"
				params={{ slug: product.slug }}
				className="flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				<div className="relative aspect-square overflow-hidden bg-muted">
					<img
						src={product.images[0]}
						alt={product.name}
						loading="lazy"
						className="size-full object-cover transition-transform duration-300 group-hover/card:scale-105"
					/>
					{product.vetRecommended ? (
						<div className="absolute left-2 top-2">
							<VetBadge compact />
						</div>
					) : null}
					{product.stockStatus === "low_stock" ? (
						<span className="absolute right-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[0.65rem] font-medium text-destructive">
							Stok terbatas
						</span>
					) : null}
				</div>

				<div className="flex flex-1 flex-col gap-1.5 p-3">
					<p className="text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
						{product.brand}
					</p>
					<h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
						{product.name}
					</h3>
					<RatingStars
						value={product.rating}
						count={product.reviewCount}
						size={13}
					/>
					<div className="mt-auto pt-1">
						<Price value={product.price} compareAt={product.compareAtPrice} />
					</div>
				</div>
			</Link>

			<div className="px-3 pb-3">
				<Button
					type="button"
					size="sm"
					className="w-full"
					onClick={handleAdd}
					aria-label={`Tambah ${product.name} ke keranjang`}
				>
					<Plus className="size-4" />
					Tambah ke Keranjang
				</Button>
			</div>
		</div>
	);
}
