// ===========================
//   PATRALEKHAK — app.js
//   Complaint & Legal Letter Writer
// ===========================

const LETTERS_STORAGE_KEY = 'patralekhak_letters';
const UI_LANG_STORAGE_KEY = 'patralekhak_ui_lang';
const CREDITS_STORAGE_KEY = 'patralekhak_letter_credits';
const FREE_SAMPLE_USED_KEY = 'patralekhak_free_sample_used';
const FREE_SAMPLE_LIMIT = 1;

const PAYMENT_PLANS = {
  single: { labelKey: 'plan_single_name', base: 9, credits: 1 },
  pack: { labelKey: 'plan_pack_name', base: 35, credits: 5 },
  pro: { labelKey: 'plan_pro_name', base: 79, credits: 15 }
};

// ====== STATE ======
let currentType = 'Bank Dispute';
let generatedLetter = '';
let generatedPlainText = '';
let savedLetters = getSavedLetters();
let currentUILang = localStorage.getItem(UI_LANG_STORAGE_KEY) || 'en';
let pendingPlan = null;
let payMethod = 'upi';
let pendingGenerateAfterPayment = false;

// ====== i18n ======
const i18n = {
  en: {
    meta_title: 'Smart Digital PatraLekhak — Complaint & Legal Letter Writer',
    nav_writer: 'Write Letter',
    nav_saved: 'Saved Letters',
    nav_pricing: 'Pricing',
    nav_guide: 'How It Works',
    hero_eyebrow: 'Professional · Formal · Ready to Send',
    hero_title: 'Your Voice.<br/><em>Their Language.</em>',
    hero_sub: "Describe your problem in simple words — we'll write a powerful formal letter for you.",
    step1: 'Choose Letter Type',
    step2: 'Your Details & Recipient',
    step3: 'Describe Your Problem',
    step4: 'Letter Options',
    type_bank: 'Bank Dispute',
    type_elec: 'Electricity / Water',
    type_telecom: 'Telecom',
    type_school: 'School / College',
    type_rti: 'RTI Application',
    type_legal: 'Legal Notice',
    type_govt: 'Govt Office',
    label_sender_name: 'Your Full Name',
    label_sender_addr: 'Your Address',
    label_sender_phone: 'Phone / Email',
    label_recipient: 'Addressed To',
    label_recipient_addr: 'Recipient Office / Address',
    label_ref: 'Reference No. (if any)',
    ph_sender_name: 'e.g. Ramesh Kumar Sharma',
    ph_sender_addr: 'Village/Town, District, State',
    ph_sender_phone: 'Phone number or email',
    ph_recipient: 'e.g. The Branch Manager, SBI',
    ph_recipient_addr: 'Office name and address',
    ph_ref: 'Complaint ID / Account No. / Application No.',
    ph_problem: "Write in your own words — Hindi, Assamese or English is fine. E.g: 'My electricity connection was cut without notice even though I paid the bill on 5th March. I have the receipt. This is the third time it happened. I want them to reconnect and give compensation.'",
    label_out_lang: 'Letter Language',
    opt_lang_english: 'English',
    opt_lang_hindi: 'हिन्दी (Hindi)',
    opt_lang_assamese: 'অসমীয়া (Assamese)',
    label_tone: 'Tone',
    tone_firm: 'Firm & Formal',
    tone_polite: 'Polite but Assertive',
    tone_urgent: 'Urgent & Demanding',
    tone_legal: 'Legal & Strict',
    chk_deadline: 'Include 15-day response deadline',
    chk_cc: 'Add CC to higher authority',
    chk_rti: 'Mention RTI threat if ignored',
    buy_more_cta: 'View Low-Cost Plans',
    btn_generate: '✍️ Generate Formal Letter',
    btn_loading: 'Writing your letter…',
    generate_note: 'One free sample included. After that, each letter uses 1 credit.',
    preview_title: 'Letter Preview',
    placeholder_text: 'Your formal letter will appear here after generation.',
    char_hint: 'More detail = better letter. Include dates, amounts, names where possible.',
    action_copy: '📋 Copy',
    action_copy_title: 'Copy letter',
    action_download_txt: '⬇ TXT',
    action_download_txt_title: 'Download as TXT',
    action_download_pdf: '📄 PDF',
    action_download_pdf_title: 'Download as PDF',
    action_save: '💾 Save',
    action_save_title: 'Save letter',
    action_regenerate: '↺ Regenerate',
    action_edit: '✏️ Edit Letter',
    saved_title: 'Saved Letters',
    saved_sub: 'All your previously generated letters.',
    saved_empty: 'No saved letters yet.<br/>Generate one and click Save!',
    saved_cta: 'Write a Letter →',
    saved_to_label: 'To:',
    saved_view: 'View',
    saved_pdf: 'PDF',
    saved_delete: 'Delete',
    guide_title: 'How It Works',
    guide_sub: 'Simple steps to get your letter in minutes.',
    guide_step1_title: 'Choose Letter Type',
    guide_step1_text: 'Select from 7 categories — Bank, Electricity, Telecom, School, RTI, Legal Notice, or Government Office.',
    guide_step2_title: 'Fill Your Details',
    guide_step2_text: 'Enter your name, address, and who the letter is going to. Add a reference number if you have one.',
    guide_step3_title: 'Describe Your Problem',
    guide_step3_text: 'Write in simple Hindi, Assamese, or English. Just tell us what happened — dates, amounts, what you want. We handle the formal language.',
    guide_step4_title: 'Generate & Download',
    guide_step4_text: 'Click Generate. Your professional letter appears instantly. Download as PDF or TXT, or print directly.',
    faq_title: 'Frequently Asked Questions',
    faq_q1: 'Can I write my problem in Hindi or Assamese? <span class="faq-arrow">▼</span>',
    faq_a1: 'Yes. You can describe your problem in Hindi, Assamese, or English. The AI understands all three and writes the final letter in whichever output language you choose.',
    faq_q2: 'Is the letter legally valid? <span class="faq-arrow">▼</span>',
    faq_a2: 'The letters follow standard formal complaint formats used in India. For serious legal matters, it is still wise to have a local advocate review the letter before sending it.',
    faq_q3: 'Where do I send the letter after downloading? <span class="faq-arrow">▼</span>',
    faq_a3: 'Print the letter, sign it, and send it by Registered Post or Speed Post so you keep proof of delivery. For some complaints, you can also email the PDF to the grievance office.',
    faq_q4: 'What is an RTI Application? <span class="faq-arrow">▼</span>',
    faq_a4: 'RTI means Right to Information. Under the RTI Act, 2005, any Indian citizen can ask government offices for information and records related to a public matter.',
    faq_q5: 'Can I edit the letter after it is generated? <span class="faq-arrow">▼</span>',
    faq_a5: 'Yes. Click the Edit Letter button below the preview and you can make changes directly before downloading or saving.',
    pricing_page_title: 'Low-Cost Pricing',
    pricing_page_sub: 'Start with one free sample, then buy only the letter credits you need.',
    pricing_free_tag: 'Free',
    pricing_free_label: 'Sample Letter',
    pricing_free_f1: '1 free sample letter',
    pricing_free_f2: 'Test the writing style first',
    pricing_free_f3: 'Copy, edit, save, or download',
    pricing_free_f4: 'Perfect for first-time users',
    pricing_free_cta: 'Try Free →',
    pricing_single_label: 'Single Letter',
    pricing_single_f1: '1 credit for 1 formal letter',
    pricing_single_f2: 'Best for one urgent complaint',
    pricing_single_f3: 'PDF + TXT + save included',
    pricing_single_f4: 'Low-cost and easy to try',
    pricing_single_cta: 'Buy 1 Letter →',
    pricing_best_badge: 'Best Value',
    pricing_pack_label: '5-Letter Pack',
    pricing_pack_f1: '5 letter credits',
    pricing_pack_f2: 'Just ₹7 per letter',
    pricing_pack_f3: 'Good for CSCs and local services',
    pricing_pack_f4: 'Most practical starter pack',
    pricing_pack_cta: 'Buy Pack →',
    pricing_pro_label: '15-Letter Pack',
    pricing_pro_f1: '15 letter credits',
    pricing_pro_f2: 'About ₹5.3 per letter',
    pricing_pro_f3: 'Best for shop operators and freelancers',
    pricing_pro_f4: 'Higher margin for client work',
    pricing_pro_cta: 'Buy 15 Letters →',
    pricing_tip_tag: '💡 Suggested Selling Price',
    pricing_tip_title: 'Easy Margin for Service Operators',
    pricing_tip_body: 'If you pay <strong>₹7–₹9</strong> per generated letter, you can comfortably charge clients <strong>₹100–₹150</strong> for a standard complaint and more for RTI or legal notices.',
    pricing_tip_side: 'Keep your app price low, and let your service charge stay where the value is.',
    pricing_tag: '💼 For Service Providers',
    pricing_title: 'Charge Your Clients',
    pricing_body: 'Simple complaint letter: <strong>₹100 – ₹150</strong><br/>RTI / Legal Notice: <strong>₹150 – ₹200</strong><br/>Urgent same-day: <strong>₹200 + ₹50 extra</strong>',
    pricing_tip: '💡 Deliver in under 5 minutes. Very high perceived value for Tier 2/3 clients.',
    pay_step_label: 'Checkout',
    pay_step_sub: 'PatraLekhak · Letter Credits',
    pay_base: 'Letter Credits',
    pay_gst: 'GST (18%)',
    pay_total: 'Total',
    pay_method_label: 'Payment Method',
    pay_method_upi: 'UPI / GPay / PhonePe',
    pay_method_card: 'Debit / Credit Card',
    pay_method_net: 'Net Banking',
    pay_processing_title: 'Processing Payment…',
    pay_processing_sub: 'Please do not close this window.',
    pay_success_title: 'Payment Successful!',
    pay_success_cta: 'Write Letter Now →',
    pay_success_msg: '{added} {creditWord} added. {total} {totalWord} available now.',
    plan_single_name: 'Single Letter',
    plan_pack_name: '5-Letter Pack',
    plan_pro_name: '15-Letter Pack',
    credit_singular: 'credit',
    credit_plural: 'credits',
    credits_free_left: '🆓 1 free sample available',
    credits_balance: '✉️ {count} {credits} remaining',
    credits_empty: '✉️ No paid credits left',
    btn_generate_free: '✍️ Generate Free Sample',
    btn_generate_paid: '✍️ Pay & Generate Letter',
    btn_generate_credit: '✍️ Generate Letter ({count} left)',
    toast_buy_plan: 'Your free sample is used. Please buy a low-cost plan to generate more letters.',
    toast_enter_name: 'Please enter your name.',
    toast_enter_recipient: 'Please enter who the letter is addressed to.',
    toast_enter_problem: 'Please describe your problem.',
    toast_generation_failed: 'Could not generate the letter. Please try again.',
    toast_connection_error: 'Connection error. Please try again.',
    toast_editable: 'Letter is now editable. Click anywhere to start editing.',
    toast_letter_copied: 'Letter copied!',
    toast_copied: 'Copied!',
    toast_no_letter_download: 'No letter to download.',
    toast_txt_downloaded: 'TXT downloaded!',
    toast_pdf_downloaded: 'PDF downloaded!',
    toast_pdf_error: 'PDF error. Please try TXT download.',
    toast_no_letter_save: 'No letter to save.',
    toast_letter_saved: 'Letter saved!',
    toast_saved_loaded: 'Saved letter loaded.',
    toast_deleted: 'Deleted.',
    fallback_salutation: 'Respected Sir/Madam,',
    fallback_closing: 'Yours faithfully,',
    letter_cc_label: 'CC:'
  },
  hi: {
    meta_title: 'Smart Digital PatraLekhak — शिकायत और कानूनी पत्र लेखक',
    nav_writer: 'पत्र लिखें',
    nav_saved: 'सहेजे गए पत्र',
    nav_pricing: 'प्राइसिंग',
    nav_guide: 'कैसे काम करता है',
    hero_eyebrow: 'पेशेवर · औपचारिक · भेजने के लिए तैयार',
    hero_title: 'आपकी बात.<br/><em>उनकी भाषा में.</em>',
    hero_sub: 'अपनी समस्या सरल शब्दों में बताएं — हम आपके लिए एक शक्तिशाली औपचारिक पत्र लिखेंगे।',
    step1: 'पत्र का प्रकार चुनें',
    step2: 'आपकी जानकारी और प्राप्तकर्ता',
    step3: 'अपनी समस्या बताएं',
    step4: 'पत्र विकल्प',
    type_bank: 'बैंक विवाद',
    type_elec: 'बिजली / पानी',
    type_telecom: 'दूरसंचार',
    type_school: 'स्कूल / कॉलेज',
    type_rti: 'RTI आवेदन',
    type_legal: 'कानूनी नोटिस',
    type_govt: 'सरकारी कार्यालय',
    label_sender_name: 'आपका पूरा नाम',
    label_sender_addr: 'आपका पता',
    label_sender_phone: 'फोन / ईमेल',
    label_recipient: 'किसे भेजें',
    label_recipient_addr: 'प्राप्तकर्ता कार्यालय / पता',
    label_ref: 'संदर्भ संख्या (यदि हो)',
    ph_sender_name: 'उदा. रमेश कुमार शर्मा',
    ph_sender_addr: 'गाँव/शहर, जिला, राज्य',
    ph_sender_phone: 'फोन नंबर या ईमेल',
    ph_recipient: 'उदा. शाखा प्रबंधक, SBI',
    ph_recipient_addr: 'कार्यालय का नाम और पता',
    ph_ref: 'शिकायत ID / खाता संख्या / आवेदन संख्या',
    ph_problem: "अपनी समस्या अपने शब्दों में लिखें — हिंदी, असमिया या अंग्रेज़ी चलेगी। उदाहरण: 'मैंने 5 मार्च को बिल भर दिया था, फिर भी बिना सूचना बिजली काट दी गई। मेरे पास रसीद है। यह तीसरी बार हुआ है। मैं चाहता हूँ कि कनेक्शन तुरंत जोड़ा जाए और मुआवज़ा मिले।'",
    label_out_lang: 'पत्र की भाषा',
    opt_lang_english: 'अंग्रेज़ी (English)',
    opt_lang_hindi: 'हिन्दी',
    opt_lang_assamese: 'অসমীয়া (असमिया)',
    label_tone: 'शैली',
    tone_firm: 'दृढ़ और औपचारिक',
    tone_polite: 'विनम्र लेकिन स्पष्ट',
    tone_urgent: 'तत्काल और कड़ा',
    tone_legal: 'कानूनी और सख्त',
    chk_deadline: '15 दिन की प्रतिक्रिया समय सीमा शामिल करें',
    chk_cc: 'उच्च प्राधिकारी को CC जोड़ें',
    chk_rti: 'अनदेखी पर RTI का उल्लेख करें',
    buy_more_cta: 'कम-कीमत प्लान देखें',
    btn_generate: '✍️ औपचारिक पत्र तैयार करें',
    btn_loading: 'आपका पत्र लिखा जा रहा है…',
    generate_note: '1 फ्री सैंपल शामिल है। उसके बाद हर पत्र पर 1 क्रेडिट लगेगा।',
    preview_title: 'पत्र पूर्वावलोकन',
    placeholder_text: 'पत्र तैयार होने के बाद यहाँ दिखेगा।',
    char_hint: 'अधिक विवरण = बेहतर पत्र। तारीख, राशि, नाम जरूर लिखें।',
    action_copy: '📋 कॉपी',
    action_copy_title: 'पत्र कॉपी करें',
    action_download_txt: '⬇ TXT',
    action_download_txt_title: 'TXT डाउनलोड करें',
    action_download_pdf: '📄 PDF',
    action_download_pdf_title: 'PDF डाउनलोड करें',
    action_save: '💾 सेव',
    action_save_title: 'पत्र सेव करें',
    action_regenerate: '↺ फिर से बनाएँ',
    action_edit: '✏️ पत्र संपादित करें',
    saved_title: 'सहेजे गए पत्र',
    saved_sub: 'आपके पहले से तैयार किए गए सभी पत्र।',
    saved_empty: 'अभी तक कोई पत्र सेव नहीं है।<br/>पहले एक पत्र बनाइए और सेव पर क्लिक कीजिए।',
    saved_cta: 'पत्र लिखें →',
    saved_to_label: 'प्रति:',
    saved_view: 'देखें',
    saved_pdf: 'PDF',
    saved_delete: 'हटाएँ',
    guide_title: 'कैसे काम करता है',
    guide_sub: 'कुछ आसान चरणों में अपना पत्र तैयार करें।',
    guide_step1_title: 'पत्र का प्रकार चुनें',
    guide_step1_text: '7 श्रेणियों में से चुनें — बैंक, बिजली, टेलीकॉम, स्कूल, RTI, कानूनी नोटिस या सरकारी कार्यालय।',
    guide_step2_title: 'अपनी जानकारी भरें',
    guide_step2_text: 'अपना नाम, पता और पत्र किसके लिए है यह लिखें। यदि संदर्भ संख्या हो तो उसे भी जोड़ें।',
    guide_step3_title: 'अपनी समस्या बताइए',
    guide_step3_text: 'हिंदी, असमिया या अंग्रेज़ी में सरल शब्दों में लिखें। क्या हुआ, कब हुआ, कितना नुकसान हुआ और आप क्या चाहते हैं — बस इतना बताइए।',
    guide_step4_title: 'तैयार करें और डाउनलोड करें',
    guide_step4_text: 'Generate पर क्लिक करें। आपका पेशेवर पत्र तुरंत तैयार हो जाएगा। उसे PDF या TXT में डाउनलोड करें।',
    faq_title: 'अक्सर पूछे जाने वाले सवाल',
    faq_q1: 'क्या मैं अपनी समस्या हिंदी या असमिया में लिख सकता/सकती हूँ? <span class="faq-arrow">▼</span>',
    faq_a1: 'हाँ। आप अपनी समस्या हिंदी, असमिया या अंग्रेज़ी में लिख सकते हैं। अंतिम पत्र आपकी चुनी हुई आउटपुट भाषा में तैयार होगा।',
    faq_q2: 'क्या यह पत्र कानूनी रूप से उपयोगी है? <span class="faq-arrow">▼</span>',
    faq_a2: 'ये पत्र भारत में प्रचलित औपचारिक शिकायत प्रारूपों पर आधारित हैं। गंभीर कानूनी मामलों में भेजने से पहले किसी स्थानीय वकील से समीक्षा कराना बेहतर रहेगा।',
    faq_q3: 'डाउनलोड करने के बाद पत्र कहाँ भेजना चाहिए? <span class="faq-arrow">▼</span>',
    faq_a3: 'पत्र प्रिंट कीजिए, हस्ताक्षर कीजिए, और Registered Post या Speed Post से भेजिए ताकि आपके पास डिलीवरी का रिकॉर्ड रहे। कुछ मामलों में PDF ईमेल से भी भेजा जा सकता है।',
    faq_q4: 'RTI आवेदन क्या होता है? <span class="faq-arrow">▼</span>',
    faq_a4: 'RTI का मतलब Right to Information है। RTI Act, 2005 के तहत कोई भी भारतीय नागरिक सरकारी कार्यालयों से सूचना और रिकॉर्ड मांग सकता है।',
    faq_q5: 'क्या पत्र तैयार होने के बाद मैं उसे संपादित कर सकता/सकती हूँ? <span class="faq-arrow">▼</span>',
    faq_a5: 'हाँ। पूर्वावलोकन के नीचे Edit Letter बटन दबाइए और फिर पत्र में सीधे बदलाव कीजिए।',
    pricing_page_title: 'कम-कीमत प्राइसिंग',
    pricing_page_sub: 'पहले एक फ्री सैंपल लें, फिर जितने लेटर-क्रेडिट चाहिए उतने ही खरीदें।',
    pricing_free_tag: 'फ्री',
    pricing_free_label: 'सैंपल लेटर',
    pricing_free_f1: '1 फ्री सैंपल लेटर',
    pricing_free_f2: 'पहले राइटिंग स्टाइल चेक करें',
    pricing_free_f3: 'कॉपी, एडिट, सेव और डाउनलोड शामिल',
    pricing_free_f4: 'पहली बार उपयोग करने वालों के लिए बढ़िया',
    pricing_free_cta: 'फ्री ट्राय करें →',
    pricing_single_label: 'सिंगल लेटर',
    pricing_single_f1: '1 औपचारिक पत्र के लिए 1 क्रेडिट',
    pricing_single_f2: 'एक जरूरी शिकायत के लिए सबसे ठीक',
    pricing_single_f3: 'PDF + TXT + सेव शामिल',
    pricing_single_f4: 'कम कीमत और आसान शुरुआत',
    pricing_single_cta: '1 लेटर खरीदें →',
    pricing_best_badge: 'बेस्ट वैल्यू',
    pricing_pack_label: '5-लेटर पैक',
    pricing_pack_f1: '5 लेटर क्रेडिट',
    pricing_pack_f2: 'सिर्फ ₹7 प्रति पत्र',
    pricing_pack_f3: 'CSC और लोकल सेवाओं के लिए अच्छा',
    pricing_pack_f4: 'सबसे उपयोगी स्टार्टर पैक',
    pricing_pack_cta: 'पैक खरीदें →',
    pricing_pro_label: '15-लेटर पैक',
    pricing_pro_f1: '15 लेटर क्रेडिट',
    pricing_pro_f2: 'लगभग ₹5.3 प्रति पत्र',
    pricing_pro_f3: 'दुकान संचालक और फ्रीलांसर के लिए बेहतर',
    pricing_pro_f4: 'क्लाइंट वर्क में ज्यादा मार्जिन',
    pricing_pro_cta: '15 लेटर खरीदें →',
    pricing_tip_tag: '💡 सुझाई गई बिक्री कीमत',
    pricing_tip_title: 'सेवा प्रदाताओं के लिए आसान मार्जिन',
    pricing_tip_body: 'अगर आपकी लागत प्रति पत्र <strong>₹7–₹9</strong> रहे, तो आप साधारण शिकायत पत्र के लिए क्लाइंट से आसानी से <strong>₹100–₹150</strong> ले सकते हैं।',
    pricing_tip_side: 'ऐप की कीमत कम रखें और असली कमाई अपनी सेवा-फीस से करें।',
    pricing_tag: '💼 सेवा प्रदाताओं के लिए',
    pricing_title: 'अपने क्लाइंट से शुल्क लें',
    pricing_body: 'साधारण शिकायत पत्र: <strong>₹100 – ₹150</strong><br/>RTI / कानूनी नोटिस: <strong>₹150 – ₹200</strong><br/>तत्काल उसी दिन: <strong>₹200 + ₹50 अतिरिक्त</strong>',
    pricing_tip: '💡 5 मिनट से कम समय में डिलीवर करें। छोटे शहरों के क्लाइंट्स के लिए इसका मूल्य बहुत ज़्यादा महसूस होता है।',
    pay_step_label: 'चेकआउट',
    pay_step_sub: 'PatraLekhak · लेटर क्रेडिट्स',
    pay_base: 'लेटर क्रेडिट्स',
    pay_gst: 'GST (18%)',
    pay_total: 'कुल',
    pay_method_label: 'पेमेंट मेथड',
    pay_method_upi: 'UPI / GPay / PhonePe',
    pay_method_card: 'डेबिट / क्रेडिट कार्ड',
    pay_method_net: 'नेट बैंकिंग',
    pay_processing_title: 'पेमेंट प्रोसेस हो रही है…',
    pay_processing_sub: 'कृपया इस विंडो को बंद न करें।',
    pay_success_title: 'पेमेंट सफल रही!',
    pay_success_cta: 'अब पत्र लिखें →',
    pay_success_msg: '{added} {creditWord} जुड़ गए। अब आपके पास {total} {totalWord} उपलब्ध हैं।',
    plan_single_name: 'सिंगल लेटर',
    plan_pack_name: '5-लेटर पैक',
    plan_pro_name: '15-लेटर पैक',
    credit_singular: 'क्रेडिट',
    credit_plural: 'क्रेडिट',
    credits_free_left: '🆓 1 फ्री सैंपल उपलब्ध है',
    credits_balance: '✉️ {count} {credits} बचे हैं',
    credits_empty: '✉️ कोई पेड क्रेडिट नहीं बचा',
    btn_generate_free: '✍️ फ्री सैंपल तैयार करें',
    btn_generate_paid: '✍️ पेमेंट करके पत्र बनाएं',
    btn_generate_credit: '✍️ पत्र बनाएं ({count} बचे)',
    toast_buy_plan: 'आपका फ्री सैंपल इस्तेमाल हो चुका है। और पत्र बनाने के लिए कम-कीमत वाला प्लान खरीदें।',
    toast_enter_name: 'कृपया अपना नाम दर्ज करें।',
    toast_enter_recipient: 'कृपया लिखें कि पत्र किसे संबोधित है।',
    toast_enter_problem: 'कृपया अपनी समस्या लिखें।',
    toast_generation_failed: 'पत्र तैयार नहीं हो सका। कृपया फिर से कोशिश करें।',
    toast_connection_error: 'कनेक्शन में समस्या है। कृपया फिर से कोशिश करें।',
    toast_editable: 'अब यह पत्र संपादन योग्य है। कहीं भी क्लिक करके बदलना शुरू करें।',
    toast_letter_copied: 'पत्र कॉपी हो गया!',
    toast_copied: 'कॉपी हो गया!',
    toast_no_letter_download: 'डाउनलोड करने के लिए कोई पत्र नहीं है।',
    toast_txt_downloaded: 'TXT डाउनलोड हो गया!',
    toast_pdf_downloaded: 'PDF डाउनलोड हो गया!',
    toast_pdf_error: 'PDF बनाते समय समस्या हुई। कृपया TXT डाउनलोड करें।',
    toast_no_letter_save: 'सेव करने के लिए कोई पत्र नहीं है।',
    toast_letter_saved: 'पत्र सेव हो गया!',
    toast_saved_loaded: 'सहेजा गया पत्र खोल दिया गया है।',
    toast_deleted: 'हटा दिया गया।',
    fallback_salutation: 'महोदय/महोदया,',
    fallback_closing: 'भवदीय,',
    letter_cc_label: 'प्रतिलिपि:'
  },
  as: {
    meta_title: 'Smart Digital PatraLekhak — অভিযোগ আৰু আইনী পত্ৰ লিখনী',
    nav_writer: 'পত্ৰ লিখক',
    nav_saved: 'সংৰক্ষিত পত্ৰসমূহ',
    nav_pricing: 'মূল্য',
    nav_guide: 'কেনেকৈ কাম কৰে',
    hero_eyebrow: 'পেছাদাৰী · আনুষ্ঠানিক · পঠিয়াবলৈ সাজু',
    hero_title: 'আপোনাৰ কথা.<br/><em>তেওঁলোকৰ ভাষাত.</em>',
    hero_sub: 'আপোনাৰ সমস্যা সহজ ভাষাত কওক — আমি আপোনাৰ বাবে এখন শক্তিশালী আনুষ্ঠানিক পত্ৰ লিখিম।',
    step1: 'পত্ৰৰ ধৰণ বাছক',
    step2: 'আপোনাৰ বিৱৰণ আৰু প্ৰাপক',
    step3: 'আপোনাৰ সমস্যা বৰ্ণনা কৰক',
    step4: 'পত্ৰৰ বিকল্পসমূহ',
    type_bank: 'বেংক বিবাদ',
    type_elec: 'বিদ্যুৎ / পানী',
    type_telecom: 'টেলিকম',
    type_school: 'বিদ্যালয় / মহাবিদ্যালয়',
    type_rti: 'RTI আবেদন',
    type_legal: 'আইনী নোটিচ',
    type_govt: 'চৰকাৰী কাৰ্যালয়',
    label_sender_name: 'আপোনাৰ সম্পূৰ্ণ নাম',
    label_sender_addr: 'আপোনাৰ ঠিকনা',
    label_sender_phone: 'ফোন / ইমেইল',
    label_recipient: 'কাক পঠিয়াব',
    label_recipient_addr: 'প্ৰাপক কাৰ্যালয় / ঠিকনা',
    label_ref: 'প্ৰসংগ নম্বৰ (যদি থাকে)',
    ph_sender_name: 'যেনে: ৰমেশ কুমাৰ শৰ্মা',
    ph_sender_addr: 'গাঁও/চহৰ, জিলা, ৰাজ্য',
    ph_sender_phone: 'ফোন নম্বৰ বা ইমেইল',
    ph_recipient: 'যেনে: শাখা প্ৰবন্ধক, SBI',
    ph_recipient_addr: 'কাৰ্যালয়ৰ নাম আৰু ঠিকনা',
    ph_ref: 'অভিযোগ ID / একাউণ্ট নম্বৰ / আবেদন নম্বৰ',
    ph_problem: "নিজৰ ভাষাত লিখক — অসমীয়া, হিন্দী বা ইংৰাজী ঠিক আছে। যেনে: 'মই ৫ মাৰ্চত বিল পৰিশোধ কৰিছিলোঁ, তথাপি কোনো জাননী নেদিয়াকৈ মোৰ বিদ্যুৎ সংযোগ কাটি দিয়া হয়। মোৰ ওচৰত ৰচিদ আছে। এইটো তৃতীয়বাৰ হৈছে। মই পুনৰ সংযোগ আৰু ক্ষতিপূৰণ বিচাৰো।'",
    label_out_lang: 'পত্ৰৰ ভাষা',
    opt_lang_english: 'English (ইংৰাজী)',
    opt_lang_hindi: 'हिन्दी (হিন্দী)',
    opt_lang_assamese: 'অসমীয়া',
    label_tone: 'সুৰ',
    tone_firm: 'দৃঢ় আৰু আনুষ্ঠানিক',
    tone_polite: 'ভদ্ৰ কিন্তু স্পষ্ট',
    tone_urgent: 'জৰুৰী আৰু কড়া',
    tone_legal: 'আইনী আৰু কঠোৰ',
    chk_deadline: '১৫ দিনৰ ভিতৰত সঁহাৰিৰ সময়সীমা যোগ কৰক',
    chk_cc: 'উচ্চ কৰ্তৃপক্ষলৈ CC যোগ কৰক',
    chk_rti: 'অগ্ৰাহ্য কৰিলে RTI উল্লেখ কৰক',
    buy_more_cta: 'কম-দামৰ প্লান চাওক',
    btn_generate: '✍️ আনুষ্ঠানিক পত্ৰ তৈয়াৰ কৰক',
    btn_loading: 'আপোনাৰ পত্ৰ লিখা হৈ আছে…',
    generate_note: '1টা ফ্ৰী নমুনা অন্তৰ্ভুক্ত আছে। তাৰ পিছত প্ৰতিখন পত্ৰৰ বাবে 1টা ক্রেডিট লাগিব।',
    preview_title: 'পত্ৰ পূৰ্বদৰ্শন',
    placeholder_text: 'পত্ৰ তৈয়াৰ হোৱাৰ পিছত ইয়াত দেখা যাব।',
    char_hint: 'অধিক বিৱৰণ = ভাল পত্ৰ। তাৰিখ, পৰিমাণ, নাম উল্লেখ কৰক।',
    action_copy: '📋 কপি',
    action_copy_title: 'পত্ৰ কপি কৰক',
    action_download_txt: '⬇ TXT',
    action_download_txt_title: 'TXT ডাউনলোড কৰক',
    action_download_pdf: '📄 PDF',
    action_download_pdf_title: 'PDF ডাউনলোড কৰক',
    action_save: '💾 সংৰক্ষণ',
    action_save_title: 'পত্ৰ সংৰক্ষণ কৰক',
    action_regenerate: '↺ পুনৰ তৈয়াৰ কৰক',
    action_edit: '✏️ পত্ৰ সম্পাদনা কৰক',
    saved_title: 'সংৰক্ষিত পত্ৰসমূহ',
    saved_sub: 'আগতে তৈয়াৰ কৰা আপোনাৰ সকলো পত্ৰ।',
    saved_empty: 'এতিয়ালৈকে কোনো পত্ৰ সংৰক্ষণ কৰা হোৱা নাই।<br/>এখন পত্ৰ তৈয়াৰ কৰি সংৰক্ষণ কৰক বুটামত ক্লিক কৰক।',
    saved_cta: 'এখন পত্ৰ লিখক →',
    saved_to_label: 'প্ৰাপক:',
    saved_view: 'দেখক',
    saved_pdf: 'PDF',
    saved_delete: 'মচক',
    guide_title: 'কেনেকৈ কাম কৰে',
    guide_sub: 'কেইটামান সহজ ধাপতে আপোনাৰ পত্ৰ তৈয়াৰ কৰক।',
    guide_step1_title: 'পত্ৰৰ ধৰণ বাছক',
    guide_step1_text: '৭টা শ্ৰেণীৰ ভিতৰত বাছক — বেংক, বিদ্যুৎ, টেলিকম, বিদ্যালয়, RTI, আইনী নোটিছ বা চৰকাৰী কাৰ্যালয়।',
    guide_step2_title: 'নিজৰ বিৱৰণ পূৰণ কৰক',
    guide_step2_text: 'আপোনাৰ নাম, ঠিকনা আৰু পত্ৰ কাক পঠিওৱা হ’ব তাক লিখক। থাকিলে প্ৰসংগ নম্বৰো যোগ কৰক।',
    guide_step3_title: 'সমস্যাটো বৰ্ণনা কৰক',
    guide_step3_text: 'অসমীয়া, হিন্দী বা ইংৰাজীত সহজকৈ লিখক। কি হৈছিল, কেতিয়া হৈছিল, কি ক্ষতি হ’ল আৰু আপুনি কি সমাধান বিচাৰে — সেয়াই যথেষ্ট।',
    guide_step4_title: 'তৈয়াৰ কৰি ডাউনলোড কৰক',
    guide_step4_text: 'Generate-ত ক্লিক কৰক। আপোনাৰ পেছাদাৰী পত্ৰ তৎক্ষণাত সাজু হ’ব। তাৰপিছত PDF বা TXT ৰূপত ডাউনলোড কৰক।',
    faq_title: 'সঘনাই সোধা প্ৰশ্নসমূহ',
    faq_q1: 'মই সমস্যাটো অসমীয়া বা হিন্দীত লিখিব পাৰিম নে? <span class="faq-arrow">▼</span>',
    faq_a1: 'হয়। আপুনি সমস্যাটো অসমীয়া, হিন্দী বা ইংৰাজীত লিখিব পাৰে। চূড়ান্ত পত্ৰটো আপুনি বাছি লোৱা আউটপুট ভাষাত দিয়া হ’ব।',
    faq_q2: 'এই পত্ৰ আইনীভাৱে ব্যৱহাৰযোগ্য নে? <span class="faq-arrow">▼</span>',
    faq_a2: 'এই পত্ৰসমূহ ভাৰতত ব্যৱহৃত সাধাৰণ আনুষ্ঠানিক অভিযোগ পত্ৰৰ ধাঁচ অনুসৰি তৈয়াৰ কৰা হয়। গুৰুতৰ আইনী বিষয়ত পঠোৱাৰ আগতে স্থানীয় এজন আইনজ্ঞৰ পৰামৰ্শ লোৱাটো ভাল।',
    faq_q3: 'ডাউনলোড কৰাৰ পিছত এই পত্ৰ ক’ত পঠিয়াব লাগে? <span class="faq-arrow">▼</span>',
    faq_a3: 'পত্ৰটো প্ৰিণ্ট কৰি স্বাক্ষৰ কৰক আৰু Registered Post বা Speed Post-এ পঠিয়াওক যাতে ডেলিভাৰিৰ প্ৰমাণ থাকে। কিছুমান ক্ষেত্ৰত PDF ইমেইলেও পঠিয়াব পাৰি।',
    faq_q4: 'RTI আবেদন মানে কি? <span class="faq-arrow">▼</span>',
    faq_a4: 'RTI মানে Right to Information। RTI Act, 2005 অনুসৰি যিকোনো ভাৰতীয় নাগৰিকে চৰকাৰী কাৰ্যালয়ৰ পৰা তথ্য আৰু ৰেকৰ্ড বিচাৰিব পাৰে।',
    faq_q5: 'পত্ৰ তৈয়াৰ হোৱাৰ পিছত মই সম্পাদনা কৰিব পাৰিম নে? <span class="faq-arrow">▼</span>',
    faq_a5: 'হয়। পূৰ্বদৰ্শনৰ তলত থকা Edit Letter বুটামত ক্লিক কৰি আপুনি পত্ৰটো সোজাকৈ সম্পাদনা কৰিব পাৰে।',
    pricing_page_title: 'কম-দামৰ মূল্য',
    pricing_page_sub: 'আগতে এটা ফ্ৰী নমুনা লওক, তাৰ পিছত যিমানখিনি পত্ৰ-ক্রেডিট লাগে সিমানখিনি কিনক।',
    pricing_free_tag: 'ফ্ৰী',
    pricing_free_label: 'নমুনা পত্ৰ',
    pricing_free_f1: '1টা ফ্ৰী নমুনা পত্ৰ',
    pricing_free_f2: 'আগতে লিখনী ধৰণ চাওক',
    pricing_free_f3: 'কপি, সম্পাদনা, সংৰক্ষণ আৰু ডাউনলোড অন্তৰ্ভুক্ত',
    pricing_free_f4: 'প্ৰথমবাৰৰ ব্যৱহাৰকাৰীৰ বাবে উৎকৃষ্ট',
    pricing_free_cta: 'ফ্ৰী চেষ্টা কৰক →',
    pricing_single_label: 'এখন পত্ৰ',
    pricing_single_f1: '1টা আনুষ্ঠানিক পত্ৰৰ বাবে 1টা ক্রেডিট',
    pricing_single_f2: 'এটা জৰুৰী অভিযোগৰ বাবে ভাল',
    pricing_single_f3: 'PDF + TXT + সংৰক্ষণ অন্তৰ্ভুক্ত',
    pricing_single_f4: 'কম দাম আৰু সহজ আৰম্ভণি',
    pricing_single_cta: '1খন পত্ৰ কিনক →',
    pricing_best_badge: 'সৰ্বোত্তম মূল্য',
    pricing_pack_label: '5-পত্ৰ পেক',
    pricing_pack_f1: '5টা পত্ৰ ক্রেডিট',
    pricing_pack_f2: 'প্ৰতি পত্ৰ মাত্ৰ ₹7',
    pricing_pack_f3: 'CSC আৰু স্থানীয় সেৱাৰ বাবে ভাল',
    pricing_pack_f4: 'আটাইতকৈ ব্যৱহাৰিক আৰম্ভণি পেক',
    pricing_pack_cta: 'পেক কিনক →',
    pricing_pro_label: '15-পত্ৰ পেক',
    pricing_pro_f1: '15টা পত্ৰ ক্রেডিট',
    pricing_pro_f2: 'প্ৰতি পত্ৰ প্ৰায় ₹5.3',
    pricing_pro_f3: 'দোকান পৰিচালক আৰু ফ্ৰীলেঞ্চাৰৰ বাবে উত্তম',
    pricing_pro_f4: 'ক্লায়েণ্ট কামত অধিক মাৰ্জিন',
    pricing_pro_cta: '15খন পত্ৰ কিনক →',
    pricing_tip_tag: '💡 পৰামৰ্শমূলক বিক্ৰী মূল্য',
    pricing_tip_title: 'সেৱা প্ৰদানকাৰীৰ বাবে সহজ মাৰ্জিন',
    pricing_tip_body: 'যদি প্ৰতিখন পত্ৰত আপোনাৰ খৰচ <strong>₹7–₹9</strong> হয়, তেন্তে সাধাৰণ অভিযোগ পত্ৰৰ বাবে ক্লায়েণ্টৰ পৰা সহজে <strong>₹100–₹150</strong> ল’ব পাৰিব।',
    pricing_tip_side: 'এপৰ দাম কম ৰাখক, আৰু মূল উপাৰ্জন সেৱা-ফিৰ পৰা লওক।',
    pricing_tag: '💼 সেৱা প্ৰদানকাৰীসকলৰ বাবে',
    pricing_title: 'ক্লায়েণ্টৰ পৰা মূল্য লওক',
    pricing_body: 'সাধাৰণ অভিযোগ পত্ৰ: <strong>₹100 – ₹150</strong><br/>RTI / আইনী নোটিছ: <strong>₹150 – ₹200</strong><br/>একেদিনাই জৰুৰী: <strong>₹200 + ₹50 অতিৰিক্ত</strong>',
    pricing_tip: '💡 ৫ মিনিটতকৈ কম সময়ত ডেলিভাৰ কৰক। টিয়াৰ ২/৩ৰ ক্লায়েণ্টৰ ওচৰত ইয়াৰ মূল্য বেছি অনুভৱ হয়।',
    pay_step_label: 'চেকআউট',
    pay_step_sub: 'PatraLekhak · পত্ৰ ক্রেডিট',
    pay_base: 'পত্ৰ ক্রেডিট',
    pay_gst: 'GST (18%)',
    pay_total: 'মুঠ',
    pay_method_label: 'পেমেণ্ট পদ্ধতি',
    pay_method_upi: 'UPI / GPay / PhonePe',
    pay_method_card: 'ডেবিট / ক্রেডিট কাৰ্ড',
    pay_method_net: 'নেট বেংকিং',
    pay_processing_title: 'পেমেণ্ট প্ৰচেছ হৈ আছে…',
    pay_processing_sub: 'অনুগ্ৰহ কৰি এই উইণ্ড’টো বন্ধ নকৰিব।',
    pay_success_title: 'পেমেণ্ট সফল হ’ল!',
    pay_success_cta: 'এতিয়া পত্ৰ লিখক →',
    pay_success_msg: '{added}টা {creditWord} যোগ হ’ল। এতিয়া আপোনাৰ ওচৰত {total}টা {totalWord} উপলব্ধ আছে।',
    plan_single_name: 'এখন পত্ৰ',
    plan_pack_name: '5-পত্ৰ পেক',
    plan_pro_name: '15-পত্ৰ পেক',
    credit_singular: 'ক্রেডিট',
    credit_plural: 'ক্রেডিট',
    credits_free_left: '🆓 1টা ফ্ৰী নমুনা উপলব্ধ আছে',
    credits_balance: '✉️ {count}টা {credits} বাকী আছে',
    credits_empty: '✉️ কোনো পেইড ক্রেডিট বাকী নাই',
    btn_generate_free: '✍️ ফ্ৰী নমুনা তৈয়াৰ কৰক',
    btn_generate_paid: '✍️ পেমেণ্ট কৰি পত্ৰ তৈয়াৰ কৰক',
    btn_generate_credit: '✍️ পত্ৰ তৈয়াৰ কৰক ({count}টা বাকী)',
    toast_buy_plan: 'আপোনাৰ ফ্ৰী নমুনাটো ব্যৱহাৰ হৈ গৈছে। অধিক পত্ৰ তৈয়াৰ কৰিবলৈ কম-দামৰ প্লান কিনক।',
    toast_enter_name: 'অনুগ্ৰহ কৰি আপোনাৰ নাম লিখক।',
    toast_enter_recipient: 'অনুগ্ৰহ কৰি পত্ৰ কাক পঠিয়াব তাক লিখক।',
    toast_enter_problem: 'অনুগ্ৰহ কৰি আপোনাৰ সমস্যা লিখক।',
    toast_generation_failed: 'পত্ৰ তৈয়াৰ কৰিব পৰা নগ’ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।',
    toast_connection_error: 'সংযোগত সমস্যা হৈছে। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।',
    toast_editable: 'এতিয়া পত্ৰটো সম্পাদনাযোগ্য। যিকোনো ঠাইত ক্লিক কৰি আৰম্ভ কৰক।',
    toast_letter_copied: 'পত্ৰ কপি কৰা হ’ল!',
    toast_copied: 'কপি কৰা হ’ল!',
    toast_no_letter_download: 'ডাউনলোড কৰিবলৈ কোনো পত্ৰ নাই।',
    toast_txt_downloaded: 'TXT ডাউনলোড কৰা হ’ল!',
    toast_pdf_downloaded: 'PDF ডাউনলোড কৰা হ’ল!',
    toast_pdf_error: 'PDF ত সমস্যা হৈছে। অনুগ্ৰহ কৰি TXT ডাউনলোড কৰক।',
    toast_no_letter_save: 'সংৰক্ষণ কৰিবলৈ কোনো পত্ৰ নাই।',
    toast_letter_saved: 'পত্ৰ সংৰক্ষণ কৰা হ’ল!',
    toast_saved_loaded: 'সংৰক্ষিত পত্ৰ খোলা হ’ল।',
    toast_deleted: 'মচি দিয়া হ’ল।',
    fallback_salutation: 'মাননীয় মহোদয়/মহোদয়া,',
    fallback_closing: 'বিনীত,',
    letter_cc_label: 'প্ৰতিলিপি:'
  }
};

const UI_LOCALE_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  as: 'as-IN'
};

const OUTPUT_LOCALE_MAP = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Assamese: 'as-IN'
};

const OUTPUT_FALLBACKS = {
  English: { salutation: 'Respected Sir/Madam,', closing: 'Yours faithfully,', ccLabel: 'CC:' },
  Hindi: { salutation: 'महोदय/महोदया,', closing: 'भवदीय,', ccLabel: 'प्रतिलिपि:' },
  Assamese: { salutation: 'মাননীয় মহোদয়/মহোদয়া,', closing: 'বিনীত,', ccLabel: 'প্ৰতিলিপি:' }
};

function getSavedLetters() {
  try {
    return JSON.parse(localStorage.getItem(LETTERS_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function getCredits() {
  return parseInt(localStorage.getItem(CREDITS_STORAGE_KEY) || '0', 10);
}

function addCredits(count) {
  localStorage.setItem(CREDITS_STORAGE_KEY, String(getCredits() + count));
  updateCreditsDisplay();
  updateGenerateButton();
}

function useCredit() {
  const credits = getCredits();
  if (credits <= 0) return false;
  localStorage.setItem(CREDITS_STORAGE_KEY, String(credits - 1));
  updateCreditsDisplay();
  updateGenerateButton();
  return true;
}

function hasFreeSampleRemaining() {
  return parseInt(localStorage.getItem(FREE_SAMPLE_USED_KEY) || '0', 10) < FREE_SAMPLE_LIMIT;
}

function useFreeSample() {
  const used = parseInt(localStorage.getItem(FREE_SAMPLE_USED_KEY) || '0', 10);
  localStorage.setItem(FREE_SAMPLE_USED_KEY, String(used + 1));
  updateCreditsDisplay();
  updateGenerateButton();
}

function refundAccess(mode) {
  if (mode === 'credit') {
    addCredits(1);
    return;
  }
  if (mode === 'free') {
    const used = parseInt(localStorage.getItem(FREE_SAMPLE_USED_KEY) || '0', 10);
    localStorage.setItem(FREE_SAMPLE_USED_KEY, String(Math.max(0, used - 1)));
    updateCreditsDisplay();
    updateGenerateButton();
  }
}

function getText(key) {
  const langPack = i18n[currentUILang] || i18n.en;
  return langPack[key] ?? i18n.en[key] ?? key;
}

function getCreditWord(count) {
  return count === 1 ? getText('credit_singular') : getText('credit_plural');
}

function updateCreditsDisplay() {
  const pill = document.getElementById('creditsDisplay');
  if (!pill) return;

  const credits = getCredits();
  let message = '';

  if (credits > 0) {
    message = getText('credits_balance')
      .replace('{count}', credits)
      .replace('{credits}', getCreditWord(credits));
  } else if (hasFreeSampleRemaining()) {
    message = getText('credits_free_left');
  } else {
    message = getText('credits_empty');
  }

  pill.textContent = message;
  pill.style.display = 'inline-flex';
}

function updateGenerateButton() {
  const label = document.querySelector('#generateBtn .btn-label');
  if (!label) return;

  const credits = getCredits();
  if (credits > 0) {
    label.textContent = getText('btn_generate_credit').replace('{count}', credits);
  } else if (hasFreeSampleRemaining()) {
    label.textContent = getText('btn_generate_free');
  } else {
    label.textContent = getText('btn_generate_paid');
  }
}

function formatLetterDate(outputLang) {
  const locale = OUTPUT_LOCALE_MAP[outputLang] || 'en-IN';
  try {
    return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  } catch {
    return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}

function getSystemMessage(outputLang) {
  if (outputLang === 'Assamese') {
    return `You are PatraLekhak, an expert Indian formal-letter writer writing in pure Assamese (অসমীয়া).
Write only in natural Assamese, never Bengali.
Critical rules:
- Use Assamese vocabulary and grammar only.
- Use Assamese script conventions, especially "ৰ" instead of Bengali "র".
- Do not output Bengali-style words such as "এবং", "করব", "সরকার", or "আপনি".
- Keep the tone formal and submission-ready.
- Return only the requested tagged sections.`;
  }

  if (outputLang === 'Hindi') {
    return `You are PatraLekhak, an expert Indian formal-letter writer writing in formal Hindi.
Write only in clean Devanagari Hindi. Avoid Roman Hindi except for proper nouns, codes, or office names.
Keep the tone formal and submission-ready.
Return only the requested tagged sections.`;
  }

  return `You are PatraLekhak, an expert Indian formal-letter writer.
Write in clear, professional Indian English suited for complaint letters, grievance applications, RTI requests, and legal notices.
Return only the requested tagged sections.`;
}

function extractSection(raw, tag) {
  const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\[${safeTag}\\]\\s*[—:-]?\\s*([\\s\\S]*?)(?=\\n\\[[A-Z_]+\\]\\s*[—:-]?|$)`, 'i');
  return raw.match(regex)?.[1]?.trim() || '';
}

function setUILang(lang) {
  currentUILang = i18n[lang] ? lang : 'en';
  localStorage.setItem(UI_LANG_STORAGE_KEY, currentUILang);
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === currentUILang);
  });
  applyI18n();
}

function applyI18n() {
  const t = i18n[currentUILang] || i18n.en;
  document.documentElement.lang = currentUILang;
  document.title = t.meta_title;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.querySelectorAll('[data-placeholder-i18n]').forEach((el) => {
    const key = el.getAttribute('data-placeholder-i18n');
    if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (t[key] !== undefined) el.setAttribute('title', t[key]);
  });

  const loadingLabel = document.querySelector('#generateBtn .btn-loading');
  if (loadingLabel) loadingLabel.innerHTML = `<span class="dot-pulse"></span> ${t.btn_loading}`;

  renderSaved();
  updateCreditsDisplay();
  updateGenerateButton();
  if (pendingPlan) openPayModal(pendingPlan);
}

// ====== PAGE NAV ======
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector(`.nav-btn[data-page="${page}"]`).classList.add('active');
  if (page === 'saved') renderSaved();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====== TYPE SELECTION ======
function setType(btn) {
  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentType = btn.dataset.type;
}

// ====== PAYMENT ======
function selectPayMethod(method) {
  payMethod = method;
  ['upi', 'card', 'net'].forEach((item) => {
    document.getElementById(`pm-${item}`)?.classList.toggle('selected', item === method);
    const check = document.getElementById(`chk-${item}`);
    if (check) check.textContent = item === method ? '✓' : '';
  });
}

function openPayModal(planKey) {
  pendingPlan = planKey;
  const plan = PAYMENT_PLANS[planKey];
  if (!plan) return;

  const gst = Math.round(plan.base * 0.18);
  const total = plan.base + gst;

  document.getElementById('pay-title').textContent = getText(plan.labelKey);
  document.getElementById('pay-bk-base').textContent = `₹${plan.base}`;
  document.getElementById('pay-bk-gst').textContent = `₹${gst}`;
  document.getElementById('pay-bk-total').textContent = `₹${total}`;
  document.getElementById('pay-confirm-btn').textContent = `Pay ₹${total} →`;
  document.getElementById('pay-success-msg').textContent = '';

  document.getElementById('pay-step-confirm').classList.add('active');
  document.getElementById('pay-step-proc').classList.remove('active');
  document.getElementById('pay-step-success').classList.remove('active');
  selectPayMethod('upi');
  document.getElementById('payModal').style.display = 'flex';
}

function closePayModal() {
  document.getElementById('payModal').style.display = 'none';
  pendingPlan = null;
  pendingGenerateAfterPayment = false;
}

function confirmPayment() {
  const plan = PAYMENT_PLANS[pendingPlan];
  if (!plan) return;

  document.getElementById('pay-step-confirm').classList.remove('active');
  document.getElementById('pay-step-proc').classList.add('active');

  setTimeout(() => {
    addCredits(plan.credits);
    document.getElementById('pay-step-proc').classList.remove('active');
    document.getElementById('pay-step-success').classList.add('active');

    const credits = getCredits();
    const word = getCreditWord(plan.credits);
    const totalWord = getCreditWord(credits);
    document.getElementById('pay-success-msg').textContent = getText('pay_success_msg')
      .replace('{added}', plan.credits)
      .replace('{creditWord}', word)
      .replace('{total}', credits)
      .replace('{totalWord}', totalWord);
  }, 1800);
}

function onPaymentSuccess() {
  const shouldGenerate = pendingGenerateAfterPayment;
  closePayModal();
  updateCreditsDisplay();
  updateGenerateButton();
  if (shouldGenerate) {
    generateLetter();
  } else {
    showPage('writer');
  }
}

// ====== BUILD PROMPT ======
function buildPrompt(data) {
  const deadlineText = data.includeDeadline
    ? 'Include a clear closing line stating that if no response is received within 15 days, the complainant will proceed with the next available grievance or legal step.'
    : '';
  const ccText = data.includeCC
    ? 'Add a short CC section at the end mentioning an appropriate higher authority based on the complaint type.'
    : '';
  const rtiText = data.includeRTI
    ? 'Include one firm line saying that if the complaint is ignored, an RTI application may be filed to seek official information on the matter.'
    : '';

  const typeInstructions = {
    'Bank Dispute': 'Write a formal bank complaint letter. Mention grievance redressal and escalation if the matter remains unresolved.',
    'Electricity / Water Complaint': 'Write a formal complaint to the electricity or water authority. Keep the tone firm, factual, and suitable for a utility grievance.',
    'Telecom Complaint': 'Write a formal telecom complaint. Mention non-resolution and escalation through the service provider grievance process if needed.',
    'School / College Grievance': 'Write a respectful but firm grievance letter to the school, college, or education authority.',
    'RTI Application': 'Write a formal RTI application under Section 6 of the RTI Act, 2005. Address it to the Public Information Officer and clearly list the information requested.',
    'Legal Notice': 'Write a strict formal legal notice. State the grievance, demanded relief, and a compliance deadline without inventing facts.',
    'Government Office Complaint': 'Write a formal complaint to a government office. Clearly state the grievance, relief sought, and need for timely action.',
  };

  return `Write a formal ${data.type} letter in ${data.outputLang}.

LETTER DETAILS:
- Type: ${data.type}
- Sender: ${data.senderName}
- Sender Address: ${data.senderAddr || 'Not provided'}
- Sender Contact: ${data.senderContact || 'Not provided'}
- Addressed To: ${data.recipientName}
- Recipient Address: ${data.recipientAddr || 'Not provided'}
${data.refNumber ? `- Reference Number: ${data.refNumber}` : '- Reference Number: Not provided'}
- Tone: ${data.tone}
- Output Language: ${data.outputLang}

USER'S ISSUE (may contain mixed languages):
"${data.problem}"

IMPORTANT RULES:
- Use only the facts given by the user.
- Do not invent dates, account numbers, legal sections, circular numbers, office references, or evidence.
- If a detail is missing, write naturally without fabricating it.
- Keep the result practical and ready to submit.

TYPE-SPECIFIC INSTRUCTION:
${typeInstructions[data.type] || 'Write a formal complaint letter.'}
${deadlineText}
${ccText}
${rtiText}

FORMAT THE OUTPUT EXACTLY WITH THESE TAGS, EACH ON A NEW LINE:
[DATE]
[SENDER_BLOCK]
[RECIPIENT_BLOCK]
[SUBJECT]
[SALUTATION]
[BODY]
[CLOSING]
[SIGNATURE]
${data.includeCC ? '[CC]' : ''}

BODY GUIDANCE:
- Paragraph 1: Introduce the complainant and state the issue.
- Paragraph 2: Explain the facts, sequence, dates, and impact.
- Paragraph 3: Clearly state the relief or action requested.
- Paragraph 4: Close formally, including deadline or next step if applicable.

Return only the tagged content. No markdown. No bullet list outside the tags.`;
}

// ====== GENERATE LETTER ======
async function generateLetter() {
  const senderName = document.getElementById('senderName').value.trim();
  const senderAddr = document.getElementById('senderAddr').value.trim();
  const senderContact = document.getElementById('senderContact').value.trim();
  const recipientName = document.getElementById('recipientName').value.trim();
  const recipientAddr = document.getElementById('recipientAddr').value.trim();
  const refNumber = document.getElementById('refNumber').value.trim();
  const problem = document.getElementById('problemDesc').value.trim();
  const outputLang = document.getElementById('outputLang').value;
  const tone = document.getElementById('letterTone').value;
  const includeDeadline = document.getElementById('chkDeadline').checked;
  const includeCC = document.getElementById('chkCC').checked;
  const includeRTI = document.getElementById('chkRTI').checked;
  let accessMode = null;

  if (!senderName) { showToast(getText('toast_enter_name')); return; }
  if (!recipientName) { showToast(getText('toast_enter_recipient')); return; }
  if (!problem) { showToast(getText('toast_enter_problem')); return; }

  if (getCredits() > 0) {
    if (!useCredit()) return;
    accessMode = 'credit';
  } else if (hasFreeSampleRemaining()) {
    useFreeSample();
    accessMode = 'free';
  } else {
    pendingGenerateAfterPayment = true;
    openPayModal('single');
    showToast(getText('toast_buy_plan'));
    return;
  }

  setLoading(true);

  const prompt = buildPrompt({
    type: currentType, senderName, senderAddr, senderContact,
    recipientName, recipientAddr, refNumber, problem,
    outputLang, tone, includeDeadline, includeCC, includeRTI
  });

  try {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    let url = GLOBAL_CONFIG.ENDPOINT;
    let headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GLOBAL_CONFIG.API_KEY}`
    };

    if (!isLocal) {
      url = "/.netlify/functions/chat";
      delete headers["Authorization"];
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        messages: [
          { role: "system", content: getSystemMessage(outputLang) },
          { role: "user", content: prompt }
        ],
        model: GLOBAL_CONFIG.MODEL,
        max_tokens: GLOBAL_CONFIG.MAX_TOKENS,
        temperature: 0.35
      }),
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices && data.choices[0]?.message?.content?.trim();
    if (!result) throw new Error('Empty response from AI');

    generatedLetter = result;
    generatedPlainText = result;
    renderLetter(result, { senderName, recipientName, outputLang });

    // Store metadata for saving
    window._letterMeta = { senderName, recipientName, outputLang, type: currentType, problem };

  } catch (err) {
    refundAccess(accessMode);
    showToast(err.message === 'Empty response from AI' ? getText('toast_generation_failed') : getText('toast_connection_error'));
  } finally {
    setLoading(false);
  }
}

// ====== RENDER LETTER ======
function renderLetter(raw, meta = {}) {
  const outputLang = meta.outputLang || window._letterMeta?.outputLang || document.getElementById('outputLang')?.value || 'English';
  const fallbacks = OUTPUT_FALLBACKS[outputLang] || OUTPUT_FALLBACKS.English;

  const date = extractSection(raw, 'DATE');
  const senderBlock = extractSection(raw, 'SENDER_BLOCK');
  const recipientBlock = extractSection(raw, 'RECIPIENT_BLOCK');
  const subject = extractSection(raw, 'SUBJECT');
  const salutation = extractSection(raw, 'SALUTATION');
  const body = extractSection(raw, 'BODY');
  const closing = extractSection(raw, 'CLOSING');
  const signature = extractSection(raw, 'SIGNATURE');
  const cc = extractSection(raw, 'CC');

  const bodyHTML = body.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean)
    .map((p) => `<p>${escHtml(p).replace(/\n/g, '<br/>')}</p>`).join('');

  const html = `
    <div class="letter-date">${escHtml(date || formatLetterDate(outputLang))}</div>
    <div class="letter-sender">${escHtml(senderBlock || '').replace(/\n/g,'<br/>')}</div>
    <br/>
    <div class="letter-recipient">${escHtml(recipientBlock || '').replace(/\n/g,'<br/>')}</div>
    <br/>
    <div class="letter-subject">${escHtml(subject || '')}</div>
    <div class="letter-body">
      <p>${escHtml(salutation || fallbacks.salutation)}</p>
      ${bodyHTML || `<p>${escHtml(body || '')}</p>`}
    </div>
    <div class="letter-closing">${escHtml(closing || fallbacks.closing).replace(/\n/g,'<br/>')}</div>
    <div class="letter-signature">${escHtml(signature || '').replace(/\n/g,'<br/>')}</div>
    ${cc ? `<br/><div><strong>${escHtml(fallbacks.ccLabel)}</strong><br/>${escHtml(cc).replace(/\n/g,'<br/>')}</div>` : ''}
  `;

  const content = document.getElementById('letterContent');
  content.innerHTML = html;
  content.classList.remove('hidden');
  content.contentEditable = 'false';
  content.spellcheck = false;
  document.getElementById('paperPlaceholder').classList.add('hidden');
  document.getElementById('previewActions').style.display = 'flex';
  document.getElementById('postActions').classList.remove('hidden');

  content.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ====== EDITABLE ======
function makeEditable() {
  const el = document.getElementById('letterContent');
  el.contentEditable = 'true';
  el.spellcheck = true;
  el.focus();
  showToast(getText('toast_editable'));
}

// ====== COPY ======
function copyLetter() {
  const el = document.getElementById('letterContent');
  const text = el.innerText || el.textContent;

  if (!text.trim()) {
    showToast(getText('toast_no_letter_download'));
    return;
  }

  navigator.clipboard.writeText(text).then(() => showToast(getText('toast_letter_copied'))).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    showToast(getText('toast_copied'));
  });
}

// ====== DOWNLOAD TXT ======
function downloadTXT() {
  const el = document.getElementById('letterContent');
  const text = el.innerText || el.textContent;
  if (!text.trim()) { showToast(getText('toast_no_letter_download')); return; }
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Letter_${(window._letterMeta?.type || 'Complaint').replace(/\s+/g,'_')}_${Date.now()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(getText('toast_txt_downloaded'));
}

function fallbackPdfFromText(text, filename) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxW = pageW - margin * 2;

  doc.setFont('times', 'normal');
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(text, maxW);
  let y = margin;
  const lineH = 6;
  const pageH = doc.internal.pageSize.getHeight();

  lines.forEach((line) => {
    if (y + lineH > pageH - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineH;
  });

  doc.save(filename);
}

async function exportHtmlToPdf(nodeOrHtml, filename) {
  const mount = document.createElement('div');
  mount.style.position = 'fixed';
  mount.style.left = '-10000px';
  mount.style.top = '0';
  mount.style.width = '794px';
  mount.style.background = '#ffffff';
  mount.style.padding = '48px 56px';
  mount.style.zIndex = '-1';

  const printable = typeof nodeOrHtml === 'string'
    ? Object.assign(document.createElement('div'), { innerHTML: nodeOrHtml })
    : nodeOrHtml.cloneNode(true);

  printable.classList.add('letter-content');
  printable.style.display = 'block';
  printable.style.background = '#ffffff';
  printable.style.color = '#111827';
  printable.style.padding = '0';
  printable.style.fontFamily = "'Noto Serif Bengali','Noto Serif Devanagari',Georgia,serif";
  printable.style.fontSize = '16px';
  printable.style.lineHeight = '1.8';
  printable.contentEditable = 'false';

  mount.appendChild(printable);
  document.body.appendChild(mount);

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });

    await new Promise((resolve, reject) => {
      doc.html(mount, {
        callback(pdf) {
          try {
            pdf.save(filename);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        margin: [24, 24, 24, 24],
        autoPaging: 'text',
        width: 547,
        windowWidth: 794,
        html2canvas: {
          scale: 0.72,
          useCORS: true,
          backgroundColor: '#ffffff'
        }
      });
    });
  } finally {
    mount.remove();
  }
}

// ====== DOWNLOAD PDF ======
async function downloadPDF() {
  const el = document.getElementById('letterContent');
  const text = el.innerText || el.textContent;
  if (!text.trim()) { showToast(getText('toast_no_letter_download')); return; }

  const filename = `Letter_${(window._letterMeta?.type || 'Complaint').replace(/\s+/g,'_')}.pdf`;

  try {
    await exportHtmlToPdf(el, filename);
    showToast(getText('toast_pdf_downloaded'));
  } catch (e) {
    try {
      fallbackPdfFromText(text, filename);
      showToast(getText('toast_pdf_downloaded'));
    } catch (fallbackError) {
      showToast(getText('toast_pdf_error'));
    }
  }
}

// ====== SAVE / LOAD ======
function saveLetter() {
  const el = document.getElementById('letterContent');
  const text = el.innerText || el.textContent;
  if (!text.trim()) { showToast(getText('toast_no_letter_save')); return; }
  const meta = window._letterMeta || {};
  const entry = {
    id: Date.now(),
    type: meta.type || currentType,
    recipientName: meta.recipientName || '',
    outputLang: meta.outputLang || 'English',
    senderName: meta.senderName || '',
    problem: (meta.problem || '').slice(0, 120),
    html: el.innerHTML,
    plainText: text,
    date: new Date().toLocaleDateString(UI_LOCALE_MAP[currentUILang] || 'en-IN', { day:'numeric', month:'short', year:'numeric' })
  };
  savedLetters.unshift(entry);
  if (savedLetters.length > 30) savedLetters.pop();
  localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(savedLetters));
  renderSaved();
  showToast(getText('toast_letter_saved'));
}

function renderSaved() {
  const list = document.getElementById('savedList');
  const empty = document.getElementById('savedEmpty');
  if (!list || !empty) return;
  if (savedLetters.length === 0) {
    empty.classList.remove('hidden'); list.innerHTML = ''; return;
  }
  empty.classList.add('hidden');
  list.innerHTML = savedLetters.map(s => `
    <div class="saved-item">
      <div style="flex:1;min-width:0">
        <div class="saved-meta">
          <span class="saved-type-badge">${escHtml(s.type)}</span>
          <span class="saved-lang-badge">${escHtml(s.outputLang)}</span>
          <span class="saved-date">${s.date}</span>
        </div>
        <div class="saved-recipient">${escHtml(getText('saved_to_label'))} ${escHtml(s.recipientName || '—')}</div>
        <div class="saved-preview">${escHtml(s.problem)}</div>
      </div>
      <div class="saved-actions">
        <button class="saved-btn" onclick="loadSaved(${s.id})">${escHtml(getText('saved_view'))}</button>
        <button class="saved-btn" onclick="downloadSavedPDF(${s.id})">${escHtml(getText('saved_pdf'))}</button>
        <button class="saved-btn danger" onclick="deleteSaved(${s.id})">${escHtml(getText('saved_delete'))}</button>
      </div>
    </div>
  `).join('');
}

function loadSaved(id) {
  const s = savedLetters.find(x => x.id === id);
  if (!s) return;
  showPage('writer');
  setTimeout(() => {
    const content = document.getElementById('letterContent');
    content.innerHTML = s.html;
    content.classList.remove('hidden');
    content.contentEditable = 'false';
    document.getElementById('paperPlaceholder').classList.add('hidden');
    document.getElementById('previewActions').style.display = 'flex';
    document.getElementById('postActions').classList.remove('hidden');
    window._letterMeta = { type: s.type, recipientName: s.recipientName, outputLang: s.outputLang, senderName: s.senderName, problem: s.problem };
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(getText('toast_saved_loaded'));
  }, 200);
}

async function downloadSavedPDF(id) {
  const s = savedLetters.find(x => x.id === id);
  if (!s) return;
  try {
    const filename = `Letter_${s.type.replace(/\s+/g,'_')}.pdf`;
    await exportHtmlToPdf(s.html, filename);
    showToast(getText('toast_pdf_downloaded'));
  } catch(e) {
    try {
      fallbackPdfFromText(s.plainText, `Letter_${s.type.replace(/\s+/g,'_')}.pdf`);
      showToast(getText('toast_pdf_downloaded'));
    } catch (fallbackError) {
      showToast(getText('toast_pdf_error'));
    }
  }
}

function deleteSaved(id) {
  savedLetters = savedLetters.filter(x => x.id !== id);
  localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(savedLetters));
  renderSaved();
  showToast(getText('toast_deleted'));
}

// ====== FAQ TOGGLE ======
function toggleFAQ(el) {
  el.classList.toggle('open');
  const ans = el.nextElementSibling;
  ans.classList.toggle('open');
}

// ====== LOADING ======
function setLoading(on) {
  const btn = document.getElementById('generateBtn');
  btn.querySelector('.btn-label').classList.toggle('hidden', on);
  btn.querySelector('.btn-loading').classList.toggle('hidden', !on);
  btn.disabled = on;
}

// ====== TOAST ======
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), 2800);
}

// ====== UTILS ======
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ====== INIT ======
document.addEventListener('DOMContentLoaded', () => {
  setUILang(currentUILang);
  document.getElementById('payModal')?.addEventListener('click', (event) => {
    if (event.target === document.getElementById('payModal')) {
      closePayModal();
    }
  });
});
