import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { AppProviders } from "@/context/providers";
import { track } from "@/lib/analytics";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover",
			},
			{
				name: "theme-color",
				content: "#d65a4a",
			},
			{
				title: "PetSehat — Belanja kebutuhan hewan dengan panduan dokter",
			},
			{
				name: "description",
				content:
					"PetSehat adalah toko online kebutuhan hewan yang didukung panduan dokter hewan. Belanja makanan, obat, dan perlengkapan untuk anjing, kucing, kelinci, dan lainnya.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "manifest",
				href: "/manifest.json",
			},
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
	shellComponent: RootDocument,
	component: RootComponent,
});

function RootComponent() {
	useEffect(() => {
		track("session_start");
	}, []);

	return (
		<AppProviders>
			<AppShell>
				<Outlet />
			</AppShell>
		</AppProviders>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="id">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
