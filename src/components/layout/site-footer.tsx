import { Link } from "@tanstack/react-router";
import { PawPrint } from "lucide-react";

const SHOP_LINKS = [
	{
		to: "/products/$category",
		params: { category: "food" },
		label: "Makanan & Nutrisi",
	},
	{
		to: "/products/$category",
		params: { category: "health" },
		label: "Kesehatan & Obat",
	},
	{
		to: "/products/$category",
		params: { category: "supplies" },
		label: "Perlengkapan",
	},
	{ to: "/products", params: undefined, label: "Semua Produk" },
] as const;

const ADVICE_LINKS = [
	{ to: "/advice", label: "Artikel Dokter" },
	{ to: "/advice/symptom-checker", label: "Cek Gejala" },
	{ to: "/advice/ask", label: "Tanya Dokter" },
] as const;

const ACCOUNT_LINKS = [
	{ to: "/account", label: "Akun Saya" },
	{ to: "/account/orders", label: "Pesanan" },
	{ to: "/account/subscriptions", label: "Langganan" },
] as const;

export function SiteFooter() {
	return (
		<footer className="border-t border-border bg-muted/40">
			<div className="mx-auto max-w-7xl px-4 py-12">
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
					<div className="lg:col-span-2">
						<div className="flex items-center gap-1.5">
							<PawPrint className="size-6 text-primary" aria-hidden="true" />
							<span className="font-display text-xl font-bold text-primary">
								PetSehat
							</span>
						</div>
						<p className="mt-3 max-w-sm text-sm text-muted-foreground">
							Belanja kebutuhan hewan kesayangan dengan panduan dokter hewan
							tepercaya. Kami bantu Anda merawat mereka dengan lebih tenang.
						</p>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-foreground">Belanja</h3>
						<ul className="mt-3 space-y-2">
							{SHOP_LINKS.map((link) => (
								<li key={link.label}>
									<Link
										to={link.to}
										params={link.params}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-foreground">
							Saran Dokter
						</h3>
						<ul className="mt-3 space-y-2">
							{ADVICE_LINKS.map((link) => (
								<li key={link.label}>
									<Link
										to={link.to}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="text-sm font-semibold text-foreground">Akun</h3>
						<ul className="mt-3 space-y-2">
							{ACCOUNT_LINKS.map((link) => (
								<li key={link.label}>
									<Link
										to={link.to}
										className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
					<p>
						Pembayaran aman lewat GoPay, OVO, DANA, QRIS, dan Virtual Account.
					</p>
					<p>
						Dikirim oleh JNE, J&amp;T Express, dan SiCepat ke seluruh Indonesia.
					</p>
				</div>
				<p className="mt-4 text-xs text-muted-foreground">
					&copy; {new Date().getFullYear()} PetSehat. Toko demo untuk tujuan
					peragaan.
				</p>
			</div>
		</footer>
	);
}
