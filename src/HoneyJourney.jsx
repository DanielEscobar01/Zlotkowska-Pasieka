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

function HoneyScene({ product, text, t }) {
  const sceneRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 32,
    mass: 0.5,
    restDelta: 0.001,
  });
  const backgroundColor = useTransform(progress, [0, 0.3, 0.6, 1], ["#f8f9fb", "#f0f3f7", "#f0f3f7", "#f8f9fb"]);
  const opacity = useTransform(progress, [0.1, 0.3, 0.75, 0.95], [0.8, 1, 1, 0.8]);
  const productScale = useTransform(progress, [0.15, 0.6, 0.95], [0.78, 1.06, 1.06]);
  const productLight = useTransform(progress, [0.1, 0.4, 0.7, 0.95], [
    "drop-shadow(0px 22px 24px rgba(32,38,48,0.13)) drop-shadow(0px 0px 8px rgba(237,170,84,0.04))",
    "drop-shadow(0px 22px 24px rgba(32,38,48,0.13)) drop-shadow(0px 0px 38px rgba(237,170,84,0.34))",
    "drop-shadow(0px 22px 24px rgba(32,38,48,0.13)) drop-shadow(0px 0px 38px rgba(237,170,84,0.34))",
    "drop-shadow(0px 22px 24px rgba(32,38,48,0.13)) drop-shadow(0px 0px 8px rgba(237,170,84,0.04))",
  ]);
  const lightX = useTransform(progress, [0, 1], ["-25%", "25%"]);
  const lightRotate = useTransform(progress, [0, 1], [-18, 18]);
  const lightY = useTransform(progress, [0, 1], ["20%", "-20%"]);
  const reverseX = useTransform(progress, [0, 1], ["30%", "-30%"]);
  const reverseRotate = useTransform(progress, [0, 1], [16, -16]);
  const beamX = useTransform(progress, [0, 1], ["-140%", "320%"]);
  const beamOpacity = useTransform(progress, [0.1, 0.4, 0.7, 0.95], [0.15, 0.85, 0.85, 0.15]);

  return (
    <section ref={sceneRef} className={`honey-scene product-card--${product.textKey}`}>
      <motion.div className="honey-scene-stage" style={{ backgroundColor: reduced ? "#f8f9fb" : backgroundColor }}>
        <div className="honey-scene-inner">
          <div className="honey-scene-visual">
            <div className="honey-scene-product">
              <div className="honey-scene-lights" aria-hidden="true">
                <motion.div className="honey-scene-beam" style={reduced ? undefined : { x: beamX, skewX: -24, opacity: beamOpacity }} />
                <motion.div className="honey-scene-light honey-scene-light--first" style={reduced ? undefined : { x: lightX, rotate: lightRotate }} />
                <motion.div className="honey-scene-light honey-scene-light--second" style={reduced ? undefined : { y: lightY, rotate: lightRotate }} />
                <motion.div className="honey-scene-light honey-scene-light--third" style={reduced ? undefined : { x: lightX, y: lightY }} />
                <motion.div className="honey-scene-light honey-scene-light--fourth" style={reduced ? undefined : { x: reverseX, rotate: reverseRotate }} />
                <motion.div className="honey-scene-light honey-scene-light--fifth" style={reduced ? undefined : { x: reverseX, y: lightY }} />
                <motion.div className="honey-scene-light honey-scene-light--sixth" style={reduced ? undefined : { x: lightX, rotate: reverseRotate }} />
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
            <h2>{text.name}</h2>
            <p>{text.description}</p>
            <div className="honey-scene-detail">
              <h3>{t.varietiesSection.detailTitle}</h3>
              <p>{t.varietiesSection.details[product.textKey]}</p>
            </div>
            <Link to="/catalogo" className="text-link">{t.varietiesSection.browseCatalog} <span aria-hidden="true">→</span></Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

export default function HoneyJourney({ products, t }) {
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