import { useState } from "react";

// Import the stylesheet used by the application.
// Importujemy arkusz stylów używany przez aplikację.
import "./App.css";

// Import the local images from the src/assets folder.
// Importujemy lokalne obrazy z folderu src/assets.
import NaturalMiod from "./assets/NaturalMiod.jpeg";
import MiodFaceliowy from "./assets/MiodFaceliowy.png";
import MiodPiwnica from "./assets/MiodPiwnica.jpg";
import ZlotkowskaPasiekaLogo from "./assets/ZlotkowskaPasiekaLogo.JPG";


const products = [
  {
    id: 1,
    name: "Miód rzepakowy",
    description: "Naturalny miód z lokalnej pasieki.",
    weight: "1,2 kg",
    price: 40,
    image: NaturalMiod,
    badge: "Naturalny",
  },
  {
    id: 2,
    name: "Miód faceliowy",
    description: "Naturalny miód z lokalnej pasieki.",
    weight: "1,2 kg",
    price: 45,
    image: MiodFaceliowy,
    badge: "Naturalny",
  },
  {
    id: 3,
    name: "Miód akacjowo-faceliowy",
    description: "Naturalny miód z lokalnej pasieki.",
    weight: "1,2 kg",
    price: 45,
    image: NaturalMiod,
    badge: "Naturalny",
  },
  {
    id: 4,
    name: "Ziołomiód",
    description: "Mięta, pokrzywa, wrotycz.",
    weight: "1,2 kg",
    price: 35,
    image: NaturalMiod,
    badge: "Naturalny",
  },
  {
    id: 5,
    name: "Miód rzepakowy",
    description: "Naturalny miód z lokalnej pasieki.",
    weight: "0,4 kg",
    price: 15,
    image: NaturalMiod,
    badge: "Naturalny",
  },
  {
    id: 6,
    name: "Miód faceliowy",
    description: "Naturalny miód z lokalnej pasieki.",
    weight: "0,4 kg",
    price: 20,
    image: MiodFaceliowy,
    badge: "Naturalny",
  },
  {
    id: 7,
    name: "Miód wielokwiatowy",
    description: "Naturalny miód z lokalnej pasieki.",
    weight: "0,4 kg",
    price: 20,
    image: NaturalMiod,
    badge: "Naturalny",
  },
  {
    id: 8,
    name: "Miód lipowy",
    description: "Naturalny miód z lokalnej pasieki.",
    weight: "0,4 kg",
    price: 20,
    image: NaturalMiod,
    badge: "Naturalny",
  },
  {
    id: 9,
    name: "Ziołomiód",
    description: "Mięta, pokrzywa, wrotycz.",
    weight: "0,4 kg",
    price: 15,
    image: NaturalMiod,
    badge: "Naturalny",
  },
  {
    id: 10,
    name: "Pyłek pszczeli",
    description: "Pyłek pszczeli z lokalnej pasieki.",
    weight: "0,5 kg",
    price: 30,
    image: MiodPiwnica,
    badge: "Produkt pszczeli",
  },
  {
    id: 11,
    name: "Zestaw prezentowy",
    description: "3 rodzaje miodu po 0,38 kg w ozdobnym kartoniku.",
    weight: "3 × 0,38 kg",
    price: 50,
    image: MiodPiwnica,
    badge: "Prezent",
  },
  {
    id: 12,
    name: "Zestaw prezentowy",
    description: "2 rodzaje miodu po 0,38 kg i 200 g pyłku pszczelego w ozdobnym kartoniku.",
    weight: "2 × 0,38 kg + 200 g",
    price: 50,
    image: MiodPiwnica,
    badge: "Prezent",
  },
  {
    id: 13,
    name: "Kartonik prezentowy",
    description: "Duży lub średni słoik można zapakować w ozdobny kartonik.",
    weight: "1 szt.",
    price: 5,
    image: MiodPiwnica,
    badge: "Dodatek",
  },
];


function handleOrderSubmit(event, cartItems, cartTotal) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = formData.get("name").trim();
  const delivery = formData.get("delivery");
  const notes = formData.get("notes").trim();
  const order = cartItems.map(({ product, quantity }) =>
    `${quantity} × ${product.name} (${product.weight}) - ${product.price * quantity} zł`
  ).join("\n");
  const message = [
    "Dzień dobry, składam zamówienie:",
    `Imię: ${name}`,
    "",
    order,
    `Suma produktów: ${cartTotal} zł`,
    "",
    `Sposób odbioru: ${delivery}`,
    notes ? `Uwagi do zamówienia: ${notes}` : "",
  ].filter(Boolean).join("\n");

  window.open(
    `https://wa.me/48571092031?text=${encodeURIComponent(message)}`,
    "_blank",
    "noopener,noreferrer",
  );
}


// Main application component.
// Główny komponent aplikacji.
function App() {
  const [cart, setCart] = useState({});
  const cartItems = products
    .filter((product) => cart[product.id] > 0)
    .map((product) => ({ product, quantity: cart[product.id] }));
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  function updateCart(productId, value) {
    const quantity = Math.max(0, Math.floor(Number(value) || 0));

    setCart((currentCart) => {
      const nextCart = { ...currentCart };

      if (quantity === 0) {
        delete nextCart[productId];
      } else {
        nextCart[productId] = quantity;
      }

      return nextCart;
    });
  }

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
      <header className="navbar">

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
        <nav className="nav-links">

          {/* Link to honey products.
// Link do produktów z miodem. */}
          <a href="#miody">Miody</a>

          {/* Link to the apiary story.
// Link do historii pasieki. */}
          <a href="#pasieka">Nasza pasieka</a>

          {/* Link to contact.
// Link do kontaktu. */}
          <a href="#kontakt">Kontakt</a>

        </nav>


        {/* Main navigation button.
// Główny przycisk nawigacji. */}
        <a href="#miody" className="nav-button">
          Odkryj miody
        </a>

      </header>


      {/* =========================
          HERO
          SEKCJA GŁÓWNA
      ========================== */}

      {/* Main hero section.
// Główna sekcja hero. */}
      <main id="top">

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
              ZŁOTKOWO · POLSKA
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
                <div className="product-image-wrapper">

                  <img
                    src={product.image}
                    alt=""
                    className="product-image"
                  />


                  <span className="product-badge">
                    {product.badge}
                  </span>

                </div>


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

                    <label className="product-quantity">
                      Ilość
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={cart[product.id] ?? 0}
                        aria-label={`Liczba sztuk: ${product.name}, ${product.weight}`}
                        onChange={(event) => updateCart(product.id, event.target.value)}
                      />
                    </label>

                  </div>

                </div>

              </article>

            ))}

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
                      <li key={product.id}>
                        <span>{quantity} × {product.name} ({product.weight})</span>
                        <strong>{product.price * quantity} zł</strong>
                      </li>
                    ))}
                  </ul>
                  <p className="cart-total">Suma produktów: {cartTotal} zł</p>
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
                  value="Odbiór osobisty - Złotkowo, ul. Lipowa 20"
                  required
                />
                Odbiór osobisty - Złotkowo, ul. Lipowa 20
              </label>
              <label>
                <input
                  type="radio"
                  name="delivery"
                  value="Inny - do ustalenia telefonicznie"
                />
                Inny - do ustalenia telefonicznie - <a href="tel:+48698095824">698 095 824</a>
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
              Zamów przez WhatsApp
              <span>↗</span>
            </button>
          </form>

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