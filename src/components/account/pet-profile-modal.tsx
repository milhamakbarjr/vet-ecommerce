import {
	PetProfileForm,
	type PetProfileFormValues,
} from "@/components/account/pet-profile-form";
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
import type { PetProfile } from "@/data/types";

interface PetProfileModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Existing profile to edit; omit to create a new one. */
	profile?: PetProfile;
	onSubmit: (values: PetProfileFormValues) => void;
}

/**
 * Create/edit a pet profile. Renders as a centered Dialog on desktop and a
 * bottom Sheet on mobile. Exported so other surfaces (e.g. the header "Tambah
 * hewan" affordance) can reuse the same flow.
 */
export function PetProfileModal({
	open,
	onOpenChange,
	profile,
	onSubmit,
}: PetProfileModalProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const isEdit = Boolean(profile);
	const title = isEdit ? "Ubah profil hewan" : "Tambah hewan baru";
	const description = isEdit
		? "Perbarui detail agar rekomendasi tetap pas untuknya."
		: "Ceritakan tentang hewan kesayanganmu agar rekomendasi lebih sesuai.";

	const form = (
		<PetProfileForm
			initial={profile}
			submitLabel={isEdit ? "Simpan perubahan" : "Tambah hewan"}
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
