import {
	Bird,
	Cat,
	Dog,
	Fish,
	type LucideIcon,
	PawPrint,
	Rabbit,
} from "lucide-react";
import { type ReactNode, useId, useState } from "react";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePetProfiles } from "@/context/pet-profile";
import type { PetSpecies } from "@/data/types";
import { cn } from "@/lib/utils";

const SPECIES_OPTIONS: {
	value: PetSpecies;
	label: string;
	icon: LucideIcon;
}[] = [
	{ value: "cat", label: "Kucing", icon: Cat },
	{ value: "dog", label: "Anjing", icon: Dog },
	{ value: "rabbit", label: "Kelinci", icon: Rabbit },
	{ value: "bird", label: "Burung", icon: Bird },
	{ value: "fish", label: "Ikan", icon: Fish },
	{ value: "other", label: "Lainnya", icon: PawPrint },
];

interface QuickProfileModalProps {
	/** The button/element that opens the dialog. */
	trigger: ReactNode;
	/** Called after a profile is created successfully. */
	onCreated?: () => void;
}

/**
 * Lightweight inline pet profile capture used on the home hero (Journey 1).
 * Built standalone so the home page never hard-depends on the Accounts agent's
 * full profile dialog. Writes through usePetProfiles.addProfile which fires the
 * pet_profile_completed analytics event.
 */
export function QuickProfileModal({
	trigger,
	onCreated,
}: QuickProfileModalProps) {
	const { addProfile } = usePetProfiles();
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [species, setSpecies] = useState<PetSpecies>("cat");
	const [ageMonths, setAgeMonths] = useState("");
	const [error, setError] = useState<string | null>(null);

	const nameId = useId();
	const ageId = useId();

	const reset = () => {
		setName("");
		setSpecies("cat");
		setAgeMonths("");
		setError(null);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) {
			setError("Beri tahu kami nama hewan kesayangan Anda dulu.");
			return;
		}
		const age = Number.parseInt(ageMonths, 10);
		const result = addProfile({
			name: trimmed,
			species,
			ageMonths: Number.isFinite(age) && age > 0 ? age : 24,
			sex: "unknown",
			neutered: "unknown",
		});
		if (!result.ok) {
			setError(result.message ?? "Profil tidak dapat disimpan.");
			return;
		}
		toast.success(`Profil ${trimmed} tersimpan`, {
			description: "Kami akan menyesuaikan rekomendasi untuknya.",
		});
		setOpen(false);
		reset();
		onCreated?.();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) reset();
			}}
		>
			<DialogTrigger render={trigger as React.ReactElement} />
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="font-display text-xl">
						Kenalkan hewan kesayangan Anda
					</DialogTitle>
					<DialogDescription>
						Cukup beberapa detail dan kami akan menampilkan makanan serta
						perawatan yang paling cocok untuknya.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor={nameId}>Nama hewan</Label>
						<Input
							id={nameId}
							value={name}
							onChange={(e) => {
								setName(e.target.value);
								if (error) setError(null);
							}}
							placeholder="Misalnya Mochi"
							className="h-11"
							autoComplete="off"
						/>
					</div>

					<fieldset className="flex flex-col gap-1.5">
						<legend className="mb-1.5 text-sm font-medium text-foreground">
							Jenis hewan
						</legend>
						<div className="grid grid-cols-3 gap-2">
							{SPECIES_OPTIONS.map((option) => {
								const Icon = option.icon;
								const selected = option.value === species;
								return (
									<button
										key={option.value}
										type="button"
										onClick={() => setSpecies(option.value)}
										aria-pressed={selected}
										className={cn(
											"flex min-h-11 flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors",
											selected
												? "border-primary bg-primary/5 text-primary"
												: "border-border text-muted-foreground hover:bg-muted",
										)}
									>
										<Icon className="size-5" aria-hidden="true" />
										{option.label}
									</button>
								);
							})}
						</div>
					</fieldset>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor={ageId}>Usia (bulan)</Label>
						<Input
							id={ageId}
							type="number"
							inputMode="numeric"
							min={0}
							max={360}
							value={ageMonths}
							onChange={(e) => setAgeMonths(e.target.value)}
							placeholder="Opsional, misalnya 24"
							className="h-11"
						/>
						<p className="text-xs text-muted-foreground">
							Tidak yakin? Kosongkan saja, Anda bisa melengkapinya nanti.
						</p>
					</div>

					{error ? (
						<p className="text-sm font-medium text-destructive" role="alert">
							{error}
						</p>
					) : null}

					<button
						type="submit"
						className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						Lihat rekomendasinya
					</button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
