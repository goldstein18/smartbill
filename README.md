# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/3d5dad45-e7e5-4709-ae86-8a765c004b57

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3d5dad45-e7e5-4709-ae86-8a765c004b57) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Copy environment variables template
cp .env.example .env

# Step 5: Edit .env file and add your Supabase credentials
# Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

# Step 6: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Backend & Database)
- Stripe (Payments)

## Environment Variables Configuration

This project requires environment variables to be configured. Copy `.env.example` to `.env` and fill in your values.

### Frontend Variables (Vercel/Lovable)

Configure these in your hosting platform (Vercel, Railway, or Lovable):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key
- `VITE_DESKTOP_TRACKER_DOWNLOAD_URL` - (Optional) URL for desktop tracker installer

**How to configure:**

#### Vercel:
1. Go to your project settings → Environment Variables
2. Add each variable with the `VITE_` prefix
3. Redeploy your application

#### Railway:
1. Go to your project → Variables tab
2. Add each variable with the `VITE_` prefix
3. Redeploy your service

#### Lovable:
1. Go to Project → Settings → Environment Variables
2. Add each variable with the `VITE_` prefix
3. The changes will be applied automatically

### Backend Variables (Supabase Edge Functions)

Configure these in Supabase Dashboard:

1. Go to your Supabase project → Settings → Edge Functions → Secrets
2. Add the following secrets:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (keep this secret!)
   - `STRIPE_SECRET_KEY` - Your Stripe secret key

**Important Security Notes:**
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- The service role key bypasses Row Level Security (RLS)
- Use Edge Functions for operations requiring service role access

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3d5dad45-e7e5-4709-ae86-8a765c004b57) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
