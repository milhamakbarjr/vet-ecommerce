import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock, FileQuestion, ShoppingBag } from "lucide-react";
import { useEffect, useMemo } from "react";

import { petLabel, topicMeta } from "@/components/advice/topics";
import { VetByline } from "@/components/advice/vet-byline";
import { EmptyState } from "@/components/common/empty-state";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCatalog } from "@/context/catalog";
import { track } from "@/lib/analytics";
import { formatDateID } from "@/lib/format";

export const Route = createFileRoute("/advice/$slug")({
	component: ArticleDetail,
});

interface Block {
	type: "heading" | "paragraph";
	text: string;
}

/** Split the markdown-ish body into paragraphs on blank lines, detecting simple headings. */
function parseBody(body: string): Block[] {
	return body
		.split(/\n\s*\n/)
		.map((chunk) => chunk.trim())
		.filter(Boolean)
		.map((chunk) => {
			const heading = chunk.match(/^#{1,3}\s+(.*)$/);
			if (heading) return { type: "heading", text: heading[1].trim() };
			return { type: "paragraph", text: chunk };
		});
}

function ArticleDetail() {
	const { slug } = useParams({ from: "/advice/$slug" });
	const { getArticle, getProduct } = useCatalog();
	const article = getArticle(slug);

	useEffect(() => {
		if (article) track("vet_content_viewed", { slug });
	}, [article, slug]);

	const blocks = useMemo(
		() => (article ? parseBody(article.body) : []),
		[article],
	);

	const relatedProducts = useMemo(() => {
		if (!article) return [];
		return article.relatedProductIds
			.map((id) => getProduct(id))
			.filter((p): p is NonNullable<typeof p> => Boolean(p));
	}, [article, getProduct]);

	if (!article) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16">
				<EmptyState
					icon={FileQuestion}
					title="Artikel tidak ditemukan"
					description="Artikel yang kamu cari mungkin sudah dipindahkan atau tautannya keliru."
					action={
						<Button render={<Link to="/advice" />}>
							Kembali ke Saran Dokter
						</Button>
					}
				/>
			</div>
		);
	}

	const topic = topicMeta(article.topic);
	const TopicIcon = topic.icon;

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

			<header className="space-y-4">
				<span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground ring-1 ring-accent/40">
					<TopicIcon className="size-3.5 text-primary" aria-hidden="true" />
					{topic.label}
				</span>

				<h1 className="font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
					{article.title}
				</h1>

				<p className="text-lg text-muted-foreground">{article.excerpt}</p>

				<div className="flex flex-wrap items-center justify-between gap-3 border-y border-border py-4">
					<VetByline
						name={article.vetAuthor.name}
						credential={article.vetAuthor.credential}
						size="md"
					/>
					<div className="flex items-center gap-3 text-xs text-muted-foreground">
						<span className="inline-flex items-center gap-1">
							<Clock className="size-3.5" aria-hidden="true" />
							{article.readMinutes} menit baca
						</span>
						<span aria-hidden="true">&middot;</span>
						<time dateTime={article.publishedAt}>
							{formatDateID(article.publishedAt)}
						</time>
					</div>
				</div>

				<div className="flex flex-wrap gap-1.5">
					{article.petTypes.map((pet) => (
						<Badge key={pet} variant="secondary">
							{petLabel(pet)}
						</Badge>
					))}
				</div>
			</header>

			<figure className="my-6 overflow-hidden rounded-2xl bg-muted">
				<img
					src={article.coverImage}
					alt={`Ilustrasi untuk artikel ${article.title}`}
					className="aspect-[16/9] w-full object-cover"
				/>
			</figure>

			<article className="space-y-5 text-base leading-relaxed text-foreground">
				{blocks.map((block, i) =>
					block.type === "heading" ? (
						<h2
							// biome-ignore lint/suspicious/noArrayIndexKey: static parsed body, order is stable
							key={i}
							className="font-display text-xl font-semibold text-foreground"
						>
							{block.text}
						</h2>
					) : (
						<p
							// biome-ignore lint/suspicious/noArrayIndexKey: static parsed body, order is stable
							key={i}
						>
							{block.text}
						</p>
					),
				)}
			</article>

			{relatedProducts.length > 0 ? (
				<section className="mt-12 border-t border-border pt-8">
					<div className="mb-2 flex items-center gap-2">
						<ShoppingBag className="size-4 text-primary" aria-hidden="true" />
						<h2 className="font-display text-xl font-semibold text-foreground">
							Produk yang direkomendasikan
						</h2>
					</div>
					<p className="mb-5 text-sm text-muted-foreground">
						Pilihan yang sejalan dengan saran di atas, supaya kamu bisa langsung
						mempraktikkannya di rumah.
					</p>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
						{relatedProducts.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				</section>
			) : null}

			<aside className="mt-10 rounded-2xl bg-secondary/50 p-6 text-center">
				<h2 className="font-display text-lg font-semibold text-foreground">
					Masih ada yang ingin kamu tanyakan?
				</h2>
				<p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
					Tim dokter hewan kami siap membantu. Kirim pertanyaanmu dan dapatkan
					jawaban dalam 2 hari kerja.
				</p>
				<Button className="mt-4" render={<Link to="/advice/ask" />}>
					Tanya Dokter
				</Button>
			</aside>
		</div>
	);
}
