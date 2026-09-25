// Import React so we can create React components.
// Importujemy React, aby móc tworzyć komponenty React.
import React from "react";

// Import the stylesheet used by this component.
// Importujemy arkusz stylów używany przez ten komponent.
import "./App.css";

// Store the products displayed on the website.
// Przechowujemy produkty wyświetlane na stronie.
const products = [
  {
    // Unique identifier for the product.
    // Unikalny identyfikator produktu.
    id: 1,

    // Product name.
    // Nazwa produktu.
    name: "Miód faceliowy",

    // Product description.
    // Opis produktu.
    description:
      "Naturalny miód faceliowy o delikatnym smaku, pozyskiwany z kwiatów facelii w okolicach Złotkowa.",

    // Product weight.
    // Waga produktu.
    weight: "500 g",

    // Product price.
    // Cena produktu.
    price: "30 zł",

    // Local product image stored inside the project.
    // Lokalne zdjęcie produktu zapisane w projekcie.
    image: "/MiodFaceliowy.png",
  },
];

// Main application component.
// Główny komponent aplikacji.
function App() {
  // Return the complete website interface.
  // Zwracamy kompletny interfejs strony internetowej.
  return (
    <div className="site">

      {/* =========================
          NAVIGATION
          NAWIGACJA
      ========================== */}

      {/* Main navigation bar.
      // Główny pasek nawigacyjny. */}
      <header className="navbar">

        {/* Brand / logo area.
        // Obszar marki / logo. */}
        <a href="#top" className="brand">

          {/* Local company logo.
          // Lokalne logo firmy. */}
          <img
            src="/ZlotkowskaPasiekaLogo.JPG"
            alt="Złotkowska Pasieka"
            className="brand-logo"
          />

          {/* Brand name.
          // Nazwa marki. */}
          <span>
            Złotkowska
            <strong>Pasieka</strong>
          </span>
        </a>

        {/* Navigation links.
        // Linki nawigacyjne. */}
        <nav className="nav-links">
          <a href="#miody">Miody</a>
          <a href="#pasieka">Nasza pasieka</a>
          <a href="#kontakt">Kontakt</a>
        </nav>

        {/* Main navigation call-to-action.
        // Główny przycisk nawigacji. */}
        <a href="#miody" className="nav-button">
          Odkryj miody
        </a>
      </header>


      {/* =========================
          HERO
          SEKCJA GŁÓWNA
      ========================== */}

      <main id="top">

        {/* Main hero section.
        // Główna sekcja strony. */}
        <section className="hero">

          {/* Decorative background element.
          // Dekoracyjny element tła. */}
          <div className="hero-glow"></div>

          {/* Hero text content.
          // Treść tekstowa sekcji głównej. */}
          <div className="hero-content">

            <p className="eyebrow">
              ZŁOTKOWO · POLSKA
            </p>

            <h1>
              Naturalny smak
              <span>prosto z pasieki.</span>
            </h1>

            <p className="hero-description">
              Prawdziwy miód z małej, lokalnej pasieki.
              Tworzony z troską o pszczoły, naturę i jakość.
            </p>

            <div className="hero-actions">

              <a href="#miody" className="button button-dark">
                Zobacz nasze miody
              </a>

              <a href="#pasieka" className="button button-light">
                Poznaj naszą historię
              </a>
            </div>

            <div className="hero-note">
              <span>✦</span>
              Naturalnie · Lokalnie · Z pasją
            </div>
          </div>

          {/* Hero visual.
          // Główna część wizualna sekcji. */}
          <div className="hero-visual">

            <div className="hero-image-wrapper">

              {/* Local honey image.
              // Lokalne zdjęcie miodu. */}
              <img
                src="/MiodFaceliowy.png"
                alt="Miód faceliowy Złotkowska Pasieka"
                className="hero-image"
              />

              {/* Floating product label.
              // Pływająca etykieta produktu. */}
              <div className="floating-card">
                <span>🍯</span>

                <div>
                  <small>Nasza pasieka</small>
                  <strong>Złotkowo</strong>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* =========================
            PRODUCTS
            PRODUKTY
        ========================== */}

        <section className="products-section" id="miody">

          <div className="section-heading">

            <p className="eyebrow">NASZE MIODY</p>

            <h2>
              Prosto z ula.
              <span>Bez zbędnych dodatków.</span>
            </h2>

            <p>
              Nasz miód powstaje w małej, lokalnej pasiece.
              Produkujemy go w ograniczonych ilościach, dbając
              o naturalny charakter każdej partii.
            </p>
          </div>

          <div className="product-grid">

            {products.map((product) => (

              <article className="product-card" key={product.id}>

                <div className="product-image-wrapper">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />

                  <span className="product-badge">
                    Naturalny
                  </span>
                </div>

                <div className="product-info">

                  <div className="product-title-row">

                    <h3>{product.name}</h3>

                    <span>{product.weight}</span>
                  </div>

                  <p>{product.description}</p>

                  <div className="product-footer">

                    <strong>{product.price}</strong>

                    <a href="#kontakt">
                      Zamów
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>


        {/* =========================
            ARTISAN PRODUCTION
            RZEMIEŚLNICZA PRODUKCJA
        ========================== */}

        <section className="production-section">

          {/* Production image.
          // Zdjęcie miejsca przechowywania miodu. */}
          <div className="production-image">

            <img
              src="/MiodPiwnica.jpg"
              alt="Miód przechowywany w piwnicy Złotkowskiej Pasieki"
            />
          </div>

          {/* Production content.
          // Treść dotycząca produkcji. */}
          <div className="production-content">

            <p className="eyebrow">
              MAŁA PRODUKCJA · WIELKA TROSKA
            </p>

            <h2>
              Miód przechowywany
              <span>z miłością.</span>
            </h2>

            <p>
              Nasz miód powstaje ręcznie, w niewielkich ilościach,
              z dala od przemysłowej produkcji. Każda partia jest
              traktowana indywidualnie i przechowywana z troską,
              aby zachować jej naturalny charakter.
            </p>

            <p>
              Nie stawiamy na masową produkcję. Stawiamy na jakość,
              lokalność i szacunek do pracy pszczół. Dzięki temu
              możemy oferować produkt wyjątkowy, naturalny i
              dostępny w ograniczonych ilościach.
            </p>

            <div className="production-values">

              <div>
                <strong>100%</strong>
                <span>lokalna pasieka</span>
              </div>

              <div>
                <strong>Małe</strong>
                <span>partie produkcyjne</span>
              </div>

              <div>
                <strong>Naturalny</strong>
                <span>charakter miodu</span>
              </div>

            </div>
          </div>
        </section>


        {/* =========================
            STORY
            HISTORIA
        ========================== */}

        <section className="story-section" id="pasieka">

          <div className="story-image">

            {/* Reuse the local honey image instead of an external image.
            // Ponownie wykorzystujemy lokalne zdjęcie miodu zamiast obrazu zewnętrznego. */}
            <img
              src="/MiodFaceliowy.png"
              alt="Miód faceliowy z Złotkowskiej Pasieki"
            />
          </div>

          <div className="story-content">

            <p className="eyebrow">
              NASZA HISTORIA
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
              Nasze pszczoły pracują wśród kwiatów Złotkowa,
              a my dbamy o to, aby ich miód zachował naturalny
              smak i charakter.
            </p>

            <a href="#kontakt" className="text-link">
              Skontaktuj się z nami
              <span>→</span>
            </a>
          </div>
        </section>


        {/* =========================
            CONTACT
            KONTAKT
        ========================== */}

        <section className="contact-section" id="kontakt">

          <div>

            <p className="eyebrow">
              ZAMÓWIENIA
            </p>

            <h2>
              Masz ochotę na
              <span>prawdziwy miód?</span>
            </h2>

            <p>
              Napisz do nas, aby dowiedzieć się więcej o dostępnych
              partiach miodu i możliwościach zamówienia.
            </p>
          </div>

          <a
            href="mailto:kontakt@example.com"
            className="button button-dark"
          >
            Napisz do nas
            <span>↗</span>
          </a>
        </section>
      </main>


      {/* =========================
          FOOTER
          STOPKA
      ========================== */}

      <footer className="footer">

        <strong>Złotkowska Pasieka</strong>

        <span>
          © 2026 · Złotkowo, Polska
        </span>
      </footer>
    </div>
  );
}

// Export the main application component.
// Eksportujemy główny komponent aplikacji.
export default App;
