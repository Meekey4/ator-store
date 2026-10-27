import type { L10n, Lang } from './i18n';

/** Public address of the store. Set NEXT_PUBLIC_SITE_URL in Vercel when you add your own domain. */
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ator-store.vercel.app').replace(/\/$/, '');
export const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP || '').replace(/\D/g, '');
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

/** Response-time promise shown on the home page, product pages and after checkout. Edit here to change it everywhere. */
export const PROMISE = {
  title: { en: 'Delivered within minutes', ar: 'التسليم خلال دقائق' },
  hours: { en: 'Every day, 9 AM to midnight (Bahrain time)', ar: 'يوميًا من 9 صباحًا حتى منتصف الليل (بتوقيت البحرين)' },
  after: { en: 'Orders placed after midnight are delivered from 9 AM.', ar: 'الطلبات بعد منتصف الليل تُسلَّم ابتداءً من 9 صباحًا.' },
} satisfies Record<string, L10n>;

export const STEPS: { title: L10n; body: L10n }[] = [
  { title: { en: 'Pick your plan', ar: 'اختر باقتك' }, body: { en: 'Choose the service and the plan that fits you. Prices are in BHD with nothing added at checkout.', ar: 'اختر الخدمة والباقة المناسبة لك. الأسعار بالدينار البحريني دون أي إضافات عند الدفع.' } },
  { title: { en: 'Pay with BenefitPay or card', ar: 'ادفع ببنفت باي أو البطاقة' }, body: { en: 'Checkout runs on Tap Payments. We never see or store your card details.', ar: 'يتم الدفع عبر Tap Payments، ولا نطّلع على بيانات بطاقتك ولا نخزنها.' } },
  { title: { en: 'Get your code', ar: 'استلم الكود' }, body: { en: 'Your activation details appear on your order page and are sent to your WhatsApp.', ar: 'تظهر تفاصيل التفعيل في صفحة طلبك وتصلك على واتساب.' } },
];

export const FAQS: { q: L10n; a: L10n }[] = [
  { q: { en: 'How do I receive my order?', ar: 'كيف أستلم طلبي؟' },
    a: { en: 'Your activation code or login appears on your order page as soon as it is ready, and we send it to your WhatsApp too.', ar: 'يظهر كود التفعيل أو بيانات الدخول في صفحة طلبك فور تجهيزه، ونرسله أيضًا إلى واتساب.' } },
  { q: { en: 'How long does delivery take?', ar: 'كم يستغرق التسليم؟' },
    a: { en: 'Most orders are delivered within minutes, every day from 9 AM to midnight (Bahrain time). Orders placed after midnight are delivered from 9 AM.', ar: 'معظم الطلبات تُسلَّم خلال دقائق، يوميًا من 9 صباحًا حتى منتصف الليل بتوقيت البحرين. الطلبات بعد منتصف الليل تُسلَّم ابتداءً من 9 صباحًا.' } },
  { q: { en: 'Which payment methods do you accept?', ar: 'ما طرق الدفع المتاحة؟' },
    a: { en: 'BenefitPay and debit or credit cards, through Tap Payments. Your card details never reach us.', ar: 'بنفت باي والبطاقات البنكية والائتمانية عبر Tap Payments، ولا تصلنا بيانات بطاقتك أبدًا.' } },
  { q: { en: 'Do I need an account to order?', ar: 'هل أحتاج إلى حساب للطلب؟' },
    a: { en: 'No. You can check out as a guest and keep the order link. An account lets you see all your orders and codes in one place.', ar: 'لا. يمكنك الطلب كزائر والاحتفاظ برابط الطلب. الحساب يتيح لك رؤية كل طلباتك وأكوادك في مكان واحد.' } },
  { q: { en: 'Can I get a refund?', ar: 'هل يمكنني استرداد المبلغ؟' },
    a: { en: 'Yes. You get a full refund before delivery, and after delivery if the code cannot be activated and we cannot fix it within 48 hours.', ar: 'نعم. تسترد المبلغ كاملًا قبل التسليم، وبعده إذا تعذّر تفعيل الكود ولم نتمكن من حل المشكلة خلال 48 ساعة.' } },
];

export const DESC = {
  home: { en: 'Buy Shahid VIP, IPTV, Gemini Pro, Canva Pro and more in Bahrain. Pay with BenefitPay or card and get your code within minutes.', ar: 'اشترِ شاهد VIP وIPTV وجيميناي برو وكانفا برو وغيرها في البحرين. ادفع ببنفت باي أو البطاقة واستلم الكود خلال دقائق.' },
  shop: { en: 'All ATOR digital subscriptions, software keys and AI tools, with prices in BHD and instant delivery in Bahrain.', ar: 'كل اشتراكات ATOR الرقمية ومفاتيح البرامج وأدوات الذكاء الاصطناعي، بالأسعار بالدينار البحريني وتسليم فوري في البحرين.' },
  cart: { en: 'Review the items in your ATOR cart before checkout.', ar: 'راجع منتجات سلتك في ATOR قبل إتمام الطلب.' },
  checkout: { en: 'Complete your ATOR order securely with BenefitPay or card.', ar: 'أكمل طلبك من ATOR بأمان عبر بنفت باي أو البطاقة.' },
} satisfies Record<string, L10n>;

export const tr = (v: L10n, l: Lang) => v[l];

/** Registered business details, shown in the footer and on the Terms page. Set these in Vercel → Settings → Environment Variables. */
export const BUSINESS = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'ATOR',
  cr: process.env.NEXT_PUBLIC_CR_NUMBER || '',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  address: process.env.NEXT_PUBLIC_ADDRESS || '',
};
