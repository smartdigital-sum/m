
/* ================================
   SCRIPTWALA — APP.JS
   WhatsApp script generator with:
   - EN/HI/AS language toggle
   - Dark/light theme toggle
   - Toast notifications
   - localStorage history
   - Assamese script fix
   ================================ */

// ── TRANSLATIONS ────────────────────────────────────────────────────
const TRANSLATIONS = {
  en: {
    nav_pricing: 'Pricing',
    nav_generate: 'Generate Scripts →',
    hero_eyebrow: 'AI-Powered for Indian Businesses',
    hero_title_1: 'WhatsApp scripts',
    hero_title_2: 'your customers',
    hero_title_3: "can't ignore.",
    hero_sub: 'Reply templates · Product descriptions · Promo offers · Festive messages.<br/>In English, Hinglish, Assamese — ready in seconds.',
    tag_retail: 'Retail Shops', tag_restaurant: 'Restaurants', tag_salon: 'Salons',
    tag_clinic: 'Clinics', tag_wholesale: 'Wholesalers', tag_any: 'any business',
    pricing_eyebrow: 'Simple Pricing', pricing_title: 'Low-ticket. High value.',
    pricing_sub: 'Pay once per pack. No subscription needed.',
    plan_quick_name: 'Quick Pack', plan_quick_period: 'one-time',
    quick_f1: '1 full script bundle', quick_f2: 'All 4 template categories',
    quick_f3: 'All 4 tone styles', quick_f4: 'Download as .txt file',
    quick_f5: 'Best for trying it out',
    plan_starter_name: 'Starter Pack', plan_starter_period: '3 bundles',
    starter_f1: '3 full script bundles', starter_f2: 'All 4 template categories',
    starter_f3: 'All 4 tone styles', starter_f4: 'Download as .txt file',
    starter_f5: 'Best for one local business',
    badge_popular: 'Best Value',
    plan_pro_name: 'Freelancer Pack', plan_pro_period: '5 businesses',
    pro_f1: '5 script bundles', pro_f2: '₹15.80 per business',
    pro_f3: 'Great for website designers', pro_f4: 'Reuse for multiple clients',
    pro_f5: 'Fastest low-ticket offer',
    plan_agency_name: 'Agency Pack', plan_agency_period: '15 businesses',
    agency_f1: '15 script bundles', agency_f2: '₹13.27 per business',
    agency_f3: 'Best margin for agencies', agency_f4: 'Ideal for recurring local work',
    agency_f5: 'Lowest effective cost per kit',
    plan_cta_get: 'Get My Scripts', plan_cta_start: 'Start Generating',
    bundle_tag: '🔥 Bundle Deal', bundle_title: 'Website + WhatsApp Script Pack',
    bundle_sub: 'Add ScriptWala to any website package for just <strong>₹79 extra</strong>. High-value add-on your clients will love.',
    bundle_cta: 'Add to Offer',
    gen_eyebrow: 'The Generator', gen_title: 'Tell us about your business',
    gen_sub: "Fill the form below — we'll create a full WhatsApp script pack instantly.",
    step1_title: 'Business Details',
    label_biz_name: 'Business Name', ph_biz_name: 'e.g. Sharma General Store, Priya Beauty Parlour',
    label_biz_type: 'Business Type', ph_biz_type: 'e.g. Grocery, Salon, Restaurant, Pharmacy',
    label_products: 'Products / Services (comma-separated)',
    ph_products: 'e.g. Rice, Dal, Mustard Oil, Home Delivery, Bulk Orders',
    label_owner: 'Owner / Contact Name', ph_owner: 'e.g. Raju Bhai, Priya Di', optional: '(optional)',
    step2_title: 'Choose Your Tone', step2_hint: 'Pick one tone for your scripts.',
    tone_formal: 'Formal', tone_formal_desc: 'Professional & official',
    tone_friendly: 'Friendly', tone_friendly_desc: 'Warm & approachable',
    tone_hinglish: 'Hinglish', tone_hinglish_desc: 'Hindi + English mix',
    tone_assamese: 'Assamese', tone_assamese_desc: 'Local NE India feel',
    step3_title: 'Select Template Types', step3_hint: 'Pick one or more to include in your script pack.',
    tmpl_reply: 'Reply Templates', tmpl_reply_desc: 'Greetings, FAQs, Follow-ups',
    tmpl_product: 'Product Descriptions', tmpl_product_desc: 'Showcase what you sell',
    tmpl_promo: 'Promo & Offers', tmpl_promo_desc: 'Sales, discounts, deals',
    tmpl_festive: 'Festive Messages', tmpl_festive_desc: 'Diwali, Eid, Bihu, Christmas',
    btn_generate: '✨ Generate My WhatsApp Scripts',
    output_eyebrow: 'Your Script Pack', output_title: 'Ready to copy & send! 🚀',
    btn_regen: '🔄 Re-generate', btn_copy_all: '📋 Copy All', btn_download: '⬇ Download All (.txt)',
    history_title: '🕘 Recent Script Packs', history_sub: 'Restore older script packs from this browser.',
    history_clear: 'Clear All', history_empty: 'No saved script packs yet.',
    footer_tagline: 'WhatsApp script packs for Indian small businesses.',
    err_biz_name: 'Please enter your business name.',
    err_biz_type: 'Please enter your business type.',
    err_products: 'Please list at least one product or service.',
    err_templates: 'Please select at least one template type.',
    err_api_auth: 'API authentication error. Please check your API key configuration.',
    err_rate_limit: 'Rate limit reached. Please wait a moment and try again.',
    err_generic: 'Generation failed. Please check your connection and try again.',
    toast_copied: 'Copied to clipboard!', toast_copy_all: 'Full pack copied!',
    toast_nothing: 'Nothing to copy yet.',
  },
  hi: {
    nav_pricing: 'प्राइसिंग',
    nav_generate: 'स्क्रिप्ट बनाएं →',
    hero_eyebrow: 'भारतीय व्यवसायों के लिए AI-संचालित',
    hero_title_1: 'WhatsApp स्क्रिप्ट',
    hero_title_2: 'जो आपके ग्राहक',
    hero_title_3: 'नज़रअंदाज़ नहीं कर सकते।',
    hero_sub: 'रिप्लाई टेम्पलेट · प्रोडक्ट विवरण · प्रोमो ऑफर · त्योहारी संदेश।<br/>English, Hinglish, Assamese में — कुछ ही सेकंड में।',
    tag_retail: 'रिटेल शॉप', tag_restaurant: 'रेस्टोरेंट', tag_salon: 'सैलून',
    tag_clinic: 'क्लिनिक', tag_wholesale: 'थोक विक्रेता', tag_any: 'कोई भी व्यवसाय',
    pricing_eyebrow: 'सरल मूल्य', pricing_title: 'कम कीमत। ज़्यादा मूल्य।',
    pricing_sub: 'प्रति पैक एक बार भुगतान करें। कोई सब्सक्रिप्शन नहीं।',
    plan_quick_name: 'क्विक पैक', plan_quick_period: 'एक बार',
    quick_f1: '1 पूरा स्क्रिप्ट बंडल', quick_f2: 'सभी 4 टेम्पलेट श्रेणियां',
    quick_f3: 'सभी 4 टोन स्टाइल', quick_f4: '.txt फ़ाइल डाउनलोड करें',
    quick_f5: 'आज़माने के लिए बेस्ट',
    plan_starter_name: 'स्टार्टर पैक', plan_starter_period: '3 बंडल',
    starter_f1: '3 पूरे स्क्रिप्ट बंडल', starter_f2: 'सभी 4 टेम्पलेट श्रेणियां',
    starter_f3: 'सभी 4 टोन स्टाइल', starter_f4: '.txt फ़ाइल डाउनलोड करें',
    starter_f5: 'एक स्थानीय व्यवसाय के लिए बेस्ट',
    badge_popular: 'सबसे अच्छा मूल्य',
    plan_pro_name: 'फ्रीलांसर पैक', plan_pro_period: '5 व्यवसाय',
    pro_f1: '5 स्क्रिप्ट बंडल', pro_f2: '₹15.80 प्रति व्यवसाय',
    pro_f3: 'वेबसाइट डिज़ाइनर के लिए बढ़िया', pro_f4: 'कई क्लाइंट के लिए उपयोग करें',
    pro_f5: 'सबसे तेज़ low-ticket ऑफर',
    plan_agency_name: 'एजेंसी पैक', plan_agency_period: '15 व्यवसाय',
    agency_f1: '15 स्क्रिप्ट बंडल', agency_f2: '₹13.27 प्रति व्यवसाय',
    agency_f3: 'एजेंसियों के लिए बेहतर मार्जिन', agency_f4: 'recurring local काम के लिए आदर्श',
    agency_f5: 'प्रति किट सबसे कम प्रभावी लागत',
    plan_cta_get: 'स्क्रिप्ट पाएं', plan_cta_start: 'जनरेट करना शुरू करें',
    bundle_tag: '🔥 बंडल डील', bundle_title: 'वेबसाइट + WhatsApp स्क्रिप्ट पैक',
    bundle_sub: 'किसी भी वेबसाइट पैकेज में ScriptWala को सिर्फ <strong>₹79 extra</strong> में जोड़ें।',
    bundle_cta: 'ऑफर में जोड़ें',
    gen_eyebrow: 'जनरेटर', gen_title: 'अपने व्यवसाय के बारे में बताएं',
    gen_sub: 'नीचे फॉर्म भरें — हम तुरंत एक पूरा WhatsApp स्क्रिप्ट पैक बनाएंगे।',
    step1_title: 'व्यवसाय की जानकारी',
    label_biz_name: 'व्यवसाय का नाम', ph_biz_name: 'उदा. शर्मा जनरल स्टोर, प्रिया ब्यूटी पार्लर',
    label_biz_type: 'व्यवसाय का प्रकार', ph_biz_type: 'उदा. किराना, सैलून, रेस्टोरेंट, फार्मेसी',
    label_products: 'उत्पाद / सेवाएं (कॉमा से अलग करें)',
    ph_products: 'उदा. चावल, दाल, सरसों का तेल, होम डिलीवरी',
    label_owner: 'मालिक / संपर्क का नाम', ph_owner: 'उदा. राजू भाई, प्रिया दी', optional: '(वैकल्पिक)',
    step2_title: 'टोन चुनें', step2_hint: 'अपनी स्क्रिप्ट के लिए एक टोन चुनें।',
    tone_formal: 'औपचारिक', tone_formal_desc: 'पेशेवर और आधिकारिक',
    tone_friendly: 'मिलनसार', tone_friendly_desc: 'गर्म और सुलभ',
    tone_hinglish: 'हिंग्लिश', tone_hinglish_desc: 'हिंदी + अंग्रेज़ी मिश्रण',
    tone_assamese: 'असमिया', tone_assamese_desc: 'NE India का स्थानीय अनुभव',
    step3_title: 'टेम्पलेट प्रकार चुनें', step3_hint: 'अपने स्क्रिप्ट पैक में शामिल करने के लिए एक या अधिक चुनें।',
    tmpl_reply: 'रिप्लाई टेम्पलेट', tmpl_reply_desc: 'अभिवादन, FAQ, फॉलो-अप',
    tmpl_product: 'प्रोडक्ट विवरण', tmpl_product_desc: 'अपना सामान दिखाएं',
    tmpl_promo: 'प्रोमो और ऑफर', tmpl_promo_desc: 'सेल, छूट, डील',
    tmpl_festive: 'त्योहारी संदेश', tmpl_festive_desc: 'दिवाली, ईद, बिहू, क्रिसमस',
    btn_generate: '✨ मेरी WhatsApp स्क्रिप्ट बनाएं',
    output_eyebrow: 'आपका स्क्रिप्ट पैक', output_title: 'कॉपी करें और भेजें! 🚀',
    btn_regen: '🔄 फिर से बनाएं', btn_copy_all: '📋 सब कॉपी करें', btn_download: '⬇ सब डाउनलोड करें (.txt)',
    history_title: '🕘 हाल के स्क्रिप्ट पैक', history_sub: 'इस ब्राउज़र से पुराने स्क्रिप्ट पैक वापस लाएं।',
    history_clear: 'सब हटाएं', history_empty: 'अभी तक कोई सेव किया गया स्क्रिप्ट पैक नहीं है।',
    footer_tagline: 'भारतीय छोटे व्यवसायों के लिए WhatsApp स्क्रिप्ट पैक।',
    err_biz_name: 'कृपया अपने व्यवसाय का नाम दर्ज करें।',
    err_biz_type: 'कृपया अपने व्यवसाय का प्रकार दर्ज करें।',
    err_products: 'कृपया कम से कम एक उत्पाद या सेवा सूचीबद्ध करें।',
    err_templates: 'कृपया कम से कम एक टेम्पलेट प्रकार चुनें।',
    err_api_auth: 'API प्रमाणीकरण त्रुटि। कृपया अपनी API Key जांचें।',
    err_rate_limit: 'Rate limit पहुंच गई। कृपया थोड़ी देर प्रतीक्षा करें।',
    err_generic: 'जनरेशन विफल। कृपया अपना कनेक्शन जांचें।',
    toast_copied: 'क्लिपबोर्ड पर कॉपी किया!', toast_copy_all: 'पूरा पैक कॉपी किया!',
    toast_nothing: 'अभी कॉपी करने के लिए कुछ नहीं है।',
  },
  as: {
    nav_pricing: 'মূল্য',
    nav_generate: 'স্ক্ৰিপ্ট তৈয়াৰ কৰক →',
    hero_eyebrow: 'ভাৰতীয় ব্যৱসায়ৰ বাবে AI-চালিত',
    hero_title_1: 'WhatsApp স্ক্ৰিপ্ট',
    hero_title_2: 'যিটো আপোনাৰ গ্ৰাহকে',
    hero_title_3: 'উপেক্ষা কৰিব নোৱাৰে।',
    hero_sub: 'ৰিপ্লাই টেমপ্লেট · সামগ্ৰীৰ বিৱৰণ · প্ৰমো অফাৰ · উৎসৱৰ বাৰ্তা।<br/>English, Hinglish, অসমীয়াত — কেইছেকেণ্ডতে।',
    tag_retail: 'ৰিটেইল দোকান', tag_restaurant: 'ৰেষ্টুৰেণ্ট', tag_salon: 'চেলন',
    tag_clinic: 'ক্লিনিক', tag_wholesale: 'পাইকাৰী বিক্ৰেতা', tag_any: 'যিকোনো ব্যৱসায়',
    pricing_eyebrow: 'সহজ মূল্য', pricing_title: 'কম দাম। বেছি মূল্য।',
    pricing_sub: 'প্ৰতি পেকত এবাৰ পেমেণ্ট কৰক। কোনো চাবস্ক্ৰিপচন নাই।',
    plan_quick_name: 'কুইক পেক', plan_quick_period: 'এবাৰ',
    quick_f1: '1টা সম্পূৰ্ণ স্ক্ৰিপ্ট বাণ্ডেল', quick_f2: 'সকলো 4টা টেমপ্লেট শ্ৰেণী',
    quick_f3: 'সকলো 4টা টোন ষ্টাইল', quick_f4: '.txt ফাইল ডাউনলোড কৰক',
    quick_f5: 'চেষ্টা কৰিবৰ বাবে সৰ্বোত্তম',
    plan_starter_name: 'ষ্টাৰ্টাৰ পেক', plan_starter_period: '3টা বাণ্ডেল',
    starter_f1: '3টা সম্পূৰ্ণ স্ক্ৰিপ্ট বাণ্ডেল', starter_f2: 'সকলো 4টা টেমপ্লেট শ্ৰেণী',
    starter_f3: 'সকলো 4টা টোন ষ্টাইল', starter_f4: '.txt ফাইল ডাউনলোড কৰক',
    starter_f5: 'এটা স্থানীয় ব্যৱসায়ৰ বাবে সৰ্বোত্তম',
    badge_popular: 'সৰ্বোত্তম মূল্য',
    plan_pro_name: 'ফ্ৰীলেঞ্চাৰ পেক', plan_pro_period: '5টা ব্যৱসায়',
    pro_f1: '5টা স্ক্ৰিপ্ট বাণ্ডেল', pro_f2: 'প্ৰতি ব্যৱসায় ₹15.80',
    pro_f3: 'ৱেবছাইট ডিজাইনাৰৰ বাবে উৎকৃষ্ট', pro_f4: 'একাধিক client-ৰ বাবে ব্যৱহাৰ কৰক',
    pro_f5: 'আটাইতকৈ দ্ৰুত low-ticket অফাৰ',
    plan_agency_name: 'এজেন্সি পেক', plan_agency_period: '15টা ব্যৱসায়',
    agency_f1: '15টা স্ক্ৰিপ্ট বাণ্ডেল', agency_f2: 'প্ৰতি ব্যৱসায় ₹13.27',
    agency_f3: 'agency-ৰ বাবে ভাল margin', agency_f4: 'recurring local কামৰ বাবে আদৰ্শ',
    agency_f5: 'প্ৰতি kit-ত আটাইতকৈ কম effective cost',
    plan_cta_get: 'স্ক্ৰিপ্ট পাওক', plan_cta_start: 'তৈয়াৰ কৰা আৰম্ভ কৰক',
    bundle_tag: '🔥 বাণ্ডেল ডিল', bundle_title: 'ৱেবছাইট + WhatsApp স্ক্ৰিপ্ট পেক',
    bundle_sub: 'যিকোনো ৱেবছাইট পেকেজত ScriptWala কেবল <strong>₹79 extra</strong>ত যোগ কৰক।',
    bundle_cta: 'অফাৰত যোগ কৰক',
    gen_eyebrow: 'জেনেৰেটৰ', gen_title: 'আপোনাৰ ব্যৱসায়ৰ বিষয়ে কওক',
    gen_sub: 'তলৰ ফৰ্মখন পূৰণ কৰক — আমি তৎক্ষণাত এটা সম্পূৰ্ণ WhatsApp স্ক্ৰিপ্ট পেক তৈয়াৰ কৰিম।',
    step1_title: 'ব্যৱসায়ৰ বিৱৰণ',
    label_biz_name: 'ব্যৱসায়ৰ নাম', ph_biz_name: 'যেনে: Sharma General Store, Priya Beauty Parlour',
    label_biz_type: 'ব্যৱসায়ৰ ধৰণ', ph_biz_type: 'যেনে: Grocery, Salon, Restaurant, Pharmacy',
    label_products: 'সামগ্ৰী / সেৱাসমূহ (কমাৰে পৃথক কৰক)',
    ph_products: 'যেনে: চাউল, মাহ, সৰিয়হৰ তেল, Home Delivery',
    label_owner: 'মালিক / যোগাযোগৰ নাম', ph_owner: 'যেনে: ৰাজু ভাই, প্ৰিয়া দি', optional: '(ঐচ্ছিক)',
    step2_title: 'টোন বাছক', step2_hint: 'আপোনাৰ স্ক্ৰিপ্টৰ বাবে এটা টোন বাছক।',
    tone_formal: 'আনুষ্ঠানিক', tone_formal_desc: 'পেছাদাৰী আৰু চৰকাৰী',
    tone_friendly: 'বন্ধুসুলভ', tone_friendly_desc: 'উষ্ণ আৰু সুলভ',
    tone_hinglish: 'হিংলিছ', tone_hinglish_desc: 'হিন্দী + ইংৰাজী মিশ্ৰণ',
    tone_assamese: 'অসমীয়া', tone_assamese_desc: 'NE India-ৰ স্থানীয় অনুভৱ',
    step3_title: 'টেমপ্লেটৰ ধৰণ বাছক', step3_hint: 'আপোনাৰ স্ক্ৰিপ্ট পেকত অন্তৰ্ভুক্ত কৰিবলৈ এটা বা অধিক বাছক।',
    tmpl_reply: 'ৰিপ্লাই টেমপ্লেট', tmpl_reply_desc: 'অভিনন্দন, FAQ, ফলো-আপ',
    tmpl_product: 'সামগ্ৰীৰ বিৱৰণ', tmpl_product_desc: 'আপুনি কি বেচে দেখাওক',
    tmpl_promo: 'প্ৰমো আৰু অফাৰ', tmpl_promo_desc: 'বিক্ৰী, ছাড়, ডিল',
    tmpl_festive: 'উৎসৱৰ বাৰ্তা', tmpl_festive_desc: 'দীপাৱলী, ঈদ, বিহু, ক্ৰিছমাছ',
    btn_generate: '✨ মোৰ WhatsApp স্ক্ৰিপ্ট তৈয়াৰ কৰক',
    output_eyebrow: 'আপোনাৰ স্ক্ৰিপ্ট পেক', output_title: 'কপি কৰক আৰু পঠাওক! 🚀',
    btn_regen: '🔄 পুনৰ তৈয়াৰ কৰক', btn_copy_all: '📋 সকলো কপি কৰক', btn_download: '⬇ সকলো ডাউনলোড কৰক (.txt)',
    history_title: '🕘 শেহতীয়া স্ক্ৰিপ্ট পেক', history_sub: 'এই browser-ৰ পৰা পুৰণি স্ক্ৰিপ্ট পেক ঘূৰাই আনক।',
    history_clear: 'সকলো মচক', history_empty: 'এতিয়ালৈকে কোনো saved স্ক্ৰিপ্ট পেক নাই।',
    footer_tagline: 'ভাৰতীয় সৰু ব্যৱসায়ৰ বাবে WhatsApp স্ক্ৰিপ্ট পেক।',
    err_biz_name: 'অনুগ্ৰহ কৰি আপোনাৰ ব্যৱসায়ৰ নাম দিয়ক।',
    err_biz_type: 'অনুগ্ৰহ কৰি আপোনাৰ ব্যৱসায়ৰ ধৰণ দিয়ক।',
    err_products: 'অনুগ্ৰহ কৰি কমেও এটা সামগ্ৰী বা সেৱা তালিকাভুক্ত কৰক।',
    err_templates: 'অনুগ্ৰহ কৰি কমেও এটা টেমপ্লেটৰ ধৰণ বাছক।',
    err_api_auth: 'API প্ৰমাণীকৰণ ত্ৰুটি। অনুগ্ৰহ কৰি আপোনাৰ API Key পৰীক্ষা কৰক।',
    err_rate_limit: 'Rate limit পাইছে। অনুগ্ৰহ কৰি অলপ অপেক্ষা কৰক।',
    err_generic: 'তৈয়াৰ কৰিব পৰা নগ'ল। অনুগ্ৰহ কৰি আপোনাৰ সংযোগ পৰীক্ষা কৰক।',
    toast_copied: 'ক্লিপবোৰ্ডত কপি কৰা হৈছে!', toast_copy_all: 'সম্পূৰ্ণ পেক কপি কৰা হৈছে!',
    toast_nothing: 'এতিয়ালৈকে কপি কৰিবলৈ একো নাই।',
  }
};

// ── STATE ────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('scriptwala_lang') || 'en';
let generatedData = {};
let currentBizName = '';
const HISTORY_KEY = 'scriptwala_history_v1';
const HISTORY_MAX = 6;

// ── TEMPLATE META (dynamic, uses translations) ───────────────────────
function getTemplateMeta() {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  return {
    reply:   { label: '💬 ' + t.tmpl_reply,   icon: '💬' },
    product: { label: '🛒 ' + t.tmpl_product, icon: '🛒' },
    promo:   { label: '🎯 ' + t.tmpl_promo,   icon: '🎯' },
    festive: { label: '🪔 ' + t.tmpl_festive, icon: '🪔' },
  };
}

// ── LANGUAGE TOGGLE ──────────────────────────────────────────────────
function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('scriptwala_lang', lang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  applyTranslations();
  renderHistory();
}

function applyTranslations() {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('[data-placeholder-i18n]').forEach(el => {
    const key = el.getAttribute('data-placeholder-i18n');
    if (t[key]) el.setAttribute('placeholder', t[key]);
  });
}

// ── THEME TOGGLE ─────────────────────────────────────────────────────
function toggleTheme() {
  const isDark = document.body.classList.toggle('light-theme');
  document.getElementById('themeIcon').textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('scriptwala_theme', isDark ? 'light' : 'dark');
}

function initTheme() {
  const saved = localStorage.getItem('scriptwala_theme');
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = '☀️';
  }
}

// ── TOAST ────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── ASSAMESE SCRIPT FIX ──────────────────────────────────────────────
function fixAssameseScript(text) {
  if (!text) return text;
  return text.replace(/র(?!্)/g, 'ৰ');
}

// ── DOM REFS ─────────────────────────────────────────────────────────
const bizNameEl      = document.getElementById('bizName');
const bizTypeEl      = document.getElementById('bizType');
const productsEl     = document.getElementById('products');
const ownerNameEl    = document.getElementById('ownerName');
const generateBtn    = document.getElementById('generateBtn');
const genBtnText     = generateBtn.querySelector('.gen-btn-text');
const genLoader      = document.getElementById('genLoader');
const errorBox       = document.getElementById('errorBox');
const errorMsgEl     = document.getElementById('errorMsg');
const outputSection  = document.getElementById('outputSection');
const tabBar         = document.getElementById('tabBar');
const panelsCont     = document.getElementById('panelsContainer');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const copyAllBtn     = document.getElementById('copyAllBtn');
const regenBtn       = document.getElementById('regenBtn');

// ── GENERATE ─────────────────────────────────────────────────────────
generateBtn.addEventListener('click', handleGenerate);

regenBtn.addEventListener('click', () => {
  outputSection.hidden = true;
  generatedData = {};
  document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
});

async function handleGenerate() {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const bizName   = bizNameEl.value.trim();
  const bizType   = bizTypeEl.value.trim();
  const products  = productsEl.value.trim();
  const ownerName = ownerNameEl.value.trim();
  const tone      = document.querySelector('input[name="tone"]:checked')?.value || 'Friendly & Casual';
  const selected  = [...document.querySelectorAll('input[name="templates"]:checked')].map(el => el.value);

  hideError();

  if (!bizName)          { showError(t.err_biz_name);  bizNameEl.focus();  return; }
  if (!bizType)          { showError(t.err_biz_type);  bizTypeEl.focus();  return; }
  if (!products)         { showError(t.err_products);  productsEl.focus(); return; }
  if (!selected.length)  { showError(t.err_templates);                     return; }

  setLoading(true);
  outputSection.hidden = true;
  tabBar.innerHTML = '';
  panelsCont.innerHTML = '';
  generatedData = {};
  currentBizName = bizName;

  const bizInfo = { name: bizName, type: bizType, products, ownerName: ownerName || bizName, tone, selected };
  const isAssamese = tone === 'Assamese regional feel';

  try {
    const results = await Promise.all(selected.map(type => generateTemplates(type, bizInfo)));
    results.forEach((result, idx) => {
      const type = selected[idx];
      generatedData[type] = isAssamese
        ? result.map(tmpl => ({ ...tmpl, body: fixAssameseScript(tmpl.body) }))
        : result;
    });

    renderOutput(selected, generatedData);
    saveToHistory({ bizName, bizType, tone, selected, data: generatedData });
    renderHistory();
    outputSection.hidden = false;
    outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (err) {
    const t2 = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    if (err.message.includes('401') || err.message.includes('403')) {
      showError(t2.err_api_auth);
    } else if (err.message.includes('429')) {
      showError(t2.err_rate_limit);
    } else {
      showError(t2.err_generic + ' (' + err.message + ')');
    }
  } finally {
    setLoading(false);
  }
}

// ── SINGLE TEMPLATE GENERATION ────────────────────────────────────────
async function generateTemplates(type, bizInfo) {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  let url = GLOBAL_CONFIG.ENDPOINT;
  let headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GLOBAL_CONFIG.API_KEY}` };
  if (!isLocal) { url = '/.netlify/functions/chat'; delete headers['Authorization']; }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      messages: [
        { role: 'system', content: buildSystem(bizInfo.tone, bizInfo.name) },
        { role: 'user',   content: buildPrompt(type, bizInfo) }
      ],
      model: GLOBAL_CONFIG.MODEL,
      max_tokens: GLOBAL_CONFIG.MAX_TOKENS,
      temperature: 0.5
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content?.trim();
  if (!result) throw new Error('Empty response from AI');
  return parseTemplates(result);
}

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────
function buildSystem(tone, bizName) {
  const toneGuide = {
    'Formal / Professional': 'Use formal, professional language. Proper grammar. No slang. Suitable for established businesses and corporate clients.',
    'Friendly & Casual': 'Use warm, friendly, conversational language. Emojis welcome. Feel like chatting with a helpful neighbour.',
    'Hinglish (Hindi+English mix)': "Mix Hindi and English naturally as spoken in Indian cities. Use Devanagari words in Roman script (e.g., 'aapka', 'bahut accha', 'special offer hai'). Emojis are great.",
    'Assamese regional feel': "Reflect Northeast Indian warmth. Use some Assamese words in Roman script (e.g., 'apunar', 'bohot', written as 'Dhanyabaad'). Friendly, community-feel tone. Use pure Assamese script where needed — use ৰ (U+09F0) not র.",
  };

  return `You are ScriptWala, an expert WhatsApp Business copywriter for Indian small businesses.

Business: ${bizName}
Tone style: ${tone}
Tone guidance: ${toneGuide[tone] || toneGuide['Friendly & Casual']}

CRITICAL OUTPUT FORMAT:
- Always output templates as a numbered list
- Start each template with: [TEMPLATE N: Short Title]
- Then the actual WhatsApp message on the next line(s)
- End each template with --- on its own line
- No extra explanation, no preamble, just the templates

Example:
[TEMPLATE 1: Welcome Greeting]
Namaste! 🙏 Welcome to our store...
---
[TEMPLATE 2: Order Confirmation]
Thank you for your order! ✅...
---`;
}

// ── USER PROMPTS ──────────────────────────────────────────────────────
function buildPrompt(type, b) {
  const base = `Business Name: ${b.name}
Business Type: ${b.type}
Products/Services: ${b.products}
Contact/Owner Name: ${b.ownerName}`;

  const prompts = {
    reply: `${base}

Generate 6 WhatsApp reply templates:
1. First welcome / greeting message for a new customer
2. Response when asked about product availability
3. Order received / confirmation message
4. Delivery update / when order is out for delivery
5. Thank you message after purchase
6. Follow-up message to check customer satisfaction (send 2 days after purchase)

Make each message feel real and ready-to-send. Include relevant emojis.`,

    product: `${base}

Generate 5 WhatsApp product description messages. For each:
- Pick one of the products/services listed above
- Write a short punchy WhatsApp message showcasing it
- Include: what it is, why it's good, price hint (say 'at great prices' if no price given), CTA to message/order
- Keep it under 100 words each
- Include relevant emojis`,

    promo: `${base}

Generate 5 WhatsApp promotional messages:
1. Flash sale / limited-time offer (create a believable offer)
2. Weekend special message
3. Bulk/wholesale discount offer
4. First-time customer welcome discount
5. Referral offer (refer a friend)

Each message should feel urgent and exciting. Include emojis, call-to-action. Keep each under 120 words.`,

    festive: `${base}

Generate 5 WhatsApp festive messages:
1. Diwali special offer / greeting
2. Eid Mubarak with a special offer
3. Bihu / New Year greetings (relevant for Assam / NE India)
4. Christmas / New Year combo offer
5. Generic "Festival Season" offer message (usable for any festival)

Each should feel warm, celebratory, and include a business offer or CTA. Use relevant emojis. Keep each under 110 words.`,
  };

  return prompts[type] || prompts.reply;
}

// ── PARSE TEMPLATES ───────────────────────────────────────────────────
function parseTemplates(raw) {
  const templates = [];
  const blocks = raw.split(/\n---\n?/).filter(b => b.trim());

  for (const block of blocks) {
    const titleMatch = block.match(/\[TEMPLATE\s*\d+:\s*(.+?)\]/i);
    const title = titleMatch ? titleMatch[1].trim() : `Template ${templates.length + 1}`;
    const body = block.replace(/\[TEMPLATE\s*\d+:\s*.+?\]\n?/i, '').trim();
    if (body) templates.push({ title, body });
  }

  if (templates.length === 0) {
    raw.split(/\n{2,}/).filter(c => c.trim().length > 30).forEach((chunk, i) => {
      templates.push({ title: `Message ${i + 1}`, body: chunk.trim() });
    });
  }

  return templates;
}

// ── RENDER OUTPUT ─────────────────────────────────────────────────────
function renderOutput(selectedTypes, data) {
  tabBar.innerHTML = '';
  panelsCont.innerHTML = '';
  const meta = getTemplateMeta();

  selectedTypes.forEach((type, idx) => {
    const m = meta[type];
    const templates = data[type] || [];

    const pill = document.createElement('button');
    pill.className = 'tab-pill' + (idx === 0 ? ' active' : '');
    pill.textContent = m.label;
    pill.dataset.type = type;
    pill.addEventListener('click', () => switchTab(type));
    tabBar.appendChild(pill);

    const panel = document.createElement('div');
    panel.className = 'template-panel' + (idx === 0 ? ' active' : '');
    panel.id = `panel-${type}`;

    const items = document.createElement('div');
    items.className = 'template-items';

    templates.forEach((tmpl, i) => {
      const item = document.createElement('div');
      item.className = 'template-item';
      item.innerHTML = `
        <div class="item-header">
          <span class="item-label">${m.icon} ${escapeHtml(tmpl.title)}</span>
          <button class="copy-single-btn" data-idx="${i}" data-type="${type}">📋 Copy</button>
        </div>
        <div class="item-body">${escapeHtml(tmpl.body)}</div>
      `;
      items.appendChild(item);
    });

    panel.appendChild(items);
    panelsCont.appendChild(panel);
  });

  panelsCont.querySelectorAll('.copy-single-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const type = btn.dataset.type;
      const idx  = parseInt(btn.dataset.idx);
      const text = (generatedData[type] || [])[idx]?.body || '';
      try {
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = '✅ Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 2000);
      } catch { /* ignore */ }
    });
  });
}

function switchTab(type) {
  document.querySelectorAll('.tab-pill').forEach(p => p.classList.toggle('active', p.dataset.type === type));
  document.querySelectorAll('.template-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${type}`));
}

// ── COPY ALL ──────────────────────────────────────────────────────────
copyAllBtn.addEventListener('click', async () => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const meta = getTemplateMeta();
  const parts = [];
  Object.entries(generatedData).forEach(([type, templates]) => {
    const m = meta[type];
    parts.push(m.label.toUpperCase());
    parts.push('─'.repeat(40));
    templates.forEach((tmpl, i) => {
      parts.push(`\n[${i + 1}] ${tmpl.title}`);
      parts.push(tmpl.body);
      parts.push('─'.repeat(30));
    });
    parts.push('');
  });

  if (!parts.length) { showToast(t.toast_nothing); return; }
  try {
    await navigator.clipboard.writeText(parts.join('\n'));
    showToast(t.toast_copy_all);
  } catch { showToast('Could not copy.'); }
});

// ── DOWNLOAD ALL ──────────────────────────────────────────────────────
downloadAllBtn.addEventListener('click', () => {
  const meta = getTemplateMeta();
  const bizName = currentBizName || bizNameEl.value.trim() || 'Business';
  const lines = [
    `SCRIPTWALA — WhatsApp Script Pack for: ${bizName}`,
    `Generated on: ${new Date().toLocaleString('en-IN')}`,
    '='.repeat(60), ''
  ];

  Object.entries(generatedData).forEach(([type, templates]) => {
    const m = meta[type];
    lines.push(m.label.toUpperCase());
    lines.push('─'.repeat(40));
    templates.forEach((tmpl, i) => {
      lines.push(`\n[${i + 1}] ${tmpl.title}`);
      lines.push(tmpl.body);
      lines.push('─'.repeat(30));
    });
    lines.push('');
  });

  lines.push('='.repeat(60));
  lines.push('Generated by ScriptWala · WhatsApp Scripts for Indian Businesses');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `ScriptWala_${bizName.replace(/[^a-zA-Z0-9]/g, '_')}_WhatsApp_Scripts.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ── HISTORY ───────────────────────────────────────────────────────────
function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}

function saveToHistory(entry) {
  const history = getHistory();
  history.unshift({ id: Date.now(), createdAt: new Date().toISOString(), ...entry });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, HISTORY_MAX)));
}

function renderHistory() {
  const list    = document.getElementById('historyList');
  const section = document.getElementById('historySection');
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  if (!list || !section) return;

  const history = getHistory();
  if (!history.length) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  list.innerHTML = history.map(entry => {
    const date  = new Date(entry.createdAt);
    const label = isNaN(date.getTime()) ? '' : date.toLocaleDateString();
    const count = Object.values(entry.data || {}).reduce((s, arr) => s + arr.length, 0);
    return `
      <button class="history-item" onclick="restoreHistory(${entry.id})">
        <span class="history-item-title">${escapeHtml(entry.bizName || 'Script pack')}</span>
        <span class="history-item-meta">${escapeHtml(entry.bizType || '')} · ${escapeHtml(entry.tone || '')}</span>
        <span class="history-item-meta">${count} templates · ${label}</span>
      </button>`;
  }).join('');
}

function restoreHistory(id) {
  const entry = getHistory().find(e => e.id === id);
  if (!entry) return;

  bizNameEl.value  = entry.bizName  || '';
  bizTypeEl.value  = entry.bizType  || '';
  productsEl.value = entry.products || '';
  currentBizName   = entry.bizName  || '';

  // Restore tone
  document.querySelectorAll('input[name="tone"]').forEach(r => {
    r.checked = r.value === entry.tone;
  });

  // Restore template checkboxes
  document.querySelectorAll('input[name="templates"]').forEach(cb => {
    cb.checked = (entry.selected || []).includes(cb.value);
  });

  generatedData = entry.data || {};
  renderOutput(entry.selected || [], generatedData);
  outputSection.hidden = false;
  outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}

// ── HELPERS ───────────────────────────────────────────────────────────
function setLoading(on) {
  generateBtn.disabled = on;
  genBtnText.hidden    = on;
  genLoader.hidden     = !on;
}

function showError(msg) {
  errorMsgEl.textContent = msg;
  errorBox.hidden = false;
  errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() { errorBox.hidden = true; }

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── INIT ──────────────────────────────────────────────────────────────
(function init() {
  initTheme();
  setLang(currentLang);
  renderHistory();
})();
