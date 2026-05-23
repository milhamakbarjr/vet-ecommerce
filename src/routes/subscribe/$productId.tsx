import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	CalendarClock,
	CheckCircle2,
	CreditCard,
	Minus,
	PackageX,
	Plus,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { Price } from "@/components/product/price";
import { FrequencyCards } from "@/components/subscriptions/frequency-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/auth";
import { useCatalog } from "@/context/catalog";
import {
	type AddSubscriptionInput,
	FREQUENCY_DAYS,
	FREQUENCY_LABELS,
	useSubscriptions,
} from "@/context/subscriptions";
import { paymentMethods } from "@/data/payments";
import type {
	Address,
	Subscription,
	SubscriptionFrequency,
} from "@/data/types";
import { formatDateID, formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/subscribe/$productId")({
	component: SubscribeFlow,
});

const SUBSCRIBE_DISCOUNT = 0.05;

/** Blank address used when the user has no saved default. */
function emptyAddress(recipient: string, phone: string): Address {
	return {
		id: "draft",
		label: "home",
		recipient,
		phone,
		street: "",
		kelurahan: "",
		kecamatan: "",
		city: "",
		province: "",
		postalCode: "",
		isDefault: false,
	};
}

function firstDeliveryISO(): string {
	const d = new Date();
	d.setDate(d.getDate() + 1);
	return d.toISOString();
}

function SubscribeFlow() {
	const { productId } = Route.useParams();
	const { getProduct } = useCatalog();
	const { user } = useAuth();
	const { add } = useSubscriptions();

	const product = getProduct(productId);

	const defaultAddress = useMemo(
		() =>
			user?.addresses.find((a) => a.isDefault) ?? user?.addresses[0] ?? null,
		[user],
	);

	const [frequency, setFrequency] = useState<SubscriptionFrequency>("monthly");
	const [quantity, setQuantity] = useState(1);
	const [address, setAddress] = useState<Address>(
		defaultAddress ?? emptyAddress(user?.name ?? "", user?.phone ?? ""),
	);
	const [paymentMethod, setPaymentMethod] = useState<string>(
		paymentMethods[0]?.id ?? "gopay",
	);
	const [created, setCreated] = useState<Subscription | null>(null);

	if (!product || !product.subscriptionEligible) {
		return (
			<div className="mx-auto max-w-2xl px-4 py-16">
				<EmptyState
					icon={PackageX}
					title="Produk ini belum bisa dilangganan"
					description="Produk yang Anda cari tidak ditemukan atau belum tersedia untuk langganan otomatis. Telusuri produk lain yang bisa dikirim rutin."
					action={
						<Button render={<Link to="/products" />}>Lihat produk lain</Button>
					}
				/>
			</div>
		);
	}

	// `product` is narrowed to non-undefined by the guard above; alias it so the
	// narrowing survives inside nested callbacks.
	const activeProduct = product;
	const unitPrice = Math.round(activeProduct.price * (1 - SUBSCRIBE_DISCOUNT));
	const recurringTotal = unitPrice * quantity;
	const savedPerDelivery = activeProduct.price * quantity - recurringTotal;

	const hasAddress = address.street.trim() !== "" && address.city.trim() !== "";
	const canConfirm = hasAddress && quantity >= 1;

	function updateAddr(field: keyof Address, value: string) {
		setAddress((prev) => ({ ...prev, [field]: value }));
	}

	function handleConfirm() {
		const input: AddSubscriptionInput = {
			productId: activeProduct.id,
			productName: activeProduct.name,
			productImage: activeProduct.images[0] ?? "",
			unitPrice,
			quantity,
			frequency,
			address,
			paymentMethod,
		};
		const sub = add(input);
		setCreated(sub);
		if (typeof window !== "undefined") window.scrollTo({ top: 0 });
	}

	// Confirmation screen after activation.
	if (created) {
		return (
			<div className="mx-auto max-w-xl px-4 py-12">
				<div className="flex flex-col items-center gap-4 text-center">
					<span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-in zoom-in-50 duration-300">
						<CheckCircle2 className="size-9" aria-hidden="true" />
					</span>
					<div className="space-y-1.5">
						<h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
							Langganan Anda aktif
						</h1>
						<p className="text-muted-foreground">
							Kami akan menyiapkan {created.productName} dan mengirimkannya
							rutin sesuai jadwal. Tidak perlu mengingat untuk memesan ulang.
						</p>
					</div>
				</div>

				<div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card ring-1 ring-foreground/5">
					<div className="flex items-center gap-4 p-5">
						<img
							src={created.productImage}
							alt={created.productName}
							className="size-20 shrink-0 rounded-xl object-cover"
						/>
						<div className="min-w-0">
							<h2 className="font-display text-lg font-semibold text-foreground">
								{created.productName}
							</h2>
							<div className="mt-1 flex flex-wrap items-center gap-2">
								<Badge variant="secondary">
									{FREQUENCY_LABELS[created.frequency]}
								</Badge>
								<span className="text-sm text-muted-foreground">
									{created.quantity} item
								</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2 border-t border-border bg-secondary/40 px-5 py-3 text-sm">
						<CalendarClock className="size-4 text-primary" aria-hidden="true" />
						<span className="text-muted-foreground">Pengiriman pertama</span>
						<span className="ml-auto font-medium text-foreground">
							{formatDateID(created.nextDeliveryDate)}
						</span>
					</div>
				</div>

				<div className="mt-6 flex flex-col gap-3 sm:flex-row">
					<Button
						size="lg"
						className="flex-1"
						render={<Link to="/account/subscriptions" />}
					>
						Kelola Langganan
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="flex-1"
						render={<Link to="/products" />}
					>
						Lanjut Belanja
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-5xl px-4 py-8 md:py-10">
			<Button
				variant="ghost"
				size="sm"
				className="mb-4 -ml-2 text-muted-foreground"
				render={<Link to="/product/$slug" params={{ slug: product.slug }} />}
			>
				<ArrowLeft className="size-4" />
				Kembali ke produk
			</Button>

			<header className="mb-6">
				<p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
					<Sparkles className="size-3.5" aria-hidden="true" />
					Langganan & Hemat
				</p>
				<h1 className="mt-1 font-display text-3xl font-bold text-foreground md:text-4xl">
					Atur pengiriman rutin
				</h1>
				<p className="mt-2 max-w-2xl text-muted-foreground">
					Hemat 5% setiap pengiriman dan biarkan stok {product.name} selalu
					siap. Anda bisa menjeda atau membatalkan kapan saja.
				</p>
			</header>

			<div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
				<div className="space-y-8">
					{/* Step 1: frequency */}
					<section>
						<h2
							id="frequency-heading"
							className="mb-3 font-display text-lg font-semibold text-foreground"
						>
							1. Seberapa sering dikirim?
						</h2>
						<FrequencyCards
							value={frequency}
							onChange={setFrequency}
							labelId="frequency-heading"
						/>
					</section>

					{/* Step 2: quantity */}
					<section>
						<h2 className="mb-3 font-display text-lg font-semibold text-foreground">
							2. Berapa jumlah per pengiriman?
						</h2>
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="icon-lg"
								aria-label="Kurangi jumlah"
								disabled={quantity <= 1}
								onClick={() => setQuantity((q) => Math.max(1, q - 1))}
							>
								<Minus className="size-4" />
							</Button>
							<span
								className="min-w-12 text-center font-display text-2xl font-semibold text-foreground"
								aria-live="polite"
							>
								{quantity}
							</span>
							<Button
								variant="outline"
								size="icon-lg"
								aria-label="Tambah jumlah"
								disabled={quantity >= 99}
								onClick={() => setQuantity((q) => Math.min(99, q + 1))}
							>
								<Plus className="size-4" />
							</Button>
						</div>
					</section>

					{/* Step 3: address */}
					<section>
						<h2 className="mb-3 font-display text-lg font-semibold text-foreground">
							3. Alamat pengiriman
						</h2>
						{defaultAddress ? (
							<p className="mb-3 text-sm text-muted-foreground">
								Kami isi dari alamat utama Anda. Ubah jika perlu.
							</p>
						) : (
							<p className="mb-3 text-sm text-muted-foreground">
								Lengkapi alamat agar pengiriman rutin bisa berjalan.
							</p>
						)}
						<div className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label htmlFor="recipient">Nama penerima</Label>
								<Input
									id="recipient"
									value={address.recipient}
									onChange={(e) => updateAddr("recipient", e.target.value)}
									placeholder="Nama lengkap"
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="phone">Nomor telepon</Label>
								<Input
									id="phone"
									type="tel"
									value={address.phone}
									onChange={(e) => updateAddr("phone", e.target.value)}
									placeholder="08xxxxxxxxxx"
								/>
							</div>
							<div className="space-y-1.5 sm:col-span-2">
								<Label htmlFor="street">Alamat lengkap</Label>
								<Input
									id="street"
									value={address.street}
									onChange={(e) => updateAddr("street", e.target.value)}
									placeholder="Jalan, nomor rumah, RT/RW"
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="kelurahan">Kelurahan</Label>
								<Input
									id="kelurahan"
									value={address.kelurahan}
									onChange={(e) => updateAddr("kelurahan", e.target.value)}
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="kecamatan">Kecamatan</Label>
								<Input
									id="kecamatan"
									value={address.kecamatan}
									onChange={(e) => updateAddr("kecamatan", e.target.value)}
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="city">Kota</Label>
								<Input
									id="city"
									value={address.city}
									onChange={(e) => updateAddr("city", e.target.value)}
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="province">Provinsi</Label>
								<Input
									id="province"
									value={address.province}
									onChange={(e) => updateAddr("province", e.target.value)}
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="postal">Kode pos</Label>
								<Input
									id="postal"
									value={address.postalCode}
									onChange={(e) => updateAddr("postalCode", e.target.value)}
								/>
							</div>
						</div>
					</section>

					{/* Step 4: payment */}
					<section>
						<h2 className="mb-3 font-display text-lg font-semibold text-foreground">
							4. Metode pembayaran
						</h2>
						<RadioGroup
							value={paymentMethod}
							onValueChange={(v) => setPaymentMethod(v as string)}
							className="gap-2"
						>
							{paymentMethods.map((method) => {
								const selected = method.id === paymentMethod;
								return (
									<Label
										key={method.id}
										htmlFor={`pay-${method.id}`}
										className={cn(
											"flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
											selected
												? "border-primary bg-primary/5 ring-1 ring-primary/30"
												: "border-border hover:bg-muted/50",
										)}
									>
										<RadioGroupItem
											id={`pay-${method.id}`}
											value={method.id}
											className="mt-0.5"
										/>
										<span className="min-w-0">
											<span className="flex items-center gap-2">
												<CreditCard
													className="size-4 text-primary"
													aria-hidden="true"
												/>
												<span className="font-medium text-foreground">
													{method.name}
												</span>
											</span>
											<span className="mt-0.5 block text-sm text-muted-foreground">
												{method.description}
											</span>
										</span>
									</Label>
								);
							})}
						</RadioGroup>
					</section>
				</div>

				{/* Summary */}
				<aside className="lg:sticky lg:top-20 lg:self-start">
					<div className="overflow-hidden rounded-2xl border border-border bg-card ring-1 ring-foreground/5">
						<div className="flex items-center gap-3 p-4">
							<img
								src={product.images[0]}
								alt={product.name}
								className="size-16 shrink-0 rounded-lg object-cover"
							/>
							<div className="min-w-0">
								<h3 className="truncate font-medium text-foreground">
									{product.name}
								</h3>
								<p className="text-xs text-muted-foreground">{product.brand}</p>
							</div>
						</div>

						<dl className="space-y-2.5 border-t border-border px-4 py-4 text-sm">
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Frekuensi</dt>
								<dd className="font-medium text-foreground">
									{FREQUENCY_LABELS[frequency]}
								</dd>
							</div>
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Jumlah</dt>
								<dd className="font-medium text-foreground">{quantity} item</dd>
							</div>
							<div className="flex items-center justify-between">
								<dt className="text-muted-foreground">Harga normal</dt>
								<dd className="text-muted-foreground line-through">
									{formatIDR(product.price * quantity)}
								</dd>
							</div>
							<div className="flex items-center justify-between text-primary">
								<dt className="flex items-center gap-1 font-medium">
									<Sparkles className="size-3.5" aria-hidden="true" />
									Diskon langganan 5%
								</dt>
								<dd className="font-medium">
									{savedPerDelivery > 0
										? `- ${formatIDR(savedPerDelivery)}`
										: "-"}
								</dd>
							</div>
						</dl>

						<div className="flex items-center justify-between border-t border-border px-4 py-3">
							<span className="text-sm font-medium text-foreground">
								Total per pengiriman
							</span>
							<Price value={recurringTotal} size="lg" />
						</div>

						<div className="flex items-center gap-2 border-t border-border bg-secondary/40 px-4 py-3 text-sm">
							<CalendarClock
								className="size-4 shrink-0 text-primary"
								aria-hidden="true"
							/>
							<span className="text-muted-foreground">Pengiriman pertama</span>
							<span className="ml-auto font-medium text-foreground">
								{formatDateID(firstDeliveryISO())}
							</span>
						</div>

						<p className="px-4 pt-3 text-xs text-muted-foreground">
							Pengiriman berikutnya setiap {FREQUENCY_DAYS[frequency]} hari.
						</p>

						<div className="p-4">
							<Button
								size="lg"
								className="h-11 w-full"
								disabled={!canConfirm}
								onClick={handleConfirm}
							>
								Mulai Langganan
							</Button>
							{!hasAddress ? (
								<p className="mt-2 text-center text-xs text-destructive">
									Lengkapi alamat pengiriman dulu untuk melanjutkan.
								</p>
							) : null}
							<p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
								<ShieldCheck
									className="size-3.5 text-primary"
									aria-hidden="true"
								/>
								Bisa dijeda atau dibatalkan kapan saja.
							</p>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
