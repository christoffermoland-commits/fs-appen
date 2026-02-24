'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-4xl">😵</div>
      <h2 className="text-xl font-bold">Noe gikk galt!</h2>
      <p className="max-w-md text-sm text-fpl-muted">
        {error.message.includes('FPL API')
          ? 'FPL API-et er midlertidig utilgjengelig. Dette skjer ofte etter at en gameweek er ferdig mens data oppdateres.'
          : 'Det oppstod en uventet feil. Prøv igjen om litt.'}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-fpl-purple px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-fpl-purple-light"
      >
        Prøv igjen
      </button>
    </div>
  );
}
