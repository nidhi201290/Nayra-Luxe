import { Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

const GRADIENTS = [
  'from-[#F4E3D8] to-[#EAD2C0]',
  'from-[#FAF5EC] to-[#E7DFD1]',
  'from-[#EFE0C9] to-[#D9C7A3]',
  'from-[#F6EAD9] to-[#E4C9A3]',
  'from-[#F0E6D6] to-[#D9BFA0]',
  'from-[#F7EFE3] to-[#E0CDB0]',
];

interface ProductImageProps {
  seed: number;
  name: string;
  className?: string;
  iconClassName?: string;
}

export default function ProductImage({ seed, name, className, iconClassName }: ProductImageProps) {
  const gradient = GRADIENTS[seed % GRADIENTS.length];
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-gradient-to-br',
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <Gem className={cn('h-16 w-16 text-charcoal', iconClassName)} />
      </div>
      <span className="font-display text-h1 text-charcoal/40">{initial}</span>
    </div>
  );
}
