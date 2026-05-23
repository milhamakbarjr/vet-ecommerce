import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import type { Article, ArticleTopic } from "@/data/types";
import { track } from "@/lib/analytics";

const TOPIC_LABEL: Record<ArticleTopic, string> = {
	nutrition: "Nutrisi",
	preventive: "Pencegahan",
	symptoms: "Gejala",
	breed: "Panduan Ras",
};

export function ArticleCard({ article }: { article: Article }) {
	return (
		<Link
			to="/advice/$slug"
			params={{ slug: article.slug }}
			onClick={() => track("vet_content_viewed", { slug: article.slug })}
			className="group/article flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card outline-none transition-shadow hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
		>
			<div className="relative aspect-[16/10] overflow-hidden bg-muted">
				<img
					src={article.coverImage}
					alt={article.title}
					loading="lazy"
					className="size-full object-cover transition-transform duration-300 group-hover/article:scale-105"
				/>
				<span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-0.5 text-[0.7rem] font-semibold text-primary">
					{TOPIC_LABEL[article.topic]}
				</span>
			</div>
			<div className="flex flex-1 flex-col gap-2 p-4">
				<h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-foreground">
					{article.title}
				</h3>
				<p className="line-clamp-2 text-sm text-muted-foreground">
					{article.excerpt}
				</p>
				<div className="mt-auto flex items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
					<span className="truncate">{article.vetAuthor.name}</span>
					<span className="flex shrink-0 items-center gap-1">
						<Clock className="size-3.5" aria-hidden="true" />
						{article.readMinutes} menit
					</span>
				</div>
			</div>
		</Link>
	);
}
