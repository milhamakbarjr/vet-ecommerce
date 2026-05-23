import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { PageSection } from "@/components/common/page-section";
import { ArticleCard } from "@/components/home/article-card";
import { CategoryGrid } from "@/components/home/category-grid";
import { Hero } from "@/components/home/hero";
import { TrustBand } from "@/components/home/trust-band";
import { ProductCard } from "@/components/product/product-card";
import { UpcomingDeliveryWidget } from "@/components/subscriptions/upcoming-delivery-widget";
import { useCatalog } from "@/context/catalog";
import { usePetProfiles } from "@/context/pet-profile";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const { recommendFor, articles } = useCatalog();
	const { activeProfile } = usePetProfiles();

	// Personalization reads localStorage-backed state that hydrates client-side.
	// Gate on mounted so the first server/client paint matches (non-personalized).
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);

	const personalized = mounted && activeProfile ? activeProfile : null;
	const recommendations = recommendFor(personalized, 8);
	const featuredArticles = articles.slice(0, 3);

	return (
		<div className="flex flex-col gap-4 py-6 md:gap-6 md:py-8">
			<Hero />

			<TrustBand />

			{/* Upcoming delivery (FR-36). Renders nothing without an active subscription. */}
			<UpcomingDeliveryWidget />

			{/* Personalized recommendations / vet picks (Journey 2 + personalization) */}
			<PageSection
				eyebrow={personalized ? "Saatnya isi ulang?" : "Pilihan dokter hewan"}
				title={
					personalized
						? `Rekomendasi untuk ${personalized.name}`
						: "Disetujui dokter hewan, dipercaya pemilik"
				}
				description={
					personalized
						? "Kami pilih berdasarkan jenis dan usia hewan kesayangan Anda."
						: "Produk yang paling sering direkomendasikan dokter hewan kami. Buat profil hewan untuk rekomendasi yang lebih sesuai."
				}
				action={
					<Link
						to="/products"
						className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						Lihat semua
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				}
				contentClassName="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
			>
				{recommendations.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</PageSection>

			{/* Category grid */}
			<PageSection
				eyebrow="Belanja per kategori"
				title="Semua kebutuhan, satu tempat"
				description="Dari makanan harian sampai perawatan kesehatan, semuanya dipilih dengan cermat."
			>
				<CategoryGrid />
			</PageSection>

			{/* Symptom checker entry (Journey 3) */}
			<section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-secondary/30 to-background p-6 md:p-8">
				<div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
					<div className="flex items-start gap-4">
						<span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
							<Stethoscope className="size-6" aria-hidden="true" />
						</span>
						<div className="max-w-xl">
							<p className="text-xs font-semibold uppercase tracking-wide text-primary">
								Pemeriksa gejala
							</p>
							<h2 className="mt-1 font-display text-2xl font-semibold text-foreground md:text-3xl">
								Hewanmu terlihat kurang fit?
							</h2>
							<p className="mt-2 text-sm text-muted-foreground">
								Coba pemeriksa gejala kami yang ditinjau dokter hewan. Pilih
								jenis hewan dan keluhannya, lalu dapatkan saran langkah
								berikutnya beserta produk yang bisa membantu.
							</p>
						</div>
					</div>
					<Link
						to="/advice/symptom-checker"
						className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						Coba pemeriksa gejala
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</div>
			</section>

			{/* Vet content / tips */}
			<PageSection
				eyebrow="Saran dokter hewan"
				title="Artikel yang ditulis dokter hewan"
				description="Panduan praktis tentang nutrisi, pencegahan, dan tanda-tanda yang perlu Anda kenali."
				action={
					<Link
						to="/advice"
						className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						Semua artikel
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				}
				contentClassName="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
			>
				{featuredArticles.map((article) => (
					<ArticleCard key={article.id} article={article} />
				))}
			</PageSection>

			{/* Why PetSehat social proof band */}
			<section className="rounded-2xl border border-border bg-card p-6 text-center md:p-10">
				<span className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
					<Sparkles className="size-6" aria-hidden="true" />
				</span>
				<h2 className="mx-auto mt-4 max-w-2xl font-display text-2xl font-semibold text-foreground md:text-3xl">
					Tempat ribuan pemilik merawat hewan kesayangannya
				</h2>
				<p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
					Saran yang jujur, produk yang teruji, dan pengiriman yang bisa
					diandalkan. Kami ada untuk membantu Anda memberi yang terbaik.
				</p>
				<div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
					<Stat value="60+" label="Produk pilihan" />
					<Stat value="Gratis" label="Saran dokter hewan" />
					<Stat value="4,7★" label="Rata-rata penilaian" />
					<Stat value="3 hari" label="Estimasi pengiriman" />
				</div>
			</section>
		</div>
	);
}

function Stat({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex flex-col items-center">
			<span className="font-display text-3xl font-bold text-primary">
				{value}
			</span>
			<span className="text-xs text-muted-foreground">{label}</span>
		</div>
	);
}
