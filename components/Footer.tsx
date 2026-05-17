import Link from 'next/link';
import { NewsletterForm } from './NewsletterForm';

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'The Ledger';

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t-4 border-double border-ink bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="display-serif text-2xl font-bold mb-2">{SITE_NAME}</div>
          <p className="text-sm body-serif text-muted leading-relaxed">
            An independent journal covering markets, money, and the global economy
            with rigor and a point of view.
          </p>
        </div>
        <div>
          <div className="label-sans mb-4">Subscribe</div>
          <NewsletterForm compact />
        </div>
        <div>
          <div className="label-sans mb-4">Sections</div>
          <ul className="space-y-1 text-sm body-serif">
            <li><Link href="/category/markets" className="hover:text-accent">Markets</Link></li>
            <li><Link href="/category/personal-finance" className="hover:text-accent">Personal Finance</Link></li>
            <li><Link href="/category/crypto" className="hover:text-accent">Crypto</Link></li>
            <li><Link href="/category/economy" className="hover:text-accent">Economy</Link></li>
            <li><Link href="/category/investing" className="hover:text-accent">Investing</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between text-xs label-sans text-muted">
          <span>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</span>
          <span>Set in Playfair, Caslon, and Inter Tight.</span>
        </div>
      </div>
    </footer>
  );
}
