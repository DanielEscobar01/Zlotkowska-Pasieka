// Import React so we can create React components.
// Importujemy React, aby móc tworzyć komponenty React.
import React from "react";

// Import the main stylesheet used by the application.
// Importujemy główny arkusz stylów używany przez aplikację.
import "./App.css";

// Import the local honey flower image from the assets folder.
// Importujemy lokalne zdjęcie miodu faceliowego z folderu assets.
import miodFaceliowy from "./assets/MiodFaceliowy.png";

// Import the honey cellar image from the assets folder.
// Importujemy zdjęcie piwnicy z miodem z folderu assets.
import miodPiwnica from "./assets/MiodPiwnica.jpg";

// Import the official Złotkowska Pasieka logo.
// Importujemy oficjalne logo Złotkowskiej Pasieki.
import logo from "./assets/ZlotkowskaPasiekaLogo.JPG";


// Store the products displayed on the website.
// Przechowujemy produkty wyświetlane na stronie.
const products = [
  {
    // Unique identifier for the product.
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

    // Use the local image imported from src/assets.
// Używamy lokalnego zdjęcia zaimportowanego z src/assets.
    image: miodFaceliowy,
  },

  {
    // Unique identifier for the second product.
// Unikalny identyfikator drugiego produktu.
    id: 2,

    // Product name.
// Nazwa produktu.
    name: "Miód akacjowy",

    // Product description.
// Opis produktu.
    description:
      "Jasny i łagodny miód o subtelnym smaku, idealny do codziennego spożycia.",

    // Product weight.
// Waga produktu.
    weight: "500 g",

    // Product price.
// Cena produktu.
    price: "30 zł",

    // Keep the second product image as a temporary placeholder.
// Pozostawiamy tymczasowe zdjęcie drugiego produktu.
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
    // Main website wrapper.
// Główny kontener strony.
    <div className="site">

      {/* =========================
          NAVIGATION
          NAWIGACJA
      ========================== */}

      {/* Main navigation bar.
// Główny pasek nawigacyjny. */}
      <header className="navbar">

        {/* Brand link leading back to the top of the page.
// Link marki prowadzący na górę strony. */}
        <a href="#top" className="brand">

          {/* Official Złotkowska Pasieka logo.
// Oficjalne logo Złotkowskiej Pasieki. */}
          <img
            src={logo}
            alt="Złotkowska Pasieka"
            className="brand-logo"
          />
        </a>

        {/* Main navigation links.
// Główne linki nawigacyjne. */}
        <nav className="nav-links">

          {/* Link to the honey products section.
// Link do sekcji z miodami. */}
          <a href="#miody">Miody</a>

          {/* Link to the story section.
// Link do sekcji historii. */}
          <a href="#pasieka">Nasza pasieka</a>

          {/* Link to the honey cellar section.
// Link do sekcji piwnicy z miodem. */}
          <a href="#piwnica">Nasza produkcja</a>

          {/* Link to the contact section.
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

            {/* Small location label.
// Mała etykieta lokalizacji. */}
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
// Opis sekcji głównej. */}
            <p className="hero-description">
              Poznaj naturalny miód produkowany przez nasze pszczoły
              w sercu Złotkowa.
            </p>

            {/* Hero action buttons.
// Przyciski sekcji głównej. */}
            <div className="hero-actions">

              {/* Main product button.
// Główny przycisk produktów. */}
              <a href="#miody" className="button button-dark">
                Zobacz nasze miody
              </a>

              {/* Story button.
// Przycisk prowadzący do historii pasieki. */}
              <a href="#pasieka" className="button button-light">
                Poznaj naszą historię
              </a>
            </div>

            {/* Small trust message.
// Mały komunikat budujący zaufanie. */}
            <div className="hero-note">
              <span>✦</span>
              Naturalnie · Lokalnie · Z pasją
            </div>
          </div>


          {/* Hero visual area.
// Obszar wizualny sekcji głównej. */}
          <div className="hero-visual">

            {/* Hero image wrapper.
// Kontener głównego zdjęcia. */}
            <div className="hero-image-wrapper">

              {/* Use the local honey image as the main hero image.
// Używamy lokalnego zdjęcia miodu jako głównego obrazu. */}
              <img
                src={miodFaceliowy}
                alt="Naturalny miód faceliowy ze Złotkowskiej Pasieki"
                className="hero-image"
              />

              {/* Floating information card.
// Pływająca karta informacyjna. */}
              <div className="floating-card">

                {/* Honey emoji used as a decorative element.
// Emoji miodu używane jako element dekoracyjny. */}
                <span>🍯</span>

                {/* Floating card text.
// Tekst pływającej karty. */}
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

          {/* Products heading.
// Nagłówek sekcji produktów. */}
          <div className="section-heading">

            {/* Section label.
// Etykieta sekcji. */}
            <p className="eyebrow">
              NASZE MIODY
            </p>

            {/* Section title.
// Tytuł sekcji. */}
            <h2>
              Prosto z ula.
              <span>Bez zbędnych dodatków.</span>
            </h2>

            {/* Product introduction.
// Wprowadzenie do produktów. */}
            <p>
              Nasze miody powstają w niewielkiej, lokalnej pasiece
              i zachowują charakter miejsca, z którego pochodzą.
            </p>
          </div>


          {/* Product grid.
// Siatka produktów. */}
          <div className="product-grid">

            {/* Render every product from the products array.
// Renderujemy każdy produkt z tablicy products. */}
            {products.map((product) => (

              /* Individual product card.
// Pojedyncza karta produktu. */
              <article className="product-card" key={product.id}>

                {/* Product image wrapper.
// Kontener zdjęcia produktu. */}
                <div className="product-image-wrapper">

                  {/* Product image.
// Zdjęcie produktu. */}
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

                  {/* Product title and weight.
// Nazwa produktu i jego waga. */}
                  <div className="product-title-row">

                    {/* Product name.
// Nazwa produktu. */}
                    <h3>{product.name}</h3>

                    {/* Product weight.
// Waga produktu. */}
                    <span>{product.weight}</span>
                  </div>


                  {/* Product description.
// Opis produktu. */}
                  <p>
                    {product.description}
                  </p>


                  {/* Product footer.
// Dolna część karty produktu. */}
                  <div className="product-footer">

                    {/* Product price.
// Cena produktu. */}
                    <strong>
                      {product.price}
                    </strong>

                    {/* Product order link.
// Link do zamówienia produktu. */}
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

            {/* Nature and beekeeping image.
// Zdjęcie natury i pszczelarstwa. */}
            <img
              src={miodPiwnica}
              alt="Miód przechowywany w Złotkowskiej Pasiece"
            />
          </div>


          {/* Story content.
// Treść historii. */}
          <div className="story-content">

            {/* Section label.
// Etykieta sekcji. */}
            <p className="eyebrow">
              NASZA HISTORIA
            </p>

            {/* Story heading.
// Nagłówek historii. */}
            <h2>
              Miód, który zaczyna się
              <span>w Złotkowie.</span>
            </h2>

            {/* First story paragraph.
// Pierwszy akapit historii. */}
            <p>
              Złotkowska Pasieka powstała z miłości do pszczół,
              natury i prostych, prawdziwych produktów.
            </p>

            {/* Second story paragraph.
// Drugi akapit historii. */}
            <p>
              Nasze pszczoły pracują wśród kwiatów Złotkowa,
              a my dbamy o to, aby miód zachował swój naturalny
              smak i charakter.
            </p>

            {/* Link to production section.
// Link do sekcji dotyczącej produkcji. */}
            <a href="#piwnica" className="text-link">
              Poznaj naszą produkcję
              <span>→</span>
            </a>
          </div>
        </section>


        {/* =========================
            HONEY CELLAR
            PIWNICA Z MIODEM
        ========================== */}

        {/* Honey cellar section.
// Sekcja piwnicy z miodem. */}
        <section className="cellar-section" id="piwnica">

          {/* Cellar image.
// Zdjęcie piwnicy. */}
          <div className="cellar-image">

            {/* Local honey cellar image.
// Lokalne zdjęcie piwnicy z miodem. */}
            <img
              src={miodPiwnica}
              alt="Piwnica, w której przechowywany jest miód Złotkowskiej Pasieki"
            />
          </div>


          {/* Cellar text content.
// Treść sekcji piwnicy. */}
          <div className="cellar-content">

            {/* Section label.
// Etykieta sekcji. */}
            <p className="eyebrow">
              MAŁA PRODUKCJA
            </p>

            {/* Main cellar heading.
// Główny nagłówek sekcji piwnicy. */}
            <h2>
              Tutaj miód
              <span>przechowujemy z troską.</span>
            </h2>

            {/* Production description.
// Opis produkcji. */}
            <p>
              Złotkowska Pasieka to niewielka, lokalna produkcja.
              Nasz miód powstaje w małych partiach, bez przemysłowej
              skali i bez zbędnych dodatków.
            </p>

            {/* Natural production description.
// Opis naturalnego charakteru produkcji. */}
            <p>
              Chcemy, aby każda partia zachowała swój naturalny
              charakter i była związana z miejscem, w którym
              pracują nasze pszczoły.
            </p>

            {/* Production characteristics.
// Cechy produkcji. */}
            <div className="cellar-features">

              {/* First feature.
// Pierwsza cecha. */}
              <div>
                <strong>Małe partie</strong>
                <span>Ograniczona produkcja</span>
              </div>

              {/* Second feature.
// Druga cecha. */}
              <div>
                <strong>Lokalnie</strong>
                <span>Złotkowo i okolice</span>
              </div>

              {/* Third feature.
// Trzecia cecha. */}
              <div>
                <strong>Naturalnie</strong>
                <span>Bez zbędnych dodatków</span>
              </div>
            </div>
          </div>
        </section>


        {/* =========================
            CONTACT
            KONTAKT
        ========================== */}

        {/* Contact section.
// Sekcja kontaktowa. */}
        <section className="contact-section" id="kontakt">

          {/* Contact text.
// Treść kontaktu. */}
          <div>

            {/* Contact label.
// Etykieta kontaktu. */}
            <p className="eyebrow">
              ZAMÓWIENIA
            </p>

            {/* Contact heading.
// Nagłówek kontaktu. */}
            <h2>
              Masz ochotę na
              <span>prawdziwy miód?</span>
            </h2>

            {/* Contact description.
// Opis kontaktu. */}
            <p>
              Napisz do nas, aby dowiedzieć się, jakie miody
              są aktualnie dostępne i jak możesz je zamówić.
            </p>
          </div>


          {/* Contact email button.
// Przycisk kontaktu przez e-mail. */}
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

      {/* Website footer.
// Stopka strony. */}
      <footer className="footer">

        {/* Footer brand.
// Marka w stopce. */}
        <strong>
          Złotkowska Pasieka
        </strong>

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
