import type { LucideIcon } from "lucide-react";
import { Check, Landmark, QrCode, Smartphone } from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { paymentMethods, vaBanks } from "@/data/payments";
import type { PaymentMethodId } from "@/data/types";
import { cn } from "@/lib/utils";

const METHOD_ICON: Record<PaymentMethodId, LucideIcon> = {
	gopay: Smartphone,
	ovo: Smartphone,
	dana: Smartphone,
	qris: QrCode,
	va: Landmark,
};

interface PaymentMethodSelectProps {
	selectedId: PaymentMethodId | null;
	onSelect: (id: PaymentMethodId) => void;
	vaBank: string | null;
	onSelectBank: (code: string) => void;
}

export function PaymentMethodSelect({
	selectedId,
	onSelect,
	vaBank,
	onSelectBank,
}: PaymentMethodSelectProps) {
	return (
		<div className="flex flex-col gap-3">
			{paymentMethods.map((method) => {
				const active = method.id === selectedId;
				const Icon = METHOD_ICON[method.id];
				const showBanks = active && method.kind === "va";
				return (
					<div
						key={method.id}
						className={cn(
							"rounded-xl border bg-card transition-all",
							active
								? "border-primary ring-1 ring-primary"
								: "border-border hover:border-primary/40",
						)}
					>
						<button
							type="button"
							onClick={() => onSelect(method.id)}
							aria-pressed={active}
							className="flex min-h-[64px] w-full items-center gap-3 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:rounded-xl"
						>
							<span
								className={cn(
									"flex size-11 shrink-0 items-center justify-center rounded-lg",
									active
										? "bg-primary text-primary-foreground"
										: "bg-secondary text-primary",
								)}
							>
								<Icon className="size-5" aria-hidden="true" />
							</span>
							<span className="min-w-0 flex-1">
								<span className="block font-semibold text-foreground">
									{method.name}
								</span>
								<span className="mt-0.5 block text-sm text-muted-foreground">
									{method.description}
								</span>
							</span>
							<span
								className={cn(
									"flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
									active
										? "border-primary bg-primary text-primary-foreground"
										: "border-border",
								)}
								aria-hidden="true"
							>
								{active ? <Check className="size-3.5" /> : null}
							</span>
						</button>

						{showBanks ? (
							<div className="border-t border-border px-4 py-3">
								<p className="mb-2 text-sm font-medium text-foreground">
									Pilih bank tujuan
								</p>
								<RadioGroup
									value={vaBank ?? ""}
									onValueChange={(v) => onSelectBank(String(v))}
									className="grid grid-cols-2 gap-2 sm:grid-cols-4"
								>
									{vaBanks.map((bank) => {
										const selected = vaBank === bank.code;
										return (
											<Label
												key={bank.code}
												className={cn(
													"flex min-h-[44px] cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition-colors",
													selected
														? "border-primary bg-primary/5"
														: "border-border hover:bg-muted",
												)}
											>
												<RadioGroupItem value={bank.code} />
												<span className="text-sm font-semibold text-foreground">
													{bank.name}
												</span>
											</Label>
										);
									})}
								</RadioGroup>
							</div>
						) : null}
					</div>
				);
			})}
		</div>
	);
}
