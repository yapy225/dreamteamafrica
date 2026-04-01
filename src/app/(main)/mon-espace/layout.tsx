import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon espace | Dream Team Africa",
  robots: { index: false, follow: false },
};

export default function MonEspaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
