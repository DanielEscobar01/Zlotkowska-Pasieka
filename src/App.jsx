import { useEffect, useRef, useState } from "react";
import { siWhatsapp } from "simple-icons";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

// Import the stylesheet used by the application.
// Importujemy arkusz stylów używany przez aplikację.
import "./App.css";
import { LANGUAGES, LANGUAGE_NAMES_PL, translations } from "./i18n";
import LanguagePicker from "./LanguagePicker";
import HoneyJourney from "./HoneyJourney";
import { supabase, supabaseAdminEmail } from "./supabase";

// Import the local images from the src/assets folder.
// Importujemy lokalne obrazy z folderu src/assets.
import MiodPiwnica from "./assets/MiodPiwnica.webp";
import ZlotkowskaPasiekaLogo from "./assets/ZlotkowskaPasiekaLogo.webp";
import HoneyAcaciaFacelia12 from "./assets/MiodAkacjowoFaceliowy1200g.webp";
import HoneyFacelia038 from "./assets/MiodFaceliowy380g.webp";
import HoneyFacelia12 from "./assets/MiodFaceliowy1200g.webp";
import HoneyLinden038 from "./assets/MiodLipowy380g.webp";
import HoneyMultifloral038 from "./assets/MiodWielokwiatowy380g.webp";
import HoneyRapeseed038 from "./assets/MiodRzepakowy380g.webp";
import HoneyRapeseed12 from "./assets/MiodRzepakowy1200g.webp";
import HerbalHoney038 from "./assets/Ziolomiod380g.webp";
import BeePollen from "./assets/PylekPszczeli500g.webp";
import GiftSetThreeHoneys from "./assets/ZestawPrezentowy3Miody380g.webp";
import GiftSetTwoHoneysAndPollen from "./assets/ZestawPrezentowy2MiodyPylek.webp";
import ProcessApiary from "./assets/Proces0Pasieka.webp";
import ProcessHoneyExtraction from "./assets/Proces1WirowanieMiodu.webp";
import ProcessHoneycombFrames from "./assets/Proces2PlastryWRamkach.webp";
import ProcessFilteredHoney from "./assets/Proces4MiodPoEkstrakcji.webp";
import ProcessFilledJars from "./assets/Proces5GotoweSloiki.webp";
import HoneyJarsOnTable from "./assets/SloikiZMiodemNaStole.webp";
import HoneyVarieties from "./assets/OdmianyMioduWSloikach.webp";
import ProcessPreparedComb from "./assets/Proces3DojrzalyPlaster.webp";


const GIFT_BOX_PRICE = 5;
const LOCAL_INVENTORY_KEY = "zlotkowska-local-inventory";
const LOCAL_PRICES_KEY = "zlotkowska-local-prices";
const LOCAL_PROMO_PRICES_KEY = "zlotkowska-local-promo-prices";
const LOCAL_PROMO_ACTIVE_KEY = "zlotkowska-local-promo-active";

function loadLocalInventory() {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_INVENTORY_KEY) ?? "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function loadLocalPrices(key = LOCAL_PRICES_KEY) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) ?? "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function loadLocalPromotionFlags() {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_PROMO_ACTIVE_KEY) ?? "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
}

function isValidPriceDraft(value) {
  const price = Number(value);
  return value !== ""
    && Number.isFinite(price)
    && price >= 0
    && Math.abs(price * 100 - Math.round(price * 100)) < 0.000001;
}


// Cada id identifica una variante también en product_inventory de schema.sql; textKey enlaza sus textos en i18n.js.
// Każde id wskazuje wariant również w product_inventory z schema.sql; textKey łączy teksty w i18n.js.
const products = [
  { id: 1, textKey: "rapeseed", weight: "1,2 kg", price: 40, image: HoneyRapeseed12, badgeKey: "natural", giftBox: true },
  { id: 2, textKey: "facelia", weight: "1,2 kg", price: 45, image: HoneyFacelia12, badgeKey: "natural", giftBox: true },
  { id: 3, textKey: "acaciaFacelia", weight: "1,2 kg", price: 45, image: HoneyAcaciaFacelia12, badgeKey: "natural", giftBox: true },
  { id: 5, textKey: "rapeseed", weight: "0,4 kg", price: 15, image: HoneyRapeseed038, badgeKey: "natural", giftBox: true },
  { id: 6, textKey: "facelia", weight: "0,4 kg", price: 20, image: HoneyFacelia038, badgeKey: "natural", giftBox: true },
  { id: 7, textKey: "multifloral", weight: "0,4 kg", price: 20, image: HoneyMultifloral038, badgeKey: "natural", giftBox: true },
  { id: 8, textKey: "linden", weight: "0,4 kg", price: 20, image: HoneyLinden038, badgeKey: "natural", giftBox: true },
  { id: 9, textKey: "herbal", weight: "0,4 kg", price: 15, image: HerbalHoney038, badgeKey: "natural", giftBox: true },
  { id: 10, textKey: "pollen", weight: "0,5 kg", price: 30, image: BeePollen, badgeKey: "beeProduct" },
  { id: 11, textKey: "giftSet3", weight: "3 × 0,38 kg", price: 50, image: GiftSetThreeHoneys, badgeKey: "gift" },
  { id: 12, textKey: "giftSet2", weight: "2 × 0,38 kg + 200 g", price: 50, image: GiftSetTwoHoneysAndPollen, badgeKey: "gift" },
];
const defaultPricesById = Object.fromEntries(products.map(({ id, price }) => [id, price]));


const honeyVarietyKeys = ["rapeseed", "facelia", "acaciaFacelia", "multifloral", "linden", "herbal"];

// Show the available photos in the order honey moves from the apiary to finished jars.
// Pokazujemy dostępne zdjęcia w kolejności od pasieki do gotowych słoików.
const processSteps = [
  {
    // Match this entry to process-0, the apiary photo.
    // Dopasowujemy etap do zdjęcia proces-0 przedstawiającego pasiekę.
    number: "00",
    textKey: "apiary",
    // Show the apiary photo for this stage.
    // Pokazujemy zdjęcie pasieki dla tego etapu.
    image: ProcessApiary,
  },
  {
    // Match this entry to process-2, the honeycomb frames.
    // Dopasowujemy etap do zdjęcia proces-2 przedstawiającego ramki z plastrami.
    number: "01",
    textKey: "frames",
    // Show the honeycomb frames photo for this stage.
    // Pokazujemy zdjęcie ramek z plastrami dla tego etapu.
    image: ProcessHoneycombFrames,
  },
  {
    // Match this entry to the newly added process-3 comb photo.
    // Dopasowujemy etap do nowego zdjęcia proces-3 przedstawiającego plaster.
    number: "02",
    textKey: "comb",
    // Show the close-up comb photo for this stage.
    // Pokazujemy zbliżenie plastra dla tego etapu.
    image: ProcessPreparedComb,
  },
  {
    // Match this entry to process-1, the honey extractor photo.
    // Dopasowujemy etap do zdjęcia proces-1 przedstawiającego miodarkę.
    number: "03",
    textKey: "extraction",
    // Show the extractor photo for this stage.
    // Pokazujemy zdjęcie miodarki dla tego etapu.
    image: ProcessHoneyExtraction,
  },
  {
    // Identify the fourth process step.
    // Określamy numer czwartego etapu procesu.
    number: "04",
    textKey: "fresh",
    // Show the collected honey photo for this stage.
    // Pokazujemy zdjęcie zebranego miodu dla tego etapu.
    image: ProcessFilteredHoney,
  },
  {
    // Identify the fifth process step.
    // Określamy numer piątego etapu procesu.
    number: "05",
    textKey: "jars",
    // Show the finished jars photo for this stage.
    // Pokazujemy zdjęcie gotowych słoików dla tego etapu.
    image: ProcessFilledJars,
  },
];


// Open a prepared WhatsApp order after the customer submits the form.
// Otwieramy przygotowane zamówienie w WhatsApp po wysłaniu formularza.
function handleOrderSubmit(event, cartItems, cartTotal, lang) {
  // Prevent the browser from reloading the page when the form is submitted.
  // Zapobiegamy ponownemu załadowaniu strony po wysłaniu formularza.
  event.preventDefault();

  // Read the submitted name, delivery choice, and optional notes.
  // Odczytujemy imię, sposób dostawy i opcjonalne uwagi z formularza.
  const formData = new FormData(event.currentTarget);

  // Get the customer's name for the WhatsApp message.
  // Pobieramy imię klienta do wiadomości WhatsApp.
  const name = formData.get("name").trim();

  // Get the selected pickup or shipping option.
  // Pobieramy wybraną opcję odbioru lub wysyłki.
  const delivery = formData.get("delivery");

  // Build a Polish-format address block only for shipping orders.
  const address = delivery === "shipping"
    ? [
      `${formData.get("street").trim()}${formData.get("apartment").trim() ? ` m. ${formData.get("apartment").trim()}` : ""}`,
      `${formData.get("postalCode").trim()} ${formData.get("city").trim()}`,
    ]
    : [];

  // Read extra instructions, such as which jars need gift boxes.
  // Odczytujemy dodatkowe uwagi, na przykład które słoiki zapakować na prezent.
  const notes = formData.get("notes").trim();

  // Read which messaging app the customer selected with the submit button.
  // Odczytujemy aplikację wybraną przez klienta przyciskiem wysyłania.
  const channel = event.nativeEvent.submitter?.value ?? "whatsapp";

  // Convert each cart row into a product line with its quantity and cost.
  // Zamieniamy każdy produkt z koszyka na wiersz z ilością i kosztem.
  // The beekeeper only reads Polish, so the order always uses Polish product names.
  const pl = translations.pl;
  const order = cartItems.map(({ product, quantity, giftBoxCount, lineTotal }) =>
    `${quantity} × ${pl.products[product.textKey].name} (${product.weight})${giftBoxCount ? `, w tym ${giftBoxCount} w kartoniku prezentowym` : ""} - ${lineTotal} zł`
  ).join("\n");

  const customerLanguage = LANGUAGE_NAMES_PL[lang];

  // Build the order text that the selected messaging app will open.
  // Tworzymy treść zamówienia, którą otworzy wybrana aplikacja.
  const message = [
    // Start with a short greeting and order confirmation.
    // Zaczynamy od krótkiego powitania i informacji o zamówieniu.
    "Dzień dobry, składam zamówienie:",

    customerLanguage
      ? `⚠️ Uwaga: klient korzysta ze strony w języku: ${customerLanguage.name}. Imię i uwagi mogą być w tym języku. Odpowiedz ${customerLanguage.reply}, np. z pomocą Tłumacza Google.`
      : "",

    // Include the customer's name so the apiary knows who is ordering.
    // Dodajemy imię klienta, aby pasieka wiedziała, kto składa zamówienie.
    `Imię: ${name}`,

    // Separate customer details from the product list.
    // Oddzielamy dane klienta od listy produktów.
    "",

    // Add all selected products and their line-item costs.
    // Dodajemy wybrane produkty i koszt każdej pozycji.
    order,

    // Show the total cost of products before any shipping charge is calculated.
    // Pokazujemy koszt produktów przed obliczeniem kosztu wysyłki.
    `Koszt produktów: ${cartTotal} zł`,

    // Separate the product cost from delivery details.
    // Oddzielamy koszt produktów od informacji o dostawie.
    "",

    // Include the chosen pickup or shipping method.
    // Dodajemy wybrany sposób odbioru lub wysyłki.
    `Sposób odbioru: ${delivery === "shipping" ? "Wysyłka InPost" : "Odbiór osobisty: Złotkowo, ul. Lipowa 20"}`,

    address.length ? `Adres dostawy:\n${address.join("\n")}` : "",

    // Include notes only when the customer entered them.
    // Dodajemy uwagi tylko wtedy, gdy klient je wpisał.
    notes ? `Uwagi do zamówienia: ${notes}` : "",

    // Remove empty lines from optional fields and join everything into one message.
    // Usuwamy puste pola opcjonalne i łączymy treść w jedną wiadomość.
  ].filter(Boolean).join("\n");

  // Encode Polish text and line breaks for either messaging URL.
  // Kodujemy polskie znaki i podziały wierszy dla obu adresów.
  const encodedMessage = encodeURIComponent(message);

  // Build the SMS URL using Apple's body separator on iOS devices.
  // Tworzymy adres SMS z separatorem body wymaganym przez urządzenia Apple.
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const smsSeparator = isIOS ? "&" : "?";
  const smsUrl = `sms:+48604117492${smsSeparator}body=${encodedMessage}`;

  // Prepare the URL for the selected messaging channel.
  // Przygotowujemy adres wybranego kanału wiadomości.
  const messageUrl = channel === "sms"
    ? smsUrl
    : `https://wa.me/48604117492?text=${encodedMessage}`;

  // Clear the form and return the channel URL to the submit handler.
  // Czyścimy formularz i przekazujemy adres do obsługi wysyłania.
  event.currentTarget.reset();

  return { channel, messageUrl };
}


function Stepper({ label, value, max = Infinity, onChange, className = "", t }) {
  const [changeCount, setChangeCount] = useState(0);

  return (
    <div className={`quantity-control ${className}`} role="group" aria-label={label}>
      <button
        type="button"
        className="quantity-button"
        aria-label={`${t.product.decrease}: ${label}`}
        disabled={value <= 0}
        onClick={() => {
          onChange(value - 1);
          setChangeCount((count) => count + 1);
        }}
      >
        −
      </button>
      <output
        key={changeCount}
        className={`quantity-value${changeCount ? " quantity-value--pop" : ""}`}
        aria-live="polite"
      >
        {value}
      </output>
      <button
        type="button"
        className="quantity-button"
        aria-label={`${t.product.increase}: ${label}`}
        disabled={value >= max}
        onClick={() => {
          onChange(value + 1);
          setChangeCount((count) => count + 1);
        }}
      >
        +
      </button>
    </div>
  );
}


// Keep Polish postal codes in the 00-000 format while the customer types.
function formatPostalCode(event) {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 5);
  event.target.value = digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits;
}


// Render the editable basket and order form inside the checkout drawer.
// Wyświetlamy edytowalny koszyk i formularz zamówienia w wysuwanym panelu.
function CheckoutPanel({ cartItems, cartQuantity, cartTotal, updateCart, updateGiftBoxes, onSubmitOrder, t }) {
  const [delivery, setDelivery] = useState("");
  const c = t.checkout;

  return (
    <form
      className="contact-form checkout-form"
      onSubmit={onSubmitOrder}
      onReset={() => setDelivery("")}
    >
      <div className="cart-summary" aria-live="polite">
        <div className="cart-summary-heading">
          <h3>{c.yourCart}</h3>
          <span>{cartQuantity} {c.pcs}</span>
        </div>

        {cartItems.length > 0 ? (
          <>
            <ul className="cart-items">
              {cartItems.map(({ product, quantity, giftBoxCount, lineTotal }) => {
                const productName = `${t.products[product.textKey].name}, ${product.weight}`;

                return (
                <li key={product.id} className="cart-item">
                  {product.image ? (
                    <img
                      className="cart-item-image"
                      src={product.image}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <span className="cart-item-image cart-item-image-placeholder">
                      {c.noPhoto}
                    </span>
                  )}
                  <div className="cart-item-info">
                    <span>{t.products[product.textKey].name} ({product.weight})</span>
                    {product.giftBox && (
                      <div className="gift-box-row">
                        <span>{c.giftBox(GIFT_BOX_PRICE)}</span>
                        <Stepper
                          label={`${t.product.giftBoxes}: ${productName}`}
                          value={giftBoxCount}
                          max={quantity}
                          onChange={(value) => updateGiftBoxes(product.id, value)}
                          className="small-quantity-control"
                          t={t}
                        />
                      </div>
                    )}
                    <strong>{lineTotal} zł</strong>
                  </div>
                  <div className="cart-item-controls">
                    <Stepper
                      label={`${t.product.quantity}: ${productName}`}
                      value={quantity}
                      onChange={(value) => updateCart(product.id, value)}
                      className="cart-quantity-control"
                      t={t}
                    />
                    <button
                      type="button"
                      className="cart-remove-button"
                      aria-label={`${c.removeAria}: ${productName}`}
                      onClick={() => updateCart(product.id, 0)}
                    >
                      {c.remove}
                    </button>
                  </div>
                </li>
                );
              })}
            </ul>
            <p className="cart-total">{c.total}: {cartTotal} zł</p>
          </>
        ) : (
          <p className="cart-empty">{c.empty}</p>
        )}
      </div>

      <label className="form-field" htmlFor="name">
        {c.name}
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="given-name"
          placeholder={c.namePlaceholder}
          required
        />
      </label>

      <fieldset className="delivery-options">
        <legend>{c.delivery} *</legend>
        <label>
          <input
            type="radio"
            name="delivery"
            value="pickup"
            required
            onChange={(event) => setDelivery(event.target.value)}
          />
          {c.pickup}
        </label>
        <label>
          <input
            type="radio"
            name="delivery"
            value="shipping"
            onChange={(event) => setDelivery(event.target.value)}
          />
          {c.shipping}
        </label>
      </fieldset>

      {delivery === "shipping" && (
        <fieldset className="address-fields">
          <legend>{c.address} *</legend>
          <p className="address-note">{c.addressNote}</p>
          <label className="form-field address-street" htmlFor="street">
            {c.street}
            <input
              id="street"
              name="street"
              type="text"
              autoComplete="address-line1"
              placeholder={c.streetPlaceholder}
              required
            />
          </label>
          <label className="form-field" htmlFor="apartment">
            {c.apartment}
            <input
              id="apartment"
              name="apartment"
              type="text"
              autoComplete="address-line2"
            />
          </label>
          <label className="form-field" htmlFor="postalCode">
            {c.postalCode}
            <input
              id="postalCode"
              name="postalCode"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00-000"
              pattern="[0-9]{2}-[0-9]{3}"
              title={c.postalCodeHint}
              maxLength={6}
              onInput={formatPostalCode}
              required
            />
          </label>
          <label className="form-field" htmlFor="city">
            {c.city}
            <input
              id="city"
              name="city"
              type="text"
              autoComplete="address-level2"
              required
            />
          </label>
        </fieldset>
      )}

      <label className="form-field" htmlFor="notes">
        {c.notes}
        <textarea
          id="notes"
          name="notes"
          placeholder={c.notesPlaceholder}
          rows="3"
        />
      </label>

      {c.polishNote && <p className="polish-note">{c.polishNote}</p>}

      <div className="order-actions">
        <button
          className="button button-dark form-submit"
          type="submit"
          name="channel"
          value="whatsapp"
          disabled={cartItems.length === 0}
        >
          <svg
            className="whatsapp-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path fill="currentColor" d={siWhatsapp.path} />
          </svg>
          {c.whatsapp}
        </button>
        <button
          className="button button-light form-submit sms-submit"
          type="submit"
          name="channel"
          value="sms"
          disabled={cartItems.length === 0}
        >
          {c.sms}
        </button>
      </div>
    </form>
  );
}
// Componente raíz: conecta rutas, catálogo, carrito, traducciones, Auth e inventario.
// Główny komponent łączy trasy, katalog, koszyk, tłumaczenia, Auth i zapasy.
function App() {
  // Read the current hash route so the shared shell can show the right page.
  // Odczytujemy bieżącą trasę z hash, aby wspólny układ pokazał właściwą stronę.
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname === "/admin";
  // El modo local solo existe durante desarrollo; en producción el panel requiere configuración Supabase.
  // Tryb lokalny działa tylko podczas programowania; na produkcji panel wymaga konfiguracji Supabase.
  const isLocalAdmin = import.meta.env.DEV && isAdminPage;
  const supabaseConfigured = Boolean(supabase && supabaseAdminEmail);
  const showAdminPage = location.pathname === "/admin" && (isLocalAdmin || supabaseConfigured);

  // Map each supported route to its page-specific CSS visibility class.
  // Przypisujemy każdej trasie klasę określającą widoczną zawartość strony.
  const pageClass = showAdminPage
    ? "page-admin"
    : location.pathname === "/catalogo"
      ? "page-products"
      : location.pathname === "/miody"
        ? "page-honeys"
        : location.pathname === "/pasieka"
          ? "page-apiary"
          : "page-home";

  // Store the quantity of each product selected by its id.
  // Przechowujemy ilość każdego produktu pod jego identyfikatorem.
  const [cart, setCart] = useState({});
  const [giftBoxes, setGiftBoxes] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});
  // inventory contiene stock confirmado; inventoryDrafts guarda ajustes locales aún no enviados.
  // inventory przechowuje potwierdzony stan; inventoryDrafts zawiera lokalne zmiany jeszcze niewysłane.
  const [inventory, setInventory] = useState(() => (supabaseConfigured ? {} : loadLocalInventory()));
  const [inventoryPrices, setInventoryPrices] = useState(() => (supabaseConfigured ? {} : loadLocalPrices()));
  const [inventoryPromoPrices, setInventoryPromoPrices] = useState(() => (
    supabaseConfigured ? {} : loadLocalPrices(LOCAL_PROMO_PRICES_KEY)
  ));
  const [inventoryPromoActive, setInventoryPromoActive] = useState(() => (
    supabaseConfigured ? {} : loadLocalPromotionFlags()
  ));
  const [inventoryDrafts, setInventoryDrafts] = useState({});
  const [priceDrafts, setPriceDrafts] = useState({});
  const [promoPriceDrafts, setPromoPriceDrafts] = useState({});
  const [promoActiveDrafts, setPromoActiveDrafts] = useState({});
  const [authSession, setAuthSession] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminSaving, setAdminSaving] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(supabaseConfigured);
  // Esta comprobación solo controla lo que muestra React; las políticas RLS son la autoridad de seguridad.
  // To sprawdzenie steruje tylko interfejsem React; polityki RLS są właściwym zabezpieczeniem.
  const isAdminAuthenticated = Boolean(
    authSession?.user?.email
      && authSession.user.email.toLowerCase() === supabaseAdminEmail.toLowerCase(),
  );

  // A manual choice wins; otherwise map the phone's language (Russian -> Ukrainian), falling back to Polish.
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem("chosenLang");
    if (LANGUAGES.some((language) => language.code === saved)) {
      return saved;
    }
    const deviceLanguage = (navigator.language || "").slice(0, 2).toLowerCase();
    return { pl: "pl", uk: "uk", ru: "uk", es: "es", en: "en" }[deviceLanguage] ?? "pl";
  });
  const t = translations[lang];
  // Separa precio normal y precio efectivo; la promoción solo se usa si está activa y es menor.
  // Rozdziela cenę regularną i zastosowaną; promocja działa tylko wtedy, gdy jest aktywna i niższa.
  const catalogProducts = products.map((product) => {
    const regularPrice = Number(inventoryPrices[product.id] ?? product.price);
    const promoPrice = inventoryPromoPrices[product.id] == null
      ? null
      : Number(inventoryPromoPrices[product.id]);
    const promoActive = Boolean(inventoryPromoActive[product.id])
      && promoPrice !== null
      && promoPrice < regularPrice;

    return {
      ...product,
      regularPrice,
      promoPrice,
      promoActive,
      price: promoActive ? promoPrice : regularPrice,
    };
  });
  const productGroups = Object.values(
    catalogProducts.reduce((groups, product) => {
      (groups[product.textKey] ??= []).push(product);
      return groups;
    }, {}),
  ).map((variants) => ({
    key: variants[0].id,
    variants: [...variants].sort((first, second) => first.price - second.price),
  }));

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (!supabase) return undefined;

    // Auth restaura la sesión al abrir la app y actualiza este estado al iniciar o cerrar sesión.
    // Auth przywraca sesję po otwarciu aplikacji i aktualizuje ten stan przy logowaniu oraz wylogowaniu.
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) setAdminError(error.message);
      setAuthSession(data?.session ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabaseConfigured) return undefined;

    // La consulta inicial carga PostgreSQL; Postgres Changes actualiza en vivo las pestañas suscritas.
    // Początkowe zapytanie ładuje PostgreSQL; Postgres Changes aktualizuje subskrybowane karty na żywo.
    let active = true;
    const loadInventory = async () => {
      const { data, error } = await supabase
        .from("product_inventory")
        .select("product_id, stock, price, promo_price, promo_active");
      if (!active) return;
      if (error) setAdminError(error.message);
      else {
        setInventory(Object.fromEntries((data ?? []).map(({ product_id, stock }) => [product_id, stock])));
        setInventoryPrices(Object.fromEntries((data ?? []).map(({ product_id, price }) => [product_id, Number(price)])));
        setInventoryPromoPrices(Object.fromEntries((data ?? []).map(({ product_id, promo_price }) => [product_id, promo_price == null ? null : Number(promo_price)])));
        setInventoryPromoActive(Object.fromEntries((data ?? []).map(({ product_id, promo_active }) => [product_id, Boolean(promo_active)])));
      }
      setInventoryLoading(false);
    };

    loadInventory();
    const channel = supabase
      .channel("public-product-inventory")
      .on("postgres_changes", { event: "*", schema: "public", table: "product_inventory" }, (payload) => {
        setInventory((current) => {
          const next = { ...current };
          const record = payload.eventType === "DELETE" ? payload.old : payload.new;
          if (payload.eventType === "DELETE") delete next[record.product_id];
          else next[record.product_id] = record.stock;
          return next;
        });
        setInventoryPrices((current) => {
          const next = { ...current };
          const record = payload.eventType === "DELETE" ? payload.old : payload.new;
          if (payload.eventType === "DELETE") delete next[record.product_id];
          else next[record.product_id] = Number(record.price);
          return next;
        });
        setInventoryPromoPrices((current) => {
          const next = { ...current };
          const record = payload.eventType === "DELETE" ? payload.old : payload.new;
          if (payload.eventType === "DELETE") delete next[record.product_id];
          else next[record.product_id] = record.promo_price == null ? null : Number(record.promo_price);
          return next;
        });
        setInventoryPromoActive((current) => {
          const next = { ...current };
          const record = payload.eventType === "DELETE" ? payload.old : payload.new;
          if (payload.eventType === "DELETE") delete next[record.product_id];
          else next[record.product_id] = Boolean(record.promo_active);
          return next;
        });
      })
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" && active) setAdminError(t.adminPage.realtimeError);
      });

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [supabaseConfigured, t.adminPage.realtimeError]);

  useEffect(() => {
    if (!supabaseConfigured) {
      // Sin configuración Supabase se conserva el stock solo en este navegador, como alternativa local.
      // Bez konfiguracji Supabase stan jest przechowywany tylko w tej przeglądarce jako tryb lokalny.
      localStorage.setItem(LOCAL_INVENTORY_KEY, JSON.stringify(inventory));
    }
  }, [inventory, supabaseConfigured]);

  useEffect(() => {
    if (!supabaseConfigured) {
      localStorage.setItem(LOCAL_PRICES_KEY, JSON.stringify(inventoryPrices));
    }
  }, [inventoryPrices, supabaseConfigured]);

  useEffect(() => {
    if (!supabaseConfigured) {
      localStorage.setItem(LOCAL_PROMO_PRICES_KEY, JSON.stringify(inventoryPromoPrices));
      localStorage.setItem(LOCAL_PROMO_ACTIVE_KEY, JSON.stringify(inventoryPromoActive));
    }
  }, [inventoryPromoPrices, inventoryPromoActive, supabaseConfigured]);

  function changeLanguage(code) {
    setLang(code);
    localStorage.setItem("chosenLang", code);
  }

  // Track whether the compact mobile navigation menu is open.
  // Sprawdzamy, czy kompaktowe menu mobilne jest otwarte.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track whether scrolling has started so the navigation can collapse.
  // Sprawdzamy, czy rozpoczęło się przewijanie, aby zwinąć nawigację.
  const [pageScrolled, setPageScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderNotice, setOrderNotice] = useState(false);
  const cartDialogRef = useRef(null);

  // Keep only products with a positive quantity and attach that quantity.
  // Zostawiamy produkty z ilością większą od zera i przypisujemy im ilość.
  const cartItems = catalogProducts
    .filter((product) => cart[product.id] > 0)
    .map((product) => {
      const quantity = cart[product.id];
      const giftBoxCount = product.giftBox ? Math.min(giftBoxes[product.id] ?? 0, quantity) : 0;
      const lineTotal = product.price * quantity + GIFT_BOX_PRICE * giftBoxCount;
      return { product, quantity, giftBoxCount, lineTotal };
    });

  // Count all individual units currently in the cart.
  // Zliczamy wszystkie sztuki znajdujące się w koszyku.
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate the total product cost, excluding shipping.
  // Obliczamy koszt produktów bez kosztu wysyłki.
  const cartTotal = cartItems.reduce((total, item) => total + item.lineTotal, 0);
  const pendingStockChanges = Object.entries(inventoryDrafts)
    .filter(([productId, stock]) => (
      stock !== ""
      && Number.isInteger(Number(stock))
      && Number(stock) >= 0
      && Number(stock) !== (inventory[productId] ?? 0)
    ))
    .map(([productId, stock]) => ({ productId: Number(productId), stock: Number(stock) }));
  const pendingPriceChanges = Object.entries(priceDrafts)
    .filter(([productId, price]) => (
      isValidPriceDraft(price)
      && Number(price) !== Number(inventoryPrices[productId] ?? defaultPricesById[productId])
    ))
    .map(([productId, price]) => ({ productId: Number(productId), price: Number(price) }));
  const pendingPromoPriceChanges = Object.entries(promoPriceDrafts)
    .filter(([productId, price]) => (
      (price === "" || isValidPriceDraft(price))
      && (price === "" ? null : Number(price)) !== (inventoryPromoPrices[productId] ?? null)
    ))
    .map(([productId, price]) => ({
      productId: Number(productId),
      promoPrice: price === "" ? null : Number(price),
    }));
  const pendingPromoActiveChanges = Object.entries(promoActiveDrafts)
    .filter(([productId, active]) => Boolean(active) !== Boolean(inventoryPromoActive[productId]))
    .map(([productId, active]) => ({ productId: Number(productId), active: Boolean(active) }));
  const hasInvalidDrafts = Object.values(inventoryDrafts).some((stock) => (
    stock === "" || !Number.isInteger(Number(stock)) || Number(stock) < 0
  )) || Object.values(priceDrafts).some((price) => (
    !isValidPriceDraft(price)
  )) || Object.values(promoPriceDrafts).some((price) => (
    price !== "" && !isValidPriceDraft(price)
  ));
  const hasInvalidPromotion = products.some(({ id }) => {
    const promotionIsActive = promoActiveDrafts[id] ?? Boolean(inventoryPromoActive[id]);
    if (!promotionIsActive) return false;

    const rawPromoPrice = Object.hasOwn(promoPriceDrafts, id)
      ? promoPriceDrafts[id]
      : inventoryPromoPrices[id] == null
        ? ""
        : String(inventoryPromoPrices[id]);
    const regularPrice = Number(priceDrafts[id] ?? inventoryPrices[id] ?? defaultPricesById[id]);
    return !isValidPriceDraft(rawPromoPrice) || Number(rawPromoPrice) >= regularPrice;
  });
  const pendingChangeCount = pendingStockChanges.length
    + pendingPriceChanges.length
    + pendingPromoPriceChanges.length
    + pendingPromoActiveChanges.length;

  function updateGiftBoxes(productId, value) {
    const count = Math.max(0, Math.min(Math.floor(Number(value) || 0), cart[productId] ?? 0));
    setGiftBoxes((current) => ({ ...current, [productId]: count }));
  }

  function adjustStockDraft(productId, change) {
    const currentStock = Math.floor(Number(inventoryDrafts[productId] ?? inventory[productId] ?? 0) || 0);
    const stock = Math.max(0, currentStock + change);
    setInventoryDrafts((current) => {
      const next = { ...current };
      if (stock === (inventory[productId] ?? 0)) delete next[productId];
      else next[productId] = stock;
      return next;
    });
  }

  function togglePromotionDraft(productId) {
    const currentActive = promoActiveDrafts[productId] ?? Boolean(inventoryPromoActive[productId]);
    const nextActive = !currentActive;
    setPromoActiveDrafts((current) => {
      const next = { ...current };
      if (nextActive === Boolean(inventoryPromoActive[productId])) delete next[productId];
      else next[productId] = nextActive;
      return next;
    });
  }

  async function saveInventoryChanges() {
    if (pendingChangeCount === 0 || hasInvalidDrafts || hasInvalidPromotion || adminSaving) return;

    setAdminError("");
    setAdminSaving(true);

    try {
      const stockById = Object.fromEntries(pendingStockChanges.map(({ productId, stock }) => [productId, stock]));
      const priceById = Object.fromEntries(pendingPriceChanges.map(({ productId, price }) => [productId, price]));
      const promoPriceById = Object.fromEntries(
        pendingPromoPriceChanges.map(({ productId, promoPrice }) => [productId, promoPrice]),
      );
      const promoActiveById = Object.fromEntries(
        pendingPromoActiveChanges.map(({ productId, active }) => [productId, active]),
      );
      const changedProductIds = new Set([
        ...pendingStockChanges,
        ...pendingPriceChanges,
        ...pendingPromoPriceChanges,
        ...pendingPromoActiveChanges,
      ].map(({ productId }) => productId));
      const rowsToSave = [...changedProductIds].map((productId) => ({
        product_id: productId,
        stock: stockById[productId] ?? inventory[productId] ?? 0,
        price: priceById[productId] ?? Number(inventoryPrices[productId] ?? defaultPricesById[productId]),
        promo_price: Object.hasOwn(promoPriceById, productId)
          ? promoPriceById[productId]
          : inventoryPromoPrices[productId] ?? null,
        promo_active: promoActiveById[productId] ?? Boolean(inventoryPromoActive[productId]),
        updated_at: new Date().toISOString(),
      }));

      if (supabaseConfigured && isAdminAuthenticated) {
        // Un upsert envía juntos precios y existencias; RLS valida permisos en PostgreSQL.
        // Jeden upsert wysyła razem ceny i zapasy; RLS sprawdza uprawnienia w PostgreSQL.
        const { error } = await supabase.from("product_inventory").upsert(rowsToSave);
        if (error) throw error;
      }

      setInventory((current) => ({ ...current, ...stockById }));
      setInventoryPrices((current) => ({ ...current, ...priceById }));
      setInventoryPromoPrices((current) => ({ ...current, ...promoPriceById }));
      setInventoryPromoActive((current) => ({ ...current, ...promoActiveById }));
      // Al reducir stock, el carrito abierto tampoco puede conservar más unidades que las disponibles.
      // Po zmniejszeniu zapasu otwarty koszyk nie może zawierać więcej sztuk niż jest dostępnych.
      setCart((current) => {
        const next = { ...current };
        pendingStockChanges.forEach(({ productId, stock }) => {
          if ((next[productId] ?? 0) > stock) {
            if (stock === 0) delete next[productId];
            else next[productId] = stock;
          }
        });
        return next;
      });
      setGiftBoxes((current) => {
        const next = { ...current };
        pendingStockChanges.forEach(({ productId, stock }) => {
          next[productId] = Math.min(next[productId] ?? 0, stock);
        });
        return next;
      });
      setInventoryDrafts((current) => {
        const next = { ...current };
        pendingStockChanges.forEach(({ productId, stock }) => {
          if (Number(next[productId]) === stock) delete next[productId];
        });
        return next;
      });
      setPriceDrafts((current) => {
        const next = { ...current };
        pendingPriceChanges.forEach(({ productId, price }) => {
          if (Number(next[productId]) === price) delete next[productId];
        });
        return next;
      });
      setPromoPriceDrafts((current) => {
        const next = { ...current };
        pendingPromoPriceChanges.forEach(({ productId, promoPrice }) => {
          if ((next[productId] === "" ? null : Number(next[productId])) === promoPrice) delete next[productId];
        });
        return next;
      });
      setPromoActiveDrafts((current) => {
        const next = { ...current };
        pendingPromoActiveChanges.forEach(({ productId, active }) => {
          if (next[productId] === active) delete next[productId];
        });
        return next;
      });
    } catch (error) {
      setAdminError(error.message || t.adminPage.saveError);
    } finally {
      setAdminSaving(false);
    }
  }

  async function signInAdmin(event) {
    event.preventDefault();
    setAdminError("");
    setAdminSaving(true);

    // La interfaz muestra el alias witold; Supabase Auth usa el correo configurado y la contraseña.
    // Interfejs pokazuje alias witold; Supabase Auth używa skonfigurowanego e-maila i hasła.
    const { data, error } = await supabase.auth.signInWithPassword({
      email: supabaseAdminEmail,
      password: adminPassword,
    });

    if (error || data.user?.email?.toLowerCase() !== supabaseAdminEmail.toLowerCase()) {
      setAdminError(error?.message ?? t.adminPage.loginFailed);
      await supabase.auth.signOut();
    }

    setAdminPassword("");
    setAdminSaving(false);
  }

  async function signOutAdmin() {
    await supabase?.auth.signOut();
    setAuthSession(null);
    setAdminError("");
  }

  function updateCart(productId, value) {
    const requested = Math.max(0, Math.floor(Number(value) || 0));
    const stock = inventory[productId];
    const quantity = stock === undefined ? requested : Math.min(requested, stock);

    // Dismiss the previous order notice when a new basket starts.
    // Ukrywamy poprzedni komunikat, gdy zaczyna się nowe zamówienie.
    if (quantity > 0) {
      setOrderNotice(false);
    }

    // Update the cart from its latest state to avoid stale button values.
    // Aktualizujemy koszyk na podstawie najnowszego stanu, aby uniknąć starych wartości.
    setCart((currentCart) => {
      // Copy the current cart before changing one product quantity.
      // Kopiujemy obecny koszyk przed zmianą ilości produktu.
      const nextCart = { ...currentCart };

      // Remove the product entirely when its quantity reaches zero.
      // Usuwamy produkt z koszyka, gdy jego ilość spadnie do zera.
      if (quantity === 0) {
        delete nextCart[productId];
      // Otherwise, save the new quantity for this product.
      // W przeciwnym razie zapisujemy nową ilość produktu.
      } else {
        nextCart[productId] = quantity;
      }

      // Return the updated cart so React can render the new order.
      // Zwracamy zaktualizowany koszyk, aby React odświeżył zamówienie.
      return nextCart;
    });

    setGiftBoxes((current) => (
      (current[productId] ?? 0) > quantity ? { ...current, [productId]: quantity } : current
    ));
  }

  // Open WhatsApp, reset the completed order, and return to the home route.
  // Otwieramy WhatsApp, czyścimy zakończone zamówienie i wracamy na stronę główną.
  function submitOrder(event) {
    const preparedMessage = handleOrderSubmit(event, cartItems, cartTotal, lang);
    setCart({});
    setGiftBoxes({});
    setCartOpen(false);
    setOrderNotice(true);
    navigate("/");

    if (preparedMessage.channel === "sms") {
      // Hand off directly to iOS Messages or the Android SMS composer.
      // Przekazujemy wiadomość do iOS Messages lub aplikacji SMS na Androidzie.
      window.location.assign(preparedMessage.messageUrl);
    } else {
      // Open WhatsApp in a new tab with the same prepared order.
      // Otwieramy WhatsApp w nowej karcie z tym samym zamówieniem.
      window.open(preparedMessage.messageUrl, "_blank", "noopener,noreferrer");
    }
  }

  // Collapse the full navigation after the user starts scrolling.
  // Zwijamy pełną nawigację po rozpoczęciu przewijania.
  useEffect(() => {
    // Read the current scroll position and choose the compact header state.
    // Odczytujemy pozycję przewijania i wybieramy zwinięty stan nagłówka.
    function updateNavigationState() {
      setPageScrolled(window.scrollY > 48);
    }

    // Set the right header state immediately when the component mounts.
    // Ustawiamy właściwy stan nagłówka od razu po zamontowaniu komponentu.
    updateNavigationState();

    // Listen for scrolling without blocking the browser's scroll handling.
    // Nasłuchujemy przewijania bez blokowania obsługi przewijania w przeglądarce.
    window.addEventListener("scroll", updateNavigationState, { passive: true });

    // Remove the listener when the component unmounts.
    // Usuwamy nasłuchiwanie po odmontowaniu komponentu.
    return () => window.removeEventListener("scroll", updateNavigationState);
  }, []);

  // Start each destination page at the top and close the mobile menu.
  // Otwieramy każdą stronę od góry i zamykamy menu mobilne.
  useEffect(() => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth";
    window.scrollTo({ top: 0, behavior });
  }, [location.pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const elements = document.querySelectorAll(
      ".hero-content, .home-family-section, .section-heading, .product-card, .process-section, .story-section, .contact-section, .map-section",
    );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

    elements.forEach((element) => {
      element.classList.add("reveal-on-scroll");
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      elements.forEach((element) => {
        element.classList.remove("reveal-on-scroll", "is-visible");
      });
    };
  }, [location.pathname]);

  // Open the native modal when checkout is requested and close it when dismissed.
  // Otwieramy natywne okno po wybraniu zamówienia i zamykamy po jego odrzuceniu.
  useEffect(() => {
    const dialog = cartDialogRef.current;

    if (!dialog) {
      return;
    }

    if (cartOpen && !dialog.open) {
      dialog.showModal();
    } else if (!cartOpen && dialog.open) {
      dialog.close();
    }
  }, [cartOpen]);

  // Return the complete website.
// Zwracamy kompletną stronę internetową.
  return (
    <div className={`site ${pageClass}${cartQuantity > 0 ? " has-cart-items" : ""}`}>
      {/* Main navigation bar.
// Główny pasek nawigacyjny. */}
      <header id="top" className={`navbar${pageScrolled ? " is-scrolled" : ""}`}>

        {/* Brand link leading to the top of the page.
// Link marki prowadzący na górę strony. */}
        <Link to="/" className="brand" aria-label={t.nav.home}>

          {/* Real company logo.
// Prawdziwe logo firmy. */}
          <img
            src={ZlotkowskaPasiekaLogo}
            alt="Złotkowska Pasieka"
            className="brand-logo"
          />
          {/* The logo itself already says "OD 1977" in Polish. */}
          {lang !== "pl" && <span className="brand-since">{t.nav.since}</span>}

        </Link>


        {/* Main navigation links.
// Główne linki nawigacyjne. */}
        <nav
          id="main-navigation"
          className={`nav-links${mobileMenuOpen ? " is-open" : ""}`}
        >

          <NavLink to="/" end onClick={() => setMobileMenuOpen(false)}>{t.nav.start}</NavLink>
          {/* Link to honey products.
// Link do produktów z miodem. */}
          <NavLink to="/miody" onClick={() => setMobileMenuOpen(false)}>{t.nav.honeys}</NavLink>
          <NavLink to="/catalogo" onClick={() => setMobileMenuOpen(false)}>{t.nav.catalog}</NavLink>

          {/* Link to the apiary story.
// Link do historii pasieki. */}
          <NavLink to="/pasieka" onClick={() => setMobileMenuOpen(false)}>{t.nav.apiary}</NavLink>
          {import.meta.env.DEV && <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>{t.adminPage.link}</NavLink>}

        </nav>


        <LanguagePicker lang={lang} onChange={changeLanguage} label={t.nav.language} />


        {/* Main navigation button.
// Główny przycisk nawigacji. */}
        <button
          type="button"
          className="nav-button cart-nav-button"
          aria-label={t.nav.cartAria(cartQuantity)}
          onClick={() => setCartOpen(true)}
        >
          {t.nav.cart} (<span key={cartQuantity} className="cart-count-pop">{cartQuantity}</span>)
        </button>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={mobileMenuOpen}
          aria-controls="main-navigation"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
        >
          <span className="menu-icon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

      </header>

      {orderNotice && (
        <div className="order-notice" role="status" aria-live="polite">
          <span className="order-notice-icon" aria-hidden="true">✓</span>
          <p>
            <strong>{t.notice.title}</strong>
            <br />
            {t.notice.body}
          </p>
          <button
            type="button"
            aria-label={t.notice.close}
            onClick={() => setOrderNotice(false)}
          >
            ×
          </button>
        </div>
      )}


      {/* =========================
          HERO
          SEKCJA GŁÓWNA
      ========================== */}

      {/* Main hero section.
// Główna sekcja hero. */}
      <main className="page-main">

        <section className="hero">
          {/* Hero text content.
// Treść tekstowa sekcji hero. */}
          <div className="hero-content">

            {/* Location label.
// Etykieta lokalizacji. */}
            <p className="eyebrow">
              {t.hero.eyebrow}
            </p>


            {/* Main website heading.
// Główny nagłówek strony. */}
            <h1>
              {t.hero.titleA}
              <span>{t.hero.titleB}</span>
            </h1>


            {/* Hero description.
// Opis sekcji hero. */}
            <p className="hero-description">
              {t.hero.description}
            </p>


            {/* Hero buttons.
// Przyciski sekcji hero. */}
            <div className="hero-actions">

              {/* Main products button.
// Główny przycisk produktów. */}
              <Link to="/catalogo" className="button button-dark">
                {t.hero.products}
              </Link>


              {/* Story button.
// Przycisk historii. */}
              <Link to="/pasieka" className="button button-light">
                {t.hero.story}
              </Link>

            </div>


            {/* Small brand statement.
// Małe hasło marki. */}
            <div className="hero-note">
              <span>✦</span>
              {t.hero.note}
            </div>

          </div>

        </section>


        {/* =========================
            PRODUCTS
            PRODUKTY
        ========================== */}

        {location.pathname === "/miody" && (
          <HoneyJourney
            products={honeyVarietyKeys.map((textKey) => products.find((product) => product.textKey === textKey))}
            t={t}
          />
        )}

        <section className="home-family-section">
          <div className="home-family-copy">
            <p className="eyebrow">{t.family.eyebrow}</p>
            <h2>{t.family.title}</h2>
            <p>
              {t.family.text}
            </p>
            <Link className="text-link" to="/pasieka">
              {t.family.link}
              <span>→</span>
            </Link>
          </div>
          <div className="home-family-photos">
            <img
              src={HoneyJarsOnTable}
              alt={t.family.altJars}
              loading="lazy"
            />
            <img
              src={HoneyVarieties}
              alt={t.family.altVarieties}
              loading="lazy"
            />
          </div>
        </section>

        <section className="products-section" id="catalogo">

          {/* Products section heading.
// Nagłówek sekcji produktów. */}
          <div className="section-heading">

            <p className="eyebrow">
              {t.productsSection.eyebrow}
            </p>


            <h2>
              {t.productsSection.titleA}
              <span>{t.productsSection.titleB}</span>
            </h2>


            <p>
              {t.productsSection.text}
            </p>

          </div>


          {/* Product cards.
// Karty produktów. */}
          <div className="product-grid">

            {productGroups.map(({ key, variants }) => {
              const product = variants.find((variant) => variant.id === selectedVariants[key]) ?? variants[0];
              const text = t.products[product.textKey];

              return (

              <article
                className={`product-card product-card--${product.textKey}`}
                key={key}
              >

                {/* Product image.
// Zdjęcie produktu. */}
                {product.image && (
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={`${text.name}, ${product.weight}`}
                      className="product-image"
                      loading="lazy"
                    />
                    <span className="product-badge">
                      {t.badges[product.badgeKey]}
                    </span>
                  </div>
                )}


                {/* Product information.
// Informacje o produkcie. */}
                <div className="product-info">

                  <div className="product-title-row">

                    <h3>
                      {text.name}
                    </h3>

                  </div>


                  <p>
                    {text.description}
                  </p>

                  {product.badgeKey === "natural" && (
                    <div className="product-health">
                      <strong>{t.varietiesSection.profiles[product.textKey].benefitsTitle}</strong>
                      <ul>
                        {t.varietiesSection.profiles[product.textKey].benefits.map((benefit) => (
                          <li key={benefit}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}


                  <ul className="variant-rows">
                    {variants.map((variant) => {
                      const quantity = cart[variant.id] ?? 0;
                      const stock = inventory[variant.id];
                      const isUnavailable = stock === 0;
                      const selectThis = () => setSelectedVariants((current) => ({ ...current, [key]: variant.id }));

                      return (
                        <li key={variant.id} className={`variant-row${isUnavailable ? " is-out-of-stock" : ""}`}>
                          <div className="variant-main">
                            {variants.length > 1 ? (
                              <button
                                type="button"
                                className="variant-button"
                                aria-pressed={variant.id === product.id}
                                aria-label={`${t.product.showPhoto}: ${text.name}, ${variant.weight}`}
                                onClick={selectThis}
                              >
                                {variant.weight}
                              </button>
                            ) : (
                              <span className="variant-button">{variant.weight}</span>
                            )}
                            <span className={`variant-price${variant.promoActive ? " is-promotional" : ""}`}>
                              {variant.promoActive && <del>{variant.regularPrice} zł</del>}
                              <strong>{variant.price} zł</strong>
                              {variant.promoActive && <span className="promotion-badge">{t.adminPage.promotionBadge}</span>}
                            </span>
                            <Stepper
                              label={`${t.product.quantity}: ${text.name}, ${variant.weight}`}
                              value={quantity}
                              max={stock ?? Infinity}
                              onChange={(value) => {
                                selectThis();
                                updateCart(variant.id, value);
                              }}
                              t={t}
                            />
                          </div>

                          {stock > 0 && <span className="stock-availability">{t.product.stockAvailable(stock)}</span>}
                          {isUnavailable && <span className="stock-unavailable">{t.adminPage.unavailable}</span>}

                          {variant.giftBox && quantity > 0 && (
                            <div className="gift-box-row">
                              <span>{t.product.giftBoxRow(GIFT_BOX_PRICE)}</span>
                              <Stepper
                                label={`${t.product.giftBoxes}: ${text.name}, ${variant.weight}`}
                                value={Math.min(giftBoxes[variant.id] ?? 0, quantity)}
                                max={quantity}
                                onChange={(value) => updateGiftBoxes(variant.id, value)}
                                className="small-quantity-control"
                                t={t}
                              />
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {product.giftBox && variants.every((variant) => !cart[variant.id]) && (
                    <p className="gift-box-hint">
                      {t.product.giftBoxHint(GIFT_BOX_PRICE)}
                    </p>
                  )}

                </div>

              </article>

              );
            })}

          </div>

        </section>


        {/* =========================
            CONTACT
            KONTAKT
        ========================== */}

        <section className="contact-section contact-cta" id="kontakt">

          <div className="contact-copy">

            <p className="eyebrow">
              {t.contact.eyebrow}
            </p>


            <h2>
              {t.contact.titleA}
              <span>{t.contact.titleB}</span>
            </h2>


            <p>
              {t.contact.text}
            </p>

            <a
              className="text-link contact-directions-link"
              href="https://www.google.com/maps/dir/?api=1&destination=Z%C5%82otkowo%2C%20ul.%20Lipowa%2020%2C%20Polska"
              target="_blank"
              rel="noreferrer"
            >
              {t.contact.directions}
              <span>↗</span>
            </a>

            <a className="contact-phone-link" href="tel:+48604117492">
              {t.contact.phone}
            </a>

            <button
              type="button"
              className="button button-dark contact-order-button"
              aria-haspopup="dialog"
              onClick={() => setCartOpen(true)}
            >
              {t.contact.openCart(cartQuantity)}
            </button>

          </div>

        </section>


        {/* =========================
            STORY
            HISTORIA
        ========================== */}

        <section className="story-section" id="pasieka">

          {/* Story image.
// Zdjęcie historii. */}
          <div className="story-image">

            <img
              src={MiodPiwnica}
              alt={t.story.alt}
            />

          </div>


          {/* Story text.
// Tekst historii. */}
          <div className="story-content">

            <p className="eyebrow">
              {t.story.eyebrow}
            </p>


            <h2>
              {t.story.titleA}
              <span>{t.story.titleB}</span>
            </h2>


            <p>
              {t.story.p1}
            </p>


            <p>
              {t.story.p2}
            </p>


            <p>
              {t.story.p3}
            </p>


            <Link to="/miody" className="text-link">
              {t.story.link}
              <span>→</span>
            </Link>

          </div>

        </section>


        {/* =========================
            NATURAL PRODUCTION
            NATURALNA PRODUKCJA
        ========================== */}

        <section className="story-section natural-section">

          {/* Natural production image.
// Zdjęcie naturalnej produkcji. */}
          <div className="story-image">

            <img
              src={HoneyVarieties}
              alt={t.natural.alt}
            />

          </div>


          {/* Natural production text.
// Tekst dotyczący naturalnej produkcji. */}
          <div className="story-content">

            <p className="eyebrow">
              {t.natural.eyebrow}
            </p>


            <h2>
              {t.natural.titleA}
              <span>{t.natural.titleB}</span>
            </h2>


            <p>
              {t.natural.p1}
            </p>


            <p>
              {t.natural.p2}
            </p>

          </div>

        </section>


        {/* Explain the visible steps from the apiary to the finished jars. */}
        {/* Pokazujemy dostępne etapy od pasieki do gotowych słoików. */}
        <section className="process-section" aria-labelledby="process-heading">
          <div className="process-heading">
            <p className="eyebrow">{t.process.eyebrow}</p>
            <h2 id="process-heading">{t.process.title}</h2>
            <p>{t.process.text}</p>
          </div>

          <ol className="process-grid">
            {processSteps.map((step) => (
              <li className="process-card" key={step.number}>
                <img
                  className="process-image"
                  src={step.image}
                  alt={t.process.steps[step.textKey].title}
                  loading="lazy"
                />
                <p className="process-number">{step.number}</p>
                <h3>{t.process.steps[step.textKey].title}</h3>
                <p>{t.process.steps[step.textKey].description}</p>
              </li>
            ))}
          </ol>
        </section>


        <section className="map-section" aria-labelledby="map-heading">
          <div className="map-copy">
            <p className="eyebrow">{t.map.eyebrow}</p>
            <h2 id="map-heading">{t.map.title}</h2>
            <p>Złotkowo k. Poznania, ul. Lipowa 20</p>
            <a className="map-phone-link" href="tel:+48604117492">
              {t.map.phone}
            </a>
            <a
              className="button button-dark map-link"
              href="https://www.google.com/maps/dir/?api=1&destination=Z%C5%82otkowo%2C%20ul.%20Lipowa%2020%2C%20Polska"
              target="_blank"
              rel="noreferrer"
            >
              {t.map.route}
              <span>↗</span>
            </a>
          </div>
          <div className="map-preview">
            <iframe
              src="https://maps.google.com/maps?q=Z%C5%82otkowo%2C%20ul.%20Lipowa%2020%2C%20Polska&output=embed"
              title={t.map.iframeTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>

        {showAdminPage && (
          <section className="inventory-admin" aria-labelledby="inventory-admin-title">
            <header className="inventory-admin-header">
              <p className="eyebrow">
                {supabaseConfigured ? t.adminPage.supabaseEyebrow : t.adminPage.eyebrow}
              </p>
              <h1 id="inventory-admin-title">{t.adminPage.title}</h1>
              <p>
                {isAdminAuthenticated
                  ? t.adminPage.welcomeAdmin
                  : supabaseConfigured
                    ? t.adminPage.supabaseNote
                    : t.adminPage.localNote}
              </p>
            </header>
            {supabaseConfigured && !isAdminAuthenticated && (
              <form className="inventory-admin-login" onSubmit={signInAdmin}>
                <label>
                  <span>{t.adminPage.username}</span>
                  <input type="text" value="witold" readOnly autoComplete="username" />
                </label>
                <label>
                  <span>{t.adminPage.password}</span>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(event) => setAdminPassword(event.currentTarget.value)}
                    autoComplete="current-password"
                    required
                  />
                </label>
                {adminError && <p className="inventory-admin-error" role="alert">{adminError}</p>}
                <button className="button button-dark" type="submit" disabled={adminSaving}>
                  {adminSaving ? t.adminPage.loading : t.adminPage.signIn}
                </button>
              </form>
            )}
            {(!supabaseConfigured || isAdminAuthenticated) && (
              <>
                {isAdminAuthenticated && (
                  <button className="inventory-admin-signout" type="button" onClick={signOutAdmin}>
                    {t.adminPage.signOut}
                  </button>
                )}
                {inventoryLoading && <p role="status">{t.adminPage.loading}</p>}
                {adminError && <p className="inventory-admin-error" role="alert">{adminError}</p>}
                {hasInvalidDrafts && <p className="inventory-admin-error" role="alert">{t.adminPage.invalidDrafts}</p>}
                {hasInvalidPromotion && <p className="inventory-admin-error" role="alert">{t.adminPage.invalidPromotion}</p>}
            <div className="inventory-admin-list">
              {products.map((product) => {
                // La imagen, los precios y el stock pertenecen al mismo id de variante.
                // Obraz, ceny i stan magazynowy należą do tego samego id wariantu.
                const productText = t.products[product.textKey];
                const stock = inventory[product.id];
                const currentPrice = Number(inventoryPrices[product.id] ?? product.price);
                const currentPromoPrice = inventoryPromoPrices[product.id] == null
                  ? ""
                  : String(inventoryPromoPrices[product.id]);
                const promotionIsActive = promoActiveDrafts[product.id]
                  ?? Boolean(inventoryPromoActive[product.id]);
                const hasDraft = Object.hasOwn(inventoryDrafts, product.id);
                const rawDraft = hasDraft ? inventoryDrafts[product.id] : stock;
                const displayedStock = rawDraft === undefined || rawDraft === ""
                  ? undefined
                  : Math.max(0, Math.floor(Number(rawDraft) || 0));
                const hasPriceDraft = Object.hasOwn(priceDrafts, product.id);
                const hasPromoPriceDraft = Object.hasOwn(promoPriceDrafts, product.id);
                const stockStatus = displayedStock === undefined
                  ? t.adminPage.notSet
                  : displayedStock === 0
                    ? t.adminPage.unavailable
                    : t.adminPage.available;

                return (
                  <div className="inventory-admin-row" key={product.id}>
                    <span className="inventory-admin-product">
                      <img
                        className="inventory-admin-thumb"
                        src={product.image}
                        alt={`${productText.name}, ${product.weight}`}
                        loading="eager"
                      />
                      <span className="inventory-admin-product-heading">
                        <strong>{productText.name}</strong>
                        {promotionIsActive && (
                          <span className="inventory-admin-promo-active" role="status">
                            {t.adminPage.promotionActive}
                          </span>
                        )}
                      </span>
                      <small>{product.weight}</small>
                    </span>
                    <span className={`inventory-admin-status${displayedStock === 0 ? " is-out-of-stock" : ""}`}>
                      {stockStatus}
                    </span>
                    <div className="inventory-admin-stock-control">
                      <span>{t.adminPage.stock}</span>
                      <div className="inventory-admin-stepper">
                        <button
                          type="button"
                          aria-label={`${t.adminPage.decreaseStock}: ${productText.name}, ${product.weight}`}
                          onClick={() => adjustStockDraft(product.id, -1)}
                          disabled={displayedStock === 0 || adminSaving}
                        >
                          −
                        </button>
                        <input
                          aria-label={`${t.adminPage.stock}: ${productText.name}, ${product.weight}`}
                          type="number"
                          min="0"
                          step="1"
                          inputMode="numeric"
                          value={hasDraft ? inventoryDrafts[product.id] : stock ?? 0}
                          onChange={(event) => {
                            const stockValue = event.currentTarget.value;
                            setInventoryDrafts((current) => ({ ...current, [product.id]: stockValue }));
                          }}
                          disabled={adminSaving}
                        />
                        <button
                          type="button"
                          aria-label={`${t.adminPage.increaseStock}: ${productText.name}, ${product.weight}`}
                          onClick={() => adjustStockDraft(product.id, 1)}
                          disabled={adminSaving}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="inventory-admin-pricing-control">
                      <label className="inventory-admin-price-control">
                        <span>{t.adminPage.regularPrice}</span>
                        <span className="inventory-admin-price-input">
                          <input
                            aria-label={`${t.adminPage.regularPrice}: ${productText.name}, ${product.weight}`}
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={hasPriceDraft ? priceDrafts[product.id] : currentPrice.toFixed(2)}
                            onChange={(event) => {
                              const priceValue = event.currentTarget.value;
                              setPriceDrafts((current) => ({ ...current, [product.id]: priceValue }));
                            }}
                            disabled={adminSaving}
                          />
                          <span>zł</span>
                        </span>
                      </label>
                      <div className="inventory-admin-promo-row">
                        <label className="inventory-admin-price-control">
                          <span>{t.adminPage.promoPrice}</span>
                          <span className="inventory-admin-price-input">
                            <input
                              aria-label={`${t.adminPage.promoPrice}: ${productText.name}, ${product.weight}`}
                              type="number"
                              min="0"
                              step="0.01"
                              inputMode="decimal"
                              value={hasPromoPriceDraft ? promoPriceDrafts[product.id] : currentPromoPrice}
                              onChange={(event) => {
                                const promoPrice = event.currentTarget.value;
                                setPromoPriceDrafts((current) => ({ ...current, [product.id]: promoPrice }));
                              }}
                              disabled={adminSaving}
                            />
                            <span>zł</span>
                          </span>
                        </label>
                        <div className="inventory-admin-promo-action">
                          <button
                            className={`inventory-admin-promo-toggle${promotionIsActive ? " is-active" : ""}`}
                            type="button"
                            aria-pressed={promotionIsActive}
                            onClick={() => togglePromotionDraft(product.id)}
                            disabled={adminSaving}
                          >
                            {promotionIsActive ? t.adminPage.deactivatePromotion : t.adminPage.activatePromotion}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
                <div className="inventory-admin-actions">
                  <span aria-live="polite">
                    {t.adminPage.pendingChanges(pendingChangeCount)}
                  </span>
                  <button
                    className="button inventory-admin-confirm"
                    type="button"
                    onClick={saveInventoryChanges}
                    disabled={pendingChangeCount === 0 || hasInvalidDrafts || hasInvalidPromotion || adminSaving || inventoryLoading}
                  >
                    {adminSaving ? t.adminPage.savingChanges : t.adminPage.confirmChanges}
                  </button>
                </div>
              </>
            )}
          </section>
        )}


      </main>


      {/* Show the complete cart and order form without leaving the catalog. */}
      {/* Pokazujemy koszyk i formularz bez opuszczania katalogu. */}
      <dialog
        ref={cartDialogRef}
        className="checkout-dialog"
        aria-labelledby="checkout-heading"
        onClose={() => setCartOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setCartOpen(false);
          }
        }}
      >
        <div className="checkout-dialog-content">
          <header className="checkout-dialog-header">
            <div>
              <p className="eyebrow">{t.checkout.eyebrow}</p>
              <h2 id="checkout-heading">{t.checkout.title}</h2>
            </div>
            <button
              type="button"
              className="checkout-close-button"
              aria-label={t.checkout.close}
              onClick={() => setCartOpen(false)}
            >
              ×
            </button>
          </header>
          <CheckoutPanel
            cartItems={cartItems}
            cartQuantity={cartQuantity}
            cartTotal={cartTotal}
            updateCart={updateCart}
            updateGiftBoxes={updateGiftBoxes}
            onSubmitOrder={submitOrder}
            t={t}
          />
        </div>
      </dialog>


      {/* Keep a direct checkout action near the thumb on mobile. */}
      {/* Zapewniamy szybki dostęp do zamówienia na urządzeniach mobilnych. */}
      {cartQuantity > 0 && (
        <div className="mobile-checkout-bar" role="region" aria-label={t.mobileBar.label}>
          <span>{cartQuantity} {t.checkout.pcs} · {cartTotal} zł</span>
          <button
            type="button"
            className="button button-dark"
            onClick={() => setCartOpen(true)}
          >
            {t.mobileBar.open}
          </button>
        </div>
      )}


      {/* =========================
          FOOTER
          STOPKA
      ========================== */}

      <footer className="footer">

        <strong>
          Złotkowska Pasieka
        </strong>


        <span>
          {t.footer}
        </span>

        {import.meta.env.DEV && <Link to="/admin" className="footer-admin-link">{t.adminPage.link}</Link>}

      </footer>

    </div>
  );
}


// Export the application component.
// Eksportujemy komponent aplikacji.
export default App;