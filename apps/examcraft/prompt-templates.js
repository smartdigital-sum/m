const PROMPT_TEMPLATES = {
  SEBA: `
BOARD SPECIFIC RULES (SEBA / ASSEB — Assam State School Education Board):
- Classes 1–8 governed by SCERT Assam. Classes 9–10 by SEBA/ASSEB.
- Follow SEBA marking scheme: Class 10 board exam has Theory 90 marks + Internal Assessment 10 marks.
- For English/Social Science, include Assamese cultural references or regional context (e.g. History/Geography of Assam).
- Science Class 9–10: 'Periodic Classification of Elements' is ACTIVE (unlike CBSE which deleted it).
- Social Science includes Assam-specific History and Geography chapters not found in CBSE.
- Assamese (MIL) is the default First Language in Assamese-medium schools.
- Ensure question difficulty and pattern align with SCERT Assam / NCERT textbooks.
`,
  AHSEC: `
BOARD SPECIFIC RULES (AHSEC — Assam Higher Secondary Education Council, ASSEB Division-II):
- For Class 11–12. Students choose a stream: Science, Commerce, or Arts/Humanities.
- Theory exams: 80 marks + Internal/Practical: 20 marks (most subjects).
- Class 12 follows NCERT textbooks with rationalized syllabus. Several chapters permanently deleted from 2023–24 session.
- IMPORTANT: Physics deleted topics — Energy stored in a Capacitor derivations, Logic Gates exercises, Wavelength of laser exercises.
- IMPORTANT: Chemistry deleted chapters — The Solid State, Surface Chemistry, General Principles of Isolation of Elements, The p-Block Elements, Polymers, Chemistry in Everyday Life.
- IMPORTANT: Biology deleted chapters — Reproduction in Organisms, Strategies for Enhancement in Food Production, Environmental Issues.
- IMPORTANT: Accountancy deleted chapters — Accounting for Not-for-Profit Organisation, Database Management System for Accounting.
- IMPORTANT: Business Studies deleted topics — Financial Market (entire chapter), some techniques of controlling and leadership qualities.
- IMPORTANT: Economics deleted chapters — Non-Competitive Markets (Microeconomics), Open Economy Macroeconomics.
- IMPORTANT: History deleted chapters — Kings and Chronicles (Mughal Courts), Colonial Cities (Urbanisation), Understanding Partition.
- IMPORTANT: Political Science deleted chapters — The Cold War Era, US Hegemony in World Politics, Rise of Popular Movements.
- IMPORTANT: Geography deleted chapters — Population Composition, Human Settlements, Manufacturing Industries, Migration.
- Do NOT generate questions from deleted chapters.
`,
  CBSE: `
BOARD SPECIFIC RULES (CBSE — Central Board of Secondary Education):
- Adhere strictly to the latest CBSE marking scheme and pattern.
- Include case-based or source-based questions for Class 10 if applicable.
- Focus on conceptual understanding and application-based questions.
- Class 10: Theory 80 marks + Internal Assessment 20 marks.
- Class 12: Theory 70/80 marks + Practical/Internal 20/30 marks.
- CBSE 2025-26 rationalized syllabus in effect:
  - Class 10 Science DELETED chapters: Chapter 5 (Periodic Classification), Chapter 14 (Sources of Energy), Chapter 16 (Sustainable Management). Do NOT generate questions from these.
  - Class 12 Chemistry DELETED chapters: The Solid State, Surface Chemistry, p-Block Elements, Polymers, Chemistry in Everyday Life.
  - Class 12 Biology DELETED chapters: Reproduction in Organisms, Strategies for Enhancement in Food Production, Environmental Issues.
  - Class 12 Accountancy DELETED chapters: Accounting for Not-for-Profit Organisation, Database Management System.
  - Class 12 Business Studies DELETED chapter: Financial Market (entire chapter).
  - Class 12 Economics DELETED chapters: Non-Competitive Markets (Microeconomics), Open Economy Macroeconomics.
  - Class 12 History DELETED chapters: Kings and Chronicles (Mughal Courts), Colonial Cities, Understanding Partition.
  - Class 12 Political Science DELETED chapters: The Cold War Era, US Hegemony, Rise of Popular Movements.
  - Class 12 Geography DELETED chapters: Population Composition, Human Settlements, Manufacturing Industries, Migration.
- CBSE Class 6 uses new 2024 NCERT textbooks: Ganita Prakash (Maths), Curiosity (Science), Exploring Society (SS), Poorvi (English), Malhar (Hindi).
- CBSE distinguishes Course A (Kshitij+Kritika) and Course B (Sparsh+Sanchayan) for Hindi at Class 9–10.
`,
  ICSE: `
BOARD SPECIFIC RULES (ICSE / ISC — Council for the Indian School Certificate Examinations):
- Provide comprehensive, in-depth coverage of topics.
- Include diagram-based or reason-based questions where applicable.
- Follow the CISCE exam pattern strictly (more detailed questions with sub-parts).
- ICSE separates Physics, Chemistry, Biology as DISTINCT subjects from Class 6 onwards (not combined "Science").
- English Language and English Literature are two separate subjects.
- Class 10: Theory + Internal Assessment (20% in most subjects).
- ISC Class 12 is very comprehensive and rigorous.
- Hindi subject chapters are in Hindi (Devanagari script). Do not translate.
`,
  JATIYA_VIDYALAYA: `
BOARD SPECIFIC RULES (JATIYA_VIDYALAYA — Assam Jatiya Bidyalay Education Council):
- This IS the AJBEC board. Classes 1–8 use proprietary textbooks. Classes 9–12 follow SEBA/AHSEC.
- Assam History is a SEPARATE mandatory subject for Classes 6–8 (unique to this board).
- Spoken English daily practice from Class 5.
- Multiplication tables up to 20 by Class 4.
- Science practicals from Class 3.
- For Classes 1–8: Use the proprietary chapter list.
- For Classes 9–10: Use SEBA chapters as reference.
- For Classes 11–12: Use AHSEC chapters with stream selection (Science/Commerce/Arts).
`,
  SHANKARDEV: `
BOARD SPECIFIC RULES (SHANKARDEV — Shankardev Shishu/Vidya Niketan):
- Run by Shishu Shiksha Samiti, Assam (Vidya Bharati affiliate). 470+ schools.
- Classes 9–10: NCERT books + SEBA syllabus.
- Classes 11–12: NCERT books + AHSEC syllabus.
- Classes 1–8: Proprietary SSS (Shishu Shiksha Samiti) textbooks with SCERT/NCERT-equivalent content.
- Key features: Zero Period (Sunya Kalamsh) daily — stories of freedom fighters and Indian history.
- Strong emphasis on Hindutva, nationalism, Indian culture, and Sanskrit.
- Sanskrit is taught as an additional language (Third Language) from Class 1.
- Classes 6–8: SSS proprietary Assamese textbook — chapters have Assamese cultural and patriotic themes.
- FOR EXAM PURPOSES: Class 9+ uses SEBA chapters. Classes 1–8 use SSS-equivalent content.
`
};

window.PROMPT_TEMPLATES = PROMPT_TEMPLATES;
