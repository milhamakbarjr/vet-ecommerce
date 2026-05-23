import { useId, useState } from "react";

import {
	NEUTERED_OPTIONS,
	SEX_OPTIONS,
	SPECIES_OPTIONS,
} from "@/components/account/pet-labels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PetProfile, PetSpecies, Sex, TriState } from "@/data/types";
import { cn } from "@/lib/utils";

export type PetProfileFormValues = Omit<PetProfile, "id" | "createdAt">;

interface PetProfileFormProps {
	/** Existing profile to edit; omit for a new profile. */
	initial?: PetProfile;
	onSubmit: (values: PetProfileFormValues) => void;
	onCancel?: () => void;
	submitLabel?: string;
	/** Disable submit while a parent action is pending. */
	busy?: boolean;
}

const HEALTH_NOTES_MAX = 500;

interface FieldState {
	name: string;
	species: PetSpecies | "";
	breed: string;
	ageMonths: string;
	weightKg: string;
	sex: Sex | "";
	neutered: TriState;
	healthNotes: string;
}

type Errors = Partial<Record<keyof FieldState, string>>;

function toFieldState(profile?: PetProfile): FieldState {
	return {
		name: profile?.name ?? "",
		species: profile?.species ?? "",
		breed: profile?.breed ?? "",
		ageMonths:
			profile?.ageMonths !== undefined ? String(profile.ageMonths) : "",
		weightKg: profile?.weightKg !== undefined ? String(profile.weightKg) : "",
		sex: profile?.sex ?? "",
		neutered: profile?.neutered ?? "unknown",
		healthNotes: profile?.healthNotes ?? "",
	};
}

export function PetProfileForm({
	initial,
	onSubmit,
	onCancel,
	submitLabel = "Simpan profil",
	busy = false,
}: PetProfileFormProps) {
	const fieldId = useId();
	const [fields, setFields] = useState<FieldState>(() => toFieldState(initial));
	const [errors, setErrors] = useState<Errors>({});

	const set = <K extends keyof FieldState>(key: K, value: FieldState[K]) => {
		setFields((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	const validate = (): { ok: boolean; values?: PetProfileFormValues } => {
		const next: Errors = {};
		const name = fields.name.trim();
		if (!name) next.name = "Nama hewan wajib diisi.";
		if (!fields.species) next.species = "Pilih jenis hewan.";

		const ageRaw = fields.ageMonths.trim();
		const age = Number(ageRaw);
		if (!ageRaw) {
			next.ageMonths = "Usia wajib diisi.";
		} else if (!Number.isFinite(age) || age < 0 || age > 600) {
			next.ageMonths = "Masukkan usia yang valid dalam bulan.";
		}

		let weight: number | undefined;
		const weightRaw = fields.weightKg.trim();
		if (weightRaw) {
			weight = Number(weightRaw);
			if (!Number.isFinite(weight) || weight <= 0 || weight > 200) {
				next.weightKg = "Masukkan berat yang valid dalam kg.";
			}
		}

		if (!fields.sex) next.sex = "Pilih jenis kelamin.";

		if (fields.healthNotes.length > HEALTH_NOTES_MAX) {
			next.healthNotes = `Maksimal ${HEALTH_NOTES_MAX} karakter.`;
		}

		setErrors(next);
		if (Object.keys(next).length > 0) return { ok: false };

		const values: PetProfileFormValues = {
			name,
			species: fields.species as PetSpecies,
			breed: fields.breed.trim() || undefined,
			ageMonths: Math.round(age),
			weightKg: weight,
			sex: fields.sex as Sex,
			neutered: fields.neutered,
			healthNotes: fields.healthNotes.trim() || undefined,
		};
		return { ok: true, values };
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const result = validate();
		if (result.ok && result.values) onSubmit(result.values);
	};

	const notesLeft = HEALTH_NOTES_MAX - fields.healthNotes.length;

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
			<div className="flex flex-col gap-1.5">
				<Label htmlFor={`${fieldId}-name`}>
					Nama hewan <span className="text-primary">*</span>
				</Label>
				<Input
					id={`${fieldId}-name`}
					value={fields.name}
					onChange={(e) => set("name", e.target.value)}
					placeholder="Contoh: Bruno"
					aria-invalid={!!errors.name}
					autoComplete="off"
				/>
				{errors.name ? (
					<p className="text-xs text-destructive">{errors.name}</p>
				) : null}
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-species`}>
						Jenis hewan <span className="text-primary">*</span>
					</Label>
					<Select
						value={fields.species}
						onValueChange={(v) => set("species", v as PetSpecies)}
						items={SPECIES_OPTIONS}
					>
						<SelectTrigger
							id={`${fieldId}-species`}
							className="h-10 w-full"
							aria-invalid={!!errors.species}
						>
							<SelectValue placeholder="Pilih jenis" />
						</SelectTrigger>
						<SelectContent>
							{SPECIES_OPTIONS.map((o) => (
								<SelectItem key={o.value} value={o.value}>
									{o.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.species ? (
						<p className="text-xs text-destructive">{errors.species}</p>
					) : null}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-breed`}>Ras (opsional)</Label>
					<Input
						id={`${fieldId}-breed`}
						value={fields.breed}
						onChange={(e) => set("breed", e.target.value)}
						placeholder="Contoh: Golden Retriever"
						className="h-10"
						autoComplete="off"
					/>
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-age`}>
						Usia dalam bulan <span className="text-primary">*</span>
					</Label>
					<Input
						id={`${fieldId}-age`}
						type="number"
						inputMode="numeric"
						min={0}
						value={fields.ageMonths}
						onChange={(e) => set("ageMonths", e.target.value)}
						placeholder="Contoh: 18"
						className="h-10"
						aria-invalid={!!errors.ageMonths}
					/>
					{errors.ageMonths ? (
						<p className="text-xs text-destructive">{errors.ageMonths}</p>
					) : null}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-weight`}>Berat dalam kg (opsional)</Label>
					<Input
						id={`${fieldId}-weight`}
						type="number"
						inputMode="decimal"
						min={0}
						step="0.1"
						value={fields.weightKg}
						onChange={(e) => set("weightKg", e.target.value)}
						placeholder="Contoh: 12.5"
						className="h-10"
						aria-invalid={!!errors.weightKg}
					/>
					{errors.weightKg ? (
						<p className="text-xs text-destructive">{errors.weightKg}</p>
					) : null}
				</div>
			</div>

			<fieldset className="flex flex-col gap-1.5">
				<legend className="mb-1.5 text-sm font-medium text-foreground">
					Jenis kelamin <span className="text-primary">*</span>
				</legend>
				<div className="flex flex-wrap gap-2">
					{SEX_OPTIONS.map((o) => {
						const selected = fields.sex === o.value;
						return (
							<button
								key={o.value}
								type="button"
								onClick={() => set("sex", o.value)}
								aria-pressed={selected}
								className={cn(
									"flex h-11 min-w-20 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors",
									selected
										? "border-primary bg-primary/10 text-primary"
										: "border-border bg-background hover:bg-muted",
								)}
							>
								{o.label}
							</button>
						);
					})}
				</div>
				{errors.sex ? (
					<p className="text-xs text-destructive">{errors.sex}</p>
				) : null}
			</fieldset>

			<fieldset className="flex flex-col gap-1.5">
				<legend className="mb-1.5 text-sm font-medium text-foreground">
					Sudah disteril?
				</legend>
				<div className="flex flex-wrap gap-2">
					{NEUTERED_OPTIONS.map((o) => {
						const selected = fields.neutered === o.value;
						return (
							<button
								key={o.value}
								type="button"
								onClick={() => set("neutered", o.value)}
								aria-pressed={selected}
								className={cn(
									"flex h-11 min-w-20 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors",
									selected
										? "border-primary bg-primary/10 text-primary"
										: "border-border bg-background hover:bg-muted",
								)}
							>
								{o.label}
							</button>
						);
					})}
				</div>
			</fieldset>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor={`${fieldId}-notes`}>Catatan kesehatan (opsional)</Label>
				<Textarea
					id={`${fieldId}-notes`}
					value={fields.healthNotes}
					onChange={(e) => set("healthNotes", e.target.value)}
					maxLength={HEALTH_NOTES_MAX}
					placeholder="Alergi, kondisi khusus, atau hal yang perlu kami tahu."
					rows={3}
					aria-invalid={!!errors.healthNotes}
				/>
				<div className="flex items-center justify-between">
					{errors.healthNotes ? (
						<p className="text-xs text-destructive">{errors.healthNotes}</p>
					) : (
						<span />
					)}
					<span className="text-xs text-muted-foreground">
						{notesLeft} karakter tersisa
					</span>
				</div>
			</div>

			<div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				{onCancel ? (
					<Button
						type="button"
						variant="outline"
						size="lg"
						onClick={onCancel}
						disabled={busy}
					>
						Batal
					</Button>
				) : null}
				<Button type="submit" size="lg" disabled={busy}>
					{submitLabel}
				</Button>
			</div>
		</form>
	);
}
