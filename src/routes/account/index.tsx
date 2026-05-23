import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ChevronRight,
	LogOut,
	type LucideIcon,
	Package,
	PawPrint,
	Plus,
	RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AccountSettings } from "@/components/account/account-settings";
import { AddressCard } from "@/components/account/address-card";
import type { AddressFormValues } from "@/components/account/address-form";
import { AddressModal } from "@/components/account/address-modal";
import { AuthGate } from "@/components/account/auth-gate";
import { ProfileDetails } from "@/components/account/profile-details";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import type { Address } from "@/data/types";

export const Route = createFileRoute("/account/")({ component: AccountPage });

const MAX_ADDRESSES = 3;

function SectionCard({
	title,
	description,
	action,
	children,
}: {
	title: string;
	description?: string;
	action?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<section className="rounded-2xl bg-card p-5 ring-1 ring-foreground/10 md:p-6">
			<div className="mb-4 flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="font-display text-lg font-semibold text-foreground">
						{title}
					</h2>
					{description ? (
						<p className="mt-0.5 text-sm text-muted-foreground">
							{description}
						</p>
					) : null}
				</div>
				{action}
			</div>
			{children}
		</section>
	);
}

function QuickLink({
	to,
	icon: Icon,
	title,
	description,
}: {
	to: string;
	icon: LucideIcon;
	title: string;
	description: string;
}) {
	return (
		<Link
			to={to}
			className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/50"
		>
			<span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
				<Icon className="size-5" aria-hidden="true" />
			</span>
			<span className="min-w-0 flex-1">
				<span className="block font-medium text-foreground">{title}</span>
				<span className="block text-sm text-muted-foreground">
					{description}
				</span>
			</span>
			<ChevronRight
				className="size-5 shrink-0 text-muted-foreground"
				aria-hidden="true"
			/>
		</Link>
	);
}

function AccountInner() {
	const navigate = useNavigate();
	const { user, logout, addAddress, updateAddress, removeAddress } = useAuth();

	const [addressModalOpen, setAddressModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<Address | undefined>(
		undefined,
	);

	if (!user) return null;

	const addresses = user.addresses;
	const canAddAddress = addresses.length < MAX_ADDRESSES;

	const openAddAddress = () => {
		setEditingAddress(undefined);
		setAddressModalOpen(true);
	};

	const openEditAddress = (address: Address) => {
		setEditingAddress(address);
		setAddressModalOpen(true);
	};

	const handleAddressSubmit = (values: AddressFormValues) => {
		if (editingAddress) {
			updateAddress(editingAddress.id, values);
			toast.success("Alamat diperbarui.");
		} else {
			addAddress(values);
			toast.success("Alamat ditambahkan.");
		}
		setAddressModalOpen(false);
	};

	const handleRemove = (address: Address) => {
		removeAddress(address.id);
		toast.success("Alamat dihapus.");
	};

	const handleSetDefault = (address: Address) => {
		updateAddress(address.id, { isDefault: true });
		toast.success("Alamat utama diperbarui.");
	};

	const handleLogout = () => {
		logout();
		toast.success("Kamu telah keluar.");
		navigate({ to: "/" });
	};

	const initials = user.name
		.split(" ")
		.map((p) => p[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();

	return (
		<div className="py-8">
			<header className="mb-6 flex flex-wrap items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<span className="flex size-14 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
						{initials}
					</span>
					<div>
						<h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
							{user.name}
						</h1>
						<p className="text-sm text-muted-foreground">{user.email}</p>
					</div>
				</div>
				<Button variant="outline" size="lg" onClick={handleLogout}>
					<LogOut className="size-4" />
					Keluar
				</Button>
			</header>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="flex flex-col gap-6 lg:col-span-2">
					<SectionCard
						title="Informasi akun"
						description="Pastikan data ini selalu terbaru agar pesananmu lancar."
					>
						<ProfileDetails />
					</SectionCard>

					<SectionCard
						title="Alamat pengiriman"
						description={`Simpan hingga ${MAX_ADDRESSES} alamat untuk checkout lebih cepat.`}
						action={
							canAddAddress ? (
								<Button variant="outline" size="sm" onClick={openAddAddress}>
									<Plus className="size-4" />
									Tambah
								</Button>
							) : null
						}
					>
						{addresses.length === 0 ? (
							<div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-8 text-center">
								<p className="text-sm text-muted-foreground">
									Belum ada alamat tersimpan. Tambahkan satu agar checkout lebih
									cepat.
								</p>
								<Button
									variant="secondary"
									size="sm"
									onClick={openAddAddress}
									className="mt-3"
								>
									<Plus className="size-4" />
									Tambah alamat
								</Button>
							</div>
						) : (
							<div className="grid gap-3 sm:grid-cols-2">
								{addresses.map((address) => (
									<AddressCard
										key={address.id}
										address={address}
										onEdit={() => openEditAddress(address)}
										onRemove={() => handleRemove(address)}
										onSetDefault={() => handleSetDefault(address)}
									/>
								))}
							</div>
						)}
						{!canAddAddress ? (
							<p className="mt-3 text-xs text-muted-foreground">
								Kamu sudah menyimpan {MAX_ADDRESSES} alamat. Hapus satu untuk
								menambah yang baru.
							</p>
						) : null}
					</SectionCard>

					<SectionCard
						title="Pengaturan akun"
						description="Atur bahasa dan notifikasi sesuai preferensimu."
					>
						<AccountSettings />
					</SectionCard>
				</div>

				<div className="flex flex-col gap-3">
					<QuickLink
						to="/account/pets"
						icon={PawPrint}
						title="Profil hewan"
						description="Kelola hewan kesayanganmu"
					/>
					<QuickLink
						to="/account/orders"
						icon={Package}
						title="Pesanan saya"
						description="Lihat riwayat dan lacak pesanan"
					/>
					<QuickLink
						to="/account/subscriptions"
						icon={RefreshCw}
						title="Langganan"
						description="Atur pengiriman rutin"
					/>
				</div>
			</div>

			<AddressModal
				open={addressModalOpen}
				onOpenChange={setAddressModalOpen}
				address={editingAddress}
				forceDefault={addresses.length === 0}
				onSubmit={handleAddressSubmit}
			/>
		</div>
	);
}

function AccountPage() {
	return (
		<AuthGate
			title="Masuk untuk melihat akunmu"
			description="Kelola profil, alamat, dan preferensi setelah kamu masuk."
		>
			<AccountInner />
		</AuthGate>
	);
}
