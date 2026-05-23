import { AlertTriangle } from "lucide-react";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Subscription } from "@/data/types";
import { formatDateID } from "@/lib/format";

interface CancelDialogProps {
	subscription: Subscription;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Soft alternative: pause instead of cancel, then close the dialog. */
	onPauseInstead: () => void;
	/** Confirm cancellation. */
	onConfirm: () => void;
}

/**
 * Cancellation confirmation (FR-37). Shows the product name and the next
 * delivery date that will be skipped, with a softer "Jeda Saja" option and a
 * destructive "Konfirmasi Pembatalan" action.
 */
export function CancelDialog({
	subscription,
	open,
	onOpenChange,
	onPauseInstead,
	onConfirm,
}: CancelDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogMedia className="bg-destructive/10 text-destructive">
						<AlertTriangle aria-hidden="true" />
					</AlertDialogMedia>
					<AlertDialogTitle>Batalkan langganan ini?</AlertDialogTitle>
					<AlertDialogDescription>
						Pengiriman {subscription.productName} yang dijadwalkan{" "}
						{formatDateID(subscription.nextDeliveryDate)} tidak akan dikirim
						lagi. Anda bisa menjedanya dulu jika hanya ingin melewati satu kali
						kiriman.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						onClick={() => {
							onPauseInstead();
						}}
					>
						Jeda Saja
					</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={() => {
							onConfirm();
							onOpenChange(false);
						}}
					>
						Konfirmasi Pembatalan
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
