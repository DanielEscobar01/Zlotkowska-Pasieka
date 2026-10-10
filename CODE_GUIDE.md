# Guía del código / Przewodnik po kodzie

## Español

### Cómo se conecta la aplicación

1. `index.html` contiene el nodo vacío `#root`.
2. `src/main.jsx` inicia React, importa el CSS global y monta `App` dentro de `HashRouter`.
3. `src/App.jsx` contiene las rutas, los productos, el carrito y el estado del inventario. Cada `products[].id` debe coincidir con `product_inventory.product_id` en `supabase/schema.sql`.
4. `src/i18n.js` reúne textos y traducciones. `App` selecciona un idioma y pasa sus textos a componentes como `LanguagePicker` y `HoneyJourney`.
5. `src/index.css` da estilos globales; `src/App.css` da estilos a componentes y páginas. CSS cambia la presentación, no los permisos ni los datos.

### Supabase: conceptos y recorrido del inventario

- **Supabase** es el servicio que reúne PostgreSQL, Auth y Realtime. `src/supabase.js` crea el cliente del navegador usando variables `VITE_*`.
- **Auth** es el servicio de autenticación. Guarda usuarios y verifica contraseñas; la app inicia sesión con el correo configurado y la contraseña. `witold` es solo el alias mostrado en el formulario.
- **`schema.sql`** es un conjunto de instrucciones SQL que crea tablas, reglas y permisos. Se ejecuta en el SQL Editor de Supabase; no es un archivo que React ejecute.
- **`product_inventory`** almacena una fila por variante con stock, precio normal y precio promocional opcional. `promo_active` controla si la oferta se aplica; el catálogo nunca cambia el precio normal.
- **`inventory_admins`** relaciona UUID de usuarios Auth con el permiso para administrar stock. No guarda contraseñas.
- **RLS (Row Level Security)** son reglas que PostgreSQL aplica a cada consulta para decidir qué filas puede leer o cambiar cada rol. Es la protección real del inventario; esconder botones en React no sustituye RLS.
- **`anon` / publishable key** identifica al cliente público y por eso aparece en el navegador. RLS debe limitar sus permisos. `service_role` omite protecciones y nunca debe incluirse en la app, en `.env.local` del frontend ni en GitHub Pages.
- **Realtime / Postgres Changes** envía avisos cuando cambia una fila. `App.jsx` carga el inventario al abrirse y luego escucha esos avisos para actualizar las pestañas abiertas.
- Los botones `+` y `−` y el campo numérico editan stock; otros campos editan el precio normal, la oferta y su activación. Los cambios quedan como borradores hasta confirmar.
- Una oferta solo afecta al catálogo cuando está activa y es menor que el precio normal. El precio aplicado también alimenta el carrito y el total del pedido.
- Confirmar envía todas las variantes pendientes juntas con un `upsert`; solo tras una respuesta correcta se actualizan stock, precios, promoción, carrito y total.
- Si no hay configuración Supabase, el modo local usa `localStorage` en ese navegador. Ese modo no comparte inventario con otras personas.

### Lectura paso a paso de `App.jsx`

1. La lista `products` es el catálogo estático: contiene IDs, variantes, fotos y precios de respaldo. Los IDs deben existir también en SQL.
2. El estado React separa datos confirmados (`inventory`, precios y promo) de borradores (`*Drafts`). Escribir no guarda todavía.
3. El efecto de Auth restaura la sesión y escucha login/logout. El alias visible `witold` se convierte al correo configurado para iniciar sesión.
4. El efecto de inventario hace un `SELECT` al abrir la app, convierte las filas por ID y se suscribe a cambios. Realtime actualiza las pestañas sin recargarlas.
5. `catalogProducts` calcula para cada variante el precio normal y, si la promoción está activa y es menor, el precio que se muestra y se cobra.
6. `cartItems` toma el precio efectivo del catálogo para calcular cada línea y el total; al bajar el stock también se limita el carrito abierto.
7. Los inputs guardan borradores. Las validaciones exigen stock entero no negativo, precios con centavos y oferta activa menor que el precio normal.
8. `saveInventoryChanges` reúne IDs modificados en un solo `upsert`. Solo aplica las nuevas cantidades, precios y activaciones a la interfaz tras una respuesta correcta.
9. Las políticas RLS vuelven a autorizar cada escritura en PostgreSQL; `isAdminAuthenticated` solo controla la interfaz y no es una barrera de seguridad.

### Responsabilidad de cada archivo

- `src/main.jsx`: inicia React y el enrutador.
- `src/App.jsx`: conecta rutas, productos, carrito, login e inventario.
- `src/supabase.js`: crea el cliente remoto o lo deja desactivado si faltan variables.
- `src/LanguagePicker.jsx` y `src/HoneyJourney.jsx`: componentes visuales; reciben datos/textos desde `App`.
- `src/i18n.js`: etiquetas de interfaz por idioma; todas las traducciones comparten las mismas claves.
- `src/index.css` y `src/App.css`: reglas globales y visuales. No deciden permisos ni guardan datos.
- `supabase/schema.sql`: crea y migra tablas, restricciones, RLS, filas iniciales y publicación Realtime.
- `.github/workflows/deploy.yml`: compila y publica `dist` cuando hay push a `main`.
- `vite.config.js` y `eslint.config.js`: configuran desarrollo/compilación y revisiones estáticas.
- `index.html`: contenedor inicial de React y metadatos básicos.
- `package.json` y `package-lock.json`: describen dependencias/comandos y fijan versiones; JSON no admite comentarios válidos.

### SQL y controles de acceso

- `product_inventory.stock` tiene una restricción `CHECK` para rechazar cantidades negativas incluso si se omite la interfaz.
- `product_inventory.price` guarda el precio de venta y tiene una restricción para no aceptar importes negativos.
- `promo_price` puede ser nulo; `promo_active` inicia en falso. PostgreSQL impide activar una oferta sin precio o con un precio igual o mayor que el normal.
- `is_inventory_admin()` compara el UUID de la sesión Auth con `inventory_admins`; las políticas de escritura llaman a esta función.
- La política de lectura permite mostrar existencias en el catálogo sin iniciar sesión. Las políticas de `INSERT`, `UPDATE` y `DELETE` requieren un administrador.
- `GRANT` permite a un rol intentar una operación SQL; RLS todavía decide qué filas puede tocar.
- El bloque `INSERT ... ON CONFLICT DO NOTHING` crea 10 unidades iniciales sin reiniciar cantidades al volver a ejecutar el script.
- La publicación `supabase_realtime` habilita los avisos de cambios para `product_inventory`.

### Configuración y publicación

- `.env.example` es una plantilla sin credenciales. `.env.local` contiene valores locales y está ignorado por Git.
- `vite.config.js` define el subdirectorio de GitHub Pages y activa el plugin de React.
- `.github/workflows/deploy.yml` instala dependencias, compila Vite con variables públicas del repositorio y publica `dist`. Una compilación de frontend no debe recibir `service_role`.
- `package.json` define dependencias y comandos; `package-lock.json` fija versiones exactas. Son JSON, un formato que no admite comentarios válidos; esta guía explica su función sin romperlos.
- Las imágenes son archivos binarios y tampoco admiten comentarios de código. Sus nombres y usos se relacionan desde los componentes React.

## Polski

### Jak aplikacja jest połączona

1. `index.html` zawiera pusty element `#root`.
2. `src/main.jsx` uruchamia React, importuje globalny CSS i montuje `App` wewnątrz `HashRouter`.
3. `src/App.jsx` zawiera trasy, produkty, koszyk i stan zapasów. Każde `products[].id` musi odpowiadać `product_inventory.product_id` w `supabase/schema.sql`.
4. `src/i18n.js` przechowuje teksty i tłumaczenia. `App` wybiera język i przekazuje teksty do komponentów takich jak `LanguagePicker` i `HoneyJourney`.
5. `src/index.css` ustawia style globalne; `src/App.css` style komponentów i stron. CSS zmienia wygląd, a nie uprawnienia ani dane.

### Supabase: pojęcia i przepływ zapasów

- **Supabase** to usługa łącząca PostgreSQL, Auth i Realtime. `src/supabase.js` tworzy klienta przeglądarki ze zmiennych `VITE_*`.
- **Auth** to usługa uwierzytelniania. Przechowuje użytkowników i weryfikuje hasła; aplikacja loguje się skonfigurowanym e-mailem i hasłem. `witold` to tylko alias widoczny w formularzu.
- **`schema.sql`** to zestaw instrukcji SQL tworzących tabele, reguły i uprawnienia. Uruchamia się go w SQL Editor Supabase; React nie wykonuje tego pliku.
- **`product_inventory`** przechowuje jeden wiersz na wariant ze stanem, ceną regularną i opcjonalną ceną promocyjną. `promo_active` steruje ofertą; katalog nie zmienia ceny regularnej.
- **`inventory_admins`** łączy UUID użytkowników Auth z uprawnieniem do zarządzania zapasami. Nie przechowuje haseł.
- **RLS (Row Level Security)** to reguły stosowane przez PostgreSQL do każdego zapytania, które określają, jakie wiersze rola może odczytać lub zmienić. To właściwa ochrona zapasów; ukrycie przycisków w React jej nie zastępuje.
- **Klucz `anon` / publishable** identyfikuje publicznego klienta, dlatego znajduje się w przeglądarce. Uprawnienia ogranicza RLS. `service_role` omija zabezpieczenia i nigdy nie może znaleźć się w aplikacji, frontendowym `.env.local` ani w GitHub Pages.
- **Realtime / Postgres Changes** wysyła powiadomienia o zmianie wiersza. `App.jsx` pobiera zapasy po otwarciu, a następnie nasłuchuje powiadomień i aktualizuje otwarte karty.
- Przyciski `+` i `−` oraz pole liczbowe zmieniają stan; pozostałe pola edytują cenę regularną, ofertę i jej aktywację. Zmiany pozostają szkicami do potwierdzenia.
- Oferta wpływa na katalog tylko wtedy, gdy jest aktywna i niższa od ceny regularnej. Zastosowana cena trafia również do koszyka i sumy zamówienia.
- Potwierdzenie wysyła wszystkie oczekujące warianty razem przez `upsert`; po udanej odpowiedzi aktualizowane są zapasy, ceny, promocja, koszyk i suma.
- Bez konfiguracji Supabase tryb lokalny używa `localStorage` w tej przeglądarce. Nie współdzieli zapasów z innymi osobami.

### Krok po kroku: `App.jsx`

1. Lista `products` to statyczny katalog: zawiera ID, warianty, zdjęcia i ceny zapasowe. ID muszą istnieć również w SQL.
2. Stan React oddziela dane potwierdzone (`inventory`, ceny i promocje) od szkiców (`*Drafts`). Wpisanie wartości jeszcze jej nie zapisuje.
3. Efekt Auth przywraca sesję i nasłuchuje logowania/wylogowania. Widoczny alias `witold` jest mapowany na skonfigurowany e-mail.
4. Efekt magazynu wykonuje `SELECT` po otwarciu aplikacji, mapuje wiersze po ID i subskrybuje zmiany. Realtime aktualizuje karty bez przeładowania.
5. `catalogProducts` wylicza cenę regularną i, gdy promocja jest aktywna oraz niższa, cenę wyświetlaną i pobieraną.
6. `cartItems` używa aktualnej ceny katalogowej do obliczenia linii i sumy; po zmniejszeniu zapasu ogranicza też otwarty koszyk.
7. Pola zapisują szkice. Walidacja wymaga nieujemnej liczby całkowitej dla zapasu, ceny z groszami i aktywnej oferty niższej od regularnej.
8. `saveInventoryChanges` łączy zmienione ID w jednym `upsert`. Nowe wartości trafiają do interfejsu dopiero po udanej odpowiedzi.
9. Polityki RLS ponownie autoryzują każdy zapis w PostgreSQL; `isAdminAuthenticated` steruje tylko interfejsem i nie jest zabezpieczeniem bazy.

### Rola każdego pliku

- `src/main.jsx`: uruchamia React i router.
- `src/App.jsx`: łączy trasy, produkty, koszyk, logowanie i zapasy.
- `src/supabase.js`: tworzy klienta zdalnego albo go wyłącza, jeśli brakuje zmiennych.
- `src/LanguagePicker.jsx` i `src/HoneyJourney.jsx`: komponenty wizualne otrzymujące dane i teksty z `App`.
- `src/i18n.js`: etykiety interfejsu dla języków; wszystkie tłumaczenia mają te same klucze.
- `src/index.css` i `src/App.css`: style globalne i wizualne. Nie decydują o uprawnieniach ani nie zapisują danych.
- `supabase/schema.sql`: tworzy i migruje tabele, ograniczenia, RLS, dane początkowe i publikację Realtime.
- `.github/workflows/deploy.yml`: buduje i publikuje `dist` po pushu do `main`.
- `vite.config.js` i `eslint.config.js`: konfigurują programowanie/budowanie i statyczne kontrole.
- `index.html`: początkowy kontener React i podstawowe metadane.
- `package.json` i `package-lock.json`: opisują zależności/polecenia i przypinają wersje; JSON nie obsługuje poprawnych komentarzy.

### SQL i kontrola dostępu

- `product_inventory.stock` ma ograniczenie `CHECK`, które odrzuca ujemne ilości także przy pominięciu interfejsu.
- `product_inventory.price` przechowuje cenę sprzedaży i ma ograniczenie odrzucające wartości ujemne.
- `promo_price` może mieć wartość null; `promo_active` domyślnie ma wartość false. PostgreSQL nie pozwala aktywować oferty bez ceny ani z ceną równą lub wyższą od regularnej.
- `is_inventory_admin()` porównuje UUID sesji Auth z `inventory_admins`; polityki zapisu wywołują tę funkcję.
- Polityka odczytu pozwala katalogowi pokazywać zapasy bez logowania. Polityki `INSERT`, `UPDATE` i `DELETE` wymagają administratora.
- `GRANT` pozwala roli próbować wykonać operację SQL; RLS nadal decyduje, które wiersze może zmienić.
- `INSERT ... ON CONFLICT DO NOTHING` tworzy początkowe 10 sztuk i nie resetuje ich przy ponownym uruchomieniu skryptu.
- Publikacja `supabase_realtime` włącza powiadomienia o zmianach `product_inventory`.

### Konfiguracja i publikacja

- `.env.example` to szablon bez danych dostępowych. `.env.local` zawiera wartości lokalne i jest ignorowany przez Git.
- `vite.config.js` ustawia podkatalog GitHub Pages i włącza wtyczkę React.
- `.github/workflows/deploy.yml` instaluje zależności, buduje Vite z publicznymi zmiennymi repozytorium i publikuje `dist`. Kompilacja frontendu nie może otrzymać `service_role`.
- `package.json` definiuje zależności i polecenia; `package-lock.json` przypina dokładne wersje. To JSON, który nie obsługuje poprawnych komentarzy; ta instrukcja opisuje ich rolę bez psucia plików.
- Obrazy są plikami binarnymi i również nie obsługują komentarzy kodu. Komponenty React określają ich nazwy i zastosowanie.