import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-6xl font-bold text-fpl-purple">404</div>
      <h2 className="text-xl font-bold">Fant ikke siden</h2>
      <p className="text-sm text-fpl-muted">
        Denne siden finnes ikke. Sjekk URL-en og prøv igjen.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-fpl-purple px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-fpl-purple-light"
      >
        Tilbake til ligatabell
      </Link>
    </div>
  );
}
