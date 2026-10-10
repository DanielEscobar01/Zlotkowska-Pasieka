import { createClient } from "@supabase/supabase-js";

// URL identifica el proyecto y la clave publishable/anon identifica al cliente público del navegador.
// URL identyfikuje projekt, a klucz publishable/anon identyfikuje publicznego klienta przeglądarki.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se crea el cliente solo si hay configuración; si no, App usa localStorage como modo local de desarrollo.
// Klient powstaje tylko przy dostępnej konfiguracji; w przeciwnym razie App używa localStorage.
// La clave anon es pública por diseño: RLS limita sus permisos. Nunca reemplazarla por service_role.
// Klucz anon jest z założenia publiczny: RLS ogranicza jego uprawnienia. Nigdy nie zastępować go service_role.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// La interfaz admite esta cuenta; las políticas RLS en PostgreSQL son la protección real de las escrituras.
// Interfejs dopuszcza to konto; polityki RLS w PostgreSQL są właściwą ochroną zapisów.
export const supabaseAdminEmail = import.meta.env.VITE_SUPABASE_ADMIN_EMAIL ?? "";