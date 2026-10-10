# Supabase inventory setup

This app can use Supabase Auth, Postgres, and Realtime from GitHub Pages. The browser uses only the publishable/anon key; never put the `service_role` key in the frontend.

## Create Witold's admin account

1. In Authentication → Users, create the admin Auth user with an email you control and a strong password. Disable public sign-ups. The app displays the login name `witold` and maps it to the configured admin email.
2. In the Supabase SQL editor, run the current `supabase/schema.sql`. It seeds 10 units and catalog prices per variant, and adds `promo_price` plus `promo_active`. If you ran an older version before prices or promotions were added, run the updated script again: it adds missing columns and fills only missing values without overwriting existing stock or edited prices. Promotions start inactive.
3. Authorize only that Auth user by replacing the email below with the Auth email you created:

   ```sql
   insert into public.inventory_admins (user_id)
   select id from auth.users where email = 'WITOLD_EMAIL_HERE'
   on conflict (user_id) do nothing;
   ```

4. The app's login screen accepts username `witold` and the password created in step 1. The email is configured as `VITE_SUPABASE_ADMIN_EMAIL`. Never use `zloci` or put the password in source code.

## Connect the app

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_SUPABASE_ADMIN_EMAIL` from the Supabase project settings. Ensure the `public` schema is exposed to the Data API; the SQL grants and RLS policies still restrict table access.
3. Restart `npm run dev` and open `/#/admin`.
4. For GitHub Pages, add those three values as GitHub Actions repository variables and pass them to the build step in `.github/workflows/deploy.yml`.

Stock, regular price, and promotion settings are shared by product ID (each size is a separate product) and update in open catalog tabs through Realtime. A promotion must be active and have a price below the regular price to affect the catalog. Local development continues to use localStorage if Supabase variables are absent.