import { useEffect, useRef, useState } from "react";
import { LANGUAGES } from "./i18n";

// LANGUAGES aporta códigos y nombres desde i18n.js; App recibe la elección mediante onChange.
// LANGUAGES dostarcza kody i nazwy z i18n.js; App otrzymuje wybór przez onChange.
// Las banderas SVG propias mantienen el aspecto aunque el sistema no dibuje emojis de bandera.
// Własne flagi SVG zachowują wygląd, nawet gdy system nie rysuje emoji flag.
function Flag({ code }) {
  const common = { className: "flag", viewBox: "0 0 30 20", "aria-hidden": true };

  if (code === "pl") {
    return (
      <svg {...common}>
        <rect width="30" height="10" fill="#ffffff" />
        <rect y="10" width="30" height="10" fill="#dc143c" />
      </svg>
    );
  }

  if (code === "uk") {
    return (
      <svg {...common}>
        <rect width="30" height="10" fill="#0057b7" />
        <rect y="10" width="30" height="10" fill="#ffd700" />
      </svg>
    );
  }

  if (code === "es") {
    return (
      <svg {...common}>
        <rect width="30" height="20" fill="#aa151b" />
        <rect y="5" width="30" height="10" fill="#f1bf00" />
      </svg>
    );
  }

  const stripe = 20 / 13;
  return (
    <svg {...common}>
      <rect width="30" height="20" fill="#ffffff" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} y={i * 2 * stripe} width="30" height={stripe} fill="#b22234" />
      ))}
      <rect width="13" height={stripe * 7} fill="#3c3b6e" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={2 + (i % 4) * 3} cy={2 + Math.floor(i / 4) * 3.2} r="0.7" fill="#ffffff" />
      ))}
    </svg>
  );
}

export default function LanguagePicker({ lang, onChange, label }) {
  const [open, setOpen] = useState(false);
  const pickerRef = useRef(null);
  const current = LANGUAGES.find((language) => language.code === lang);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function closeOnOutsideClick(event) {
      if (!pickerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    // Los listeners solo se crean mientras el menú está abierto y se limpian al cerrarlo.
    // Nasłuchiwacze są tworzone tylko przy otwartym menu i usuwane po jego zamknięciu.
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="language-picker" ref={pickerRef}>
      <button
        type="button"
        className="language-button"
        aria-label={`${label}: ${current.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <Flag code={current.code} />
        <span>{current.label}</span>
        <svg className="language-chevron" viewBox="0 0 10 6" aria-hidden="true">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      {open && (
        <ul className="language-menu" role="menu" aria-label={label}>
          {LANGUAGES.map((language) => (
            <li key={language.code} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={language.code === lang}
                lang={language.code}
                onClick={() => {
                  onChange(language.code);
                  setOpen(false);
                }}
              >
                <Flag code={language.code} />
                {language.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
