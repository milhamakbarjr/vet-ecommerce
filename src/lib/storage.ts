/**
 * SSR-safe localStorage helpers. All access is guarded for `typeof window`.
 * Never call these during render on the server; they return the fallback there.
 */

export function safeGet<T>(key: string, fallback: T): T {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		if (raw === null) return fallback;
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

export function safeSet(key: string, value: unknown): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// quota or serialization failure: ignore in mock app
	}
}

export function safeRemove(key: string): void {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(key);
	} catch {
		// ignore
	}
}

export const STORAGE_KEYS = {
	cart: "petsehat_cart",
	promo: "petsehat_promo",
	profiles: "petsehat_profiles",
	activeProfile: "petsehat_active_profile",
	user: "petsehat_user",
	session: "petsehat_session",
	orders: "petsehat_orders",
	subscriptions: "petsehat_subscriptions",
} as const;
