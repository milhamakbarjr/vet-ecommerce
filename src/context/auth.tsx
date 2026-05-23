import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { DEMO_EMAIL, demoUser } from "@/data/mock-user";
import type { Address, User } from "@/data/types";
import { uid } from "@/lib/ids";
import { STORAGE_KEYS, safeGet, safeRemove, safeSet } from "@/lib/storage";

interface AuthValue {
	user: User | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => { ok: boolean; message?: string };
	register: (data: {
		name: string;
		email: string;
		phone: string;
		password: string;
	}) => { ok: boolean; message?: string };
	logout: () => void;
	updateUser: (data: Partial<User>) => void;
	addAddress: (addr: Omit<Address, "id">) => void;
	updateAddress: (id: string, addr: Partial<Address>) => void;
	removeAddress: (id: string) => void;
}

const AuthContext = createContext<AuthValue | null>(null);

const MAX_ADDRESSES = 3;

function normalizeDefault(addresses: Address[]): Address[] {
	if (addresses.length === 0) return addresses;
	const hasDefault = addresses.some((a) => a.isDefault);
	if (hasDefault) {
		// Ensure only one default.
		let seen = false;
		return addresses.map((a) => {
			if (a.isDefault && !seen) {
				seen = true;
				return a;
			}
			return { ...a, isDefault: false };
		});
	}
	return addresses.map((a, i) => ({ ...a, isDefault: i === 0 }));
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<boolean>(false);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setUser(safeGet<User | null>(STORAGE_KEYS.user, null));
		setSession(safeGet<boolean>(STORAGE_KEYS.session, false));
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (!hydrated) return;
		if (user) safeSet(STORAGE_KEYS.user, user);
	}, [user, hydrated]);

	useEffect(() => {
		if (hydrated) safeSet(STORAGE_KEYS.session, session);
	}, [session, hydrated]);

	const login = useCallback(
		(email: string, _password: string): { ok: boolean; message?: string } => {
			const normalized = email.trim().toLowerCase();
			if (normalized === DEMO_EMAIL) {
				// Demo account: any password works. Restore demo data if no user stored yet.
				setUser((prev) => prev ?? demoUser);
				setSession(true);
				return { ok: true };
			}
			const stored = safeGet<User | null>(STORAGE_KEYS.user, null);
			if (stored && stored.email.toLowerCase() === normalized) {
				setUser(stored);
				setSession(true);
				return { ok: true };
			}
			return {
				ok: false,
				message:
					"Email tidak terdaftar. Gunakan demo@petsehat.id atau daftar terlebih dahulu.",
			};
		},
		[],
	);

	const register = useCallback(
		(data: {
			name: string;
			email: string;
			phone: string;
			password: string;
		}): { ok: boolean; message?: string } => {
			const newUser: User = {
				id: uid("user"),
				name: data.name.trim(),
				email: data.email.trim(),
				phone: data.phone.trim(),
				addresses: [],
			};
			setUser(newUser);
			setSession(true);
			safeSet(STORAGE_KEYS.user, newUser);
			return { ok: true };
		},
		[],
	);

	const logout = useCallback(() => {
		// Per FR: logging out clears the session flag but not the profile data.
		setSession(false);
		safeRemove(STORAGE_KEYS.session);
	}, []);

	const updateUser = useCallback((data: Partial<User>) => {
		setUser((prev) => (prev ? { ...prev, ...data, id: prev.id } : prev));
	}, []);

	const addAddress = useCallback((addr: Omit<Address, "id">) => {
		setUser((prev) => {
			if (!prev) return prev;
			if (prev.addresses.length >= MAX_ADDRESSES) return prev;
			const next: Address = { ...addr, id: uid("addr") };
			return {
				...prev,
				addresses: normalizeDefault([...prev.addresses, next]),
			};
		});
	}, []);

	const updateAddress = useCallback((id: string, addr: Partial<Address>) => {
		setUser((prev) => {
			if (!prev) return prev;
			const updated = prev.addresses.map((a) =>
				a.id === id ? { ...a, ...addr, id: a.id } : a,
			);
			return { ...prev, addresses: normalizeDefault(updated) };
		});
	}, []);

	const removeAddress = useCallback((id: string) => {
		setUser((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				addresses: normalizeDefault(prev.addresses.filter((a) => a.id !== id)),
			};
		});
	}, []);

	const value = useMemo<AuthValue>(
		() => ({
			user,
			isAuthenticated: session && user !== null,
			login,
			register,
			logout,
			updateUser,
			addAddress,
			updateAddress,
			removeAddress,
		}),
		[
			user,
			session,
			login,
			register,
			logout,
			updateUser,
			addAddress,
			updateAddress,
			removeAddress,
		],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
	const ctx = useContext(AuthContext);
	if (!ctx)
		throw new Error(
			"useAuth must be used within <AuthProvider> (see <AppProviders>).",
		);
	return ctx;
}
