import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import type {
	Address,
	Subscription,
	SubscriptionFrequency,
} from "@/data/types";
import { track } from "@/lib/analytics";
import { uid } from "@/lib/ids";
import { STORAGE_KEYS, safeGet, safeSet } from "@/lib/storage";

export interface AddSubscriptionInput {
	productId: string;
	productName: string;
	productImage: string;
	unitPrice: number; // after 5% discount, integer rupiah
	quantity: number;
	frequency: SubscriptionFrequency;
	address: Address;
	paymentMethod: string;
}

interface SubscriptionsValue {
	subscriptions: Subscription[];
	active: Subscription[];
	upcoming: Subscription | null;
	add: (input: AddSubscriptionInput) => Subscription;
	pause: (id: string) => void;
	cancel: (id: string) => void;
	setFrequency: (id: string, f: SubscriptionFrequency) => void;
	setQuantity: (id: string, q: number) => void;
}

const SubscriptionsContext = createContext<SubscriptionsValue | null>(null);

export const FREQUENCY_DAYS: Record<SubscriptionFrequency, number> = {
	biweekly: 14,
	monthly: 30,
	bimonthly: 60,
};

export const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
	biweekly: "Setiap 2 Minggu",
	monthly: "Setiap Bulan",
	bimonthly: "Setiap 2 Bulan",
};

function addDaysISO(fromISO: string, days: number): string {
	const d = new Date(fromISO);
	d.setDate(d.getDate() + days);
	return d.toISOString();
}

function firstDeliveryISO(): string {
	// First delivery is today + 1 day per FR-34.
	return addDaysISO(new Date().toISOString(), 1);
}

export function SubscriptionsProvider({ children }: { children: ReactNode }) {
	const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setSubscriptions(safeGet<Subscription[]>(STORAGE_KEYS.subscriptions, []));
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated) safeSet(STORAGE_KEYS.subscriptions, subscriptions);
	}, [subscriptions, hydrated]);

	const add = useCallback((input: AddSubscriptionInput): Subscription => {
		const sub: Subscription = {
			id: uid("sub"),
			productId: input.productId,
			productName: input.productName,
			productImage: input.productImage,
			unitPrice: input.unitPrice,
			quantity: input.quantity,
			frequency: input.frequency,
			nextDeliveryDate: firstDeliveryISO(),
			address: input.address,
			paymentMethod: input.paymentMethod,
			status: "active",
			paused: false,
			createdAt: new Date().toISOString(),
		};
		setSubscriptions((prev) => [sub, ...prev]);
		track("subscription_activated", {
			subscriptionId: sub.id,
			productId: sub.productId,
			frequency: sub.frequency,
		});
		return sub;
	}, []);

	const pause = useCallback((id: string) => {
		setSubscriptions((prev) =>
			prev.map((s) => {
				if (s.id !== id) return s;
				const nextPaused = !s.paused;
				// Pausing skips the next cycle by bumping the delivery date forward.
				const nextDate = nextPaused
					? addDaysISO(s.nextDeliveryDate, FREQUENCY_DAYS[s.frequency])
					: s.nextDeliveryDate;
				track("subscription_paused", {
					subscriptionId: s.id,
					paused: nextPaused,
				});
				return { ...s, paused: nextPaused, nextDeliveryDate: nextDate };
			}),
		);
	}, []);

	const cancel = useCallback((id: string) => {
		setSubscriptions((prev) =>
			prev.map((s) =>
				s.id === id
					? {
							...s,
							status: "cancelled" as const,
							cancelledAt: new Date().toISOString(),
						}
					: s,
			),
		);
		track("subscription_cancelled", { subscriptionId: id });
	}, []);

	const setFrequency = useCallback((id: string, f: SubscriptionFrequency) => {
		setSubscriptions((prev) =>
			prev.map((s) => {
				if (s.id !== id) return s;
				// Recompute next delivery from first-delivery baseline using the new cadence.
				return {
					...s,
					frequency: f,
					nextDeliveryDate: addDaysISO(firstDeliveryISO(), 0),
				};
			}),
		);
	}, []);

	const setQuantity = useCallback((id: string, q: number) => {
		const clamped = Math.min(99, Math.max(1, Math.round(q)));
		setSubscriptions((prev) =>
			prev.map((s) => (s.id === id ? { ...s, quantity: clamped } : s)),
		);
	}, []);

	const active = useMemo(
		() => subscriptions.filter((s) => s.status === "active"),
		[subscriptions],
	);

	const upcoming = useMemo(() => {
		const liveDeliveries = active
			.filter((s) => !s.paused)
			.slice()
			.sort(
				(a, b) => +new Date(a.nextDeliveryDate) - +new Date(b.nextDeliveryDate),
			);
		return liveDeliveries[0] ?? null;
	}, [active]);

	const value = useMemo<SubscriptionsValue>(
		() => ({
			subscriptions,
			active,
			upcoming,
			add,
			pause,
			cancel,
			setFrequency,
			setQuantity,
		}),
		[
			subscriptions,
			active,
			upcoming,
			add,
			pause,
			cancel,
			setFrequency,
			setQuantity,
		],
	);

	return (
		<SubscriptionsContext.Provider value={value}>
			{children}
		</SubscriptionsContext.Provider>
	);
}

export function useSubscriptions(): SubscriptionsValue {
	const ctx = useContext(SubscriptionsContext);
	if (!ctx)
		throw new Error(
			"useSubscriptions must be used within <SubscriptionsProvider> (see <AppProviders>).",
		);
	return ctx;
}
