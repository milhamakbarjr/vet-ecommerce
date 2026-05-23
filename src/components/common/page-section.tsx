import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageSectionProps {
	title?: string;
	eyebrow?: string;
	description?: string;
	/** Right-aligned slot, typically a "Lihat semua" link supplied by the caller. */
	action?: ReactNode;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
	/** Render the title with the display serif font (Fraunces). */
	display?: boolean;
}

export function PageSection({
	title,
	eyebrow,
	description,
	action,
	children,
	className,
	contentClassName,
	display = true,
}: PageSectionProps) {
	return (
		<section className={cn("py-8 md:py-10", className)}>
			{title || action ? (
				<div className="mb-5 flex flex-wrap items-end justify-between gap-3">
					<div className="space-y-1">
						{eyebrow ? (
							<p className="text-xs font-semibold uppercase tracking-wide text-primary">
								{eyebrow}
							</p>
						) : null}
						{title ? (
							<h2
								className={cn(
									"text-2xl font-semibold text-foreground md:text-3xl",
									display && "font-display",
								)}
							>
								{title}
							</h2>
						) : null}
						{description ? (
							<p className="max-w-2xl text-sm text-muted-foreground">
								{description}
							</p>
						) : null}
					</div>
					{action ? <div className="shrink-0">{action}</div> : null}
				</div>
			) : null}
			<div className={contentClassName}>{children}</div>
		</section>
	);
}
