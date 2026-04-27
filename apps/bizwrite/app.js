// ===========================
//   BIZWRITE — app.js
// ===========================

const KIT_HISTORY_KEY = 'bizwrite_history_v2';
const KIT_HISTORY_MAX = 8;
const FREE_DEMO_LIMIT = 1;

window._pendingGenerate = false;

const SECTION_DEFS = [
  { marker: 'GOOGLE_BUSINESS', id: 'google', title: 'Google Business Profile' },
  { marker: 'FACEBOOK_BIO', id: 'facebook', title: 'Facebook Bio' },
  { marker: 'WHATSAPP_ABOUT', id: 'whatsapp', title: 'WhatsApp Business About' },
  { marker: 'INSTAGRAM_BIO', id: 'instagram', title: 'Instagram Bio' },
  { marker: 'TAGLINE_OPTIONS', id: 'tagline', title: 'Tagline Options' },
  { marker: 'SEO_META', id: 'seo', title: 'SEO Meta Description' },
  { marker: 'PRODUCT_DESCRIPTIONS', id: 'product', title: 'Product / Service Highlights' }
];

const translations = {
  en: {
    nav_generator: 'Generator',
    nav_pricing: 'Pricing',
    nav_invoice: 'Invoice',
    hero_eyebrow: 'AI-Powered · Instant · Professional',
    hero_title: 'Build a Business Profile Kit<br/><em>in Minutes</em>',
    hero_sub: 'Google, WhatsApp, Instagram, SEO, taglines, and service copy — all in one flow.',
    form_title: 'Tell us about the business',
    form_sub: 'Create a complete marketing-ready profile kit you can hand directly to a client.',
    label_name: 'Business Name',
    label_type: 'Business Type',
    label_location: 'Location',
    label_years: 'Years in Business',
    label_usp: 'Unique Selling Points (USPs)',
    label_products: 'Products / Services Offered',
    label_tone: 'Tone',
    label_lang_out: 'Output Language',
    label_generate: 'Generate:',
    btn_generate: 'Generate Business Kit',
    btn_generate_free: 'Generate Free Business Kit',
    btn_generate_credit: 'Generate Business Kit ({count} left)',
    btn_generate_paid: 'Buy Credits to Generate',
    buy_credits: 'Buy Credits',
    credits_signin: 'Sign in to use 1 free demo',
    credits_free_left: '1 free demo available',
    credits_balance: '{count} business kit {credits} left',
    credits_empty: 'No credits left',
    credit_singular: 'credit',
    credit_plural: 'credits',
    toast_buy_plan: 'Your free demo is used. Please buy BizWrite credits to generate more kits.',
    ph_name: 'e.g. Sharma Sweets',
    ph_type: 'e.g. Sweet Shop / Salon / Grocery',
    ph_location: 'e.g. Tezpur, Assam',
    ph_years: 'e.g. 5',
    ph_usp: 'e.g. Homemade recipes, open since 1998, free home delivery, 24/7 service...',
    ph_products: 'e.g. Rasgulla, Ladoo, Sandesh, Custom cakes, Catering',
    tone_professional: 'Professional',
    tone_friendly: 'Friendly & Warm',
    tone_bold: 'Bold & Confident',
    tone_traditional: 'Traditional & Trusted',
    lang_english: 'English',
    lang_hindi: 'Hindi',
    lang_assamese: 'Assamese',
    toggle_google: 'Google Business',
    toggle_facebook: 'Facebook Bio',
    toggle_whatsapp: 'WhatsApp About',
    toggle_instagram: 'Instagram Bio',
    toggle_tagline: 'Tagline Ideas',
    toggle_seo: 'SEO Meta',
    toggle_product: 'Product Descriptions',
    service_highlights: 'Service Highlights',
    kit_title: 'Your Business Profile Kit',
    kit_sub: 'Use these sections directly for listings, social profiles, and client delivery.',
    copy: 'Copy',
    pricing_eyebrow: 'Low-Ticket Pricing',
    pricing_title: 'Simple BizWrite Pricing',
    pricing_sub: 'Easy to sell as a self-serve tool or a done-for-you upgrade.',
    history_title: 'Recent Kits',
    history_sub: 'Restore older client kits instantly from this browser.',
    history_empty: 'No saved business kits yet.',
    clear_history: 'Clear History',
    copy_all: 'Copy Full Kit',
    download_txt: 'Download Full Kit (.txt)',
    create_invoice: 'Create Invoice',
    plan_freelancer: 'Freelancer Pack',
    plan_freelancer_period: '3 business kits',
    plan_starter_period: '1 business kit',
    plan_studio: 'Studio Pack',
    plan_studio_period: '10 business kits',
    plan_polished: 'Polished Service',
    plan_polished_period: 'per business',
    starter_f1: '✅ Google, Facebook, WhatsApp, Instagram',
    starter_f2: '✅ SEO meta + tagline ideas',
    starter_f3: '✅ Service highlights',
    starter_f4: '✅ Instant self-serve generation',
    starter_f5: '✅ Best for one local client',
    freelancer_f1: '✅ Everything in Starter',
    freelancer_f2: '✅ Great for website designers',
    freelancer_f3: '✅ Lower cost per client',
    freelancer_f4: '✅ Reuse with multiple small businesses',
    freelancer_f5: '✅ Fastest low-ticket offer',
    studio_f1: '✅ Everything in Freelancer Pack',
    studio_f2: '✅ Best margin for agencies',
    studio_f3: '✅ Easy add-on for client projects',
    studio_f4: '✅ Ideal for recurring local work',
    studio_f5: '✅ Lowest effective cost per kit',
    polished_f1: '✅ Human-polished final copy',
    polished_f2: '✅ Better wording for premium clients',
    polished_f3: '✅ Suitable for businesses that want guidance',
    polished_f4: '✅ Position this as your premium add-on',
    polished_f5: '✅ Keeps your margins healthy',
    bundle_tag: 'Bundle Deal',
    bundle_title: 'Website + Business Profile Kit',
    bundle_sub: 'Add BizWrite to a website package after discussing the full requirement on WhatsApp.',
    bundle_cta: 'Discuss on WhatsApp',
    invoice_eyebrow: 'Professional Billing',
    invoice_title: 'Invoice Generator',
    invoice_sub: 'Create and print a clean invoice for your client.',
    invoice_details: 'Invoice Details',
    inv_your_name_label: 'Your Business Name',
    inv_your_name_ph: 'Your Name / Studio Name',
    inv_your_contact_label: 'Your Contact / UPI',
    inv_your_contact_ph: 'phone / UPI ID / email',
    inv_client_name_label: 'Client Name',
    inv_client_name_ph: 'Client Business Name',
    inv_client_contact_label: 'Client Contact',
    inv_client_contact_ph: 'Phone / Email',
    inv_date_label: 'Invoice Date',
    inv_number_label: 'Invoice Number',
    inv_number_ph: 'e.g. BW-001',
    services_title: 'Services',
    add_item: '+ Add Item',
    total: 'Total',
    print_invoice: 'Print / Save PDF',
    invoice_hash: 'Invoice #',
    date: 'Date:',
    billed_to: 'Billed To',
    service: 'Service',
    amount: 'Amount',
    inv_footer: 'Thank you for your business! 🙏',
    invoice_item_placeholder: 'Service description',
    invoice_default_service: 'BizWrite Business Profile Kit'
  },
  hi: {
    nav_generator: 'जनरेटर',
    nav_pricing: 'प्राइसिंग',
    nav_invoice: 'इनवॉइस',
    hero_eyebrow: 'AI-संचालित · तत्काल · पेशेवर',
    hero_title: 'पूरा बिज़नेस प्रोफ़ाइल किट बनाएं<br/><em>कुछ मिनटों में</em>',
    hero_sub: 'Google, WhatsApp, Instagram, SEO, taglines और service copy — सब एक साथ।',
    form_title: 'बिज़नेस के बारे में बताएं',
    form_sub: 'एक पूरा marketing-ready प्रोफ़ाइल किट बनाइए जिसे आप सीधे क्लाइंट को दे सकें।',
    label_name: 'व्यवसाय का नाम',
    label_type: 'व्यवसाय का प्रकार',
    label_location: 'स्थान',
    label_years: 'व्यवसाय में वर्ष',
    label_usp: 'खास विशेषताएं (USP)',
    label_products: 'उत्पाद / सेवाएं',
    label_tone: 'टोन',
    label_lang_out: 'आउटपुट भाषा',
    label_generate: 'जनरेट करें:',
    btn_generate: 'बिज़नेस किट जनरेट करें',
    btn_generate_free: 'फ्री बिज़नेस किट जनरेट करें',
    btn_generate_credit: 'बिज़नेस किट जनरेट करें ({count} बचे)',
    btn_generate_paid: 'जनरेट करने के लिए क्रेडिट खरीदें',
    buy_credits: 'क्रेडिट खरीदें',
    credits_signin: '1 फ्री डेमो इस्तेमाल करने के लिए साइन इन करें',
    credits_free_left: '1 फ्री डेमो उपलब्ध है',
    credits_balance: '{count} बिज़नेस किट क्रेडिट बचे हैं',
    credits_empty: 'कोई क्रेडिट नहीं बचा',
    credit_singular: 'क्रेडिट',
    credit_plural: 'क्रेडिट',
    toast_buy_plan: 'आपका फ्री डेमो इस्तेमाल हो गया है। और किट बनाने के लिए BizWrite क्रेडिट खरीदें।',
    ph_name: 'उदा. शर्मा स्वीट्स',
    ph_type: 'उदा. स्वीट शॉप / सैलून / किराना',
    ph_location: 'उदा. तेजपुर, असम',
    ph_years: 'उदा. 5',
    ph_usp: 'उदा. घर की रेसिपी, 1998 से, फ्री होम डिलीवरी, 24/7 सेवा...',
    ph_products: 'उदा. रसगुल्ला, लड्डू, संदेश, कस्टम केक, कैटरिंग',
    tone_professional: 'पेशेवर',
    tone_friendly: 'मिलनसार और गर्मजोशी भरा',
    tone_bold: 'दमदार और आत्मविश्वासी',
    tone_traditional: 'पारंपरिक और भरोसेमंद',
    lang_english: 'अंग्रेज़ी',
    lang_hindi: 'हिंदी',
    lang_assamese: 'असमिया',
    toggle_google: 'गूगल बिज़नेस',
    toggle_facebook: 'फेसबुक बायो',
    toggle_whatsapp: 'व्हाट्सऐप अबाउट',
    toggle_instagram: 'इंस्टाग्राम बायो',
    toggle_tagline: 'टैगलाइन आइडिया',
    toggle_seo: 'SEO मेटा',
    toggle_product: 'उत्पाद विवरण',
    service_highlights: 'सेवा मुख्य बिंदु',
    kit_title: 'आपका बिज़नेस प्रोफ़ाइल किट',
    kit_sub: 'इन सेक्शनों को सीधे listings, social profiles और client delivery में इस्तेमाल करें।',
    copy: 'कॉपी',
    pricing_eyebrow: 'कम-कीमत योजना',
    pricing_title: 'सरल BizWrite प्राइसिंग',
    pricing_sub: 'Self-serve tool या done-for-you upgrade के रूप में बेचना आसान।',
    history_title: 'हाल की किट्स',
    history_sub: 'इस ब्राउज़र से पुराने client kits तुरंत वापस लाएँ।',
    history_empty: 'अभी तक कोई सेव की गई बिज़नेस किट नहीं है।',
    clear_history: 'इतिहास साफ करें',
    copy_all: 'पूरी किट कॉपी करें',
    download_txt: 'पूरी किट डाउनलोड करें (.txt)',
    create_invoice: 'इनवॉइस बनाएं',
    plan_freelancer: 'फ्रीलांसर पैक',
    plan_freelancer_period: '3 बिज़नेस किट',
    plan_starter_period: '1 बिज़नेस किट',
    plan_studio: 'स्टूडियो पैक',
    plan_studio_period: '10 बिज़नेस किट',
    plan_polished: 'पॉलिश्ड सर्विस',
    plan_polished_period: 'प्रति बिज़नेस',
    starter_f1: '✅ Google, Facebook, WhatsApp, Instagram',
    starter_f2: '✅ SEO meta + tagline ideas',
    starter_f3: '✅ Service highlights',
    starter_f4: '✅ तुरंत self-serve generation',
    starter_f5: '✅ एक लोकल क्लाइंट के लिए बढ़िया',
    freelancer_f1: '✅ Starter की सारी चीज़ें',
    freelancer_f2: '✅ वेबसाइट डिज़ाइनर के लिए शानदार',
    freelancer_f3: '✅ प्रति क्लाइंट कम लागत',
    freelancer_f4: '✅ कई छोटे व्यवसायों के लिए उपयोग करें',
    freelancer_f5: '✅ सबसे तेज low-ticket offer',
    studio_f1: '✅ Freelancer Pack की सारी चीज़ें',
    studio_f2: '✅ एजेंसियों के लिए बेहतर मार्जिन',
    studio_f3: '✅ client projects के लिए आसान add-on',
    studio_f4: '✅ recurring local work के लिए आदर्श',
    studio_f5: '✅ प्रति kit सबसे कम प्रभावी लागत',
    polished_f1: '✅ इंसान द्वारा पॉलिश की गई final copy',
    polished_f2: '✅ premium clients के लिए बेहतर wording',
    polished_f3: '✅ guidance चाहने वाले businesses के लिए सही',
    polished_f4: '✅ इसे अपना premium add-on बनाइए',
    polished_f5: '✅ आपके margins मजबूत रखता है',
    bundle_tag: 'बंडल डील',
    bundle_title: 'वेबसाइट + बिज़नेस प्रोफ़ाइल किट',
    bundle_sub: 'Website package के साथ BizWrite जोड़ने के लिए पूरा requirement WhatsApp पर discuss करें।',
    bundle_cta: 'WhatsApp पर बात करें',
    invoice_eyebrow: 'पेशेवर बिलिंग',
    invoice_title: 'इनवॉइस जनरेटर',
    invoice_sub: 'अपने क्लाइंट के लिए साफ इनवॉइस बनाएं और प्रिंट करें।',
    invoice_details: 'इनवॉइस विवरण',
    inv_your_name_label: 'आपके बिज़नेस का नाम',
    inv_your_name_ph: 'आपका नाम / स्टूडियो नाम',
    inv_your_contact_label: 'आपका संपर्क / UPI',
    inv_your_contact_ph: 'फोन / UPI ID / ईमेल',
    inv_client_name_label: 'क्लाइंट का नाम',
    inv_client_name_ph: 'क्लाइंट बिज़नेस का नाम',
    inv_client_contact_label: 'क्लाइंट संपर्क',
    inv_client_contact_ph: 'फोन / ईमेल',
    inv_date_label: 'इनवॉइस तारीख',
    inv_number_label: 'इनवॉइस नंबर',
    inv_number_ph: 'उदा. BW-001',
    services_title: 'सेवाएं',
    add_item: '+ आइटम जोड़ें',
    total: 'कुल',
    print_invoice: 'प्रिंट / PDF सेव करें',
    invoice_hash: 'इनवॉइस #',
    date: 'तारीख:',
    billed_to: 'जिसे बिल किया गया',
    service: 'सेवा',
    amount: 'राशि',
    inv_footer: 'आपके व्यवसाय के लिए धन्यवाद! 🙏',
    invoice_item_placeholder: 'सेवा विवरण',
    invoice_default_service: 'BizWrite बिज़नेस प्रोफ़ाइल किट'
  },
  as: {
    nav_generator: 'জেনেৰেটৰ',
    nav_pricing: 'মূল্য',
    nav_invoice: 'ইনভইচ',
    hero_eyebrow: 'AI-চালিত · তাৎক্ষণিক · পেছাদাৰী',
    hero_title: 'এটা সম্পূৰ্ণ ব্যৱসায়িক প্ৰফাইল কিট তৈয়াৰ কৰক<br/><em>কেইমিনিটতে</em>',
    hero_sub: 'Google, WhatsApp, Instagram, SEO, tagline আৰু service copy — সকলো একেলগে।',
    form_title: 'ব্যৱসায়টোৰ বিষয়ে কওক',
    form_sub: 'এটা সম্পূৰ্ণ marketing-ready profile kit তৈয়াৰ কৰক যিটো আপুনি পোনপটীয়াকৈ client-ক দিব পাৰে।',
    label_name: 'ব্যৱসায়ৰ নাম',
    label_type: 'ব্যৱসায়ৰ ধৰণ',
    label_location: 'স্থান',
    label_years: 'ব্যৱসায়ত কিমান বছৰ',
    label_usp: 'বিশেষ শক্তি (USP)',
    label_products: 'সামগ্ৰী / সেৱাসমূহ',
    label_tone: 'টোন',
    label_lang_out: 'আউটপুট ভাষা',
    label_generate: 'তৈয়াৰ কৰক:',
    btn_generate: 'ব্যৱসায়িক কিট তৈয়াৰ কৰক',
    btn_generate_free: 'ফ্ৰী ব্যৱসায়িক কিট তৈয়াৰ কৰক',
    btn_generate_credit: 'ব্যৱসায়িক কিট তৈয়াৰ কৰক ({count} বাকী)',
    btn_generate_paid: 'তৈয়াৰ কৰিবলৈ credits কিনক',
    buy_credits: 'Credits কিনক',
    credits_signin: '1টা free demo ব্যৱহাৰ কৰিবলৈ sign in কৰক',
    credits_free_left: '1টা free demo উপলব্ধ',
    credits_balance: '{count}টা business kit credit বাকী',
    credits_empty: 'কোনো credit বাকী নাই',
    credit_singular: 'credit',
    credit_plural: 'credits',
    toast_buy_plan: 'আপোনাৰ free demo ব্যৱহাৰ হৈছে। আৰু kit তৈয়াৰ কৰিবলৈ BizWrite credits কিনক।',
    ph_name: 'যেনে: Sharma Sweets',
    ph_type: 'যেনে: Sweet Shop / Salon / Grocery',
    ph_location: 'যেনে: Tezpur, Assam',
    ph_years: 'যেনে: 5',
    ph_usp: 'যেনে: ঘৰোয়া recipe, 1998ৰ পৰা, free home delivery, 24/7 service...',
    ph_products: 'যেনে: Rasgulla, Ladoo, Sandesh, Custom cakes, Catering',
    tone_professional: 'পেছাদাৰী',
    tone_friendly: 'মিঠা আৰু বন্ধুসুলভ',
    tone_bold: 'জোৰালো আৰু আত্মবিশ্বাসী',
    tone_traditional: 'পাৰম্পৰিক আৰু বিশ্বাসযোগ্য',
    lang_english: 'ইংৰাজী',
    lang_hindi: 'হিন্দী',
    lang_assamese: 'অসমীয়া',
    toggle_google: 'গুগল বিজনেছ',
    toggle_facebook: 'ফেচবুক বায়ো',
    toggle_whatsapp: 'হোৱাটছএপ এবাউট',
    toggle_instagram: 'ইনষ্টাগ্ৰাম বায়ো',
    toggle_tagline: 'টেগলাইন আইডিয়া',
    toggle_seo: 'SEO মেটা',
    toggle_product: 'সামগ্ৰী বিৱৰণ',
    service_highlights: 'সেৱাৰ মূল দিশ',
    kit_title: 'আপোনাৰ ব্যৱসায়িক প্ৰফাইল কিট',
    kit_sub: 'এই অংশসমূহক listings, social profiles আৰু client delivery-ত পোনপটীয়াকৈ ব্যৱহাৰ কৰক।',
    copy: 'কপি',
    pricing_eyebrow: 'কম-দামৰ মূল্য',
    pricing_title: 'সহজ BizWrite মূল্য',
    pricing_sub: 'Self-serve tool বা done-for-you upgrade হিচাপে বেচিবলৈ সহজ।',
    history_title: 'শেহতীয়া কিটসমূহ',
    history_sub: 'এই browser-ৰ পৰা পুৰণি client kitসমূহ তৎক্ষণাত ঘূৰাই আনক।',
    history_empty: 'এতিয়ালৈকে কোনো saved business kit নাই।',
    clear_history: 'ইতিহাস মচক',
    copy_all: 'সম্পূৰ্ণ কিট কপি কৰক',
    download_txt: 'সম্পূৰ্ণ কিট ডাউনলোড কৰক (.txt)',
    create_invoice: 'ইনভইচ তৈয়াৰ কৰক',
    plan_freelancer: 'ফ্ৰীলেঞ্চাৰ পেক',
    plan_freelancer_period: '3টা business kit',
    plan_starter_period: '1টা business kit',
    plan_studio: 'ষ্টুডিঅ’ পেক',
    plan_studio_period: '10টা business kit',
    plan_polished: 'পলিছড ছাৰ্ভিচ',
    plan_polished_period: 'প্ৰতি business',
    starter_f1: '✅ Google, Facebook, WhatsApp, Instagram',
    starter_f2: '✅ SEO meta + tagline ideas',
    starter_f3: '✅ Service highlights',
    starter_f4: '✅ তৎক্ষণাত self-serve generation',
    starter_f5: '✅ এটা local client-ৰ বাবে উপযুক্ত',
    freelancer_f1: '✅ Starter-ৰ সকলো সুবিধা',
    freelancer_f2: '✅ website designer-সকলৰ বাবে উৎকৃষ্ট',
    freelancer_f3: '✅ client-পিছু কম খৰচ',
    freelancer_f4: '✅ একাধিক সৰু business-ত পুনৰ ব্যৱহাৰ কৰক',
    freelancer_f5: '✅ আটাইতকৈ দ্ৰুত low-ticket offer',
    studio_f1: '✅ Freelancer Pack-ৰ সকলো সুবিধা',
    studio_f2: '✅ agency-ৰ বাবে ভাল margin',
    studio_f3: '✅ client project-ৰ বাবে সহজ add-on',
    studio_f4: '✅ recurring local কামৰ বাবে আদৰ্শ',
    studio_f5: '✅ প্রতি kit-ত আটাইতকৈ কম effective cost',
    polished_f1: '✅ মানুহে পলিছ কৰা final copy',
    polished_f2: '✅ premium client-ৰ বাবে উন্নত wording',
    polished_f3: '✅ guidance বিচৰা business-ৰ বাবে উপযুক্ত',
    polished_f4: '✅ ইয়াক আপোনাৰ premium add-on ৰূপে ৰাখক',
    polished_f5: '✅ আপোনাৰ margin শক্তিশালী ৰাখে',
    bundle_tag: 'বান্ডল ডিল',
    bundle_title: 'Website + Business Profile Kit',
    bundle_sub: 'Website package-ৰ সৈতে BizWrite যোগ কৰাৰ আগতে WhatsApp-ত সম্পূৰ্ণ requirement আলোচনা কৰক।',
    bundle_cta: 'WhatsApp-ত কথা পাতক',
    invoice_eyebrow: 'পেছাদাৰী বিলিং',
    invoice_title: 'ইনভইচ জেনেৰেটৰ',
    invoice_sub: 'আপোনাৰ client-ৰ বাবে এটা পৰিষ্কাৰ invoice তৈয়াৰ কৰি print কৰক।',
    invoice_details: 'ইনভইচৰ বিৱৰণ',
    inv_your_name_label: 'আপোনাৰ business-ৰ নাম',
    inv_your_name_ph: 'আপোনাৰ নাম / studio name',
    inv_your_contact_label: 'আপোনাৰ contact / UPI',
    inv_your_contact_ph: 'phone / UPI ID / email',
    inv_client_name_label: 'client-ৰ নাম',
    inv_client_name_ph: 'client business-ৰ নাম',
    inv_client_contact_label: 'client contact',
    inv_client_contact_ph: 'phone / email',
    inv_date_label: 'ইনভইচৰ তাৰিখ',
    inv_number_label: 'ইনভইচ নম্বৰ',
    inv_number_ph: 'যেনে: BW-001',
    services_title: 'সেৱাসমূহ',
    add_item: '+ item যোগ কৰক',
    total: 'মুঠ',
    print_invoice: 'Print / PDF Save কৰক',
    invoice_hash: 'Invoice #',
    date: 'তাৰিখ:',
    billed_to: 'বিল প্ৰেৰণ কৰা হৈছে',
    service: 'সেৱা',
    amount: 'মূল্য',
    inv_footer: 'আপোনাৰ ব্যৱসায়ৰ বাবে ধন্যবাদ! 🙏',
    invoice_item_placeholder: 'সেৱাৰ বিৱৰণ',
    invoice_default_service: 'BizWrite ব্যৱসায়িক প্ৰফাইল কিট'
  }
};

let currentLang = localStorage.getItem('bizwrite_lang') || 'en';
let currentKit = null;
let invoiceItems = [];
let sectionObserver = null;
let pendingGenerateAfterPayment = false;

const PLAN_DATA = {
  starter: { planId: 'starter', label: 'Starter Kit', kits: 1, price: 9 },
  freelancer: { planId: 'freelancer', label: 'Freelancer Pack', kits: 3, price: 29 },
  studio: { planId: 'studio', label: 'Studio Pack', kits: 10, price: 79 }
};

window._selectedPlan = null;

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('bizwrite_lang', lang);
  document.querySelectorAll('.lang-btn').forEach((btn) => btn.classList.remove('active'));
  document.querySelector(`.lang-btn[data-lang="${lang}"]`)?.classList.add('active');
  applyTranslations();
  renderHistory();
}

function applyTranslations() {
  const t = translations[currentLang] || translations.en;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (el.tagName === 'OPTION') el.textContent = t[key];
      else el.innerHTML = t[key];
    }
  });
  document.querySelectorAll('[data-placeholder-i18n]').forEach((el) => {
    const key = el.getAttribute('data-placeholder-i18n');
    if (t[key]) el.setAttribute('placeholder', t[key]);
  });
  renderInvoiceItems();
  syncInvoicePreview();
  updateGenerateButton();
}

function showPage(page) {
  const target = document.getElementById(`page-${page}`);
  if (!target) return;
  setActiveNav(page);
  history.replaceState(null, '', `#${page}`);
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.page === page);
  });
}

function observeSections() {
  if (sectionObserver) sectionObserver.disconnect();

  const sections = document.querySelectorAll('.page[data-section]');
  sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const page = visible.target.dataset.section;
    if (!page) return;
    setActiveNav(page);
    history.replaceState(null, '', `#${page}`);
  }, {
    root: null,
    threshold: [0.2, 0.4, 0.6],
    rootMargin: '-20% 0px -45% 0px'
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

function collectBusinessInputs() {
  return {
    name: document.getElementById('bizName').value.trim(),
    type: document.getElementById('bizType').value.trim(),
    location: document.getElementById('bizLocation').value.trim(),
    years: document.getElementById('bizYears').value.trim(),
    usp: document.getElementById('bizUSP').value.trim(),
    products: document.getElementById('bizProducts').value.trim(),
    tone: document.getElementById('bizTone').value,
    outputLang: document.getElementById('outputLang').value
  };
}

function getSelectedSections() {
  return SECTION_DEFS.filter((section) => {
    const checkbox = document.getElementById(`chk${section.id.charAt(0).toUpperCase()}${section.id.slice(1)}`);
    return checkbox?.checked;
  });
}

function getCredits() {
  return window.currentUserData?.kitsRemaining || 0;
}

function hasFreeSampleRemaining() {
  if (!window.currentUserData) return false;
  return (window.currentUserData.demoUsed || 0) < FREE_DEMO_LIMIT;
}

function getCreditWord(count) {
  return count === 1 ? getTranslation('credit_singular') : getTranslation('credit_plural');
}

function updateGenerateButton() {
  const label = document.querySelector('#generateBtn .btn-label');
  const pill = document.getElementById('creditsDisplay');

  if (!label && !pill) return;

  const credits = getCredits();
  const isSignedIn = Boolean(window.auth?.currentUser && window.currentUserData);

  if (label) {
    if (!isSignedIn) {
      label.textContent = getTranslation('btn_generate');
    } else if (credits > 0) {
      label.textContent = getTranslation('btn_generate_credit').replace('{count}', credits);
    } else if (hasFreeSampleRemaining()) {
      label.textContent = getTranslation('btn_generate_free');
    } else {
      label.textContent = getTranslation('btn_generate_paid');
    }
  }

  if (pill) {
    let message = getTranslation('credits_signin');
    if (isSignedIn && credits > 0) {
      message = getTranslation('credits_balance')
        .replace('{count}', credits)
        .replace('{credits}', getCreditWord(credits));
    } else if (isSignedIn && hasFreeSampleRemaining()) {
      message = getTranslation('credits_free_left');
    } else if (isSignedIn) {
      message = getTranslation('credits_empty');
    }
    pill.textContent = message;
  }
}

async function refundAccess(mode) {
  if (mode === 'credit' && typeof releaseKitCredit === 'function') {
    await releaseKitCredit();
  }
  if (mode === 'free' && typeof releaseDemoUse === 'function') {
    await releaseDemoUse();
  }
  updateGenerateButton();
}

function getSystemMessage(outputLang) {
  if (outputLang === 'Assamese') {
    return `You are BizWrite, an expert local-business copywriter writing in pure Assamese (অসমীয়া).
You must never mix Bengali with Assamese. Assamese and Bengali share a script, but they are different languages.
CRITICAL LANGUAGE RULES:
- Write only in natural Assamese, never Bengali.
- Use Assamese vocabulary and grammar only.
- Use "ৰ" instead of Bengali "র" whenever it is the standalone ra sound.
- Use Assamese wording such as "আৰু", "আপোনাৰ", "ক'ত", "কিয়", "নহয়", "বিৱৰণ", "নম্বৰ" when appropriate.
- Do not output Bengali-style wording or spellings.
- Before finalizing, self-check every line and rewrite anything that sounds Bengali into proper Assamese.`;
  }

  return 'You are BizWrite, a professional copywriter for local Indian businesses. Write clearly, naturally, and follow the requested output language exactly.';
}

function fixAssameseScript(text) {
  if (!text) return text;
  return text.replace(/র(?!্)/g, 'ৰ');
}

function buildPrompt(inputs, sections) {
  const businessInfo = [
    `Business Name: ${inputs.name}`,
    `Business Type: ${inputs.type}`,
    `Location: ${inputs.location}`,
    inputs.years ? `Years in Business: ${inputs.years}` : '',
    inputs.usp ? `USPs: ${inputs.usp}` : '',
    inputs.products ? `Products/Services: ${inputs.products}` : '',
    `Tone: ${inputs.tone}`,
    `Output Language: ${inputs.outputLang}`
  ].filter(Boolean).join('\n');

  const rules = {
    GOOGLE_BUSINESS: 'Write a Google Business Profile description in 140-220 words. Mention location, trust signals, key services/products, and end with a soft call to action.',
    FACEBOOK_BIO: 'Write a Facebook Page About bio in 80-120 words. Make it warm, clear, and community-friendly.',
    WHATSAPP_ABOUT: 'Write a WhatsApp Business About line in 100-140 characters max. Keep it clean and useful for local customers.',
    INSTAGRAM_BIO: 'Write an Instagram bio in 3 short lines, with a clear hook and one CTA. Keep the total compact.',
    TAGLINE_OPTIONS: 'Write 5 tagline options. Number them 1 to 5. Each should be short, memorable, and fit a local Indian business.',
    SEO_META: 'Write one SEO meta description between 140 and 155 characters. Make it click-worthy and location-aware.',
    PRODUCT_DESCRIPTIONS: 'Write 4 short product/service highlights. Number them 1 to 4. Each should be 2-3 sentences focused on benefits and trust.'
  };

  const sectionInstructions = sections.map((section) => `=== ${section.marker} ===\n${rules[section.marker]}`).join('\n\n');
  const languageGuard = inputs.outputLang === 'Assamese'
    ? `

ASSAMESE OUTPUT SAFETY CHECK:
- The final copy must be pure Assamese, not Bengali.
- Do not use Bengali words or Bengali-style phrasing.
- Use Assamese-specific script conventions, especially "ৰ" instead of "র" where applicable.
- If even one line sounds Bengali, rewrite it before returning the final answer.`
    : '';

  return `You are BizWrite, a professional copywriter for local Indian businesses.
Create conversion-focused copy that sounds trustworthy, clear, and useful for real customers.
Output ONLY in ${inputs.outputLang}.
Use the exact English section markers provided below.
Do not add any extra introduction or explanation.

Business Details:
${businessInfo}

Writing Guidance:
- Stay authentic to local Indian business culture.
- Avoid over-the-top marketing language.
- Use specific, believable claims based on the provided details only.
- If a detail is missing, write naturally without inventing risky facts.
${languageGuard}

Generate these sections:
${sectionInstructions}`;
}

async function generateDescriptions() {
  const inputs = collectBusinessInputs();
  const sections = getSelectedSections();
  let accessMode = null;

  if (!inputs.name || !inputs.type || !inputs.location) {
    showToast('Please fill in Business Name, Type, and Location.');
    return;
  }

  if (!sections.length) {
    showToast('Please select at least one output type.');
    return;
  }

  if (window.auth?.currentUser && !window.currentUserData && typeof loadOrCreateBizwriteUser === 'function') {
    await loadOrCreateBizwriteUser(window.auth.currentUser);
  }

  if (!window.auth?.currentUser || !window.currentUserData) {
    window._pendingGenerate = true;
    openAuthModal('login');
    return;
  }

  if (getCredits() > 0) {
    try {
      const res = await reserveKitCredit();
      if (!res.reserved) return;
      accessMode = 'credit';
    } catch (err) {
      showToast(err.code === 'bizwrite/no-credits' ? getTranslation('toast_buy_plan') : err.message);
      if (err.code === 'bizwrite/no-credits') openPlansModal('starter');
      return;
    }
  } else if (hasFreeSampleRemaining()) {
    await incrementDemoUsed();
    accessMode = 'free';
  } else {
    pendingGenerateAfterPayment = true;
    openPlansModal('starter');
    showToast(getTranslation('toast_buy_plan'));
    return;
  }

  const btn = document.getElementById('generateBtn');
  btn.querySelector('.btn-label').classList.add('hidden');
  btn.querySelector('.btn-loading').classList.remove('hidden');
  btn.disabled = true;

  try {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    let url = GLOBAL_CONFIG.ENDPOINT;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GLOBAL_CONFIG.API_KEY}`
    };

    if (!isLocal) {
      url = '/.netlify/functions/chat';
      delete headers.Authorization;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages: [
          { role: 'system', content: getSystemMessage(inputs.outputLang) },
          { role: 'user', content: buildPrompt(inputs, sections) }
        ],
        model: GLOBAL_CONFIG.MODEL,
        max_tokens: GLOBAL_CONFIG.MAX_TOKENS,
        temperature: 0.45
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    const fullText = data.choices?.[0]?.message?.content?.trim();
    if (!fullText) throw new Error('Empty response from AI');

    const outputs = {};
    sections.forEach((section) => {
      const sectionText = extractSection(fullText, section.marker);
      outputs[section.marker] = inputs.outputLang === 'Assamese'
        ? fixAssameseScript(sectionText)
        : sectionText;
    });

    renderOutputs(outputs);

    currentKit = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      inputs,
      outputs
    };

    window._lastBizName = inputs.name;
    window._lastBizType = inputs.type;
    saveKitToHistory(currentKit);
    renderHistory();
    await saveBizwriteHistory({
      businessName: inputs.name,
      businessType: inputs.type,
      outputLang: inputs.outputLang,
      sections: sections.map((section) => section.marker),
      mode: accessMode === 'free' ? 'demo' : 'paid'
    });

    document.getElementById('outputSection').classList.remove('hidden');
    document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    await refundAccess(accessMode);
    showToast('Error connecting to AI. Please check your connection.');
  } finally {
    btn.querySelector('.btn-label').classList.remove('hidden');
    btn.querySelector('.btn-loading').classList.add('hidden');
    btn.disabled = false;
    updateGenerateButton();
  }
}

function extractSection(text, marker) {
  const safeMarker = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`=== ${safeMarker} ===\\s*([\\s\\S]*?)(?=\\n=== [A-Z_]+ ===|$)`);
  const match = text.match(regex);
  return match?.[1]?.trim() || '';
}

function renderOutputs(outputs) {
  SECTION_DEFS.forEach((section) => {
    const card = document.getElementById(`${section.id}Card`);
    const textEl = document.getElementById(`${section.id}Text`);
    const value = outputs[section.marker];

    if (card && textEl) {
      if (value) {
        textEl.textContent = value;
        card.classList.remove('hidden');
      } else {
        textEl.textContent = '';
        card.classList.add('hidden');
      }
    }
  });
}

function copyText(id) {
  const el = document.getElementById(id);
  if (!el || !el.textContent.trim()) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    showToast('Copied to clipboard!');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = el.textContent;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied!');
  });
}

function buildFullKitText() {
  const parts = [];
  SECTION_DEFS.forEach((section) => {
    const card = document.getElementById(`${section.id}Card`);
    const textEl = document.getElementById(`${section.id}Text`);
    if (card && textEl && !card.classList.contains('hidden') && textEl.textContent.trim()) {
      parts.push(`=== ${section.title.toUpperCase()} ===\n\n${textEl.textContent.trim()}`);
    }
  });

  return parts.join('\n\n');
}

function copyAllOutputs() {
  const content = buildFullKitText();
  if (!content) {
    showToast('Nothing to copy yet.');
    return;
  }

  navigator.clipboard.writeText(content).then(() => {
    showToast('Full kit copied!');
  }).catch(() => showToast('Could not copy full kit.'));
}

function downloadAll() {
  const content = buildFullKitText();
  if (!content) {
    showToast('Nothing to download.');
    return;
  }

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(window._lastBizName || 'business').replace(/\s+/g, '_')}_business_kit.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KIT_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveKitToHistory(kit) {
  const history = getHistory();
  history.unshift({
    id: kit.id,
    createdAt: kit.createdAt,
    inputs: kit.inputs,
    outputs: kit.outputs
  });
  const trimmed = history.slice(0, KIT_HISTORY_MAX);
  localStorage.setItem(KIT_HISTORY_KEY, JSON.stringify(trimmed));
}

function renderHistory() {
  const list = document.getElementById('historyList');
  const section = document.getElementById('historySection');
  const emptyLabel = (translations[currentLang] || translations.en).history_empty;

  if (!list || !section) return;

  const history = getHistory();
  if (!history.length) {
    section.classList.remove('hidden');
    list.innerHTML = `<div class="history-empty">${emptyLabel}</div>`;
    return;
  }

  section.classList.remove('hidden');
  list.innerHTML = history.map((entry) => {
    const date = new Date(entry.createdAt);
    const label = Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
    const count = Object.values(entry.outputs || {}).filter(Boolean).length;
    return `
      <button class="history-item" onclick="restoreHistory(${entry.id})">
        <span class="history-item-title">${escHtml(entry.inputs.name || 'Business kit')}</span>
        <span class="history-item-meta">${escHtml(entry.inputs.type || '')} · ${escHtml(entry.inputs.location || '')}</span>
        <span class="history-item-meta">${count} outputs · ${escHtml(entry.inputs.outputLang || 'English')} · ${label}</span>
      </button>
    `;
  }).join('');
}

function restoreHistory(id) {
  const entry = getHistory().find((item) => item.id === id);
  if (!entry) {
    showToast('Could not restore this kit.');
    return;
  }

  fillBusinessForm(entry.inputs);
  SECTION_DEFS.forEach((section) => {
    const checkbox = document.getElementById(`chk${section.id.charAt(0).toUpperCase()}${section.id.slice(1)}`);
    if (checkbox) checkbox.checked = Boolean(entry.outputs?.[section.marker]);
  });
  renderOutputs(entry.outputs || {});
  currentKit = entry;
  window._lastBizName = entry.inputs.name;
  window._lastBizType = entry.inputs.type;
  document.getElementById('outputSection').classList.remove('hidden');
  showPage('generator');
  setTimeout(() => {
    document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 120);
}

function clearHistory() {
  localStorage.removeItem(KIT_HISTORY_KEY);
  renderHistory();
  showToast('Saved kit history cleared.');
}

function fillBusinessForm(inputs) {
  document.getElementById('bizName').value = inputs.name || '';
  document.getElementById('bizType').value = inputs.type || '';
  document.getElementById('bizLocation').value = inputs.location || '';
  document.getElementById('bizYears').value = inputs.years || '';
  document.getElementById('bizUSP').value = inputs.usp || '';
  document.getElementById('bizProducts').value = inputs.products || '';
  document.getElementById('bizTone').value = inputs.tone || 'professional';
  document.getElementById('outputLang').value = inputs.outputLang || 'English';
}

function initInvoice() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('inv_date').value = today;
  document.getElementById('inv_number').value = `BW-${String(Math.floor(Math.random() * 900) + 100)}`;

  ['inv_your_name', 'inv_your_contact', 'inv_client_name', 'inv_client_contact', 'inv_date', 'inv_number'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', syncInvoicePreview);
  });

  if (invoiceItems.length === 0) addInvoiceItem(getTranslation('invoice_default_service'), 29);
  renderInvoiceItems();
  syncInvoicePreview();
}

function addInvoiceItem(service = '', amount = '') {
  invoiceItems.push({ service, amount });
  renderInvoiceItems();
  syncInvoicePreview();
}

function renderInvoiceItems() {
  const placeholder = getTranslation('invoice_item_placeholder');
  const container = document.getElementById('inv_items');
  container.innerHTML = '';

  invoiceItems.forEach((item, i) => {
    const row = document.createElement('div');
    row.className = 'inv-item-row';
    row.innerHTML = `
      <input type="text" placeholder="${escHtml(placeholder)}" value="${escHtml(item.service)}"
        oninput="invoiceItems[${i}].service=this.value;syncInvoicePreview()" />
      <input type="number" placeholder="₹" value="${item.amount}" style="width:90px"
        oninput="invoiceItems[${i}].amount=parseFloat(this.value)||0;syncInvoicePreview()" />
      <button class="remove-btn" onclick="removeItem(${i})">✕</button>
    `;
    container.appendChild(row);
  });
}

function getTranslation(key) {
  return (translations[currentLang] || translations.en)[key] || translations.en[key] || key;
}

function removeItem(i) {
  invoiceItems.splice(i, 1);
  renderInvoiceItems();
  syncInvoicePreview();
}

// ---- AUTH ----
function initAuth() {
  updateGenerateButton();
}

document.addEventListener('click', (event) => {
  const dropdown = document.getElementById('userDropdown');
  const userInfo = document.querySelector('.user-info');
  if (dropdown && !dropdown.contains(event.target) && !userInfo?.contains(event.target)) {
    dropdown.classList.remove('open');
  }
});

function openPlansModal(defaultPlanId) {
  const modal = document.getElementById('plansModal');
  if (!modal) return;
  showPlanStep('choose');
  window._selectedPlan = null;
  document.querySelectorAll('.plan-card').forEach((card) => card.classList.remove('selected'));
  if (defaultPlanId) selectPlan(defaultPlanId);
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePlansModal() {
  const modal = document.getElementById('plansModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function plansModalOverlayClick(event) {
  if (event.target === document.getElementById('plansModal')) {
    closePlansModal();
  }
}

function showPlanStep(stepId) {
  document.querySelectorAll('.plan-step').forEach((step) => step.classList.remove('active'));
  document.getElementById('planStep-' + stepId)?.classList.add('active');
}

function selectPlan(planId) {
  if (!PLAN_DATA[planId]) return;
  window._selectedPlan = planId;
  document.querySelectorAll('.plan-card').forEach((card) => card.classList.remove('selected'));
  document.getElementById('planCard-' + planId)?.classList.add('selected');
}

function proceedToPayment() {
  if (!window._selectedPlan) {
    showToast('Please select a plan first.');
    return;
  }
  if (!window.auth?.currentUser) {
    closePlansModal();
    openAuthModal('login');
    return;
  }

  const plan = PLAN_DATA[window._selectedPlan];
  const titleEl = document.getElementById('payStepTitle');
  if (titleEl) titleEl.textContent = `Pay ₹${plan.price}`;
  showPlanStep('pay');
}

function selectPayMethod(button) {
  document.querySelectorAll('.pay-method').forEach((method) => method.classList.remove('selected'));
  button.classList.add('selected');
}

async function confirmPayment() {
  if (!window._selectedPlan) return;

  const btn = document.getElementById('plansConfirmBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Activating...';
  }

  try {
    const plan = PLAN_DATA[window._selectedPlan];
    await new Promise((resolve) => setTimeout(resolve, 900));
    await applyPlanToUser(plan);

    const msgEl = document.getElementById('plansSuccessMsg');
    if (msgEl) {
      msgEl.textContent = plan.kits === 1
        ? 'You now have 1 business kit credit.'
        : `You now have ${plan.kits} business kit credits.`;
    }
    showPlanStep('success');
  } catch (err) {
    showToast('Error activating credits: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = '✓ Confirm Payment & Activate';
    }
  }
}

function finishPlansFlow() {
  const shouldGenerate = pendingGenerateAfterPayment;
  pendingGenerateAfterPayment = false;
  closePlansModal();
  updateGenerateButton();
  if (shouldGenerate) {
    generateDescriptions();
  } else {
    showPage('generator');
  }
}

function syncInvoicePreview() {
  setValue('prev_your_name', 'inv_your_name', 'Your Studio');
  setValue('prev_your_contact', 'inv_your_contact', '');
  setValue('prev_client_name', 'inv_client_name', 'Client Name');
  setValue('prev_client_contact', 'inv_client_contact', '');
  setValue('prev_number', 'inv_number', 'BW-001');
  setValue('prev_date', 'inv_date', '');

  const tbody = document.getElementById('prev_items');
  tbody.innerHTML = '';
  let total = 0;

  invoiceItems.forEach((item) => {
    const tr = document.createElement('tr');
    const amt = parseFloat(item.amount) || 0;
    total += amt;
    tr.innerHTML = `<td>${escHtml(item.service) || '-'}</td><td>₹${amt.toFixed(0)}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById('prev_total').textContent = `₹${total.toFixed(0)}`;
  document.getElementById('inv_total_display').textContent = `₹${total.toFixed(0)}`;
}

function setValue(previewId, inputId, fallback) {
  const val = document.getElementById(inputId)?.value || '';
  document.getElementById(previewId).textContent = val || fallback;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function prefillInvoice() {
  showPage('invoice');
  setTimeout(() => {
    if (window._lastBizName) {
      document.getElementById('inv_client_name').value = window._lastBizName;
    }
    syncInvoicePreview();
  }, 100);
}

function prefillInvoicePlan(amount, label) {
  showPage('invoice');
  setTimeout(() => {
    const serviceLabel = label || 'BizWrite Business Profile Kit';
    if (invoiceItems.length > 0) {
      invoiceItems[0].service = serviceLabel;
      invoiceItems[0].amount = amount;
    } else {
      invoiceItems.push({ service: serviceLabel, amount });
    }
    renderInvoiceItems();
    syncInvoicePreview();
  }, 100);
}

function printInvoice() {
  window.print();
}

let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2500);
}

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  setLang(currentLang);
  initInvoice();
  renderHistory();
  observeSections();

  const initialSection = window.location.hash.replace('#', '');
  if (initialSection && document.getElementById(`page-${initialSection}`)) {
    setTimeout(() => showPage(initialSection), 50);
  } else {
    setActiveNav('generator');
  }
});
