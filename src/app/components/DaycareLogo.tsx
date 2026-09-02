const daycareLogo = '/images/daycare/logo.png';

export default function DaycareLogo({ className = 'h-10 w-auto', company = false }: { className?: string; company?: boolean }) {
  return (
    <img
      src={daycareLogo}
      alt={company ? 'Early Years Company' : 'Early Years — The Daycare'}
      className={`object-contain object-left ${className}`}
      style={company ? { clipPath: 'inset(0 0 14% 0)' } : undefined}
    />
  );
}
