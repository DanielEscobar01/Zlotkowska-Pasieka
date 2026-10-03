import { useEffect, useState } from "react";
import { siWhatsapp } from "simple-icons";

// Import the stylesheet used by the application.
// Importujemy arkusz stylów używany przez aplikację.
import "./App.css";

// Import the local images from the src/assets folder.
// Importujemy lokalne obrazy z folderu src/assets.
import NaturalMiod from "./assets/NaturalMiod.jpeg";
import MiodFaceliowy from "./assets/MiodFaceliowy.png";
import MiodPiwnica from "./assets/MiodPiwnica.jpg";
import ZlotkowskaPasiekaLogo from "./assets/ZlotkowskaPasiekaLogo.JPG";
import HoneyAcaciaFacelia12 from "./assets/miod-akacjowo-faceliowy-1-2-kg.jpeg";
import HoneyFacelia038 from "./assets/miod-faceliowy-0-38-kg.jpeg";
import HoneyFacelia12 from "./assets/miod-faceliowy-1-2-kg.jpeg";
import HoneyLinden038 from "./assets/miod-lipowy-0-38-kg.jpeg";
import HoneyMultifloral038 from "./assets/miod-wielokwiatowy-0-38-kg.jpeg";
import HoneyRapeseed038 from "./assets/miod-rzepakowy-0-38-kg.jpeg";
import HoneyRapeseed12 from "./assets/miod-rzepakowy-1-2-kg.jpeg";
import HerbalHoney038 from "./assets/ziolomiod-0-38-kg.jpeg";
import BeePollen from "./assets/pylek-pszczeli-0-5-kg.jpg";
import GiftSetThreeHoneys from "./assets/zestaw-prezentowy-3-miody-0-38-kg.jpg";
import GiftSetTwoHoneysAndPollen from "./assets/zestaw-prezentowy-2-miody-pylek.jpg";
import ProcessApiary from "./assets/proces-0-pasieka.jpeg";
import ProcessHoneyExtraction from "./assets/proces-1-wirowanie-miodu.jpeg";
import ProcessHoneycombFrames from "./assets/proces-2-plastry-w-ramkach.jpeg";
import ProcessFilteredHoney from "./assets/proces-4-miod-po-ekstrakcji.jpeg";
import ProcessFilledJars from "./assets/proces-5-gotowe-sloiki.jpeg";


const products = [
  {
    id: 1,
    name: "Miód rzepakowy",
    description: "Łagodny smak i jasna barwa. Szybko krystalizuje, tworząc kremową konsystencję, którą łatwo rozsmarować na pieczywie.",
    weight: "1,2 kg",
    price: 40,
    image: HoneyRapeseed12,
    badge: "Naturalny",
  },
  {
    id: 2,
    name: "Miód faceliowy",
    description: "Delikatny, kwiatowy aromat i subtelny smak. Dobra propozycja, jeśli szukasz łagodniejszej alternatywy dla rzepakowego.",
    weight: "1,2 kg",
    price: 45,
    image: HoneyFacelia12,
    badge: "Naturalny",
  },
  {
    id: 3,
    name: "Miód akacjowo-faceliowy",
    description: "Łączy łagodną słodycz akacji z kwiatowym aromatem facelii, tworząc delikatny, zbalansowany smak.",
    weight: "1,2 kg",
    price: 45,
    image: HoneyAcaciaFacelia12,
    badge: "Naturalny",
  },
  {
    id: 4,
    name: "Ziołomiód",
    description: "Wyrazisty, ziołowy aromat mięty, pokrzywy i wrotyczu. Alternatywa dla klasycznych miodów kwiatowych.",
    weight: "1,2 kg",
    price: 35,
    badge: "Naturalny",
  },
  {
    id: 5,
    name: "Miód rzepakowy",
    description: "Łagodny smak i jasna barwa. Szybko krystalizuje, tworząc kremową konsystencję, którą łatwo rozsmarować na pieczywie.",
    weight: "0,4 kg",
    price: 15,
    image: HoneyRapeseed038,
    badge: "Naturalny",
  },
  {
    id: 6,
    name: "Miód faceliowy",
    description: "Delikatny, kwiatowy aromat i subtelny smak. Dobra propozycja, jeśli szukasz łagodniejszej alternatywy dla rzepakowego.",
    weight: "0,4 kg",
    price: 20,
    image: HoneyFacelia038,
    badge: "Naturalny",
  },
  {
    id: 7,
    name: "Miód wielokwiatowy",
    description: "Powstaje z nektaru różnych kwiatów, dlatego jego smak i aromat mogą się różnić w zależności od sezonu.",
    weight: "0,4 kg",
    price: 20,
    image: HoneyMultifloral038,
    badge: "Naturalny",
  },
  {
    id: 8,
    name: "Miód lipowy",
    description: "Charakterystyczny, kwiatowy aromat lipy i wyrazistszy smak z delikatną, ziołową nutą.",
    weight: "0,4 kg",
    price: 20,
    image: HoneyLinden038,
    badge: "Naturalny",
  },
  {
    id: 9,
    name: "Ziołomiód",
    description: "Wyrazisty, ziołowy aromat mięty, pokrzywy i wrotyczu. Alternatywa dla klasycznych miodów kwiatowych.",
    weight: "0,4 kg",
    price: 15,
    image: HerbalHoney038,
    badge: "Naturalny",
  },
  {
    id: 10,
    name: "Pyłek pszczeli",
    description: "Ziarnisty produkt pszczeli o kwiatowo-roślinnym smaku. Można dodawać go do jogurtu, owsianki lub koktajlu.",
    weight: "0,5 kg",
    price: 30,
    image: BeePollen,
    badge: "Produkt pszczeli",
  },
  {
    id: 11,
    name: "Zestaw prezentowy",
    description: "Trzy rodzaje miodu po 0,38 kg w ozdobnym kartoniku. Pozwala spróbować różnych odmian.",
    weight: "3 × 0,38 kg",
    price: 50,
    image: GiftSetThreeHoneys,
    badge: "Prezent",
  },
  {
    id: 12,
    name: "Zestaw prezentowy",
    description: "Dwa rodzaje miodu po 0,38 kg oraz 200 g pyłku pszczelego w ozdobnym kartoniku.",
    weight: "2 × 0,38 kg + 200 g",
    price: 50,
    image: GiftSetTwoHoneysAndPollen,
    badge: "Prezent",
  },
  {
    id: 13,
    name: "Kartonik prezentowy",
    description: "Ozdobny kartonik do dużego lub średniego słoika. W uwagach do zamówienia napisz, które słoiki zapakować.",
    weight: "1 szt.",
    price: 5,
    badge: "Dodatek",
  },
];


// Show the available photos in the order honey moves from the apiary to finished jars.
// Pokazujemy dostępne zdjęcia w kolejności od pasieki do gotowych słoików.
const processSteps = [
  {
    // Identify the first process step.
    // Określamy numer pierwszego etapu procesu.
    number: "01",
    // Name the apiary stage.
    // Nazywamy etap pasieki.
    title: "Pasieka",
    // Explain what happens while bees gather nectar.
    // Wyjaśniamy, co dzieje się podczas zbierania nektaru przez pszczoły.
    description: "Pszczoły zbierają nektar, z którego powstaje miód.",
    // Show the apiary photo for this stage.
    // Pokazujemy zdjęcie pasieki dla tego etapu.
    image: ProcessApiary,
  },
  {
    // Identify the second process step.
    // Określamy numer drugiego etapu procesu.
    number: "02",
    // Name the frames containing ripe honey.
    // Nazywamy etap ramek z dojrzałym miodem.
    title: "Plastry w ramkach",
    // Explain that the frames are prepared for extraction.
    // Wyjaśniamy, że ramki są przygotowywane do miodobrania.
    description: "Dojrzałe plastry są przygotowywane do miodobrania.",
    // Show the honeycomb frames photo for this stage.
    // Pokazujemy zdjęcie ramek z plastrami dla tego etapu.
    image: ProcessHoneycombFrames,
  },
  {
    // Identify the third process step.
    // Określamy numer trzeciego etapu procesu.
    number: "03",
    // Name the honey extraction stage.
    // Nazywamy etap pozyskiwania miodu.
    title: "Miodobranie",
    // Explain that honey is separated from the combs.
    // Wyjaśniamy, że miód jest oddzielany od plastrów.
    description: "Miód jest oddzielany od plastrów w miodarce.",
    // Show the extractor photo for this stage.
    // Pokazujemy zdjęcie miodarki dla tego etapu.
    image: ProcessHoneyExtraction,
  },
  {
    // Identify the fourth process step.
    // Określamy numer czwartego etapu procesu.
    number: "04",
    // Name the honey collected after extraction.
    // Nazywamy etap zebranego miodu po ekstrakcji.
    title: "Świeży miód",
    // Explain that the honey is prepared for the next stage.
    // Wyjaśniamy, że miód jest przygotowywany do kolejnego etapu.
    description: "Zebrany miód trafia do dalszego przygotowania.",
    // Show the collected honey photo for this stage.
    // Pokazujemy zdjęcie zebranego miodu dla tego etapu.
    image: ProcessFilteredHoney,
  },
  {
    // Identify the fifth process step.
    // Określamy numer piątego etapu procesu.
    number: "05",
    // Name the finished jars.
    // Nazywamy etap gotowych słoików.
    title: "Gotowe słoiki",
    // Explain that jars are prepared for customer pickup.
    // Wyjaśniamy, że słoiki są przygotowywane do odbioru.
    description: "Miód jest rozlewany i przygotowywany do odbioru.",
    // Show the finished jars photo for this stage.
    // Pokazujemy zdjęcie gotowych słoików dla tego etapu.
    image: ProcessFilledJars,
  },
];


// Open a prepared WhatsApp order after the customer submits the form.
// Otwieramy przygotowane zamówienie w WhatsApp po wysłaniu formularza.
function handleOrderSubmit(event, cartItems, cartTotal) {
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

  // Read extra instructions, such as which jars need gift boxes.
  // Odczytujemy dodatkowe uwagi, na przykład które słoiki zapakować na prezent.
  const notes = formData.get("notes").trim();

  // Convert each cart row into a product line with its quantity and cost.
  // Zamieniamy każdy produkt z koszyka na wiersz z ilością i kosztem.
  const order = cartItems.map(({ product, quantity }) =>
    `${quantity} × ${product.name} (${product.weight}) - ${product.price * quantity} zł`
  ).join("\n");

  // Build the complete message that WhatsApp will open for the customer.
  // Tworzymy pełną wiadomość, którą WhatsApp otworzy dla klienta.
  const message = [
    // Start with a short greeting and order confirmation.
    // Zaczynamy od krótkiego powitania i informacji o zamówieniu.
    "Dzień dobry, składam zamówienie:",

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
    `Sposób odbioru: ${delivery}`,

    // Include notes only when the customer entered them.
    // Dodajemy uwagi tylko wtedy, gdy klient je wpisał.
    notes ? `Uwagi do zamówienia: ${notes}` : "",

    // Remove empty lines from optional fields and join everything into one message.
    // Usuwamy puste pola opcjonalne i łączymy treść w jedną wiadomość.
  ].filter(Boolean).join("\n");

  // Open the WhatsApp chat with the order text prefilled for the customer to send.
  // Otwieramy czat WhatsApp z gotową treścią, którą klient może wysłać.
  window.open(
    // Encode the message so Polish text and line breaks work in the URL.
    // Kodujemy wiadomość, aby polskie znaki i podziały wierszy działały w adresie.
    `https://wa.me/48571092031?text=${encodeURIComponent(message)}`,

    // Open WhatsApp in a separate tab.
    // Otwieramy WhatsApp w nowej karcie.
    "_blank",

    // Prevent the new tab from controlling the original page.
    // Uniemożliwiamy nowej karcie sterowanie pierwotną stroną.
    "noopener,noreferrer",
  );
}


// Main application component.
// Główny komponent aplikacji.
function App() {
  // Store the quantity of each product selected by its id.
  // Przechowujemy ilość każdego produktu pod jego identyfikatorem.
  const [cart, setCart] = useState({});

  // Track whether the compact mobile navigation menu is open.
  // Sprawdzamy, czy kompaktowe menu mobilne jest otwarte.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Track whether scrolling has started so the navigation can collapse.
  // Sprawdzamy, czy rozpoczęło się przewijanie, aby zwinąć nawigację.
  const [pageScrolled, setPageScrolled] = useState(false);

  // Keep only products with a positive quantity and attach that quantity.
  // Zostawiamy produkty z ilością większą od zera i przypisujemy im ilość.
  const cartItems = products
    .filter((product) => cart[product.id] > 0)
    .map((product) => ({ product, quantity: cart[product.id] }));

  // Count all individual units currently in the cart.
  // Zliczamy wszystkie sztuki znajdujące się w koszyku.
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate the total product cost, excluding shipping.
  // Obliczamy koszt produktów bez kosztu wysyłki.
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  function updateCart(productId, value) {
    // Convert the requested quantity to a non-negative whole number.
    // Zamieniamy podaną ilość na nieujemną liczbę całkowitą.
    const quantity = Math.max(0, Math.floor(Number(value) || 0));

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

  // Return the complete website.
// Zwracamy kompletną stronę internetową.
  return (
    <div className="site">

      {/* =========================
          NAVIGATION
          NAWIGACJA
      ========================== */}

      {/* Main navigation bar.
// Główny pasek nawigacyjny. */}
      <header id="top" className={`navbar${pageScrolled ? " is-scrolled" : ""}`}>

        {/* Brand link leading to the top of the page.
// Link marki prowadzący na górę strony. */}
        <a href="#top" className="brand">

          {/* Real company logo.
// Prawdziwe logo firmy. */}
          <img
            src={ZlotkowskaPasiekaLogo}
            alt="Złotkowska Pasieka"
            className="brand-logo"
          />

        </a>


        {/* Main navigation links.
// Główne linki nawigacyjne. */}
        <nav
          id="main-navigation"
          className={`nav-links${mobileMenuOpen ? " is-open" : ""}`}
        >

          {/* Link to honey products.
// Link do produktów z miodem. */}
          <a href="#miody" onClick={() => setMobileMenuOpen(false)}>Miody</a>

          {/* Link to the apiary story.
// Link do historii pasieki. */}
          <a href="#pasieka" onClick={() => setMobileMenuOpen(false)}>Nasza pasieka</a>

          {/* Link to contact.
// Link do kontaktu. */}
          <a href="#kontakt" onClick={() => setMobileMenuOpen(false)}>Kontakt</a>

        </nav>


        {/* Main navigation button.
// Główny przycisk nawigacji. */}
        <a
          href="#kontakt"
          className="nav-button cart-nav-button"
          aria-label={`Przejdź do koszyka, ${cartQuantity} produktów`}
        >
          Koszyk (<span key={cartQuantity} className="cart-count-pop">{cartQuantity}</span>)
        </a>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={mobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
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


      {/* =========================
          HERO
          SEKCJA GŁÓWNA
      ========================== */}

      {/* Main hero section.
// Główna sekcja hero. */}
      <main>

        <section className="hero">

          {/* Decorative background element.
// Dekoracyjny element tła. */}
          <div className="hero-glow"></div>


          {/* Hero text content.
// Treść tekstowa sekcji hero. */}
          <div className="hero-content">

            {/* Location label.
// Etykieta lokalizacji. */}
            <p className="eyebrow">
              ZŁOTKOWO K. POZNANIA
            </p>


            {/* Main website heading.
// Główny nagłówek strony. */}
            <h1>
              Naturalny smak
              <span>prosto z pasieki.</span>
            </h1>


            {/* Hero description.
// Opis sekcji hero. */}
            <p className="hero-description">
              Poznaj naturalny miód produkowany przez nasze pszczoły
              w sercu Złotkowa.
            </p>


            {/* Hero buttons.
// Przyciski sekcji hero. */}
            <div className="hero-actions">

              {/* Main products button.
// Główny przycisk produktów. */}
              <a href="#miody" className="button button-dark">
                Zobacz nasze miody
              </a>


              {/* Story button.
// Przycisk historii. */}
              <a href="#pasieka" className="button button-light">
                Poznaj naszą historię
              </a>

            </div>


            {/* Small brand statement.
// Małe hasło marki. */}
            <div className="hero-note">
              <span>✦</span>
              Naturalnie · Lokalnie · Z pasją
            </div>

          </div>


          {/* Hero image area.
// Obszar zdjęcia hero. */}
          <div className="hero-visual">

            <div className="hero-image-wrapper">

              {/* Main natural honey image.
// Główne zdjęcie naturalnego miodu. */}
              <img
                src={NaturalMiod}
                alt="Naturalny miód Złotkowskiej Pasieki"
                className="hero-image"
              />


            </div>

          </div>

        </section>


        {/* =========================
            PRODUCTS
            PRODUKTY
        ========================== */}

        <section className="products-section" id="miody">

          {/* Products section heading.
// Nagłówek sekcji produktów. */}
          <div className="section-heading">

            <p className="eyebrow">
              NASZE MIODY
            </p>


            <h2>
              Prosto z ula.
              <span>Bez zbędnych dodatków.</span>
            </h2>


            <p>
              Tworzymy miód w małej, lokalnej pasiece.
              Każdy słoik powstaje z dbałością o naturalny charakter produktu.
            </p>

          </div>


          {/* Product cards.
// Karty produktów. */}
          <div className="product-grid">

            {products.map((product) => (

              <article
                className="product-card"
                key={product.id}
              >

                {/* Product image.
// Zdjęcie produktu. */}
                {product.image && (
                  <div className="product-image-wrapper">
                    <img
                      src={product.image}
                      alt={`${product.name}, ${product.weight}`}
                      className="product-image"
                      loading="lazy"
                    />
                    <span className="product-badge">
                      {product.badge}
                    </span>
                  </div>
                )}


                {/* Product information.
// Informacje o produkcie. */}
                <div className="product-info">

                  <div className="product-title-row">

                    <h3>
                      {product.name}
                    </h3>

                    <span>
                      {product.weight}
                    </span>

                  </div>


                  <p>
                    {product.description}
                  </p>


                  <div className="product-footer">

                    <strong>
                      {product.price} zł
                    </strong>

                    <div className="product-quantity">
                      <span>Ilość</span>
                      <div
                        className="quantity-control"
                        role="group"
                        aria-label={`Liczba sztuk: ${product.name}, ${product.weight}`}
                      >
                        <button
                          type="button"
                          className="quantity-button"
                          aria-label={`Zmniejsz ilość: ${product.name}, ${product.weight}`}
                          disabled={!cart[product.id]}
                          onClick={() => updateCart(product.id, (cart[product.id] ?? 0) - 1)}
                        >
                          −
                        </button>
                        <output className="quantity-value" aria-live="polite">
                          {cart[product.id] ?? 0}
                        </output>
                        <button
                          type="button"
                          className="quantity-button"
                          aria-label={`Zwiększ ilość: ${product.name}, ${product.weight}`}
                          onClick={() => updateCart(product.id, (cart[product.id] ?? 0) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>


        {/* =========================
            CONTACT
            KONTAKT
        ========================== */}

        <section className="contact-section" id="kontakt">

          <div className="contact-copy">

            <p className="eyebrow">
              ZAMÓWIENIA
            </p>


            <h2>
              Masz ochotę na
              <span>prawdziwy miód?</span>
            </h2>


            <p>
              Po kliknięciu otworzy się WhatsApp z gotową treścią zamówienia.
              Wyślij wiadomość, a wkrótce potwierdzimy szczegóły i przekażemy
              informacje o płatności.
            </p>

            <a
              className="text-link contact-directions-link"
              href="https://www.google.com/maps/dir/?api=1&destination=Z%C5%82otkowo%2C%20ul.%20Lipowa%2020%2C%20Polska"
              target="_blank"
              rel="noreferrer"
            >
              Jak do nas trafić? Otwórz Google Maps
              <span>↗</span>
            </a>

          </div>


          <form
            className="contact-form"
            onSubmit={(event) => handleOrderSubmit(event, cartItems, cartTotal)}
          >
            <div className="cart-summary" aria-live="polite">
              <div className="cart-summary-heading">
                <h3>Twój koszyk</h3>
                <span>{cartQuantity} szt.</span>
              </div>

              {cartItems.length > 0 ? (
                <>
                  <ul className="cart-items">
                    {cartItems.map(({ product, quantity }) => (
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
                            Brak zdjęcia
                          </span>
                        )}
                        <div className="cart-item-info">
                          <span>{product.name} ({product.weight})</span>
                          <strong>{product.price * quantity} zł</strong>
                        </div>
                        <div className="cart-item-controls">
                          <div
                            className="quantity-control cart-quantity-control"
                            role="group"
                            aria-label={`Liczba sztuk: ${product.name}, ${product.weight}`}
                          >
                            <button
                              type="button"
                              className="quantity-button"
                              aria-label={`Zmniejsz ilość: ${product.name}, ${product.weight}`}
                              onClick={() => updateCart(product.id, quantity - 1)}
                            >
                              −
                            </button>
                            <output className="quantity-value" aria-live="polite">
                              {quantity}
                            </output>
                            <button
                              type="button"
                              className="quantity-button"
                              aria-label={`Zwiększ ilość: ${product.name}, ${product.weight}`}
                              onClick={() => updateCart(product.id, quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="cart-remove-button"
                            aria-label={`Usuń z koszyka: ${product.name}, ${product.weight}`}
                            onClick={() => updateCart(product.id, 0)}
                          >
                            Usuń
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <p className="cart-total">Koszt produktów: {cartTotal} zł</p>
                </>
              ) : (
                <p className="cart-empty">Koszyk jest pusty.</p>
              )}
            </div>

            <label className="form-field" htmlFor="name">
              Imię
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="given-name"
                placeholder="Twoje imię"
                required
              />
            </label>

            <fieldset className="delivery-options">
              <legend>Sposób odbioru zamówienia *</legend>
              <label>
                <input
                  type="radio"
                  name="delivery"
                  value="Odbiór osobisty: Złotkowo, ul. Lipowa 20"
                  required
                />
                Odbiór osobisty: Złotkowo, ul. Lipowa 20
              </label>
              <label>
                <input
                  type="radio"
                  name="delivery"
                  value="Inny: wysyłka InPost na terenie całej Polski"
                />
                Inny: wysyłka InPost na terenie całej Polski (dodatkowo płatna). Koszt dostawy ustalimy przez WhatsApp w zależności od wagi i liczby produktów w zamówieniu.
              </label>
            </fieldset>

            <label className="form-field" htmlFor="notes">
              Uwagi do zamówienia
              <textarea
                id="notes"
                name="notes"
                placeholder="Wpisz, które słoiki zapakować w ozdobne kartoniki (5 zł/szt.)."
                rows="3"
              />
            </label>

            <button
              className="button button-dark form-submit"
              type="submit"
              disabled={cartItems.length === 0}
            >
              <svg
                className="whatsapp-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path fill="currentColor" d={siWhatsapp.path} />
              </svg>
              Zamów przez WhatsApp
            </button>
          </form>

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
              alt="Miód przechowywany w Złotkowskiej Pasiece"
            />

          </div>


          {/* Story text.
// Tekst historii. */}
          <div className="story-content">

            <p className="eyebrow">
              NASZA PASIEKA
            </p>


            <h2>
              Miód, który zaczyna się
              <span>w Złotkowie.</span>
            </h2>


            <p>
              Złotkowska Pasieka powstała z miłości do pszczół,
              natury i prostych, prawdziwych produktów.
            </p>


            <p>
              Nasz miód powstaje w małej, lokalnej pasiece.
              Pszczoły pracują wśród naturalnych kwiatów,
              a my dbamy o to, aby każda partia zachowała
              swój naturalny smak i charakter.
            </p>


            <p>
              Nie jesteśmy przemysłową produkcją.
              Pracujemy w ograniczonych ilościach, bez chemicznych
              dodatków i bez masowej produkcji. Każdy słoik
              powstaje z troską i szacunkiem dla natury.
            </p>


            <a href="#kontakt" className="text-link">
              Dowiedz się więcej
              <span>→</span>
            </a>

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
              src={MiodFaceliowy}
              alt="Naturalny miód faceliowy"
            />

          </div>


          {/* Natural production text.
// Tekst dotyczący naturalnej produkcji. */}
          <div className="story-content">

            <p className="eyebrow">
              MAŁA PRODUKCJA
            </p>


            <h2>
              Prawdziwy miód.
              <span>Bez przemysłowego charakteru.</span>
            </h2>


            <p>
              Produkujemy miód ręcznie i w ograniczonych ilościach.
              Dzięki temu możemy poświęcić uwagę każdej partii
              i zachować jej naturalny charakter.
            </p>


            <p>
              Bez masowej produkcji, bez niepotrzebnych dodatków
              i z szacunkiem dla pracy pszczół.
            </p>

          </div>

        </section>


        {/* Explain the visible steps from the apiary to the finished jars. */}
        {/* Pokazujemy dostępne etapy od pasieki do gotowych słoików. */}
        <section className="process-section" aria-labelledby="process-heading">
          <div className="process-heading">
            <p className="eyebrow">OD PASIEKI DO SŁOIKA</p>
            <h2 id="process-heading">Jak powstaje nasz miód?</h2>
            <p>Od pracy pszczół po przygotowanie słoików do odbioru.</p>
          </div>

          <ol className="process-grid">
            {processSteps.map((step) => (
              <li className="process-card" key={step.number}>
                <img
                  className="process-image"
                  src={step.image}
                  alt={step.title}
                  loading="lazy"
                />
                <p className="process-number">{step.number}</p>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>


        <section className="map-section" aria-labelledby="map-heading">
          <div className="map-copy">
            <p className="eyebrow">ODBIÓR OSOBISTY</p>
            <h2 id="map-heading">Jak do nas trafić?</h2>
            <p>Złotkowo k. Poznania, ul. Lipowa 20</p>
            <a
              className="button button-dark map-link"
              href="https://www.google.com/maps/dir/?api=1&destination=Z%C5%82otkowo%2C%20ul.%20Lipowa%2020%2C%20Polska"
              target="_blank"
              rel="noreferrer"
            >
              Otwórz trasę w Google Maps
              <span>↗</span>
            </a>
          </div>
          <div className="map-preview">
            <iframe
              src="https://maps.google.com/maps?q=Z%C5%82otkowo%2C%20ul.%20Lipowa%2020%2C%20Polska&output=embed"
              title="Mapa dojazdu do Złotkowskiej Pasieki w Złotkowie"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>


      </main>


      {/* =========================
          FOOTER
          STOPKA
      ========================== */}

      <footer className="footer">

        <strong>
          Złotkowska Pasieka
        </strong>


        <span>
          © 2026 · Złotkowo, Polska
        </span>

      </footer>

    </div>
  );
}


// Export the application component.
// Eksportujemy komponent aplikacji.
export default App;