import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export type AddressFormValues = Omit<Address, "id">;

const LABEL_OPTIONS: { value: Address["label"]; label: string }[] = [
	{ value: "home", label: "Rumah" },
	{ value: "office", label: "Kantor" },
	{ value: "other", label: "Lainnya" },
];

interface AddressFormProps {
	initial?: Address;
	/** When true and there are no other addresses, default toggle is forced on. */
	forceDefault?: boolean;
	onSubmit: (values: AddressFormValues) => void;
	onCancel: () => void;
}

interface FieldState {
	label: Address["label"];
	recipient: string;
	phone: string;
	street: string;
	kelurahan: string;
	kecamatan: string;
	province: string;
	city: string;
	postalCode: string;
	isDefault: boolean;
}

type Errors = Partial<Record<keyof FieldState, string>>;

const PHONE_RE = /^(?:\+?62|0)8\d{7,12}$/;

function toFieldState(
	addr: Address | undefined,
	forceDefault: boolean,
): FieldState {
	return {
		label: addr?.label ?? "home",
		recipient: addr?.recipient ?? "",
		phone: addr?.phone ?? "",
		street: addr?.street ?? "",
		kelurahan: addr?.kelurahan ?? "",
		kecamatan: addr?.kecamatan ?? "",
		province: addr?.province ?? "",
		city: addr?.city ?? "",
		postalCode: addr?.postalCode ?? "",
		isDefault: addr?.isDefault ?? forceDefault,
	};
}

export function AddressForm({
	initial,
	forceDefault = false,
	onSubmit,
	onCancel,
}: AddressFormProps) {
	const fieldId = useId();
	const [fields, setFields] = useState<FieldState>(() =>
		toFieldState(initial, forceDefault),
	);
	const [errors, setErrors] = useState<Errors>({});

	const cities = citiesForProvince(fields.province);

	const set = <K extends keyof FieldState>(key: K, value: FieldState[K]) => {
		setFields((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const next: Errors = {};
		if (!fields.recipient.trim()) next.recipient = "Nama penerima wajib diisi.";

		const phone = fields.phone.replace(/[\s-]/g, "");
		if (!phone) next.phone = "Nomor HP wajib diisi.";
		else if (!PHONE_RE.test(phone))
			next.phone = "Gunakan format Indonesia, misalnya 08123456789.";

		if (!fields.street.trim()) next.street = "Alamat lengkap wajib diisi.";
		if (!fields.kelurahan.trim()) next.kelurahan = "Kelurahan wajib diisi.";
		if (!fields.kecamatan.trim()) next.kecamatan = "Kecamatan wajib diisi.";
		if (!fields.province) next.province = "Pilih provinsi.";
		if (!fields.city) next.city = "Pilih kota atau kabupaten.";
		if (!/^\d{5}$/.test(fields.postalCode.trim()))
			next.postalCode = "Kode pos terdiri dari 5 angka.";

		setErrors(next);
		if (Object.keys(next).length > 0) return;

		onSubmit({
			label: fields.label,
			recipient: fields.recipient.trim(),
			phone,
			street: fields.street.trim(),
			kelurahan: fields.kelurahan.trim(),
			kecamatan: fields.kecamatan.trim(),
			province: fields.province,
			city: fields.city,
			postalCode: fields.postalCode.trim(),
			isDefault: forceDefault ? true : fields.isDefault,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
			<fieldset className="flex flex-col gap-1.5">
				<legend className="mb-1.5 text-sm font-medium text-foreground">
					Label alamat
				</legend>
				<div className="flex flex-wrap gap-2">
					{LABEL_OPTIONS.map((o) => {
						const selected = fields.label === o.value;
						return (
							<button
								key={o.value}
								type="button"
								onClick={() => set("label", o.value)}
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

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-recipient`}>Nama penerima</Label>
					<Input
						id={`${fieldId}-recipient`}
						value={fields.recipient}
						onChange={(e) => set("recipient", e.target.value)}
						className="h-10"
						aria-invalid={!!errors.recipient}
					/>
					{errors.recipient ? (
						<p className="text-xs text-destructive">{errors.recipient}</p>
					) : null}
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-phone`}>Nomor HP</Label>
					<Input
						id={`${fieldId}-phone`}
						type="tel"
						inputMode="tel"
						value={fields.phone}
						onChange={(e) => set("phone", e.target.value)}
						placeholder="08123456789"
						className="h-10"
						aria-invalid={!!errors.phone}
					/>
					{errors.phone ? (
						<p className="text-xs text-destructive">{errors.phone}</p>
					) : null}
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor={`${fieldId}-street`}>Alamat lengkap</Label>
				<Input
					id={`${fieldId}-street`}
					value={fields.street}
					onChange={(e) => set("street", e.target.value)}
					placeholder="Nama jalan, nomor rumah, RT/RW"
					className="h-10"
					aria-invalid={!!errors.street}
				/>
				{errors.street ? (
					<p className="text-xs text-destructive">{errors.street}</p>
				) : null}
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-kelurahan`}>Kelurahan</Label>
					<Input
						id={`${fieldId}-kelurahan`}
						value={fields.kelurahan}
						onChange={(e) => set("kelurahan", e.target.value)}
						className="h-10"
						aria-invalid={!!errors.kelurahan}
					/>
					{errors.kelurahan ? (
						<p className="text-xs text-destructive">{errors.kelurahan}</p>
					) : null}
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-kecamatan`}>Kecamatan</Label>
					<Input
						id={`${fieldId}-kecamatan`}
						value={fields.kecamatan}
						onChange={(e) => set("kecamatan", e.target.value)}
						className="h-10"
						aria-invalid={!!errors.kecamatan}
					/>
					{errors.kecamatan ? (
						<p className="text-xs text-destructive">{errors.kecamatan}</p>
					) : null}
				</div>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-province`}>Provinsi</Label>
					<Select
						value={fields.province}
						onValueChange={(v) => {
							set("province", (v as string | null) ?? "");
							set("city", "");
						}}
						items={provinceNames.map((p) => ({ value: p, label: p }))}
					>
						<SelectTrigger
							id={`${fieldId}-province`}
							className="h-10 w-full"
							aria-invalid={!!errors.province}
						>
							<SelectValue placeholder="Pilih provinsi" />
						</SelectTrigger>
						<SelectContent>
							{provinceNames.map((p) => (
								<SelectItem key={p} value={p}>
									{p}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.province ? (
						<p className="text-xs text-destructive">{errors.province}</p>
					) : null}
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-city`}>Kota / Kabupaten</Label>
					<Select
						value={fields.city}
						onValueChange={(v) => set("city", (v as string | null) ?? "")}
						disabled={!fields.province}
						items={cities.map((c) => ({ value: c, label: c }))}
					>
						<SelectTrigger
							id={`${fieldId}-city`}
							className="h-10 w-full"
							aria-invalid={!!errors.city}
						>
							<SelectValue
								placeholder={
									fields.province ? "Pilih kota" : "Pilih provinsi dahulu"
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{cities.map((c) => (
								<SelectItem key={c} value={c}>
									{c}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.city ? (
						<p className="text-xs text-destructive">{errors.city}</p>
					) : null}
				</div>
			</div>

			<div className="flex flex-col gap-1.5 sm:max-w-40">
				<Label htmlFor={`${fieldId}-postal`}>Kode pos</Label>
				<Input
					id={`${fieldId}-postal`}
					inputMode="numeric"
					maxLength={5}
					value={fields.postalCode}
					onChange={(e) =>
						set("postalCode", e.target.value.replace(/\D/g, "").slice(0, 5))
					}
					className="h-10"
					aria-invalid={!!errors.postalCode}
				/>
				{errors.postalCode ? (
					<p className="text-xs text-destructive">{errors.postalCode}</p>
				) : null}
			</div>

			<Label
				htmlFor={`${fieldId}-default`}
				className="gap-2.5 text-sm font-normal text-foreground"
			>
				<Checkbox
					id={`${fieldId}-default`}
					checked={fields.isDefault}
					disabled={forceDefault}
					onCheckedChange={(checked) => set("isDefault", checked === true)}
				/>
				Jadikan alamat utama
			</Label>

			<div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button type="button" variant="outline" size="lg" onClick={onCancel}>
					Batal
				</Button>
				<Button type="submit" size="lg">
					Simpan alamat
				</Button>
			</div>
		</form>
	);
}
