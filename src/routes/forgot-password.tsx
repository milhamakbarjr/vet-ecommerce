import { createFileRoute, Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { useId, useState } from "react";

import { AuthError, AuthShell } from "@/components/account/auth-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPasswordPage,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordPage() {
	const fieldId = useId();
	const [email, setEmail] = useState("");
	const [sent, setSent] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		const value = email.trim();
		if (!value) {
			setError("Masukkan alamat emailmu.");
			return;
		}
		if (!EMAIL_RE.test(value)) {
			setError("Format email tidak valid.");
			return;
		}
		// Mock only: nothing is actually sent.
		setSent(true);
	};

	if (sent) {
		return (
			<AuthShell
				title="Cek emailmu"
				subtitle="Ikuti tautan di email untuk membuat kata sandi baru."
				footer={
					<Link
						to="/login"
						className="font-semibold text-primary hover:underline"
					>
						Kembali ke halaman masuk
					</Link>
				}
			>
				<div className="flex flex-col items-center gap-4 text-center">
					<span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
						<MailCheck className="size-7" aria-hidden="true" />
					</span>
					<p className="text-sm text-foreground">
						Kami telah mengirim tautan reset ke emailmu di{" "}
						<span className="font-semibold">{email.trim()}</span>.
					</p>
					<p className="text-xs text-muted-foreground">
						Tidak menerima email? Cek folder spam atau coba kirim ulang.
					</p>
					<Button
						type="button"
						variant="outline"
						size="lg"
						onClick={() => setSent(false)}
						className="mt-1"
					>
						Kirim ulang tautan
					</Button>
				</div>
			</AuthShell>
		);
	}

	return (
		<AuthShell
			title="Lupa kata sandi?"
			subtitle="Masukkan emailmu dan kami kirimkan tautan untuk mengaturnya kembali."
			footer={
				<>
					Ingat kata sandimu?{" "}
					<Link
						to="/login"
						className="font-semibold text-primary hover:underline"
					>
						Masuk di sini
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
				<Button type="submit" size="lg" className="mt-2 h-11 w-full">
					Kirim tautan reset
				</Button>
			</form>
		</AuthShell>
	);
}
