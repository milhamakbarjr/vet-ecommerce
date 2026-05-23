import { Link, useNavigate } from "@tanstack/react-router";
import {
	Bird,
	Cat,
	Dog,
	Fish,
	LogOut,
	type LucideIcon,
	Menu,
	PawPrint,
	Plus,
	Rabbit,
	Search,
	ShoppingCart,
	User as UserIcon,
} from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/context/auth";
import { useCart } from "@/context/cart";
import { usePetProfiles } from "@/context/pet-profile";
import type { PetSpecies } from "@/data/types";
import { cn } from "@/lib/utils";

const SPECIES_ICON: Record<PetSpecies, LucideIcon> = {
	dog: Dog,
	cat: Cat,
	rabbit: Rabbit,
	bird: Bird,
	fish: Fish,
	other: PawPrint,
};

const NAV_LINKS = [
	{ to: "/", label: "Beranda" },
	{ to: "/products", label: "Produk" },
	{ to: "/advice", label: "Saran Dokter" },
] as const;

function Wordmark() {
	return (
		<Link
			to="/"
			className="flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
		>
			<PawPrint className="size-6 text-primary" aria-hidden="true" />
			<span className="font-display text-xl font-bold tracking-tight text-primary">
				PetSehat
			</span>
		</Link>
	);
}

function SearchBox({
	className,
	onSubmitted,
}: {
	className?: string;
	onSubmitted?: () => void;
}) {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");

	const submit = (e: React.FormEvent) => {
		e.preventDefault();
		const q = query.trim();
		navigate({ to: "/products", search: q ? { q } : {} });
		onSubmitted?.();
	};

	return (
		<search className={cn("block", className)}>
			<form onSubmit={submit} className="relative">
				<Search
					className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
					aria-hidden="true"
				/>
				<Input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Cari produk..."
					aria-label="Cari produk"
					className="h-10 pl-9"
				/>
			</form>
		</search>
	);
}

function PetProfileChip() {
	const { profiles, activeProfile, setActiveProfile } = usePetProfiles();
	const [open, setOpen] = useState(false);

	const ActiveIcon = activeProfile
		? SPECIES_ICON[activeProfile.species]
		: PawPrint;

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				render={
					<Button
						variant="outline"
						size="lg"
						className="h-10 gap-1.5"
						aria-label="Pilih profil hewan"
					>
						<ActiveIcon className="size-4 text-primary" />
						<span className="max-w-24 truncate">
							{activeProfile ? activeProfile.name : "Hewan saya"}
						</span>
					</Button>
				}
			/>
			<SheetContent side="right" className="w-80">
				<SheetHeader>
					<SheetTitle>Hewan kesayangan Anda</SheetTitle>
				</SheetHeader>
				<div className="flex flex-col gap-2 px-4">
					{profiles.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Belum ada profil hewan. Tambahkan agar rekomendasi lebih sesuai.
						</p>
					) : (
						profiles.map((profile) => {
							const Icon = SPECIES_ICON[profile.species];
							const isActive = profile.id === activeProfile?.id;
							return (
								<button
									key={profile.id}
									type="button"
									onClick={() => {
										setActiveProfile(profile.id);
										setOpen(false);
									}}
									className={cn(
										"flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
										isActive
											? "border-primary bg-primary/5"
											: "border-border hover:bg-muted",
									)}
								>
									<span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
										<Icon className="size-5" />
									</span>
									<span className="min-w-0">
										<span className="block truncate text-sm font-medium text-foreground">
											{profile.name}
										</span>
										{profile.breed ? (
											<span className="block truncate text-xs text-muted-foreground">
												{profile.breed}
											</span>
										) : null}
									</span>
								</button>
							);
						})
					)}
					<SheetClose
						render={
							<Link
								to="/account/pets"
								className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm font-medium text-primary hover:bg-muted"
							>
								<Plus className="size-4" />
								Tambah hewan
							</Link>
						}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
}

function AccountAffordance() {
	const { isAuthenticated, user, logout } = useAuth();

	if (!isAuthenticated || !user) {
		return (
			<Button
				variant="outline"
				size="lg"
				className="h-10"
				render={<Link to="/login" />}
			>
				<UserIcon className="size-4" />
				<span className="hidden sm:inline">Masuk</span>
			</Button>
		);
	}

	const initials = user.name
		.split(" ")
		.map((p) => p[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant="ghost"
						size="icon-lg"
						className="rounded-full"
						aria-label="Menu akun"
					>
						<Avatar className="size-9">
							<AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-semibold">
								{initials}
							</AvatarFallback>
						</Avatar>
					</Button>
				}
			/>
			<DropdownMenuContent align="end" className="w-52">
				<DropdownMenuLabel className="truncate">{user.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem render={<Link to="/account" />}>
					Akun saya
				</DropdownMenuItem>
				<DropdownMenuItem render={<Link to="/account/orders" />}>
					Pesanan
				</DropdownMenuItem>
				<DropdownMenuItem render={<Link to="/account/subscriptions" />}>
					Langganan
				</DropdownMenuItem>
				<DropdownMenuItem render={<Link to="/account/pets" />}>
					Profil hewan
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => logout()}>
					<LogOut className="size-4" />
					Keluar
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function CartButton() {
	const { count } = useCart();
	return (
		<Button
			variant="ghost"
			size="icon-lg"
			className="relative"
			aria-label={`Keranjang, ${count} item`}
			render={<Link to="/cart" />}
		>
			<ShoppingCart className="size-5" />
			{count > 0 ? (
				<span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[0.65rem] font-bold text-primary-foreground">
					{count > 99 ? "99+" : count}
				</span>
			) : null}
		</Button>
	);
}

function MobileMenu() {
	const [open, setOpen] = useState(false);
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger
				render={
					<Button
						variant="ghost"
						size="icon-lg"
						className="md:hidden"
						aria-label="Buka menu"
					>
						<Menu className="size-5" />
					</Button>
				}
			/>
			<SheetContent side="left" className="w-72">
				<SheetHeader>
					<SheetTitle>
						<Wordmark />
					</SheetTitle>
				</SheetHeader>
				<nav className="flex flex-col gap-1 px-4">
					{NAV_LINKS.map((link) => (
						<SheetClose
							key={link.to}
							render={
								<Link
									to={link.to}
									className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground hover:bg-muted"
								/>
							}
						>
							{link.label}
						</SheetClose>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}

export function SiteHeader() {
	return (
		<header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
			<div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
				<MobileMenu />
				<Wordmark />

				<nav className="ml-4 hidden items-center gap-1 md:flex">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&.active]:text-primary"
							activeOptions={{ exact: link.to === "/" }}
						>
							{link.label}
						</Link>
					))}
				</nav>

				<SearchBox className="ml-auto hidden max-w-xs flex-1 lg:block" />

				<div className="ml-auto flex items-center gap-1.5 lg:ml-3">
					<div className="hidden sm:block">
						<PetProfileChip />
					</div>
					<CartButton />
					<AccountAffordance />
				</div>
			</div>

			{/* Mobile search row */}
			<div className="border-t border-border px-4 py-2 lg:hidden">
				<SearchBox />
			</div>
		</header>
	);
}
