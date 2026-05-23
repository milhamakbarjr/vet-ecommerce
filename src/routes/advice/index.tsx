import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	MessageCircleQuestion,
	ShieldCheck,
	Stethoscope,
} from "lucide-react";
import { useMemo, useState } from "react";

import { ArticleCard } from "@/components/advice/article-card";
import { ArticleFilters } from "@/components/advice/article-filters";
import { VetByline } from "@/components/advice/vet-byline";
import { EmptyState } from "@/components/common/empty-state";
import { PageSection } from "@/components/common/page-section";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/context/catalog";
import type { ArticleTopic, PetSpecies } from "@/data/types";

export const Route = createFileRoute("/advice/")({ component: AdviceHub });

function AdviceHub() {
	const { articles, guides } = useCatalog();
	const [topic, setTopic] = useState<ArticleTopic | "all">("all");
	const [petType, setPetType] = useState<PetSpecies | "all">("all");

	const featured = articles[0];

	const availablePetTypes = useMemo(() => {
		const set = new Set<PetSpecies>();
		for (const a of articles) for (const p of a.petTypes) set.add(p);
		return Array.from(set);
	}, [articles]);

	const sorted = useMemo(
		() =>
			[...articles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
		[articles],
	);

	const filtered = useMemo(
		() =>
			sorted.filter((a) => {
				const topicOk = topic === "all" || a.topic === topic;
				const petOk = petType === "all" || a.petTypes.includes(petType);
				return topicOk && petOk;
			}),
		[sorted, topic, petType],
	);

	return (
		<div className="mx-auto max-w-7xl px-4">
			{/* Hero */}
			<section className="relative overflow-hidden rounded-2xl bg-secondary/60 px-6 py-10 md:px-10 md:py-14">
				<div className="max-w-2xl">
					<span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-accent/40">
						<ShieldCheck className="size-3.5" aria-hidden="true" />
						Ditinjau dokter hewan
					</span>
					<h1 className="mt-4 font-display text-3xl font-bold leading-tight text-foreground md:text-5xl">
						Saran dokter hewan, gratis untuk semua pemilik hewan
					</h1>
					<p className="mt-4 text-base text-muted-foreground md:text-lg">
						Kami percaya kamu berhak mendapat jawaban yang tepat tanpa harus
						bingung sendirian. Baca panduan kami, cek gejala hewanmu, atau kirim
						pertanyaan langsung ke tim dokter hewan kami.
					</p>
					<div className="mt-6 flex flex-wrap gap-3">
						<Button size="lg" render={<Link to="/advice/symptom-checker" />}>
							<Stethoscope className="size-4" />
							Cek Gejala Hewan
						</Button>
						<Button
							size="lg"
							variant="outline"
							render={<Link to="/advice/ask" />}
						>
							<MessageCircleQuestion className="size-4" />
							Tanya Dokter
						</Button>
					</div>
				</div>
			</section>

			{/* Entry points */}
			<div className="mt-8 grid gap-4 sm:grid-cols-2">
				<Link
					to="/advice/symptom-checker"
					className="group/entry flex items-start gap-4 rounded-xl border border-border bg-card p-5 outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
				>
					<span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<Stethoscope className="size-6" aria-hidden="true" />
					</span>
					<div className="flex-1">
						<h2 className="font-display text-lg font-semibold text-foreground">
							Hewanmu terlihat kurang fit?
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Jawab beberapa pertanyaan singkat dan dapatkan penilaian awal
							serta saran produk dari dokter kami.
						</p>
						<span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
							Mulai cek gejala
							<ArrowRight className="size-4 transition-transform group-hover/entry:translate-x-0.5" />
						</span>
					</div>
				</Link>

				<Link
					to="/advice/ask"
					className="group/entry flex items-start gap-4 rounded-xl border border-border bg-card p-5 outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
				>
					<span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/30 text-accent-foreground">
						<MessageCircleQuestion className="size-6" aria-hidden="true" />
					</span>
					<div className="flex-1">
						<h2 className="font-display text-lg font-semibold text-foreground">
							Punya pertanyaan khusus?
						</h2>
						<p className="mt-1 text-sm text-muted-foreground">
							Tulis pertanyaanmu dan tim dokter hewan kami akan menjawab dalam 2
							hari kerja. Tanpa biaya.
						</p>
						<span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
							Kirim pertanyaan
							<ArrowRight className="size-4 transition-transform group-hover/entry:translate-x-0.5" />
						</span>
					</div>
				</Link>
			</div>

			{/* Featured article */}
			{featured ? (
				<PageSection
					title="Pilihan dokter minggu ini"
					eyebrow="Sorotan"
					className="pb-2"
				>
					<ArticleCard article={featured} featured />
				</PageSection>
			) : null}

			{/* Article library with filters */}
			<PageSection
				title="Pustaka artikel"
				eyebrow="Semua panduan"
				description="Tulisan dari dokter hewan kami, dikelompokkan agar mudah kamu temukan."
			>
				<div className="mb-6">
					<ArticleFilters
						topic={topic}
						petType={petType}
						onTopicChange={setTopic}
						onPetTypeChange={setPetType}
						availablePetTypes={availablePetTypes}
					/>
				</div>

				{filtered.length === 0 ? (
					<EmptyState
						title="Belum ada artikel yang cocok"
						description="Coba ganti pilihan topik atau jenis hewan untuk melihat panduan lainnya."
						action={
							<Button
								variant="outline"
								onClick={() => {
									setTopic("all");
									setPetType("all");
								}}
							>
								Atur ulang filter
							</Button>
						}
					/>
				) : (
					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{filtered.map((article) => (
							<ArticleCard key={article.id} article={article} />
						))}
					</div>
				)}
			</PageSection>

			{/* Featured guides */}
			{guides.length > 0 ? (
				<PageSection
					title="Panduan belanja dari dokter"
					eyebrow="Rekomendasi terkurasi"
					description="Daftar produk pilihan untuk kebutuhan tertentu, lengkap dengan alasan dokter memilihnya."
					action={
						<Button variant="ghost" size="sm" render={<Link to="/advice" />}>
							Lihat semua
						</Button>
					}
				>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{guides.map((guide) => (
							<Link
								key={guide.id}
								to="/advice/guide/$slug"
								params={{ slug: guide.slug }}
								className="group/guide flex flex-col gap-3 rounded-xl border border-border bg-card p-5 outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring"
							>
								<span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground ring-1 ring-accent/40">
									<ShieldCheck
										className="size-3.5 text-primary"
										aria-hidden="true"
									/>
									Panduan terkurasi
								</span>
								<h3 className="font-display text-lg font-semibold leading-snug text-foreground">
									{guide.title}
								</h3>
								<p className="line-clamp-3 text-sm text-muted-foreground">
									{guide.intro}
								</p>
								<div className="mt-auto pt-2">
									<VetByline
										name={guide.vetAuthor.name}
										credential={guide.vetAuthor.credential}
									/>
								</div>
							</Link>
						))}
					</div>
				</PageSection>
			) : null}
		</div>
	);
}
