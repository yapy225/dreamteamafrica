"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Quel est le circuit de la balade en péniche ?",
    answer:
      "Notre circuit classique part du Port de la Bourdonnais (pied de la Tour Eiffel), longe le Musée du Quai Branly, passe sous le Pont Alexandre III, devant le Grand Palais, le Musée d'Orsay, l'Île de la Cité et Notre-Dame, puis retour par le même itinéraire avec vue sur la Tour Eiffel illuminée. Durée : environ 2h30.",
  },
  {
    question: "Peut-on payer en plusieurs fois ?",
    answer:
      "Oui, nous proposons le paiement en 2 ou 3 fois sans frais. Contactez-nous pour mettre en place votre échéancier personnalisé.",
  },
  {
    question: "Quelle est la fréquence de vos balades ?",
    answer:
      "Nos balades ont lieu tout l'été, de juin à septembre. Consultez notre calendrier pour connaître les prochaines dates disponibles.",
  },
  {
    question: "Quelles prestations proposez-vous ?",
    answer:
      "Nous proposons : balades découverte sur la Seine, soirées anniversaire privées, enterrements de vie de jeune fille (EVJF), excursions spéciales (Saint-Valentin, fêtes nationales, événements corporate), et formules sur mesure pour vos événements.",
  },
  {
    question: "Comment réserver ?",
    answer:
      "Réservez directement sur notre site via le formulaire en ligne, ou contactez-nous par téléphone ou WhatsApp. Un acompte de 30% est demandé pour confirmer votre réservation.",
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-dta-sand/50">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-sm font-semibold text-dta-dark sm:text-base">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-dta-accent transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight ?? 200 : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="pb-5 text-sm leading-relaxed text-dta-char/70">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-dta-bg py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={`mb-12 text-center transition-all duration-700 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mx-auto mb-4 h-px w-16 bg-dta-accent" />
          <h2 className="font-serif text-3xl font-bold text-dta-dark sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-3 text-sm text-dta-char/60">
            Tout ce que vous devez savoir avant de réserver votre croisière.
          </p>
        </div>

        {/* Accordion */}
        <div
          className={`rounded-[var(--radius-card)] border border-dta-sand/50 bg-white px-6 shadow-[var(--shadow-card)] transition-all duration-700 delay-200 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
