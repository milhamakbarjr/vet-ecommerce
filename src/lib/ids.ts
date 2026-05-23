/** Random url-safe id, e.g. for cart/profile/order/subscription objects. */
export function uid(prefix = ""): string {
	const rand = Math.random().toString(36).slice(2, 10);
	const time = Date.now().toString(36);
	return `${prefix}${prefix ? "_" : ""}${time}${rand}`;
}

/** Order number formatted PS-YYYYMMDD-XXXXX. */
export function orderNumber(date: Date = new Date()): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	const suffix = String(Math.floor(10000 + Math.random() * 90000));
	return `PS-${y}${m}${d}-${suffix}`;
}

/** Bank-specific prefixes for mock virtual account numbers. */
const VA_PREFIXES: Record<string, string> = {
	bca: "70012",
	mandiri: "89608",
	bni: "98810",
	bri: "26215",
};

/** 16-digit virtual account number prefixed by a bank code. */
export function vaNumber(bankCode: string): string {
	const prefix = VA_PREFIXES[bankCode.toLowerCase()] ?? "70012";
	let digits = prefix;
	while (digits.length < 16) {
		digits += String(Math.floor(Math.random() * 10));
	}
	return digits.slice(0, 16);
}

/** Tracking number for couriers, e.g. JNE12345678. */
export function trackingNumber(courierId: string): string {
	const prefix =
		courierId
			.toUpperCase()
			.replace(/[^A-Z]/g, "")
			.slice(0, 4) || "TRK";
	let digits = "";
	while (digits.length < 10) {
		digits += String(Math.floor(Math.random() * 10));
	}
	return `${prefix}${digits.slice(0, 10)}`;
}
