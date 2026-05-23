import { Stethoscope } from "lucide-react";

import { cn } from "@/lib/utils";

interface VetBylineProps {
	name: string;
	credential: string;
	/** Optional supporting line, e.g. read time and publish date. */
	meta?: string;
	className?: string;
	/** Larger treatment for article and guide detail headers. */
	size?: "sm" | "md";
}

/** Vet author byline with avatar mark, used across articles, guides, and results. */
export function VetByline({
	name,
	credential,
	meta,
	className,
	size = "sm",
}: VetBylineProps) {
	const initials = name
		.replace(/^drh\.?\s*/i, "")
		.split(" ")
		.map((p) => p[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<span
				className={cn(
					"relative flex shrink-0 items-center justify-center rounded-full bg-secondary font-semibold text-secondary-foreground ring-1 ring-accent/40",
					size === "md" ? "size-11 text-base" : "size-9 text-sm",
				)}
				aria-hidden="true"
			>
				{initials}
				<span className="absolute -bottom-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
					<Stethoscope className="size-2.5" />
				</span>
			</span>
			<div className="min-w-0">
				<p
					className={cn(
						"truncate font-medium text-foreground",
						size === "md" ? "text-sm" : "text-sm",
					)}
				>
					{name}
				</p>
				<p className="truncate text-xs text-muted-foreground">{credential}</p>
				{meta ? (
					<p className="truncate text-xs text-muted-foreground">{meta}</p>
				) : null}
			</div>
		</div>
	);
}
