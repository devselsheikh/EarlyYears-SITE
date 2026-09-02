const eduhubLogo = '/images/eduhub/logo.png';
const eduhubLogoWhite = '/images/eduhub/logo-white.png';

type EduHubLogoProps = {
  className?: string;
  variant?: 'default' | 'white';
};

export default function EduHubLogo({ className = "h-10 w-auto", variant = 'default' }: EduHubLogoProps) {
  return (
    <img
      src={variant === 'white' ? eduhubLogoWhite : eduhubLogo}
      alt="EduHub"
      className={`max-w-[180px] object-contain ${className}`}
    />
  );
}
