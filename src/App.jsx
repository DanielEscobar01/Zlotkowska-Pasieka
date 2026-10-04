import { useEffect, useRef, useState } from "react";
import { siWhatsapp } from "simple-icons";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

// Import the stylesheet used by the application.
// Importujemy arkusz stylów używany przez aplikację.
import "./App.css";
import { LANGUAGES, LANGUAGE_NAMES_PL, translations } from "./i18n";
import LanguagePicker from "./LanguagePicker";

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


// Names and descriptions live in i18n.js under products[textKey].
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


// One card per product; sizes of the same honey become selectable variants (smallest first).
const productGroups = Object.values(
  products.reduce((groups, product) => {
    (groups[product.textKey] ??= []).push(product);
    return groups;
  }, {}),
).map((variants) => {
  const sorted = [...variants].sort((a, b) => a.price - b.price);
  return { key: sorted[0].id, variants: sorted };
});


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
  return (
    <div className={`quantity-control ${className}`} role="group" aria-label={label}>
      <button
        type="button"
        className="quantity-button"
        aria-label={`${t.product.decrease}: ${label}`}
        disabled={value <= 0}
        onClick={() => onChange(value - 1)}
      >
        −
      </button>
      <output className="quantity-value" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="quantity-button"
        aria-label={`${t.product.increase}: ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
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


// Main application component.
// Główny komponent aplikacji.
function App() {
  // Read the current hash route so the shared shell can show the right page.
  // Odczytujemy bieżącą trasę z hash, aby wspólny układ pokazał właściwą stronę.
  const location = useLocation();
  const navigate = useNavigate();

  // Map each supported route to its page-specific CSS visibility class.
  // Przypisujemy każdej trasie klasę określającą widoczną zawartość strony.
  const pageClass = location.pathname === "/miody"
    ? "page-products"
    : location.pathname === "/pasieka"
      ? "page-apiary"
      : "page-home";

  // Store the quantity of each product selected by its id.
  // Przechowujemy ilość każdego produktu pod jego identyfikatorem.
  const [cart, setCart] = useState({});
  const [giftBoxes, setGiftBoxes] = useState({});
  const [selectedVariants, setSelectedVariants] = useState({});

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

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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
  const cartItems = products
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

  function updateGiftBoxes(productId, value) {
    const count = Math.max(0, Math.min(Math.floor(Number(value) || 0), cart[productId] ?? 0));
    setGiftBoxes((current) => ({ ...current, [productId]: count }));
  }

  function updateCart(productId, value) {
    // Convert the requested quantity to a non-negative whole number.
    // Zamieniamy podaną ilość na nieujemną liczbę całkowitą.
    const quantity = Math.max(0, Math.floor(Number(value) || 0));

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
    window.scrollTo({ top: 0, behavior: "instant" });
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
          <span className="brand-since">{t.nav.since}</span>

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

          {/* Link to the apiary story.
// Link do historii pasieki. */}
          <NavLink to="/pasieka" onClick={() => setMobileMenuOpen(false)}>{t.nav.apiary}</NavLink>

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
              <Link to="/miody" className="button button-dark">
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

        <section className="products-section" id="miody">

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
                className="product-card"
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


                  <ul className="variant-rows">
                    {variants.map((variant) => {
                      const quantity = cart[variant.id] ?? 0;
                      const selectThis = () => setSelectedVariants((current) => ({ ...current, [key]: variant.id }));

                      return (
                        <li key={variant.id} className="variant-row">
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
                            <strong>{variant.price} zł</strong>
                            <Stepper
                              label={`${t.product.quantity}: ${text.name}, ${variant.weight}`}
                              value={quantity}
                              onChange={(value) => {
                                selectThis();
                                updateCart(variant.id, value);
                              }}
                              t={t}
                            />
                          </div>

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

      </footer>

    </div>
  );
}


// Export the application component.
// Eksportujemy komponent aplikacji.
export default App;