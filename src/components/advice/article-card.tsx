import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import { petLabel, topicMeta } from "@/components/advice/topics";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/data/types";
import { formatDateID } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
	article: Article;
	className?: string;
	/** Wider hero treatment for a single featured article. */
	featured?: boolean;
}

export function ArticleCard({
	article,
	className,
	featured = false,
}: ArticleCardProps) {
	const topic = topicMeta(article.topic);
	const TopicIcon = topic.icon;

	return (
		<Link
			to="/advice/$slug"
			params={{ slug: article.slug }}
			className={cn(
				"group/article flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card outline-none transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring",
				featured && "md:flex-row",
				className,
			)}
		>
			<div
				className={cn(
					"relative overflow-hidden bg-muted",
					featured
						? "aspect-[16/10] md:aspect-auto md:w-1/2"
						: "aspect-[16/10]",
				)}
			>
				<img
					src={article.coverImage}
					alt={`Ilustrasi artikel ${article.title}`}
					loading="lazy"
					className="size-full object-cover transition-transform duration-300 group-hover/article:scale-105"
				/>
				<span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-primary backdrop-blur">
					<TopicIcon className="size-3.5" aria-hidden="true" />
					{topic.label}
				</span>
			</div>

			<div
				className={cn(
					"flex flex-1 flex-col gap-2.5 p-4",
					featured && "md:justify-center md:p-6",
				)}
			>
				<div className="flex flex-wrap gap-1.5">
					{article.petTypes.map((pet) => (
						<Badge key={pet} variant="secondary" className="text-[0.7rem]">
							{petLabel(pet)}
						</Badge>
					))}
				</div>

				<h3
					className={cn(
						"font-display font-semibold leading-snug text-foreground",
						featured ? "text-xl md:text-2xl" : "line-clamp-2 text-base",
					)}
				>
					{article.title}
				</h3>

				<p
					className={cn(
						"text-sm text-muted-foreground",
						featured ? "line-clamp-3" : "line-clamp-2",
					)}
				>
					{article.excerpt}
				</p>

				<div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
					<span className="font-medium text-foreground">
						{article.vetAuthor.name}
					</span>
					<span className="hidden sm:inline">
						{article.vetAuthor.credential}
					</span>
				</div>
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
		</Link>
	);
}
