import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";

interface VetBadgeProps {
	className?: string;
	/** Compact icon-and-short-label variant for dense cards. */
	compact?: boolean;
}

export function VetBadge({ className, compact = false }: VetBadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[0.7rem] font-semibold text-secondary-foreground ring-1 ring-accent/40",
				className,
			)}
		>
			<BadgeCheck className="size-3.5 text-primary" aria-hidden="true" />
			{compact ? "Dokter Hewan" : "Disetujui Dokter Hewan"}
		</span>
	);
}
