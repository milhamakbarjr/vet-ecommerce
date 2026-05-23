import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";

/**
 * Wraps account-only content. Auth state hydrates from localStorage in an
 * effect, so we hold rendering until mounted to avoid a hydration mismatch and
 * a flash of the login prompt for users who are already signed in. When the
 * visitor is not signed in we show a friendly prompt rather than hard redirect.
 */
export function AuthGate({
	title = "Masuk untuk melihat halaman ini",
	description = "Halaman ini berisi data akunmu. Masuk dulu untuk melanjutkan.",
	children,
}: {
	title?: string;
	description?: string;
	children: ReactNode;
}) {
	const { isAuthenticated } = useAuth();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<div className="flex min-h-[40vh] items-center justify-center py-16">
				<span className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
				<span className="sr-only">Memuat</span>
			</div>
		);
	}

	if (!isAuthenticated) {
		return (
			<div className="flex flex-col items-center justify-center gap-4 py-16 text-center md:py-24">
				<span className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
					<Lock className="size-8" aria-hidden="true" />
				</span>
				<h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
					{title}
				</h1>
				<p className="max-w-sm text-muted-foreground">{description}</p>
				<div className="flex flex-wrap justify-center gap-3">
					<Button size="lg" render={<Link to="/login" />}>
						Masuk
					</Button>
					<Button variant="outline" size="lg" render={<Link to="/register" />}>
						Daftar
					</Button>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
