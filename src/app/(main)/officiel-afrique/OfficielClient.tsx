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
  { value: "artistes", icon: "🎤", name: "Artistes", desc: "Rappeurs, Chanteurs, Danseurs, DJ's, Compositeurs…" },
  { value: "disques", icon: "💿", name: "Disques", desc: "Majors, Labels indépendants, Distribution, Éditions, Management…" },
  { value: "studios", icon: "🎛️", name: "Studios", desc: "Enregistrement, Répétitions, Mastering, Fabrication, Matériel…" },
  { value: "medias", icon: "📡", name: "Médias", desc: "Presse, Radio, TV, Internet…" },
  { value: "reseaux-sociaux", icon: "📲", name: "Réseaux sociaux", desc: "Influenceurs, Community managers, Créateurs de contenu…" },
  { value: "magasins", icon: "🏪", name: "Magasins spécialisés", desc: "Disques, Mode, VPC…" },
  { value: "scenes", icon: "🎭", name: "Scènes", desc: "Tourneurs, Festivals, Salles de concerts, Théâtres, MJC…" },
  { value: "services", icon: "🎨", name: "Services", desc: "Graphistes, Audiovisuel, Vidéo…" },
  { value: "organismes", icon: "🏛️", name: "Organismes", desc: "SACEM, SDRM, FCM, INPI…" },
  { value: "evenements", icon: "✨", name: "Événements", desc: "Musique, Mode, Sport, Cinéma…" },
  { value: "ambassades", icon: "🏳️", name: "Ambassades & Consulats", desc: "Représentations diplomatiques africaines en France" },
  { value: "agents-sportifs", icon: "⚽", name: "Agents sportifs", desc: "Agents, managers et consultants sportifs" },
  { value: "football", icon: "⚽", name: "Clubs de football", desc: "Clubs professionnels et amateurs" },
  { value: "basketball", icon: "🏀", name: "Clubs de basketball", desc: "Clubs et associations de basketball" },
  { value: "rugby", icon: "🏉", name: "Clubs de rugby", desc: "Clubs et structures de rugby" },
  { value: "aeroports", icon: "✈️", name: "Aéroports internationaux", desc: "Liaisons aériennes vers l'Afrique" },
  { value: "associations", icon: "🤲", name: "Associations", desc: "Associations culturelles, sociales et communautaires" },
  { value: "restaurants", icon: "🍽️", name: "Restaurants", desc: "Restaurants africains, traiteurs, cuisine du monde" },
  { value: "discotheques", icon: "🪩", name: "Discothèques", desc: "Night-clubs, soirées afro, tropical…" },
  { value: "cooperations", icon: "🤝", name: "Coopérations", desc: "Partenariats France-Afrique, coopération internationale" },
  { value: "international", icon: "🌍", name: "International", desc: "Europe, Japon, Canada, USA…" },
];


const HOW_STEPS = [
  { title: "Remplissez le formulaire", desc: "Renseignez les informations de votre entreprise, vos coordonnées, réseaux sociaux et une description de votre activité.", tag: "⏱ Moins de 3 minutes" },
  { title: "Validation éditoriale", desc: "Notre équipe vérifie et valide votre fiche sous 48h. Vous recevez un email de confirmation.", tag: "✓ Validation sous 48h" },
  { title: "Publication dans l'annuaire", desc: "Votre entreprise apparaît dans l'annuaire digital 2026, consultable par des milliers de visiteurs toute l'année.", tag: "🌍 France & International" },
  { title: "Recevez des contacts qualifiés", desc: "Annonceurs, professionnels et particuliers vous trouvent directement via l'annuaire. Développez votre réseau.", tag: "📈 Croissance organique" },
];


const FAQ_ITEMS = [
  { q: "L\u2019inscription est-elle vraiment gratuite ?", a: "Oui, l\u2019inscription de base est 100% gratuite et sans engagement. Votre entreprise sera visible dans l\u2019annuaire digital 2026. Des options de mise en avant premium (encart publicitaire, interview, logo\u2026) sont disponibles en option." },
  { q: "Qui peut s\u2019inscrire dans l\u2019annuaire ?", a: "Toute entreprise, association, artiste, club sportif ou professionnel li\u00e9 \u00e0 la diaspora africaine : musique, restauration, mode, sport, ambassades, \u00e9v\u00e9nementiel, coop\u00e9ration, m\u00e9dias, services\u2026" },
  { q: "Comment les particuliers trouvent-ils mon entreprise ?", a: "L\u2019annuaire est organis\u00e9 par cat\u00e9gories avec un moteur de recherche int\u00e9gr\u00e9. Les particuliers peuvent chercher par ville, cat\u00e9gorie, mot-cl\u00e9 ou nom d\u2019entreprise. Votre fiche compl\u00e8te s\u2019affiche avec toutes vos coordonn\u00e9es et r\u00e9seaux sociaux." },
  { q: "Combien de temps pour la validation ?", a: "Notre \u00e9quipe \u00e9ditoriale v\u00e9rifie chaque inscription sous 48h ouvr\u00e9es. Vous recevez un email de confirmation d\u00e8s que votre fiche est active." },
  { q: "Puis-je modifier mes informations apr\u00e8s ?", a: "Absolument ! Vous pouvez mettre \u00e0 jour vos coordonn\u00e9es, description, r\u00e9seaux sociaux et informations \u00e0 tout moment en nous contactant par email." },
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


// ─── MAIN COMPONENT ───────────────────────────────────────

export default function OfficielClient() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const [comments, setComments] = useState<{ name: string; text: string; date: string }[]>([]);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", text: "" });
  const [nlEmail, setNlEmail] = useState("");
  const [nlDone, setNlDone] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroSearch, setHeroSearch] = useState("");

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
  const catSectionRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  const filteredCats = heroSearch.trim()
    ? CAT_CARDS.filter((c) =>
        c.name.toLowerCase().includes(heroSearch.toLowerCase()) ||
        c.desc.toLowerCase().includes(heroSearch.toLowerCase())
      )
    : CAT_CARDS;

  const handleHeroSearch = () => {
    if (heroSearch.trim()) {
      catSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
              <div><div className={s.metricVal}>21</div><div className={s.metricLbl}>Catégories</div></div>
              <div><div className={s.metricVal}>100%</div><div className={s.metricLbl}>Gratuit</div></div>
              <div><div className={s.metricVal}>100%</div><div className={s.metricLbl}>Digital</div></div>
            </div>
            <div className={s.heroSearchBar}>
              <input
                className={s.heroSearchInput}
                type="text"
                placeholder="Rechercher une catégorie… (ex: artistes, restaurants, médias)"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleHeroSearch(); }}
              />
              <button className={s.heroSearchBtn} onClick={handleHeroSearch}>
                Rechercher
              </button>
            </div>
          </div>

          {/* ── FORM CARD ── */}
          <div ref={formCardRef} className={`${s.fcard} ${shaking ? s.shake : ""}`}>
            <div className={s.fcardTop} />
            <div className={s.fcardInner}>
              <div className={s.fcardTitle}>Inscription gratuite</div>
              <div className={s.fcardSub}>
                Édition 2026 — Inscrivez votre entreprise gratuitement
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
      <section className={`${s.sec} ${s.secCat}`} id="rubriques" ref={catSectionRef}>
        <div className={`${s.secHeader} ${s.reveal}`}>
          <div className={s.secLabel}>L&apos;annuaire complet</div>
          <h2 className={s.secTitle}>+20 rubriques pour <span className={s.gold}>toute la diaspora</span></h2>
          <p className={s.secSubtitle}>Chaque rubrique est précédée d&apos;interviews de personnalités emblématiques : Artistes, Chefs de Produits, Managers, Directeurs artistiques…</p>
        </div>
        {heroSearch.trim() && (
          <div className={s.catFilterInfo}>
            {filteredCats.length} catégorie{filteredCats.length !== 1 ? "s" : ""} pour &laquo;&nbsp;{heroSearch.trim()}&nbsp;&raquo;
            <button className={s.catFilterClear} onClick={() => setHeroSearch("")}>Effacer</button>
          </div>
        )}
        <div className={s.catMega}>
          {filteredCats.map((c) => (
            <div key={c.name} className={s.catCard} onClick={scrollToForm} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && scrollToForm()}>
              <div className={s.catIcon}>{c.icon}</div>
              <div className={s.catName}>{c.name}</div>
              <div className={s.catDesc}>{c.desc}</div>
            </div>
          ))}
          {filteredCats.length === 0 && (
            <div className={s.catEmpty}>Aucune catégorie ne correspond à votre recherche.</div>
          )}
        </div>
      </section>


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
          <div className={s.proofBig}>21 catégories</div>
          <div className={s.proofSub}>pour référencer toute la diversité de la diaspora africaine</div>
          <div className={s.proofBadges}>
            <span className={s.pbadge}>🟢 Artistes & Musique</span>
            <span className={s.pbadge}>🟢 Médias & Communication</span>
            <span className={s.pbadge}>🟢 Scènes & Événements</span>
            <span className={s.pbadge}>🟢 Commerce & Services</span>
          </div>
        </div>
      </section>


      {/* ═══ AVIS CLIENTS ═══ */}
      <section className={`${s.sec} ${s.secReviews}`}>
        <div className={`${s.secHeader} ${s.reveal}`}>
          <div className={s.secLabel}>Témoignages</div>
          <h2 className={s.secTitle}>Ce qu&apos;ils disent de <span className={s.gold}>L&apos;Officiel</span></h2>
        </div>
        <div className={s.reviewGrid}>
          {[
            {
              title: "Un outil révolutionnaire",
              text: "L'Officiel d'Afrique comble un vide immense. Enfin un annuaire dédié à notre diaspora, pensé par et pour nous. L'interface digitale est moderne et l'accès aux contacts est d'une simplicité remarquable. C'est une vraie innovation !",
              name: "Aminata Diallo",
              role: "Directrice artistique — Label Wari Music",
              stars: 5,
            },
            {
              title: "Félicitations pour cet outil incroyable",
              text: "Bravo à toute l'équipe ! Ce guide est exactement ce dont la communauté avait besoin. J'ai déjà pu connecter avec 3 nouveaux partenaires pour mes événements. L'annuaire est complet, bien organisé et très professionnel.",
              name: "Ibrahima Koné",
              role: "Organisateur d'événements — Sabar Events",
              stars: 5,
            },
            {
              title: "Y aura-t-il une version print ?",
              text: "L'outil digital est fantastique, je l'utilise au quotidien pour trouver des contacts. Ma seule question : est-ce qu'une version papier est prévue ? Ce serait parfait à avoir sur mon bureau et à distribuer lors des salons professionnels.",
              name: "Fatou Ndiaye",
              role: "Chef de produit — Teranga Consulting",
              stars: 4,
            },
          ].map((r, i) => (
            <div key={i} className={`${s.reviewCard} ${s.reveal}`}>
              <div className={s.reviewStars}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} className={j < r.stars ? s.starFull : s.starEmpty}>★</span>
                ))}
              </div>
              <h3 className={s.reviewTitle}>{r.title}</h3>
              <p className={s.reviewText}>&ldquo;{r.text}&rdquo;</p>
              <div className={s.reviewAuthor}>
                <div className={s.reviewAvatar}>{r.name.charAt(0)}</div>
                <div>
                  <div className={s.reviewName}>{r.name}</div>
                  <div className={s.reviewRole}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
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

      {/* ═══ COMMENTAIRES ═══ */}
      <section className={`${s.sec} ${s.secComments}`}>
        <div className={`${s.secHeader} ${s.reveal}`}>
          <div className={s.secLabel}>Votre avis compte</div>
          <h2 className={s.secTitle}>Laissez un <span className={s.gold}>commentaire</span></h2>
        </div>
        <div className={s.commentWrap}>
          <div className={`${s.commentFormCard} ${s.reveal}`}>
            <div className={s.frow}>
              <div className={s.fg}>
                <label className={s.fgLabel}>Nom *</label>
                <input
                  className={s.fgInput}
                  type="text"
                  placeholder="Votre nom"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className={s.fg}>
                <label className={s.fgLabel}>Email *</label>
                <input
                  className={s.fgInput}
                  type="email"
                  placeholder="votre@email.com"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm((p) => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>
            <div className={s.fg}>
              <label className={s.fgLabel}>Commentaire *</label>
              <textarea
                className={s.fgTextarea}
                rows={4}
                placeholder="Partagez votre avis sur L'Officiel d'Afrique…"
                value={commentForm.text}
                onChange={(e) => setCommentForm((p) => ({ ...p, text: e.target.value }))}
              />
            </div>
            <button
              className={s.btnGold}
              onClick={() => {
                if (!commentForm.name.trim() || !commentForm.email.trim() || !commentForm.text.trim()) return;
                setComments((prev) => [
                  {
                    name: commentForm.name,
                    text: commentForm.text,
                    date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
                  },
                  ...prev,
                ]);
                setCommentForm({ name: "", email: "", text: "" });
              }}
            >
              Publier mon commentaire
            </button>
          </div>

          {comments.length > 0 && (
            <div className={s.commentList}>
              {comments.map((c, i) => (
                <div key={i} className={s.commentItem}>
                  <div className={s.commentHead}>
                    <div className={s.reviewAvatar}>{c.name.charAt(0)}</div>
                    <div>
                      <div className={s.commentAuthorName}>{c.name}</div>
                      <div className={s.commentDate}>{c.date}</div>
                    </div>
                  </div>
                  <p className={s.commentBody}>{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ NEWSLETTER ═══ */}
      <section className={`${s.sec} ${s.secNewsletter}`}>
        <div className={s.reveal}>
          <div className={s.nlInner}>
            <h2 className={s.nlTitle}>Restez informé</h2>
            <p className={s.nlSub}>
              Recevez les actualités de L&apos;Officiel d&apos;Afrique et les nouveautés de l&apos;édition 2026
            </p>
            {!nlDone ? (
              <>
                <div className={s.nlRow}>
                  <input
                    className={s.nlInput}
                    type="email"
                    placeholder="Votre adresse email"
                    value={nlEmail}
                    onChange={(e) => setNlEmail(e.target.value)}
                  />
                  <button
                    className={s.nlBtn}
                    onClick={() => {
                      if (nlEmail.includes("@")) setNlDone(true);
                    }}
                  >
                    S&apos;inscrire
                  </button>
                </div>
                <p className={s.nlRgpd}>
                  En vous inscrivant, vous acceptez de recevoir nos communications. Vous pouvez vous désabonner à tout moment. Conformément au RGPD, vos données sont traitées de manière sécurisée et ne sont jamais partagées avec des tiers.
                </p>
              </>
            ) : (
              <div className={s.nlSuccess}>
                ✓ Inscription confirmée ! Vous recevrez nos prochaines actualités.
              </div>
            )}
          </div>
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
        <div className={s.ftSub}>L&apos;annuaire professionnel de la diaspora africaine à Paris</div>
        <div className={s.ftCopy}>© 2026 L&apos;Officiel d&apos;Afrique — Tous droits réservés</div>
      </footer>

      {/* Floating badge */}
      <div className={s.floater} onClick={scrollToForm}>
        <span className={s.dot} />
        <span>Inscription <span className={s.flN}>gratuite</span></span>
      </div>
    </div>
  );
}
