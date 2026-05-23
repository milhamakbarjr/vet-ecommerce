import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { getProductById } from "@/data/products";
import type { CartItem, PromoCode } from "@/data/types";
import { track } from "@/lib/analytics";
import { STORAGE_KEYS, safeGet, safeSet } from "@/lib/storage";

interface CartValue {
	items: CartItem[];
	count: number;
	addItem: (productId: string, qty?: number) => void;
	removeItem: (productId: string) => void;
	setQuantity: (productId: string, qty: number) => void;
	clear: () => void;
	subtotal: number;
	promo: PromoCode | null;
	applyPromo: (code: string) => { ok: boolean; message: string };
	clearPromo: () => void;
	discount: number;
}

const CartContext = createContext<CartValue | null>(null);

const PROMOS: Record<string, PromoCode> = {
	PETSEHAT10: {
		code: "PETSEHAT10",
		type: "percent",
		value: 10,
		label: "Diskon 10%",
	},
	GRATIS5: {
		code: "GRATIS5",
		type: "fixed",
		value: 5000,
		label: "Potongan Rp 5.000",
	},
};

const MIN_QTY = 1;
const MAX_QTY = 99;

function clampQty(qty: number): number {
	if (Number.isNaN(qty)) return MIN_QTY;
	return Math.min(MAX_QTY, Math.max(MIN_QTY, Math.round(qty)));
}

export function CartProvider({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<CartItem[]>([]);
	const [promo, setPromo] = useState<PromoCode | null>(null);
	const [hydrated, setHydrated] = useState(false);

	// Hydrate from storage on mount only (SSR-safe).
	useEffect(() => {
		setItems(safeGet<CartItem[]>(STORAGE_KEYS.cart, []));
		setPromo(safeGet<PromoCode | null>(STORAGE_KEYS.promo, null));
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated) safeSet(STORAGE_KEYS.cart, items);
	}, [items, hydrated]);

	useEffect(() => {
		if (hydrated) safeSet(STORAGE_KEYS.promo, promo);
	}, [promo, hydrated]);

	const addItem = useCallback((productId: string, qty = 1) => {
		setItems((prev) => {
			const existing = prev.find((i) => i.productId === productId);
			if (existing) {
				return prev.map((i) =>
					i.productId === productId
						? { ...i, quantity: clampQty(i.quantity + qty) }
						: i,
				);
			}
			return [...prev, { productId, quantity: clampQty(qty) }];
		});
		const product = getProductById(productId);
		track("add_to_cart", {
			productId,
			quantity: qty,
			name: product?.name,
			price: product?.price,
		});
	}, []);

	const removeItem = useCallback((productId: string) => {
		setItems((prev) => prev.filter((i) => i.productId !== productId));
	}, []);

	const setQuantity = useCallback((productId: string, qty: number) => {
		setItems((prev) => {
			if (qty <= 0) return prev.filter((i) => i.productId !== productId);
			return prev.map((i) =>
				i.productId === productId ? { ...i, quantity: clampQty(qty) } : i,
			);
		});
	}, []);

	const clear = useCallback(() => {
		setItems([]);
		setPromo(null);
	}, []);

	const subtotal = useMemo(
		() =>
			items.reduce((sum, item) => {
				const product = getProductById(item.productId);
				return sum + (product?.price ?? 0) * item.quantity;
			}, 0),
		[items],
	);

	const discount = useMemo(() => {
		if (!promo) return 0;
		if (promo.type === "percent") {
			return Math.round((subtotal * promo.value) / 100);
		}
		return Math.min(promo.value, subtotal);
	}, [promo, subtotal]);

	const applyPromo = useCallback(
		(code: string): { ok: boolean; message: string } => {
			const normalized = code.trim().toUpperCase();
			const found = PROMOS[normalized];
			if (!found) {
				return { ok: false, message: "Kode promo tidak ditemukan." };
			}
			setPromo(found);
			return { ok: true, message: `${found.label} berhasil diterapkan.` };
		},
		[],
	);

	const clearPromo = useCallback(() => setPromo(null), []);

	const count = useMemo(
		() => items.reduce((sum, i) => sum + i.quantity, 0),
		[items],
	);

	const value = useMemo<CartValue>(
		() => ({
			items,
			count,
			addItem,
			removeItem,
			setQuantity,
			clear,
			subtotal,
			promo,
			applyPromo,
			clearPromo,
			discount,
		}),
		[
			items,
			count,
			addItem,
			removeItem,
			setQuantity,
			clear,
			subtotal,
			promo,
			applyPromo,
			clearPromo,
			discount,
		],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
	const ctx = useContext(CartContext);
	if (!ctx)
		throw new Error(
			"useCart must be used within <CartProvider> (see <AppProviders>).",
		);
	return ctx;
}
