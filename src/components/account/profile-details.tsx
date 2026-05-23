import { Pencil } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^(?:\+?62|0)8\d{7,12}$/;

interface DraftState {
	name: string;
	email: string;
	phone: string;
}

type Errors = Partial<Record<keyof DraftState, string>>;

export function ProfileDetails() {
	const fieldId = useId();
	const { user, updateUser } = useAuth();
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState<DraftState>({
		name: "",
		email: "",
		phone: "",
	});
	const [errors, setErrors] = useState<Errors>({});

	useEffect(() => {
		if (user) {
			setDraft({ name: user.name, email: user.email, phone: user.phone });
		}
	}, [user]);

	if (!user) return null;

	const startEdit = () => {
		setDraft({ name: user.name, email: user.email, phone: user.phone });
		setErrors({});
		setEditing(true);
	};

	const set = <K extends keyof DraftState>(key: K, value: DraftState[K]) => {
		setDraft((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	const save = (e: React.FormEvent) => {
		e.preventDefault();
		const next: Errors = {};
		if (!draft.name.trim()) next.name = "Nama wajib diisi.";
		const email = draft.email.trim();
		if (!email) next.email = "Email wajib diisi.";
		else if (!EMAIL_RE.test(email)) next.email = "Format email tidak valid.";
		const phone = draft.phone.replace(/[\s-]/g, "");
		if (!phone) next.phone = "Nomor HP wajib diisi.";
		else if (!PHONE_RE.test(phone))
			next.phone = "Gunakan format Indonesia, misalnya 08123456789.";

		setErrors(next);
		if (Object.keys(next).length > 0) return;

		updateUser({ name: draft.name.trim(), email, phone });
		setEditing(false);
	};

	if (!editing) {
		return (
			<div className="flex flex-col gap-4">
				<dl className="grid gap-4 sm:grid-cols-2">
					<div>
						<dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Nama lengkap
						</dt>
						<dd className="mt-1 text-sm text-foreground">{user.name}</dd>
					</div>
					<div>
						<dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Email
						</dt>
						<dd className="mt-1 break-all text-sm text-foreground">
							{user.email}
						</dd>
					</div>
					<div>
						<dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
							Nomor HP
						</dt>
						<dd className="mt-1 text-sm text-foreground">{user.phone}</dd>
					</div>
				</dl>
				<div>
					<Button variant="outline" size="sm" onClick={startEdit}>
						<Pencil className="size-3.5" />
						Ubah profil
					</Button>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={save} className="flex flex-col gap-4" noValidate>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-name`}>Nama lengkap</Label>
					<Input
						id={`${fieldId}-name`}
						value={draft.name}
						onChange={(e) => set("name", e.target.value)}
						className="h-10"
						aria-invalid={!!errors.name}
					/>
					{errors.name ? (
						<p className="text-xs text-destructive">{errors.name}</p>
					) : null}
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-email`}>Email</Label>
					<Input
						id={`${fieldId}-email`}
						type="email"
						value={draft.email}
						onChange={(e) => set("email", e.target.value)}
						className="h-10"
						aria-invalid={!!errors.email}
					/>
					{errors.email ? (
						<p className="text-xs text-destructive">{errors.email}</p>
					) : null}
				</div>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-phone`}>Nomor HP</Label>
					<Input
						id={`${fieldId}-phone`}
						type="tel"
						inputMode="tel"
						value={draft.phone}
						onChange={(e) => set("phone", e.target.value)}
						className="h-10"
						aria-invalid={!!errors.phone}
					/>
					{errors.phone ? (
						<p className="text-xs text-destructive">{errors.phone}</p>
					) : null}
				</div>
			</div>
			<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
				<Button
					type="button"
					variant="outline"
					size="lg"
					onClick={() => setEditing(false)}
				>
					Batal
				</Button>
				<Button type="submit" size="lg">
					Simpan perubahan
				</Button>
			</div>
		</form>
	);
}
