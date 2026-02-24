import { cn } from '@/lib/utils';

export default function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-fpl-border bg-fpl-surface p-4', className)}>
      {children}
    </div>
  );
}
