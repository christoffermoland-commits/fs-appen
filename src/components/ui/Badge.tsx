import { cn } from '@/lib/utils';

export default function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'green' | 'pink' | 'cyan' | 'gold';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-fpl-purple-light text-foreground',
        variant === 'green' && 'bg-fpl-green/20 text-fpl-green',
        variant === 'pink' && 'bg-fpl-pink/20 text-fpl-pink',
        variant === 'cyan' && 'bg-fpl-cyan/20 text-fpl-cyan',
        variant === 'gold' && 'bg-fpl-gold/20 text-fpl-gold'
      )}
    >
      {children}
    </span>
  );
}
