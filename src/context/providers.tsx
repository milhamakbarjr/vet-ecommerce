import type { ReactNode } from "react";

import { AuthProvider } from "@/context/auth";
import { CartProvider } from "@/context/cart";
import { CatalogProvider } from "@/context/catalog";
import { OrdersProvider } from "@/context/orders";
import { PetProfileProvider } from "@/context/pet-profile";
import { SubscriptionsProvider } from "@/context/subscriptions";

/**
 * Composes every app provider in dependency order. Catalog is static and outermost;
 * auth/orders/subscriptions depend on the user session conceptually but are independent
 * at runtime, so ordering here favours readability.
 */
export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<CatalogProvider>
			<AuthProvider>
				<PetProfileProvider>
					<CartProvider>
						<OrdersProvider>
							<SubscriptionsProvider>{children}</SubscriptionsProvider>
						</OrdersProvider>
					</CartProvider>
				</PetProfileProvider>
			</AuthProvider>
		</CatalogProvider>
	);
}
