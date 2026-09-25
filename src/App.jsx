// Import React so we can create React components.
// Importujemy React, aby móc tworzyć komponenty React.
import React from "react";

// Import the stylesheet used by this component.
// Importujemy arkusz stylów używany przez ten komponent.
import "./App.css";

// Store the temporary products in an array.
// Przechowujemy tymczasowe produkty w tablicy.
const products = [
  {
    // Unique identifier for the product.
// Unikalny identyfikator produktu.
    id: 1,

    // Product name displayed to the customer.
// Nazwa produktu wyświetlana klientowi.
    name: "Miód wielokwiatowy",

    // Short product description.
// Krótki opis produktu.
    description:
      "Naturalny miód o delikatnym, kwiatowym smaku, pozyskiwany w okolicach Złotkowa.",

    // Product weight.
// Waga produktu.
    weight: "500 g",

    // Temporary test price.
// Tymczasowa cena testowa.
    price: "25 zł",

    // Temporary image from Unsplash.
// Tymczasowe zdjęcie z Unsplash.
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d14?auto=format&fit=crop&w=900&q=85",
  },

  {
    // Unique identifier for the second product.
// Unikalny identyfikator drugiego produktu.
    id: 2,

    // Product name.
// Nazwa produktu.
    name: "Miód akacjowy",

    // Short product description.
// Krótki opis produktu.
    description:
      "Jasny i łagodny miód o subtelnym smaku, idealny do codziennego spożycia.",

    // Product weight.
// Waga produktu.
    weight: "500 g",

    // Temporary test price.
// Tymczasowa cena testowa.
    price: "30 zł",

    // Temporary image.
// Tymczasowe zdjęcie.
    image:
      "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=900&q=85",
  },
];

// Main application component.
// Główny komponent aplikacji.
function App() {
  // Return the complete website interface.
// Zwracamy kompletny interfejs strony internetowej.
  return (
    // Main page wrapper.
// Główny kontener strony.
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

          {/* Small decorative bee symbol.
// Mały dekoracyjny symbol pszczoły. */}
          <span className="brand-icon">✦</span>

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

          {/* Link to products section.
// Link do sekcji produktów. */}
          <a href="#miody">Miody</a>

          {/* Link to story section.
// Link do sekcji historii. */}
          <a href="#pasieka">Nasza pasieka</a>

          {/* Link to contact section.
// Link do sekcji kontaktowej. */}
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

      {/* Main hero section.
// Główna sekcja strony. */}
      <main id="top">

        {/* Hero container.
// Kontener sekcji głównej. */}
        <section className="hero">

          {/* Decorative background element.
// Dekoracyjny element tła. */}
          <div className="hero-glow"></div>

          {/* Hero text content.
// Treść tekstowa sekcji głównej. */}
          <div className="hero-content">

            {/* Small eyebrow text.
// Mały tekst nad nagłówkiem. */}
            <p className="eyebrow">
              ZŁOTKOWO · POLSKA
            </p>

            {/* Main page heading.
// Główny nagłówek strony. */}
            <h1>
              Naturalny smak
              <span>prosto z pasieki.</span>
            </h1>

            {/* Hero description.
// Opis sekcji głównej. */}
            <p className="hero-description">
              Poznaj naturalny miód produkowany przez nasze pszczoły
              w sercu Złotkowa.
            </p>

            {/* Hero actions.
// Przyciski sekcji głównej. */}
            <div className="hero-actions">

              {/* Primary action.
// Główny przycisk. */}
              <a href="#miody" className="button button-dark">
                Zobacz nasze miody
              </a>

              {/* Secondary action.
// Drugi przycisk. */}
              <a href="#pasieka" className="button button-light">
                Poznaj naszą historię
              </a>
            </div>

            {/* Small trust indicator.
// Mały element budujący zaufanie. */}
            <div className="hero-note">
              <span>✦</span>
              Naturalnie · Lokalnie · Z pasją
            </div>
          </div>

          {/* Hero visual.
// Główna część wizualna sekcji. */}
          <div className="hero-visual">

            {/* Main honey image.
// Główne zdjęcie miodu. */}
            <div className="hero-image-wrapper">

              <img
                src="https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1200&q=90"
                alt="Naturalny miód w szklanym słoiku"
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

        {/* Products section.
// Sekcja produktów. */}
        <section className="products-section" id="miody">

          {/* Section heading.
// Nagłówek sekcji. */}
          <div className="section-heading">

            {/* Small section label.
// Mała etykieta sekcji. */}
            <p className="eyebrow">NASZE MIODY</p>

            {/* Section title.
// Tytuł sekcji. */}
            <h2>
              Prosto z ula.
              <span>Bez zbędnych dodatków.</span>
            </h2>

            {/* Section description.
// Opis sekcji. */}
            <p>
              Poznaj nasze pierwsze dwa produkty. To tylko wersja testowa —
              później zastąpimy je prawdziwą ofertą Złotkowskiej Pasieki.
            </p>
          </div>

          {/* Product grid.
// Siatka produktów. */}
          <div className="product-grid">

            {/* Loop through every product.
// Przechodzimy przez każdy produkt. */}
            {products.map((product) => (

              /* Product card.
// Karta produktu. */
              <article className="product-card" key={product.id}>

                {/* Product image.
// Zdjęcie produktu. */}
                <div className="product-image-wrapper">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />

                  {/* Product category badge.
// Etykieta kategorii produktu. */}
                  <span className="product-badge">
                    Naturalny
                  </span>
                </div>

                {/* Product information.
// Informacje o produkcie. */}
                <div className="product-info">

                  {/* Product name and weight.
// Nazwa produktu i waga. */}
                  <div className="product-title-row">

                    <h3>{product.name}</h3>

                    <span>{product.weight}</span>
                  </div>

                  {/* Product description.
// Opis produktu. */}
                  <p>{product.description}</p>

                  {/* Product footer.
// Dolna część karty produktu. */}
                  <div className="product-footer">

                    {/* Product price.
// Cena produktu. */}
                    <strong>{product.price}</strong>

                    {/* Product action.
// Przycisk produktu. */}
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

        {/* Story section.
// Sekcja historii. */}
        <section className="story-section" id="pasieka">

          {/* Story image.
// Zdjęcie sekcji historii. */}
          <div className="story-image">

            <img
              src="https://images.unsplash.com/photo-1498604953570-6c5b7c3d3a6b?auto=format&fit=crop&w=1000&q=85"
              alt="Pszczoły i natura"
            />
          </div>

          {/* Story content.
// Treść sekcji historii. */}
          <div className="story-content">

            {/* Section label.
// Etykieta sekcji. */}
            <p className="eyebrow">NASZA HISTORIA</p>

            {/* Story title.
// Tytuł historii. */}
            <h2>
              Miód, który zaczyna się
              <span>w Złotkowie.</span>
            </h2>

            {/* Story paragraph.
// Akapit historii. */}
            <p>
              Złotkowska Pasieka powstała z miłości do pszczół,
              natury i prostych, prawdziwych produktów.
            </p>

            {/* Story paragraph.
// Kolejny akapit historii. */}
            <p>
              Nasze pszczoły pracują wśród kwiatów Złotkowa,
              a my dbamy o to, aby ich miód zachował naturalny
              smak i charakter.
            </p>

            {/* Story button.
// Przycisk historii. */}
            <a href="#kontakt" className="text-link">
              Dowiedz się więcej
              <span>→</span>
            </a>
          </div>
        </section>


        {/* =========================
            CONTACT
            KONTAKT
        ========================== */}

        {/* Contact section.
// Sekcja kontaktowa. */}
        <section className="contact-section" id="kontakt">

          {/* Contact content.
// Treść sekcji kontaktowej. */}
          <div>

            {/* Contact label.
// Etykieta kontaktu. */}
            <p className="eyebrow">ZAMÓWIENIA</p>

            {/* Contact title.
// Tytuł kontaktu. */}
            <h2>
              Masz ochotę na
              <span>prawdziwy miód?</span>
            </h2>

            {/* Contact description.
// Opis kontaktu. */}
            <p>
              Napisz do nas. Wkrótce będziesz mógł zamówić
              nasze miody bezpośrednio przez WhatsApp.
            </p>
          </div>

          {/* Contact button.
// Przycisk kontaktowy. */}
          <a href="mailto:kontakt@example.com" className="button button-dark">
            Napisz do nas
            <span>↗</span>
          </a>
        </section>
      </main>


      {/* =========================
          FOOTER
          STOPKA
      ========================== */}

      {/* Website footer.
// Stopka strony. */}
      <footer className="footer">

        {/* Footer brand.
// Marka w stopce. */}
        <strong>Złotkowska Pasieka</strong>

        {/* Copyright information.
// Informacja o prawach autorskich. */}
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