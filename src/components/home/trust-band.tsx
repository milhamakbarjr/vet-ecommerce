import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	HeartHandshake,
	ShieldCheck,
	Stethoscope,
} from "lucide-react";

const POINTS = [
	{
		icon: Stethoscope,
		title: "Saran dokter hewan, gratis",
		body: "Setiap pertanyaan tentang nutrisi, gejala, atau perawatan dijawab oleh tim dokter hewan kami tanpa biaya konsultasi.",
	},
	{
		icon: ShieldCheck,
		title: "Produk yang sudah ditinjau",
		body: "Pilihan makanan dan obat kami ditinjau dokter hewan, jadi Anda bisa belanja tanpa ragu menebak-nebak.",
	},
	{
		icon: HeartHandshake,
		title: "Dukungan untuk setiap pemilik",
		body: "Baru pertama kali memelihara atau sudah berpengalaman, kami menemani Anda merawat hewan kesayangan.",
	},
];

export function TrustBand() {
	return (
		<section className="rounded-2xl border border-border bg-secondary/40 p-6 md:p-8">
			<div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
				<div className="max-w-md">
					<p className="text-xs font-semibold uppercase tracking-wide text-primary">
						Kepercayaan dibangun dari keahlian
					</p>
					<h2 className="mt-1 font-display text-2xl font-semibold text-foreground md:text-3xl">
						Keahlian dokter hewan di setiap halaman
					</h2>
					<p className="mt-2 text-sm text-muted-foreground">
						Kami percaya pemilik hewan membuat keputusan lebih baik ketika
						pengetahuan dokter hewan benar-benar tersedia. Karena itu saran kami
						selalu gratis.
					</p>
					<Link
						to="/advice"
						className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-background px-4 text-sm font-semibold text-primary ring-1 ring-border transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
					>
						Jelajahi Saran Dokter
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				</div>

				<ul className="grid flex-1 gap-4 sm:grid-cols-2 md:max-w-2xl md:grid-cols-1 lg:grid-cols-3">
					{POINTS.map((point) => {
						const Icon = point.icon;
						return (
							<li
								key={point.title}
								className="flex flex-col gap-2 rounded-xl bg-background/70 p-4"
							>
								<span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
									<Icon className="size-5" aria-hidden="true" />
								</span>
								<h3 className="text-sm font-semibold text-foreground">
									{point.title}
								</h3>
								<p className="text-xs leading-relaxed text-muted-foreground">
									{point.body}
								</p>
							</li>
						);
					})}
				</ul>
			</div>
		</section>
	);
}
