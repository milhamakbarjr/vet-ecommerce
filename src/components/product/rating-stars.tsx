import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface DisplayProps {
	value: number;
	count?: number;
	className?: string;
	size?: number;
	showValue?: boolean;
	/** Display mode (default). */
	interactive?: false;
}

interface InputProps {
	value: number;
	onChange: (value: number) => void;
	className?: string;
	size?: number;
	interactive: true;
}

type RatingStarsProps = DisplayProps | InputProps;

const STAR_COUNT = 5;

export function RatingStars(props: RatingStarsProps) {
	const size = props.size ?? 16;

	if (props.interactive) {
		const { value, onChange, className } = props;
		return (
			<fieldset
				className={cn(
					"inline-flex items-center gap-0.5 border-0 p-0",
					className,
				)}
			>
				<legend className="sr-only">Beri rating</legend>
				{Array.from({ length: STAR_COUNT }, (_, i) => {
					const starValue = i + 1;
					const filled = starValue <= value;
					return (
						<label
							key={starValue}
							className="cursor-pointer rounded p-0.5 transition-transform hover:scale-110 focus-within:ring-2 focus-within:ring-ring"
						>
							<input
								type="radio"
								name="rating-input"
								value={starValue}
								checked={value === starValue}
								onChange={() => onChange(starValue)}
								className="sr-only"
							/>
							<span className="sr-only">{`${starValue} bintang`}</span>
							<Star
								width={size}
								height={size}
								className={cn(
									filled
										? "fill-accent text-accent"
										: "fill-transparent text-muted-foreground",
								)}
							/>
						</label>
					);
				})}
			</fieldset>
		);
	}

	const { value, count, className, showValue = true } = props;
	const rounded = Math.round(value * 2) / 2;
	return (
		<div
			role="img"
			className={cn("inline-flex items-center gap-1", className)}
			aria-label={`Rating ${value.toFixed(1)} dari 5${count != null ? `, ${count} ulasan` : ""}`}
		>
			<span className="inline-flex items-center" aria-hidden="true">
				{Array.from({ length: STAR_COUNT }, (_, i) => {
					const starValue = i + 1;
					const filled = starValue <= Math.floor(rounded);
					const half = !filled && starValue - 0.5 === rounded;
					return (
						<Star
							key={starValue}
							width={size}
							height={size}
							className={cn(
								filled || half
									? "fill-accent text-accent"
									: "fill-transparent text-muted-foreground/50",
							)}
						/>
					);
				})}
			</span>
			{showValue ? (
				<span className="text-xs font-medium text-foreground">
					{value.toFixed(1)}
				</span>
			) : null}
			{count != null ? (
				<span className="text-xs text-muted-foreground">({count})</span>
			) : null}
		</div>
	);
}
