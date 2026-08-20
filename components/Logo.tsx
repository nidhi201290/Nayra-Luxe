import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Logo({
  variant = 'full',
  dark = false,
  className,
}: {
  variant?: 'full' | 'mark';
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', dark ? 'text-white' : 'text-charcoal', className)} aria-label="Nayra Luxe home">
      <Image
        src="/logo-mark.png"
        alt="Nayra Luxe"
        width={808}
        height={751}
        priority
        className="h-9 w-auto flex-none"
      />
      {variant === 'full' && (
        <span className={cn('font-display text-h4 font-semibold tracked-caps', dark ? 'text-white' : 'text-charcoal')}>
          NAYRA LUXE
        </span>
      )}
    </Link>
  );
}
