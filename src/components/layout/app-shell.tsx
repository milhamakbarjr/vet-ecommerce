import type { ReactNode } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface AppShellProps {
	children: ReactNode;
	/** Constrain main content to the standard 1280px container. Set false for full-bleed pages. */
	contained?: boolean;
	className?: string;
}

export function AppShell({
	children,
	contained = true,
	className,
}: AppShellProps) {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<SiteHeader />
			<main
				className={cn(
					// Bottom padding leaves room for the mobile tab bar.
					"flex-1 pb-20 md:pb-0",
					contained && "mx-auto w-full max-w-7xl px-4",
					className,
				)}
			>
				{children}
			</main>
			<SiteFooter />
			<MobileNav />
			<Toaster position="top-center" richColors />
		</div>
	);
}
