# Utrecht Symposium Registration Form

Multi-language registration form for the Utrecht Symposium on Educational Inequality and Language Power.

## Features

- 🌍 4 language support (Dutch, English, Arabic, Turkish)
- 📝 Clean, responsive form design with shadcn/ui
- 💾 Supabase integration for data storage
- 📧 Email notifications for new registrations
- 📊 Real-time responses dashboard
- 📥 CSV export functionality
- 🔄 Real-time updates using Supabase subscriptions

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the script in `supabase-setup.sql`
3. Copy your project URL and anon key from Settings > API

### 2. Environment Variables

Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NOTIFICATION_EMAIL=admin@example.com
RESEND_API_KEY=your_resend_api_key (optional, for email notifications)
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

## Pages

- `/` - Registration form (supports 4 languages)
- `/responses` - Admin dashboard to view all registrations

## Email Notifications

To enable email notifications:

1. Sign up for [Resend](https://resend.com)
2. Get your API key
3. Add it to `.env.local`
4. Update the notification email address

## Language Support

The form automatically detects RTL languages (Arabic) and adjusts the layout accordingly. Users can switch languages using the language selector in the top-right corner.

## Customization

- Translations: Edit files in `/src/translations/`
- Styling: Modify Tailwind classes in components
- Form fields: Update `/src/components/symposium-form.tsx`