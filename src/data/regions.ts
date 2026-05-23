export interface Province {
	name: string;
	cities: string[];
}

/**
 * All 38 Indonesian provinces. Major provinces include a sample of cities/regencies
 * for checkout dropdowns; smaller provinces include the capital and a few cities.
 */
export const provinces: Province[] = [
	{
		name: "DKI Jakarta",
		cities: [
			"Jakarta Pusat",
			"Jakarta Utara",
			"Jakarta Barat",
			"Jakarta Selatan",
			"Jakarta Timur",
			"Kepulauan Seribu",
		],
	},
	{
		name: "Jawa Barat",
		cities: [
			"Bandung",
			"Bekasi",
			"Bogor",
			"Depok",
			"Cimahi",
			"Cirebon",
			"Sukabumi",
			"Tasikmalaya",
			"Garut",
			"Karawang",
		],
	},
	{
		name: "Jawa Tengah",
		cities: [
			"Semarang",
			"Surakarta",
			"Magelang",
			"Salatiga",
			"Pekalongan",
			"Tegal",
			"Kudus",
			"Purwokerto",
		],
	},
	{
		name: "DI Yogyakarta",
		cities: ["Yogyakarta", "Sleman", "Bantul", "Kulon Progo", "Gunungkidul"],
	},
	{
		name: "Jawa Timur",
		cities: [
			"Surabaya",
			"Malang",
			"Sidoarjo",
			"Gresik",
			"Kediri",
			"Madiun",
			"Mojokerto",
			"Jember",
			"Banyuwangi",
		],
	},
	{
		name: "Banten",
		cities: [
			"Tangerang",
			"Tangerang Selatan",
			"Serang",
			"Cilegon",
			"Lebak",
			"Pandeglang",
		],
	},
	{
		name: "Bali",
		cities: [
			"Denpasar",
			"Badung",
			"Gianyar",
			"Tabanan",
			"Buleleng",
			"Karangasem",
		],
	},
	{
		name: "Aceh",
		cities: ["Banda Aceh", "Lhokseumawe", "Langsa", "Sabang"],
	},
	{
		name: "Sumatera Utara",
		cities: [
			"Medan",
			"Binjai",
			"Pematangsiantar",
			"Tebing Tinggi",
			"Deli Serdang",
		],
	},
	{
		name: "Sumatera Barat",
		cities: ["Padang", "Bukittinggi", "Payakumbuh", "Pariaman"],
	},
	{
		name: "Riau",
		cities: ["Pekanbaru", "Dumai", "Kampar", "Bengkalis"],
	},
	{
		name: "Kepulauan Riau",
		cities: ["Batam", "Tanjung Pinang", "Bintan", "Karimun"],
	},
	{
		name: "Jambi",
		cities: ["Jambi", "Sungai Penuh", "Muaro Jambi"],
	},
	{
		name: "Bengkulu",
		cities: ["Bengkulu", "Curup", "Manna"],
	},
	{
		name: "Sumatera Selatan",
		cities: ["Palembang", "Lubuklinggau", "Prabumulih", "Pagar Alam"],
	},
	{
		name: "Kepulauan Bangka Belitung",
		cities: ["Pangkalpinang", "Tanjung Pandan", "Sungailiat"],
	},
	{
		name: "Lampung",
		cities: ["Bandar Lampung", "Metro", "Pringsewu", "Kotabumi"],
	},
	{
		name: "Kalimantan Barat",
		cities: ["Pontianak", "Singkawang", "Sambas", "Ketapang"],
	},
	{
		name: "Kalimantan Tengah",
		cities: ["Palangka Raya", "Sampit", "Pangkalan Bun"],
	},
	{
		name: "Kalimantan Selatan",
		cities: ["Banjarmasin", "Banjarbaru", "Martapura"],
	},
	{
		name: "Kalimantan Timur",
		cities: ["Samarinda", "Balikpapan", "Bontang", "Tenggarong"],
	},
	{
		name: "Kalimantan Utara",
		cities: ["Tanjung Selor", "Tarakan", "Nunukan"],
	},
	{
		name: "Sulawesi Utara",
		cities: ["Manado", "Bitung", "Tomohon", "Kotamobagu"],
	},
	{
		name: "Gorontalo",
		cities: ["Gorontalo", "Limboto", "Marisa"],
	},
	{
		name: "Sulawesi Tengah",
		cities: ["Palu", "Poso", "Luwuk", "Donggala"],
	},
	{
		name: "Sulawesi Barat",
		cities: ["Mamuju", "Majene", "Polewali"],
	},
	{
		name: "Sulawesi Selatan",
		cities: ["Makassar", "Parepare", "Palopo", "Gowa", "Maros"],
	},
	{
		name: "Sulawesi Tenggara",
		cities: ["Kendari", "Baubau", "Kolaka"],
	},
	{
		name: "Nusa Tenggara Barat",
		cities: ["Mataram", "Bima", "Sumbawa", "Lombok Tengah"],
	},
	{
		name: "Nusa Tenggara Timur",
		cities: ["Kupang", "Ende", "Maumere", "Labuan Bajo"],
	},
	{
		name: "Maluku",
		cities: ["Ambon", "Tual", "Masohi"],
	},
	{
		name: "Maluku Utara",
		cities: ["Ternate", "Tidore", "Sofifi"],
	},
	{
		name: "Papua",
		cities: ["Jayapura", "Sentani", "Abepura"],
	},
	{
		name: "Papua Barat",
		cities: ["Manokwari", "Sorong", "Fakfak"],
	},
	{
		name: "Papua Selatan",
		cities: ["Merauke", "Tanah Merah"],
	},
	{
		name: "Papua Tengah",
		cities: ["Nabire", "Timika"],
	},
	{
		name: "Papua Pegunungan",
		cities: ["Wamena", "Jayawijaya"],
	},
	{
		name: "Papua Barat Daya",
		cities: ["Sorong", "Raja Ampat"],
	},
];

export const provinceNames: string[] = provinces.map((p) => p.name);

export function citiesForProvince(province: string): string[] {
	return provinces.find((p) => p.name === province)?.cities ?? [];
}
