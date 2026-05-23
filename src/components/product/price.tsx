import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface PriceProps {
	value: number;
	compareAt?: number;
	className?: string;
	/** Visual size of the primary price. */
	size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<NonNullable<PriceProps["size"]>, string> = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-xl",
};

export function Price({
	value,
	compareAt,
	className,
	size = "md",
}: PriceProps) {
	const hasDiscount = typeof compareAt === "number" && compareAt > value;
	const pct = hasDiscount
		? Math.round(((compareAt - value) / compareAt) * 100)
		: 0;

	return (
		<div
			className={cn(
				"flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
				className,
			)}
		>
			<span className={cn("font-semibold text-foreground", SIZE_CLASSES[size])}>
				{formatIDR(value)}
			</span>
			{hasDiscount ? (
				<>
					<span className="text-xs text-muted-foreground line-through">
						{formatIDR(compareAt)}
					</span>
					<span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.7rem] font-semibold text-primary">
						Hemat {pct}%
					</span>
				</>
			) : null}
		</div>
	);
}
