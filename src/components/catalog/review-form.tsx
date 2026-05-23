import { CheckCircle2, ImagePlus } from "lucide-react";
import { useState } from "react";

import { RatingStars } from "@/components/product/rating-stars";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PetSpecies } from "@/data/types";
import { PET_OPTIONS } from "./filter-logic";

const MIN_BODY = 20;

interface ReviewFormProps {
	productName: string;
}

export function ReviewForm({ productName }: ReviewFormProps) {
	const [rating, setRating] = useState(0);
	const [petType, setPetType] = useState<PetSpecies | "">("");
	const [body, setBody] = useState("");
	const [photoName, setPhotoName] = useState<string | null>(null);
	const [submitted, setSubmitted] = useState(false);
	const [errors, setErrors] = useState<{
		rating?: string;
		petType?: string;
		body?: string;
	}>({});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const next: typeof errors = {};
		if (rating < 1) next.rating = "Pilih rating bintang terlebih dahulu.";
		if (!petType) next.petType = "Pilih jenis hewan Anda.";
		if (body.trim().length < MIN_BODY)
			next.body = `Ulasan minimal ${MIN_BODY} karakter.`;
		setErrors(next);
		if (Object.keys(next).length > 0) return;
		// Mock spec: not persisted. Show a thank-you state only.
		setSubmitted(true);
	};

	if (submitted) {
		return (
			<div className="flex flex-col items-center gap-3 rounded-xl border border-accent/40 bg-secondary/50 px-6 py-10 text-center">
				<CheckCircle2 className="size-10 text-primary" aria-hidden="true" />
				<h3 className="font-display text-lg font-semibold text-foreground">
					Terima kasih atas ulasanmu
				</h3>
				<p className="max-w-sm text-sm text-muted-foreground">
					Pengalamanmu membantu pemilik hewan lain memilih yang terbaik untuk
					peliharaan mereka.
				</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5"
			noValidate
		>
			<div>
				<h3 className="font-display text-lg font-semibold text-foreground">
					Tulis Ulasan
				</h3>
				<p className="text-sm text-muted-foreground">
					Bagikan pengalamanmu dengan {productName}.
				</p>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label>Rating</Label>
				<RatingStars
					interactive
					value={rating}
					onChange={setRating}
					size={28}
				/>
				{errors.rating ? (
					<p className="text-xs text-destructive">{errors.rating}</p>
				) : null}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="review-pet">Jenis hewan</Label>
				<Select
					value={petType}
					onValueChange={(value) => setPetType(value as PetSpecies)}
				>
					<SelectTrigger id="review-pet" className="w-full" size="default">
						<SelectValue placeholder="Pilih jenis hewan" />
					</SelectTrigger>
					<SelectContent>
						{PET_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{errors.petType ? (
					<p className="text-xs text-destructive">{errors.petType}</p>
				) : null}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="review-body">Ulasan</Label>
				<Textarea
					id="review-body"
					value={body}
					onChange={(e) => setBody(e.target.value)}
					placeholder="Ceritakan bagaimana produk ini untuk hewan kesayanganmu..."
					rows={4}
					aria-describedby="review-body-hint"
				/>
				<div
					id="review-body-hint"
					className="flex items-center justify-between text-xs text-muted-foreground"
				>
					<span>
						{errors.body ? (
							<span className="text-destructive">{errors.body}</span>
						) : (
							`Minimal ${MIN_BODY} karakter`
						)}
					</span>
					<span>{body.trim().length}</span>
				</div>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="review-photo">Foto (opsional)</Label>
				<label
					htmlFor="review-photo"
					className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
				>
					<ImagePlus className="size-4" aria-hidden="true" />
					{photoName ?? "Tambahkan foto"}
				</label>
				<input
					id="review-photo"
					type="file"
					accept="image/*"
					className="sr-only"
					onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)}
				/>
			</div>

			<Button type="submit" size="lg" className="w-full">
				Kirim Ulasan
			</Button>
		</form>
	);
}
