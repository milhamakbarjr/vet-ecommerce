import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, MapPin, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
	type AddressDraft,
	type AddressErrors,
	AddressForm,
	EMPTY_ADDRESS,
	validateAddress,
} from "@/components/checkout/address-form";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { CourierSelect } from "@/components/checkout/courier-select";
import { OrderSummary } from "@/components/checkout/order-summary";
import { PaymentInstructions } from "@/components/checkout/payment-instructions";
import { PaymentMethodSelect } from "@/components/checkout/payment-method-select";
import { EmptyState } from "@/components/common/empty-state";
import { Price } from "@/components/product/price";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { useCart } from "@/context/cart";
import { useCatalog } from "@/context/catalog";
import { useOrders } from "@/context/orders";
import { getCourier } from "@/data/couriers";
import { getPaymentMethod, vaBanks } from "@/data/payments";
import type { Address, OrderItem, PaymentMethodId } from "@/data/types";
import { track } from "@/lib/analytics";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

// Steps 0-3 are the wizard; step 4 is the payment instruction screen.
const STEP_PAYMENT_SCREEN = 4;

function CheckoutPage() {
	const navigate = useNavigate();
	const { items, subtotal, discount, promo, clear } = useCart();
	const { getProduct } = useCatalog();
	const { user } = useAuth();
	const { placeOrder } = useOrders();

	const [step, setStep] = useState(0);
	const [useSavedAddress, setUseSavedAddress] = useState(true);
	const [address, setAddress] = useState<AddressDraft>(EMPTY_ADDRESS);
	const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
	const [courierId, setCourierId] = useState<string | null>(null);
	const [courierError, setCourierError] = useState(false);
	const [paymentId, setPaymentId] = useState<PaymentMethodId | null>(null);
	const [vaBank, setVaBank] = useState<string | null>(null);
	const [paymentError, setPaymentError] = useState<string | null>(null);

	const savedDefault =
		user?.addresses.find((a) => a.isDefault) ?? user?.addresses[0] ?? null;

	// Fire checkout_started once on entry.
	const startedRef = useRef(false);
	useEffect(() => {
		if (!startedRef.current && items.length > 0) {
			startedRef.current = true;
			track("checkout_started", { items: items.length, subtotal });
		}
	}, [items.length, subtotal]);

	const lines = items
		.map((item) => {
			const product = getProduct(item.productId);
			return product ? { product, quantity: item.quantity } : null;
		})
		.filter(
			(
				l,
			): l is {
				product: NonNullable<ReturnType<typeof getProduct>>;
				quantity: number;
			} => l !== null,
		);

	const courier = courierId ? getCourier(courierId) : undefined;
	const deliveryFee = courier?.fee ?? 0;
	const total = Math.max(0, subtotal - discount) + deliveryFee;

	// Resolve the effective shipping address from form or saved selection.
	const effectiveAddress: AddressDraft =
		useSavedAddress && savedDefault ? savedDefault : address;

	if (lines.length === 0) {
		return (
			<div className="py-10">
				<h1 className="font-display text-3xl font-bold text-foreground">
					Checkout
				</h1>
				<div className="mt-8">
					<EmptyState
						icon={ShoppingBag}
						title="Belum ada yang bisa di-checkout"
						description="Keranjangmu masih kosong. Tambahkan produk dulu sebelum lanjut ke pembayaran."
						action={
							<Button
								size="lg"
								className="h-11"
								render={<Link to="/products" />}
							>
								Mulai belanja
							</Button>
						}
					/>
				</div>
			</div>
		);
	}

	const goToStep = (next: number) => {
		setStep(next);
		if (typeof window !== "undefined") window.scrollTo({ top: 0 });
	};

	const handleNextFromAddress = () => {
		if (useSavedAddress && savedDefault) {
			setAddressErrors({});
			goToStep(1);
			return;
		}
		const errors = validateAddress(address);
		setAddressErrors(errors);
		if (Object.keys(errors).length === 0) goToStep(1);
	};

	const handleNextFromShipping = () => {
		if (!courierId) {
			setCourierError(true);
			return;
		}
		setCourierError(false);
		goToStep(2);
	};

	const handleNextFromPayment = () => {
		if (!paymentId) {
			setPaymentError("Pilih salah satu metode pembayaran.");
			return;
		}
		if (paymentId === "va" && !vaBank) {
			setPaymentError("Pilih bank tujuan untuk transfer Virtual Account.");
			return;
		}
		setPaymentError(null);
		goToStep(3);
	};

	const handlePlaceOrder = () => {
		// Advance to the payment instruction screen (do NOT create the order yet).
		goToStep(STEP_PAYMENT_SCREEN);
	};

	const handlePaid = () => {
		const orderItems: OrderItem[] = lines.map(({ product, quantity }) => ({
			productId: product.id,
			name: product.name,
			image: product.images[0],
			price: product.price,
			quantity,
		}));

		const finalAddress: Address = {
			id:
				"id" in effectiveAddress
					? (effectiveAddress as Address).id
					: "addr_checkout",
			label: effectiveAddress.label,
			recipient: effectiveAddress.recipient,
			phone: effectiveAddress.phone,
			street: effectiveAddress.street,
			kelurahan: effectiveAddress.kelurahan,
			kecamatan: effectiveAddress.kecamatan,
			city: effectiveAddress.city,
			province: effectiveAddress.province,
			postalCode: effectiveAddress.postalCode,
			isDefault:
				"isDefault" in effectiveAddress
					? (effectiveAddress as Address).isDefault
					: false,
		};

		const order = placeOrder({
			items: orderItems,
			address: finalAddress,
			courierId: courierId ?? "",
			paymentMethodId: paymentId ?? "",
			subtotal,
			deliveryFee,
			discount,
			total,
		});

		clear();
		navigate({ to: "/checkout/success", search: { order: order.id } });
	};

	// Payment instruction screen (step 5).
	if (step === STEP_PAYMENT_SCREEN && paymentId) {
		return (
			<div className="mx-auto max-w-2xl py-8">
				<PaymentInstructions
					methodId={paymentId}
					vaBank={vaBank}
					total={total}
					onChangeMethod={() => goToStep(2)}
					onPaid={handlePaid}
				/>
			</div>
		);
	}

	const summaryPending = !courierId;

	return (
		<div className="py-8 md:py-10">
			<div className="mb-6 flex items-center gap-3">
				<Button
					variant="ghost"
					size="icon"
					className="size-9"
					aria-label="Kembali ke keranjang"
					render={<Link to="/cart" />}
				>
					<ArrowLeft className="size-5" />
				</Button>
				<h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
					Checkout
				</h1>
			</div>

			<div className="mb-8">
				<CheckoutSteps current={step} onJump={(i) => goToStep(i)} />
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
				<div className="min-w-0">
					{step === 0 ? (
						<StepAddress
							savedDefault={savedDefault}
							useSavedAddress={useSavedAddress}
							onUseSaved={setUseSavedAddress}
							address={address}
							onChangeAddress={setAddress}
							errors={addressErrors}
							onNext={handleNextFromAddress}
						/>
					) : null}

					{step === 1 ? (
						<section>
							<h2 className="font-display text-xl font-semibold text-foreground">
								Metode pengiriman
							</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								Pilih kurir yang cocok dengan kebutuhanmu.
							</p>
							<div className="mt-5">
								<CourierSelect
									selectedId={courierId}
									onSelect={(id) => {
										setCourierId(id);
										setCourierError(false);
									}}
								/>
							</div>
							{courierError ? (
								<p className="mt-3 text-sm font-medium text-destructive">
									Pilih salah satu kurir untuk melanjutkan.
								</p>
							) : null}
							<StepNav
								onBack={() => goToStep(0)}
								onNext={handleNextFromShipping}
							/>
						</section>
					) : null}

					{step === 2 ? (
						<section>
							<h2 className="font-display text-xl font-semibold text-foreground">
								Metode pembayaran
							</h2>
							<p className="mt-1 text-sm text-muted-foreground">
								Bayar dengan cara yang paling praktis untukmu.
							</p>
							<div className="mt-5">
								<PaymentMethodSelect
									selectedId={paymentId}
									onSelect={(id) => {
										setPaymentId(id);
										setPaymentError(null);
									}}
									vaBank={vaBank}
									onSelectBank={(code) => {
										setVaBank(code);
										setPaymentError(null);
									}}
								/>
							</div>
							{paymentError ? (
								<p className="mt-3 text-sm font-medium text-destructive">
									{paymentError}
								</p>
							) : null}
							<StepNav
								onBack={() => goToStep(1)}
								onNext={handleNextFromPayment}
							/>
						</section>
					) : null}

					{step === 3 ? (
						<StepReview
							lines={lines}
							address={effectiveAddress}
							courierName={courier?.name ?? ""}
							courierEta={courier?.etaDays ?? ""}
							deliveryFee={deliveryFee}
							paymentName={
								paymentId ? (getPaymentMethod(paymentId)?.name ?? "") : ""
							}
							vaBankName={
								vaBank
									? (vaBanks.find((b) => b.code === vaBank)?.name ?? null)
									: null
							}
							onBack={() => goToStep(2)}
							onEditAddress={() => goToStep(0)}
							onEditShipping={() => goToStep(1)}
							onEditPayment={() => goToStep(2)}
							onPlace={handlePlaceOrder}
						/>
					) : null}
				</div>

				<aside className="lg:sticky lg:top-20 lg:self-start">
					<OrderSummary
						subtotal={subtotal}
						deliveryFee={deliveryFee}
						discount={discount}
						total={total}
						promoLabel={promo?.label}
						deliveryPending={summaryPending}
					/>
				</aside>
			</div>
		</div>
	);
}

function StepNav({
	onBack,
	onNext,
	nextLabel = "Lanjut",
}: {
	onBack?: () => void;
	onNext: () => void;
	nextLabel?: string;
}) {
	return (
		<div className="mt-8 flex items-center justify-between gap-3">
			{onBack ? (
				<Button variant="ghost" size="lg" className="h-11" onClick={onBack}>
					<ArrowLeft className="size-4" />
					Kembali
				</Button>
			) : (
				<span />
			)}
			<Button size="lg" className="h-11 px-6" onClick={onNext}>
				{nextLabel}
				<ArrowRight className="size-4" />
			</Button>
		</div>
	);
}

function StepAddress({
	savedDefault,
	useSavedAddress,
	onUseSaved,
	address,
	onChangeAddress,
	errors,
	onNext,
}: {
	savedDefault: Address | null;
	useSavedAddress: boolean;
	onUseSaved: (v: boolean) => void;
	address: AddressDraft;
	onChangeAddress: (a: AddressDraft) => void;
	errors: AddressErrors;
	onNext: () => void;
}) {
	return (
		<section>
			<h2 className="font-display text-xl font-semibold text-foreground">
				Alamat pengiriman
			</h2>
			<p className="mt-1 text-sm text-muted-foreground">
				Ke mana pesananmu kami antar?
			</p>

			{savedDefault ? (
				<div className="mt-5 flex flex-col gap-3">
					<button
						type="button"
						onClick={() => onUseSaved(true)}
						aria-pressed={useSavedAddress}
						className={cn(
							"flex gap-3 rounded-xl border bg-card p-4 text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring",
							useSavedAddress
								? "border-primary ring-1 ring-primary"
								: "border-border hover:border-primary/40",
						)}
					>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
							<MapPin className="size-5" aria-hidden="true" />
						</span>
						<span className="min-w-0">
							<span className="block font-semibold text-foreground">
								{savedDefault.recipient}
								<span className="ml-2 align-middle text-xs font-medium text-muted-foreground">
									Alamat tersimpan
								</span>
							</span>
							<span className="mt-0.5 block text-sm text-muted-foreground">
								{savedDefault.phone}
							</span>
							<span className="mt-1 block text-sm text-muted-foreground">
								{savedDefault.street}, {savedDefault.kelurahan},{" "}
								{savedDefault.kecamatan}, {savedDefault.city},{" "}
								{savedDefault.province} {savedDefault.postalCode}
							</span>
						</span>
					</button>

					<button
						type="button"
						onClick={() => onUseSaved(false)}
						aria-pressed={!useSavedAddress}
						className={cn(
							"rounded-xl border border-dashed bg-card px-4 py-3 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
							!useSavedAddress
								? "border-primary text-primary"
								: "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
						)}
					>
						Gunakan alamat lain
					</button>
				</div>
			) : null}

			{!savedDefault || !useSavedAddress ? (
				<div className="mt-5">
					<AddressForm
						value={address}
						onChange={onChangeAddress}
						errors={errors}
					/>
				</div>
			) : null}

			<StepNav onNext={onNext} nextLabel="Lanjut ke pengiriman" />
		</section>
	);
}

function StepReview({
	lines,
	address,
	courierName,
	courierEta,
	deliveryFee,
	paymentName,
	vaBankName,
	onBack,
	onEditAddress,
	onEditShipping,
	onEditPayment,
	onPlace,
}: {
	lines: {
		product: {
			id: string;
			name: string;
			images: string[];
			price: number;
			brand: string;
		};
		quantity: number;
	}[];
	address: AddressDraft;
	courierName: string;
	courierEta: string;
	deliveryFee: number;
	paymentName: string;
	vaBankName: string | null;
	onBack: () => void;
	onEditAddress: () => void;
	onEditShipping: () => void;
	onEditPayment: () => void;
	onPlace: () => void;
}) {
	return (
		<section>
			<h2 className="font-display text-xl font-semibold text-foreground">
				Periksa pesananmu
			</h2>
			<p className="mt-1 text-sm text-muted-foreground">
				Pastikan semuanya sudah benar sebelum membuat pesanan.
			</p>

			<div className="mt-5 flex flex-col gap-4">
				<ReviewCard title="Produk" onEdit={onBack} editLabel="Ubah keranjang">
					<ul className="flex flex-col gap-3">
						{lines.map(({ product, quantity }) => (
							<li key={product.id} className="flex gap-3">
								<img
									src={product.images[0]}
									alt={product.name}
									className="size-14 shrink-0 rounded-lg object-cover"
									loading="lazy"
								/>
								<div className="min-w-0 flex-1">
									<p className="line-clamp-1 text-sm font-medium text-foreground">
										{product.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{quantity} x {formatIDR(product.price)}
									</p>
								</div>
								<Price
									value={product.price * quantity}
									size="sm"
									className="justify-end"
								/>
							</li>
						))}
					</ul>
				</ReviewCard>

				<ReviewCard title="Alamat pengiriman" onEdit={onEditAddress}>
					<p className="text-sm font-medium text-foreground">
						{address.recipient}
					</p>
					<p className="text-sm text-muted-foreground">{address.phone}</p>
					<p className="mt-1 text-sm text-muted-foreground">
						{address.street}, {address.kelurahan}, {address.kecamatan},{" "}
						{address.city}, {address.province} {address.postalCode}
					</p>
				</ReviewCard>

				<ReviewCard title="Pengiriman" onEdit={onEditShipping}>
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-sm font-medium text-foreground">
								{courierName}
							</p>
							<p className="text-xs text-muted-foreground">
								Estimasi tiba {courierEta}
							</p>
						</div>
						<span className="text-sm font-semibold tabular-nums text-foreground">
							{formatIDR(deliveryFee)}
						</span>
					</div>
				</ReviewCard>

				<ReviewCard title="Pembayaran" onEdit={onEditPayment}>
					<p className="text-sm font-medium text-foreground">
						{paymentName}
						{vaBankName ? ` (${vaBankName})` : ""}
					</p>
				</ReviewCard>
			</div>

			<div className="mt-8 flex items-center justify-between gap-3">
				<Button variant="ghost" size="lg" className="h-11" onClick={onBack}>
					<ArrowLeft className="size-4" />
					Kembali
				</Button>
				<Button size="lg" className="h-12 px-8 text-base" onClick={onPlace}>
					Buat Pesanan
				</Button>
			</div>
		</section>
	);
}

function ReviewCard({
	title,
	editLabel = "Ubah",
	onEdit,
	children,
}: {
	title: string;
	editLabel?: string;
	onEdit: () => void;
	children: React.ReactNode;
}) {
	return (
		<div className="rounded-xl border border-border bg-card p-4">
			<div className="mb-3 flex items-center justify-between gap-3">
				<h3 className="text-sm font-semibold text-foreground">{title}</h3>
				<Button
					variant="link"
					size="sm"
					className="h-auto p-0"
					onClick={onEdit}
				>
					{editLabel}
				</Button>
			</div>
			{children}
		</div>
	);
}
