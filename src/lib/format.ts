const idrFormatter = new Intl.NumberFormat("id-ID", {
	style: "currency",
	currency: "IDR",
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
});

/** 150000 -> "Rp 150.000" */
export function formatIDR(n: number): string {
	// Intl renders "Rp 150.000" with a non-breaking space in some runtimes; normalise to a regular space.
	return idrFormatter.format(Math.round(n)).replace(/ /g, " ");
}

const longDateFormatter = new Intl.DateTimeFormat("id-ID", {
	day: "numeric",
	month: "long",
	year: "numeric",
});

/** ISO -> "23 Mei 2026" */
export function formatDateID(iso: string): string {
	return longDateFormatter.format(new Date(iso));
}

/** ISO -> "23/05/2026" */
export function formatDateShort(iso: string): string {
	const d = new Date(iso);
	const day = String(d.getDate()).padStart(2, "0");
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const year = d.getFullYear();
	return `${day}/${month}/${year}`;
}
