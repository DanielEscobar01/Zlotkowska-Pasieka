-- schema.sql define las tablas, reglas y permisos PostgreSQL usados por el inventario de la app.
-- schema.sql definiuje tabele, reguły i uprawnienia PostgreSQL używane przez magazyn aplikacji.
-- product_id debe coincidir con products[].id en src/App.jsx; cada tamaño es una variante independiente.
-- product_id musi odpowiadać products[].id w src/App.jsx; każdy rozmiar jest osobnym wariantem.
-- price es el precio normal; promo_price y promo_active guardan y controlan una oferta opcional.
-- price to cena regularna; promo_price i promo_active przechowują i włączają opcjonalną promocję.
-- CHECK protege la regla en la base: el stock nunca puede ser negativo.
-- CHECK chroni regułę w bazie: stan magazynowy nigdy nie może być ujemny.
create table if not exists public.product_inventory (
  -- Clave principal: identifica la variante y enlaza con products[].id en React.
  -- Klucz główny: identyfikuje wariant i łączy go z products[].id w React.
  product_id integer primary key,
  -- Cantidad disponible; CHECK rechaza valores negativos directamente en PostgreSQL.
  -- Dostępna ilość; CHECK odrzuca wartości ujemne bezpośrednio w PostgreSQL.
  stock integer not null check (stock >= 0),
  -- Precio habitual en moneda decimal; DEFAULT sirve de respaldo para nuevas filas.
  -- Zwykła cena dziesiętna; DEFAULT jest wartością zapasową dla nowych wierszy.
  price numeric(10, 2) not null default 0
    constraint product_inventory_price_nonnegative check (price >= 0),
  -- Precio de oferta opcional; NULL significa que todavía no se configuró una promoción.
  -- Opcjonalna cena promocyjna; NULL oznacza, że nie ustawiono jeszcze promocji.
  promo_price numeric(10, 2)
    constraint product_inventory_promo_price_nonnegative check (promo_price is null or promo_price >= 0),
  -- Interruptor persistente; inicia apagado para que ninguna oferta se publique por accidente.
  -- Trwały przełącznik; domyślnie wyłączony, aby oferta nie została włączona przypadkowo.
  promo_active boolean not null default false,
  -- Regla de base de datos: una oferta activa necesita precio y debe ser menor al normal.
  -- Reguła bazy: aktywna promocja wymaga ceny niższej od regularnej.
  constraint product_inventory_active_promo_valid
    check (not promo_active or (promo_price is not null and promo_price < price)),
  -- Fecha de última escritura; Supabase la actualiza desde el cliente al guardar.
  -- Data ostatniego zapisu; klient Supabase aktualizuje ją podczas zapisu.
  updated_at timestamptz not null default now()
);

-- Añade precio a instalaciones existentes sin borrar ni reiniciar filas actuales.
-- Dodaje cenę do istniejących instalacji bez usuwania ani resetowania obecnych wierszy.
alter table public.product_inventory
  add column if not exists price numeric(10, 2);
-- promo_price es null cuando nunca se configuró una oferta; promo_active evita mostrarla hasta activarla.
-- promo_price ma wartość null, gdy nie ustawiono oferty; promo_active ukrywa ją do czasu aktywacji.
alter table public.product_inventory
  add column if not exists promo_price numeric(10, 2);
-- Añade el interruptor a tablas previas y establece promociones antiguas como apagadas.
-- Dodaje przełącznik do starszych tabel i pozostawia istniejące promocje wyłączone.
alter table public.product_inventory
  add column if not exists promo_active boolean not null default false;

-- Auth almacena usuarios y contraseñas; esta tabla guarda únicamente los UUID autorizados.
-- Auth przechowuje użytkowników i hasła; ta tabela zapisuje wyłącznie uprawnione UUID.
create table if not exists public.inventory_admins (
  -- UUID viene de auth.users; borrar una cuenta también quita su autorización.
  -- UUID pochodzi z auth.users; usunięcie konta usuwa również jego uprawnienia.
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- RLS evalúa políticas en PostgreSQL para cada consulta, aunque alguien manipule el cliente web.
-- RLS sprawdza polityki w PostgreSQL dla każdego zapytania, nawet gdy ktoś zmieni klienta webowego.
alter table public.product_inventory enable row level security;
alter table public.inventory_admins enable row level security;

-- Esta función compara el UUID de la sesión Auth actual con la lista de administradores.
-- Ta funkcja porównuje UUID bieżącej sesji Auth z listą administratorów.
-- SECURITY DEFINER consulta la lista protegida; el search_path fijo reduce la resolución de objetos inesperados.
-- SECURITY DEFINER odczytuje chronioną listę; stały search_path ogranicza ryzyko użycia nieoczekiwanych obiektów.
create or replace function public.is_inventory_admin()
-- returns boolean define que la consulta devuelve un sí/no, no filas de la tabla.
-- returns boolean określa, że zapytanie zwraca tak/nie, a nie wiersze tabeli.
returns boolean
-- language sql declara que el cuerpo de la función es una consulta SQL.
-- language sql określa, że ciało funkcji jest zapytaniem SQL.
language sql
-- stable indica que la respuesta no cambia dentro de una misma consulta.
-- stable oznacza, że wynik nie zmienia się w trakcie jednego zapytania.
stable
-- security definer ejecuta la función con permisos de su propietaria para leer la lista protegida.
-- security definer uruchamia funkcję z uprawnieniami właściciela, aby odczytać chronioną listę.
security definer
-- Limita dónde PostgreSQL busca objetos llamados dentro de esta función.
-- Ogranicza miejsce, w którym PostgreSQL szuka obiektów używanych przez tę funkcję.
set search_path = public
as $$
  -- EXISTS devuelve true si el UUID de la sesión actual aparece entre los administradores.
  -- EXISTS zwraca true, gdy UUID bieżącej sesji znajduje się na liście administratorów.
  select exists (
    -- Lee la lista privada de administradores, no las contraseñas de Auth.
    -- Odczytuje prywatną listę administratorów, a nie hasła Auth.
    select 1
    from public.inventory_admins
    where user_id = auth.uid()
  );
$$;

-- Solo usuarios autenticados pueden ejecutar la comprobación; las políticas llaman a esta función.
-- Tylko zalogowani użytkownicy mogą wykonać sprawdzenie; polityki korzystają z tej funkcji.
revoke all on function public.is_inventory_admin() from public;
grant execute on function public.is_inventory_admin() to authenticated;

-- SELECT público permite que el catálogo muestre disponibilidad sin iniciar sesión.
-- Publiczny SELECT pozwala katalogowi pokazywać dostępność bez logowania.
drop policy if exists "Anyone can read inventory" on public.product_inventory;
-- SELECT es público para que catálogo anónimo y administrador vean stock y precios.
-- SELECT jest publiczny, aby katalog anonimowy i administrator widzieli zapasy oraz ceny.
create policy "Anyone can read inventory"
  -- Aplica la regla a lecturas de filas para los roles anon y authenticated.
  -- Stosuje regułę do odczytu wierszy dla ról anon i authenticated.
  on public.product_inventory for select
  -- Enumera qué roles pueden leer, además de necesitar GRANT.
  -- Wskazuje role mogące czytać, oprócz wymaganego GRANT.
  to anon, authenticated
  -- Condición por fila; true permite la lectura pública de todo el inventario.
  -- Warunek dla każdego wiersza; true pozwala publicznie odczytać cały magazyn.
  using (true);

-- INSERT requiere Auth y un UUID incluido en inventory_admins.
-- INSERT wymaga Auth i UUID znajdującego się w inventory_admins.
drop policy if exists "Admins can add inventory" on public.product_inventory;
-- INSERT protege la creación de filas nuevas en el inventario.
-- INSERT chroni dodawanie nowych wierszy do magazynu.
create policy "Admins can add inventory"
  -- Vincula la regla con inserciones en la tabla product_inventory.
  -- Łączy regułę z dodawaniem wierszy do product_inventory.
  on public.product_inventory for insert
  -- El usuario debe tener una sesión autenticada.
  -- Użytkownik musi mieć uwierzytelnioną sesję.
  to authenticated
  -- Evalúa el permiso con la fila nueva que se intenta insertar.
  -- Sprawdza uprawnienia dla nowego wiersza przeznaczonego do dodania.
  with check (public.is_inventory_admin());

-- UPDATE valida la fila existente con USING y el nuevo valor con WITH CHECK.
-- UPDATE sprawdza istniejący wiersz przez USING i nową wartość przez WITH CHECK.
drop policy if exists "Admins can update inventory" on public.product_inventory;
-- UPDATE protege cambios en filas que ya existen.
-- UPDATE chroni zmiany w istniejących wierszach.
create policy "Admins can update inventory"
  -- Esta política protege UPDATE, no lecturas ni inserciones.
  -- Ta polityka chroni UPDATE, a nie odczyt ani dodawanie.
  on public.product_inventory for update
  -- Solo evalúa sesiones autenticadas.
  -- Ocenia wyłącznie zalogowane sesje.
  to authenticated
  -- Comprueba autorización antes de permitir editar la fila actual.
  -- Sprawdza uprawnienia przed edycją obecnego wiersza.
  using (public.is_inventory_admin())
  -- Vuelve a comprobar autorización con el contenido nuevo de la fila.
  -- Ponownie sprawdza uprawnienia dla nowej zawartości wiersza.
  with check (public.is_inventory_admin());

-- DELETE también se limita al administrador para impedir borrados desde el catálogo público.
-- DELETE jest ograniczony do administratora, aby uniemożliwić usuwanie z publicznego katalogu.
drop policy if exists "Admins can delete inventory" on public.product_inventory;
-- DELETE evita que el cliente público borre variantes o precios.
-- DELETE uniemożliwia publicznemu klientowi usuwanie wariantów lub cen.
create policy "Admins can delete inventory"
  -- Esta política protege borrados de filas existentes.
  -- Ta polityka chroni usuwanie istniejących wierszy.
  on public.product_inventory for delete
  -- Solo la sesión Auth puede solicitar el borrado.
  -- Usunięcia może żądać tylko sesja Auth.
  to authenticated
  -- Autoriza el borrado únicamente para el administrador registrado.
  -- Zezwala na usunięcie tylko zarejestrowanemu administratorowi.
  using (public.is_inventory_admin());

-- GRANT concede permisos SQL; las políticas RLS siguen decidiendo qué filas puede modificar cada rol.
-- GRANT nadaje uprawnienia SQL; polityki RLS nadal określają, które wiersze może zmieniać każda rola.
grant select on public.product_inventory to anon, authenticated;
-- Permite intentos de escritura solo al rol autenticado; RLS los valida después.
-- Pozwala próbować zapisu tylko roli authenticated; RLS sprawdza je później.
grant insert, update, delete on public.product_inventory to authenticated;

-- Carga inicial de 10 unidades y el precio actual de cada variante.
-- Początkowe 10 sztuk i bieżąca cena każdego wariantu.
insert into public.product_inventory (product_id, stock, price) values
  -- Cada tupla sigue el orden de columnas: ID, unidades y precio normal en zł.
  -- Każda krotka używa kolejności kolumn: ID, sztuki i cena regularna w zł.
  (1, 10, 40.00), (2, 10, 45.00), (3, 10, 45.00), (5, 10, 15.00),
  (6, 10, 20.00), (7, 10, 20.00), (8, 10, 20.00), (9, 10, 15.00),
  (10, 10, 30.00), (11, 10, 50.00), (12, 10, 50.00)
-- Si el ID ya existe, conserva stock y precio en vez de reiniciarlos.
-- Jeśli ID już istnieje, zachowuje stan i cenę zamiast je resetować.
on conflict (product_id) do nothing;

-- Rellena precios solo donde faltan; los precios que ya haya cambiado el administrador no se pisan.
-- Uzupełnia tylko brakujące ceny; ceny zmienione przez administratora nie są nadpisywane.
update public.product_inventory as inventory
-- Asigna el precio inicial solo a las filas cuyo precio todavía es NULL.
-- Ustawia cenę początkową tylko w wierszach, w których cena nadal ma wartość NULL.
set price = defaults.price
-- VALUES define la lista de precios iniciales por variante.
-- VALUES definiuje listę początkowych cen dla wariantów.
from (values
  (1, 40.00), (2, 45.00), (3, 45.00), (5, 15.00), (6, 20.00),
  (7, 20.00), (8, 20.00), (9, 15.00), (10, 30.00), (11, 50.00), (12, 50.00)
) as defaults(product_id, price)
-- Une filas por ID para no asignar el precio de otra variante.
-- Łączy wiersze po ID, aby nie przypisać ceny innego wariantu.
where inventory.product_id = defaults.product_id
  -- Solo rellena NULL y deja intactos los precios normales ya configurados.
  -- Uzupełnia tylko NULL i zachowuje ustawione wcześniej ceny regularne.
  and inventory.price is null;

-- Filas personalizadas sin precio reciben cero antes de exigir NOT NULL.
-- Niestandardowe wiersze bez ceny otrzymują zero przed ustawieniem NOT NULL.
update public.product_inventory set price = 0 where price is null;
-- DEFAULT proporciona respaldo a futuras filas si un INSERT omite price.
-- DEFAULT ustawia wartość zapasową dla nowych wierszy, gdy INSERT pominie price.
alter table public.product_inventory alter column price set default 0;
-- NOT NULL garantiza que las filas nuevas o existentes tengan un precio normal.
-- NOT NULL gwarantuje cenę regularną w nowych i istniejących wierszach.
alter table public.product_inventory alter column price set not null;

-- Garantiza la restricción también en tablas antiguas, sin duplicarla al repetir el script.
-- Zapewnia ograniczenie także w starszych tabelach i nie duplikuje go przy ponownym uruchomieniu.
do $$
begin
  -- DO ejecuta PL/pgSQL temporal para poder añadir constraints condicionalmente.
  -- DO uruchamia tymczasowy PL/pgSQL, aby warunkowo dodać ograniczenia.
  -- Consulta el catálogo de restricciones para que el script pueda ejecutarse repetidamente.
  -- Sprawdza katalog ograniczeń, aby skrypt można było uruchamiać wielokrotnie.
  -- IF NOT EXISTS evita volver a crear una regla que ya se instaló.
  -- IF NOT EXISTS zapobiega ponownemu tworzeniu już dodanej reguły.
  if not exists (
    -- pg_constraint contiene las reglas de integridad registradas en PostgreSQL.
    -- pg_constraint zawiera reguły integralności zapisane w PostgreSQL.
    select 1 from pg_constraint
    -- Busca por el nombre estable de la restricción.
    -- Wyszukuje po stałej nazwie ograniczenia.
    where conname = 'product_inventory_price_nonnegative'
      -- Verifica que el nombre pertenezca a product_inventory.
      -- Sprawdza, czy nazwa należy do product_inventory.
      and conrelid = 'public.product_inventory'::regclass
  ) then
    -- Añade CHECK para bases anteriores que todavía no tenían precio normal.
    -- Dodaje CHECK w starszych bazach, które nie miały jeszcze ceny regularnej.
    alter table public.product_inventory
      add constraint product_inventory_price_nonnegative check (price >= 0);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'product_inventory_promo_price_nonnegative'
      and conrelid = 'public.product_inventory'::regclass
  ) then
    -- Impide precios promocionales negativos; NULL sigue permitido.
    -- Blokuje ujemne ceny promocyjne; NULL nadal jest dozwolone.
    alter table public.product_inventory
      add constraint product_inventory_promo_price_nonnegative
      check (promo_price is null or promo_price >= 0);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'product_inventory_active_promo_valid'
      and conrelid = 'public.product_inventory'::regclass
  ) then
    -- Impide activar una oferta sin precio o con precio igual/superior al normal.
    -- Blokuje aktywację promocji bez ceny lub z ceną równą/wyższą od regularnej.
    alter table public.product_inventory
      add constraint product_inventory_active_promo_valid
      check (not promo_active or (promo_price is not null and promo_price < price));
  end if;
end;
$$;

-- Postgres Changes publica modificaciones para que las pestañas abiertas reciban actualizaciones en vivo.
-- Postgres Changes publikuje modyfikacje, aby otwarte karty otrzymywały aktualizacje na żywo.
-- La condición comprueba si la tabla ya está publicada antes de añadirla.
-- Warunek sprawdza, czy tabela jest już publikowana, zanim ją doda.
do $$
begin
  -- Consulta la publicación para evitar registrar dos veces la misma tabla.
  -- Sprawdza publikację, aby nie dodawać tej samej tabeli ponownie.
  if not exists (
    -- Cada filtro identifica una tabla concreta ya añadida a la publicación Realtime.
    -- Każdy filtr wskazuje konkretną tabelę już dodaną do publikacji Realtime.
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'product_inventory'
  ) then
    -- EXECUTE corre ALTER PUBLICATION solo si la comprobación anterior no encontró la tabla.
    -- EXECUTE uruchamia ALTER PUBLICATION tylko wtedy, gdy wcześniejsze sprawdzenie nie znalazło tabeli.
    execute 'alter publication supabase_realtime add table public.product_inventory';
  end if;
end;
$$;