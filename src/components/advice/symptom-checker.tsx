import { Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	ChevronRight,
	CircleCheck,
	Info,
	RotateCcw,
	Stethoscope,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { petLabel } from "@/components/advice/topics";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/context/catalog";
import { symptomSpecies, symptomTree } from "@/data/symptom-tree";
import type { SymptomNode, SymptomOutcome } from "@/data/types";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type SeeVet = SymptomOutcome["seeVet"];

const SEE_VET_META: Record<
	SeeVet,
	{ label: string; tone: string; icon: typeof Info; helper: string }
> = {
	yes: {
		label: "Sebaiknya periksa ke dokter hewan",
		tone: "border-destructive/40 bg-destructive/10 text-destructive",
		icon: AlertTriangle,
		helper: "Tanda ini sebaiknya tidak ditunda. Hubungi dokter hewan terdekat.",
	},
	maybe: {
		label: "Pantau dulu, periksa bila menetap",
		tone: "border-accent/60 bg-accent/15 text-accent-foreground",
		icon: Info,
		helper:
			"Amati selama satu sampai dua hari. Bila tidak membaik atau memburuk, periksakan ke dokter hewan.",
	},
	no: {
		label: "Bisa ditangani di rumah",
		tone: "border-primary/30 bg-primary/10 text-primary",
		icon: CircleCheck,
		helper:
			"Umumnya bisa diatasi di rumah dengan perawatan yang tepat. Tetap pantau perkembangannya.",
	},
};

interface SymptomCheckerProps {
	/** Prefilled species from the active pet profile, if it is dog/cat/rabbit. */
	initialSpecies?: string | null;
}

/**
 * Recursive client-side symptom checker. Walks the static decision tree by
 * pushing the chosen node id onto a path; the current node is whatever the path
 * resolves to. Terminal nodes carry an outcome and render the result screen.
 */
export function SymptomChecker({ initialSpecies }: SymptomCheckerProps) {
	const { getProduct } = useCatalog();
	const validInitial =
		initialSpecies && symptomTree[initialSpecies] ? initialSpecies : null;
	const [species, setSpecies] = useState<string | null>(validInitial);
	const [path, setPath] = useState<string[]>([]);

	// Resolve the current node list from the species root + chosen path.
	const { currentNodes, currentOutcome, trail } = useMemo(() => {
		if (!species) {
			return {
				currentNodes: [] as SymptomNode[],
				currentOutcome: null as SymptomOutcome | null,
				trail: [] as SymptomNode[],
			};
		}
		let nodes: SymptomNode[] = symptomTree[species] ?? [];
		const crumbs: SymptomNode[] = [];
		let outcome: SymptomOutcome | null = null;
		for (const id of path) {
			const found: SymptomNode | undefined = nodes.find((n) => n.id === id);
			if (!found) break;
			crumbs.push(found);
			if (found.outcome) {
				outcome = found.outcome;
				nodes = [];
				break;
			}
			nodes = found.children ?? [];
		}
		return { currentNodes: nodes, currentOutcome: outcome, trail: crumbs };
	}, [species, path]);

	// Fire completion analytics once a terminal outcome surfaces.
	const lastNodeId = path[path.length - 1];
	useEffect(() => {
		if (currentOutcome && species && lastNodeId) {
			track("symptom_check_completed", {
				species,
				node: lastNodeId,
				seeVet: currentOutcome.seeVet,
			});
		}
	}, [currentOutcome, species, lastNodeId]);

	const reset = () => {
		setSpecies(null);
		setPath([]);
	};

	const stepBack = () => {
		if (path.length > 0) {
			setPath((p) => p.slice(0, -1));
		} else {
			setSpecies(null);
		}
	};

	// Step 1: species selection.
	if (!species) {
		return (
			<div className="space-y-5">
				<StepHeading
					step="Langkah 1 dari 3"
					title="Hewan apa yang ingin kamu cek?"
					subtitle="Pilih jenis hewan agar pertanyaannya sesuai dengan kebutuhannya."
				/>
				<div className="grid gap-3 sm:grid-cols-3">
					{symptomSpecies.map((s) => (
						<OptionCard
							key={s.key}
							label={s.label}
							onClick={() => {
								setSpecies(s.key);
								setPath([]);
							}}
						/>
					))}
				</div>
			</div>
		);
	}

	const speciesLabel = petLabel(species as never);

	// Result screen.
	if (currentOutcome) {
		const meta = SEE_VET_META[currentOutcome.seeVet];
		const ToneIcon = meta.icon;
		const recommended = currentOutcome.productIds
			.map((id) => getProduct(id))
			.filter((p): p is NonNullable<typeof p> => Boolean(p));

		return (
			<div className="space-y-6">
				<Breadcrumbs species={speciesLabel} trail={trail} />

				<div className="rounded-2xl border border-border bg-card p-5 md:p-6">
					<p className="text-xs font-semibold uppercase tracking-wide text-primary">
						Hasil pemeriksaan awal
					</p>
					<p className="mt-3 text-base leading-relaxed text-foreground">
						{currentOutcome.assessment}
					</p>

					<div
						className={cn(
							"mt-5 flex items-start gap-3 rounded-xl border p-4",
							meta.tone,
						)}
					>
						<ToneIcon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
						<div>
							<p className="font-semibold">{meta.label}</p>
							<p className="mt-1 text-sm opacity-90">{meta.helper}</p>
						</div>
					</div>
				</div>

				{recommended.length > 0 ? (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Stethoscope className="size-4 text-primary" aria-hidden="true" />
							<h3 className="font-display text-lg font-semibold text-foreground">
								Produk yang direkomendasikan dokter kami
							</h3>
						</div>
						<p className="text-sm text-muted-foreground">
							Pilihan ini sering kami sarankan untuk keluhan serupa. Selalu
							ikuti aturan pakai pada kemasan.
						</p>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
							{recommended.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					</div>
				) : (
					<div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
						Untuk keluhan ini kami tidak menyarankan produk bebas. Pemeriksaan
						dokter hewan adalah langkah terbaik.
					</div>
				)}

				<div className="flex flex-wrap gap-3">
					<Button type="button" variant="outline" onClick={stepBack}>
						Kembali satu langkah
					</Button>
					<Button type="button" variant="secondary" onClick={reset}>
						<RotateCcw className="size-4" />
						Mulai ulang
					</Button>
					<Button type="button" render={<Link to="/advice/ask" />}>
						Tanya dokter kami
					</Button>
				</div>

				<p className="text-xs text-muted-foreground">
					Pemeriksaan ini bersifat informasi awal dan tidak menggantikan
					pemeriksaan langsung oleh dokter hewan.
				</p>
			</div>
		);
	}

	// Intermediate steps: render the current node list.
	const stepNumber = path.length === 0 ? 2 : path.length + 2;
	const stepTitle =
		path.length === 0
			? `Bagian tubuh mana yang bermasalah pada ${speciesLabel.toLowerCase()}mu?`
			: "Mana yang paling menggambarkan kondisinya?";

	return (
		<div className="space-y-5">
			<Breadcrumbs species={speciesLabel} trail={trail} />
			<StepHeading
				step={`Langkah ${Math.min(stepNumber, 3)}`}
				title={stepTitle}
				subtitle="Pilih satu opsi yang paling sesuai dengan yang kamu amati."
			/>
			<div className="grid gap-3 sm:grid-cols-2">
				{currentNodes.map((node) => (
					<OptionCard
						key={node.id}
						label={node.label}
						onClick={() => setPath((p) => [...p, node.id])}
					/>
				))}
			</div>
			<Button type="button" variant="ghost" size="sm" onClick={stepBack}>
				Kembali
			</Button>
		</div>
	);
}

function StepHeading({
	step,
	title,
	subtitle,
}: {
	step: string;
	title: string;
	subtitle: string;
}) {
	return (
		<div className="space-y-1.5">
			<p className="text-xs font-semibold uppercase tracking-wide text-primary">
				{step}
			</p>
			<h2 className="font-display text-xl font-semibold text-foreground md:text-2xl">
				{title}
			</h2>
			<p className="text-sm text-muted-foreground">{subtitle}</p>
		</div>
	);
}

function OptionCard({
	label,
	onClick,
}: {
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="group/option flex min-h-14 items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
		>
			<span>{label}</span>
			<ChevronRight
				className="size-4 shrink-0 text-muted-foreground transition-transform group-hover/option:translate-x-0.5 group-hover/option:text-primary"
				aria-hidden="true"
			/>
		</button>
	);
}

function Breadcrumbs({
	species,
	trail,
}: {
	species: string;
	trail: SymptomNode[];
}) {
	return (
		<nav
			aria-label="Langkah pemeriksaan"
			className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
		>
			<span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
				{species}
			</span>
			{trail.map((node) => (
				<span key={node.id} className="flex items-center gap-1.5">
					<ChevronRight className="size-3" aria-hidden="true" />
					<span className="rounded-full bg-muted px-2.5 py-1">
						{node.label}
					</span>
				</span>
			))}
		</nav>
	);
}
