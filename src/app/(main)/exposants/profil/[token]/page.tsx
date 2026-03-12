import ExhibitorProfileForm from "./ExhibitorProfileForm";

export const dynamic = "force-dynamic";

export default async function ExhibitorProfilePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ExhibitorProfileForm token={token} />;
}
