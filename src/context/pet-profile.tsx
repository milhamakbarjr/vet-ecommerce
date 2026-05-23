import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import type { PetProfile } from "@/data/types";
import { track } from "@/lib/analytics";
import { uid } from "@/lib/ids";
import { STORAGE_KEYS, safeGet, safeSet } from "@/lib/storage";

interface PetProfileValue {
	profiles: PetProfile[];
	activeProfile: PetProfile | null;
	activeProfileId: string | null;
	setActiveProfile: (id: string | null) => void;
	addProfile: (data: Omit<PetProfile, "id" | "createdAt">) => {
		ok: boolean;
		message?: string;
	};
	updateProfile: (id: string, data: Partial<PetProfile>) => void;
	deleteProfile: (id: string) => void;
}

const PetProfileContext = createContext<PetProfileValue | null>(null);

const MAX_PROFILES = 5;

export function PetProfileProvider({ children }: { children: ReactNode }) {
	const [profiles, setProfiles] = useState<PetProfile[]>([]);
	const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setProfiles(safeGet<PetProfile[]>(STORAGE_KEYS.profiles, []));
		setActiveProfileId(
			safeGet<string | null>(STORAGE_KEYS.activeProfile, null),
		);
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated) safeSet(STORAGE_KEYS.profiles, profiles);
	}, [profiles, hydrated]);

	useEffect(() => {
		if (hydrated) safeSet(STORAGE_KEYS.activeProfile, activeProfileId);
	}, [activeProfileId, hydrated]);

	const setActiveProfile = useCallback((id: string | null) => {
		setActiveProfileId(id);
	}, []);

	const addProfile = useCallback(
		(
			data: Omit<PetProfile, "id" | "createdAt">,
		): { ok: boolean; message?: string } => {
			let result: { ok: boolean; message?: string } = { ok: true };
			setProfiles((prev) => {
				if (prev.length >= MAX_PROFILES) {
					result = {
						ok: false,
						message:
							"Anda dapat mengelola hingga 5 hewan. Hapus salah satu profil untuk menambah yang baru.",
					};
					return prev;
				}
				const profile: PetProfile = {
					...data,
					id: uid("pet"),
					createdAt: new Date().toISOString(),
				};
				// Newly added profile becomes active.
				setActiveProfileId(profile.id);
				track("pet_profile_completed", { species: profile.species });
				return [...prev, profile];
			});
			return result;
		},
		[],
	);

	const updateProfile = useCallback((id: string, data: Partial<PetProfile>) => {
		setProfiles((prev) =>
			prev.map((p) => (p.id === id ? { ...p, ...data, id: p.id } : p)),
		);
	}, []);

	const deleteProfile = useCallback((id: string) => {
		setProfiles((prev) => {
			const remaining = prev.filter((p) => p.id !== id);
			// Reassign active profile per FR-10.
			setActiveProfileId((currentActive) => {
				if (currentActive !== id) return currentActive;
				return remaining[0]?.id ?? null;
			});
			return remaining;
		});
	}, []);

	const activeProfile = useMemo(
		() => profiles.find((p) => p.id === activeProfileId) ?? null,
		[profiles, activeProfileId],
	);

	const value = useMemo<PetProfileValue>(
		() => ({
			profiles,
			activeProfile,
			activeProfileId,
			setActiveProfile,
			addProfile,
			updateProfile,
			deleteProfile,
		}),
		[
			profiles,
			activeProfile,
			activeProfileId,
			setActiveProfile,
			addProfile,
			updateProfile,
			deleteProfile,
		],
	);

	return (
		<PetProfileContext.Provider value={value}>
			{children}
		</PetProfileContext.Provider>
	);
}

export function usePetProfiles(): PetProfileValue {
	const ctx = useContext(PetProfileContext);
	if (!ctx)
		throw new Error(
			"usePetProfiles must be used within <PetProfileProvider> (see <AppProviders>).",
		);
	return ctx;
}
