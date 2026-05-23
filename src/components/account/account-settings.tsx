import { useEffect, useId, useState } from "react";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { safeGet, safeSet } from "@/lib/storage";
import { cn } from "@/lib/utils";

// Not part of the shared storage contract; account settings are cosmetic in v1.
const SETTINGS_KEY = "petsehat_settings";

interface AccountPrefs {
	language: "id" | "en";
	orderUpdates: boolean;
	promotions: boolean;
	vetTips: boolean;
}

const DEFAULT_PREFS: AccountPrefs = {
	language: "id",
	orderUpdates: true,
	promotions: true,
	vetTips: false,
};

const LANGUAGE_OPTIONS = [
	{ value: "id", label: "Bahasa Indonesia" },
	{ value: "en", label: "English" },
];

const TOGGLES: { key: keyof AccountPrefs; label: string; hint: string }[] = [
	{
		key: "orderUpdates",
		label: "Status pesanan",
		hint: "Kabari aku saat pesanan dikemas, dikirim, dan tiba.",
	},
	{
		key: "promotions",
		label: "Promo dan penawaran",
		hint: "Diskon, bundel hemat, dan kejutan musiman.",
	},
	{
		key: "vetTips",
		label: "Tips dari dokter hewan",
		hint: "Artikel perawatan singkat sesuai hewan kesayanganmu.",
	},
];

function Toggle({
	id,
	checked,
	onChange,
	label,
}: {
	id: string;
	checked: boolean;
	onChange: (next: boolean) => void;
	label: string;
}) {
	return (
		<button
			id={id}
			type="button"
			role="switch"
			aria-checked={checked}
			aria-label={label}
			onClick={() => onChange(!checked)}
			className={cn(
				"relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
				checked ? "bg-primary" : "bg-muted-foreground/30",
			)}
		>
			<span
				className={cn(
					"inline-block size-5 transform rounded-full bg-background shadow transition-transform",
					checked ? "translate-x-5" : "translate-x-0.5",
				)}
			/>
		</button>
	);
}

export function AccountSettings() {
	const fieldId = useId();
	const [prefs, setPrefs] = useState<AccountPrefs>(DEFAULT_PREFS);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setPrefs(safeGet<AccountPrefs>(SETTINGS_KEY, DEFAULT_PREFS));
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (hydrated) safeSet(SETTINGS_KEY, prefs);
	}, [prefs, hydrated]);

	const update = <K extends keyof AccountPrefs>(
		key: K,
		value: AccountPrefs[K],
	) => {
		setPrefs((prev) => ({ ...prev, [key]: value }));
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1.5 sm:max-w-xs">
				<Label htmlFor={`${fieldId}-lang`}>Bahasa</Label>
				<Select
					value={prefs.language}
					onValueChange={(v) =>
						update("language", v as AccountPrefs["language"])
					}
					items={LANGUAGE_OPTIONS}
				>
					<SelectTrigger id={`${fieldId}-lang`} className="h-10 w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{LANGUAGE_OPTIONS.map((o) => (
							<SelectItem key={o.value} value={o.value}>
								{o.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-3">
				<p className="text-sm font-medium text-foreground">Notifikasi</p>
				<div className="flex flex-col divide-y divide-border rounded-xl border border-border">
					{TOGGLES.map((t) => (
						<div
							key={t.key}
							className="flex items-center justify-between gap-4 px-4 py-3"
						>
							<div className="min-w-0">
								<p className="text-sm font-medium text-foreground">{t.label}</p>
								<p className="text-xs text-muted-foreground">{t.hint}</p>
							</div>
							<Toggle
								id={`${fieldId}-${t.key}`}
								label={t.label}
								checked={prefs[t.key] as boolean}
								onChange={(next) => update(t.key, next)}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
