import {
	AddressForm,
	type AddressFormValues,
} from "@/components/account/address-form";
import { useMediaQuery } from "@/components/account/use-media-query";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { Address } from "@/data/types";

interface AddressModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	address?: Address;
	forceDefault?: boolean;
	onSubmit: (values: AddressFormValues) => void;
}

export function AddressModal({
	open,
	onOpenChange,
	address,
	forceDefault,
	onSubmit,
}: AddressModalProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const isEdit = Boolean(address);
	const title = isEdit ? "Ubah alamat" : "Tambah alamat baru";
	const description = "Alamat ini bisa kamu pilih saat checkout.";

	const form = (
		<AddressForm
			initial={address}
			forceDefault={forceDefault}
			onSubmit={onSubmit}
			onCancel={() => onOpenChange(false)}
		/>
	);

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="max-h-[90vh] gap-4 overflow-y-auto sm:max-w-lg">
					<DialogHeader>
						<DialogTitle className="font-display text-xl">{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					{form}
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="bottom"
				className="max-h-[92vh] overflow-y-auto rounded-t-2xl"
			>
				<SheetHeader>
					<SheetTitle className="font-display text-xl">{title}</SheetTitle>
					<SheetDescription>{description}</SheetDescription>
				</SheetHeader>
				<div className="px-4 pb-6">{form}</div>
			</SheetContent>
		</Sheet>
	);
}
