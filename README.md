# Gift Fox

Gift Fox ecommerce website built with React, Vite, and Supabase.

## Frontend

```bash
cd client
npm install
npm run dev
```

Storefront: `http://localhost:5173/`
Admin panel: `http://localhost:5173/admin`

## Supabase Setup

1. Rotate any exposed `sb_secret...` key in Supabase Dashboard.
2. Open Supabase Dashboard > SQL Editor.
3. Run `supabase-schema.sql`.
4. In Supabase Dashboard > Authentication > Users, create this admin user:

```text
ziyasefereliyev211@gmail.com
```

5. Set a password for that user and use it at `/admin`.

## Environment

The client uses these Vite env variables:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_ADMIN_EMAIL=
```

Only the publishable key belongs in the frontend. Never place a Supabase secret key in the client app.
