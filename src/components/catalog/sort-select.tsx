import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS, type SortKey } from "./filter-logic";

interface SortSelectProps {
	value: SortKey;
	onChange: (value: SortKey) => void;
	className?: string;
}

export function SortSelect({ value, onChange, className }: SortSelectProps) {
	return (
		<Select
			value={value}
			onValueChange={(next) => onChange(next as SortKey)}
			items={SORT_OPTIONS}
		>
			<SelectTrigger
				size="default"
				className={className}
				aria-label="Urutkan produk"
			>
				<span className="text-muted-foreground">Urutkan</span>
				<SelectValue />
			</SelectTrigger>
			<SelectContent align="end">
				{SORT_OPTIONS.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
