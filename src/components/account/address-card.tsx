import { Briefcase, Home, MapPin, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Address } from "@/data/types";
import { cn } from "@/lib/utils";

const LABEL_META: Record<
	Address["label"],
	{ label: string; icon: typeof Home }
> = {
	home: { label: "Rumah", icon: Home },
	office: { label: "Kantor", icon: Briefcase },
	other: { label: "Lainnya", icon: MapPin },
};

interface AddressCardProps {
	address: Address;
	onEdit: () => void;
	onRemove: () => void;
	onSetDefault: () => void;
}

export function AddressCard({
	address,
	onEdit,
	onRemove,
	onSetDefault,
}: AddressCardProps) {
	const meta = LABEL_META[address.label];
	const Icon = meta.icon;

	return (
		<div
			className={cn(
				"flex flex-col gap-3 rounded-xl border bg-card p-4 transition-colors",
				address.isDefault
					? "border-primary/50 ring-1 ring-primary/20"
					: "border-border",
			)}
		>
			<div className="flex flex-wrap items-center gap-2">
				<span className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary">
					<Icon className="size-4" aria-hidden="true" />
				</span>
				<span className="font-medium text-foreground">{meta.label}</span>
				{address.isDefault ? <Badge variant="secondary">Utama</Badge> : null}
			</div>

			<div className="text-sm text-muted-foreground">
				<p className="font-medium text-foreground">{address.recipient}</p>
				<p>{address.phone}</p>
				<p className="mt-1">
					{address.street}, {address.kelurahan}, {address.kecamatan},{" "}
					{address.city}, {address.province} {address.postalCode}
				</p>
			</div>

			<div className="flex flex-wrap items-center gap-2 pt-1">
				{!address.isDefault ? (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onSetDefault}
					>
						Jadikan utama
					</Button>
				) : null}
				<Button type="button" variant="outline" size="sm" onClick={onEdit}>
					<Pencil className="size-3.5" />
					Ubah
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onRemove}
					className="text-destructive hover:bg-destructive/10 hover:text-destructive"
				>
					<Trash2 className="size-3.5" />
					Hapus
				</Button>
			</div>
		</div>
	);
}
