import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Shared chrome for the auth pages (login, register, forgot password). Centers a
 * branded card on a warm surface so the three flows feel like one family.
 */
export function AuthShell({
	title,
	subtitle,
	children,
	footer,
}: {
	title: string;
	subtitle: string;
	children: ReactNode;
	footer?: ReactNode;
}) {
	return (
		<div className="flex flex-col items-center py-10 md:py-16">
			<div className="w-full max-w-md">
				<Link
					to="/"
					className="mb-6 flex items-center justify-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					<PawPrint className="size-7 text-primary" aria-hidden="true" />
					<span className="font-display text-2xl font-bold tracking-tight text-primary">
						PetSehat
					</span>
				</Link>

				<div className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10 md:p-8">
					<div className="mb-6 space-y-1.5 text-center">
						<h1 className="font-display text-2xl font-bold text-foreground">
							{title}
						</h1>
						<p className="text-sm text-muted-foreground">{subtitle}</p>
					</div>
					{children}
				</div>

				{footer ? (
					<div className="mt-6 text-center text-sm text-muted-foreground">
						{footer}
					</div>
				) : null}
			</div>
		</div>
	);
}

/** Inline error banner shown above a form on a failed submit. */
export function AuthError({ message }: { message: string }) {
	return (
		<div
			role="alert"
			className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
		>
			{message}
		</div>
	);
}
