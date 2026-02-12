# Nairobi School Chronicles

Official site for **Nairobi School Alumni Association** — documenting over 120 years of excellence and building the commemorative book. *To The Uttermost.* Est. 1902.

## Tech stack

- Vite, TypeScript, React
- React Router, Supabase (auth + database)
- Tailwind CSS, shadcn/ui, Framer Motion

## Run locally

```sh
npm i
npm run dev
```

## Build

```sh
npm run build
```

## Admin dashboard

The admin area uses **Supabase Auth** and **RLS**. Only users with the `admin` role can read questionnaire responses.

1. **Create an admin user** in Supabase: Authentication → Users → Add user (e.g. `admin@nairobischool.com`).
2. **Grant the admin role** in SQL Editor (replace `USER_UUID` with the user’s id):

   ```sql
   INSERT INTO public.user_roles (user_id, role) VALUES ('USER_UUID', 'admin');
   ```

3. Sign in at `/admin` with that account.

## Images

Campus images are from [Wikimedia Commons — Nairobi School, Kenya](https://commons.wikimedia.org/wiki/Category:Nairobi_School,_Kenya) (CC BY-SA 4.0). Replace `public/impala-logo.png` and `public/favicon.ico` with official school assets if you have them.
