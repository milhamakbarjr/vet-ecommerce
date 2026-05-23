# PetSehat Build Contract (shared spec for all agents)

This is the **single source of truth** that every build agent must follow exactly so that
independently-built pieces compose without conflict. Read this in full before writing code.
Read `CLAUDE.md` (project) and `PRD.html` for product detail. This file wins on technical contracts.

PetSehat is a **frontend-only mock** of an Indonesian vet-backed pet ecommerce. No backend, no
network calls. All data is static JSON/TS; all mutable state lives in `localStorage`. Default UI
copy language is **Bahasa Indonesia**; prices in **IDR** formatted `Rp 150.000`.

---

## 1. Golden rules

- **No network requests.** Import static data; read/write `localStorage` only (guard for SSR — see §6).
- **TypeScript strict.** `import type` for type-only imports (`verbatimModuleSyntax`). No unused locals/params.
- **Biome formatting:** tabs for indent, double quotes. Run `pnpm check` before finishing. Do NOT touch `src/routeTree.gen.ts` (auto-generated) or `src/styles.css` design tokens.
- **shadcn/ui (Base UI, new-york) for all interactive primitives.** Add via `pnpm dlx shadcn@latest add <name>`. Never hand-roll a headless primitive that shadcn provides.
- **Design tokens only.** Use Tailwind classes mapped to the tokens in `styles.css` (`bg-primary`, `text-accent-foreground`, `bg-card`, `border-border`, `font-display`, etc.). Coral primary + honey-yellow accent + warm off-white surfaces. **Never a flat grayscale-only scheme.** Headlines use `font-display` (Fraunces); body uses default sans (Geist).
- **No em-dash / hyphen sentence connectors in UI copy** (AI-slop tell). Write real sentences.
- **Responsive 360px → 1440px+.** Mobile single-column, desktop uses width deliberately. Touch targets ≥ 44px. No hover-only actions. Test mentally at mobile/tablet/desktop.
- **Accessibility WCAG AA:** semantic HTML, ARIA labels on icon buttons, keyboard reachable, alt text on images.
- **Fire analytics events** at every meaningful interaction (see §7).
- **Images:** product/category-relevant Unsplash closeups only (`https://images.unsplash.com/...`). No lifestyle filler. Always include descriptive `alt`.
- Path alias: import from `@/...` or `#/...` (both = `src/`). Use `@/`.

---

## 2. Directory layout (who owns what)

```
src/
  data/
    types.ts            # ALL shared TS types (foundation)
    products.ts         # ~60 products typed as Product[] (foundation)
    categories.ts       # Category[] + subcategories (foundation)
    articles.ts         # Article[] (foundation seed; advice agent may extend bodies)
    guides.ts           # Guide[] (foundation seed)
    symptom-tree.ts     # SymptomTree (foundation seed; advice agent owns depth)
    regions.ts          # Indonesian provinces + sample cities (foundation)
    couriers.ts         # Courier options (foundation)
    payments.ts         # Payment method metadata (foundation)
    mock-user.ts        # demo user + seeded orders + helpers (foundation)
    reviews.ts          # optional: extra reviews (reviews live inline on products)
  lib/
    utils.ts            # cn() — exists
    format.ts           # formatIDR, formatDateID, etc. (foundation)
    storage.ts          # safe localStorage get/set (foundation)
    analytics.ts        # track() event stub (foundation)
    ids.ts              # order number + uid helpers (foundation)
  context/
    providers.tsx       # <AppProviders> composing all providers (foundation)
    catalog.tsx         # useCatalog (foundation)
    cart.tsx            # useCart (foundation)
    pet-profile.tsx     # usePetProfiles (foundation)
    auth.tsx            # useAuth (foundation)
    orders.tsx          # useOrders (foundation)
    subscriptions.tsx   # useSubscriptions (foundation)
  components/
    ui/                 # shadcn primitives (foundation installs; agents may add more)
    layout/
      site-header.tsx   # top nav + cart badge + profile chip + search (foundation)
      site-footer.tsx   # footer (foundation)
      mobile-nav.tsx    # bottom tab bar on mobile (foundation)
      app-shell.tsx     # wraps header+main+footer/mobile-nav (foundation)
    product/
      product-card.tsx  # shared card (foundation)
      vet-badge.tsx     # "Vet Approved" badge (foundation)
      rating-stars.tsx  # star display + input (foundation)
      price.tsx         # <Price value={..}/> renders formatIDR (foundation)
    common/
      empty-state.tsx   # (foundation)
      page-section.tsx   # section heading wrapper (foundation)
      pet-profile-modal.tsx  # create/edit profile dialog (pet-profile agent)
  routes/               # file-based routes — each feature agent owns its files (see §5)
```

Feature agents create their own files under `routes/` and feature-specific subfolders under
`components/<feature>/`. **Do not edit another agent's files.** Shared edits to `site-header.tsx`
are forbidden after foundation finishes — the header is built complete with all nav links.

---

## 3. Core data types (`src/data/types.ts`)

Foundation defines these exactly. Everyone imports `import type { ... } from "@/data/types"`.

```ts
export type PetSpecies = "dog" | "cat" | "rabbit" | "bird" | "fish" | "other";
export type Lifestage = "puppy_kitten" | "junior" | "adult" | "senior"; // 0-12, 13-24, 25-84, 85+ months
export type CategorySlug = "food" | "health" | "supplies";
export type Sex = "male" | "female" | "unknown";
export type TriState = "yes" | "no" | "unknown";

export interface VetNote { text: string; vetName: string; credential: string; }

export interface Review {
  id: string;
  author: string;
  petType: PetSpecies;
  rating: number;        // 1-5
  title?: string;
  body: string;
  date: string;          // ISO yyyy-mm-dd
  photoUrl?: string;
}

export interface Product {
  id: string;
  slug: string;          // url-safe, unique
  name: string;
  brand: string;
  category: CategorySlug;
  subcategory: string;   // matches a Category.subcategories[].slug
  description: string;
  petTypes: PetSpecies[];
  lifestages: Lifestage[];
  price: number;         // INTEGER RUPIAH. 150000 => "Rp 150.000". No cents.
  compareAtPrice?: number; // optional original price for discount display
  images: string[];      // Unsplash URLs, first = primary
  specs: Record<string, string>;
  ingredients?: string;
  rating: number;        // aggregate, e.g. 4.6
  reviewCount: number;
  reviews: Review[];     // 4-8 per product
  vetNote?: VetNote;
  vetRecommended: boolean;
  subscriptionEligible: boolean;
  frequentlyBoughtTogether: string[]; // product ids
  stockStatus: "in_stock" | "low_stock";
  createdAt: string;     // ISO, for "newest" sort
}

export interface Category {
  slug: CategorySlug;
  name: string;          // Bahasa Indonesia label
  tagline: string;
  image: string;
  subcategories: { slug: string; name: string }[];
  featuredProductIds: string[];
}

export interface PetProfile {
  id: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  ageMonths: number;
  weightKg?: number;
  sex: Sex;
  neutered: TriState;
  healthNotes?: string;  // max 500 chars
  createdAt: string;
}

export type ArticleTopic = "nutrition" | "preventive" | "symptoms" | "breed";
export interface Article {
  id: string;
  slug: string;
  title: string;
  topic: ArticleTopic;
  vetAuthor: { name: string; credential: string };
  readMinutes: number;
  publishedAt: string;   // ISO
  petTypes: PetSpecies[];
  coverImage: string;
  excerpt: string;
  body: string;          // markdown-ish; render paragraphs split on blank lines
  relatedProductIds: string[];
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  vetAuthor: { name: string; credential: string };
  intro: string;
  productIds: string[];
}

// Symptom checker decision tree
export interface SymptomOutcome {
  assessment: string;
  seeVet: "yes" | "no" | "maybe";
  productIds: string[]; // 0-3
}
export interface SymptomNode {
  id: string;
  label: string;
  children?: SymptomNode[];
  outcome?: SymptomOutcome; // terminal nodes have outcome
}
export interface SymptomTree {
  // keyed by species; each species has body-area nodes
  [species: string]: SymptomNode[];
}

export type SubscriptionFrequency = "biweekly" | "monthly" | "bimonthly"; // 14/30/60 days
export interface Subscription {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;     // after 5% subscribe discount, integer rupiah
  quantity: number;
  frequency: SubscriptionFrequency;
  nextDeliveryDate: string; // ISO
  address: Address;
  paymentMethod: string; // payment method id
  status: "active" | "cancelled";
  paused: boolean;
  createdAt: string;
  cancelledAt?: string;
}

export interface Address {
  id: string;
  label: "home" | "office" | "other";
  recipient: string;
  phone: string;
  street: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;   // unit price at purchase, integer rupiah
  quantity: number;
}
export type OrderStatus =
  | "payment_pending" | "processing" | "packed" | "in_transit" | "delivered" | "cancelled";
export interface TrackingEvent { status: OrderStatus; label: string; timestamp: string; done: boolean; }
export interface Order {
  id: string;            // PS-YYYYMMDD-XXXXX
  createdAt: string;     // ISO
  items: OrderItem[];
  address: Address;
  courierId: string;
  paymentMethodId: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  timeline: TrackingEvent[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export interface Courier {
  id: "jne" | "jnt" | "sicepat";
  name: string;
  etaDays: string;       // "2-3 hari"
  fee: number;           // integer rupiah
  logo?: string;
}

export type PaymentMethodId = "gopay" | "ovo" | "dana" | "qris" | "va";
export interface PaymentMethod {
  id: PaymentMethodId;
  name: string;
  description: string;
  kind: "ewallet" | "qris" | "va";
}

export interface CartItem { productId: string; quantity: number; }
export interface PromoCode { code: string; type: "percent" | "fixed"; value: number; label: string; }
```

---

## 4. Context APIs (`src/context/*`)

All providers are composed in `<AppProviders>` and mounted once in `__root.tsx`. Hooks throw if used
outside provider. **Feature agents must use these hooks; never read localStorage directly for these domains.**

```ts
// catalog.tsx — static, no persistence
useCatalog(): {
  products: Product[];
  getProduct(idOrSlug: string): Product | undefined;
  categories: Category[];
  getCategory(slug: CategorySlug): Category | undefined;
  articles: Article[];
  getArticle(slug: string): Article | undefined;
  guides: Guide[];
  getGuide(slug: string): Guide | undefined;
  recommendFor(profile: PetProfile | null, limit?: number): Product[]; // species+lifestage intersection
}

// cart.tsx — persists petsehat_cart
useCart(): {
  items: CartItem[];
  count: number;            // total quantity
  addItem(productId: string, qty?: number): void;  // increments if exists; fires add_to_cart
  removeItem(productId: string): void;
  setQuantity(productId: string, qty: number): void;
  clear(): void;
  subtotal: number;         // integer rupiah from catalog prices
  promo: PromoCode | null;
  applyPromo(code: string): { ok: boolean; message: string };
  clearPromo(): void;
  discount: number;         // computed from promo against subtotal
}

// pet-profile.tsx — persists petsehat_profiles + petsehat_active_profile
usePetProfiles(): {
  profiles: PetProfile[];
  activeProfile: PetProfile | null;
  activeProfileId: string | null;
  setActiveProfile(id: string | null): void;
  addProfile(data: Omit<PetProfile,"id"|"createdAt">): { ok: boolean; message?: string }; // max 5
  updateProfile(id: string, data: Partial<PetProfile>): void;
  deleteProfile(id: string): void; // reassigns active per FR-10
}

// auth.tsx — persists petsehat_user + petsehat_session
useAuth(): {
  user: User | null;
  isAuthenticated: boolean;
  login(email: string, password: string): { ok: boolean; message?: string }; // demo@petsehat.id / any pw
  register(data: { name: string; email: string; phone: string; password: string }): { ok: boolean; message?: string };
  logout(): void;
  updateUser(data: Partial<User>): void;
  addAddress(addr: Omit<Address,"id">): void;
  updateAddress(id: string, addr: Partial<Address>): void;
  removeAddress(id: string): void;
}

// orders.tsx — persists petsehat_orders (seeded with demo orders on first load)
useOrders(): {
  orders: Order[];               // reverse chronological
  getOrder(id: string): Order | undefined;
  placeOrder(input: PlaceOrderInput): Order; // builds id, timeline, totals; fires order_completed
}
// PlaceOrderInput = { items, address, courierId, paymentMethodId, subtotal, deliveryFee, discount, total }

// subscriptions.tsx — persists petsehat_subscriptions
useSubscriptions(): {
  subscriptions: Subscription[];      // active + cancelled
  active: Subscription[];
  upcoming: Subscription | null;      // soonest active nextDeliveryDate
  add(input: AddSubscriptionInput): Subscription; // fires subscription_activated
  pause(id: string): void;            // toggles paused, bumps nextDeliveryDate
  cancel(id: string): void;           // status cancelled + cancelledAt; fires subscription_cancelled
  setFrequency(id: string, f: SubscriptionFrequency): void;
  setQuantity(id: string, q: number): void;
}
```

Demo account: `demo@petsehat.id` + any password logs in. Seed `mock-user.ts` with that user
(name "Sari Wijaya", phone, one default Jakarta address) and 3-5 seeded past orders covering various
statuses (including one Delivered, one In Transit). Seed runs once if `petsehat_orders` is empty.

---

## 5. Route map (file-based routing)

Each route is a file `src/routes/<path>.tsx` exporting `Route = createFileRoute("<id>")({ component })`.
Nested/dynamic: `$param`. Owners in brackets. **Only the owner creates these files.**

| Path | File | Owner |
|---|---|---|
| `/` Home | `routes/index.tsx` | Home agent |
| `/products` listing (search/filter/sort) | `routes/products/index.tsx` | Catalog agent |
| `/products/$category` | `routes/products/$category.tsx` | Catalog agent |
| `/product/$slug` detail | `routes/product/$slug.tsx` | Catalog agent |
| `/cart` | `routes/cart.tsx` | Checkout agent |
| `/checkout` multi-step | `routes/checkout.tsx` | Checkout agent |
| `/checkout/success` (reads `?order=ID`) | `routes/checkout/success.tsx` | Checkout agent |
| `/advice` hub | `routes/advice/index.tsx` | Advice agent |
| `/advice/$slug` article | `routes/advice/$slug.tsx` | Advice agent |
| `/advice/symptom-checker` | `routes/advice/symptom-checker.tsx` | Advice agent |
| `/advice/ask` Ask Our Vet | `routes/advice/ask.tsx` | Advice agent |
| `/advice/guide/$slug` | `routes/advice/guide.$slug.tsx` | Advice agent |
| `/login` | `routes/login.tsx` | Accounts agent |
| `/register` | `routes/register.tsx` | Accounts agent |
| `/forgot-password` | `routes/forgot-password.tsx` | Accounts agent |
| `/account` profile | `routes/account/index.tsx` | Accounts agent |
| `/account/pets` | `routes/account/pets.tsx` | Accounts agent |
| `/account/orders` | `routes/account/orders/index.tsx` | Accounts agent |
| `/account/orders/$orderId` detail+tracking | `routes/account/orders/$orderId.tsx` | Accounts agent |
| `/account/subscriptions` | `routes/account/subscriptions.tsx` | Subscriptions agent |
| `/subscribe/$productId` setup flow | `routes/subscribe/$productId.tsx` | Subscriptions agent |

Cross-feature navigation uses `<Link to="/product/$slug" params={{ slug }}>` etc. Linking to a route
another agent owns is expected and fine.

> NOTE: `src/routeTree.gen.ts` is regenerated by the Vite router plugin on build. TypeScript may flag
> a new route path until regenerated. Follow the exact `createFileRoute` pattern and do not worry
> about that specific transient type error; the orchestrator runs a final integration build.

---

## 6. SSR-safe storage (`src/lib/storage.ts`)

App is server-rendered (Nitro). `localStorage`/`window` are undefined on the server. Always:
- Read inside `useEffect`/event handlers, never during render/module load.
- Provide a `safeGet<T>(key, fallback)` / `safeSet(key, value)` that `typeof window === "undefined"` guards.
- Contexts initialize state to the empty/default value, then hydrate from storage in a `useEffect` on mount.
- To avoid hydration mismatch, render storage-dependent UI only after a mounted flag is true (or use suspense-free defaults).

---

## 7. Analytics events (`src/lib/analytics.ts`)

```ts
export function track(event: string, props?: Record<string, unknown>): void {
  // v1: console.debug structured payload
  // eslint/biome: keep it simple
  console.debug("[analytics]", { event, ...props, ts: Date.now() });
}
```

Event names (fire these — contract for Phase 2): `session_start` (root mount), `product_view`,
`add_to_cart`, `checkout_started`, `order_completed` (props: orderId, total), `pet_profile_completed`,
`vet_content_viewed` (props: slug), `subscription_activated`, `subscription_paused`,
`subscription_cancelled`, `search_performed` (props: query, results), `symptom_check_completed`.

---

## 8. Formatting (`src/lib/format.ts`)

```ts
formatIDR(n: number): string        // 150000 -> "Rp 150.000" (id-ID, no decimals)
formatDateID(iso: string): string   // -> "23 Mei 2026" (Intl id-ID, long month)
formatDateShort(iso: string): string// -> "23/05/2026"
```

---

## 9. Copy & language

Default visible copy is **Bahasa Indonesia**, warm and plain. Examples: "Tambah ke Keranjang"
(Add to cart), "Keranjang" (Cart), "Bayar Sekarang"/"Lanjut ke Pembayaran", "Masuk" (Login),
"Daftar" (Register), "Beranda" (Home), "Cari produk..." (Search), "Langganan & Hemat"
(Subscribe & Save), "Disetujui Dokter Hewan" (Vet Approved). Keep an English mental model but ship ID copy.
No em-dash/hyphen sentence connectors.

---

## 10. Definition of done (every agent)

- All assigned routes/components implemented per the FRs in PRD.html for your area.
- Uses foundation contexts/components; no direct localStorage for owned domains.
- Responsive at 360/768/1280; AA labels; analytics events fired.
- `pnpm check` passes for your files (run it; fix lint/format). Do not run `pnpm build`/`pnpm dev`
  (orchestrator does the integration build to avoid clobbering the generated route tree).
- Report: files created, routes added, any deviations or follow-ups.
</content>
</invoke>
