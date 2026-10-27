export const LANGS = ['en', 'ar'] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v);
export const dir = (l: Lang) => (l === 'ar' ? 'rtl' : 'ltr');
export type L10n = { en: string; ar: string };
export const t = (v: L10n | undefined, l: Lang) => (v ? v[l] || v.en : '');

export const CATS: Record<string, L10n> = {
  ent: { en: 'Entertainment', ar: 'ترفيه' },
  ai: { en: 'AI tools', ar: 'ذكاء اصطناعي' },
  cre: { en: 'Creative', ar: 'إبداع' },
  sw: { en: 'Software', ar: 'برامج' },
  edu: { en: 'Education', ar: 'تعليم' },
};
export const TYPES: Record<string, L10n> = {
  sub: { en: 'Digital subscription', ar: 'اشتراك رقمي' },
  life: { en: 'Lifetime access', ar: 'وصول مدى الحياة' },
  key: { en: 'License key', ar: 'مفتاح ترخيص' },
};
export const STATUS: Record<string, L10n> = {
  pending: { en: 'Awaiting payment', ar: 'بانتظار الدفع' },
  paid: { en: 'Paid, preparing delivery', ar: 'مدفوع، جارٍ التجهيز' },
  delivered: { en: 'Delivered', ar: 'تم التسليم' },
  cancelled: { en: 'Cancelled', ar: 'ملغي' },
  refunded: { en: 'Refunded', ar: 'مسترد' },
  failed: { en: 'Payment failed', ar: 'فشل الدفع' },
};

const en = {
  tagline: 'Digital subscriptions & software, delivered fast in Bahrain.',
  heroTitle: 'Every digital service, one tap away.',
  heroSub: 'Subscriptions, software, AI tools and IPTV. Paid with BenefitPay or card, delivered to your account.',
  shopNow: 'Shop now', browse: 'Browse categories', allProducts: 'All products', featured: 'Popular now',
  shop: 'Shop', cart: 'Cart', account: 'Account', admin: 'Admin', search: 'Search products',
  from: 'From', outOfStock: 'Out of stock', comingSoon: 'Coming soon', choosePlan: 'Choose a plan', addToCart: 'Add to cart',
  added: 'Added to cart', inStock: 'in stock', instant: 'Instant delivery', secure: 'Secure checkout', local: 'Local support',
  instantSub: 'Most orders delivered within minutes.', secureSub: 'BenefitPay and cards through Tap Payments.', localSub: 'WhatsApp support in Arabic and English.',
  cartEmpty: 'Your cart is empty.', continueShopping: 'Continue shopping', subtotal: 'Subtotal', total: 'Total', remove: 'Remove', checkout: 'Checkout',
  yourDetails: 'Your details', name: 'Full name', email: 'Email', phone: 'Phone (WhatsApp)', password: 'Password',
  payNow: 'Pay now', placing: 'Placing order…', payNote: 'You will be taken to a secure Tap Payments page to pay with BenefitPay or card.',
  agree: 'By paying you agree to our Terms and Refund policy.',
  order: 'Order', orderStatus: 'Status', delivery: 'Your delivery', deliveryWait: 'We are preparing your order. Delivery details will appear here and be sent to your WhatsApp.',
  payPending: 'Online payment is not switched on yet. Our team will contact you on WhatsApp to complete payment.',
  payFailed: 'The payment did not go through. You can try again.', tryAgain: 'Try again', thanks: 'Thank you! Your payment was received.',
  signIn: 'Sign in', signUp: 'Create account', signOut: 'Sign out', noAccount: 'New to ATOR?', haveAccount: 'Already have an account?',
  myOrders: 'My orders', noOrders: 'No orders yet.', badLogin: 'Email or password is incorrect.', emailTaken: 'An account with this email already exists.',
  terms: 'Terms', privacy: 'Privacy', refunds: 'Refund policy', faq: 'FAQ', contact: 'Contact',
  rights: 'All rights reserved.', qty: 'Qty', date: 'Date', items: 'Items', viewOrder: 'View',
};
type Dict = typeof en;
const ar: Dict = {
  tagline: 'اشتراكات رقمية وبرامج، تسليم سريع في البحرين.',
  heroTitle: 'كل خدمة رقمية، بلمسة واحدة.',
  heroSub: 'اشتراكات وبرامج وأدوات ذكاء اصطناعي وIPTV. ادفع ببنفت باي أو البطاقة، وتصلك على حسابك.',
  shopNow: 'تسوّق الآن', browse: 'تصفح الأقسام', allProducts: 'كل المنتجات', featured: 'الأكثر طلبًا',
  shop: 'المتجر', cart: 'السلة', account: 'حسابي', admin: 'الإدارة', search: 'ابحث عن منتج',
  from: 'من', outOfStock: 'نفدت الكمية', comingSoon: 'قريبًا', choosePlan: 'اختر الباقة', addToCart: 'أضف إلى السلة',
  added: 'أُضيف إلى السلة', inStock: 'متوفر', instant: 'تسليم فوري', secure: 'دفع آمن', local: 'دعم محلي',
  instantSub: 'معظم الطلبات تصل خلال دقائق.', secureSub: 'بنفت باي والبطاقات عبر Tap Payments.', localSub: 'دعم عبر واتساب بالعربية والإنجليزية.',
  cartEmpty: 'سلتك فارغة.', continueShopping: 'تابع التسوق', subtotal: 'المجموع الفرعي', total: 'الإجمالي', remove: 'حذف', checkout: 'إتمام الطلب',
  yourDetails: 'بياناتك', name: 'الاسم الكامل', email: 'البريد الإلكتروني', phone: 'الهاتف (واتساب)', password: 'كلمة المرور',
  payNow: 'ادفع الآن', placing: 'جارٍ إنشاء الطلب…', payNote: 'ستنتقل إلى صفحة Tap Payments الآمنة للدفع ببنفت باي أو البطاقة.',
  agree: 'بالدفع أنت توافق على الشروط وسياسة الاسترداد.',
  order: 'الطلب', orderStatus: 'الحالة', delivery: 'تفاصيل التسليم', deliveryWait: 'نجهّز طلبك الآن. ستظهر تفاصيل التسليم هنا وتصلك على واتساب.',
  payPending: 'الدفع الإلكتروني غير مفعّل بعد. سيتواصل معك فريقنا عبر واتساب لإتمام الدفع.',
  payFailed: 'لم تتم عملية الدفع. يمكنك المحاولة مرة أخرى.', tryAgain: 'حاول مرة أخرى', thanks: 'شكرًا لك! تم استلام الدفع.',
  signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', signOut: 'تسجيل الخروج', noAccount: 'جديد في ATOR؟', haveAccount: 'لديك حساب؟',
  myOrders: 'طلباتي', noOrders: 'لا توجد طلبات بعد.', badLogin: 'البريد أو كلمة المرور غير صحيحة.', emailTaken: 'يوجد حساب بهذا البريد.',
  terms: 'الشروط', privacy: 'الخصوصية', refunds: 'سياسة الاسترداد', faq: 'الأسئلة الشائعة', contact: 'تواصل معنا',
  rights: 'جميع الحقوق محفوظة.', qty: 'الكمية', date: 'التاريخ', items: 'المنتجات', viewOrder: 'عرض',
};
export const dict = (l: Lang): Dict => (l === 'ar' ? ar : en);

export const INFO: Record<string, { title: L10n; body: L10n }> = {
  terms: {
    title: { en: 'Terms of use', ar: 'شروط الاستخدام' },
    body: {
      en: 'ATOR sells digital subscriptions and software licenses for personal use. Every order is delivered electronically to your account, email or WhatsApp. Prices are in Bahraini dinars and include all fees shown at checkout. Accounts and codes must not be resold or shared outside the plan you bought.',
      ar: 'تبيع ATOR اشتراكات رقمية وتراخيص برامج للاستخدام الشخصي. يُسلَّم كل طلب إلكترونيًا إلى حسابك أو بريدك أو واتساب. الأسعار بالدينار البحريني وتشمل كل الرسوم الظاهرة عند الدفع. لا يجوز إعادة بيع الحسابات أو الأكواد أو مشاركتها خارج الباقة المشتراة.',
    },
  },
  refunds: {
    title: { en: 'Refund policy', ar: 'سياسة الاسترداد' },
    body: {
      en: 'You can get a full refund before your order is delivered. After delivery, we refund only if the subscription or key cannot be activated and our team cannot fix it within 48 hours. Contact us on WhatsApp with your order number.',
      ar: 'يمكنك استرداد المبلغ كاملًا قبل تسليم الطلب. بعد التسليم، نسترد المبلغ فقط إذا تعذّر تفعيل الاشتراك أو المفتاح ولم يتمكن فريقنا من حل المشكلة خلال 48 ساعة. تواصل معنا عبر واتساب برقم الطلب.',
    },
  },
  privacy: {
    title: { en: 'Privacy', ar: 'الخصوصية' },
    body: {
      en: 'We collect your name, email and phone only to process and deliver orders and to contact you about them. Payments are handled by Tap Payments; we never see or store your card details. We do not sell or share your data with third parties.',
      ar: 'نجمع اسمك وبريدك ورقم هاتفك فقط لمعالجة الطلبات وتسليمها والتواصل معك بشأنها. تتم المدفوعات عبر Tap Payments ولا نطّلع على بيانات بطاقتك ولا نخزنها. لا نبيع بياناتك ولا نشاركها مع أي طرف ثالث.',
    },
  },
  faq: {
    title: { en: 'Frequently asked questions', ar: 'الأسئلة الشائعة' },
    body: {
      en: 'How do I receive my order? Delivery details appear on your order page and are sent to your WhatsApp.\nHow long does delivery take? Most orders arrive within minutes during working hours (9 AM to midnight, Bahrain time).\nWhich payment methods do you accept? BenefitPay and debit or credit cards.\nCan I get a refund? Yes, before delivery, or after delivery if activation fails. See the refund policy.',
      ar: 'كيف أستلم طلبي؟ تظهر تفاصيل التسليم في صفحة الطلب وتصلك على واتساب.\nكم يستغرق التسليم؟ معظم الطلبات تصل خلال دقائق في أوقات العمل (9 صباحًا حتى منتصف الليل بتوقيت البحرين).\nما طرق الدفع المتاحة؟ بنفت باي والبطاقات البنكية والائتمانية.\nهل يمكنني استرداد المبلغ؟ نعم، قبل التسليم، أو بعده إذا تعذّر التفعيل. راجع سياسة الاسترداد.',
    },
  },
};
