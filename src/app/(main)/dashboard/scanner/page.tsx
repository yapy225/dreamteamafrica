import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ScannerClient from "./ScannerClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Scanner billets",
};

export default async function ScannerPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return <ScannerClient />;
}
