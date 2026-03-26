import Image from "next/image";
import { Heart, Users, Globe, Music, Palette, GraduationCap, HandHeart, ArrowRight, Mail } from "lucide-react";
import DonationForm from "./DonationForm";

export const metadata = {
  title: "Nous Soutenir — Dream Team Africa",
  description:
    "Soutenez Dream Team Africa dans sa mission de promotion de la culture africaine à Paris. Don, bénévolat, partenariat.",
  alternates: { canonical: "https://dreamteamafrica.com/faire-un-don" },
};

const impacts = [
  {
    icon: Music,
    title: "Événements culturels",
    description:
      "Financer des festivals, projections, concerts et expositions qui célèbrent la richesse culturelle africaine.",
  },
  {
    icon: Palette,
    title: "Artisans & créateurs",
    description:
      "Accompagner les artisans de la diaspora dans la valorisation et la vente de leurs créations.",
  },
  {
    icon: GraduationCap,
    title: "Éducation & transmission",
    description:
      "Organiser des ateliers, conférences et rencontres pour transmettre les savoirs et traditions africaines.",
  },
  {
    icon: Globe,
    title: "Rayonnement culturel",
    description:
      "Faire rayonner la culture africaine à Paris et en Europe à travers le journal L'Afropéen et nos médias.",
  },
];

const ways = [
  {
    title: "Faire un don",
    description:
      "Chaque contribution, même modeste, nous aide à organiser des événements gratuits et accessibles à tous.",
    icon: Heart,
    color: "bg-red-100 text-red-600",
    cta: "Faire un don",
    href: "https://www.helloasso.com/associations/dream-team-africa",
    external: true,
  },
  {
    title: "Devenir bénévole",
    description:
      "Rejoignez notre équipe pour aider à l'organisation des événements, à l'accueil du public ou à la communication.",
    icon: HandHeart,
    color: "bg-dta-accent/10 text-dta-accent",
    cta: "Nous contacter",
    href: "/nous-contacter",
    external: false,
  },
  {
    title: "Devenir partenaire",
    description:
      "Entreprises, associations, médias : associez votre image à la promotion de la culture africaine à Paris.",
    icon: Users,
    color: "bg-blue-100 text-blue-600",
    cta: "Proposer un partenariat",
    href: "/nous-contacter",
    external: false,
  },
];

export default function NousSoutenirPage() {
  return (
    <div>
      {/* Hero + Formulaire de don */}
      <div className="relative overflow-hidden bg-dta-dark">
        <Image
          src="https://dreamteamafricamedia.b-cdn.net/faireundon/faireundon.png"
          alt="Soutenez Dream Team Africa"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dta-dark via-dta-dark/80 to-dta-dark/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-dta-accent)_0%,_transparent_50%)] opacity-15" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-600/20 backdrop-blur-sm">
                <Heart size={28} className="text-red-400" />
              </div>
              <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl">
                Transmettons notre culture aux plus jeunes
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-dta-sand/80">
                Dream Team Africa s&apos;engage pour la promotion et la transmission
                de la culture africaine aupr&egrave;s des jeunes g&eacute;n&eacute;rations
                &agrave; Paris. Votre don finance des ateliers, des festivals et des
                actions &eacute;ducatives pour que notre h&eacute;ritage culturel
                continue de vivre et d&apos;inspirer.
              </p>
              <a
                href="/nous-contacter"
                className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-white/30 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <Mail size={16} />
                Nous contacter
              </a>
            </div>

            <div>
              <DonationForm />
            </div>
          </div>
        </div>
      </div>

      {/* Impact */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-dta-dark">
              Votre soutien permet de
            </h2>
            <p className="mt-3 text-sm text-dta-char/70">
              Chaque geste compte pour faire vivre la culture africaine
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {impacts.map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-card)] bg-dta-bg p-6 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-dta-accent/10">
                  <item.icon size={24} className="text-dta-accent" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold text-dta-dark">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-dta-char/70">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ways to support */}
      <div className="bg-dta-bg py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-dta-dark">
              Comment nous soutenir ?
            </h2>
            <p className="mt-3 text-sm text-dta-char/70">
              Plusieurs fa&ccedil;ons de contribuer &agrave; notre mission
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {ways.map((way) => (
              <div
                key={way.title}
                className="flex flex-col rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)]"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-[var(--radius-button)] ${way.color}`}
                >
                  <way.icon size={22} />
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold text-dta-dark">
                  {way.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-dta-char/70">
                  {way.description}
                </p>
                <a
                  href={way.href}
                  target={way.external ? "_blank" : undefined}
                  rel={way.external ? "noopener noreferrer" : undefined}
                  className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
                >
                  {way.cta}
                  <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-dta-bg py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-dta-dark">
            Ensemble, faisons rayonner la culture africaine
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-dta-char/70">
            Dream Team Africa est une aventure collective. Que vous soyez
            particulier, entreprise ou association, votre soutien fait la
            diff&eacute;rence.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://www.helloasso.com/associations/dream-team-africa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark"
            >
              <Heart size={16} />
              Faire un don
            </a>
            <a
              href="/nous-contacter"
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-sand px-8 py-3.5 text-sm font-semibold text-dta-dark transition-colors hover:bg-dta-beige"
            >
              <Mail size={16} />
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
