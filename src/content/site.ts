/**
 * ────────────────────────────────────────────────────────────────────────────
 *  Just A Second — Central content config (Hebrew, RTL)
 * ────────────────────────────────────────────────────────────────────────────
 *  Everything the site displays lives here so copy, photos, stats, products
 *  and links can be edited without touching component code.
 *
 *  ▸ To replace a photo: drop a new file in /public/images and update the path.
 *  ▸ To edit copy: change the strings below.
 *  ▸ Image paths are resolved through asset() so they work under any base URL.
 */

/** Resolve a /public asset against Vite's base URL (works on sub-path hosts). */
export const asset = (file: string) =>
  `${import.meta.env.BASE_URL}images/${file}`;

/** Resolve a /public/videos asset against Vite's base URL. */
export const videoAsset = (file: string) =>
  `${import.meta.env.BASE_URL}videos/${file}`;

export type NavItem = { id: string; label: string };

/** Header / anchor navigation. Each `id` must match a <section id> on the page. */
export const NAV: NavItem[] = [
  { id: "home", label: "בית" },
  { id: "about", label: "עלינו" },
  { id: "gallery", label: "חנות הגלריה" },
  { id: "experience", label: "חוויה ב-JAS" },
  { id: "activity", label: "מרחבי פעולה" },
  { id: "team", label: "הצוות שלנו" },
  { id: "volunteer", label: "התנדבות ותרומה" },
  { id: "contact", label: "דברו איתנו" },
];

export const CONTACT = {
  whatsapp: "https://wa.me/972587876549",
  whatsappDisplay: "058-787-6549",
  phone: "+972587876549",
  email: "justasecondil2@gmail.com",
  instagram: "https://instagram.com/justasecond.il",
  instagramHandle: "@justasecond.il",
  shop: "https://justasecond.co.il/shop",
  address: "מנחם בגין 34, תל אביב",
  mapQuery: "Menachem+Begin+34+Tel+Aviv",
  mapEmbed:
    "https://www.google.com/maps?q=Menachem+Begin+34+Tel+Aviv&output=embed",
  hours: [
    { day: "רביעי", time: "11:00–17:00" },
    { day: "חמישי", time: "11:00–17:00" },
    { day: "שישי", time: "10:00–14:00" },
  ],
};

export const BRAND = {
  name: "Just A Second",
  nameHe: "ג'אסט א סקנד",
  tagline: "Upcycling objects. Uplifting lives.",
  domain: "justasecond.co.il",
};

export const HERO = {
  kicker: "המיזם הראשון בישראל לשימוש חוזר ומיחדוש",
  // Split for staged word-reveal animation
  titleLines: ["נותנים לחפצים", "חיים שניים"],
  subtitle:
    "אוספים, מתקנים ומעצבים מחדש חפצים שהיו מושלכים — ויוצרים קהילה סביב קיימות, עיצוב והשפעה.",
  image: asset("hero_new.jpeg"),
  imageAlt: "מרחב הגלריה של Just A Second עם רהיטים שעברו מיחדוש",
  ctas: [
    { label: "לחנות הגלריה", href: "#gallery", variant: "primary" as const },
    { label: "להתנדבות ותרומה", href: "#volunteer", variant: "outline" as const },
    { label: "דברו איתנו", href: "#contact", variant: "ghost" as const },
  ],
  scrollCue: "גללו לגילוי",
};

/** Brand keywords for the infinite ticker between sections. */
export const TICKER_WORDS = [
  "שימוש חוזר",
  "מיחדוש",
  "קיימות",
  "עיצוב חברתי",
  "קהילה",
  "חפצים עם סיפור",
  "כלכלה מעגלית",
  "Second Life",
  "Upcycling",
  "Gallery Store",
];

export const ABOUT = {
  kicker: "מי אנחנו",
  title: "נותנים לחפצים סיפור חדש —\nומחזירים אותם לחיים",
  lead:
    "Just A Second הוקמה כדי לייצר שינוי שיטתי באופן שבו ישראל מתייחסת לחומרים ולחפצים. במקום להשליך — אנחנו אוספים, מתקנים, מעצבים מחדש ומחזירים לחיים.",
  paragraphs: [
    "אנחנו אוספים חפצים מהרחוב, מפרויקטים של התחדשות עירונית ומעסקים — חפצים שהיו מסיימים את דרכם בפח. כל פריט עובר תהליך קפדני של תיקון, שיפוץ ומיחדוש בידי מעצבים, חיילי מילואים ומתנדבים.",
    "הפריטים המחודשים נמכרים בחנות הגלריה שלנו, וכל הרווחים מופנים לתמיכה בבריאות הנפש של לוחמי מילואים. ככה חפץ אחד יוצר מעגל שלם של ערך — סביבתי, חברתי וכלכלי.",
  ],
  signature: "כי רגע אחד של מחשבה יכול לשנות את העתיד.",
  image: asset("jas-restoration.jpeg"),
  imageAlt: "תהליך שיפוץ ומיחדוש של רהיט בסטודיו של Just A Second",
  imageSecondary: asset("jas-workshop.jpeg"),
  imageSecondaryAlt: "סדנת עבודה עם חומרים בשימוש חוזר",
};

export type Pillar = {
  key: string;
  title: string;
  text: string;
  image: string;
  alt: string;
};

export const PILLARS: Pillar[] = [
  {
    key: "env",
    title: "סביבתי",
    text: "כל חפץ שמקבל חיים שניים הוא פחות פסולת בהטמנה ופחות ייצור חדש. שימוש חוזר ומיחדוש כברירת מחדל — לא כחריג.",
    image: asset("jas-treble-lamp.jpeg"),
    alt: "מנורה שעוצבה מחדש מחומרים בשימוש חוזר",
  },
  {
    key: "social",
    title: "חברתי",
    text: "מרחב של קהילה, מתנדבים ולוחמי מילואים. יוצרים יחד, לומדים מקצוע ומחזקים אנשים דרך עשייה משמעותית.",
    image: asset("jas-woven-chair.jpeg"),
    alt: "כיסא קלוע שחודש בעבודת יד",
  },
  {
    key: "econ",
    title: "כלכלי",
    text: "מודל של כלכלה מעגלית: ערך כלכלי נוצר מתוך מה שכבר קיים. 100% מהרווחים מוקדשים לבריאות הנפש של לוחמים.",
    image: asset("jas-orange-cabinet.jpeg"),
    alt: "ארון כתום שעבר מיחדוש ועיצוב מחדש",
  },
];

export type ProcessStep = {
  num: string;
  title: string;
  text: string;
  image: string;
  alt: string;
};

export const PROCESS: ProcessStep[] = [
  {
    num: "01",
    title: "איסוף",
    text: "אוספים חפצים מהרחוב, מהתחדשות עירונית ומעסקים — לפני שהם הופכים לפסולת.",
    image: asset("jas-shop-display.jpeg"),
    alt: "חפצים שנאספו ומחכים למיון",
  },
  {
    num: "02",
    title: "מיון",
    text: "כל פריט נבדק ומסווג לפי מצב, חומר ופוטנציאל לחיים שניים.",
    image: asset("jas-vases.jpeg"),
    alt: "אגרטלים ממוינים על מדף",
  },
  {
    num: "03",
    title: "תיקון ומיחדוש",
    text: "מתקנים, מנקים ומשפצים בידי בעלי מקצוע, מתנדבים ולוחמי מילואים.",
    image: asset("jas-restoration.jpeg"),
    alt: "תהליך תיקון ושיפוץ של רהיט",
  },
  {
    num: "04",
    title: "עיצוב",
    text: "מעצבים מוסיפים נגיעה ייחודית — וכל חפץ הופך לפריט אחד ויחיד.",
    image: asset("jas-chair-shelves.jpeg"),
    alt: "כיסא שהוסב למדף עיצובי",
  },
  {
    num: "05",
    title: "מכירה בגלריה",
    text: "הפריט המחודש מוצג ונמכר בחנות הגלריה — עם הסיפור שלו.",
    image: asset("jas-gallery-chair.jpeg"),
    alt: "כיסא מעוצב בחנות הגלריה",
  },
  {
    num: "06",
    title: "תרומה והשפעה",
    text: "כל הרווחים מופנים לבריאות הנפש של לוחמי מילואים — מעגל שנסגר.",
    image: asset("jas-pet-bed.jpeg"),
    alt: "מיטת חיות מחמד שנוצרה מחומרים בשימוש חוזר",
  },
];

export type Product = {
  name: string;
  category: string;
  price: string;
  tag: string;
  image: string;
  alt: string;
};

export const PRODUCTS: Product[] = [
  {
    name: "כיסא מרופד מחודש",
    category: "ישיבה",
    price: "₪480",
    tag: "כמו חדש",
    image: asset("jas-gallery-chair.jpeg"),
    alt: "כיסא מרופד שעבר מיחדוש",
  },
  {
    name: "מנורת רצפה Treble",
    category: "תאורה",
    price: "₪390",
    tag: "פריט יחיד",
    image: asset("jas-treble-lamp.jpeg"),
    alt: "מנורת רצפה מעוצבת מחומרים בשימוש חוזר",
  },
  {
    name: "ארון אחסון כתום",
    category: "אחסון",
    price: "₪620",
    tag: "כמו חדש",
    image: asset("jas-orange-cabinet.jpeg"),
    alt: "ארון אחסון כתום מחודש",
  },
  {
    name: "כיסא קלוע בעבודת יד",
    category: "ישיבה",
    price: "₪450",
    tag: "פריט יחיד",
    image: asset("jas-woven-chair.jpeg"),
    alt: "כיסא קלוע שחודש בעבודת יד",
  },
  {
    name: "אוסף אגרטלים",
    category: "אקססוריז",
    price: "החל מ-₪80",
    tag: "אספנות",
    image: asset("jas-vases.jpeg"),
    alt: "אוסף אגרטלים מעוצבים",
  },
  {
    name: "מדף מכיסא Vintage",
    category: "אחסון",
    price: "₪320",
    tag: "פריט יחיד",
    image: asset("jas-chair-shelves.jpeg"),
    alt: "מדף שנוצר מכיסא ישן",
  },
];

export const GALLERY = {
  kicker: "חנות הגלריה",
  title: "כל פריט הוא\nאחד ויחיד",
  lead:
    "חנות הגלריה שלנו מציגה 'אוצרות רחוב' שעברו תהליך מיחדוש קפדני. רהיטים, תאורה, כלי בית, אמנות ועוד — לכל פריט יש סיפור.",
  note: "אין שני פריטים זהים. כל אחד עבר מסע משלו והפך למתנה או לרהיט עם ערך אישי ורגשי.",
  tags: ["ישיבה", "שולחנות", "אחסון", "תאורה", "אקססוריז", "ישראליאנה"],
  cta: { label: "לחנות המקוונת", href: "https://justasecond.co.il/shop" },
};

export type Experience = {
  title: string;
  text: string;
  detail: string;
  image: string;
  alt: string;
};

export const EXPERIENCES: Experience[] = [
  {
    title: "סדנאות מיחדוש ושיפוץ",
    text: "סדנאות בהנחיית צוות JAS או אמנים אורחים — יוצרים פריטים ייחודיים מחומרים בשימוש חוזר.",
    detail: "13 סדנאות שונות",
    image: asset("jas-workshop.jpeg"),
    alt: "משתתפים בסדנת מיחדוש",
  },
  {
    title: "סיורים והרצאות",
    text: "סיור בחנות הגלריה, במחסן ובסטודיו, מפגש עם לוחמי מילואים ומתנדבים, והרצאת הסיפור של JAS.",
    detail: "כולל פינת קפה",
    image: asset("jas-shop-display.jpeg"),
    alt: "סיור בחנות הגלריה",
  },
  {
    title: "אירועים ומפגשים",
    text: "מרחב עם נשמה — עד 50 מקומות, מערכת הגברה, מיזוג מלא וחניה חופשית. אידאלי לימי גיבוש.",
    detail: "מתאים לארגונים",
    image: asset("jas-gallery-painting.jpeg"),
    alt: "מרחב אירועים בגלריה",
  },
];

export type Activity = {
  title: string;
  subtitle: string;
  problem: string;
  solution: string;
  audience: string;
  impact: string;
  image: string;
  alt: string;
};

export const ACTIVITIES: Activity[] = [
  {
    title: "אוצרותמ״א",
    subtitle: "התחדשות עירונית מקיימת",
    problem:
      "בפרויקטים של פינוי-בינוי נזרקים אלפי רהיטים ואלמנטים אדריכליים לפני ההריסה.",
    solution:
      "מפנים, מפרקים ומצילים רהיטים ואלמנטים לפני ההריסה — לשימוש חוזר ולמיחדוש.",
    audience: "יזמים, קבלנים וחברות התחדשות עירונית",
    impact: "ניקוד בנייה ירוקה ליזמים והצלת אלפי פריטים מהטמנה",
    image: asset("jas-restoration.jpeg"),
    alt: "פריטים שניצלו מפרויקט התחדשות עירונית",
  },
  {
    title: "קניונים ותעשייה",
    subtitle: "פתרונות פינוי מקיימים",
    problem:
      "חנויות ועסקים שנסגרים מייצרים כמויות עצומות של פסולת רהיטים ותצוגה.",
    solution:
      "פתרונות פינוי מקיימים ופירוק סלקטיבי של חנויות נסגרות — בשיתוף קבוצת עזריאלי.",
    audience: "רשתות קמעונאיות, קניונים ועסקים",
    impact: "צמצום פסולת מסחרית והחזרת ערך לפריטים שלמים",
    image: asset("jas-shop-display.jpeg"),
    alt: "פינוי מקיים של תצוגת חנות",
  },
  {
    title: "אוצרות רחוב",
    subtitle: "משנים את מנגנון פינוי הגזם",
    problem:
      "חפצים שלמים ושמישים מושלכים לרחוב כגזם ומסתיימים בהטמנה.",
    solution:
      "משנים את מנגנון פינוי הפסולת הביתית העירונית — לשימוש חוזר ולמיחדוש.",
    audience: "רשויות מקומיות ותושבים",
    impact: "פחות פסולת עירונית וחנות גלריה מלאה בחפצים עם סיפור",
    image: asset("jas-vases.jpeg"),
    alt: "אוצרות רחוב שנאספו וחודשו",
  },
];

export type Stat = { to: number; suffix?: string; label: string };

export const STATS: Stat[] = [
  { to: 480, suffix: " טון", label: "חומרים שניצלו מהטמנה" },
  { to: 3800, suffix: "+", label: "פריטים מחודשים שנמכרו" },
  { to: 630, suffix: "+", label: "דירות שפונו ותכולתן ניצלה" },
  { to: 60, suffix: "+", label: "מתנדבים פעילים" },
  { to: 50, suffix: "+", label: "לוחמי מילואים" },
  { to: 100, suffix: "%", label: "מהרווחים נתרמים לבריאות הנפש" },
];

export const MOSAIC = [
  { image: asset("jas-workshop.jpeg"), alt: "סדנת עבודה" },
  { image: asset("jas-chair-shelves.jpeg"), alt: "כיסא שהוסב למדף" },
  { image: asset("jas-treble-lamp.jpeg"), alt: "מנורה מעוצבת" },
  { image: asset("jas-restoration.jpeg"), alt: "תהליך שיפוץ" },
  { image: asset("jas-orange-cabinet.jpeg"), alt: "ארון כתום מחודש" },
  { image: asset("jas-shop-display.jpeg"), alt: "תצוגת חנות" },
  { image: asset("jas-vases.jpeg"), alt: "אגרטלים מעוצבים" },
  { image: asset("jas-gallery-painting.jpeg"), alt: "אמנות בגלריה" },
];

export type TeamMember = { initial: string; name: string; role: string; desc: string };

export const TEAM: TeamMember[] = [
  { initial: "י", name: "ד״ר יעל שטיינברג", role: "מייסדת ומנכ״לית", desc: "החזון שמאחורי Just A Second" },
  { initial: "א", name: "אסתי אחימאיר", role: "שותפה־מייסדת", desc: "שותפויות עם יזמים ורשויות" },
  { initial: "ל", name: "ליאת ריקליס אורן", role: "מתנדבת ומנהלת הגלריה", desc: "כל פריט מוצא בית חדש" },
  { initial: "ש", name: "שרון כהן", role: "מנחת סדנאות", desc: "סדנאות שיפוץ ומיחדוש" },
  { initial: "ג", name: "גיל צ׳רוונקה", role: "עיצוב ופרויקטים מיוחדים", desc: "טרנספורמציה יצירתית" },
];

export const PARTNERS = [
  "תדהיר", "כאן התור", "בנק הפועלים", "שיכון ובינוי",
  "קרסו", "נארשה", "ICR", "אביב מליסרון",
  "קרן גנדיר", "Bosch", "בשביל המחר", "קבוצת עזריאלי",
];

export const VOLUNTEER = {
  kicker: "הצטרפו אלינו",
  title: "כל זוג ידיים\nיוצר חיים שניים",
  lead:
    "אתם לא צריכים להיות מעצבים כדי לעשות שינוי. צריך רק רצון לתת לחפצים — ולאנשים — הזדמנות נוספת. בואו להיות חלק מהקהילה שלנו.",
  cards: [
    {
      title: "אני רוצה להתנדב",
      text: "הצטרפו לצוות המתנדבים — באיסוף, בשיפוץ, בגלריה או בסדנאות. כל שעה יוצרת ערך.",
      cta: { label: "אני רוצה להתנדב", href: "https://wa.me/972587876549" },
    },
    {
      title: "אני רוצה לתרום",
      text: "תרומה כספית או תרומת חפצים — כל תרומה מתורגמת ישירות להשפעה סביבתית וחברתית.",
      cta: { label: "אני רוצה לתרום", href: "https://wa.me/972587876549" },
    },
    {
      title: "דברו איתנו בוואטסאפ",
      text: "יש לכם רעיון, שאלה או שיתוף פעולה? אנחנו כאן וזמינים בוואטסאפ.",
      cta: { label: "דברו איתנו בוואטסאפ", href: "https://wa.me/972587876549" },
    },
  ],
};

export const CONTACT_SECTION = {
  kicker: "דברו איתנו",
  title: "בואו ניצור\nמשהו טוב יחד",
  lead:
    "בין אם בא לכם לקנות, להתנדב, להזמין סדנה או לשתף פעולה — נשמח לשמוע מכם.",
  newsletter: {
    title: "הישארו מעודכנים",
    text: "פריטים חדשים, סדנאות ואירועים — ישר למייל.",
    placeholder: "כתובת המייל שלכם",
    button: "הצטרפות",
  },
};

export const FOOTER = {
  blurb:
    "Just A Second — המיזם הראשון בישראל לשימוש חוזר ומיחדוש. נותנים לחפצים חיים שניים, ויוצרים השפעה סביבתית, חברתית וכלכלית.",
  quickLinks: NAV,
  legal: [
    { label: "תקנון", href: "#" },
    { label: "מדיניות פרטיות", href: "#" },
    { label: "הצהרת נגישות", href: "#" },
  ],
};
