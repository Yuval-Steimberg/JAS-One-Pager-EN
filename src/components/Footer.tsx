import { MapPin, MessageCircle, Mail, Instagram } from "lucide-react";
import { FOOTER, CONTACT, BRAND, asset } from "@/content/site";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function Footer() {
  const handleNav = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cream/10 bg-forest-900 text-cream">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2 lg:pe-10">
            <img
              src={asset("jas-logo.png")}
              alt={BRAND.name}
              width={402}
              height={120}
              className="mb-5 inline-block h-10 w-auto rounded-md bg-white/95 px-3 py-2 shadow-soft"
            />
            <p className="max-w-md text-sm leading-relaxed text-cream/55">
              {FOOTER.blurb}
            </p>
            <div className="mt-6 flex gap-3">
              <SocialIcon href={CONTACT.whatsapp} label="וואטסאפ"><MessageCircle className="h-5 w-5" /></SocialIcon>
              <SocialIcon href={CONTACT.instagram} label="אינסטגרם"><Instagram className="h-5 w-5" /></SocialIcon>
              <SocialIcon href={`mailto:${CONTACT.email}`} label="אימייל"><Mail className="h-5 w-5" /></SocialIcon>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="קישורים מהירים">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-cream/80">
              ניווט
            </h3>
            <ul className="space-y-2.5">
              {FOOTER.quickLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNav(e, link.id)}
                    className="text-sm text-cream/55 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-cream/80">
              צרו קשר
            </h3>
            <ul className="space-y-3 text-sm text-cream/55">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 shrink-0 text-ember" />
                <a href={CONTACT.whatsapp} dir="ltr" className="transition-colors hover:text-cream">
                  {CONTACT.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-ember" />
                <a href={`mailto:${CONTACT.email}`} dir="ltr" className="transition-colors hover:text-cream">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/40 sm:flex-row">
          <p>© {year} {BRAND.name} · כל הזכויות שמורות</p>
          <ul className="flex gap-5">
            {FOOTER.legal.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="transition-colors hover:text-cream/70">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p dir="ltr">{BRAND.domain}</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-ember hover:bg-ember hover:text-white"
    >
      {children}
    </a>
  );
}
