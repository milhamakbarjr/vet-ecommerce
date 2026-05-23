import type { PaymentMethod } from "@/data/types";

export const paymentMethods: PaymentMethod[] = [
	{
		id: "gopay",
		name: "GoPay",
		description: "Bayar langsung dari saldo GoPay di aplikasi Gojek.",
		kind: "ewallet",
	},
	{
		id: "ovo",
		name: "OVO",
		description:
			"Tuntaskan pembayaran lewat aplikasi OVO dalam hitungan detik.",
		kind: "ewallet",
	},
	{
		id: "dana",
		name: "DANA",
		description: "Gunakan saldo DANA untuk pembayaran tanpa kartu.",
		kind: "ewallet",
	},
	{
		id: "qris",
		name: "QRIS",
		description:
			"Pindai satu kode QR dengan aplikasi bank atau e-wallet apa pun.",
		kind: "qris",
	},
	{
		id: "va",
		name: "Transfer Bank (Virtual Account)",
		description:
			"Transfer ke nomor virtual account BCA, Mandiri, BNI, atau BRI.",
		kind: "va",
	},
];

export function getPaymentMethod(id: string): PaymentMethod | undefined {
	return paymentMethods.find((m) => m.id === id);
}

export interface VaBank {
	code: string;
	name: string;
}

export const vaBanks: VaBank[] = [
	{ code: "bca", name: "BCA" },
	{ code: "mandiri", name: "Mandiri" },
	{ code: "bni", name: "BNI" },
	{ code: "bri", name: "BRI" },
];
