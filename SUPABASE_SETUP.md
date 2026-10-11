# Supabase inventory setup

This app can use Supabase Auth, Postgres, and Realtime from GitHub Pages. The browser uses only the publishable/anon key; never put the `service_role` key in the frontend.

## Create Witold's admin account

1. In Authentication → Users, create the admin Auth user with an email you control and a strong password. Disable public sign-ups. The app displays the login name `witold` and maps it to the configured admin email.
2. In the Supabase SQL editor, run the current `supabase/schema.sql`. It seeds 10 units and catalog prices per variant, and adds `promo_price` plus `promo_active`. If you ran an older version before prices or promotions were added, run the updated script again: it adds missing columns and fills only missing values without overwriting existing stock or edited prices. Promotions start inactive.
3. Add order history: open **SQL Editor → New query** in Supabase, copy the complete contents of [`supabase/orders_migration.sql`](supabase/orders_migration.sql), paste them into the editor, and click **Run**. This creates the order and item tables, the transactional order-creation function, and admin-only read/update policies. It is safe to run again. Do this before deploying the matching frontend.
4. Authorize only that Auth user by replacing the email below with the Auth email you created:

   ```sql
   insert into public.inventory_admins (user_id)
   select id from auth.users where email = 'WITOLD_EMAIL_HERE'
   on conflict (user_id) do nothing;
   ```

5. The app's login screen accepts username `witold` and the password created in step 1. The email is configured as `VITE_SUPABASE_ADMIN_EMAIL`. Never use `zloci` or put the password in source code.

## Connect the app

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_SUPABASE_ADMIN_EMAIL` from the Supabase project settings. Ensure the `public` schema is exposed to the Data API; the SQL grants and RLS policies still restrict table access.
3. Restart `npm run dev` and open `/#/admin`.
4. For GitHub Pages, add those three values as GitHub Actions repository variables and pass them to the build step in `.github/workflows/deploy.yml`.

Stock, regular price, and promotion settings are shared by product ID (each size is a separate product) and update in open catalog tabs through Realtime. A promotion must be active and have a price below the regular price to affect the catalog. Local development continues to use localStorage if Supabase variables are absent.

Customer orders are saved before WhatsApp or SMS opens. Supabase calculates the sale price from the current inventory row and stores regular price, sale price, and whether a promotion applied on every order item. Only an inventory admin can read order/customer data or update the delivered status. Orders do not automatically reduce stock; Witold confirms and fulfils them from the admin panel.