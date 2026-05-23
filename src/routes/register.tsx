import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

import { AuthError, AuthShell } from "@/components/account/auth-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";

export const Route = createFileRoute("/register")({ component: RegisterPage });

interface FormState {
	name: string;
	email: string;
	phone: string;
	password: string;
}

type Errors = Partial<Record<keyof FormState | "terms", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Indonesian mobile numbers: 08xx... or 62xx... or +62xx...
const PHONE_RE = /^(?:\+?62|0)8\d{7,12}$/;

function validatePassword(pw: string): string | null {
	if (pw.length < 8) return "Kata sandi minimal 8 karakter.";
	if (!/[a-zA-Z]/.test(pw))
		return "Kata sandi harus memuat minimal satu huruf.";
	if (!/\d/.test(pw)) return "Kata sandi harus memuat minimal satu angka.";
	return null;
}

function RegisterPage() {
	const fieldId = useId();
	const navigate = useNavigate();
	const { register } = useAuth();

	const [fields, setFields] = useState<FormState>({
		name: "",
		email: "",
		phone: "",
		password: "",
	});
	const [agreed, setAgreed] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Errors>({});
	const [formError, setFormError] = useState<string | null>(null);

	const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
		setFields((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		const next: Errors = {};

		if (!fields.name.trim()) next.name = "Nama lengkap wajib diisi.";

		const email = fields.email.trim();
		if (!email) next.email = "Email wajib diisi.";
		else if (!EMAIL_RE.test(email)) next.email = "Format email tidak valid.";

		const phone = fields.phone.replace(/[\s-]/g, "");
		if (!phone) next.phone = "Nomor HP wajib diisi.";
		else if (!PHONE_RE.test(phone))
			next.phone = "Gunakan format Indonesia, misalnya 08123456789.";

		const pwError = validatePassword(fields.password);
		if (pwError) next.password = pwError;

		if (!agreed)
			next.terms =
				"Kamu perlu menyetujui Syarat Layanan dan Kebijakan Privasi.";

		setErrors(next);
		if (Object.keys(next).length > 0) return;

		const result = register({
			name: fields.name,
			email,
			phone,
			password: fields.password,
		});
		if (result.ok) {
			navigate({ to: "/account" });
		} else {
			setFormError(result.message ?? "Pendaftaran gagal. Coba lagi.");
		}
	};

	return (
		<AuthShell
			title="Buat akun PetSehat"
			subtitle="Satu akun untuk belanja, mengatur langganan, dan menyimpan profil hewanmu."
			footer={
				<>
					Sudah punya akun?{" "}
					<Link
						to="/login"
						className="font-semibold text-primary hover:underline"
					>
						Masuk di sini
					</Link>
				</>
			}
		>
			{formError ? <AuthError message={formError} /> : null}

			<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-name`}>Nama lengkap</Label>
					<Input
						id={`${fieldId}-name`}
						autoComplete="name"
						value={fields.name}
						onChange={(e) => set("name", e.target.value)}
						placeholder="Contoh: Sari Wijaya"
						className="h-11"
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
						autoComplete="email"
						value={fields.email}
						onChange={(e) => set("email", e.target.value)}
						placeholder="nama@email.com"
						className="h-11"
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
						autoComplete="tel"
						value={fields.phone}
						onChange={(e) => set("phone", e.target.value)}
						placeholder="08123456789"
						className="h-11"
						aria-invalid={!!errors.phone}
					/>
					{errors.phone ? (
						<p className="text-xs text-destructive">{errors.phone}</p>
					) : null}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-password`}>Kata sandi</Label>
					<div className="relative">
						<Input
							id={`${fieldId}-password`}
							type={showPassword ? "text" : "password"}
							autoComplete="new-password"
							value={fields.password}
							onChange={(e) => set("password", e.target.value)}
							placeholder="Minimal 8 karakter"
							className="h-11 pr-11"
							aria-invalid={!!errors.password}
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={() => setShowPassword((v) => !v)}
							className="absolute top-1/2 right-1.5 -translate-y-1/2"
							aria-label={
								showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
							}
						>
							{showPassword ? <EyeOff /> : <Eye />}
						</Button>
					</div>
					{errors.password ? (
						<p className="text-xs text-destructive">{errors.password}</p>
					) : (
						<p className="text-xs text-muted-foreground">
							Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.
						</p>
					)}
				</div>

				<div className="flex flex-col gap-1.5">
					<Label
						htmlFor={`${fieldId}-terms`}
						className="items-start gap-2.5 text-sm font-normal text-muted-foreground"
					>
						<Checkbox
							id={`${fieldId}-terms`}
							checked={agreed}
							onCheckedChange={(checked) => {
								setAgreed(checked === true);
								setErrors((prev) => ({ ...prev, terms: undefined }));
							}}
							className="mt-0.5"
							aria-invalid={!!errors.terms}
						/>
						<span>
							Saya menyetujui{" "}
							<span className="font-medium text-primary">Syarat Layanan</span>{" "}
							dan{" "}
							<span className="font-medium text-primary">
								Kebijakan Privasi
							</span>{" "}
							PetSehat.
						</span>
					</Label>
					{errors.terms ? (
						<p className="text-xs text-destructive">{errors.terms}</p>
					) : null}
				</div>

				<Button type="submit" size="lg" className="mt-2 h-11 w-full">
					Daftar
				</Button>
			</form>
		</AuthShell>
	);
}
