import type { Courier } from "@/data/types";

export const couriers: Courier[] = [
	{
		id: "sicepat",
		name: "SiCepat Ekspres",
		etaDays: "1-2 hari",
		fee: 15000,
	},
	{
		id: "jnt",
		name: "J&T Express",
		etaDays: "2-3 hari",
		fee: 16000,
	},
	{
		id: "jne",
		name: "JNE Reguler",
		etaDays: "2-3 hari",
		fee: 18000,
	},
];

export function getCourier(id: string): Courier | undefined {
	return couriers.find((c) => c.id === id);
}

/** Approximate delivery days used to estimate arrival date from etaDays. */
export function courierMaxDays(id: string): number {
	const match = getCourier(id)?.etaDays.match(/(\d+)\s*-\s*(\d+)/);
	if (!match) return 3;
	return Number.parseInt(match[2], 10);
}
