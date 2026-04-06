import { Hotel, Car, UtensilsCrossed, MapPin, ExternalLink } from "lucide-react";

interface PrepareVisitLink {
  label: string;
  url: string;
  description?: string;
}

interface PrepareVisitProps {
  eventName: string;
  eventDate?: string;
  hotels?: PrepareVisitLink[];
  transport?: PrepareVisitLink[];
  restaurants?: PrepareVisitLink[];
  activities?: PrepareVisitLink[];
}

function PrepareBlock({
  icon: Icon,
  title,
  links,
  gradient,
}: {
  icon: typeof Hotel;
  title: string;
  links: PrepareVisitLink[];
  gradient: string;
}) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-dta-sand/40 bg-gradient-to-br ${gradient} p-5`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon size={18} className="text-dta-accent" />
        <h3 className="font-serif text-base font-bold text-dta-dark">{title}</h3>
      </div>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="group flex items-center justify-between rounded-lg bg-white/60 px-3 py-2.5 transition-all hover:bg-white hover:shadow-sm"
            >
              <div>
                <span className="text-sm font-medium text-dta-dark group-hover:text-dta-accent">
                  {link.label}
                </span>
                {link.description && (
                  <p className="text-xs text-dta-taupe">{link.description}</p>
                )}
              </div>
              <ExternalLink size={14} className="flex-shrink-0 text-dta-taupe group-hover:text-dta-accent" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PrepareVisit({
  eventName,
  hotels,
  transport,
  restaurants,
  activities,
}: PrepareVisitProps) {
  const hasContent = hotels?.length || transport?.length || restaurants?.length || activities?.length;
  if (!hasContent) return null;

  return (
    <section className="mt-12 rounded-2xl border border-dta-sand/50 bg-dta-beige/30 p-6 sm:p-8">
      <h2 className="font-serif text-xl font-bold text-dta-dark sm:text-2xl">
        Préparer votre venue
      </h2>
      <p className="mt-1 text-sm text-dta-taupe">
        Tout pour organiser votre séjour autour de {eventName}.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {hotels && hotels.length > 0 && (
          <PrepareBlock
            icon={Hotel}
            title="Où dormir ?"
            links={hotels}
            gradient="from-amber-50/80 to-orange-50/40"
          />
        )}
        {transport && transport.length > 0 && (
          <PrepareBlock
            icon={Car}
            title="Comment se déplacer ?"
            links={transport}
            gradient="from-sky-50/80 to-indigo-50/40"
          />
        )}
        {restaurants && restaurants.length > 0 && (
          <PrepareBlock
            icon={UtensilsCrossed}
            title="Où manger ?"
            links={restaurants}
            gradient="from-rose-50/80 to-pink-50/40"
          />
        )}
        {activities && activities.length > 0 && (
          <PrepareBlock
            icon={MapPin}
            title="Que faire à Paris ?"
            links={activities}
            gradient="from-violet-50/80 to-purple-50/40"
          />
        )}
      </div>

      <p className="mt-4 text-[10px] text-dta-taupe/60">
        Ces liens sont des liens affiliés. Dream Team Africa perçoit une
        commission sans frais supplémentaires pour vous.
      </p>
    </section>
  );
}
