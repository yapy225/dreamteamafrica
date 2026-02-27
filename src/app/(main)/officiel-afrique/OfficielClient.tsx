"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import s from "./officiel.module.css";

// ─── DATA ─────────────────────────────────────────────────

const CATEGORIES = [
  { group: "Musique & Art", icon: "🎵", items: [
    { value: "artistes", label: "🎤 Artistes — Rappeurs, Chanteurs, Danseurs, DJ's, Compositeurs" },
    { value: "disques", label: "💿 Disques — Labels, Majors, Distribution, Éditions, Management" },
    { value: "studios", label: "🎛️ Studios — Enregistrement, Répétition, Mastering, Matériel" },
  ]},
  { group: "Médias & Communication", icon: "📡", items: [
    { value: "medias", label: "📡 Médias — Presse, Radio, TV, Internet" },
    { value: "reseaux-sociaux", label: "📲 Réseaux sociaux — Influenceurs, Community managers" },
    { value: "services", label: "🎨 Services — Graphistes, Audiovisuel, Vidéo" },
  ]},
  { group: "Scènes & Événements", icon: "🎭", items: [
    { value: "scenes", label: "🎭 Scènes — Tourneurs, Festivals, Salles, Théâtres, MJC" },
    { value: "evenements", label: "✨ Événements — Musique, Mode, Sport, Cinéma" },
    { value: "discotheques", label: "🪩 Discothèques & Night-clubs" },
  ]},
  { group: "Sport", icon: "⚽", items: [
    { value: "agents-sportifs", label: "⚽ Agents sportifs" },
    { value: "football", label: "⚽ Club de football" },
    { value: "basketball", label: "🏀 Club de basketball" },
    { value: "rugby", label: "🏉 Club de rugby" },
  ]},
  { group: "Commerce & Services", icon: "🏪", items: [
    { value: "magasins", label: "🏪 Magasins spécialisés — Disques, Mode, VPC" },
    { value: "restaurants", label: "🍽️ Restaurants & Traiteurs" },
    { value: "cooperations", label: "🤝 Coopérations & Partenariats" },
  ]},
  { group: "Institutions & International", icon: "🏛️", items: [
    { value: "organismes", label: "🏛️ Organismes — SACEM, SDRM, FCM, INPI" },
    { value: "ambassades", label: "🏳️ Ambassades & Consulats" },
    { value: "associations", label: "🤲 Associations" },
    { value: "aeroports", label: "✈️ Aéroports internationaux" },
    { value: "international", label: "🌍 Contacts internationaux — Europe, Japon, Canada, USA" },
  ]},
];

const CAT_CARDS = [
  { icon: "🎤", name: "Artistes", desc: "Rappeurs, Chanteurs, Danseurs, DJ's, Compositeurs…" },
  { icon: "💿", name: "Disques", desc: "Majors, Labels indépendants, Distribution, Éditions, Management…" },
  { icon: "🎛️", name: "Studios", desc: "Enregistrement, Répétitions, Mastering, Fabrication, Matériel…" },
  { icon: "📡", name: "Médias", desc: "Presse, Radio, TV, Internet…" },
  { icon: "📲", name: "Réseaux sociaux", desc: "Influenceurs, Community managers, Créateurs de contenu…" },
  { icon: "🏪", name: "Magasins spécialisés", desc: "Disques, Mode, VPC…" },
  { icon: "🎭", name: "Scènes", desc: "Tourneurs, Festivals, Salles de concerts, Théâtres, MJC…" },
  { icon: "🎨", name: "Services", desc: "Graphistes, Audiovisuel, Vidéo…" },
  { icon: "🏛️", name: "Organismes", desc: "SACEM, SDRM, FCM, INPI…" },
  { icon: "✨", name: "Événements", desc: "Musique, Mode, Sport, Cinéma…" },
  { icon: "🏳️", name: "Ambassades & Consulats", desc: "Représentations diplomatiques africaines en France" },
  { icon: "⚽", name: "Agents sportifs", desc: "Agents, managers et consultants sportifs" },
  { icon: "⚽", name: "Clubs de football", desc: "Clubs professionnels et amateurs" },
  { icon: "🏀", name: "Clubs de basketball", desc: "Clubs et associations de basketball" },
  { icon: "🏉", name: "Clubs de rugby", desc: "Clubs et structures de rugby" },
  { icon: "✈️", name: "Aéroports internationaux", desc: "Liaisons aériennes vers l'Afrique" },
  { icon: "🤲", name: "Associations", desc: "Associations culturelles, sociales et communautaires" },
  { icon: "🍽️", name: "Restaurants", desc: "Restaurants africains, traiteurs, cuisine du monde" },
  { icon: "🪩", name: "Discothèques", desc: "Night-clubs, soirées afro, tropical…" },
  { icon: "🤝", name: "Coopérations", desc: "Partenariats France-Afrique, coopération internationale" },
  { icon: "🌍", name: "International", desc: "Europe, Japon, Canada, USA…" },
];

const FAQ_ITEMS = [
  { q: "L'inscription est-elle vraiment gratuite ?", a: "Oui, l'inscription de base est 100% gratuite et sans engagement. Votre entreprise sera visible dans l'annuaire digital 2026. Des options de mise en avant premium (encart publicitaire, interview, logo…) sont disponibles en option." },
  { q: "Qui peut s'inscrire dans l'annuaire ?", a: "Toute entreprise, association, artiste, club sportif ou professionnel lié à la diaspora africaine : musique, restauration, mode, sport, ambassades, événementiel, coopération, médias, services…" },
  { q: "Comment les particuliers trouvent-ils mon entreprise ?", a: "L'annuaire est organisé par catégories avec un moteur de recherche intégré. Les particuliers peuvent chercher par ville, catégorie, mot-clé ou nom d'entreprise. Votre fiche complète s'affiche avec toutes vos coordonnées et réseaux sociaux." },
  { q: "Combien de temps pour la validation ?", a: "Notre équipe éditoriale vérifie chaque inscription sous 48h ouvrées. Vous recevez un email de confirmation dès que votre fiche est active." },
  { q: "Puis-je modifier mes informations après ?", a: "Absolument ! Vous pouvez mettre à jour vos coordonnées, description, réseaux sociaux et informations à tout moment en nous contactant par email." },
  { q: "Comment fonctionne l'offre pour les annonceurs ?", a: "Les annonceurs peuvent réserver des espaces publicitaires ciblés dans l'annuaire : bannières, pages dédiées, interviews sponsorisées. Contactez notre régie pour les tarifs et les formats disponibles." },
];

const SOCIAL_PROOF_BIZ = [
  "Afro Coiffure Paris", "Chez Tonton Traiteur", "Dakar Records Studio", "Wax & Style Boutique",
  "Salon Beauté Mama", "Ndombolo Dance", "Faso Mode Paris", "Griots Productions",
  "Dakar Express", "Amina Couture", "Black Star Records", "Bamako Digital",
  "Teranga Consulting", "Kinshasa Gallery", "Abidjan Vibes DJ", "Congo Traiteur",
  "Lomé Fashion", "Douala Events", "Nairobi Connect", "Accra Sports Agency",
];

const HOW_STEPS = [
  { title: "Remplissez le formulaire", desc: "Renseignez les informations de votre entreprise, vos coordonnées, réseaux sociaux et une description de votre activité.", tag: "⏱ Moins de 3 minutes" },
  { title: "Validation éditoriale", desc: "Notre équipe vérifie et valide votre fiche sous 48h. Vous recevez un email de confirmation.", tag: "✓ Validation sous 48h" },
  { title: "Publication dans l'annuaire", desc: "Votre entreprise apparaît dans l'annuaire digital 2026, consultable par des milliers de visiteurs toute l'année.", tag: "🌍 France & International" },
  { title: "Recevez des contacts qualifiés", desc: "Annonceurs, professionnels et particuliers vous trouvent directement via l'annuaire. Développez votre réseau.", tag: "📈 Croissance organique" },
];

const ADV_CARDS = [
  { kw: "Ciblez", text: "Touchez précisément la cible composée de professionnels, d'indépendants et de particuliers de la culture africaine." },
  { kw: "Communiquez", text: "Atteignez un maximum de personnes cible en une seule opération à travers l'annuaire digital." },
  { kw: "Optimisez", text: "Ciblez parfaitement votre plan promo au travers de cette édition et des actions marketing associées." },
  { kw: "Visibilité annuelle", text: "Développez une visibilité sur un an à travers toute la France et à l'international." },
  { kw: "Sensibilisez", text: "Mettez en avant vos produits auprès de professionnels grâce à votre présence dans le guide." },
];

// ─── HOOKS ────────────────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(`.${s.reveal}, .${s.catCard}, .${s.tlStep}`);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add(s.revealVis);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );
    els.forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${0.03 * i}s`;
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
}

function useAnimatedCounter(ref: React.RefObject<HTMLDivElement | null>, target: number) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            let c = 0;
            const step = Math.ceil(target / 50);
            const iv = setInterval(() => {
              c += step;
              if (c >= target) { c = target; clearInterval(iv); }
              el.textContent = c.toLocaleString("fr-FR");
            }, 30);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, target]);
}

// ─── MAIN COMPONENT ───────────────────────────────────────

export default function OfficielClient() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [proofBadge, setProofBadge] = useState("Afro Coiffure Paris — il y a 2 min");

  const [form, setForm] = useState({
    entreprise: "", categorie: "", directeur: "",
    adresse: "", ville: "", codePostal: "", pays: "",
    mobile: "", telephone: "", email: "",
    siteWeb: "", facebook: "", instagram: "", tiktok: "",
    whatsapp: "", youtube: "", linkedin: "",
    description: "", motsCles: "",
    consent: false, newsletter: true,
  });

  const formCardRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);

  useScrollReveal();
  useAnimatedCounter(counterRef, 3214);

  // Social proof rotation
  useEffect(() => {
    const iv = setInterval(() => {
      const biz = SOCIAL_PROOF_BIZ[Math.floor(Math.random() * SOCIAL_PROOF_BIZ.length)];
      const mins = Math.floor(Math.random() * 25) + 1;
      setProofBadge(`${biz} — il y a ${mins} min`);
    }, 7000);
    return () => clearInterval(iv);
  }, []);

  const updateForm = useCallback((field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const shake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 400);
  }, []);

  const goTo = useCallback((n: number) => {
    if (n > step) {
      if (step === 1 && (!form.entreprise.trim() || !form.categorie || !form.directeur.trim())) {
        shake();
        return;
      }
      if (step === 2) {
        if (!form.ville.trim() || !form.pays.trim() || !form.mobile.trim() || !form.email.trim()) {
          shake();
          return;
        }
        if (!form.email.includes("@")) { shake(); return; }
      }
    }
    setStep(n);
    formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, form, shake]);

  const handleSubmit = async () => {
    if (!form.consent) {
      alert("Veuillez accepter les conditions pour continuer.");
      return;
    }
    if (!form.description.trim()) { shake(); return; }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entreprise: form.entreprise,
          categorie: form.categorie,
          directeur: form.directeur,
          adresse: form.adresse || undefined,
          ville: form.ville,
          codePostal: form.codePostal || undefined,
          pays: form.pays,
          mobile: form.mobile,
          telephone: form.telephone || undefined,
          email: form.email,
          siteWeb: form.siteWeb || undefined,
          facebook: form.facebook || undefined,
          instagram: form.instagram || undefined,
          tiktok: form.tiktok || undefined,
          whatsapp: form.whatsapp || undefined,
          youtube: form.youtube || undefined,
          linkedin: form.linkedin || undefined,
          description: form.description,
          motsCles: form.motsCles || undefined,
          newsletter: form.newsletter,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau. Veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={s.page}>
      {/* Urgency bar */}
      <div className={s.urgency}>
        🚀 Édition 2026 — Inscriptions ouvertes ! <span className={s.urgencyStrong}>Référencez votre entreprise gratuitement</span> dans le premier annuaire de la diaspora africaine.
      </div>
      <div className={s.kente} />

      {/* Nav */}
      <nav className={s.topnav}>
        <div className={s.topnavLogo}>
          L&apos;Officiel <span className={s.topnavLogoAccent}>d&apos;Afrique</span>
        </div>
        <div className={s.topnavLinks}>
          <a href="#rubriques" className={`${s.topnavLink} ${s.topnavLinkHide}`}>Rubriques</a>
          <a href="#plan-media" className={`${s.topnavLink} ${s.topnavLinkHide}`}>Plan Média</a>
          <a href="#faq" className={`${s.topnavLink} ${s.topnavLinkHide}`}>FAQ</a>
          <button className={s.topnavCta} onClick={scrollToForm}>S&apos;inscrire gratuitement ✦</button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className={s.hero} id="inscription">
        <div className={s.heroWrap}>
          <div>
            <div className={s.badgeFree}><span className={s.dot} /> Inscription 100% gratuite</div>
            <h1 className={s.heroTitle}>
              Référencez votre entreprise dans <span className={s.gold}>L&apos;Officiel</span>{" "}
              <span className={s.goldItalic}>d&apos;Afrique</span> 2026
            </h1>
            <p className={s.heroSub}>
              Le premier annuaire professionnel de la diaspora africaine à Paris. Rendez votre activité visible auprès de milliers d&apos;annonceurs, de professionnels et de particuliers qui recherchent vos services.
            </p>
            <div className={s.heroMetrics}>
              <div><div className={s.metricVal}>15 000+</div><div className={s.metricLbl}>Contacts ciblés</div></div>
              <div><div className={s.metricVal}>20+</div><div className={s.metricLbl}>Catégories</div></div>
              <div><div className={s.metricVal}>100%</div><div className={s.metricLbl}>Digital</div></div>
            </div>
          </div>

          {/* ── FORM CARD ── */}
          <div ref={formCardRef} className={`${s.fcard} ${shaking ? s.shake : ""}`}>
            <div className={s.fcardTop} />
            <div className={s.fcardInner}>
              <div className={s.fcardTitle}>Inscription gratuite</div>
              <div className={s.fcardSub}>
                Édition 2026 — Rejoignez <span className={s.fcardSubGreen}>3 214</span> entreprises déjà inscrites
              </div>

              {/* Progress bar */}
              <div className={s.progressBar}>
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`${s.progSeg} ${n < step ? s.progSegDone : ""} ${n === step ? s.progSegActive : ""}`}
                  />
                ))}
              </div>

              {!submitted ? (
                <>
                  {/* Step 1: Entreprise */}
                  {step === 1 && (
                    <div>
                      <div className={s.stepLabel}>Étape 1/4 — Votre entreprise</div>
                      <div className={s.fg}>
                        <label className={s.fgLabel}>Nom de l&apos;entreprise *</label>
                        <input className={s.fgInput} type="text" placeholder="Ex: Afro Studio Paris, Maquis du 18e…"
                          value={form.entreprise} onChange={(e) => updateForm("entreprise", e.target.value)} />
                      </div>
                      <div className={s.fg}>
                        <label className={s.fgLabel}>Catégorie *</label>
                        <select className={s.fgSelect} value={form.categorie} onChange={(e) => updateForm("categorie", e.target.value)}>
                          <option value="" disabled>Choisissez votre catégorie</option>
                          {CATEGORIES.map((g) => (
                            <optgroup key={g.group} label={`${g.icon} ${g.group}`}>
                              {g.items.map((it) => (
                                <option key={it.value} value={it.value}>{it.label}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                      </div>
                      <div className={s.fg}>
                        <label className={s.fgLabel}>Nom du directeur / responsable *</label>
                        <input className={s.fgInput} type="text" placeholder="Prénom et Nom"
                          value={form.directeur} onChange={(e) => updateForm("directeur", e.target.value)} />
                      </div>
                      <button className={s.btnGold} onClick={() => goTo(2)}>Continuer →</button>
                    </div>
                  )}

                  {/* Step 2: Coordonnées */}
                  {step === 2 && (
                    <div>
                      <div className={s.stepLabel}>Étape 2/4 — Coordonnées</div>
                      <div className={s.fg}>
                        <label className={s.fgLabel}>Adresse postale</label>
                        <input className={s.fgInput} type="text" placeholder="N° et nom de rue"
                          value={form.adresse} onChange={(e) => updateForm("adresse", e.target.value)} />
                      </div>
                      <div className={s.frow3}>
                        <div className={s.fg}>
                          <label className={s.fgLabel}>Ville *</label>
                          <input className={s.fgInput} type="text" placeholder="Paris"
                            value={form.ville} onChange={(e) => updateForm("ville", e.target.value)} />
                        </div>
                        <div className={s.fg}>
                          <label className={s.fgLabel}>Code postal</label>
                          <input className={s.fgInput} type="text" placeholder="75018"
                            value={form.codePostal} onChange={(e) => updateForm("codePostal", e.target.value)} />
                        </div>
                        <div className={s.fg}>
                          <label className={s.fgLabel}>Pays *</label>
                          <input className={s.fgInput} type="text" placeholder="France"
                            value={form.pays} onChange={(e) => updateForm("pays", e.target.value)} />
                        </div>
                      </div>
                      <div className={s.frow}>
                        <div className={s.fg}>
                          <label className={s.fgLabel}>Téléphone mobile *</label>
                          <input className={s.fgInput} type="tel" placeholder="+33 6 00 00 00 00"
                            value={form.mobile} onChange={(e) => updateForm("mobile", e.target.value)} />
                        </div>
                        <div className={s.fg}>
                          <label className={s.fgLabel}>Téléphone fixe</label>
                          <input className={s.fgInput} type="tel" placeholder="+33 1 00 00 00 00"
                            value={form.telephone} onChange={(e) => updateForm("telephone", e.target.value)} />
                        </div>
                      </div>
                      <div className={s.fg}>
                        <label className={s.fgLabel}>Adresse email *</label>
                        <input className={s.fgInput} type="email" placeholder="contact@votreentreprise.com"
                          value={form.email} onChange={(e) => updateForm("email", e.target.value)} />
                      </div>
                      <button className={s.btnGold} onClick={() => goTo(3)}>Continuer →</button>
                      <button className={s.btnGhost} onClick={() => goTo(1)}>← Retour</button>
                    </div>
                  )}

                  {/* Step 3: Réseaux sociaux */}
                  {step === 3 && (
                    <div>
                      <div className={s.stepLabel}>Étape 3/4 — Présence en ligne</div>
                      <div className={s.fg}>
                        <label className={s.fgLabel}>Site internet</label>
                        <input className={s.fgInput} type="url" placeholder="https://www.votresite.com"
                          value={form.siteWeb} onChange={(e) => updateForm("siteWeb", e.target.value)} />
                      </div>
                      <div className={s.socialRow}>
                        {[
                          { field: "facebook", icon: "📘", label: "Facebook", ph: "facebook.com/votrepage" },
                          { field: "instagram", icon: "📸", label: "Instagram", ph: "@votrenom" },
                          { field: "tiktok", icon: "🎵", label: "TikTok", ph: "@votrenom" },
                          { field: "whatsapp", icon: "💬", label: "WhatsApp", ph: "+33 6 00 00 00 00" },
                          { field: "youtube", icon: "▶️", label: "YouTube", ph: "youtube.com/@votrenom" },
                          { field: "linkedin", icon: "💼", label: "LinkedIn", ph: "linkedin.com/in/votrenom" },
                        ].map(({ field, icon, label, ph }) => (
                          <div key={field} className={`${s.fg} ${s.socialInput}`}>
                            <label className={s.fgLabel}>{label}</label>
                            <span className={s.socialIcon}>{icon}</span>
                            <input className={`${s.fgInput} ${s.socialInputField}`} type="text" placeholder={ph}
                              value={form[field as keyof typeof form] as string}
                              onChange={(e) => updateForm(field, e.target.value)} />
                          </div>
                        ))}
                      </div>
                      <button className={s.btnGold} onClick={() => goTo(4)}>Dernière étape →</button>
                      <button className={s.btnGhost} onClick={() => goTo(2)}>← Retour</button>
                    </div>
                  )}

                  {/* Step 4: Description & Validation */}
                  {step === 4 && (
                    <div>
                      <div className={s.stepLabel}>Étape 4/4 — Finalisez votre inscription</div>
                      <div className={s.fg}>
                        <label className={s.fgLabel}>Décrivez votre entreprise / activité *</label>
                        <textarea className={s.fgTextarea} maxLength={500} rows={5}
                          placeholder="Décrivez votre activité, vos services, votre spécialité… (500 caractères max)"
                          value={form.description} onChange={(e) => updateForm("description", e.target.value)} />
                      </div>
                      <div className={s.fg}>
                        <label className={s.fgLabel}>Mots-clés (séparés par des virgules)</label>
                        <input className={s.fgInput} type="text" placeholder="Ex: musique, afro, studio, enregistrement, Paris…"
                          value={form.motsCles} onChange={(e) => updateForm("motsCles", e.target.value)} />
                      </div>
                      <div className={s.fg} style={{ marginTop: ".5rem" }}>
                        <label className={s.checkboxLabel}>
                          <input type="checkbox" className={s.checkbox} checked={form.consent}
                            onChange={(e) => updateForm("consent", e.target.checked)} />
                          J&apos;accepte que mes informations soient publiées dans l&apos;annuaire L&apos;Officiel d&apos;Afrique 2026 et je certifie que les informations fournies sont exactes.
                        </label>
                      </div>
                      <div className={s.fg}>
                        <label className={s.checkboxLabel}>
                          <input type="checkbox" className={s.checkbox} checked={form.newsletter}
                            onChange={(e) => updateForm("newsletter", e.target.checked)} />
                          Je souhaite recevoir les actualités et offres de L&apos;Officiel d&apos;Afrique
                        </label>
                      </div>
                      {error && (
                        <div style={{ color: "#C23B22", fontSize: ".82rem", marginBottom: ".5rem" }}>{error}</div>
                      )}
                      <button className={s.btnGold} onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Envoi en cours..." : "✦ Valider mon inscription gratuite"}
                      </button>
                      <button className={s.btnGhost} onClick={() => goTo(3)}>← Retour</button>
                    </div>
                  )}
                </>
              ) : (
                <div className={s.successBox}>
                  <div className={s.successIcon}>✓</div>
                  <h3>Inscription enregistrée !</h3>
                  <p>Merci ! Votre entreprise sera visible dans l&apos;édition 2026 de L&apos;Officiel d&apos;Afrique. Vous recevrez un email de confirmation sous 48h.</p>
                </div>
              )}
            </div>
            <div className={s.fcardFooter}>🔒 Données protégées</div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className={`${s.sec} ${s.secCat}`} id="rubriques">
        <div className={`${s.secHeader} ${s.reveal}`}>
          <div className={s.secLabel}>L&apos;annuaire complet</div>
          <h2 className={s.secTitle}>+20 rubriques pour <span className={s.gold}>toute la diaspora</span></h2>
          <p className={s.secSubtitle}>Chaque rubrique est précédée d&apos;interviews de personnalités emblématiques : Artistes, Chefs de Produits, Managers, Directeurs artistiques…</p>
        </div>
        <div className={s.catMega}>
          {CAT_CARDS.map((c) => (
            <div key={c.name} className={s.catCard}>
              <div className={s.catIcon}>{c.icon}</div>
              <div className={s.catName}>{c.name}</div>
              <div className={s.catDesc}>{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ PLAN MEDIA ═══ */}
      <section className={`${s.sec} ${s.secMedia}`} id="plan-media">
        <div className={`${s.secHeader} ${s.reveal}`}>
          <div className={s.secLabel}>Plan Média</div>
          <h2 className={s.secTitle}>Communiquez dans <span className={s.gold}>le Guide</span></h2>
          <p className={s.secSubtitle}>Le premier guide officiel de la culture africaine — une base de données ciblée pour annonceurs, professionnels et particuliers.</p>
        </div>
        <div className={s.mediaInner}>
          <div className={`${s.mediaCols} ${s.reveal}`}>
            <div>
              <div className={s.mediaColTitle}>Pour les Annonceurs & Professionnels</div>
              <p className={s.mediaColText}>Touchez précisément votre cible composée de professionnels, d&apos;indépendants et de particuliers. Communiquez auprès d&apos;un maximum de personnes en une seule opération : DJ&apos;s, journalistes, émissions de radio spécialisées, agents sportifs, restaurateurs…</p>
            </div>
            <div>
              <div className={s.mediaColTitle}>Pour les Particuliers</div>
              <p className={s.mediaColText}>Trouvez facilement les entreprises, services et contacts dont vous avez besoin : démarches administratives, studios, scènes, promotions artistiques, restaurants, associations, ambassades et bien plus encore.</p>
            </div>
          </div>
          <div className={s.advGrid}>
            {ADV_CARDS.map((c) => (
              <div key={c.kw} className={`${s.advCard} ${s.reveal}`}>
                <div className={s.advKw}>{c.kw}</div>
                <p className={s.advText}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Distribution */}
      <div className={s.distStrip}>
        <div className={s.reveal}>
          <div className={s.distIcon}>📲</div>
          <div className={s.distLabel}>Distribution</div>
          <div className={s.distVal}>100% Digitale</div>
        </div>
      </div>

      {/* ═══ HOW ═══ */}
      <section className={`${s.sec} ${s.secHow}`}>
        <div className={`${s.secHeader} ${s.reveal}`}>
          <div className={s.secLabel}>4 étapes simples</div>
          <h2 className={s.secTitle}>Comment <span className={s.gold}>s&apos;inscrire</span> ?</h2>
        </div>
        <div className={s.tl}>
          {HOW_STEPS.map((st, i) => (
            <div key={i} className={s.tlStep}>
              <div className={s.tlNum}>{i + 1}</div>
              <div className={s.tlBody}>
                <h3>{st.title}</h3>
                <p>{st.desc}</p>
                <span className={s.tlTag}>{st.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className={`${s.sec} ${s.secProof}`}>
        <div className={s.reveal}>
          <div className={s.proofBig} ref={counterRef}>3 214</div>
          <div className={s.proofSub}>entreprises déjà inscrites pour l&apos;édition 2026</div>
          <div className={s.proofBadges}>
            <span className={s.pbadge}>🟢 {proofBadge}</span>
            <span className={s.pbadge}>🟢 Chez Tonton Traiteur — il y a 8 min</span>
            <span className={s.pbadge}>🟢 Dakar Records Studio — il y a 15 min</span>
            <span className={s.pbadge}>🟢 Wax & Style Boutique — il y a 22 min</span>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className={`${s.sec} ${s.secFaq}`} id="faq">
        <div className={`${s.secHeader} ${s.reveal}`}>
          <div className={s.secLabel}>Questions fréquentes</div>
          <h2 className={s.secTitle}>Tout savoir sur <span className={s.gold}>l&apos;inscription</span></h2>
        </div>
        <div className={s.faqList}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={s.faqItem}>
              <button className={s.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {item.q}
                <span className={`${s.faqArrow} ${openFaq === i ? s.faqArrowOpen : ""}`}>+</span>
              </button>
              <div className={`${s.faqA} ${openFaq === i ? s.faqAOpen : ""}`}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className={s.secCta}>
        <div className={s.reveal}>
          <h2 className={s.ctaBig}>Rejoignez <span className={s.gold}>L&apos;Officiel d&apos;Afrique</span> 2026</h2>
          <p className={s.ctaP}>3 minutes suffisent pour inscrire votre entreprise et la rendre visible auprès de toute la diaspora africaine en France et à l&apos;international.</p>
          <button className={s.ctaLink} onClick={scrollToForm}>S&apos;inscrire gratuitement →</button>
          <div className={s.ctaSm}>🔒 Gratuit & sans engagement — <span className={s.ctaSmGreen}>Édition 2026</span></div>
        </div>
      </section>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.kente} style={{ marginBottom: "1.5rem", opacity: 0.5 }} />
        <div className={s.ftLogo}>L&apos;Officiel <span className={s.topnavLogoAccent}>d&apos;Afrique</span></div>
        <div className={s.ftSub}>L&apos;annuaire de la diaspora africaine à Paris — +15 000 contacts</div>
        <div className={s.ftCopy}>© 2026 L&apos;Officiel d&apos;Afrique — Tous droits réservés</div>
      </footer>

      {/* Floating badge */}
      <div className={s.floater} onClick={scrollToForm}>
        <span className={s.dot} />
        <span><span className={s.flN}>+37</span> inscriptions aujourd&apos;hui</span>
      </div>
    </div>
  );
}
