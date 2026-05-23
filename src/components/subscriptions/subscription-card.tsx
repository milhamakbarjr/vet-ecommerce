import {
	CalendarClock,
	CreditCard,
	MapPin,
	Minus,
	Pause,
	Play,
	Plus,
	RefreshCw,
	X,
} from "lucide-react";
import { useState } from "react";
import { Price } from "@/components/product/price";
import { CancelDialog } from "@/components/subscriptions/cancel-dialog";
import { FrequencyCards } from "@/components/subscriptions/frequency-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { FREQUENCY_LABELS } from "@/context/subscriptions";
import { getPaymentMethod } from "@/data/payments";
import type { Subscription, SubscriptionFrequency } from "@/data/types";
import { formatDateID } from "@/lib/format";

interface SubscriptionCardProps {
	subscription: Subscription;
	onPause: (id: string) => void;
	onCancel: (id: string) => void;
	onSetFrequency: (id: string, f: SubscriptionFrequency) => void;
	onSetQuantity: (id: string, q: number) => void;
}

export function SubscriptionCard({
	subscription: sub,
	onPause,
	onCancel,
	onSetFrequency,
	onSetQuantity,
}: SubscriptionCardProps) {
	const [freqOpen, setFreqOpen] = useState(false);
	const [qtyOpen, setQtyOpen] = useState(false);
	const [cancelOpen, setCancelOpen] = useState(false);

	const [draftFreq, setDraftFreq] = useState<SubscriptionFrequency>(
		sub.frequency,
	);
	const [draftQty, setDraftQty] = useState(sub.quantity);

	const payment = getPaymentMethod(sub.paymentMethod);
	const recurringTotal = sub.unitPrice * sub.quantity;

	function openFreq() {
		setDraftFreq(sub.frequency);
		setFreqOpen(true);
	}
	function openQty() {
		setDraftQty(sub.quantity);
		setQtyOpen(true);
	}

	return (
		<article className="overflow-hidden rounded-2xl border border-border bg-card ring-1 ring-foreground/5">
			<div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
				<img
					src={sub.productImage}
					alt={sub.productName}
					loading="lazy"
					className="size-20 shrink-0 rounded-xl object-cover sm:size-24"
				/>
				<div className="min-w-0 flex-1 space-y-3">
					<div className="flex flex-wrap items-start justify-between gap-2">
						<div className="min-w-0">
							<h3 className="font-display text-lg font-semibold leading-snug text-foreground">
								{sub.productName}
							</h3>
							<div className="mt-1 flex flex-wrap items-center gap-2">
								<Badge variant="secondary">
									{FREQUENCY_LABELS[sub.frequency]}
								</Badge>
								<span className="text-sm text-muted-foreground">
									{sub.quantity} item
								</span>
								{sub.paused ? (
									<Badge className="bg-accent/30 text-accent-foreground">
										Dijeda
									</Badge>
								) : null}
							</div>
						</div>
						<div className="text-right">
							<Price value={recurringTotal} size="md" />
							<p className="text-xs text-muted-foreground">setiap pengiriman</p>
						</div>
					</div>

					<dl className="grid gap-2 text-sm sm:grid-cols-2">
						<div className="flex items-start gap-2">
							<CalendarClock
								className="mt-0.5 size-4 shrink-0 text-primary"
								aria-hidden="true"
							/>
							<div>
								<dt className="text-xs text-muted-foreground">
									{sub.paused
										? "Pengiriman ditunda hingga"
										: "Pengiriman berikutnya"}
								</dt>
								<dd className="font-medium text-foreground">
									{formatDateID(sub.nextDeliveryDate)}
								</dd>
							</div>
						</div>
						<div className="flex items-start gap-2">
							<MapPin
								className="mt-0.5 size-4 shrink-0 text-primary"
								aria-hidden="true"
							/>
							<div className="min-w-0">
								<dt className="text-xs text-muted-foreground">Dikirim ke</dt>
								<dd className="truncate font-medium text-foreground">
									{sub.address.recipient}, {sub.address.city}
								</dd>
							</div>
						</div>
						<div className="flex items-start gap-2">
							<CreditCard
								className="mt-0.5 size-4 shrink-0 text-primary"
								aria-hidden="true"
							/>
							<div>
								<dt className="text-xs text-muted-foreground">Pembayaran</dt>
								<dd className="font-medium text-foreground">
									{payment?.name ?? sub.paymentMethod}
								</dd>
							</div>
						</div>
					</dl>
				</div>
			</div>

			<div className="flex flex-wrap gap-2 border-t border-border bg-muted/40 p-3 sm:px-5">
				<Button
					variant={sub.paused ? "secondary" : "outline"}
					size="lg"
					onClick={() => onPause(sub.id)}
				>
					{sub.paused ? (
						<>
							<Play className="size-4" />
							Lanjutkan
						</>
					) : (
						<>
							<Pause className="size-4" />
							Jeda
						</>
					)}
				</Button>
				<Button variant="outline" size="lg" onClick={openFreq}>
					<RefreshCw className="size-4" />
					Ubah Frekuensi
				</Button>
				<Button variant="outline" size="lg" onClick={openQty}>
					<Plus className="size-4" />
					Ubah Jumlah
				</Button>
				<Button
					variant="ghost"
					size="lg"
					className="ml-auto text-destructive hover:bg-destructive/10 hover:text-destructive"
					onClick={() => setCancelOpen(true)}
				>
					<X className="size-4" />
					Batalkan
				</Button>
			</div>

			{/* Change frequency */}
			<Dialog open={freqOpen} onOpenChange={setFreqOpen}>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Ubah frekuensi pengiriman</DialogTitle>
						<DialogDescription>
							Pilih seberapa sering {sub.productName} dikirim ke rumah Anda.
						</DialogDescription>
					</DialogHeader>
					<FrequencyCards value={draftFreq} onChange={setDraftFreq} />
					<DialogFooter>
						<DialogClose render={<Button variant="outline" />}>
							Batal
						</DialogClose>
						<Button
							onClick={() => {
								onSetFrequency(sub.id, draftFreq);
								setFreqOpen(false);
							}}
						>
							Simpan Perubahan
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Change quantity */}
			<Dialog open={qtyOpen} onOpenChange={setQtyOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Ubah jumlah</DialogTitle>
						<DialogDescription>
							Berapa banyak {sub.productName} yang dikirim setiap kali?
						</DialogDescription>
					</DialogHeader>
					<div className="flex items-center justify-center gap-4 py-2">
						<Button
							variant="outline"
							size="icon-lg"
							aria-label="Kurangi jumlah"
							disabled={draftQty <= 1}
							onClick={() => setDraftQty((q) => Math.max(1, q - 1))}
						>
							<Minus className="size-4" />
						</Button>
						<span
							className="min-w-12 text-center font-display text-2xl font-semibold text-foreground"
							aria-live="polite"
						>
							{draftQty}
						</span>
						<Button
							variant="outline"
							size="icon-lg"
							aria-label="Tambah jumlah"
							disabled={draftQty >= 99}
							onClick={() => setDraftQty((q) => Math.min(99, q + 1))}
						>
							<Plus className="size-4" />
						</Button>
					</div>
					<p className="text-center text-sm text-muted-foreground">
						Total per pengiriman: {""}
						<span className="font-medium text-foreground">
							<Price value={sub.unitPrice * draftQty} size="sm" />
						</span>
					</p>
					<DialogFooter>
						<DialogClose render={<Button variant="outline" />}>
							Batal
						</DialogClose>
						<Button
							onClick={() => {
								onSetQuantity(sub.id, draftQty);
								setQtyOpen(false);
							}}
						>
							Simpan Perubahan
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Cancel confirmation */}
			<CancelDialog
				subscription={sub}
				open={cancelOpen}
				onOpenChange={setCancelOpen}
				onPauseInstead={() => {
					if (!sub.paused) onPause(sub.id);
					setCancelOpen(false);
				}}
				onConfirm={() => onCancel(sub.id)}
			/>
		</article>
	);
}
