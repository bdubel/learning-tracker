# Learning Tracker

A mastery-based learning path tracker built with Next.js, Supabase, and shadcn/ui. Track your progress through structured learning paths with deadline tracking and progression requirements.

## Features

- **Mastery-Based Progression**: Sections are locked until all progression requirements are completed
- **Weekly Agenda**: See what's due this week at a glance
- **Visual Progress Tracking**: Progress bars and completion indicators throughout
- **Collapsible Units**: Organize learning paths into units and sections
- **Topics & Requirements**: Track learning items and mastery criteria separately
- **Deadline Management**: Clear visibility of upcoming deadlines and overdue items

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase (PostgreSQL)
- **UI**: shadcn/ui + Tailwind CSS
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Supabase CLI

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bdubel/learning-tracker.git
cd learning-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a Supabase project:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to be provisioned

4. Link your Supabase project:
```bash
supabase link --project-ref your-project-ref
```

5. Push the database schema:
```bash
supabase db push
```

6. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

7. Run the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

The application uses the following main tables:

- **learning_paths**: Top-level learning paths
- **units**: Groupings of sections within a path
- **sections**: Individual learning sections with deadlines
- **topics**: Learning items to track
- **progression_requirements**: Mastery criteria that gate progression
- **user_*_progress**: User progress tracking tables

## Importing Data

To import the Applied Geography learning path:

```bash
npm run import:geography
```

This script reads the Obsidian markdown files and populates the database.

## Development

### Adding New Components

```bash
npx shadcn@latest add <component-name>
```

### Database Migrations

Create a new migration:
```bash
supabase migration new <migration-name>
```

Apply migrations:
```bash
supabase db push
```

## Deployment

### Deploy to Vercel

1. Push to GitHub (already done)

2. Import the project in Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables (Supabase URL and key)
   - Deploy

3. Your app will be live at `https://your-app.vercel.app`

## Project Structure

```
learning-tracker/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Dashboard/home page
│   ├── path/[id]/         # Learning path detail pages
│   └── section/[id]/      # Section detail pages
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   └── supabase.ts       # Supabase client
├── supabase/             # Supabase configuration
│   └── migrations/       # Database migrations
├── types/                # TypeScript types
│   └── database.ts       # Database schema types
└── scripts/              # Utility scripts
    └── import-geography.ts  # Data import script
```

## License

MIT

## Generated with Claude Code

This project was generated with [Claude Code](https://claude.com/claude-code).
