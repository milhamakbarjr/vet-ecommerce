import { Copy, Maximize2, RotateCcw, ShieldCheck, Wallet } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

import {
	CountdownDisplay,
	useCountdown,
} from "@/components/checkout/countdown-timer";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPaymentMethod, vaBanks } from "@/data/payments";
import type { PaymentMethodId } from "@/data/types";
import { formatIDR } from "@/lib/format";
import { vaNumber } from "@/lib/ids";
import { cn } from "@/lib/utils";

const PAY_WINDOW_SECONDS = 15 * 60;

interface PaymentInstructionsProps {
	methodId: PaymentMethodId;
	vaBank: string | null;
	total: number;
	onChangeMethod: () => void;
	onPaid: () => void;
}

/** Inline SVG that reads as a QR code without encoding real data (FR-24 placeholder). */
function QrPlaceholder({ size = 256 }: { size?: number }) {
	// Deterministic pseudo-random module pattern so it looks like a real QR.
	const modules = 25;
	const cells: boolean[] = useMemo(() => {
		const out: boolean[] = [];
		for (let i = 0; i < modules * modules; i++) {
			// simple deterministic hash
			out.push(((i * 2654435761) >>> 13) % 5 < 2);
		}
		return out;
	}, []);
	const cell = size / modules;

	const finder = (x: number, y: number) => (
		<g key={`f-${x}-${y}`}>
			<rect x={x} y={y} width={cell * 7} height={cell * 7} fill="#0a0a0a" />
			<rect
				x={x + cell}
				y={y + cell}
				width={cell * 5}
				height={cell * 5}
				fill="#ffffff"
			/>
			<rect
				x={x + cell * 2}
				y={y + cell * 2}
				width={cell * 3}
				height={cell * 3}
				fill="#0a0a0a"
			/>
		</g>
	);

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			role="img"
			aria-label="Kode QRIS untuk pembayaran (placeholder)"
			className="rounded-lg bg-white"
		>
			<rect width={size} height={size} fill="#ffffff" />
			{cells.map((on, i) => {
				if (!on) return null;
				const cx = i % modules;
				const cy = Math.floor(i / modules);
				// Leave room for the finder patterns in the three corners.
				const inFinder =
					(cx < 8 && cy < 8) ||
					(cx > modules - 9 && cy < 8) ||
					(cx < 8 && cy > modules - 9);
				if (inFinder) return null;
				return (
					<rect
						key={`m-${cx}-${cy}`}
						x={cx * cell}
						y={cy * cell}
						width={cell}
						height={cell}
						fill="#0a0a0a"
					/>
				);
			})}
			{finder(0, 0)}
			{finder(size - cell * 7, 0)}
			{finder(0, size - cell * 7)}
		</svg>
	);
}

function ExpiryScreen({ onRetry }: { onRetry: () => void }) {
	return (
		<div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
			<span className="flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
				<RotateCcw className="size-7" aria-hidden="true" />
			</span>
			<div className="space-y-1.5">
				<h2 className="font-display text-xl font-bold text-foreground">
					Waktu pembayaran habis
				</h2>
				<p className="mx-auto max-w-sm text-sm text-muted-foreground">
					Pesananmu masih kami simpan, tapi jendela pembayaran sudah tertutup.
					Mulai lagi untuk mendapatkan kode pembayaran baru.
				</p>
			</div>
			<Button size="lg" className="h-11" onClick={onRetry}>
				<RotateCcw className="size-4" />
				Coba Bayar Lagi
			</Button>
		</div>
	);
}

function InstructionList({ steps }: { steps: string[] }) {
	return (
		<ol className="flex flex-col gap-2.5 text-sm text-muted-foreground">
			{steps.map((step, i) => (
				<li key={step} className="flex gap-3">
					<span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
						{i + 1}
					</span>
					<span className="pt-px">{step}</span>
				</li>
			))}
		</ol>
	);
}

function EwalletInstructions({ name, total }: { name: string; total: number }) {
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
				<span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
					<Wallet className="size-7" aria-hidden="true" />
				</span>
				<p className="text-sm text-muted-foreground">
					Total yang harus dibayar
				</p>
				<p className="font-display text-3xl font-bold tabular-nums text-foreground">
					{formatIDR(total)}
				</p>
				<p className="text-sm font-medium text-foreground">
					Bayar dengan {name}
				</p>
			</div>
			<InstructionList
				steps={[
					`Buka aplikasi ${name} di ponselmu.`,
					"Pilih menu Bayar atau Scan, lalu konfirmasi tagihan PetSehat.",
					"Periksa nominal sudah sesuai, lalu selesaikan pembayaran.",
					'Kembali ke halaman ini dan tekan "Saya Sudah Bayar".',
				]}
			/>
		</div>
	);
}

function QrisInstructions({ total }: { total: number }) {
	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6">
				<QrPlaceholder size={256} />
				<Dialog>
					<DialogTrigger
						render={
							<Button variant="outline" size="lg" className="h-11">
								<Maximize2 className="size-4" />
								Perbesar
							</Button>
						}
					/>
					<DialogContent className="sm:max-w-md" showCloseButton>
						<DialogTitle>Kode QRIS PetSehat</DialogTitle>
						<DialogDescription>
							Pindai kode ini dengan aplikasi bank atau e-wallet apa pun yang
							mendukung QRIS.
						</DialogDescription>
						<div className="flex justify-center py-2">
							<QrPlaceholder size={300} />
						</div>
						<p className="text-center font-display text-xl font-bold tabular-nums text-foreground">
							{formatIDR(total)}
						</p>
					</DialogContent>
				</Dialog>
				<p className="text-center text-sm text-muted-foreground">
					Total tagihan
				</p>
				<p className="font-display text-2xl font-bold tabular-nums text-foreground">
					{formatIDR(total)}
				</p>
			</div>
			<InstructionList
				steps={[
					"Buka aplikasi pembayaran favoritmu dan pilih menu Scan QRIS.",
					"Arahkan kamera ke kode QR di atas, atau tekan Perbesar agar lebih mudah dipindai.",
					"Pastikan nama merchant PetSehat dan nominal sudah benar.",
					'Selesaikan pembayaran lalu tekan "Saya Sudah Bayar".',
				]}
			/>
		</div>
	);
}

function VaInstructions({
	bankCode,
	number,
	total,
}: {
	bankCode: string;
	number: string;
	total: number;
}) {
	const tabsId = useId();
	const [copied, setCopied] = useState<"va" | "amount" | null>(null);
	const bank = vaBanks.find((b) => b.code === bankCode);
	const grouped = number.replace(/(.{4})/g, "$1 ").trim();

	const copy = async (text: string, which: "va" | "amount") => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(which);
			setTimeout(() => setCopied(null), 1800);
		} catch {
			// Clipboard may be unavailable; silently ignore in the mock.
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<div className="rounded-xl border border-border bg-card p-5">
				<p className="text-sm font-medium text-foreground">
					Virtual Account {bank?.name ?? bankCode.toUpperCase()}
				</p>
				<div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
					<span className="font-display text-lg font-bold tabular-nums tracking-wide text-foreground">
						{grouped}
					</span>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => copy(number, "va")}
					>
						<Copy className="size-4" />
						{copied === "va" ? "Tersalin" : "Salin"}
					</Button>
				</div>

				<div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5">
					<div>
						<p className="text-xs text-muted-foreground">Nominal transfer</p>
						<p className="font-display text-lg font-bold tabular-nums text-foreground">
							{formatIDR(total)}
						</p>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={() => copy(String(total), "amount")}
					>
						<Copy className="size-4" />
						{copied === "amount" ? "Tersalin" : "Salin"}
					</Button>
				</div>
				<p className="mt-2 text-xs text-muted-foreground">
					Transfer harus tepat sampai ke rupiah terakhir. Nominal yang berbeda
					tidak akan otomatis terverifikasi.
				</p>
			</div>

			<Tabs defaultValue={`${tabsId}-mbanking`}>
				<TabsList className="w-full">
					<TabsTrigger value={`${tabsId}-mbanking`}>m-Banking</TabsTrigger>
					<TabsTrigger value={`${tabsId}-atm`}>ATM</TabsTrigger>
					<TabsTrigger value={`${tabsId}-ibanking`}>i-Banking</TabsTrigger>
				</TabsList>
				<TabsContent value={`${tabsId}-mbanking`} className="pt-3">
					<InstructionList
						steps={[
							`Buka aplikasi m-Banking ${bank?.name ?? ""} dan masuk ke akunmu.`,
							"Pilih menu Transfer lalu Virtual Account.",
							`Masukkan nomor ${number} sebagai tujuan.`,
							"Periksa nama PetSehat dan nominal, lalu konfirmasi.",
						]}
					/>
				</TabsContent>
				<TabsContent value={`${tabsId}-atm`} className="pt-3">
					<InstructionList
						steps={[
							`Masukkan kartu di ATM ${bank?.name ?? ""} dan pilih bahasa.`,
							"Pilih menu Transaksi Lainnya, lalu Transfer ke Virtual Account.",
							`Ketik nomor ${number} dan tekan Benar.`,
							"Pastikan nominal sesuai lalu selesaikan transaksi.",
						]}
					/>
				</TabsContent>
				<TabsContent value={`${tabsId}-ibanking`} className="pt-3">
					<InstructionList
						steps={[
							`Login ke internet banking ${bank?.name ?? ""} dari browser.`,
							"Pilih menu Transfer lalu Virtual Account.",
							`Masukkan nomor ${number} sebagai rekening tujuan.`,
							"Cek ringkasan pembayaran lalu konfirmasi dengan token.",
						]}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

export function PaymentInstructions({
	methodId,
	vaBank,
	total,
	onChangeMethod,
	onPaid,
}: PaymentInstructionsProps) {
	const [resetKey, setResetKey] = useState(0);
	const { remaining, expired } = useCountdown(PAY_WINDOW_SECONDS, resetKey);
	const method = getPaymentMethod(methodId);

	// VA number is regenerated when the chosen bank changes.
	const bankCode = vaBank ?? "bca";
	const [va, setVa] = useState(() => vaNumber(bankCode));
	useEffect(() => {
		setVa(vaNumber(bankCode));
	}, [bankCode]);

	// Retry restarts the countdown and issues a fresh VA number (FR-27).
	const retry = () => {
		setResetKey((k) => k + 1);
		setVa(vaNumber(bankCode));
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
						Selesaikan Pembayaran
					</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Metode dipilih: {method?.name}
					</p>
				</div>
				{!expired ? <CountdownDisplay remaining={remaining} /> : null}
			</div>

			{expired ? (
				<ExpiryScreen onRetry={retry} />
			) : (
				<>
					{method?.kind === "ewallet" ? (
						<EwalletInstructions name={method.name} total={total} />
					) : null}
					{method?.kind === "qris" ? <QrisInstructions total={total} /> : null}
					{method?.kind === "va" ? (
						<VaInstructions bankCode={bankCode} number={va} total={total} />
					) : null}

					<div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-4 sm:flex-row-reverse sm:items-center sm:justify-between">
						<Button
							size="lg"
							className="h-12 w-full text-base sm:w-auto sm:px-8"
							onClick={onPaid}
						>
							<ShieldCheck className="size-5" />
							Saya Sudah Bayar
						</Button>
						<button
							type="button"
							onClick={onChangeMethod}
							className={cn(
								"text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline",
							)}
						>
							Ganti Metode Pembayaran
						</button>
					</div>
				</>
			)}
		</div>
	);
}
