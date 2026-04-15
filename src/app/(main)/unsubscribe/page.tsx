import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, Mail } from "lucide-react";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Désinscription newsletter — Dream Team Africa",
  description: "Confirmation de désinscription de la newsletter Dream Team Africa.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ email?: string }>;

export default async function UnsubscribePage({ searchParams }: { searchParams: SearchParams }) {
  const { email } = await searchParams;

  if (!email) {
    return <Shell icon="error" title="Lien invalide">
      <p>Le lien de désinscription est incomplet. Envoyez-nous un email à{" "}
        <a href="mailto:hello@dreamteamafrica.com" className="font-semibold text-dta-accent underline">hello@dreamteamafrica.com</a>
        {" "}et nous vous désinscrivons manuellement.
      </p>
    </Shell>;
  }

  const normalized = email.trim().toLowerCase();

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: normalized },
    select: { email: true, isActive: true },
  });

  if (!existing) {
    return <Shell icon="success" title="Adresse non trouvée">
      <p>L&apos;adresse <strong>{normalized}</strong> ne figure pas dans notre liste de diffusion.</p>
      <p className="mt-2 text-sm text-dta-char/60">Vous ne recevrez aucun email de notre part.</p>
    </Shell>;
  }

  if (!existing.isActive) {
    return <Shell icon="success" title="Déjà désinscrit">
      <p>L&apos;adresse <strong>{normalized}</strong> est déjà désinscrite de notre newsletter.</p>
      <p className="mt-2 text-sm text-dta-char/60">Vous ne recevrez plus d&apos;emails de notre part.</p>
    </Shell>;
  }

  await prisma.newsletterSubscriber.update({
    where: { email: normalized },
    data: { isActive: false },
  });

  return <Shell icon="success" title="Désinscription confirmée">
    <p>L&apos;adresse <strong>{normalized}</strong> a bien été retirée de notre liste de diffusion.</p>
    <p className="mt-2 text-sm text-dta-char/60">
      Vous ne recevrez plus aucune newsletter. Désolé de vous voir partir — si c&apos;est une erreur, écrivez-nous à{" "}
      <a href="mailto:hello@dreamteamafrica.com" className="font-semibold text-dta-accent underline">hello@dreamteamafrica.com</a>.
    </p>
  </Shell>;
}

function Shell({ icon, title, children }: { icon: "success" | "error"; title: string; children: React.ReactNode }) {
  const Icon = icon === "success" ? CheckCircle2 : XCircle;
  const color = icon === "success" ? "text-green-600" : "text-red-500";
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-dta-beige/60 ${color}`}>
        <Icon size={36} />
      </div>
      <h1 className="mt-6 font-serif text-3xl font-bold text-dta-dark">{title}</h1>
      <div className="mt-4 text-base leading-relaxed text-dta-char/80">{children}</div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] bg-dta-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-dta-accent-dark">
          Retour à l&apos;accueil
        </Link>
        <a href="mailto:hello@dreamteamafrica.com" className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-dta-accent px-6 py-3 text-sm font-semibold text-dta-accent transition-colors hover:bg-dta-accent/5">
          <Mail size={14} /> Nous contacter
        </a>
      </div>
    </div>
  );
}
