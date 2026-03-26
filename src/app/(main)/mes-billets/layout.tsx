import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes billets | Dream Team Africa",
  robots: { index: false, follow: false },
};

export default function MesBilletsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
