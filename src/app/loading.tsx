export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-dta-sand border-t-dta-accent" />
        <p className="text-sm text-dta-taupe">Chargement...</p>
      </div>
    </div>
  );
}
