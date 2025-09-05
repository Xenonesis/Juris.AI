import Link from 'next/link';
import { Scale } from 'lucide-react';

export function JurisLogo({ href = "/landing" }: { href?: string }) {
  return (
    (<Link
      href={href}
      className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md group"
      aria-label="Go to Home">

      <div className="relative w-9 h-9 flex items-center justify-center rounded-xl professional-gradient group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
        <Scale
          className="h-5 w-5 text-white"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
        <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <span className="text-xl md:text-2xl font-bold text-high-contrast group-hover:scale-105 transition-transform duration-300">
        Juris.AI
      </span>

    </Link>)
  );
}