import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/data/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
	products: Product[];
	className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
	return (
		<div
			className={cn(
				"grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4",
				className,
			)}
		>
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
