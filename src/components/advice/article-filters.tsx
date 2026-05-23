import { Sparkles } from "lucide-react";

import { PET_TYPE_FILTERS, TOPICS } from "@/components/advice/topics";
import type { ArticleTopic, PetSpecies } from "@/data/types";
import { cn } from "@/lib/utils";

interface ArticleFiltersProps {
	topic: ArticleTopic | "all";
	petType: PetSpecies | "all";
	onTopicChange: (topic: ArticleTopic | "all") => void;
	onPetTypeChange: (pet: PetSpecies | "all") => void;
	/** Only show pet filters that actually have articles. */
	availablePetTypes: PetSpecies[];
}

function Pill({
	active,
	onClick,
	children,
	label,
}: {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
	label: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			aria-label={label}
			className={cn(
				"inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors",
				active
					? "border-primary bg-primary text-primary-foreground"
					: "border-border bg-card text-foreground hover:bg-muted",
			)}
		>
			{children}
		</button>
	);
}

export function ArticleFilters({
	topic,
	petType,
	onTopicChange,
	onPetTypeChange,
	availablePetTypes,
}: ArticleFiltersProps) {
	const petFilters = PET_TYPE_FILTERS.filter((p) =>
		availablePetTypes.includes(p.key),
	);

	return (
		<div className="flex flex-col gap-4">
			<div>
				<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
					Topik
				</p>
				<div className="flex flex-wrap gap-2">
					<Pill
						active={topic === "all"}
						onClick={() => onTopicChange("all")}
						label="Tampilkan semua topik"
					>
						<Sparkles className="size-4" aria-hidden="true" />
						Semua
					</Pill>
					{TOPICS.map((t) => {
						const Icon = t.icon;
						return (
							<Pill
								key={t.slug}
								active={topic === t.slug}
								onClick={() => onTopicChange(t.slug)}
								label={`Saring topik ${t.label}`}
							>
								<Icon className="size-4" aria-hidden="true" />
								{t.label}
							</Pill>
						);
					})}
				</div>
			</div>

			<div>
				<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
					Jenis hewan
				</p>
				<div className="flex flex-wrap gap-2">
					<Pill
						active={petType === "all"}
						onClick={() => onPetTypeChange("all")}
						label="Tampilkan semua jenis hewan"
					>
						Semua hewan
					</Pill>
					{petFilters.map((p) => (
						<Pill
							key={p.key}
							active={petType === p.key}
							onClick={() => onPetTypeChange(p.key)}
							label={`Saring jenis hewan ${p.label}`}
						>
							{p.label}
						</Pill>
					))}
				</div>
			</div>
		</div>
	);
}
