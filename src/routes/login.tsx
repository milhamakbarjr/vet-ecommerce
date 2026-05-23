import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

import { AuthError, AuthShell } from "@/components/account/auth-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";
import { DEMO_EMAIL } from "@/data/mock-user";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
	const fieldId = useId();
	const navigate = useNavigate();
	const { login } = useAuth();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!email.trim()) {
			setError("Masukkan alamat emailmu.");
			return;
		}
		if (!password) {
			setError("Masukkan kata sandimu.");
			return;
		}
		const result = login(email, password);
		if (result.ok) {
			navigate({ to: "/account" });
		} else {
			setError(result.message ?? "Email atau kata sandi salah.");
		}
	};

	const useDemo = () => {
		setError(null);
		setEmail(DEMO_EMAIL);
		setPassword("petsehat123");
	};

	return (
		<AuthShell
			title="Selamat datang kembali"
			subtitle="Masuk untuk mengelola pesanan, hewan kesayangan, dan langgananmu."
			footer={
				<>
					Belum punya akun?{" "}
					<Link
						to="/register"
						className="font-semibold text-primary hover:underline"
					>
						Daftar sekarang
					</Link>
				</>
			}
		>
			{error ? <AuthError message={error} /> : null}

			<form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
				<div className="flex flex-col gap-1.5">
					<Label htmlFor={`${fieldId}-email`}>Email</Label>
					<Input
						id={`${fieldId}-email`}
						type="email"
						autoComplete="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="nama@email.com"
						className="h-11"
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between">
						<Label htmlFor={`${fieldId}-password`}>Kata sandi</Label>
						<Link
							to="/forgot-password"
							className="text-xs font-medium text-primary hover:underline"
						>
							Lupa Password?
						</Link>
					</div>
					<div className="relative">
						<Input
							id={`${fieldId}-password`}
							type={showPassword ? "text" : "password"}
							autoComplete="current-password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Masukkan kata sandi"
							className="h-11 pr-11"
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
				</div>

				<Button type="submit" size="lg" className="mt-2 h-11 w-full">
					Masuk
				</Button>
			</form>

			<div className="mt-5 rounded-xl border border-dashed border-border bg-secondary/40 p-4 text-center text-sm">
				<p className="text-foreground">
					Ingin mencoba dulu? Gunakan akun demo{" "}
					<span className="font-semibold">{DEMO_EMAIL}</span> dengan kata sandi
					apa pun.
				</p>
				<Button
					type="button"
					variant="secondary"
					size="sm"
					onClick={useDemo}
					className="mt-3"
				>
					Isi otomatis akun demo
				</Button>
			</div>
		</AuthShell>
	);
}
