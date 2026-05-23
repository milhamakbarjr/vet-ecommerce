import { useMemo, useState } from "react";

import { RatingStars } from "@/components/product/rating-stars";
import type { PetSpecies, Review } from "@/data/types";
import { formatDateID } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PET_LABEL } from "./filter-logic";

interface ReviewListProps {
	reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
	const [petFilter, setPetFilter] = useState<PetSpecies | "all">("all");

	const presentPets = useMemo(() => {
		const set = new Set<PetSpecies>();
		for (const r of reviews) set.add(r.petType);
		return Array.from(set);
	}, [reviews]);

	const filtered = useMemo(
		() =>
			petFilter === "all"
				? reviews
				: reviews.filter((r) => r.petType === petFilter),
		[reviews, petFilter],
	);

	if (reviews.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				Belum ada ulasan untuk produk ini. Jadilah yang pertama berbagi
				pengalaman.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-5">
			{presentPets.length > 1 ? (
				<div className="flex flex-wrap gap-2">
					<FilterPill
						active={petFilter === "all"}
						onClick={() => setPetFilter("all")}
					>
						Semua
					</FilterPill>
					{presentPets.map((pet) => (
						<FilterPill
							key={pet}
							active={petFilter === pet}
							onClick={() => setPetFilter(pet)}
						>
							{PET_LABEL[pet]}
						</FilterPill>
					))}
				</div>
			) : null}

			<ul className="flex flex-col divide-y divide-border">
				{filtered.map((review) => (
					<li key={review.id} className="py-4 first:pt-0">
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-2">
								<span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
									{review.author.slice(0, 2).toUpperCase()}
								</span>
								<div>
									<p className="text-sm font-medium text-foreground">
										{review.author}
									</p>
									<p className="text-xs text-muted-foreground">
										Pemilik {PET_LABEL[review.petType].toLowerCase()}
									</p>
								</div>
							</div>
							<span className="text-xs text-muted-foreground">
								{formatDateID(review.date)}
							</span>
						</div>
						<div className="mt-2">
							<RatingStars value={review.rating} size={14} showValue={false} />
						</div>
						{review.title ? (
							<p className="mt-2 text-sm font-medium text-foreground">
								{review.title}
							</p>
						) : null}
						<p className="mt-1 text-sm leading-relaxed text-muted-foreground">
							{review.body}
						</p>
						{review.photoUrl ? (
							<img
								src={review.photoUrl}
								alt={`Foto ulasan dari ${review.author}`}
								className="mt-3 size-20 rounded-lg border border-border object-cover"
							/>
						) : null}
					</li>
				))}
			</ul>

			{filtered.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					Belum ada ulasan dari kategori ini.
				</p>
			) : null}
		</div>
	);
}

function FilterPill({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			className={cn(
				"min-h-8 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
				active
					? "border-primary bg-primary/10 text-primary"
					: "border-border text-foreground hover:bg-muted",
			)}
		>
			{children}
		</button>
	);
}
