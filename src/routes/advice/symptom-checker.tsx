import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { SymptomChecker } from "@/components/advice/symptom-checker";
import { Button } from "@/components/ui/button";
import { usePetProfiles } from "@/context/pet-profile";

export const Route = createFileRoute("/advice/symptom-checker")({
	component: SymptomCheckerPage,
});

function SymptomCheckerPage() {
	const { activeProfile } = usePetProfiles();

	return (
		<div className="mx-auto max-w-3xl px-4 py-6 md:py-10">
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
					Disusun oleh dokter hewan
				</span>
				<h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
					Cek Gejala Hewan
				</h1>
				<p className="text-base text-muted-foreground">
					Jawab beberapa pertanyaan singkat untuk mendapat gambaran awal kondisi
					hewanmu. Ini bukan diagnosis, melainkan panduan supaya kamu tahu
					langkah selanjutnya yang paling tepat.
				</p>
			</header>

			<div className="mt-8 rounded-2xl border border-border bg-background p-5 md:p-6">
				<SymptomChecker initialSpecies={activeProfile?.species ?? null} />
			</div>
		</div>
	);
}
