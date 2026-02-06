# Pinterest Pin Generation MVP - Implementation Plan

## 1. Project Overview
A private web application to automate Pinterest pin creation and scheduling. It uses AI to analyze images and generate SEO-optimized pin content.

## 2. Technical Stack
- **Framework**: Next.js 15+ (App Router)
- **Database/Auth**: Supabase
- **AI**: OpenAI GPT-4o-mini (Vision for analysis)
- **Styling**: Tailwind CSS + Shadcn UI
- **Deployment**: Vercel (planned)

## 3. Database Schema (Supabase)

### `assets` table
- `id`: uuid (primary key)
- `created_at`: timestamp
- `image_url`: text (link to storage)
- `analysis`: jsonb (AI analysis results: niche, keywords, description)
- `status`: text (analyzing, ready, scheduled, posted)

### `pins` table
- `id`: uuid (primary key)
- `asset_id`: uuid (references assets.id)
- `type`: text (SEO, Buyer Intent, Curiosity)
- `title`: text
- `description`: text
- `destination_url`: text
- `created_at`: timestamp

### `schedule` table
- `id`: uuid (primary key)
- `pin_id`: uuid (references pins.id)
- `scheduled_at`: timestamp
- `is_posted`: boolean

## 4. Feature Implementation Roadmap

### Phase 1: Foundation & UI
- [ ] Set up Supabase project and database schema.
- [ ] Create basic Layout with Navigation and Sidebar.
- [ ] Implement a "Premium" dashboard UI using Shadcn.

### Phase 2: Upload & AI Analysis
- [ ] Implement image upload to Supabase Storage.
- [ ] Create AI analysis service (OpenAI Vision).
- [ ] Display analysis results in the UI.

### Phase 3: Pin Generation
- [ ] Implement the "3 Variants" generation logic:
    - **SEO**: Keyword-rich, informative.
    - **Buyer Intent**: Focus on benefits and call-to-action.
    - **Curiosity**: Hook-driven, click-worthy.
- [ ] Create the "Manual Share" workflow (One-click copy).

### Phase 4: Scheduling
- [ ] Implement a scheduling calendar/list view (5-day planning).
- [ ] Add ability to mark pins as "Posted".

## 5. Next Steps
1.  **Initialize Supabase Client**: Set up the connection in `src/lib/supabase.ts`.
2.  **Define Types**: Create TypeScript interfaces for our data models.
3.  **Build Upload Component**: Start with the core functionality.
