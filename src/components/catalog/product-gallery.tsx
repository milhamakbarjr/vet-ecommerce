import { useState } from "react";

import { cn } from "@/lib/utils";

interface ProductGalleryProps {
	images: string[];
	alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
	const [active, setActive] = useState(0);
	const safeImages = images.length > 0 ? images : [""];
	const current = Math.min(active, safeImages.length - 1);

	return (
		<div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
			{/* Main image. On mobile this is a horizontal swipe strip. */}
			<div className="min-w-0 flex-1">
				{/* Mobile: swipeable strip */}
				<div className="flex snap-x snap-mandatory gap-3 overflow-x-auto rounded-2xl md:hidden">
					{safeImages.map((src, i) => (
						<img
							key={src}
							src={src}
							alt={`${alt}, foto ${i + 1} dari ${safeImages.length}`}
							className="aspect-square w-full shrink-0 snap-center rounded-2xl border border-border bg-muted object-cover"
						/>
					))}
				</div>

				{/* Desktop: single selected image */}
				<div className="hidden aspect-square overflow-hidden rounded-2xl border border-border bg-muted md:block">
					<img
						src={safeImages[current]}
						alt={`${alt}, foto ${current + 1} dari ${safeImages.length}`}
						className="size-full object-cover"
					/>
				</div>
			</div>

			{/* Thumbnails (desktop) */}
			{safeImages.length > 1 ? (
				<div className="hidden gap-2 md:flex md:flex-col">
					{safeImages.map((src, i) => (
						<button
							key={`thumb-${src}`}
							type="button"
							onClick={() => setActive(i)}
							aria-label={`Lihat foto ${i + 1}`}
							aria-current={i === current}
							className={cn(
								"size-16 overflow-hidden rounded-lg border-2 bg-muted transition-colors",
								i === current
									? "border-primary"
									: "border-transparent hover:border-border",
							)}
						>
							<img
								src={src}
								alt=""
								aria-hidden="true"
								className="size-full object-cover"
							/>
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}
