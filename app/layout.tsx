import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://justasecond.co.il"),
  title: "Just A Second | מיחדוש, קיימות וחפצים עם חיים שניים",
  description:
    "Just A Second היא יוזמה חברתית-סביבתית שמחזירה חפצים למעגל החיים דרך מיחדוש, שימוש חוזר, גלריה קהילתית, סדנאות והשפעה מקומית.",
  keywords: [
    "שימוש חוזר", "מיחדוש", "אפסייקלינג", "קיימות", "כלכלה מעגלית",
    "עיצוב חברתי", "גלריה", "תל אביב", "Just A Second",
  ],
  authors: [{ name: "Just A Second" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "Just A Second",
    title: "Just A Second | נותנים לחפצים חיים שניים",
    description:
      "המיזם הראשון בישראל לשימוש חוזר ומיחדוש — קיימות, עיצוב וקהילה. בואו לתת לחפצים חיים שניים.",
    url: "/",
    images: [{ url: "/images/hero_new.jpeg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#FBF8F1",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Just A Second",
  alternateName: "ג'אסט א סקנד",
  url: "https://justasecond.co.il",
  logo: "https://justasecond.co.il/images/jas-logo.png",
  description: "המיזם הראשון בישראל לשימוש חוזר ומיחדוש.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "מנחם בגין 34",
    addressLocality: "תל אביב",
    addressCountry: "IL",
  },
  sameAs: ["https://instagram.com/justasecond.il"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" type="image/png" href="/images/jas-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;700;900&family=Heebo:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
