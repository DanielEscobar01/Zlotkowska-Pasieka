// Import React so we can create the application component.
// Importujemy React, aby móc tworzyć główny komponent aplikacji.
import React from "react";

// Import the stylesheet used by the application.
// Importujemy arkusz stylów używany przez aplikację.
import "./App.css";

// Import the local images from the src/assets folder.
// Importujemy lokalne obrazy z folderu src/assets.
import NaturalMiod from "./assets/NaturalMiod.jpeg";
import MiodFaceliowy from "./assets/MiodFaceliowy.png";
import MiodPiwnica from "./assets/MiodPiwnica.jpg";
import ZlotkowskaPasiekaLogo from "./assets/ZlotkowskaPasiekaLogo.JPG";


// Store the products displayed on the website.
// Przechowujemy produkty wyświetlane na stronie.
const products = [
  {
    // Unique product identifier.
    // Unikalny identyfikator produktu.
    id: 1,

    // Product name.
    // Nazwa produktu.
    name: "Miód wielokwiatowy",

    // Product description.
    // Opis produktu.
    description:
      "Naturalny miód o delikatnym, kwiatowym smaku, pozyskiwany w okolicach Złotkowa.",

    // Product weight.
    // Waga produktu.
    weight: "500 g",

    // Product price.
    // Cena produktu.
    price: "25 zł",

    // Use the local facelia honey image.
    // Używamy lokalnego zdjęcia miodu faceliowego.
    image: MiodFaceliowy,
  },

  {
    // Unique product identifier.
    // Unikalny identyfikator produktu.
    id: 2,

    // Product name.
    // Nazwa produktu.
    name: "Miód naturalny",

    // Product description.
    // Opis produktu.
    description:
      "Naturalny miód produkowany w małej pasiece, bez przemysłowej produkcji i zbędnych dodatków.",

    // Product weight.
    // Waga produktu.
    weight: "500 g",

    // Product price.
    // Cena produktu.
    price: "30 zł",

    // Use the natural honey image.
    // Używamy zdjęcia naturalnego miodu.
    image: NaturalMiod,
  },
];


// Main application component.
// Główny komponent aplikacji.
function App() {
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


              {/* Small floating information card.
// Mała pływająca karta informacyjna. */}
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
                    alt={product.name}
                    className="product-image"
                  />


                  <span className="product-badge">
                    Naturalny
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
                      {product.price}
                    </strong>


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
              miodach i aktualnych partiach produkcyjnych.
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