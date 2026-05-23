import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, PawPrint, Sparkles, Stethoscope } from "lucide-react";

import { QuickProfileModal } from "@/components/home/quick-profile-modal";
import { VetBadge } from "@/components/product/vet-badge";

export function Hero() {
	const navigate = useNavigate();

	return (
		<section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/60 via-background to-background">
			{/* Soft honey glow accent, decorative only */}
			<div
				className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/30 blur-3xl"
				aria-hidden="true"
			/>
			<div className="relative grid items-center gap-8 p-6 md:grid-cols-2 md:gap-6 md:p-10 lg:p-14">
				<div className="flex flex-col items-start gap-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
					<VetBadge />
					<h1 className="font-display text-4xl font-bold leading-[1.05] text-foreground sm:text-5xl lg:text-6xl">
						Belanja kebutuhan hewan dengan panduan dokter
					</h1>
					<p className="max-w-md text-base text-muted-foreground md:text-lg">
						Makanan, vitamin, dan perlengkapan yang ditinjau dokter hewan.
						Ceritakan tentang hewan Anda, lalu kami tampilkan pilihan yang
						paling cocok untuknya.
					</p>

					<div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
						<QuickProfileModal
							onCreated={() => navigate({ to: "/products" })}
							trigger={
								<button
									type="button"
									className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
								>
									<PawPrint className="size-5" aria-hidden="true" />
									Cari makanan untuk hewan saya
								</button>
							}
						/>
						<Link
							to="/products"
							className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-background px-6 text-base font-semibold text-foreground ring-1 ring-border transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
						>
							Lihat semua produk
							<ArrowRight className="size-4" aria-hidden="true" />
						</Link>
					</div>

					<p className="flex items-center gap-1.5 text-sm text-muted-foreground">
						<Sparkles className="size-4 text-primary" aria-hidden="true" />
						Lebih dari 60 produk pilihan untuk kucing, anjing, dan hewan kecil.
					</p>
				</div>

				<div className="relative animate-in fade-in zoom-in-95 duration-700">
					<div className="overflow-hidden rounded-2xl border border-border shadow-sm">
						<img
							src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1100&q=80"
							alt="Kucing dan anjing peliharaan yang sehat berdampingan"
							className="aspect-[4/3] size-full object-cover"
						/>
					</div>
					<div className="absolute -bottom-4 -left-4 hidden max-w-56 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-md sm:flex">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
							<Stethoscope className="size-5" aria-hidden="true" />
						</span>
						<p className="text-sm font-medium leading-snug text-foreground">
							Tanya dokter hewan kami, gratis kapan saja.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
