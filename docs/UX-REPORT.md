---
title: Woodley's Jewelers — User Experience Report
author: Woodley's Jewelers
date: July 9, 2026
---

# Woodley's Jewelers
## User Experience Report

**Document purpose:** Explain the UX rationale behind the Woodley's Jewelers web application for stakeholders, designers, and developers.

**Date:** July 9, 2026

---

## Executive Summary

Woodley's Jewelers is designed as a **luxury jewelry showroom experience on the web**, not a generic e-commerce template. The UX balances three goals:

1. **Inspire trust and craftsmanship** through editorial layout, warm typography, and appointment-first cues.
2. **Support real shopping workflows** — browse collections, view product detail, add to cart, and check out.
3. **Give staff a focused admin workspace** to manage inventory, orders, and storefront content without clutter.

The app intentionally separates **storefront** (public) and **dashboard** (admin), uses **URL-driven state** where filters matter, and favors **reversible actions** (deactivate) over destructive ones (delete) unless the user explicitly confirms.

---

## Product Context

### Who Uses the App

| Audience | Primary Goals |
|----------|---------------|
| **Shoppers** | Discover jewelry, explore categories, view details, purchase or book a visit |
| **Members** | Manage account, orders, and profile |
| **Staff / Admins** | Manage products, orders, featured items, and storefront inventory |

### What Kind of Business This Is

Woodley's is a **high-touch retail jeweler**. The UX reflects that:

- Phone number and **"Book Visit"** are prominent in the header.
- Product pages emphasize imagery, craftsmanship, and category context.
- Admin tools prioritize **inventory control** and **merchandising** (featured products, collections) over bulk operations.

---

## Core UX Principles

### 1. Editorial Luxury, Not Marketplace Clutter

Serif headlines, uppercase eyebrows, champagne/ivory surfaces, and full-bleed heroes create a showroom feel. Product grids are curated, not dense warehouse listings.

### 2. Appointment-First Retail

The site supports online shopping, but the experience nudges toward in-store relationships: visit CTAs, service categories (repairs, appraisals, sizing), and brand storytelling on the homepage.

### 3. Clear Separation of Contexts

Shoppers stay in the storefront shell (header, footer, brand navigation). Admins enter a dedicated dashboard with its own navigation and no storefront chrome — reducing confusion and accidental public exposure of admin UI.

### 4. Reversible Before Permanent

Products are **deactivated** rather than deleted by default. Deactivation hides items from the storefront while preserving data. Permanent delete is only available for deactivated products and requires typing **DELETE**.

### 5. State You Can Share and Return To

Product filters, categories, search, and sort use URL parameters so staff can bookmark views (e.g. Services → Appraisals, sorted by price) and use browser back/forward without losing context.

### 6. Soft Overlays, Not Blocking Darkness

Dialogs and drawers use a **light blur backdrop** so users retain spatial context of the page behind them — appropriate for a refined, non-aggressive interface.

---

## Information Architecture

### Storefront Structure

```
Home
├── Shop / Collections (by category)
│   ├── Engagement & Wedding
│   ├── Diamonds
│   ├── Custom Jewelry
│   ├── Fine Jewelry
│   ├── Watches
│   └── Services
├── Product detail pages
├── Cart → Checkout
├── Account (member self-service)
└── Content (About, Contact, policies)
```

**Rationale:** Navigation mirrors how customers think about jewelry — by occasion, type, and service — not by internal SKUs or database structure.

### Admin Structure

```
Dashboard
├── Dashboard (overview)
├── Orders
├── Products
└── Settings
```

**Rationale:** Admin nav stays shallow. Complex product organization lives **inside** the Products page, not in the global sidebar — keeping the main menu scannable.

### Access Control

- Unauthenticated users are redirected to sign in.
- Non-admin users are redirected to their account area.
- Dashboard routes are excluded from search indexing.

**Rationale:** Admin is a private workspace; members and admins never compete for the same navigation model.

---

## Storefront Experience

### Homepage Funnel

The homepage follows an intentional editorial sequence:

1. **Hero** — rotating highlights (engagement, watches, custom work) with pause/play and keyboard support.
2. **Brand story** — why Woodley's.
3. **Showroom highlights** — featured products.
4. **New releases** — freshness and discovery.
5. **Featured categories** — entry points into the catalog.

**Rationale:** Lead with emotion and craftsmanship, then merchandise, then breadth — matching how customers shop in a showroom.

### Collection and Shop Pages

- Full-bleed editorial heroes with breadcrumbs, eyebrow labels, and serif titles.
- Category pages feel like **magazine sections**, not filter-heavy grids.
- Shop-all combines native catalog with extended browsing where needed.

**Rationale:** Jewelry is visual and categorical; the layout supports browsing and inspiration before comparison.

### Product Detail Page (PDP)

| Element | UX Decision |
|---------|-------------|
| **Layout** | Gallery left; purchase panel sticky on desktop |
| **Hierarchy** | Title → price → stock → quantity → add to cart |
| **Feedback** | Brief "added" confirmation after add-to-cart |
| **Discovery** | Similar products below the fold |
| **Context** | Breadcrumbs back to shop and category |

**Rationale:** On PDP, the decision moment is visual and emotional; sticky purchase controls reduce scroll friction on desktop without crowding the imagery.

### Cart and Checkout

**Cart drawer (primary pattern)**

- Opens from the header when items exist.
- Wide layout with suggestions ("We think you would like") beside the bag on larger screens.
- Checkout can start inside the drawer.

**Full cart page**

- Fallback for users who prefer a dedicated page or arrive via direct link.

**Checkout**

- Handles local catalog and Shopify flows.
- Clearly blocks **mixed carts** with guidance instead of failing silently.

**Rationale:** Drawer keeps shoppers in context; full page supports deep review; explicit mixed-cart messaging prevents checkout frustration.

---

## Admin Dashboard Experience

### Shell and Navigation

- **Icon sidebar** on smaller screens; labels appear on large screens.
- **Solid sidebar background** for clear separation from content.
- **Active state** uses warm amber highlighting consistent with brand CTAs.
- Header shows brand, personalized welcome, and logout.

**Rationale:** Admins need fast wayfinding without sacrificing content space on tablets.

### Products Page — Layout Decisions

```
┌─────────────────────────────────────────────────────────┐
│  Title + subtitle                          [Add product] │
├─────────────────────────────────────────────────────────┤
│  Search (full width)              Sort dropdown        │
├─────────────────────────────────────────────────────────┤
│  "Showing X products in [category]"                     │
├──────────────┬──────────────────────────────────────────┤
│  Categories  │  Active products                         │
│  (25%)       │  (75%)                                   │
│              │  ─────────────────                       │
│              │  Deactivated products                    │
└──────────────┴──────────────────────────────────────────┘
```

#### Why Title and Search Are Full Width

Search and page context apply to **all** products. Keeping them above the split avoids implying search only affects one column.

#### Why Categories Live Inside the Page, Not the Main Sidebar

The global sidebar is for **app-level** navigation (Orders, Products, Settings). Category/subcategory browsing is **task-specific** to product management. Nesting it in the Products page:

- Keeps the main nav clean.
- Mirrors how staff think: "I'm on Products → now I'm browsing Services → Appraisals."
- Allows a dedicated category panel with counts and expandable subcategories.

#### Why the Split Is 25% / 75%

The category tree needs enough width for labels and counts without dominating the screen. The product list needs room for thumbnails, metadata, and action buttons.

#### Why Active and Deactivated Are Separate Sections

Staff need different mental models:

- **Active** = live on the storefront; supports feature, deactivate, edit.
- **Deactivated** = hidden but recoverable; supports activate, edit, delete.

Splitting them prevents accidental actions on the wrong inventory state.

### Filtering and Sorting

| Control | Location | Behavior |
|---------|----------|----------|
| **Category / subcategory** | Left panel | URL: `?section=services&collection=appraisals` |
| **Search** | Top bar | Filters by name or handle |
| **Sort** | Top bar | A–Z, Z–A, price, featured, recently added/updated |

**Rationale:** Category navigation replaced a redundant "filter by collection" dropdown. One control per job reduces duplicate paths to the same outcome.

### Product Row Actions

| Product State | Actions | Rationale |
|---------------|---------|-----------|
| **Active** | Feature, Deactivate, Edit | Featured items surface on homepage; deactivate is reversible |
| **Deactivated** | **Activate** (primary), Edit, Delete | Activate is the most likely next step; delete is destructive |

#### Activate as Primary Button

Activate uses the same amber primary style as "Add product" because it is the **main positive action** for deactivated inventory.

#### No Feature on Deactivated Products

Featured products must be active on the storefront. Hiding Feature on deactivated rows prevents invalid states and confusion.

#### Delete with Type-to-Confirm

Delete opens a dialog requiring the user to type **DELETE**. The confirm button stays disabled until the exact word is entered.

**Rationale:** Permanent deletion is irreversible; type-to-confirm is a proven pattern for high-stakes admin actions.

---

## Visual Design System

### Color and Mood

| Role | Character |
|------|-----------|
| **Background** | Warm ivory (`#faf8f4`) |
| **Text** | Deep brown-gray |
| **Accent** | Warm gold for CTAs and highlights |
| **Destructive** | Red outline/text, same button shape as secondary actions |

**Rationale:** Warm neutrals and gold align with jewelry retail — precious, calm, trustworthy — not cold tech-blue SaaS.

### Typography

- **Playfair Display** — headings and editorial moments.
- **Inter** — UI, forms, and body text.

**Rationale:** Serif + sans pairing is common in luxury retail: character for storytelling, clarity for tasks.

### Buttons

| Type | Use |
|------|-----|
| **Primary (amber)** | Add product, Activate, key CTAs |
| **Ghost / outline** | Edit, Deactivate, secondary actions |
| **Destructive outline (red)** | Delete — same shape as ghost, different color |

**Rationale:** Shape consistency reduces visual noise; color carries meaning.

### Decorative Language

Subtle fabric texture, band highlights, and image scrims reinforce craftsmanship without distracting from product photography.

---

## Interaction Patterns

### Loading

- **Skeleton layouts** on catalog pages (layout stays stable).
- **Text states** in dashboard ("Loading products…").
- **Route transition bar** — thin amber progress under the header on navigation.

**Rationale:** Skeletons and progress bars feel faster than blank screens or spinners alone.

### Empty States

Every major view includes guidance:

- Empty cart → "Browse catalog"
- No active products in filter → "Add your first product"
- No deactivated products → clear empty message

**Rationale:** Empty states are onboarding moments, not dead ends.

### Feedback

- Success/error banners in admin with appropriate ARIA roles.
- Inline form validation in checkout.
- Brief add-to-cart confirmation on PDP.

---

## Accessibility

| Pattern | Implementation |
|---------|----------------|
| **Landmarks** | `main`, `nav`, dialog roles |
| **Focus management** | Focus moves to main on route change; focus trap in modals |
| **Screen reader announcements** | Route title announced on navigation |
| **Keyboard** | Hero carousel, mobile menu Escape, accordion controls |
| **Reduced motion** | Animations respect `prefers-reduced-motion` |
| **Labels** | Product tiles include accessible price in aria-label |

**Focus styling note:** Default focus rings are replaced with gold underline, border accent, and background shifts — chosen to match the visual language while still meeting contrast and visibility goals.

---

## Responsive Behavior

| Breakpoint Behavior | Rationale |
|---------------------|-----------|
| **Header** | Full nav desktop; hamburger + full-screen menu mobile |
| **Dashboard sidebar** | Icons only on small screens; labels on large |
| **Products page** | Category panel stacks above list on mobile; side-by-side on desktop |
| **PDP** | Single column mobile; sticky purchase panel desktop |
| **Cart drawer** | Horizontal scroll suggestions on mobile; column layout desktop |

Touch targets (e.g. 44×44px hamburger) support mobile showroom use — customers browsing on phones in-store or at home.

---

## Performance as UX

| Choice | User Benefit |
|--------|--------------|
| **ISR / caching (60s)** | Fast page loads; catalog stays reasonably fresh |
| **Prefetch on product hover** | Snappier navigation to PDP |
| **Lazy-loaded charts** | Dashboard home loads without blocking |
| **Cart suggestions load on drawer open** | Faster initial page load |
| **Client-side filter/sort in admin** | Instant response after products load |
| **Font display: swap** | Text visible during font load |

**Rationale:** Performance choices are framed around **perceived speed** and **stable layouts**, not raw metrics alone.

---

## Key UX Decisions — Quick Reference

| Decision | What We Did | Why |
|----------|-------------|-----|
| Separate storefront and dashboard | Two shells, two nav models | Clear roles, less confusion |
| Categories inside Products page | 25/75 split below search | Task-specific browsing without cluttering global nav |
| URL-based filters | section, collection, q, sort in URL | Shareable, refresh-safe views |
| Sort replaces collection filter | Single sort dropdown | Sidebar already handles category filtering |
| Deactivate vs delete | Deactivate default; delete only when deactivated | Reversible mistakes; delete is explicit |
| Type DELETE to confirm | Modal with typed confirmation | Prevents accidental data loss |
| Activate = primary button | Amber CTA style | Highlights the main recovery action |
| Delete = red outline button | Same shape as Edit, red styling | Consistent layout, clear danger |
| No Feature on deactivated | Hidden on inactive rows | Prevents invalid featured state |
| Faint blur modals | Light backdrop, not dark overlay | Premium feel; context preserved |
| Appointment CTAs in header | Book Visit, phone visible | Matches high-touch retail model |

---

## Stakeholder Talking Points

### For Business Owners

"We designed the site like a showroom, not a warehouse. Shopping feels editorial; admin tools are simple and safe — staff can hide products without deleting them, and deletion requires explicit confirmation."

### For Designers

"One visual language across storefront and admin: warm ivory, gold accents, serif headlines. Admin uses the same button hierarchy — primary for constructive actions, outline for secondary, red outline for destructive."

### For Developers

"State lives in the URL where it matters. Layout splits are intentional: full-width discovery controls, then task-specific columns. Empty, loading, and error states are first-class."

---

*Woodley's Jewelers — User Experience Report — July 2026*
