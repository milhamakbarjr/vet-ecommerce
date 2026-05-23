import type { Article } from "@/data/types";

export const articles: Article[] = [
	{
		id: "a-001",
		slug: "panduan-nutrisi-anak-anjing",
		title: "Panduan Nutrisi untuk Anak Anjing yang Sedang Tumbuh",
		topic: "nutrition",
		vetAuthor: {
			name: "drh. Anika Putri",
			credential: "Dokter Hewan, Klinik Sehat Bersama",
		},
		readMinutes: 6,
		publishedAt: "2025-09-10",
		petTypes: ["dog"],
		coverImage:
			"https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80",
		excerpt:
			"Masa pertumbuhan menentukan kesehatan anjing seumur hidup. Berikut cara memberi makan anak anjing dengan tepat.",
		body: `Anak anjing tumbuh dengan sangat cepat pada tahun pertamanya. Karena itu kebutuhan energinya jauh lebih tinggi dibanding anjing dewasa, dan makanannya pun harus disesuaikan.

Pilih pakan khusus anak anjing yang mengandung protein berkualitas serta DHA untuk perkembangan otak. Hindari memberi makanan anjing dewasa terlalu dini karena kandungan gizinya belum tentu cukup.

Beri makan dalam porsi kecil tetapi sering. Untuk usia di bawah empat bulan, tiga sampai empat kali sehari adalah ritme yang nyaman bagi pencernaannya. Setelah itu Anda bisa menguranginya secara bertahap menjadi dua kali sehari.

Air bersih harus selalu tersedia. Perhatikan juga berat badan secara berkala. Jika ragu soal porsi yang tepat, konsultasikan dengan dokter hewan langganan Anda.`,
		relatedProductIds: ["p-002", "p-023", "p-031"],
	},
	{
		id: "a-002",
		slug: "memilih-makanan-kucing-dewasa",
		title: "Cara Memilih Makanan yang Tepat untuk Kucing Dewasa",
		topic: "nutrition",
		vetAuthor: {
			name: "drh. Bagus Santoso",
			credential: "Dokter Hewan, Spesialis Nutrisi",
		},
		readMinutes: 5,
		publishedAt: "2025-08-22",
		petTypes: ["cat"],
		coverImage:
			"https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?auto=format&fit=crop&w=1200&q=80",
		excerpt:
			"Kucing adalah karnivora sejati. Pahami apa yang sebenarnya dibutuhkan tubuhnya sebelum memilih pakan.",
		body: `Berbeda dengan anjing, kucing membutuhkan protein hewani dalam jumlah tinggi dan tidak bisa hidup hanya dari karbohidrat. Karena itu kandungan daging atau ikan pada pakan menjadi hal pertama yang perlu Anda perhatikan.

Taurin adalah nutrisi penting yang hanya bisa diperoleh kucing dari makanan. Kekurangan taurin dapat memengaruhi jantung dan penglihatan, jadi pastikan pakan pilihan Anda mencantumkannya.

Kombinasikan makanan kering dan makanan basah untuk menjaga asupan cairan. Banyak kucing kurang minum, sehingga makanan basah membantu menjaga kesehatan ginjal dan saluran kemih.

Perhatikan respons kucing setelah beberapa minggu. Bulu yang berkilau, energi yang stabil, dan pencernaan yang lancar adalah tanda pakan tersebut cocok untuknya.`,
		relatedProductIds: ["p-004", "p-006", "p-010"],
	},
	{
		id: "a-003",
		slug: "jadwal-vaksinasi-dan-pencegahan",
		title: "Jadwal Vaksinasi dan Pencegahan Penyakit yang Perlu Anda Tahu",
		topic: "preventive",
		vetAuthor: {
			name: "drh. Citra Lestari",
			credential: "Dokter Hewan, Klinik Hewan Nusantara",
		},
		readMinutes: 7,
		publishedAt: "2025-09-02",
		petTypes: ["dog", "cat"],
		coverImage:
			"https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1200&q=80",
		excerpt:
			"Pencegahan jauh lebih murah daripada pengobatan. Kenali jadwal dasar yang melindungi hewan kesayangan Anda.",
		body: `Vaksinasi adalah cara paling efektif melindungi anjing dan kucing dari penyakit yang berbahaya. Vaksin pertama biasanya diberikan saat hewan berusia enam sampai delapan minggu, lalu diulang sesuai anjuran dokter hewan.

Selain vaksin, pemberian obat cacing secara rutin penting dilakukan. Anak hewan sebaiknya diberi obat cacing setiap dua minggu sampai usia tiga bulan, kemudian dilanjutkan setiap tiga bulan saat dewasa.

Pencegahan kutu dan caplak juga tidak boleh diabaikan. Parasit ini bukan hanya membuat hewan tidak nyaman, tetapi juga bisa menularkan penyakit.

Catat tanggal setiap tindakan pencegahan. Dengan jadwal yang teratur, Anda bisa menghindari banyak masalah kesehatan sebelum sempat muncul.`,
		relatedProductIds: ["p-036", "p-039", "p-031"],
	},
	{
		id: "a-004",
		slug: "mengenali-tanda-dehidrasi",
		title: "Mengenali Tanda Dehidrasi pada Anjing dan Kucing",
		topic: "symptoms",
		vetAuthor: {
			name: "drh. Anika Putri",
			credential: "Dokter Hewan, Klinik Sehat Bersama",
		},
		readMinutes: 4,
		publishedAt: "2025-08-15",
		petTypes: ["dog", "cat"],
		coverImage:
			"https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1200&q=80",
		excerpt:
			"Dehidrasi bisa muncul cepat, terutama saat cuaca panas. Pelajari tanda awal yang perlu diwaspadai.",
		body: `Dehidrasi terjadi ketika tubuh kehilangan lebih banyak cairan daripada yang masuk. Pada hewan, kondisi ini bisa berkembang lebih cepat daripada yang kita kira.

Salah satu cara sederhana mengeceknya adalah dengan menarik lembut kulit di tengkuk. Pada hewan yang terhidrasi baik, kulit akan kembali ke posisi semula dengan cepat. Jika lambat, itu bisa menjadi tanda dehidrasi.

Perhatikan juga gusi yang kering atau lengket, mata yang tampak cekung, serta kelesuan yang tidak biasa. Nafsu makan yang menurun sering menyertai kondisi ini.

Sediakan air bersih yang mudah dijangkau, dan pertimbangkan air mancur minum untuk mendorong hewan minum lebih banyak. Jika tanda dehidrasi tampak jelas, segera bawa ke dokter hewan.`,
		relatedProductIds: ["p-056", "p-031"],
	},
	{
		id: "a-005",
		slug: "merawat-anjing-senior",
		title: "Merawat Anjing Senior agar Tetap Nyaman dan Aktif",
		topic: "preventive",
		vetAuthor: {
			name: "drh. Bagus Santoso",
			credential: "Dokter Hewan, Spesialis Geriatri",
		},
		readMinutes: 6,
		publishedAt: "2025-07-28",
		petTypes: ["dog"],
		coverImage:
			"https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=1200&q=80",
		excerpt:
			"Anjing tua punya kebutuhan khusus. Sedikit penyesuaian bisa membuat hari-hari mereka jauh lebih nyaman.",
		body: `Seiring usia, anjing mengalami perubahan pada sendi, pencernaan, dan tingkat energinya. Memahami perubahan ini membantu Anda merawatnya dengan lebih baik.

Beralihlah ke pakan senior yang lebih rendah kalori namun tetap kaya nutrisi. Tambahan glukosamin sering membantu menjaga kelenturan sendi yang mulai kaku.

Tetap ajak bergerak, tetapi sesuaikan intensitasnya. Jalan santai yang teratur lebih baik daripada aktivitas berat yang membebani sendi.

Pemeriksaan kesehatan rutin menjadi semakin penting di usia ini. Banyak kondisi pada anjing tua bisa ditangani dengan baik bila terdeteksi sejak dini.`,
		relatedProductIds: ["p-003", "p-033", "p-046"],
	},
	{
		id: "a-006",
		slug: "panduan-merawat-kelinci-rumahan",
		title: "Panduan Merawat Kelinci Rumahan untuk Pemula",
		topic: "breed",
		vetAuthor: {
			name: "drh. Citra Lestari",
			credential: "Dokter Hewan, Klinik Hewan Nusantara",
		},
		readMinutes: 5,
		publishedAt: "2025-08-08",
		petTypes: ["rabbit"],
		coverImage:
			"https://images.unsplash.com/photo-1452857297128-d9c29adba80b?auto=format&fit=crop&w=1200&q=80",
		excerpt:
			"Kelinci bukan hewan yang sulit, tetapi punya kebutuhan unik. Mulai dengan dasar yang benar.",
		body: `Banyak orang mengira kelinci hanya butuh wortel, padahal makanan utamanya adalah rumput kering berkualitas. Timothy hay membantu menjaga pencernaan sekaligus mengasah gigi yang terus tumbuh.

Sediakan rumput kering tanpa batas, pelet berserat tinggi dalam porsi terukur, dan sayuran segar sebagai pelengkap. Hindari memberi terlalu banyak buah karena kandungan gulanya tinggi.

Kelinci juga butuh ruang untuk bergerak dan tempat persembunyian agar merasa aman. Kandang yang terlalu sempit bisa membuatnya stres.

Perhatikan kebiasaan makan dan buang air setiap hari. Perubahan mendadak pada keduanya sering menjadi tanda awal masalah kesehatan pada kelinci.`,
		relatedProductIds: ["p-016", "p-017", "p-048"],
	},
	{
		id: "a-007",
		slug: "mengatasi-bulu-rontok-berlebih",
		title: "Mengatasi Bulu Rontok Berlebih pada Anjing dan Kucing",
		topic: "symptoms",
		vetAuthor: {
			name: "drh. Anika Putri",
			credential: "Dokter Hewan, Klinik Sehat Bersama",
		},
		readMinutes: 5,
		publishedAt: "2025-07-15",
		petTypes: ["dog", "cat"],
		coverImage:
			"https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=1200&q=80",
		excerpt:
			"Bulu rontok itu normal, tetapi rontok berlebih bisa menandakan sesuatu. Kenali batas wajarnya.",
		body: `Anjing dan kucing memang merontokkan bulu sebagai bagian dari siklus alami. Namun rontok yang berlebihan, apalagi disertai kulit kemerahan atau gatal, perlu diperhatikan lebih lanjut.

Penyebab paling umum adalah nutrisi yang kurang seimbang. Asupan omega 3 dan 6 yang cukup membantu menjaga kekuatan akar bulu dan kesehatan kulit.

Menyisir secara rutin sangat membantu mengurangi bulu yang beterbangan di rumah dan merangsang sirkulasi kulit. Pilih sisir yang sesuai dengan jenis bulu hewan Anda.

Jika rontok disertai luka, ketombe, atau bau yang tidak biasa, sebaiknya periksakan ke dokter hewan karena bisa jadi ada masalah kulit yang mendasarinya.`,
		relatedProductIds: ["p-032", "p-044", "p-052"],
	},
	{
		id: "a-008",
		slug: "menjaga-kesehatan-gigi-hewan",
		title: "Menjaga Kesehatan Gigi Hewan Kesayangan Sejak Dini",
		topic: "preventive",
		vetAuthor: {
			name: "drh. Citra Lestari",
			credential: "Dokter Hewan, Klinik Hewan Nusantara",
		},
		readMinutes: 4,
		publishedAt: "2025-08-05",
		petTypes: ["dog", "cat"],
		coverImage:
			"https://images.unsplash.com/photo-1558929996-da64ba858215?auto=format&fit=crop&w=1200&q=80",
		excerpt:
			"Masalah gigi adalah salah satu keluhan paling umum yang bisa dicegah. Mulailah dari kebiasaan sederhana.",
		body: `Penyakit gigi dan gusi sangat umum terjadi pada anjing dan kucing, terutama saat usia mereka bertambah. Kabar baiknya, sebagian besar bisa dicegah dengan perawatan rutin.

Menyikat gigi adalah cara paling efektif. Gunakan pasta gigi khusus hewan karena pasta gigi manusia tidak aman untuk mereka. Mulailah perlahan agar hewan terbiasa.

Camilan dental dan cairan tambahan air minum bisa menjadi pelengkap, meski tidak menggantikan menyikat gigi secara langsung.

Perhatikan tanda seperti napas yang sangat bau, gusi merah, atau enggan mengunyah. Tanda-tanda ini menunjukkan perlunya pemeriksaan ke dokter hewan.`,
		relatedProductIds: ["p-041", "p-042", "p-014"],
	},
	{
		id: "a-009",
		slug: "memahami-perilaku-kucing",
		title: "Memahami Perilaku Kucing dan Cara Berkomunikasi dengannya",
		topic: "breed",
		vetAuthor: {
			name: "drh. Bagus Santoso",
			credential: "Dokter Hewan, Konsultan Perilaku",
		},
		readMinutes: 6,
		publishedAt: "2025-09-05",
		petTypes: ["cat"],
		coverImage:
			"https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&w=1200&q=80",
		excerpt:
			"Kucing berbicara lewat bahasa tubuh. Begitu Anda memahaminya, hubungan kalian akan jauh lebih dekat.",
		body: `Kucing adalah hewan yang ekspresif, hanya saja caranya berbeda dari anjing. Ekor yang tegak dengan ujung melengkung biasanya menandakan suasana hati yang baik dan rasa percaya.

Sebaliknya, telinga yang menempel ke belakang dan tubuh yang merendah menunjukkan rasa takut atau tidak nyaman. Memberi ruang pada saat seperti ini lebih baik daripada memaksa berinteraksi.

Bermain setiap hari sangat penting bagi kucing. Selain menyalurkan energi, permainan berburu tiruan membantu menjaga kesehatan mental dan mengurangi perilaku merusak.

Sediakan tempat tinggi dan area persembunyian. Kucing merasa aman ketika bisa mengamati lingkungannya dari posisi yang nyaman.`,
		relatedProductIds: ["p-049", "p-046", "p-013"],
	},
];

export function getArticleBySlug(slug: string): Article | undefined {
	return articles.find((a) => a.slug === slug);
}
