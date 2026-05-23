import { Link } from "@tanstack/react-router";
import {
	Home,
	type LucideIcon,
	ShoppingBag,
	ShoppingCart,
	Stethoscope,
	User as UserIcon,
} from "lucide-react";

import { useCart } from "@/context/cart";

interface NavItem {
	to: string;
	label: string;
	icon: LucideIcon;
	exact?: boolean;
}

const ITEMS: NavItem[] = [
	{ to: "/", label: "Beranda", icon: Home, exact: true },
	{ to: "/products", label: "Produk", icon: ShoppingBag },
	{ to: "/advice", label: "Saran", icon: Stethoscope },
	{ to: "/cart", label: "Keranjang", icon: ShoppingCart },
	{ to: "/account", label: "Akun", icon: UserIcon },
];

export function MobileNav() {
	const { count } = useCart();

	return (
		<nav
			className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden"
			aria-label="Navigasi utama"
		>
			<ul className="mx-auto flex max-w-md items-stretch justify-around">
				{ITEMS.map((item) => {
					const Icon = item.icon;
					const isCart = item.to === "/cart";
					return (
						<li key={item.to} className="flex-1">
							<Link
								to={item.to}
								activeOptions={{ exact: item.exact }}
								className="relative flex min-h-14 flex-col items-center justify-center gap-0.5 py-1.5 text-[0.65rem] font-medium text-muted-foreground transition-colors [&.active]:text-primary"
								aria-label={item.label}
							>
								<span className="relative">
									<Icon className="size-5" />
									{isCart && count > 0 ? (
										<span className="absolute -right-2 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.55rem] font-bold text-primary-foreground">
											{count > 99 ? "99+" : count}
										</span>
									) : null}
								</span>
								{item.label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
