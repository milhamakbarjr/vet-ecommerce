import type { LucideIcon } from "lucide-react";
import { PackageOpen } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	action?: ReactNode;
	className?: string;
}

export function EmptyState({
	icon: Icon = PackageOpen,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center",
				className,
			)}
		>
			<div className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
				<Icon className="size-7" aria-hidden="true" />
			</div>
			<h3 className="font-display text-lg font-semibold text-foreground">
				{title}
			</h3>
			{description ? (
				<p className="max-w-sm text-sm text-muted-foreground">{description}</p>
			) : null}
			{action ? <div className="mt-2">{action}</div> : null}
		</div>
	);
}
