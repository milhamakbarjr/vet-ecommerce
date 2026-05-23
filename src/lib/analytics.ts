/**
 * Lightweight analytics stub. v1 logs a structured payload to the console.
 * Phase 2 will swap this for a real sink without changing call sites.
 */
export function track(event: string, props?: Record<string, unknown>): void {
	console.debug("[analytics]", { event, ...props, ts: Date.now() });
}
