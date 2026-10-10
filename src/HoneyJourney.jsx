import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Link } from "react-router-dom";
import RapeseedJar from "./assets/journey/MiodRzepakowy1200g.webp";
import PhaceliaJar from "./assets/journey/MiodFaceliowy1200g.webp";
import AcaciaJar from "./assets/journey/MiodAkacjowoFaceliowy1200g.webp";
import WildflowerJar from "./assets/journey/MiodWielokwiatowy380g.webp";
import LindenJar from "./assets/journey/MiodLipowy380g.webp";
import HerbalJar from "./assets/journey/Ziolomiod380g.webp";

const sceneImages = {
  rapeseed: RapeseedJar,
  facelia: PhaceliaJar,
  acaciaFacelia: AcaciaJar,
  multifloral: WildflowerJar,
  linden: LindenJar,
  herbal: HerbalJar,
};

// Cada clave conecta una variante de producto con la fotografía de su escena narrativa.
// Każdy klucz łączy wariant produktu ze zdjęciem jego sceny.
function HoneyScene({ product, text, t }) {
  const profile = t.varietiesSection.profiles?.[product.textKey];
  const sceneRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  // El progreso del scroll alimenta luz, escala y opacidad; reduced motion evita esas animaciones.
  // Postęp przewijania steruje światłem, skalą i kryciem; reduced motion wyłącza te animacje.
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 32,
    mass: 0.5,
    restDelta: 0.001,
  });
  const backgroundColor = useTransform(progress, [0, 0.3, 0.6, 1], ["#f8f9fb", "#f0f3f7", "#f0f3f7", "#f8f9fb"]);
  const opacity = useTransform(progress, [0.1, 0.3, 0.75, 0.95], [0.8, 1, 1, 0.8]);
  const productScale = useTransform(progress, [0.15, 0.6, 0.95], [0.78, 1.06, 1.06]);
  const warmGlowOpacity = useTransform(progress, [0.1, 0.4, 0.7, 0.95], [0.12, 0.3, 0.3, 0.12]);
  const coolGlowOpacity = useTransform(progress, [0.1, 0.4, 0.7, 0.95], [0.08, 0.2, 0.2, 0.08]);
  const productLight = useTransform(progress, [0.1, 0.4, 0.7, 0.95], [
    "drop-shadow(0px 22px 24px rgba(32,38,48,0.13)) drop-shadow(0px 0px 8px rgba(237,170,84,0.04))",
    "drop-shadow(0px 22px 24px rgba(32,38,48,0.13)) drop-shadow(0px 0px 38px rgba(237,170,84,0.34))",
    "drop-shadow(0px 22px 24px rgba(32,38,48,0.13)) drop-shadow(0px 0px 38px rgba(237,170,84,0.34))",
    "drop-shadow(0px 22px 24px rgba(32,38,48,0.13)) drop-shadow(0px 0px 8px rgba(237,170,84,0.04))",
  ]);
  const lightX = useTransform(progress, [0, 1], ["-25%", "25%"]);
  const lightY = useTransform(progress, [0, 1], ["20%", "-20%"]);
  const reverseX = useTransform(progress, [0, 1], ["30%", "-30%"]);

  return (
    <section ref={sceneRef} className={`honey-scene product-card--${product.textKey}`}>
      <motion.div className="honey-scene-stage" style={{ backgroundColor: reduced ? "#f8f9fb" : backgroundColor }}>
        <div className="honey-scene-inner">
          <div className="honey-scene-visual">
            <div className="honey-scene-product">
              <div className="honey-scene-lights" aria-hidden="true">
                <motion.div className="honey-scene-glow honey-scene-glow--warm" style={reduced ? undefined : { x: lightX, y: lightY, opacity: warmGlowOpacity }} />
                <motion.div className="honey-scene-glow honey-scene-glow--cool" style={reduced ? undefined : { x: reverseX, opacity: coolGlowOpacity }} />
              </div>
              <motion.img
                src={sceneImages[product.textKey]}
                alt={text.name}
                loading="lazy"
                style={reduced ? undefined : { scale: productScale, filter: productLight }}
              />
            </div>
          </div>
          <motion.div className="honey-scene-copy" style={reduced ? undefined : { opacity }}>
            {profile ? (
              <>
                <h2>{profile.label}</h2>
                <h3 className="honey-scene-profile-heading">{profile.heading}</h3>
                <blockquote className="honey-scene-tagline">{profile.tagline}</blockquote>
                <p>{profile.description}</p>
                <div className="honey-scene-detail">
                  <h3>{profile.benefitsTitle}</h3>
                  <ul>
                    {profile.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}
                  </ul>
                </div>
                {profile.featureNote && <p className="honey-scene-feature-note">{profile.featureNote}</p>}
              </>
            ) : (
              <>
                <h2>{text.name}</h2>
                <p>{text.description}</p>
                <div className="honey-scene-detail">
                  <h3>{t.product.servingTitle}</h3>
                  <p>{text.servingSuggestion}</p>
                </div>
              </>
            )}
            <Link to="/catalogo" className="text-link">{t.varietiesSection.browseCatalog} <span aria-hidden="true">→</span></Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default function HoneyJourney({ products, t }) {
  // App proporciona productos y traducciones; aquí se presentan como escenas desplazables.
  // App przekazuje produkty i tłumaczenia; tutaj są prezentowane jako przewijane sceny.
  return (
    <div className="honey-comparison-section honey-journey" id="miody">
      <header className="honey-journey-heading">
        <p className="eyebrow">{t.varietiesSection.eyebrow}</p>
        <h1>{t.nav.honeys}</h1>
        <p>{t.varietiesSection.text}</p>
      </header>
      {products.map((product) => (
        <HoneyScene key={product.textKey} product={product} text={t.products[product.textKey]} t={t} />
      ))}
    </div>
  );
}