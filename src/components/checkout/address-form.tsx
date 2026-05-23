import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { citiesForProvince, provinceNames } from "@/data/regions";
import type { Address } from "@/data/types";
import { cn } from "@/lib/utils";

/** Editable address fields (no id / isDefault — those are assigned on save). */
export type AddressDraft = Omit<Address, "id" | "isDefault">;

export const EMPTY_ADDRESS: AddressDraft = {
	label: "home",
	recipient: "",
	phone: "",
	street: "",
	kelurahan: "",
	kecamatan: "",
	city: "",
	province: "",
	postalCode: "",
};

export type AddressErrors = Partial<Record<keyof AddressDraft, string>>;

/** Returns a field->message map of any missing/invalid fields. */
export function validateAddress(a: AddressDraft): AddressErrors {
	const errors: AddressErrors = {};
	if (!a.recipient.trim()) errors.recipient = "Nama penerima wajib diisi.";
	if (!a.phone.trim()) errors.phone = "Nomor telepon wajib diisi.";
	else if (!/^\+?\d[\d\s-]{7,}$/.test(a.phone.trim()))
		errors.phone = "Masukkan nomor telepon yang valid.";
	if (!a.street.trim()) errors.street = "Alamat lengkap wajib diisi.";
	if (!a.kelurahan.trim()) errors.kelurahan = "Kelurahan wajib diisi.";
	if (!a.kecamatan.trim()) errors.kecamatan = "Kecamatan wajib diisi.";
	if (!a.province.trim()) errors.province = "Pilih provinsi.";
	if (!a.city.trim()) errors.city = "Pilih kota atau kabupaten.";
	if (!a.postalCode.trim()) errors.postalCode = "Kode pos wajib diisi.";
	else if (!/^\d{5}$/.test(a.postalCode.trim()))
		errors.postalCode = "Kode pos terdiri dari 5 angka.";
	return errors;
}

interface AddressFormProps {
	value: AddressDraft;
	onChange: (next: AddressDraft) => void;
	errors?: AddressErrors;
}

function Field({
	id,
	label,
	error,
	children,
	className,
}: {
	id: string;
	label: string;
	error?: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<Label htmlFor={id}>{label}</Label>
			{children}
			{error ? (
				<p className="text-xs font-medium text-destructive">{error}</p>
			) : null}
		</div>
	);
}

export function AddressForm({
	value,
	onChange,
	errors = {},
}: AddressFormProps) {
	const baseId = useId();
	const cities = citiesForProvince(value.province);

	const set = (patch: Partial<AddressDraft>) =>
		onChange({ ...value, ...patch });

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<Field
				id={`${baseId}-recipient`}
				label="Nama penerima"
				error={errors.recipient}
			>
				<Input
					id={`${baseId}-recipient`}
					className="h-11"
					value={value.recipient}
					onChange={(e) => set({ recipient: e.target.value })}
					placeholder="Nama lengkap penerima"
					autoComplete="name"
				/>
			</Field>

			<Field id={`${baseId}-phone`} label="Nomor telepon" error={errors.phone}>
				<Input
					id={`${baseId}-phone`}
					className="h-11"
					type="tel"
					inputMode="tel"
					value={value.phone}
					onChange={(e) => set({ phone: e.target.value })}
					placeholder="0812 3456 7890"
					autoComplete="tel"
				/>
			</Field>

			<Field
				id={`${baseId}-street`}
				label="Alamat lengkap"
				error={errors.street}
				className="sm:col-span-2"
			>
				<Input
					id={`${baseId}-street`}
					className="h-11"
					value={value.street}
					onChange={(e) => set({ street: e.target.value })}
					placeholder="Nama jalan, nomor rumah, RT/RW, patokan"
					autoComplete="street-address"
				/>
			</Field>

			<Field
				id={`${baseId}-kelurahan`}
				label="Kelurahan"
				error={errors.kelurahan}
			>
				<Input
					id={`${baseId}-kelurahan`}
					className="h-11"
					value={value.kelurahan}
					onChange={(e) => set({ kelurahan: e.target.value })}
					placeholder="Kelurahan"
				/>
			</Field>

			<Field
				id={`${baseId}-kecamatan`}
				label="Kecamatan"
				error={errors.kecamatan}
			>
				<Input
					id={`${baseId}-kecamatan`}
					className="h-11"
					value={value.kecamatan}
					onChange={(e) => set({ kecamatan: e.target.value })}
					placeholder="Kecamatan"
				/>
			</Field>

			<Field id={`${baseId}-province`} label="Provinsi" error={errors.province}>
				<Select
					value={value.province || undefined}
					onValueChange={(province) =>
						// Reset city when province changes so the pair stays valid.
						set({ province: String(province), city: "" })
					}
				>
					<SelectTrigger
						id={`${baseId}-province`}
						className="h-11 w-full"
						aria-label="Provinsi"
					>
						<SelectValue placeholder="Pilih provinsi" />
					</SelectTrigger>
					<SelectContent>
						{provinceNames.map((name) => (
							<SelectItem key={name} value={name}>
								{name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>

			<Field id={`${baseId}-city`} label="Kota / Kabupaten" error={errors.city}>
				<Select
					value={value.city || undefined}
					onValueChange={(city) => set({ city: String(city) })}
					disabled={!value.province}
				>
					<SelectTrigger
						id={`${baseId}-city`}
						className="h-11 w-full"
						aria-label="Kota atau kabupaten"
					>
						<SelectValue
							placeholder={
								value.province ? "Pilih kota" : "Pilih provinsi dulu"
							}
						/>
					</SelectTrigger>
					<SelectContent>
						{cities.map((city) => (
							<SelectItem key={city} value={city}>
								{city}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>

			<Field
				id={`${baseId}-postal`}
				label="Kode pos"
				error={errors.postalCode}
				className="sm:col-span-2 sm:max-w-40"
			>
				<Input
					id={`${baseId}-postal`}
					className="h-11"
					inputMode="numeric"
					maxLength={5}
					value={value.postalCode}
					onChange={(e) =>
						set({ postalCode: e.target.value.replace(/\D/g, "").slice(0, 5) })
					}
					placeholder="12345"
					autoComplete="postal-code"
				/>
			</Field>
		</div>
	);
}
