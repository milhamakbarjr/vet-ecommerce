import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, FileQuestion, ShieldCheck } from "lucide-react";
import { useMemo } from "react";

import { VetByline } from "@/components/advice/vet-byline";
import { EmptyState } from "@/components/common/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/context/catalog";

export const Route = createFileRoute("/advice/guide/$slug")({
	component: GuideDetail,
});

function GuideDetail() {
	const { slug } = useParams({ from: "/advice/guide/$slug" });
	const { getGuide, getProduct } = useCatalog();
	const guide = getGuide(slug);

	const products = useMemo(() => {
		if (!guide) return [];
		return guide.productIds
			.map((id) => getProduct(id))
			.filter((p): p is NonNullable<typeof p> => Boolean(p));
	}, [guide, getProduct]);

	if (!guide) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16">
				<EmptyState
					icon={FileQuestion}
					title="Panduan tidak ditemukan"
					description="Panduan yang kamu cari mungkin sudah dipindahkan atau tautannya keliru."
					action={
						<Button render={<Link to="/advice" />}>
							Kembali ke Saran Dokter
						</Button>
					}
				/>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
			<Button
				variant="ghost"
				size="sm"
				className="mb-5 -ml-2"
				render={<Link to="/advice" />}
			>
				<ArrowLeft className="size-4" />
				Kembali ke Saran Dokter
			</Button>

			<header className="space-y-4">
				<span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground ring-1 ring-accent/40">
					<ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
					Panduan terkurasi dokter
				</span>
				<h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
					{guide.title}
				</h1>
				<p className="max-w-2xl text-lg text-muted-foreground">{guide.intro}</p>
				<div className="border-y border-border py-4">
					<VetByline
						name={guide.vetAuthor.name}
						credential={guide.vetAuthor.credential}
						size="md"
					/>
				</div>
			</header>

			<section className="mt-8">
				<div className="mb-5 flex items-baseline justify-between gap-3">
					<h2 className="font-display text-xl font-semibold text-foreground">
						Produk pilihan dokter
					</h2>
					<span className="text-sm text-muted-foreground">
						{products.length} produk
					</span>
				</div>

				{products.length === 0 ? (
					<EmptyState
						title="Produk belum tersedia"
						description="Daftar produk untuk panduan ini sedang kami siapkan."
					/>
				) : (
					<ol className="space-y-4">
						{products.map((product, index) => (
							<li
								key={product.id}
								className="grid items-stretch gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_auto]"
							>
								<div className="flex flex-col gap-2">
									<span className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary">
										<span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs">
											{index + 1}
										</span>
										Pilihan ke-{index + 1}
									</span>
									<h3 className="font-display text-lg font-semibold leading-snug text-foreground">
										{product.name}
									</h3>
									{product.vetNote ? (
										<div className="rounded-xl bg-secondary/50 p-3">
											<p className="text-sm leading-relaxed text-foreground">
												&ldquo;{product.vetNote.text}&rdquo;
											</p>
											<p className="mt-2 text-xs font-medium text-muted-foreground">
												{product.vetNote.vetName}, {product.vetNote.credential}
											</p>
										</div>
									) : (
										<p className="text-sm leading-relaxed text-muted-foreground">
											{product.description}
										</p>
									)}
								</div>
								<div className="w-full sm:w-56">
									<ProductCard product={product} className="h-full" />
								</div>
							</li>
						))}
					</ol>
				)}
			</section>

			<aside className="mt-10 rounded-2xl bg-secondary/50 p-6 text-center">
				<h2 className="font-display text-lg font-semibold text-foreground">
					Belum yakin mana yang pas?
				</h2>
				<p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
					Kirim pertanyaanmu ke tim dokter hewan kami dan kami bantu memilih
					yang paling sesuai untuk hewanmu.
				</p>
				<Button className="mt-4" render={<Link to="/advice/ask" />}>
					Tanya Dokter
				</Button>
			</aside>
		</div>
	);
}
