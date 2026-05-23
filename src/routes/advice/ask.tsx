import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	CircleCheckBig,
	Paperclip,
	ShieldCheck,
} from "lucide-react";
import { type FormEvent, useId, useState } from "react";

import { petLabel } from "@/components/advice/topics";
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
import { useAuth } from "@/context/auth";
import { symptomSpecies } from "@/data/symptom-tree";

export const Route = createFileRoute("/advice/ask")({ component: AskOurVet });

const SPECIES_OPTIONS = [
	...symptomSpecies,
	{ key: "bird", label: petLabel("bird") },
	{ key: "fish", label: petLabel("fish") },
	{ key: "other", label: "Lainnya" },
];

const MIN_CHARS = 30;
const MAX_CHARS = 800;

function AskOurVet() {
	const { user } = useAuth();
	const nameId = useId();
	const speciesId = useId();
	const questionId = useId();
	const photoId = useId();

	const [name, setName] = useState(user?.name ?? "");
	const [species, setSpecies] = useState("");
	const [question, setQuestion] = useState("");
	const [photoName, setPhotoName] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState(false);
	const [errors, setErrors] = useState<{
		name?: string;
		species?: string;
		question?: string;
	}>({});

	const charCount = question.length;
	const tooShort = charCount > 0 && charCount < MIN_CHARS;

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		const next: typeof errors = {};
		if (!name.trim()) next.name = "Tulis namamu dulu ya.";
		if (!species) next.species = "Pilih jenis hewanmu.";
		if (question.trim().length < MIN_CHARS)
			next.question = `Ceritakan setidaknya ${MIN_CHARS} karakter agar dokter bisa membantu lebih baik.`;
		setErrors(next);
		if (Object.keys(next).length > 0) return;

		// Nothing is transmitted. Reset the form and show the confirmation.
		setName(user?.name ?? "");
		setSpecies("");
		setQuestion("");
		setPhotoName(null);
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16">
				<div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-12 text-center">
					<span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
						<CircleCheckBig className="size-8" aria-hidden="true" />
					</span>
					<h1 className="font-display text-2xl font-bold text-foreground">
						Pertanyaanmu sudah kami terima
					</h1>
					<p className="max-w-md text-sm text-muted-foreground">
						Tim dokter hewan kami akan menjawab dalam 2 hari kerja. Terima kasih
						sudah mempercayakan kesehatan hewanmu kepada PetSehat.
					</p>
					<div className="mt-2 flex flex-wrap justify-center gap-3">
						<Button variant="outline" onClick={() => setSubmitted(false)}>
							Ajukan pertanyaan lain
						</Button>
						<Button render={<Link to="/advice" />}>
							Kembali ke Saran Dokter
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-2xl px-4 py-6 md:py-10">
			<Button
				variant="ghost"
				size="sm"
				className="mb-5 -ml-2"
				render={<Link to="/advice" />}
			>
				<ArrowLeft className="size-4" />
				Kembali ke Saran Dokter
			</Button>

			<header className="space-y-3">
				<span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground ring-1 ring-accent/40">
					<ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
					Dijawab dokter hewan, tanpa biaya
				</span>
				<h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
					Tanya Dokter
				</h1>
				<p className="text-base text-muted-foreground">
					Ceritakan apa yang kamu khawatirkan tentang hewanmu. Tim dokter hewan
					kami akan membaca dan menjawab dalam 2 hari kerja.
				</p>
			</header>

			<form
				onSubmit={handleSubmit}
				noValidate
				className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-5 md:p-6"
			>
				<div className="space-y-2">
					<Label htmlFor={nameId}>Nama kamu</Label>
					<Input
						id={nameId}
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Contoh: Sari"
						aria-invalid={Boolean(errors.name)}
						className="h-11"
					/>
					{errors.name ? (
						<p className="text-xs text-destructive">{errors.name}</p>
					) : null}
				</div>

				<div className="space-y-2">
					<Label htmlFor={speciesId}>Jenis hewan</Label>
					<Select
						value={species}
						onValueChange={(value) => setSpecies(value as string)}
					>
						<SelectTrigger
							id={speciesId}
							className="h-11 w-full"
							aria-invalid={Boolean(errors.species)}
						>
							<SelectValue placeholder="Pilih jenis hewan" />
						</SelectTrigger>
						<SelectContent>
							{SPECIES_OPTIONS.map((opt) => (
								<SelectItem key={opt.key} value={opt.key}>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{errors.species ? (
						<p className="text-xs text-destructive">{errors.species}</p>
					) : null}
				</div>

				<div className="space-y-2">
					<Label htmlFor={questionId}>Pertanyaanmu</Label>
					<Textarea
						id={questionId}
						value={question}
						onChange={(e) => setQuestion(e.target.value.slice(0, MAX_CHARS))}
						placeholder="Ceritakan kondisi hewanmu sedetail mungkin, termasuk sejak kapan dan apa yang sudah kamu coba."
						className="min-h-32"
						maxLength={MAX_CHARS}
						aria-invalid={Boolean(errors.question)}
						aria-describedby={`${questionId}-count`}
					/>
					<div
						id={`${questionId}-count`}
						className="flex items-center justify-between text-xs"
					>
						<span className="text-muted-foreground">
							{tooShort
								? `Minimal ${MIN_CHARS} karakter`
								: "Semakin lengkap, semakin baik jawaban yang bisa kami berikan."}
						</span>
						<span
							className={
								charCount > MAX_CHARS - 50
									? "font-medium text-primary"
									: "text-muted-foreground"
							}
						>
							{charCount}/{MAX_CHARS}
						</span>
					</div>
					{errors.question ? (
						<p className="text-xs text-destructive">{errors.question}</p>
					) : null}
				</div>

				<div className="space-y-2">
					<Label htmlFor={photoId}>Foto pendukung (opsional)</Label>
					<label
						htmlFor={photoId}
						className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
					>
						<Paperclip className="size-4 shrink-0" aria-hidden="true" />
						<span className="truncate">
							{photoName ?? "Lampirkan foto kondisi hewanmu"}
						</span>
					</label>
					<input
						id={photoId}
						type="file"
						accept="image/*"
						className="sr-only"
						onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
					/>
					<p className="text-xs text-muted-foreground">
						Foto membantu dokter memahami kondisi, misalnya luka atau ruam pada
						kulit.
					</p>
				</div>

				<Button type="submit" size="lg" className="w-full">
					Kirim Pertanyaan
				</Button>
				<p className="text-center text-xs text-muted-foreground">
					Untuk keadaan darurat, segera bawa hewanmu ke klinik hewan terdekat.
				</p>
			</form>
		</div>
	);
}
