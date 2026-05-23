import { createFileRoute } from "@tanstack/react-router";
import { Check, PawPrint, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AuthGate } from "@/components/account/auth-gate";
import {
	formatAge,
	lifestageLabel,
	sexLabel,
	speciesLabel,
} from "@/components/account/pet-labels";
import type { PetProfileFormValues } from "@/components/account/pet-profile-form";
import { PetProfileModal } from "@/components/account/pet-profile-modal";
import { SpeciesAvatar } from "@/components/account/species-avatar";
import { EmptyState } from "@/components/common/empty-state";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePetProfiles } from "@/context/pet-profile";
import type { PetProfile } from "@/data/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/pets")({ component: PetsPage });

const MAX_PROFILES = 5;
const LIMIT_MESSAGE =
	"Kamu bisa mengelola hingga 5 hewan. Hapus satu profil untuk menambah yang baru.";

function PetCard({
	profile,
	isActive,
	onSetActive,
	onEdit,
	onDelete,
}: {
	profile: PetProfile;
	isActive: boolean;
	onSetActive: () => void;
	onEdit: () => void;
	onDelete: () => void;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-colors",
				isActive ? "border-primary/50 ring-1 ring-primary/20" : "border-border",
			)}
		>
			<div className="flex items-start gap-4">
				<SpeciesAvatar species={profile.species} size="lg" />
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<h3 className="font-display text-lg font-semibold text-foreground">
							{profile.name}
						</h3>
						{isActive ? <Badge variant="secondary">Aktif</Badge> : null}
					</div>
					<p className="text-sm text-muted-foreground">
						{speciesLabel(profile.species)}
						{profile.breed ? ` · ${profile.breed}` : ""}
					</p>
				</div>
			</div>

			<dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
				<div>
					<dt className="text-xs text-muted-foreground">Usia</dt>
					<dd className="text-foreground">{formatAge(profile.ageMonths)}</dd>
				</div>
				<div>
					<dt className="text-xs text-muted-foreground">Tahap usia</dt>
					<dd className="text-foreground">
						{lifestageLabel(profile.ageMonths)}
					</dd>
				</div>
				<div>
					<dt className="text-xs text-muted-foreground">Jenis kelamin</dt>
					<dd className="text-foreground">{sexLabel(profile.sex)}</dd>
				</div>
				{profile.weightKg !== undefined ? (
					<div>
						<dt className="text-xs text-muted-foreground">Berat</dt>
						<dd className="text-foreground">{profile.weightKg} kg</dd>
					</div>
				) : null}
			</dl>

			{profile.healthNotes ? (
				<p className="rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
					{profile.healthNotes}
				</p>
			) : null}

			<div className="flex flex-wrap items-center gap-2 pt-1">
				{!isActive ? (
					<Button variant="secondary" size="sm" onClick={onSetActive}>
						<Check className="size-3.5" />
						Jadikan aktif
					</Button>
				) : null}
				<Button variant="outline" size="sm" onClick={onEdit}>
					<Pencil className="size-3.5" />
					Ubah
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={onDelete}
					className="text-destructive hover:bg-destructive/10 hover:text-destructive"
				>
					<Trash2 className="size-3.5" />
					Hapus
				</Button>
			</div>
		</div>
	);
}

function PetsInner() {
	const {
		profiles,
		activeProfileId,
		setActiveProfile,
		addProfile,
		updateProfile,
		deleteProfile,
	} = usePetProfiles();

	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<PetProfile | undefined>(undefined);
	const [limitError, setLimitError] = useState<string | null>(null);
	const [pendingDelete, setPendingDelete] = useState<PetProfile | undefined>(
		undefined,
	);

	const atLimit = profiles.length >= MAX_PROFILES;

	const openAdd = () => {
		if (atLimit) {
			setLimitError(LIMIT_MESSAGE);
			return;
		}
		setLimitError(null);
		setEditing(undefined);
		setModalOpen(true);
	};

	const openEdit = (profile: PetProfile) => {
		setEditing(profile);
		setModalOpen(true);
	};

	const handleSubmit = (values: PetProfileFormValues) => {
		if (editing) {
			updateProfile(editing.id, values);
			toast.success("Profil hewan diperbarui.");
			setModalOpen(false);
		} else {
			const result = addProfile(values);
			if (result.ok) {
				toast.success(`${values.name} berhasil ditambahkan.`);
				setModalOpen(false);
			} else {
				setModalOpen(false);
				setLimitError(result.message ?? LIMIT_MESSAGE);
			}
		}
	};

	const confirmDelete = () => {
		if (!pendingDelete) return;
		deleteProfile(pendingDelete.id);
		toast.success(`Profil ${pendingDelete.name} dihapus.`);
		setLimitError(null);
		setPendingDelete(undefined);
	};

	return (
		<div className="py-8">
			<header className="mb-6 flex flex-wrap items-end justify-between gap-4">
				<div>
					<h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
						Profil hewan
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Tambahkan hewan kesayanganmu agar rekomendasi kami lebih pas.
						Tersimpan {profiles.length} dari {MAX_PROFILES}.
					</p>
				</div>
				<Button size="lg" onClick={openAdd} disabled={atLimit}>
					<Plus className="size-4" />
					Tambah hewan
				</Button>
			</header>

			{limitError ? (
				<div
					role="alert"
					className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
				>
					{limitError}
				</div>
			) : null}

			{profiles.length === 0 ? (
				<EmptyState
					icon={PawPrint}
					title="Belum ada profil hewan"
					description="Buat profil pertama agar rekomendasi makanan, obat, dan perlengkapan menyesuaikan dengan hewanmu."
					action={
						<Button onClick={openAdd}>
							<Plus className="size-4" />
							Tambah hewan
						</Button>
					}
				/>
			) : (
				<div className="grid gap-4 sm:grid-cols-2">
					{profiles.map((profile) => (
						<PetCard
							key={profile.id}
							profile={profile}
							isActive={profile.id === activeProfileId}
							onSetActive={() => {
								setActiveProfile(profile.id);
								toast.success(`${profile.name} kini jadi profil aktif.`);
							}}
							onEdit={() => openEdit(profile)}
							onDelete={() => setPendingDelete(profile)}
						/>
					))}
				</div>
			)}

			<PetProfileModal
				open={modalOpen}
				onOpenChange={setModalOpen}
				profile={editing}
				onSubmit={handleSubmit}
			/>

			<AlertDialog
				open={pendingDelete !== undefined}
				onOpenChange={(open) => {
					if (!open) setPendingDelete(undefined);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Hapus profil hewan?</AlertDialogTitle>
						<AlertDialogDescription>
							Profil {pendingDelete?.name} akan dihapus permanen. Tindakan ini
							tidak bisa dibatalkan.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Batal</AlertDialogCancel>
						<AlertDialogAction variant="destructive" onClick={confirmDelete}>
							Hapus
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

function PetsPage() {
	return (
		<AuthGate
			title="Masuk untuk mengelola profil hewan"
			description="Profil hewan tersimpan di akunmu. Masuk dulu untuk melihatnya."
		>
			<PetsInner />
		</AuthGate>
	);
}
