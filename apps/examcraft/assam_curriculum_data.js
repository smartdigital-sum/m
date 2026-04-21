/**
 * ============================================================
 *  ASSAM EDUCATION BOARDS — COMPLETE CURRICULUM DATA
 *  For AI-Powered Question Paper Generator App (ExamCraft)
 * ============================================================
 *
 *  PURPOSE:
 *  This file defines all education boards active in Assam, India,
 *  their classes (1–12), subjects, and exact chapter lists.
 *  When a teacher selects a Board → Class → Subject, the AI
 *  must show the chapter list from this file and use it to
 *  generate accurate, syllabus-aligned question papers.
 *
 *  BOARDS COVERED:
 *  1. SEBA/ASSEB   — State Board (Classes 1–10)
 *  2. AHSEC        — Higher Secondary (Classes 11–12)
 *  3. CBSE         — Central Board (Classes 1–12)
 *  4. ICSE / ISC   — Council for Indian School Certificate (Classes 1–12)
 *  5. AJBEC        — Jatiya Bidyalay (Assam Jatiya Bidyalay Education Council, Classes 1–12)
 *  6. SHANKARDEV   — Shankardev Shishu/Vidya Niketan (Classes 1–12)
 *
 *  LANGUAGE RULES FOR AI:
 *  - Hindi subject chapters are in Hindi (Devanagari script).
 *  - Assamese subject chapters are in Assamese script.
 *  - All other subjects are in English.
 *  - Do NOT translate chapter names; use them exactly as written here.
 *
 *  CRITICAL NOTES FOR AI:
 *  - SEBA Class 9–10 still includes "Periodic Classification of Elements"
 *    in Science. CBSE has deleted it — distinguish accordingly.
 *  - Shankardev schools follow NCERT books + SEBA syllabus (9–10)
 *    and AHSEC syllabus (11–12). Their lower classes (1–8) use
 *    proprietary SSS (Shishu Shiksha Samiti) textbooks but with
 *    SCERT-equivalent content. Treat like SEBA for exam purposes.
 *  - Jatiya Vidyalaya (AJBEC) follows SEBA/AHSEC for board exams
 *    but uses its own textbooks for Classes 1–8.
 *  - ICSE separates Physics, Chemistry, Biology as distinct subjects
 *    from Class 6 onwards (unlike SEBA/CBSE which keep combined "Science").
 *  - For AHSEC (Class 11–12), teachers choose a stream:
 *    Science, Commerce, or Arts/Humanities.
 *
 * ============================================================
 */

const CURRICULUM_DATA = {

  // ============================================================
  // BOARD 1: SEBA / ASSEB (State Board — Classes 1 to 10)
  // Full Name: Assam State School Education Board
  // Classes 1–8 governed by SCERT Assam; Classes 9–10 by SEBA/ASSEB Division-I
  // Medium: Assamese (primary), Bengali, Bodo, English, Hindi, others
  // Website: https://sebaonline.org / http://asseb.in
  // ============================================================
  SEBA: {
    fullName: "SEBA / ASSEB (Assam State School Education Board)",
    classesOffered: "1–10",
    examBoard: "ASSEB Division-I (HSLC exam at Class 10)",
    notes: [
      "Classes 1–8 follow SCERT Assam textbooks (localized NCERT framework).",
      "Classes 9–10 follow NCERT-based syllabus with Assam-specific Social Science.",
      "Medium of instruction: Assamese (majority), Bengali, Bodo, English, Hindi, Manipuri, others.",
      "Assamese (MIL) is the default First Language in Assamese-medium schools.",
      "HSLC (Class 10 board exam): Theory 90 marks + Internal Assessment 10 marks.",
      "Science Class 9–10: 'Periodic Classification of Elements' is ACTIVE (unlike CBSE which deleted it).",
      "Social Science includes Assam-specific history chapters not in CBSE."
    ],

    classes: {

      // ─────────────────────────────────────────────
      // CLASS 1
      // ─────────────────────────────────────────────
      "Class 1": {
        subjects: {
          "Assamese (MIL)": {
            textbook: "Akanir Karmaputhi / Spandan (Assamese medium)",
            notes: "Foundational literacy. Letters, words, simple sentences, rhymes.",
            chapters: [
              "আখৰ পৰিচয় (অ–ক্ষ)",
              "ছবি পঢ়া",
              "সৰল শব্দ",
              "সৰু সৰু বাক্য",
              "ছড়া আৰু কবিতা",
              "কথোপকথন",
              "পৰিয়াল আৰু বন্ধু-বান্ধৱ"
            ]
          },
          "English": {
            textbook: "Blossom-I / NCERT Mridang (Class 1)",
            notes: "Alphabets, phonics, simple words, picture reading.",
            chapters: [
              "Alphabet and Phonics (A–Z)",
              "Simple Words and Sentences",
              "Picture Reading",
              "Rhymes and Poems",
              "Greetings and Conversations",
              "My Family",
              "Animals and Birds"
            ]
          },
          "Mathematics": {
            textbook: "Amar Ganit / NCERT Math Magic 1",
            chapters: [
              "Numbers 1–20",
              "Numbers 21–100",
              "Shapes Around Us",
              "Addition (single digit)",
              "Subtraction (single digit)",
              "Measurement (comparison: big/small, long/short)",
              "Time (day/night, morning/evening)",
              "Money (introduction)"
            ]
          }
        }
      },

      // ─────────────────────────────────────────────
      // CLASS 2
      // ─────────────────────────────────────────────
      "Class 2": {
        subjects: {
          "Assamese (MIL)": {
            textbook: "Akanir Karmaputhi 2 / Jhankar",
            chapters: [
              "আখৰৰ পুনৰাবৃত্তি",
              "শব্দ গঠন",
              "বাক্য লিখন",
              "ছড়া আৰু কবিতা",
              "চুটি গল্প",
              "পশু-পক্ষী",
              "আমাৰ পৰিৱেশ",
              "উৎসৱ আৰু পৰ্ব"
            ]
          },
          "English": {
            textbook: "Blossom-II / NCERT Mridang (Class 2)",
            chapters: [
              "Unit 1: Fun with Friends — My Bicycle, Picture Reading",
              "Unit 2: Welcome to My World — It is Fun, Seeing without Eyes",
              "Unit 3: Going Places — Come Back Soon, Between Home and School, This is My Town",
              "Unit 4: Life Around Us — A Show of Clouds, My Name, The Crow, The Smart Monkey",
              "Unit 5: Harmony — Little Drops of Water, We are all Indians",
              "Grammar: Nouns, Verbs, Simple Sentences",
              "Writing: Letters and Words"
            ]
          },
          "Mathematics": {
            textbook: "Amar Ganit 2 / NCERT Joyful Maths",
            chapters: [
              "Numbers 1–1000",
              "A Day at the Beach (Number Sense)",
              "Shapes Around Us",
              "Fun with Numbers (Addition with carry)",
              "Subtraction with borrowing",
              "Multiplication (tables 2–5)",
              "Division (basic concept)",
              "Measurement",
              "Time and Calendar",
              "Money"
            ]
          }
        }
      },

      // ─────────────────────────────────────────────
      // CLASS 3
      // ─────────────────────────────────────────────
      "Class 3": {
        subjects: {
          "Assamese (MIL)": {
            textbook: "Spandan Bhag-I / Ankuran Tritiya Bhag",
            chapters: [
              "আমাৰ পৰিয়াল",
              "মোৰ বিদ্যালয়",
              "প্ৰকৃতি আৰু পৰিৱেশ",
              "জীৱ-জন্তু",
              "ঋতু",
              "খাদ্য আৰু পানীয়",
              "উৎসৱ আৰু পৰ্ব",
              "আমাৰ গাঁও",
              "মহান ব্যক্তি",
              "ব্যাকৰণ: বিশেষ্য, সৰ্বনাম, ক্ৰিয়া"
            ]
          },
          "English": {
            textbook: "My Book of English III / SCERT English 3",
            chapters: [
              "Prose: Arun's Family",
              "Prose: The Monkey and the Elephant",
              "Prose: Lalu and Peelu",
              "Prose: The Mouse and the Pencil",
              "Prose: My Wish",
              "Prose: Our National Symbols",
              "Prose: Means of Transport",
              "Prose: Clean Clean",
              "Prose: Jamun Tree (Play)",
              "Poetry: Hello Rain!",
              "Poetry: Walking with Grandpa",
              "Poetry: Traffic Rules",
              "Grammar: Nouns (types and collective), Prepositions, Simple Tenses",
              "Grammar: Adjectives, Singular/Plural, Antonyms/Synonyms, Verbs, Adverbs"
            ]
          },
          "Mathematics": {
            textbook: "Amar Ganit 3 / Our Mathematics-I / NCERT Math-Magic 3",
            chapters: [
              "Numbers up to 10,000",
              "Addition and Subtraction",
              "Multiplication (tables up to 10)",
              "Division",
              "Fractions (introduction)",
              "Measurement: Length, Weight, Capacity",
              "Time",
              "Money",
              "Data Handling",
              "Shapes and Geometry (basic)"
            ]
          },
          "Environmental Studies (EVS)": {
            textbook: "Amar Chaupashar Paribesh / Environment Around Us 3",
            chapters: [
              "Family and Friends",
              "Food",
              "Shelter",
              "Water",
              "Plants",
              "Animals",
              "Travel",
              "Things We Make and Do",
              "Our Country (introduction)"
            ]
          }
        }
      },

      // ─────────────────────────────────────────────
      // CLASS 4
      // ─────────────────────────────────────────────
      "Class 4": {
        subjects: {
          "Assamese (MIL)": {
            textbook: "Ankuran Chaturtha Bhag",
            chapters: [
              "আমাৰ অসম",
              "প্ৰকৃতিৰ উপহাৰ",
              "সৎ কাম",
              "মহান ব্যক্তিৰ জীৱনী",
              "পশু-পক্ষীৰ জগত",
              "আমাৰ স্বাস্থ্য",
              "যান-বাহন",
              "পৰিৱেশ সংৰক্ষণ",
              "খেলা-ধূলা",
              "ব্যাকৰণ: বিশেষণ, ক্ৰিয়া, কাৰক"
            ]
          },
          "English": {
            textbook: "Beginners' English-IV / NCERT Santoor (Class 4)",
            chapters: [
              "Unit 1 My Land: Together We Can, The Tinkling Bells, Be Smart Be Safe",
              "Unit 2 My Beautiful World: One Thing at a Time, The Old Stag, Braille",
              "Unit 3 Fun with Games: Fit Body Fit Mind Fit Nation, The Lagori Champions, Hekko",
              "Unit 4 Up High: The Swing, A Journey to the Magical Mountains, Maheshwar",
              "Grammar: Articles, Tenses, Linkers, Conjunctions, Prefix/Suffix",
              "Writing: Paragraph, Short Composition"
            ]
          },
          "Mathematics": {
            textbook: "Natun Ganit / New Mathematics Part-IV",
            chapters: [
              "Large Numbers (up to Lakhs)",
              "Roman Numerals",
              "Factors and Multiples",
              "Fractions",
              "Decimals (introduction)",
              "Measurement (length, mass, capacity)",
              "Time and Calendar",
              "Geometry: Basic Shapes and Angles",
              "Perimeter",
              "Data Handling"
            ]
          },
          "Environmental Studies (EVS)": {
            textbook: "Ami Aru Amar Paribesh / We and Our Environment 4",
            chapters: [
              "Family and Friends — Relationships",
              "Food and Nutrition",
              "Shelter",
              "Water and Sanitation",
              "Plants and Animals",
              "Travel and Transport",
              "Things We Make and Do",
              "Our Country — A Glimpse"
            ]
          }
        }
      },

      // ─────────────────────────────────────────────
      // CLASS 5
      // ─────────────────────────────────────────────
      "Class 5": {
        subjects: {
          "Assamese (MIL)": {
            textbook: "Ankuran Pancham Bhag",
            chapters: [
              "আমাৰ দেশ ভাৰত",
              "অসমৰ গৌৰৱ",
              "প্ৰকৃতিৰ ৰূপ",
              "মহান ব্যক্তিৰ জীৱনী",
              "বিজ্ঞান আৰু আমাৰ জীৱন",
              "সমাজ আৰু সংস্কৃতি",
              "পৰিৱেশ সংৰক্ষণ",
              "স্বাস্থ্য আৰু পৰিষ্কাৰ-পৰিচ্ছন্নতা",
              "ব্যাকৰণ: বাক্য গঠন, বিৰাম চিহ্ন, সন্ধি (পৰিচয়)"
            ]
          },
          "English": {
            textbook: "Beginners' English-V / NCERT Santoor (Class 5)",
            notes: "Some schools still use the older NCERT Marigold book. Check with school.",
            chapters: [
              "Unit 1 Let's Have Fun: Papa's Spectacles, Gone with the Scooter",
              "Unit 2 My Colourful World: The Rainbow, The Wise Parrot",
              "Unit 3 Water: The Frog, What a Tank!",
              "Unit 4 Ups and Downs: Gilli Danda, The Decision of the Panchayat",
              "Unit 5 Work is Worship: Vocation, Glass Bangles",
              "Grammar: All tenses, Active/Passive (intro), Comprehension",
              "Writing: Letters (informal), Paragraphs, Stories",
              // Older NCERT Marigold chapters (alternative — some schools still use):
              "Ice-cream Man",
              "Teamwork",
              "My Shadow",
              "The Lazy Frog",
              "Class Discussion",
              "Nobody's Friend",
              "Sing a Song of People"
            ]
          },
          "Mathematics": {
            textbook: "Natun Ganit / New Mathematics Part-V",
            chapters: [
              "Large Numbers (up to Crores)",
              "Operations on Large Numbers",
              "Factors and Multiples (HCF, LCM)",
              "Fractions (all operations)",
              "Decimals (all operations)",
              "Percentage (introduction)",
              "Measurement",
              "Geometry: Angles, Triangles, Quadrilaterals",
              "Perimeter and Area",
              "Volume",
              "Data Handling"
            ]
          },
          "Environmental Studies (EVS)": {
            textbook: "Ami Aru Amar Paribesh / We and Our Environment 5",
            chapters: [
              "Family and Friends — Relationships",
              "Plants — Life Around Us",
              "Animals — Diversity",
              "Food and Nutrition",
              "Shelter",
              "Water",
              "Travel and Communication",
              "Things We Make and Do",
              "States and Capital Cities (India)"
            ]
          }
        }
      },

      // ─────────────────────────────────────────────
      // CLASS 6
      // ─────────────────────────────────────────────
      "Class 6": {
        notes: "SCERT Assam has adopted the new NCERT 2024 framework (Ganita Prakash, Curiosity, Exploring Society, Poorvi, Malhar). Assam localizes these as 'Natun Ganit', 'Amar Bijnan', 'Samaj Bichitra', etc.",
        subjects: {
          "Assamese (MIL)": {
            textbook: "Ankuran Shashtha Bhag / Rainbow-I",
            chapters: [
              "বৰগীত আৰু লোকগীত",
              "প্ৰকৃতিৰ বৰ্ণনা",
              "মহাপুৰুষীয়া সাহিত্য",
              "অসমৰ ইতিহাস আৰু ঐতিহ্য",
              "বিজ্ঞান আৰু সমাজ",
              "কবিতা সংকলন",
              "চুটি গল্প",
              "ব্যাকৰণ: বিশেষ্য, সৰ্বনাম, ক্ৰিয়া, বিশেষণ",
              "ব্যাকৰণ: বচন, লিঙ্গ, কাৰক",
              "ৰচনা: অনুচ্ছেদ আৰু চিঠি"
            ]
          },
          "English": {
            textbook: "Sunbeam English Reader-I / NCERT Poorvi (Class 6)",
            chapters: [
              "Fables and Folk Tales",
              "Poem: A Kite",
              "Who Did Patrick's Homework?",
              "A Different Kind of School",
              "Fair Play",
              "The Wonderful Words (Poem)",
              "Taro's Reward",
              "The Banyan Tree (Poem)",
              "A Game of Chance",
              "Desert Animals",
              "Grammar: Sentences, Nouns, Pronouns, Verbs, Tenses",
              "Writing: Formal and Informal Letters, Paragraph Writing"
            ]
          },
          "Mathematics": {
            textbook: "Natun Ganit Shashtha / NCERT Ganita Prakash (Class 6)",
            chapters: [
              "Chapter 1: Patterns in Mathematics",
              "Chapter 2: Lines and Angles",
              "Chapter 3: Number Play",
              "Chapter 4: Data Handling and Presentation",
              "Chapter 5: Prime Time (Factors, Multiples, Primes)",
              "Chapter 6: Perimeter and Area",
              "Chapter 7: Fractions",
              "Chapter 8: Playing with Constructions",
              "Chapter 9: Symmetry",
              "Chapter 10: The Other Side of Zero (Integers)"
            ]
          },
          "Science": {
            textbook: "Amar Bijnan (bilingual) / NCERT Curiosity (Class 6)",
            notes: "Taught as integrated science (Physics+Chemistry+Biology combined)",
            chapters: [
              "Food: Where Does It Come From?",
              "Components of Food",
              "Fibre to Fabric",
              "Sorting Materials into Groups",
              "Separation of Substances",
              "Changes Around Us",
              "Getting to Know Plants",
              "Body Movements",
              "The Living Organisms and Their Surroundings",
              "Motion and Measurement of Distances",
              "Light, Shadows and Reflections",
              "Electricity and Circuits",
              "Fun with Magnets",
              "Water",
              "Air Around Us",
              "Garbage In, Garbage Out"
            ]
          },
          "Social Science": {
            textbook: "Samaj Bichitra / NCERT Exploring Society: India and Beyond (Class 6)",
            notes: "Assam adds unique local content. The chapters below are as per new NCERT 2024 framework adopted by SCERT.",
            chapters: [
              "Chapter 1: Locating Places on the Earth",
              "Chapter 2: Oceans and Continents",
              "Chapter 3: Landforms and Life",
              "Chapter 4: Timeline and Sources of History",
              "Chapter 5: India, That Is Bharat",
              "Chapter 6: The Beginnings of Indian Civilisation",
              "Chapter 7: India's Cultural Roots",
              "Chapter 8: Unity in Diversity, or 'Many in the One'",
              "Chapter 9: Family and Community",
              "Chapter 10: Grassroots Democracy — Part 1: Governance",
              "Chapter 11: Grassroots Democracy — Part 2: Local Government in Rural Areas",
              "Chapter 12: Grassroots Democracy — Part 3: Local Government in Urban Areas",
              "Chapter 13: The Value of Work",
              "Chapter 14: Economic Activities Around Us"
            ]
          },
          "Value Education (Charitra Path)": {
            notes: "Unique Assam SCERT subject. Moral and vocational education.",
            chapters: [
              "Moral Values and Ethics",
              "Good Manners and Habits",
              "Social Responsibility",
              "Environment Awareness",
              "Our Cultural Heritage",
              "Discipline and Punctuality"
            ]
          }
        }
      },

      // ─────────────────────────────────────────────
      // CLASS 7
      // ─────────────────────────────────────────────
      "Class 7": {
        subjects: {
          "Assamese (MIL)": {
            textbook: "Ankuran Saptam Bhag",
            chapters: [
              "বৰগীত — ভক্তি সাহিত্য",
              "অসমীয়া লোক-সাহিত্য",
              "অসমৰ বীৰ পুৰুষ",
              "প্ৰকৃতি সৌন্দৰ্য",
              "আধুনিক অসমীয়া কবিতা",
              "চুটি গল্প",
              "আধুনিক অসমীয়া গদ্য",
              "ব্যাকৰণ: ক্ৰিয়াৰ কাল, বাচ্য",
              "ব্যাকৰণ: সন্ধি, সমাস (পৰিচয়)",
              "ৰচনা: প্ৰবন্ধ, পত্ৰ"
            ]
          },
          "English": {
            textbook: "Sunbeam English Reader-II",
            chapters: [
              "Honeycomb — Three Questions",
              "Honeycomb — A Gift of Chappals",
              "Honeycomb — Gopal and the Hilsa Fish",
              "Honeycomb — The Ashes That Made Trees Bloom",
              "Honeycomb — Quality",
              "Honeycomb — Expert Detectives",
              "Honeycomb — The Invention of Vita-Wonk",
              "Honeycomb — Fire: Friend and Foe",
              "Honeycomb — A Bicycle in Good Repair",
              "Honeycomb — The Story of Cricket",
              "Poetry: The Squirrel, The Rebel, The Shed, Chivvy, Trees, Mystery of the Talking Fan, Dad and the Cat and the Tree, Meadow Surprises, Garden Snake",
              "Grammar: All tenses, Passive Voice, Reported Speech",
              "Writing: Essays, Formal Letters, Stories"
            ]
          },
          "Mathematics": {
            textbook: "Natun Ganit Saptam / NCERT Mathematics Class 7",
            chapters: [
              "Integers",
              "Fractions and Decimals",
              "Data Handling",
              "Simple Equations",
              "Lines and Angles",
              "The Triangle and its Properties",
              "Congruence of Triangles",
              "Comparing Quantities (Percentage, Profit/Loss)",
              "Rational Numbers",
              "Practical Geometry",
              "Perimeter and Area",
              "Algebraic Expressions",
              "Exponents and Powers",
              "Symmetry",
              "Visualising Solid Shapes"
            ]
          },
          "Science": {
            textbook: "Amar Bijnan / NCERT Science Class 7",
            chapters: [
              "Nutrition in Plants",
              "Nutrition in Animals",
              "Fibre to Fabric",
              "Heat",
              "Acids, Bases and Salts",
              "Physical and Chemical Changes",
              "Weather, Climate and Adaptations of Animals to Climate",
              "Winds, Storms and Cyclones",
              "Soil",
              "Respiration in Organisms",
              "Transportation in Animals and Plants",
              "Reproduction in Plants",
              "Motion and Time",
              "Electric Current and its Effects",
              "Light",
              "Water: A Precious Resource",
              "Forests: Our Lifeline",
              "Wastewater Story"
            ]
          },
          "Social Science": {
            textbook: "NCERT Social Science Class 7 (adapted by SCERT Assam)",
            chapters: [
              // History (Our Pasts - II)
              "History Ch 1: Tracing Changes Through a Thousand Years",
              "History Ch 2: New Kings and Kingdoms",
              "History Ch 3: The Delhi Sultans",
              "History Ch 4: The Mughal Empire",
              "History Ch 5: Rulers and Buildings",
              "History Ch 6: Towns, Traders and Craftspersons",
              "History Ch 7: Tribes, Nomads and Settled Communities",
              "History Ch 8: Devotional Paths to the Divine",
              "History Ch 9: The Making of Regional Cultures",
              "History Ch 10: Eighteenth-Century Political Formations",
              // Geography (Our Environment)
              "Geography Ch 1: Environment",
              "Geography Ch 2: Inside Our Earth",
              "Geography Ch 3: Our Changing Earth",
              "Geography Ch 4: Air",
              "Geography Ch 5: Water",
              "Geography Ch 6: Natural Vegetation and Wildlife",
              "Geography Ch 7: Human Environment — Settlement, Transport and Communication",
              "Geography Ch 8: Human-Environment Interactions — Tropical and Subtropical Regions",
              "Geography Ch 9: Life in the Temperate Grasslands",
              "Geography Ch 10: Life in the Deserts",
              // Civics (Social and Political Life - II)
              "Civics Ch 1: On Equality",
              "Civics Ch 2: Role of the Government in Health",
              "Civics Ch 3: How the State Government Works",
              "Civics Ch 4: Growing Up as Boys and Girls",
              "Civics Ch 5: Women Change the World",
              "Civics Ch 6: Understanding Media",
              "Civics Ch 7: Markets Around Us",
              "Civics Ch 8: A Shirt in the Market",
              "Civics Ch 9: Struggles for Equality"
            ]
          }
        }
      },

      // ─────────────────────────────────────────────
      // CLASS 8
      // ─────────────────────────────────────────────
      "Class 8": {
        notes: "Class 8 uses highly localized textbooks for English and Social Science in Assam medium. Math and Science follow standard NCERT.",
        subjects: {
          "Assamese (MIL)": {
            textbook: "Ankuran Ashtam Bhag (Shankardev SSN uses own book — Assamese Sahitya Sanchay)",
            chapters: [
              "বৰগীত (ৰাগ – আশৌৱাৰী: তাৰ-পৰি)",
              "অসমীয়া লোকসাহিত্যৰ পৰিচয়",
              "অসমীয়া মধ্যযুগীয় সাহিত্য",
              "আধুনিক অসমীয়া কবিতা",
              "অসমৰ ঐতিহাসিক ব্যক্তিত্ব",
              "ব্ৰহ্মপুত্ৰ আৰু আমাৰ পৰিৱেশ",
              "সমাজ সেৱামূলক ব্যক্তিত্ব",
              "আধুনিক অসমীয়া গদ্য",
              "অগ্নিকন্যা চন্দ্ৰপ্ৰভা শইকীয়ানী",
              "ব্যাকৰণ: বাচ্য, সন্ধি, সমাস",
              "ব্যাকৰণ: অলংকাৰ (পৰিচয়)",
              "ৰচনা: আনুষ্ঠানিক পত্ৰ, প্ৰবন্ধ, অনুচ্ছেদ"
            ]
          },
          "English": {
            textbook: "Beginners' English-VIII (Assam SCERT — localized)",
            notes: "SCERT Assam uses a localized English textbook for Class 8 with Assam-specific stories. CBSE uses 'Honeydew' and 'It So Happened'.",
            chapters: [
              "Chapter 1: The Prince of Panidihing (Courage during Assam floods)",
              "Chapter 2: My Native Land (Patriotism and regional identity)",
              "Chapter 3: Explore India: Quiz Time",
              "Chapter 4: Dokchory Learns about Panchayat",
              "Chapter 5: Louis Pasteur",
              "Chapter 6: A New Day, A New Way",
              "Chapter 7: Sympathy",
              "Chapter 8: Chandraprabha Saikiani (Assamese social reformer biography)",
              "Grammar: Passive Voice, Reported Speech, Conditionals",
              "Writing: Formal Letters, Applications, Report Writing"
            ]
          },
          "Mathematics": {
            textbook: "Natun Ganit Ashtam / NCERT Mathematics Class 8",
            chapters: [
              "Chapter 1: Rational Numbers",
              "Chapter 2: Linear Equations in One Variable",
              "Chapter 3: Understanding Quadrilaterals",
              "Chapter 4: Data Handling",
              "Chapter 5: Squares and Square Roots",
              "Chapter 6: Cubes and Cube Roots",
              "Chapter 7: Comparing Quantities",
              "Chapter 8: Algebraic Expressions and Identities",
              "Chapter 9: Visualising Solid Shapes",
              "Chapter 10: Mensuration",
              "Chapter 11: Exponents and Powers",
              "Chapter 12: Direct and Inverse Proportions",
              "Chapter 13: Factorisation",
              "Chapter 14: Introduction to Graphs"
            ]
          },
          "Science": {
            textbook: "Amar Bijnan / NCERT Science Class 8",
            chapters: [
              "Crop Production and Management",
              "Microorganisms: Friend and Foe",
              "Synthetic Fibres and Plastics",
              "Materials: Metals and Non-Metals",
              "Coal and Petroleum",
              "Combustion and Flame",
              "Conservation of Plants and Animals",
              "Cell — Structure and Functions",
              "Reproduction in Animals",
              "Reaching the Age of Adolescence",
              "Force and Pressure",
              "Friction",
              "Sound",
              "Chemical Effects of Electric Current",
              "Some Natural Phenomena",
              "Light",
              "Stars and the Solar System",
              "Pollution of Air and Water"
            ]
          },
          "Social Science": {
            textbook: "SCERT Assam — highly localized (separate History, Geography, Civics books)",
            chapters: [
              // History
              "History: How, When and Where",
              "History: From Trade to Territory — The Company Establishes Power",
              "History: Ruling the Countryside",
              "History: Tribals, Dikus and the Vision of a Golden Age",
              "History: When People Rebel — 1857 and After",
              "History: Weavers, Iron Smelters and Factory Owners",
              "History: The Making of the National Movement: 1870s–1947",
              "History: India After Independence",
              // Geography
              "Geography: Resources",
              "Geography: Land, Soil, Water, Natural Vegetation and Wildlife Resources",
              "Geography: Mineral and Power Resources",
              "Geography: Agriculture",
              "Geography: Industries",
              "Geography: Human Resources",
              // Civics
              "Civics: The Indian Constitution",
              "Civics: Understanding Secularism",
              "Civics: Why Do We Need a Parliament?",
              "Civics: Understanding Laws",
              "Civics: Judiciary",
              "Civics: Understanding Marginalisation",
              "Civics: Public Facilities",
              "Civics: Law and Social Justice"
            ]
          }
        }
      },

      // ─────────────────────────────────────────────
      // CLASS 9
      // ─────────────────────────────────────────────
      "Class 9": {
        notes: "Governed by SEBA/ASSEB. Follows NCERT-based syllabus. Social Science includes Assam-specific history.",
        subjects: {
          "Assamese (MIL)": {
            textbook: "সাহিত্য চয়নিকা (Sahitya Chayanika) — SEBA Class 9",
            chapters: [
              "পাঠ ১: শিশুলীলা",
              "পাঠ ২: মানৱ বন্দনা কবিতা",
              "পাঠ ৩: গীত আৰু ছবি",
              "পাঠ ৪: প্ৰচণ্ড ধুমুহাই প্ৰশ্ন কৰিলে মোক",
              "পাঠ ৫: মোৰ দেশ",
              "পাঠ ৬: অন্যৰ প্ৰতি ব্যৱহাৰ",
              "পাঠ ৭: সময়",
              "পাঠ ৮: অন্ধবিশ্বাস আৰু কুসংস্কাৰ",
              "পাঠ ৯: ভাৰতৰ বৈচিত্ৰ্যৰ মাজত ঐক্য",
              "পাঠ ১০: পোহৰৰ বাটেৰে আগবঢ়া গাঁওখন",
              "পাঠ ১১: যুঁজ",
              "পাঠ ১২: লোকসংস্কৃতি",
              "পাঠ ১৩: হনুমন্ত লংকা দৰ্শন",
              "পাঠ ১৪: সুখ",
              "পাঠ ১৫: চোৰধৰা",
              "পাঠ ১৬: সন্মান",
              "ব্যাকৰণ: সন্ধি, সমাস, কাৰক, বাচ্য, উপসৰ্গ-প্ৰত্যয়",
              "ৰচনা: প্ৰবন্ধ, প্ৰতিবেদন, পত্ৰ"
            ]
          },
          "English": {
            textbook: "Beehive (Prose + Poetry) + Moments (Supplementary)",
            chapters: [
              // Beehive Prose
              "Beehive: The Fun They Had",
              "Beehive: The Sound of Music",
              "Beehive: The Little Girl",
              "Beehive: A Truly Beautiful Mind",
              "Beehive: The Snake and the Mirror",
              "Beehive: My Childhood",
              "Beehive: Packing",
              "Beehive: Reach for the Top",
              "Beehive: The Bond of Love",
              "Beehive: Kathmandu",
              "Beehive: If I Were You",
              // Beehive Poetry
              "Poetry: The Road Not Taken",
              "Poetry: Wind",
              "Poetry: Rain on the Roof",
              "Poetry: The Lake Isle of Innisfree",
              "Poetry: A Legend of the Northland",
              "Poetry: No Men Are Foreign",
              "Poetry: On Killing a Tree",
              "Poetry: The Snake Trying",
              // Moments (Supplementary)
              "Moments: The Lost Child",
              "Moments: The Adventure of Toto",
              "Moments: Iswaran the Storyteller",
              "Moments: In the Kingdom of Fools",
              "Moments: The Happy Prince",
              "Moments: Weathering the Storm in Ersama",
              "Moments: The Last Leaf",
              "Moments: A House is Not a Home",
              "Moments: The Accidental Tourist",
              "Moments: The Beggar",
              "Grammar and Writing Skills"
            ]
          },
          "General Mathematics": {
            textbook: "NCERT Mathematics Class 9",
            chapters: [
              "Chapter 1: Number System",
              "Chapter 2: Polynomials",
              "Chapter 3: Coordinate Geometry",
              "Chapter 4: Linear Equations in Two Variables",
              "Chapter 5: Introduction to Euclid's Geometry",
              "Chapter 6: Lines and Angles",
              "Chapter 7: Triangles",
              "Chapter 8: Quadrilaterals",
              "Chapter 9: Areas of Parallelograms and Triangles",
              "Chapter 10: Circles",
              "Chapter 11: Constructions",
              "Chapter 12: Heron's Formula",
              "Chapter 13: Surface Areas and Volumes",
              "Chapter 14: Statistics",
              "Chapter 15: Probability"
            ]
          },
          "General Science": {
            textbook: "NCERT Science Class 9",
            notes: "SEBA includes ALL 15 chapters. 'Periodic Classification' is ACTIVE for SEBA (unlike CBSE).",
            chapters: [
              "Chapter 1: Matter in Our Surroundings",
              "Chapter 2: Is Matter Around Us Pure?",
              "Chapter 3: Atoms and Molecules",
              "Chapter 4: Structure of the Atom",
              "Chapter 5: The Fundamental Unit of Life",
              "Chapter 6: Tissues",
              "Chapter 7: Diversity in Living Organisms",
              "Chapter 8: Motion",
              "Chapter 9: Force and Laws of Motion",
              "Chapter 10: Gravitation",
              "Chapter 11: Work and Energy",
              "Chapter 12: Sound",
              "Chapter 13: Why Do We Fall Ill?",
              "Chapter 14: Natural Resources",
              "Chapter 15: Improvement in Food Resources"
            ]
          },
          "Social Science": {
            textbook: "SEBA-prescribed books (NCERT base + Assam-specific chapters)",
            notes: "SEBA Social Science has unique Assam history chapters not found in CBSE.",
            chapters: [
              // History (SEBA-specific, Assam-focused)
              "History: Advent of Europeans into India",
              "History: Growth of Indian Nationalism",
              "History: The Moamoriya Rebellion",
              "History: Burmese Invasions of Assam",
              "History: Beginning of British Administration in Assam",
              // Geography
              "Geography: Changes of Earth's Surface",
              "Geography: Atmosphere — Structure, Pressure Belts and Wind System",
              "Geography: Geography of India",
              "Geography: Geography of Assam",
              // Political Science & Economics
              "Political Science: Political Parties in India",
              "Political Science: Types of Government",
              "Economics: Basic Concepts of Economics",
              "Economics: Basic Economic Problems"
            ]
          }
        }
      },

      // ─────────────────────────────────────────────
      // CLASS 10
      // ─────────────────────────────────────────────
      "Class 10": {
        notes: "HSLC Board Exam year. Theory 90 marks + Internal 10 marks per subject. 50% objective type questions.",
        subjects: {
          "Assamese (MIL)": {
            textbook: "সাহিত্য সুবাস / অসমীয়া সাহিত্য চয়নিকা (SEBA Class 10)",
            chapters: [
              "পাঠ ১: বৰগীত",
              "পাঠ ২: জিকিৰ",
              "পাঠ ৩: প্ৰশস্তি",
              "পাঠ ৪: মই অসমীয়া",
              "পাঠ ৫: দৃশ্যান্তৰ",
              "পাঠ ৬: ছাত্ৰ জীৱন আৰু সমাজ সেৱা",
              "পাঠ ৭: ভাৰতীয় সংস্কৃতি",
              "পাঠ ৮: অসমৰ জনগোষ্ঠীৰ গাঁথনি আৰু সংস্কৃতি",
              "পাঠ ৯: নিউটন আৰু সপ্তদশ শতিকাৰ বৌদ্ধিক বিপ্লৱ",
              "পাঠ ১০: ইন্টাৰনেটৰ তিতা মিঠা",
              "পাঠ ১১: অৰুণিমা সিনহা",
              "পাঠ ১২: অৰণ্য যাত্ৰা",
              "পাঠ ১৩: পাৰস্যত এভুমুকি",
              "পাঠ ১৪: মুক্তি মঙ্গল ভটিমা",
              "পাঠ ১৫: কানাইৰ চাতুৰী",
              "পাঠ ১৬: ৰামসিংহৰ অসম আক্ৰমণ",
              "পাঠ ১৭: বিষাদ যোগ",
              "ব্যাকৰণ: সন্ধি, সমাস, কাৰক, বাচ্য, অনুবাদ",
              "ৰচনা: প্ৰবন্ধ, প্ৰতিবেদন, আবেদনপত্ৰ"
            ]
          },
          "English (Second Language)": {
            textbook: "SEBA English Reader / First Flight (NCERT) + Footprints Without Feet",
            chapters: [
              // First Flight Prose
              "First Flight: A Letter to God",
              "First Flight: Nelson Mandela — Long Walk to Freedom",
              "First Flight: Two Stories about Flying",
              "First Flight: From the Diary of Anne Frank",
              "First Flight: Glimpses of India (Coorg, Tea from Assam, Bakers from Goa)",
              "First Flight: Mijbil the Otter",
              "First Flight: Madam Rides the Bus",
              "First Flight: The Sermon at Benares",
              "First Flight: The Proposal (Play)",
              // First Flight Poetry
              "Poetry: Dust of Snow",
              "Poetry: Fire and Ice",
              "Poetry: A Tiger in the Zoo",
              "Poetry: How to Tell Wild Animals",
              "Poetry: The Ball Poem",
              "Poetry: Amanda!",
              "Poetry: Animals",
              "Poetry: The Trees",
              "Poetry: The Tale of Custard the Dragon",
              "Poetry: For Anne Gregory",
              // Footprints Without Feet
              "Footprints: A Triumph of Surgery",
              "Footprints: The Thief's Story",
              "Footprints: The Midnight Visitor",
              "Footprints: A Question of Trust",
              "Footprints: Footprints Without Feet",
              "Footprints: The Making of a Scientist",
              "Footprints: The Necklace",
              "Footprints: Bholi",
              "Footprints: The Book That Saved the Earth",
              "Grammar and Writing Skills"
            ]
          },
          "General Mathematics": {
            textbook: "NCERT Mathematics Class 10",
            chapters: [
              "Chapter 1: Real Numbers",
              "Chapter 2: Polynomials",
              "Chapter 3: Pair of Linear Equations in Two Variables",
              "Chapter 4: Quadratic Equations",
              "Chapter 5: Arithmetic Progressions",
              "Chapter 6: Triangles",
              "Chapter 7: Coordinate Geometry",
              "Chapter 8: Introduction to Trigonometry",
              "Chapter 9: Some Applications of Trigonometry",
              "Chapter 10: Circles",
              "Chapter 11: Areas Related to Circles",
              "Chapter 12: Surface Areas and Volumes",
              "Chapter 13: Statistics",
              "Chapter 14: Probability"
            ]
          },
          "General Science": {
            textbook: "NCERT Science Class 10",
            notes: "SEBA retains Chapter 5 (Periodic Classification) which CBSE deleted in 2023 rationalization.",
            chapters: [
              "Chapter 1: Chemical Reactions and Equations",
              "Chapter 2: Acids, Bases and Salts",
              "Chapter 3: Metals and Non-Metals",
              "Chapter 4: Carbon and Its Compounds",
              "Chapter 5: Periodic Classification of Elements [ACTIVE in SEBA]",
              "Chapter 6: Life Processes",
              "Chapter 7: Control and Coordination",
              "Chapter 8: How do Organisms Reproduce?",
              "Chapter 9: Heredity and Evolution",
              "Chapter 10: Light — Reflection and Refraction",
              "Chapter 11: Human Eye and the Colourful World",
              "Chapter 12: Electricity",
              "Chapter 13: Magnetic Effects of Electric Current",
              "Chapter 14: Sources of Energy",
              "Chapter 15: Our Environment",
              "Chapter 16: Sustainable Management of Natural Resources"
            ]
          },
          "Social Science": {
            textbook: "SEBA Social Science (NCERT base + Assam-specific content)",
            chapters: [
              // History
              "History: The Rise of Nationalism in Europe",
              "History: Nationalism in India",
              "History: The Making of a Global World",
              "History: The Age of Industrialisation",
              "History: Print Culture and the Modern World",
              // Geography (Contemporary India II)
              "Geography: Resources and Development",
              "Geography: Forest and Wildlife Resources",
              "Geography: Water Resources",
              "Geography: Agriculture",
              "Geography: Minerals and Energy Resources",
              "Geography: Manufacturing Industries",
              "Geography: Lifelines of National Economy",
              // Economics
              "Economics: Development",
              "Economics: Sectors of the Indian Economy",
              "Economics: Money and Credit",
              "Economics: Globalisation and the Indian Economy",
              "Economics: Consumer Rights",
              // Civics (Democratic Politics II)
              "Civics: Power Sharing",
              "Civics: Federalism",
              "Civics: Democracy and Diversity",
              "Civics: Gender, Religion and Caste",
              "Civics: Popular Struggles and Movements",
              "Civics: Political Parties",
              "Civics: Outcomes of Democracy",
              "Civics: Challenges to Democracy"
            ]
          }
        }
      }
    } // end SEBA classes
  }, // end SEBA


  // ============================================================
  // BOARD 2: AHSEC (Assam Higher Secondary Education Council)
  // Classes 11–12 | Part of ASSEB Division-II (formerly AHSEC)
  // Three Streams: Science, Commerce, Arts/Humanities
  // Website: https://ahsec.assam.gov.in
  // ============================================================
  AHSEC: {
    fullName: "AHSEC — Assam Higher Secondary Education Council (ASSEB Division-II)",
    classesOffered: "11–12",
    examBoard: "HS (Higher Secondary) Final Exam",
    notes: [
      "Students choose a stream: Science, Commerce, or Arts/Humanities.",
      "Class 12 follows NCERT textbooks with rationalized syllabus (some chapters permanently deleted from 2023–24).",
      "Theory exams: 80 marks + Internal/Practical: 20 marks (most subjects).",
      "Important: Certain chapters have been permanently deleted from Class 12 NCERT. AI must NOT generate questions from deleted topics."
    ],

    classes: {

      "Class 11": {
        streams: {
          "Science": {
            subjects: {
              "Physics": {
                chapters: [
                  "Unit 1: Physical World and Measurement",
                  "Unit 2: Kinematics — Motion in a Straight Line, Motion in a Plane",
                  "Unit 3: Laws of Motion",
                  "Unit 4: Work, Energy and Power",
                  "Unit 5: Motion of a System of Particles and a Rigid Body",
                  "Unit 6: Gravitation",
                  "Unit 7: Properties of Bulk Matter (Mechanical Properties of Solids, Mechanical Properties of Fluids, Thermal Properties of Matter)",
                  "Unit 8: Thermodynamics",
                  "Unit 9: Kinetic Theory of Gases",
                  "Unit 10: Oscillations and Waves"
                ]
              },
              "Chemistry": {
                chapters: [
                  "Chapter 1: Some Basic Concepts of Chemistry",
                  "Chapter 2: Structure of Atom",
                  "Chapter 3: Classification of Elements and Periodicity in Properties",
                  "Chapter 4: Chemical Bonding and Molecular Structure",
                  "Chapter 5: Chemical Thermodynamics",
                  "Chapter 6: Equilibrium",
                  "Chapter 7: Redox Reactions",
                  "Chapter 8: Organic Chemistry — Some Basic Principles and Techniques",
                  "Chapter 9: Hydrocarbons"
                ]
              },
              "Biology": {
                chapters: [
                  // Botany
                  "Botany Unit 1: Diversity in the Living World",
                  "Botany Unit 2: Structural Organisation in Plants",
                  "Botany Unit 3: Cell — Structure and Function",
                  "Botany Unit 4: Plant Physiology",
                  // Zoology
                  "Zoology Unit 1: Diversity in the Living World",
                  "Zoology Unit 2: Structural Organisation in Animals",
                  "Zoology Unit 3: Human Physiology"
                ]
              },
              "Mathematics": {
                chapters: [
                  "Unit 1: Sets and Functions",
                  "Unit 2: Algebra",
                  "Unit 3: Coordinate Geometry",
                  "Unit 4: Calculus",
                  "Unit 5: Statistics and Probability"
                ]
              },
              "Computer Science / Computer Application": {
                chapters: [
                  "Computer Fundamentals",
                  "Introduction to C++",
                  "Programming Methodology",
                  "Programming in C++ (Functions, Arrays, Strings, File Handling)"
                ]
              }
            }
          },
          "Commerce": {
            subjects: {
              "Accountancy": {
                chapters: [
                  "Chapter 1: Introduction to Accounting",
                  "Chapter 2: Theory Base of Accounting",
                  "Chapter 3: Recording of Business Transactions",
                  "Chapter 4: Trial Balance and Rectification of Errors",
                  "Chapter 5: Depreciation, Provisions and Reserves",
                  "Chapter 6: Financial Statements"
                ]
              },
              "Business Studies": {
                chapters: [
                  "Chapter 1: Business, Trade and Commerce",
                  "Chapter 2: Forms of Business Organisation",
                  "Chapter 3: Public, Private and Global Enterprises",
                  "Chapter 4: Business Services",
                  "Chapter 5: Emerging Modes of Business",
                  "Chapter 6: Social Responsibilities of Business and Business Ethics",
                  "Chapter 7: Formation of a Company",
                  "Chapter 8: Sources of Business Finance",
                  "Chapter 9: MSME and Business Entrepreneurship",
                  "Chapter 10: Internal Trade",
                  "Chapter 11: International Business"
                ]
              },
              "Economics": {
                chapters: [
                  // Microeconomics
                  "Micro Ch 1: Introduction",
                  "Micro Ch 2: Consumer's Equilibrium and Demand",
                  "Micro Ch 3: Producer's Behaviour and Supply",
                  "Micro Ch 4: Market Equilibrium",
                  // Statistics for Economics
                  "Statistics Ch 1: Introduction",
                  "Statistics Ch 2: Collection, Organisation and Presentation of Data",
                  "Statistics Ch 3: Statistical Tools and Interpretation"
                ]
              },
              "Business Mathematics and Statistics": {
                chapters: [
                  "Metric System",
                  "Mensuration",
                  "Law of Indices",
                  "Co-ordinate Geometry",
                  "Statistical Investigation",
                  "Classification and Tabulation of Data",
                  "Diagrams and Graphs"
                ]
              },
              "Mathematics": {
                chapters: [
                  "Unit 1: Sets and Functions",
                  "Unit 2: Algebra",
                  "Unit 3: Coordinate Geometry",
                  "Unit 4: Calculus",
                  "Unit 5: Statistics and Probability"
                ]
              }
            }
          },
          "Arts/Humanities": {
            subjects: {
              "Political Science": {
                chapters: [
                  // Political Theory
                  "Political Theory: Introduction to Political Theory",
                  "Political Theory: Freedom",
                  "Political Theory: Equality",
                  "Political Theory: Social Justice",
                  "Political Theory: Rights",
                  "Political Theory: Citizenship",
                  "Political Theory: Nationalism",
                  "Political Theory: Secularism",
                  // Indian Constitution at Work
                  "Indian Constitution: Why and How?",
                  "Indian Constitution: Rights in the Indian Constitution",
                  "Indian Constitution: Election and Representation",
                  "Indian Constitution: Executive",
                  "Indian Constitution: Legislature",
                  "Indian Constitution: Judiciary",
                  "Indian Constitution: Federalism",
                  "Indian Constitution: Local Government",
                  "Indian Constitution: Constitution as a Living Document"
                ]
              },
              "Geography": {
                chapters: [
                  // Fundamentals of Physical Geography
                  "Physical Geography: Geography as a Discipline",
                  "Physical Geography: The Earth",
                  "Physical Geography: Landforms (Interior, Geomorphic Processes, Fluvial/Glacial/Arid Landforms)",
                  "Physical Geography: Climate",
                  "Physical Geography: Water (Oceans)",
                  "Physical Geography: Life on Earth (Biosphere)",
                  "Physical Geography: Map and Diagram",
                  // India: Physical Environment
                  "India Geography: Introduction",
                  "India Geography: Physiography",
                  "India Geography: Climate and Natural Vegetation",
                  "India Geography: Natural Hazards and Disasters"
                ]
              },
              "History": {
                chapters: [
                  "Themes in World History — Ancient Civilizations",
                  "An Empire Across Three Continents (Roman Empire)",
                  "Nomadic Empires",
                  "The Three Orders (Feudal Society)",
                  "Changing Cultural Traditions (Renaissance)",
                  "Confrontation of Cultures",
                  "The Industrial Revolution",
                  "Displacing Indigenous Peoples",
                  "The Making of Modern World",
                  "Displacing Indigenous Peoples"
                ]
              },
              "Psychology": {
                chapters: [
                  "Introduction to Psychology",
                  "Methods of Enquiry in Psychology",
                  "The Bases of Human Behaviour",
                  "Human Development",
                  "Sensory, Attentional and Perceptual Processes",
                  "Learning",
                  "Human Memory",
                  "Thinking",
                  "Motivation and Emotion"
                ]
              },
              "Assamese (MIL / Elective)": {
                chapters: [
                  "আধুনিক অসমীয়া সাহিত্যৰ বিকাশ",
                  "মধ্যযুগীয় অসমীয়া সাহিত্য",
                  "বৈষ্ণৱ সাহিত্য আৰু শংকৰদেৱ",
                  "আধুনিক কবিতা",
                  "আধুনিক চুটি গল্প",
                  "উপন্যাস পৰিচয়",
                  "প্ৰবন্ধ সাহিত্য",
                  "ব্যাকৰণ: অৰ্থতত্ত্ব, শব্দতত্ত্ব, বাক্যতত্ত্ব",
                  "ৰচনা: প্ৰবন্ধ, টোকা, সমালোচনা"
                ]
              }
            }
          }
        }
      }, // end Class 11

      "Class 12": {
        notes: "NCERT rationalized syllabus. Several chapters permanently deleted from 2023–24 session onwards. AI must NOT generate questions from deleted chapters.",
        streams: {
          "Science": {
            subjects: {
              "Physics": {
                deletedTopics: ["Energy stored in a Capacitor (derivations only)", "Logic Gates (certain exercises)", "Wavelength of laser (specific exercises)"],
                chapters: [
                  "Chapter 1: Electric Charges and Fields",
                  "Chapter 2: Electrostatic Potential and Capacitance",
                  "Chapter 3: Current Electricity",
                  "Chapter 4: Moving Charges and Magnetism",
                  "Chapter 5: Magnetism and Matter",
                  "Chapter 6: Electromagnetic Induction",
                  "Chapter 7: Alternating Current",
                  "Chapter 8: Electromagnetic Waves",
                  "Chapter 9: Ray Optics and Optical Instruments",
                  "Chapter 10: Wave Optics",
                  "Chapter 11: Dual Nature of Radiation and Matter",
                  "Chapter 12: Atoms",
                  "Chapter 13: Nuclei",
                  "Chapter 14: Semiconductor Electronics — Materials, Devices and Simple Circuits"
                ]
              },
              "Chemistry": {
                deletedChapters: ["The Solid State", "Surface Chemistry", "General Principles and Processes of Isolation of Elements", "The p-Block Elements", "Polymers", "Chemistry in Everyday Life"],
                chapters: [
                  "Chapter 1: Solutions",
                  "Chapter 2: Electrochemistry",
                  "Chapter 3: Chemical Kinetics",
                  "Chapter 4: d- and f-Block Elements",
                  "Chapter 5: Coordination Compounds",
                  "Chapter 6: Haloalkanes and Haloarenes",
                  "Chapter 7: Alcohols, Phenols and Ethers",
                  "Chapter 8: Aldehydes, Ketones and Carboxylic Acids",
                  "Chapter 9: Amines",
                  "Chapter 10: Biomolecules"
                ]
              },
              "Biology": {
                deletedChapters: ["Reproduction in Organisms", "Strategies for Enhancement in Food Production", "Environmental Issues"],
                chapters: [
                  "Chapter 1: Sexual Reproduction in Flowering Plants",
                  "Chapter 2: Human Reproduction",
                  "Chapter 3: Reproductive Health",
                  "Chapter 4: Principles of Inheritance and Variation",
                  "Chapter 5: Molecular Basis of Inheritance",
                  "Chapter 6: Evolution",
                  "Chapter 7: Human Health and Disease",
                  "Chapter 8: Microbes in Human Welfare",
                  "Chapter 9: Biotechnology — Principles and Processes",
                  "Chapter 10: Biotechnology and its Applications",
                  "Chapter 11: Organisms and Populations",
                  "Chapter 12: Ecosystem",
                  "Chapter 13: Biodiversity and Conservation"
                ]
              },
              "Mathematics": {
                chapters: [
                  "Chapter 1: Relations and Functions",
                  "Chapter 2: Inverse Trigonometric Functions",
                  "Chapter 3: Matrices",
                  "Chapter 4: Determinants",
                  "Chapter 5: Continuity and Differentiability",
                  "Chapter 6: Application of Derivatives",
                  "Chapter 7: Integrals",
                  "Chapter 8: Application of Integrals",
                  "Chapter 9: Differential Equations",
                  "Chapter 10: Vector Algebra",
                  "Chapter 11: Three Dimensional Geometry",
                  "Chapter 12: Linear Programming",
                  "Chapter 13: Probability"
                ]
              }
            }
          },
          "Commerce": {
            subjects: {
              "Accountancy": {
                deletedChapters: ["Accounting for Not-for-Profit Organisation", "Database Management System for Accounting"],
                chapters: [
                  "Chapter 1: Accounting for Partnership — Basic Concepts",
                  "Chapter 2: Change in Profit-Sharing Ratio Among Existing Partners",
                  "Chapter 3: Admission of a Partner",
                  "Chapter 4: Retirement and Death of a Partner",
                  "Chapter 5: Dissolution of Partnership Firm",
                  "Chapter 6: Accounting for Share Capital",
                  "Chapter 7: Issue and Redemption of Debentures",
                  "Chapter 8: Financial Statements of a Company",
                  "Chapter 9: Analysis of Financial Statements",
                  "Chapter 10: Accounting Ratios",
                  "Chapter 11: Cash Flow Statement"
                ]
              },
              "Business Studies": {
                deletedTopics: ["Financial Market (entire chapter)", "Techniques of controlling (specific)", "Qualities of a good leader (specific)"],
                chapters: [
                  "Chapter 1: Nature and Significance of Management",
                  "Chapter 2: Principles of Management",
                  "Chapter 3: Business Environment",
                  "Chapter 4: Planning",
                  "Chapter 5: Organising",
                  "Chapter 6: Staffing",
                  "Chapter 7: Directing",
                  "Chapter 8: Controlling",
                  "Chapter 9: Financial Management",
                  "Chapter 10: Marketing Management",
                  "Chapter 11: Consumer Protection"
                ]
              },
              "Economics": {
                deletedChapters: ["Non-Competitive Markets (from Microeconomics)", "Open Economy Macroeconomics (from Macroeconomics)"],
                chapters: [
                  // Microeconomics
                  "Micro Ch 1: Introduction",
                  "Micro Ch 2: Theory of Consumer Behaviour",
                  "Micro Ch 3: Production and Costs",
                  "Micro Ch 4: Theory of the Firm under Perfect Competition",
                  "Micro Ch 5: Market Equilibrium",
                  // Macroeconomics
                  "Macro Ch 1: Introduction to Macroeconomics",
                  "Macro Ch 2: National Income Accounting",
                  "Macro Ch 3: Money and Banking",
                  "Macro Ch 4: Determination of Income and Employment",
                  "Macro Ch 5: Government Budget and the Economy"
                ]
              }
            }
          },
          "Arts/Humanities": {
            subjects: {
              "History": {
                deletedChapters: ["Kings and Chronicles; The Mughal Courts", "Colonial Cities; Urbanisation, Planning, and Architecture", "Understanding Partition"],
                chapters: [
                  // Themes in Indian History I (Ancient)
                  "Bricks, Beads and Bones — The Harappan Civilisation",
                  "Kings, Farmers and Towns — Early States and Economies",
                  "Kinship, Caste and Class — Early Societies",
                  "Thinkers, Beliefs and Buildings — Cultural Developments",
                  // Themes in Indian History II (Medieval)
                  "Through the Eyes of Travellers",
                  "Bhakti-Sufi Traditions",
                  "An Imperial Capital: Vijayanagara",
                  "Peasants, Zamindars and the State",
                  // Themes in Indian History III (Modern)
                  "Rebels and the Raj: The Revolt of 1857 and Its Representations",
                  "Mahatma Gandhi and the Nationalist Movement",
                  "Framing the Constitution"
                ]
              },
              "Political Science": {
                deletedChapters: ["The Cold War Era", "US Hegemony in World Politics", "Rise of Popular Movements"],
                chapters: [
                  // Contemporary World Politics
                  "The End of Bipolarity",
                  "New Centres of Power",
                  "South Asia and Contemporary World",
                  "International Organisations",
                  "Security in the Contemporary World",
                  "Environment and Natural Resources",
                  "Globalisation",
                  // Politics in India Since Independence
                  "Challenges of Nation Building",
                  "Era of One-Party Dominance",
                  "Politics of Planned Development",
                  "India's External Relations",
                  "Challenges to and Restoration of the Congress System",
                  "Crisis of the Constitutional Order",
                  "Regional Aspirations",
                  "Recent Developments in Indian Politics"
                ]
              },
              "Geography": {
                deletedChapters: ["Population Composition", "Human Settlements (from Human Geography)", "Manufacturing Industries", "Migration: Types, Causes and Consequences"],
                chapters: [
                  // Human Geography
                  "Human Geography: Nature and Scope",
                  "People (Population distribution, density, growth)",
                  "Human Development",
                  "Primary Activities",
                  "Secondary Activities",
                  "Tertiary and Quaternary Activities",
                  "Transport and Communication",
                  "International Trade",
                  // India: People and Economy
                  "Population",
                  "Land Resources and Agriculture",
                  "Water Resources",
                  "Mineral and Energy Resources",
                  "Planning and Sustainable Development",
                  "Transport and Communication",
                  "International Trade",
                  "Geographical Perspective on Selected Issues"
                ]
              },
              "Assamese (Elective)": {
                chapters: [
                  "অসমীয়া সাহিত্যৰ ইতিহাস",
                  "প্ৰাচীন অসমীয়া সাহিত্য",
                  "শংকৰদেৱ আৰু মাধৱদেৱৰ সাহিত্য",
                  "আধুনিক কবিতা (বিস্তাৰিত)",
                  "আধুনিক উপন্যাস",
                  "আধুনিক নাটক",
                  "প্ৰবন্ধ সাহিত্য",
                  "ব্যাকৰণ: উচ্চতৰ ব্যাকৰণ",
                  "ভাষাতত্ত্বৰ পৰিচয়",
                  "ৰচনা: প্ৰবন্ধ, সমালোচনা, অনুবাদ"
                ]
              }
            }
          }
        }
      } // end Class 12

    } // end AHSEC classes
  }, // end AHSEC


  // ============================================================
  // BOARD 3: CBSE (Central Board of Secondary Education)
  // Classes 1–12 | National Board
  // Follows NCERT curriculum with 2025-26 rationalized syllabus
  // Website: https://cbse.gov.in
  // ============================================================
  CBSE: {
    fullName: "CBSE — Central Board of Secondary Education",
    classesOffered: "1–12",
    examBoard: "AISSE (Class 10) + AISSCE (Class 12)",
    notes: [
      "Follows NCERT textbooks. Medium: English (primary) and Hindi.",
      "Class 10: Theory 80 marks + Internal Assessment 20 marks.",
      "Class 12: Theory 70/80 marks + Practical/Internal 20/30 marks.",
      "CBSE 2025-26: Several chapters permanently deleted (see individual subjects).",
      "CBSE Science Class 10: Chapters 5 (Periodic Classification), 14 (Sources of Energy), 16 (Sustainable Management) are DELETED — do NOT generate questions from these for CBSE.",
      "CBSE Class 6 now uses new 2024 NCERT textbooks: Ganita Prakash, Curiosity, Exploring Society, Poorvi, Malhar."
    ],

    classes: {
      "Class 1": {
        subjects: {
          "English": {
            textbook: "NCERT Mridang (Class 1) / Marigold",
            chapters: [
              "Alphabet and Phonics (A–Z)",
              "Simple Words and Sentences",
              "Picture Reading",
              "Rhymes and Poems",
              "Greetings and Conversations",
              "My Family",
              "Animals Around Us"
            ]
          },
          "Hindi": {
            textbook: "NCERT रिमझिम भाग 1",
            chapters: [
              "झूला",
              "आम की कहानी",
              "आम की टोकरी",
              "पत्ते ही पत्ते",
              "पकौड़ी",
              "छुक-छुक गाड़ी",
              "रसोईघर",
              "चूहो! म्याऊँ सो रही है",
              "बंदर और गिलहरी",
              "पगड़ी",
              "पतंग",
              "गेंद-बल्ला",
              "बंदर गया खेत में भाग",
              "एक बुढ़िया",
              "मैं भी",
              "लालू और पीलू",
              "चकई के चकदुम",
              "छोटी का कमाल",
              "चार चने",
              "भगदड़",
              "हलीम चला चाँद पर",
              "हाथी चल्लम चल्लम",
              "सात पूँछ का चूहा"
            ]
          },
          "Mathematics": {
            textbook: "NCERT Math Magic 1 / Joyful Maths",
            chapters: [
              "Shapes and Space",
              "Numbers from One to Nine",
              "Addition",
              "Subtraction",
              "Numbers from Ten to Twenty",
              "Time",
              "Measurement",
              "Numbers from Twenty-one to Fifty",
              "Data Handling",
              "Patterns",
              "Numbers",
              "Money",
              "How Many"
            ]
          }
        }
      },

      "Class 2": {
        subjects: {
          "English": {
            textbook: "NCERT Mridang (Class 2) / Marigold 2",
            chapters: [
              "Unit 1: Fun with Friends — My Bicycle, Picture Reading",
              "Unit 2: Welcome to My World — It is Fun, Seeing without Eyes",
              "Unit 3: Going Places — Come Back Soon, Between Home and School, This is My Town",
              "Unit 4: Life Around Us — A Show of Clouds, My Name, The Crow, The Smart Monkey",
              "Unit 5: Harmony — Little Drops of Water, We are all Indians"
            ]
          },
          "Hindi": {
            textbook: "NCERT रिमझिम भाग 2",
            chapters: [
              "ऊँट चला",
              "भालू ने खेली फुटबॉल",
              "म्याऊँ म्याऊँ",
              "अधिक बलवान कौन?",
              "दोस्त की मदद",
              "बहुत हुआ",
              "मेरी किताब",
              "तितली और कली",
              "बुलबुल",
              "मीठी सारंगी",
              "टेसू राजा बीच बाजार",
              "बस के नीचे बाघ",
              "सूरज जल्दी आना जी",
              "नटखट चूहा",
              "एक्की-दोक्की"
            ]
          },
          "Mathematics": {
            textbook: "NCERT Math Magic 2 / Joyful Maths",
            chapters: [
              "A Day at the Beach (Number Sense)",
              "Shapes Around Us",
              "Fun with Numbers (Addition with carry)",
              "Subtraction with borrowing",
              "Multiplication (concept and tables)",
              "Division (introduction)",
              "Measurement (length, weight, capacity)",
              "Time",
              "Money",
              "Data Handling"
            ]
          }
        }
      },

      "Class 3": {
        subjects: {
          "English": {
            textbook: "NCERT Marigold 3 / My Book of English 3",
            chapters: [
              "Poem: Good Morning",
              "The Magic Garden",
              "Poem: Bird Talk",
              "Nina and the Baby Sparrows",
              "Poem: Little by Little",
              "The Enormous Turnip",
              "Poem: Sea Song",
              "A Little Fish Story",
              "Poem: The Balloon Man",
              "How Creatures Move",
              "Poem: Flying-Man",
              "The Story of the Road",
              "Poem: Work While You Work",
              "Granny Granny Please Comb My Hair",
              "The Lazy Frog",
              "Poem: I am the Music Man",
              "Little Tiger Big Tiger"
            ]
          },
          "Hindi": {
            textbook: "NCERT रिमझिम भाग 3",
            chapters: [
              "कक्कू",
              "शेखीबाज़ मक्खी",
              "चाँद वाली अम्मा",
              "मन करता है",
              "बहादुर बित्तो",
              "हमसे सब कहते",
              "टिपटिपवा",
              "बंदर बाँट",
              "अक्ल बड़ी या भैंस",
              "क्योंजीमल और कैसे कैसलिया",
              "मीरा बहन और बाघ",
              "जब मुझे साँप ने काटा",
              "मिर्च का मज़ा",
              "सबसे अच्छा पेड़"
            ]
          },
          "Mathematics": {
            textbook: "NCERT Math Magic 3",
            chapters: [
              "Where to Look From",
              "Fun with Numbers",
              "Give and Take",
              "Long and Short",
              "Shapes and Designs",
              "Fun with Give and Take",
              "Time Goes On",
              "Who is Heavier?",
              "How Many Times?",
              "Play with Patterns",
              "Jugs and Mugs",
              "Can We Share?",
              "Smart Charts",
              "Rupees and Paise"
            ]
          },
          "Environmental Studies (EVS)": {
            textbook: "NCERT Looking Around 3",
            chapters: [
              "Unit 1: Family and Friends — Poonam's Day Out, The Plant Fairy",
              "Unit 2: Food — What's Cooking, From the Window",
              "Unit 3: Shelter — A House Like This",
              "Unit 4: Water — Our First School",
              "Unit 5: Travel — Saying Without Speaking",
              "Unit 6: Things We Make and Do — Work We Do"
            ]
          }
        }
      },

      "Class 4": {
        subjects: {
          "English": {
            textbook: "NCERT Marigold 4 / Santoor (new NCERT)",
            chapters: [
              "Unit 1 My Land: Together We Can, The Tinkling Bells, Be Smart Be Safe",
              "Unit 2 My Beautiful World: One Thing at a Time, The Old Stag, Braille",
              "Unit 3 Fun with Games: Fit Body Fit Mind Fit Nation, The Lagori Champions, Hekko",
              "Unit 4 Up High: The Swing, A Journey to the Magical Mountains, Maheshwar"
            ]
          },
          "Hindi": {
            textbook: "NCERT रिमझिम भाग 4",
            chapters: [
              "मन के भोले-भाले बादल",
              "जैसा सवाल वैसा जवाब",
              "किरमिच की गेंद",
              "पापा जब बच्चे थे",
              "दोस्त की पोशाक",
              "नाव बनाओ नाव बनाओ",
              "दान का हिसाब",
              "कौन?",
              "स्वतंत्रता की ओर",
              "थप्प रोटी थप्प दाल",
              "पढ़क्कू की सूझ",
              "सुनीता की पहिया कुर्सी",
              "हुदहुद",
              "मुफ़्त ही मुफ़्त"
            ]
          },
          "Mathematics": {
            textbook: "NCERT Math Magic 4",
            chapters: [
              "Building with Bricks",
              "Long and Short",
              "A Trip to Bhopal",
              "Tick-Tick-Tick",
              "The Way the World Looks",
              "The Junk Seller",
              "Jugs and Mugs",
              "Carts and Wheels",
              "Halves and Quarters",
              "Play with Patterns",
              "Tables and Shares",
              "How Heavy? How Light?",
              "Fields and Fences",
              "Smart Charts"
            ]
          },
          "Environmental Studies (EVS)": {
            textbook: "NCERT Looking Around 4",
            chapters: [
              "Going to School",
              "Ear to Ear",
              "A Day with Nandu",
              "The Story of Amrita",
              "Anita and the Honeybees",
              "Omana's Journey",
              "From the Window",
              "Reaching Grandmother's House",
              "Changing Families",
              "Hu Tu Tu, Hu Tu Tu",
              "The Valley of Flowers",
              "Changing Times",
              "A River's Tale",
              "Basva's Farm",
              "From Market to Home",
              "A Busy Month",
              "Nandita in Mumbai",
              "Too Much Water, Too Little Water",
              "Abdul in the Garden",
              "Eating Together",
              "Food and Fun",
              "The World in my Home",
              "Pochampalli",
              "Home and Abroad"
            ]
          }
        }
      },

      "Class 5": {
        subjects: {
          "English": {
            textbook: "NCERT Marigold 5 / Santoor Class 5",
            chapters: [
              "Unit 1 Let's Have Fun: Papa's Spectacles, Gone with the Scooter",
              "Unit 2 My Colourful World: The Rainbow, The Wise Parrot",
              "Unit 3 Water: The Frog, What a Tank!",
              "Unit 4 Ups and Downs: Gilli Danda, The Decision of the Panchayat",
              "Unit 5 Work is Worship: Vocation, Glass Bangles"
            ]
          },
          "Hindi": {
            textbook: "NCERT रिमझिम भाग 5",
            chapters: [
              "राख की रस्सी",
              "फ़सलों के त्योहार",
              "खिलौनेवाला",
              "नन्हा फ़नकार",
              "जहाँ चाह वहाँ राह",
              "चिट्ठी का सफ़र",
              "डाकिए की कहानी, कँवरसिंह की जुबानी",
              "वे दिन भी क्या दिन थे",
              "एक माँ की बेबसी",
              "एक दिन की बादशाहत",
              "चावल की रोटियाँ",
              "गुरु और चेला",
              "स्वामी की दादी",
              "बाघ आया उस रात",
              "बिशन की दिलेरी",
              "पानी रे पानी",
              "छोटी-सी हमारी नदी",
              "चुनौती हिमालय की"
            ]
          },
          "Mathematics": {
            textbook: "NCERT Math Magic 5",
            chapters: [
              "The Fish Tale",
              "Shapes and Angles",
              "How Many Squares?",
              "Parts and Wholes",
              "Does it Look the Same?",
              "Be My Multiple, I'll be Your Factor",
              "Can You See the Pattern?",
              "Mapping Your Way",
              "Boxes and Sketches",
              "Tenths and Hundredths",
              "Area and its Boundary",
              "Smart Charts",
              "Ways to Multiply and Divide",
              "How Big? How Heavy?"
            ]
          },
          "Environmental Studies (EVS)": {
            textbook: "NCERT Looking Around 5",
            chapters: [
              "Super Senses",
              "A Snake Charmer's Story",
              "From Tasting to Digesting",
              "Mangoes Round the Year",
              "Seeds and Seeds",
              "Every Drop Counts",
              "Experiments with Water",
              "A Treat for Mosquitoes",
              "Up You Go!",
              "Walls Tell Stories",
              "Sunita in Space",
              "What if it Finishes?",
              "A Shelter so High!",
              "When the Earth Shook!",
              "Blow Hot, Blow Cold",
              "Who Will Do this Work?",
              "Across the Wall",
              "No Place for Us?",
              "A Seed Tells a Farmer's Story",
              "Whose Forests?",
              "Like Father, Like Daughter",
              "On the Move Again"
            ]
          }
        }
      },

      "Class 6": {
        notes: "New 2024 NCERT textbooks in use: Ganita Prakash (Maths), Curiosity (Science), Exploring Society (SS), Poorvi (English), Malhar (Hindi).",
        subjects: {
          "English": {
            textbook: "NCERT Poorvi (Class 6) — new 2024 book",
            chapters: [
              "Poorvi: A Bottle of Dew",
              "Poorvi: The Kite",
              "Poorvi: A Day in the Life of a Farmer",
              "Poorvi: Neem Baba",
              "Poorvi: Ritu's Letter",
              "Poorvi: The Giving Tree",
              "Poorvi: A Journey through the Forest",
              "Grammar: Nouns, Pronouns, Verbs, Adjectives, Tenses",
              "Writing: Letter, Paragraph, Short Composition"
            ]
          },
          "Hindi": {
            textbook: "NCERT मल्हार (Malhar) Class 6 — new 2024 book",
            chapters: [
              "वर्षा का पहला दिन",
              "नीम का पेड़",
              "कठपुतली",
              "टिकट अलबम",
              "झाँसी की रानी",
              "पर्वत प्रदेश में पावस",
              "साथी हाथ बढ़ाना",
              "ऐसे-ऐसे",
              "यात्रा की तैयारी",
              "जो देखकर भी नहीं देखते",
              "व्याकरण: संज्ञा, सर्वनाम, विशेषण, क्रिया",
              "रचना: पत्र-लेखन, अनुच्छेद"
            ]
          },
          "Mathematics": {
            textbook: "NCERT Ganita Prakash (Class 6) — new 2024 book",
            chapters: [
              "Chapter 1: Patterns in Mathematics",
              "Chapter 2: Lines and Angles",
              "Chapter 3: Number Play",
              "Chapter 4: Data Handling and Presentation",
              "Chapter 5: Prime Time (Factors, Multiples, Primes)",
              "Chapter 6: Perimeter and Area",
              "Chapter 7: Fractions",
              "Chapter 8: Playing with Constructions",
              "Chapter 9: Symmetry",
              "Chapter 10: The Other Side of Zero (Integers)"
            ]
          },
          "Science": {
            textbook: "NCERT Curiosity (Class 6) — new 2024 book",
            chapters: [
              "Chapter 1: The Wonderful World of Science",
              "Chapter 2: Diversity in the Living World",
              "Chapter 3: Mindful Eating: A Path to a Healthy Body",
              "Chapter 4: Exploring Magnets",
              "Chapter 5: Measurement of Length and Motion",
              "Chapter 6: Materials Around Us",
              "Chapter 7: Temperature and its Measurement",
              "Chapter 8: A Journey Through States of Water",
              "Chapter 9: Methods of Separation in Everyday Life",
              "Chapter 10: Living Creatures: Exploring their Characteristics",
              "Chapter 11: Nature's Treasures",
              "Chapter 12: Beyond Earth"
            ]
          },
          "Social Science": {
            textbook: "NCERT Exploring Society: India and Beyond (Class 6) — new 2024 book",
            chapters: [
              "Chapter 1: Locating Places on the Earth",
              "Chapter 2: Oceans and Continents",
              "Chapter 3: Landforms and Life",
              "Chapter 4: Timeline and Sources of History",
              "Chapter 5: India, That Is Bharat",
              "Chapter 6: The Beginnings of Indian Civilisation",
              "Chapter 7: India's Cultural Roots",
              "Chapter 8: Unity in Diversity, or 'Many in the One'",
              "Chapter 9: Family and Community",
              "Chapter 10: Grassroots Democracy — Part 1: Governance",
              "Chapter 11: Grassroots Democracy — Part 2: Local Government in Rural Areas",
              "Chapter 12: Grassroots Democracy — Part 3: Local Government in Urban Areas",
              "Chapter 13: The Value of Work",
              "Chapter 14: Economic Activities Around Us"
            ]
          }
        }
      },

      "Class 7": {
        subjects: {
          "English": {
            textbook: "NCERT Honeycomb + An Alien Hand (Supplementary)",
            chapters: [
              "Honeycomb: Three Questions",
              "Honeycomb: A Gift of Chappals",
              "Honeycomb: Gopal and the Hilsa Fish",
              "Honeycomb: The Ashes That Made Trees Bloom",
              "Honeycomb: Quality",
              "Honeycomb: Expert Detectives",
              "Honeycomb: The Invention of Vita-Wonk",
              "Honeycomb: Fire: Friend and Foe",
              "Honeycomb: A Bicycle in Good Repair",
              "Honeycomb: The Story of Cricket",
              "An Alien Hand: The Tiny Teacher",
              "An Alien Hand: Bringing Up Kari",
              "An Alien Hand: The Desert",
              "An Alien Hand: The Cop and the Anthem",
              "An Alien Hand: Golu Grows a Nose",
              "An Alien Hand: I Want Something in a Cage",
              "An Alien Hand: Chandni",
              "An Alien Hand: The Bear Story",
              "An Alien Hand: A Tiger in the House",
              "An Alien Hand: An Alien Hand",
              "Grammar and Writing Skills"
            ]
          },
          "Hindi": {
            textbook: "NCERT वसंत भाग 2 + महाभारत (supplementary)",
            chapters: [
              "वसंत: हम पंछी उन्मुक्त गगन के",
              "वसंत: दादी माँ",
              "वसंत: हिमालय की बेटियाँ",
              "वसंत: कठपुतली",
              "वसंत: मीठाईवाला",
              "वसंत: रक्त और हमारा शरीर",
              "वसंत: पापा खो गए",
              "वसंत: शाम — एक किसान",
              "वसंत: चिड़िया की बच्ची",
              "वसंत: अपूर्व अनुभव",
              "वसंत: रहीम के दोहे",
              "वसंत: कंचा",
              "वसंत: एक तिनका",
              "वसंत: खानपान की बदलती तसवीर",
              "वसंत: नीलकंठ",
              "वसंत: भोर और बरखा",
              "वसंत: वीर कुँवर सिंह",
              "वसंत: संघर्ष के कारण मैं तुनुकमिज़ाज हो गया: धनराज",
              "वसंत: आश्रम का अनुमानित व्यय",
              "वसंत: विप्लव-गायन"
            ]
          },
          "Mathematics": {
            textbook: "NCERT Mathematics Class 7",
            chapters: [
              "Integers",
              "Fractions and Decimals",
              "Data Handling",
              "Simple Equations",
              "Lines and Angles",
              "The Triangle and its Properties",
              "Congruence of Triangles",
              "Comparing Quantities",
              "Rational Numbers",
              "Practical Geometry",
              "Perimeter and Area",
              "Algebraic Expressions",
              "Exponents and Powers",
              "Symmetry",
              "Visualising Solid Shapes"
            ]
          },
          "Science": {
            textbook: "NCERT Science Class 7",
            chapters: [
              "Nutrition in Plants",
              "Nutrition in Animals",
              "Fibre to Fabric",
              "Heat",
              "Acids, Bases and Salts",
              "Physical and Chemical Changes",
              "Weather, Climate and Adaptations of Animals to Climate",
              "Winds, Storms and Cyclones",
              "Soil",
              "Respiration in Organisms",
              "Transportation in Animals and Plants",
              "Reproduction in Plants",
              "Motion and Time",
              "Electric Current and its Effects",
              "Light",
              "Water: A Precious Resource",
              "Forests: Our Lifeline",
              "Wastewater Story"
            ]
          },
          "Social Science": {
            textbook: "NCERT Our Pasts II (History) + Our Environment (Geography) + Social and Political Life II (Civics)",
            chapters: [
              "History: Tracing Changes Through a Thousand Years",
              "History: New Kings and Kingdoms",
              "History: The Delhi Sultans",
              "History: The Mughal Empire",
              "History: Rulers and Buildings",
              "History: Towns, Traders and Craftspersons",
              "History: Tribes, Nomads and Settled Communities",
              "History: Devotional Paths to the Divine",
              "History: The Making of Regional Cultures",
              "History: Eighteenth-Century Political Formations",
              "Geography: Environment",
              "Geography: Inside Our Earth",
              "Geography: Our Changing Earth",
              "Geography: Air",
              "Geography: Water",
              "Geography: Natural Vegetation and Wildlife",
              "Geography: Human Environment — Settlement, Transport and Communication",
              "Geography: Human-Environment Interactions — Tropical and Subtropical Regions",
              "Geography: Life in the Temperate Grasslands",
              "Geography: Life in the Deserts",
              "Civics: On Equality",
              "Civics: Role of the Government in Health",
              "Civics: How the State Government Works",
              "Civics: Growing Up as Boys and Girls",
              "Civics: Women Change the World",
              "Civics: Understanding Media",
              "Civics: Markets Around Us",
              "Civics: A Shirt in the Market",
              "Civics: Struggles for Equality"
            ]
          }
        }
      },

      "Class 8": {
        subjects: {
          "English": {
            textbook: "NCERT Honeydew + It So Happened (Supplementary)",
            notes: "CBSE Class 8 English uses Honeydew and It So Happened (new 2024 edition is 'Poorvi' in some schools — confirm).",
            chapters: [
              "Honeydew: The Best Christmas Present in the World",
              "Honeydew: The Tsunami",
              "Honeydew: Glimpses of the Past",
              "Honeydew: Bepin Choudhury's Lapse of Memory",
              "Honeydew: The Summit Within",
              "Honeydew: This is Jody's Fawn",
              "Honeydew: A Visit to Cambridge",
              "Honeydew: A Short Monsoon Diary",
              "Honeydew: The Great Stone Face I and II",
              "It So Happened: How the Camel Got His Hump",
              "It So Happened: Children at Work",
              "It So Happened: The Selfish Giant",
              "It So Happened: The Treasure Within",
              "It So Happened: Princess September",
              "It So Happened: The Fight",
              "It So Happened: The Open Window",
              "It So Happened: Jalebis",
              "It So Happened: The Wit That Won Hearts / New NCERT chapters",
              "Grammar and Writing Skills"
            ]
          },
          "Hindi": {
            textbook: "NCERT वसंत भाग 3 + भारत की खोज",
            chapters: [
              "वसंत: ध्वनि",
              "वसंत: लाख की चूड़ियाँ",
              "वसंत: बस की यात्रा",
              "वसंत: दीवानों की हस्ती",
              "वसंत: चिट्ठियों की अनूठी दुनिया",
              "वसंत: भगवान के डाकिए",
              "वसंत: क्या निराश हुआ जाए",
              "वसंत: यह सबसे कठिन समय नहीं",
              "वसंत: कबीर की साखियाँ",
              "वसंत: कामचोर",
              "वसंत: जब सिनेमा ने बोलना सीखा",
              "वसंत: सुदामा चरित",
              "वसंत: जहाँ पहिया है",
              "वसंत: अकबरी लोटा",
              "वसंत: सूरदास के पद",
              "वसंत: पानी की कहानी",
              "वसंत: बाज और साँप",
              "वसंत: टोपी"
            ]
          },
          "Mathematics": {
            textbook: "NCERT Mathematics Class 8",
            chapters: [
              "Chapter 1: Rational Numbers",
              "Chapter 2: Linear Equations in One Variable",
              "Chapter 3: Understanding Quadrilaterals",
              "Chapter 4: Data Handling",
              "Chapter 5: Squares and Square Roots",
              "Chapter 6: Cubes and Cube Roots",
              "Chapter 7: Comparing Quantities",
              "Chapter 8: Algebraic Expressions and Identities",
              "Chapter 9: Visualising Solid Shapes",
              "Chapter 10: Mensuration",
              "Chapter 11: Exponents and Powers",
              "Chapter 12: Direct and Inverse Proportions",
              "Chapter 13: Factorisation",
              "Chapter 14: Introduction to Graphs"
            ]
          },
          "Science": {
            textbook: "NCERT Science Class 8",
            chapters: [
              "Crop Production and Management",
              "Microorganisms: Friend and Foe",
              "Synthetic Fibres and Plastics",
              "Materials: Metals and Non-Metals",
              "Coal and Petroleum",
              "Combustion and Flame",
              "Conservation of Plants and Animals",
              "Cell — Structure and Functions",
              "Reproduction in Animals",
              "Reaching the Age of Adolescence",
              "Force and Pressure",
              "Friction",
              "Sound",
              "Chemical Effects of Electric Current",
              "Some Natural Phenomena",
              "Light",
              "Stars and the Solar System",
              "Pollution of Air and Water"
            ]
          },
          "Social Science": {
            textbook: "NCERT Our Pasts III (History) + Resources and Development (Geography) + Social and Political Life III (Civics)",
            chapters: [
              "History: How, When and Where",
              "History: From Trade to Territory",
              "History: Ruling the Countryside",
              "History: Tribals, Dikus and the Vision of a Golden Age",
              "History: When People Rebel",
              "History: Colonialism and the City",
              "History: Weavers, Iron Smelters and Factory Owners",
              "History: Civilising the 'Native', Educating the Nation",
              "History: Women, Caste and Reform",
              "History: The Changing World of Visual Arts",
              "History: The Making of the National Movement: 1870s–1947",
              "History: India After Independence",
              "Geography: Resources",
              "Geography: Land, Soil, Water, Natural Vegetation and Wildlife Resources",
              "Geography: Mineral and Power Resources",
              "Geography: Agriculture",
              "Geography: Industries",
              "Geography: Human Resources",
              "Civics: The Indian Constitution",
              "Civics: Understanding Secularism",
              "Civics: Why Do We Need a Parliament?",
              "Civics: Understanding Laws",
              "Civics: Judiciary",
              "Civics: Understanding Our Criminal Justice System",
              "Civics: Understanding Marginalisation",
              "Civics: Confronting Marginalisation",
              "Civics: Public Facilities",
              "Civics: Law and Social Justice"
            ]
          }
        }
      },

      "Class 9": {
        subjects: {
          "English (Language and Literature)": {
            textbook: "NCERT Beehive + Moments",
            chapters: [
              "Beehive Prose: The Fun They Had",
              "Beehive Prose: The Sound of Music",
              "Beehive Prose: The Little Girl",
              "Beehive Prose: A Truly Beautiful Mind",
              "Beehive Prose: The Snake and the Mirror",
              "Beehive Prose: My Childhood",
              "Beehive Prose: Packing",
              "Beehive Prose: Reach for the Top",
              "Beehive Prose: The Bond of Love",
              "Beehive Prose: Kathmandu",
              "Beehive Prose: If I Were You",
              "Beehive Poetry: The Road Not Taken",
              "Beehive Poetry: Wind",
              "Beehive Poetry: Rain on the Roof",
              "Beehive Poetry: The Lake Isle of Innisfree",
              "Beehive Poetry: A Legend of the Northland",
              "Beehive Poetry: No Men Are Foreign",
              "Beehive Poetry: On Killing a Tree",
              "Beehive Poetry: The Snake Trying",
              "Moments: The Lost Child",
              "Moments: The Adventure of Toto",
              "Moments: Iswaran the Storyteller",
              "Moments: In the Kingdom of Fools",
              "Moments: The Happy Prince",
              "Moments: Weathering the Storm in Ersama",
              "Moments: The Last Leaf",
              "Moments: A House is Not a Home",
              "Moments: The Accidental Tourist",
              "Moments: The Beggar",
              "Grammar and Writing Skills"
            ]
          },
          "Hindi (Course A — Kshitij + Kritika)": {
            textbook: "क्षितिज भाग 1 + कृतिका भाग 1",
            notes: "Course A (for students who opted Hindi as Language A). Course B uses Sparsh + Sanchayan.",
            chapters: [
              // Kshitij - Gadya Khand (Prose)
              "क्षितिज गद्य: 1. दो बैलों की कथा",
              "क्षितिज गद्य: 2. ल्हासा की ओर",
              "क्षितिज गद्य: 3. उपभोक्तावाद की संस्कृति",
              "क्षितिज गद्य: 4. साँवले सपनों की याद",
              "क्षितिज गद्य: 5. नाना साहब की पुत्री देवी मैना को भस्म कर दिया गया",
              "क्षितिज गद्य: 6. प्रेमचंद के फटे जूते",
              "क्षितिज गद्य: 7. मेरे बचपन के दिन",
              // Kshitij - Kavya Khand (Poetry)
              "क्षितिज काव्य: 9. साखियाँ एवं सबद (कबीर)",
              "क्षितिज काव्य: 10. वाख (ललद्यद)",
              "क्षितिज काव्य: 11. सवैये (रसखान)",
              "क्षितिज काव्य: 12. कैदी और कोकिला",
              "क्षितिज काव्य: 13. ग्राम श्री",
              "क्षितिज काव्य: 15. मेघ आए",
              "क्षितिज काव्य: 16. यमराज की दिशा",
              "क्षितिज काव्य: 17. बच्चे काम पर जा रहे हैं",
              // Kritika
              "कृतिका: 1. इस जल प्रलय में",
              "कृतिका: 2. मेरे संग की औरतें",
              "कृतिका: 3. रीढ़ की हड्डी"
            ]
          },
          "Hindi (Course B — Sparsh + Sanchayan)": {
            textbook: "स्पर्श भाग 1 + संचयन भाग 1",
            chapters: [
              // Sparsh - Gadya
              "स्पर्श गद्य: 1. दुःख का अधिकार (यशपाल)",
              "स्पर्श गद्य: 2. एवरेस्ट: मेरी शिखर यात्रा (बचेंद्री पाल)",
              "स्पर्श गद्य: 3. तुम कब जाओगे, अतिथि",
              "स्पर्श गद्य: 4. वैज्ञानिक चेतना के वाहक चंद्रशेखर वेंकट रामन",
              "स्पर्श गद्य: 5. धर्म की आड़",
              // Sparsh - Kavya
              "स्पर्श काव्य: 9. अब कैसे छूटे राम नाम (रैदास)",
              "स्पर्श काव्य: 10. दोहे (रहीम)",
              "स्पर्श काव्य: 11. एक फूल की चाह",
              "स्पर्श काव्य: 12. गीत-अगीत",
              "स्पर्श काव्य: 13. अग्नि पथ",
              // Sanchayan
              "संचयन: 1. गिल्लू (महादेवी वर्मा)",
              "संचयन: 2. स्मृति (श्रीराम शर्मा)",
              "संचयन: 3. कल्लू कुम्हार की उनाकोटी",
              "संचयन: 4. मेरा छोटा-सा निजी पुस्तकालय"
            ]
          },
          "Mathematics (Standard)": {
            textbook: "NCERT Mathematics Class 9",
            chapters: [
              "Chapter 1: Number System",
              "Chapter 2: Polynomials",
              "Chapter 3: Coordinate Geometry",
              "Chapter 4: Linear Equations in Two Variables",
              "Chapter 5: Introduction to Euclid's Geometry",
              "Chapter 6: Lines and Angles",
              "Chapter 7: Triangles",
              "Chapter 8: Quadrilaterals",
              "Chapter 9: Areas of Parallelograms and Triangles",
              "Chapter 10: Circles",
              "Chapter 11: Constructions",
              "Chapter 12: Heron's Formula",
              "Chapter 13: Surface Areas and Volumes",
              "Chapter 14: Statistics",
              "Chapter 15: Probability"
            ]
          },
          "Science": {
            textbook: "NCERT Science Class 9",
            chapters: [
              "Chapter 1: Matter in Our Surroundings",
              "Chapter 2: Is Matter Around Us Pure?",
              "Chapter 3: Atoms and Molecules",
              "Chapter 4: Structure of the Atom",
              "Chapter 5: The Fundamental Unit of Life",
              "Chapter 6: Tissues",
              "Chapter 7: Diversity in Living Organisms",
              "Chapter 8: Motion",
              "Chapter 9: Force and Laws of Motion",
              "Chapter 10: Gravitation",
              "Chapter 11: Work and Energy",
              "Chapter 12: Sound",
              "Chapter 13: Why Do We Fall Ill?",
              "Chapter 14: Natural Resources",
              "Chapter 15: Improvement in Food Resources"
            ]
          },
          "Social Science": {
            textbook: "NCERT India and Contemporary World I + Contemporary India I + Democratic Politics I + Economics",
            chapters: [
              "History: The French Revolution",
              "History: Socialism in Europe and the Russian Revolution",
              "History: Nazism and the Rise of Hitler",
              "History: Forest Society and Colonialism",
              "History: Pastoralists in the Modern World",
              "Geography: India — Size and Location",
              "Geography: Physical Features of India",
              "Geography: Drainage",
              "Geography: Climate",
              "Geography: Natural Vegetation and Wildlife",
              "Geography: Population",
              "Civics: What is Democracy? Why Democracy?",
              "Civics: Constitutional Design",
              "Civics: Electoral Politics",
              "Civics: Working of Institutions",
              "Civics: Democratic Rights",
              "Economics: The Story of Village Palampur",
              "Economics: People as Resource",
              "Economics: Poverty as a Challenge",
              "Economics: Food Security in India"
            ]
          }
        }
      },

      "Class 10": {
        notes: "AISSE Board Exam. Theory 80 marks + Internal 20 marks. Rationalized syllabus in effect.",
        subjects: {
          "English (Language and Literature)": {
            textbook: "NCERT First Flight + Footprints Without Feet + Words and Expressions (workbook)",
            chapters: [
              "First Flight Prose: A Letter to God",
              "First Flight Prose: Nelson Mandela — Long Walk to Freedom",
              "First Flight Prose: Two Stories about Flying",
              "First Flight Prose: From the Diary of Anne Frank",
              "First Flight Prose: Glimpses of India (Coorg, Tea from Assam, Bakers from Goa)",
              "First Flight Prose: Mijbil the Otter",
              "First Flight Prose: Madam Rides the Bus",
              "First Flight Prose: The Sermon at Benares",
              "First Flight Prose: The Proposal (Play)",
              "First Flight Poetry: Dust of Snow",
              "First Flight Poetry: Fire and Ice",
              "First Flight Poetry: A Tiger in the Zoo",
              "First Flight Poetry: How to Tell Wild Animals",
              "First Flight Poetry: The Ball Poem",
              "First Flight Poetry: Amanda!",
              "First Flight Poetry: Animals",
              "First Flight Poetry: The Trees",
              "First Flight Poetry: The Tale of Custard the Dragon",
              "First Flight Poetry: For Anne Gregory",
              "Footprints: A Triumph of Surgery",
              "Footprints: The Thief's Story",
              "Footprints: The Midnight Visitor",
              "Footprints: A Question of Trust",
              "Footprints: Footprints Without Feet",
              "Footprints: The Making of a Scientist",
              "Footprints: The Necklace",
              "Footprints: Bholi",
              "Footprints: The Book That Saved the Earth",
              "Grammar and Writing Skills"
            ]
          },
          "Hindi (Course A — Kshitij + Kritika)": {
            textbook: "क्षितिज भाग 2 + कृतिका भाग 2",
            chapters: [
              // Kshitij Gadya (Prose)
              "क्षितिज गद्य: 1. नेताजी का चश्मा",
              "क्षितिज गद्य: 2. बालगोबिन भगत",
              "क्षितिज गद्य: 3. लखनवी अंदाज़",
              "क्षितिज गद्य: 4. एक कहानी यह भी",
              "क्षितिज गद्य: 5. नौबतखाने में इबादत",
              "क्षितिज गद्य: 6. संस्कृति",
              // Kshitij Kavya (Poetry)
              "क्षितिज काव्य: 7. पद (सूरदास)",
              "क्षितिज काव्य: 8. राम-लक्ष्मण-परशुराम संवाद (तुलसीदास)",
              "क्षितिज काव्य: 9. सवैया और कवित्त (देव)",
              "क्षितिज काव्य: 10. आत्मकथ्य (जयशंकर प्रसाद)",
              "क्षितिज काव्य: 11. उत्साह और अट नहीं रही (निराला)",
              "क्षितिज काव्य: 12. यह दंतुरित मुस्कान और फसल (नागार्जुन)",
              "क्षितिज काव्य: 13. छाया मत छूना (गिरिजाकुमार माथुर)",
              "क्षितिज काव्य: 14. कन्यादान (ऋतुराज)",
              "क्षितिज काव्य: 15. संगतकार (मंगलेश डबराल)",
              // Kritika
              "कृतिका: 1. माता का आँचल",
              "कृतिका: 2. जॉर्ज पंचम की नाक",
              "कृतिका: 3. साना-साना हाथ जोड़ि",
              "कृतिका: 4. एही ठैयाँ झुलनी हेरानी हो रामा",
              "कृतिका: 5. मैं क्यों लिखता हूँ?"
            ]
          },
          "Hindi (Course B — Sparsh + Sanchayan)": {
            textbook: "स्पर्श भाग 2 + संचयन भाग 2",
            chapters: [
              // Sparsh Kavya
              "स्पर्श काव्य: 1. साखी (कबीर)",
              "स्पर्श काव्य: 2. पद (मीरा)",
              "स्पर्श काव्य: 3. दोहे (बिहारी)",
              "स्पर्श काव्य: 4. मनुष्यता (मैथिलीशरण गुप्त)",
              "स्पर्श काव्य: 5. पर्वत प्रदेश में पावस (सुमित्रानंदन पंत)",
              "स्पर्श काव्य: 6. मधुर-मधुर मेरे दीपक जल (महादेवी वर्मा)",
              "स्पर्श काव्य: 7. तोप (वीरेन डंगवाल)",
              "स्पर्श काव्य: 8. कर चले हम फ़िदा (कैफ़ी आज़मी)",
              "स्पर्श काव्य: 9. आत्मत्राण (रवींद्रनाथ ठाकुर, अनुवाद)",
              // Sparsh Gadya
              "स्पर्श गद्य: 10. बड़े भाई साहब",
              "स्पर्श गद्य: 11. डायरी का एक पन्ना",
              "स्पर्श गद्य: 12. तताँरा-वामीरो कथा",
              "स्पर्श गद्य: 13. तीसरी कसम के शिल्पकार शैलेंद्र",
              "स्पर्श गद्य: 14. अब कहाँ दूसरे के दुख से दुखी होने वाले",
              "स्पर्श गद्य: 15. पतझर में टूटी पत्तियाँ",
              "स्पर्श गद्य: 16. कारतूस",
              // Sanchayan
              "संचयन: 1. हरिहर काका",
              "संचयन: 2. सपनों के-से दिन",
              "संचयन: 3. टोपी शुक्ला"
            ]
          },
          "Mathematics (Standard / Basic)": {
            textbook: "NCERT Mathematics Class 10",
            notes: "2025-26 rationalized syllabus. Some sub-topics deleted (Euclid's division lemma, Division algo for poly, etc.) — see app's deleted list.",
            chapters: [
              "Chapter 1: Real Numbers",
              "Chapter 2: Polynomials",
              "Chapter 3: Pair of Linear Equations in Two Variables",
              "Chapter 4: Quadratic Equations",
              "Chapter 5: Arithmetic Progressions",
              "Chapter 6: Triangles",
              "Chapter 7: Coordinate Geometry",
              "Chapter 8: Introduction to Trigonometry",
              "Chapter 9: Some Applications of Trigonometry",
              "Chapter 10: Circles",
              "Chapter 11: Areas Related to Circles",
              "Chapter 12: Surface Areas and Volumes",
              "Chapter 13: Statistics",
              "Chapter 14: Probability"
            ],
            deletedTopics2025: [
              "Euclid's division lemma (Ch 1)",
              "Division algorithm for polynomials (Ch 2)",
              "Cross-multiplication method (Ch 3)",
              "Solution by completing the squares (Ch 4)",
              "Areas of similar triangles (Ch 6)",
              "Pythagoras theorem (Ch 6)",
              "Area of a triangle using coordinates (Ch 7)",
              "Trigonometric ratios of complementary angles (Ch 8)",
              "Construction: Division of a line segment (Ch 11)",
              "Areas of combinations of plane figures (Ch 11)",
              "Conversion of solid from one shape to another (Ch 12)",
              "Frustum of a cone (Ch 12)",
              "Graphical representation of cumulative frequency distribution (Ch 13)"
            ]
          },
          "Science": {
            textbook: "NCERT Science Class 10",
            notes: "CBSE DELETED Chapters 5 (Periodic Classification), 14 (Sources of Energy), 16 (Sustainable Management). Do NOT generate questions from these for CBSE.",
            chapters: [
              "Chapter 1: Chemical Reactions and Equations",
              "Chapter 2: Acids, Bases and Salts",
              "Chapter 3: Metals and Non-Metals",
              "Chapter 4: Carbon and Its Compounds",
              // Chapter 5 DELETED FOR CBSE
              "Chapter 6: Life Processes",
              "Chapter 7: Control and Coordination",
              "Chapter 8: How do Organisms Reproduce?",
              "Chapter 9: Heredity and Evolution",
              "Chapter 10: Light — Reflection and Refraction",
              "Chapter 11: Human Eye and the Colourful World",
              "Chapter 12: Electricity",
              "Chapter 13: Magnetic Effects of Electric Current",
              // Chapter 14 DELETED FOR CBSE
              "Chapter 15: Our Environment"
              // Chapter 16 DELETED FOR CBSE
            ],
            deletedChaptersCBSE: [
              "Chapter 5: Periodic Classification of Elements [DELETED in CBSE, ACTIVE in SEBA]",
              "Chapter 14: Sources of Energy [DELETED in CBSE, ACTIVE in SEBA]",
              "Chapter 16: Sustainable Management of Natural Resources [DELETED in CBSE, ACTIVE in SEBA]"
            ]
          },
          "Social Science": {
            textbook: "NCERT Contemporary India II + India and Contemporary World II + Understanding Economic Development + Democratic Politics II",
            chapters: [
              "History: The Rise of Nationalism in Europe",
              "History: Nationalism in India",
              "History: The Making of a Global World",
              "History: The Age of Industrialisation",
              "History: Print Culture and the Modern World",
              "Geography: Resources and Development",
              "Geography: Forest and Wildlife Resources",
              "Geography: Water Resources",
              "Geography: Agriculture",
              "Geography: Minerals and Energy Resources",
              "Geography: Manufacturing Industries",
              "Geography: Lifelines of National Economy",
              "Economics: Development",
              "Economics: Sectors of the Indian Economy",
              "Economics: Money and Credit",
              "Economics: Globalisation and the Indian Economy",
              "Economics: Consumer Rights",
              "Civics: Power Sharing",
              "Civics: Federalism",
              "Civics: Democracy and Diversity",
              "Civics: Gender, Religion and Caste",
              "Civics: Popular Struggles and Movements",
              "Civics: Political Parties",
              "Civics: Outcomes of Democracy",
              "Civics: Challenges to Democracy"
            ]
          }
        }
      },

      "Class 11": {
        notes: "See AHSEC Class 11 for detailed chapters — CBSE Class 11 follows the same NCERT textbooks.",
        reference: "Refer to AHSEC Class 11 stream subjects. Chapter names are identical as both use NCERT."
      },

      "Class 12": {
        notes: "See AHSEC Class 12 for detailed chapters — CBSE Class 12 follows the same NCERT rationalized textbooks.",
        reference: "Refer to AHSEC Class 12 stream subjects. Same deleted chapters apply."
      }
    }
  }, // end CBSE


  // ============================================================
  // BOARD 4: ICSE / ISC
  // ICSE: Classes 1–10 | ISC: Classes 11–12
  // Council for the Indian School Certificate Examinations
  // Website: https://cisce.org
  // ============================================================
  ICSE: {
    fullName: "ICSE/ISC — Council for the Indian School Certificate Examinations",
    classesOffered: "1–12 (ICSE: 1–10, ISC: 11–12)",
    examBoard: "ICSE (Class 10), ISC (Class 12)",
    notes: [
      "Primarily English medium. More comprehensive and detailed curriculum.",
      "ICSE separates Physics, Chemistry, Biology as DISTINCT subjects from Class 6 onwards.",
      "CBSE/SEBA keep Science combined — ICSE does NOT. This is a key difference.",
      "Class 10 ICSE: Theory + Internal Assessment (20% in most subjects).",
      "English Language and English Literature are two separate subjects.",
      "ISC Class 12 is a very comprehensive and rigorous board."
    ],

    classes: {
      "Class 1": {
        subjects: {
          "English": { chapters: ["Alphabet and Phonics", "Simple Words and Sentences", "Picture Reading", "Rhymes and Poems", "My Family and Friends", "Listening and Speaking"] },
          "Hindi": { chapters: ["वर्णमाला", "सरल शब्द", "छोटी कविताएँ", "मेरा परिवार", "जानवर और पक्षी"] },
          "Mathematics": { chapters: ["Numbers 1–100", "Shapes", "Addition (single digit)", "Subtraction (single digit)", "Measurement (comparison)", "Time (basic)"] },
          "Environmental Studies": { chapters: ["Myself and My Family", "Animals and Plants", "Food and Shelter", "Our Country"] }
        }
      },
      "Class 2": {
        subjects: {
          "English": { chapters: ["Reading and Comprehension", "Vocabulary", "Grammar: Nouns, Verbs, Adjectives", "Writing: Sentences and Short Paragraphs", "Listening and Speaking"] },
          "Hindi": { chapters: ["शब्द भंडार", "सरल वाक्य", "छोटी कहानियाँ", "व्याकरण: संज्ञा, सर्वनाम", "पत्र लेखन (प्रारंभिक)"] },
          "Mathematics": { chapters: ["Numbers 1–1000", "Addition with Carry", "Subtraction with Borrowing", "Multiplication (tables 2–5)", "Division (introduction)", "Money", "Time", "Measurement"] },
          "Environmental Studies": { chapters: ["Our Body", "Food", "Animals", "Plants", "Water", "Our Environment"] }
        }
      },
      "Class 3": {
        subjects: {
          "English": { chapters: ["Comprehension Passages", "Grammar: Tenses (simple), Articles, Prepositions", "Creative Writing (paragraphs, letters)", "Story Reading", "Poetry Appreciation"] },
          "Hindi": { chapters: ["गद्यांश", "पद्यांश", "व्याकरण: काल, लिंग, वचन", "पत्र-लेखन", "निबंध (प्रारंभिक)"] },
          "Mathematics": { chapters: ["Numbers up to 10,000", "Addition and Subtraction", "Multiplication (tables up to 10)", "Division", "Fractions (intro)", "Measurement", "Time", "Money", "Shapes and Geometry"] },
          "Environmental Studies": { chapters: ["Family and Home", "Food and Nutrition", "Plants and Animals", "Water and Soil", "Weather and Seasons", "Our Nation"] },
          "Computer Studies": { chapters: ["Introduction to Computer", "Parts of Computer", "Input/Output Devices", "Introduction to MS Paint"] }
        }
      },
      "Class 4": {
        subjects: {
          "English": { chapters: ["Reading: Prose and Poetry", "Grammar: All Parts of Speech", "Tenses", "Comprehension (unseen)", "Letter Writing", "Creative Writing"] },
          "Hindi": { chapters: ["गद्य और पद्य", "व्याकरण: उपसर्ग, प्रत्यय, संधि (प्रारंभिक)", "पत्र-लेखन", "अनुच्छेद लेखन", "कहानी"] },
          "Mathematics": { chapters: ["Large Numbers", "Factors and Multiples", "Fractions", "Decimals (intro)", "Measurement", "Time", "Money", "Geometry", "Data Handling"] },
          "Science": { chapters: ["Plants and Animals", "Food and Digestion", "Water", "Air and Weather", "Rocks and Soil", "Our Body"] },
          "Social Studies": { chapters: ["Our Country India", "Map Skills", "Early Civilisations", "Transport and Communication", "Our Government"] },
          "Computer Studies": { chapters: ["Parts of Computer", "Word Processing (MS Word intro)", "Introduction to Internet", "Safety Rules"] }
        }
      },
      "Class 5": {
        subjects: {
          "English": { chapters: ["Literature: Prose Chapters", "Literature: Poems", "Grammar: Complex Sentences, Active/Passive (intro)", "Comprehension", "Essay and Letter Writing", "Story Writing"] },
          "Hindi": { chapters: ["गद्य अध्याय", "पद्य अध्याय", "व्याकरण: काल, वाच्य, समास (परिचय)", "पत्र-लेखन (औपचारिक/अनौपचारिक)", "निबंध"] },
          "Mathematics": { chapters: ["Numbers and Operations", "Fractions and Decimals", "Percentage (intro)", "Measurement", "Geometry", "Perimeter and Area", "Data Handling", "HCF and LCM"] },
          "Science": { chapters: ["Food and Digestion", "Diseases and Hygiene", "Plants", "Animals and Adaptation", "Matter and Materials", "Earth and Space"] },
          "Social Studies": { chapters: ["Physical Features of India", "Climate and Seasons", "Agriculture", "Industries", "Constitution and Government"] },
          "Computer Studies": { chapters: ["Software and Hardware", "MS Word", "MS Paint", "Internet Basics"] }
        }
      },
      "Class 6": {
        notes: "ICSE separates Physics, Chemistry, Biology from Class 6 onwards.",
        subjects: {
          "English Language": { chapters: ["Comprehension (Seen and Unseen)", "Grammar: All Parts of Speech, Tenses, Transformation of Sentences", "Letter Writing (Formal and Informal)", "Essay Writing", "Story Writing", "Notice and Message Writing"] },
          "English Literature": { chapters: ["Prose Chapters from prescribed textbook", "Poetry from prescribed anthology", "Short Story / Drama"] },
          "Hindi": { chapters: ["गद्य अध्याय", "पद्य अध्याय", "व्याकरण: संधि, समास, मुहावरे", "पत्र-लेखन", "निबंध", "अपठित गद्यांश"] },
          "Mathematics": { chapters: ["Knowing Our Numbers", "Whole Numbers", "Integers", "Playing with Numbers", "Fractions", "Decimals", "Basic Geometry", "Ratio and Proportion", "Algebra (introduction)", "Data Handling", "Mensuration"] },
          "Physics": { chapters: ["Physical Quantities and Measurement", "Motion", "Energy", "Light", "Sound"] },
          "Chemistry": { chapters: ["Introduction to Chemistry", "Elements, Compounds and Mixtures", "Changes Around Us", "Water", "Air"] },
          "Biology": { chapters: ["Cell: The Unit of Life", "Plant and Animal Tissues", "Nutrition", "Respiration", "Transportation in Plants and Animals"] },
          "History and Civics": { chapters: ["Ancient History: Harappan Civilisation, Vedic Period, Mauryas", "Medieval History: Delhi Sultanate, Mughals", "Civics: Constitution, Fundamental Rights, Government Structure"] },
          "Geography": { chapters: ["The Earth in the Solar System", "Globe: Latitudes and Longitudes", "Motions of the Earth", "Maps", "Major Landforms", "Climate and Natural Vegetation", "India: Location and Physical Features"] },
          "Computer Studies": { chapters: ["Computer Fundamentals", "Windows Operating System", "MS Word", "MS Excel (basics)", "Introduction to Internet and E-mail"] }
        }
      },
      "Class 7": {
        subjects: {
          "English Language": { chapters: ["Comprehension", "Grammar: Advanced Tenses, Modals, Voice, Speech", "Essay and Letter Writing", "Report Writing", "Story Writing"] },
          "English Literature": { chapters: ["Prose: Short Stories from prescribed textbook", "Poetry: From prescribed anthology", "One-Act Plays / Drama"] },
          "Hindi": { chapters: ["गद्य अध्याय", "पद्य अध्याय", "व्याकरण: उपसर्ग-प्रत्यय, विलोम, पर्यायवाची, वाच्य", "अपठित गद्यांश", "पत्र, निबंध, संवाद"] },
          "Mathematics": { chapters: ["Integers", "Fractions and Decimals", "Rational Numbers", "Exponents", "Simple Equations", "Lines and Angles", "Triangles", "Congruence", "Symmetry", "Data Handling", "Mensuration", "Percentage and Profit/Loss"] },
          "Physics": { chapters: ["Physical Quantities and Measurement (advanced)", "Matter and its States", "Energy", "Light: Reflection and Refraction", "Electricity", "Motion and Velocity"] },
          "Chemistry": { chapters: ["Elements, Compounds, Mixtures", "Atomic Structure", "Periodic Table (introduction)", "Language of Chemistry", "Chemical Reactions", "Air and Atmosphere"] },
          "Biology": { chapters: ["Tissues (Plant and Animal)", "Reproduction in Plants", "Excretion", "Nervous System", "Endocrine System", "Health and Diseases"] },
          "History and Civics": { chapters: ["Medieval History", "Mughal Empire", "Bhakti Movement", "Modern History: European Trading Companies", "Civics: State Government, Judiciary, Local Self-Government"] },
          "Geography": { chapters: ["Lithosphere", "Rocks and Minerals", "Hydrosphere", "Atmosphere", "Climate of India", "Natural Vegetation", "Population"] }
        }
      },
      "Class 8": {
        subjects: {
          "English Language": { chapters: ["Comprehension", "Grammar: All major topics", "Essay: Descriptive, Narrative, Argumentative", "Formal and Informal Letters", "Notice, Message, E-mail Writing"] },
          "English Literature": { chapters: ["Prose from prescribed textbook", "Poetry from prescribed anthology", "Drama / Shakespeare (introduction)"] },
          "Hindi": { chapters: ["गद्य और पद्य", "व्याकरण: अलंकार, छंद, रस", "निबंध (विभिन्न प्रकार)", "पत्र-लेखन", "अपठित गद्यांश-पद्यांश"] },
          "Mathematics": { chapters: ["Rational Numbers", "Exponents and Powers", "Algebraic Expressions and Identities", "Factorisation", "Linear Equations", "Understanding Quadrilaterals", "Squares and Square Roots", "Cubes and Cube Roots", "Percentage, Profit and Loss", "Data Handling", "Mensuration: Areas and Volumes"] },
          "Physics": { chapters: ["Force", "Pressure", "Buoyancy", "Light: Dispersion, Spectrum", "Electricity", "Sound", "Heat Transfer"] },
          "Chemistry": { chapters: ["Matter", "Atoms and Molecules", "Language of Chemistry", "Chemical Reactions", "Electrolysis (introduction)", "Metals and Non-Metals"] },
          "Biology": { chapters: ["Cell: Structure and Function", "Transportation in Plants", "Reproduction in Animals", "Endocrine System", "Nervous Coordination", "Waste Management"] },
          "History and Civics": { chapters: ["British Rule in India", "Indian National Movement", "Indian Constitution", "Fundamental Rights and Duties", "Parliament and Legislature", "Civics: Local Self-Government"] },
          "Geography": { chapters: ["The Earth's Interior", "Rocks and Soil", "Landforms", "Climate", "Natural Resources of India", "Industries", "Transport and Trade"] }
        }
      },
      "Class 9": {
        subjects: {
          "English Language": {
            chapters: [
              "Essay Writing (Descriptive, Narrative, Argumentative, Discursive)",
              "Letter Writing (Formal: Official, Application; Informal: Personal)",
              "Comprehension (Seen and Unseen Passages)",
              "Grammar: Transformation of Sentences, Active/Passive, Direct/Indirect",
              "Report Writing",
              "Notice, E-mail and Message Writing",
              "Summary Writing"
            ]
          },
          "English Literature": {
            textbook: "Treasure Chest (stories and poems) + Drama (Merchant of Venice or similar)",
            chapters: [
              "Short Stories from Treasure Chest",
              "Poems from Treasure Chest",
              "Drama: The Merchant of Venice (selected acts)",
              "Character sketches and critical appreciation"
            ]
          },
          "Hindi": {
            chapters: [
              "गद्य अध्याय (prescribed textbook)",
              "पद्य अध्याय (prescribed textbook)",
              "व्याकरण: रस, छंद, अलंकार, सन्धि, समास",
              "पत्र-लेखन (औपचारिक/अनौपचारिक)",
              "निबंध-लेखन",
              "अपठित गद्यांश और पद्यांश"
            ]
          },
          "Mathematics": {
            chapters: [
              "Pure Arithmetic: Rational and Irrational Numbers",
              "Commercial Mathematics: Compound Interest, Taxation, Banking",
              "Algebra: Expansions, Factorisation, Simultaneous Linear Equations, Indices, Logarithms",
              "Geometry: Triangles, Rectilinear Figures, Circle",
              "Statistics: Mean, Median, Mode, Frequency Distributions",
              "Mensuration: Area, Volumes of Solids",
              "Trigonometry (introduction)",
              "Coordinate Geometry (introduction)"
            ]
          },
          "Physics": {
            chapters: [
              "Measurements and Experimentation",
              "Motion",
              "Laws of Motion",
              "Fluids",
              "Heat and Energy",
              "Light",
              "Sound",
              "Electricity and Magnetism"
            ]
          },
          "Chemistry": {
            chapters: [
              "The Language of Chemistry",
              "Chemical Changes and Reactions",
              "Water",
              "Atomic Structure and Chemical Bonding",
              "The Periodic Table",
              "Study of the First Element — Hydrogen",
              "Study of Gas Laws",
              "Atmospheric Pollution",
              "Practical Chemistry"
            ]
          },
          "Biology": {
            chapters: [
              "Basic Biology — Cell Theory, Cell Structure",
              "Plant Nutrition — Photosynthesis",
              "Plant Respiration",
              "Plant Growth",
              "Five Kingdom Classification",
              "Economic Importance of Bacteria, Fungi, Algae",
              "Circulatory System",
              "Excretory System",
              "Nervous System",
              "The Endocrine System",
              "The Reproductive System",
              "Population",
              "Pollution"
            ]
          },
          "History and Civics": {
            chapters: [
              "History: The Harappan Civilisation",
              "History: The Vedic Period",
              "History: Jainism and Buddhism",
              "History: The Mauryan Empire",
              "History: The Age of the Guptas",
              "History: Medieval India",
              "History: The Mughal Empire",
              "History: The Rise of Maratha Power",
              "Civics: Our Constitution",
              "Civics: Union Parliament",
              "Civics: The Union Executive",
              "Civics: The Judiciary",
              "Civics: State Government",
              "Civics: Local Self-Government"
            ]
          },
          "Geography": {
            chapters: [
              "Maps and Their Interpretation",
              "The Earth as a Planet",
              "Representation of Relief Features",
              "The Lithosphere",
              "Landforms",
              "The Atmosphere",
              "Humidity",
              "Pollution"
            ]
          }
        }
      },
      "Class 10": {
        notes: "ICSE Board Exam year. Emphasis on English Language and Literature. Internal Assessment: 20%.",
        subjects: {
          "English Language": {
            chapters: [
              "Essay Writing (all types: discursive, argumentative, descriptive, narrative)",
              "Letter Writing (formal and informal)",
              "Directed Writing: Reports, Articles, Speeches",
              "Comprehension: Seen and Unseen Passages",
              "Grammar: Advanced Transformation, Clauses, Voice, Speech, Determiners",
              "Notice and E-mail Writing"
            ]
          },
          "English Literature": {
            textbook: "Treasure Chest + A Collection of Poems/Plays",
            chapters: [
              "Drama: The Merchant of Venice (Full Text) / Julius Caesar",
              "Short Stories from Treasure Chest",
              "Poems from prescribed poetry anthology",
              "Critical appreciation and literary devices"
            ]
          },
          "Hindi": {
            chapters: [
              "गद्य अध्याय",
              "पद्य अध्याय",
              "एकांकी / नाटक",
              "व्याकरण: रस, छंद, अलंकार, मुहावरे, लोकोक्तियाँ",
              "निबंध-लेखन",
              "पत्र-लेखन",
              "अपठित गद्यांश और पद्यांश"
            ]
          },
          "Mathematics": {
            chapters: [
              "Compound Interest",
              "Sales Tax and Value Added Tax",
              "Banking",
              "Shares and Dividends",
              "Linear Inequations",
              "Quadratic Equations",
              "Ratio and Proportion",
              "Remainder and Factor Theorems",
              "Matrices",
              "Arithmetic and Geometric Progressions",
              "Coordinate Geometry",
              "Similarity",
              "Loci",
              "Circles: Tangents, Angles in Circles",
              "Constructions",
              "Trigonometry: Heights and Distances",
              "Mensuration",
              "Statistics: Mean, Median, Ogive, Histograms",
              "Probability"
            ]
          },
          "Physics": {
            chapters: [
              "Force, Work, Power and Energy",
              "Simple Machines",
              "Refraction of Light at Plane Surfaces",
              "Refraction through a Lens",
              "Spectrum",
              "Sound",
              "Electricity",
              "Household Circuits",
              "Electromagnetism",
              "Calorimetry",
              "Radioactivity"
            ]
          },
          "Chemistry": {
            chapters: [
              "Periodic Table and Periodic Properties",
              "Chemical Bonding",
              "Acids, Bases and Salts",
              "Analytical Chemistry",
              "Mole Concept and Stoichiometry",
              "Electrolysis",
              "Metallurgy",
              "Study of Compounds: HCl, Ammonia, Nitric Acid, Sulphuric Acid",
              "Organic Chemistry: Introduction, Hydrocarbons"
            ]
          },
          "Biology": {
            chapters: [
              "Cell Division",
              "Structure of Chromosome, Gene and DNA",
              "Absorption by Roots",
              "Transpiration",
              "Photosynthesis",
              "Chemical Coordination in Plants",
              "The Circulatory System",
              "The Excretory System",
              "The Nervous System",
              "The Endocrine System",
              "The Reproductive System",
              "Genetics: Mendel's Laws, Sex Determination",
              "Population, Food Production, Biotechnology",
              "Pollution"
            ]
          },
          "History and Civics": {
            chapters: [
              "History: The Revolt of 1857",
              "History: The Rise of Nationalism in India",
              "History: Mahatma Gandhi and the National Movement",
              "History: Partition and Independence",
              "History: The Cold War",
              "History: United Nations Organisation",
              "Civics: The Union Parliament",
              "Civics: The Prime Minister and the Council of Ministers",
              "Civics: The President",
              "Civics: The Supreme Court",
              "Civics: The State Government"
            ]
          },
          "Geography": {
            chapters: [
              "Map Work: Topographic Maps",
              "India: Location, Extent and Physical Features",
              "India: Drainage System",
              "India: Climate",
              "India: Soil",
              "India: Natural Vegetation",
              "India: Agriculture",
              "India: Minerals and Energy Resources",
              "India: Industries",
              "India: Transport, Communication and Trade",
              "India: Waste Management"
            ]
          }
        }
      }
    }
  }, // end ICSE


  // ============================================================
  // BOARD 5: AJBEC / Jatiya Vidyalaya
  // Assam Jatiya Bidyalay Education Council
  // Classes 1–12 | Private state-level council
  // Website: https://assamjatiyabidyalay.com
  // ============================================================
  JATIYA_VIDYALAYA: {
    fullName: "AJBEC — Assam Jatiya Bidyalay Education Council (জাতীয় বিদ্যালয়)",
    classesOffered: "1–12",
    examBoard: "SEBA (HSLC at Class 10), AHSEC (HS at Class 12)",
    notes: [
      "Uses proprietary AJB Council textbooks for Classes 1–8. Classes 9–12 follow SEBA/AHSEC syllabi.",
      "Primary medium: Assamese.",
      "Curriculum is SEBA-equivalent for board exam purposes (Classes 9–10) and AHSEC-equivalent for Class 11–12.",
      "Unique features: Assam History as a separate mandatory subject (Class 6–8), strong emphasis on Assamese culture, language and literature.",
      "Science practicals start from Class 3 (earlier than standard schools).",
      "Daily 'Spoken English' sessions from Class 5.",
      "Higher mental math emphasis — multiplication tables up to 20 by Class 4.",
      "Use SEBA chapters for Class 9–10 and AHSEC chapters for Class 11–12 when generating question papers."
    ],

    classes: {
      "Class 1": {
        notes: "Follows AJB proprietary textbooks. Content equivalent to SEBA/SCERT Class 1.",
        subjects: {
          "অসমীয়া (Assamese MIL)": { chapters: ["আখৰ পৰিচয়", "শব্দ গঠন", "সৰু বাক্য", "ছড়া আৰু কবিতা", "চুটি গল্প", "পৰিয়াল"] },
          "English": { chapters: ["Alphabet", "Simple Words", "Picture Reading", "Rhymes", "My Family"] },
          "Mathematics": { chapters: ["Numbers 1–100", "Shapes", "Addition (single digit)", "Subtraction (single digit)", "Mental Math (tables 2–5 introduced)"] }
        }
      },
      "Class 2": {
        subjects: {
          "অসমীয়া": { chapters: ["বৰ্ণমালা পুনৰাবৃত্তি", "শব্দ আৰু বাক্য", "ছড়া-কবিতা", "চুটি গল্প", "প্ৰকৃতি পৰিচয়"] },
          "English": { chapters: ["Vocabulary and Sentences", "Rhymes and Stories", "Basic Grammar"] },
          "Mathematics": { chapters: ["Numbers up to 1000", "Addition with carry", "Subtraction with borrowing", "Multiplication tables 2–5", "Mental Math"] }
        }
      },
      "Class 3": {
        notes: "Science Practicals begin (Introduction to Observations).",
        subjects: {
          "অসমীয়া": { chapters: ["গদ্য অংশ", "পদ্য অংশ", "ব্যাকৰণ: বিশেষ্য, সৰ্বনাম, ক্ৰিয়া", "ৰচনা"] },
          "English": { chapters: ["Reading (prose + poetry)", "Grammar: Nouns, Pronouns, Tenses", "Writing: Sentences and Paragraphs"] },
          "Mathematics": { chapters: ["Numbers up to 10,000", "All four operations", "Fractions (intro)", "Measurement", "Multiplication tables up to 15", "Mental Math"] },
          "EVS / Science (Practical)": { chapters: ["Introduction to Observations", "Plants Around Us", "Animals Around Us", "Water and Air", "Our Body", "Food and Health"] }
        }
      },
      "Class 4": {
        subjects: {
          "অসমীয়া": { chapters: ["গদ্য", "পদ্য", "অসমীয়া সাহিত্যৰ পৰিচয়", "ব্যাকৰণ", "ৰচনা"] },
          "English": { chapters: ["Reading and Comprehension", "Grammar", "Writing: Letters and Paragraphs"] },
          "Mathematics": { chapters: ["Large Numbers (Lakhs)", "Multiplication (tables up to 20)", "Division", "Fractions", "Decimals (intro)", "Geometry (basic)", "Mental Math emphasis"] },
          "EVS / Science (Practical)": { chapters: ["Simple Experiments: Observation Skills", "Plants: Parts and Functions", "Animals: Classification", "Earth and Environment", "Food and Nutrition"] }
        }
      },
      "Class 5": {
        notes: "Spoken English sessions begin daily.",
        subjects: {
          "অসমীয়া": { chapters: ["গদ্য আৰু পদ্য", "লোকসাহিত্য পৰিচয়", "ব্যাকৰণ", "ৰচনা আৰু পত্ৰ"] },
          "English (+ Spoken English)": { chapters: ["Prose and Poetry", "Grammar: All tenses, Active/Passive (intro)", "Letter Writing", "Spoken English: Conversations, Presentations"] },
          "Mathematics": { chapters: ["Numbers up to Crores", "All operations", "HCF/LCM", "Fractions and Decimals", "Percentage (intro)", "Geometry", "Perimeter and Area", "Data Handling"] },
          "Science (Practical)": { chapters: ["Plants: Life Processes", "Animals: Adaptation", "Matter and Materials", "Simple Machines (intro)", "Earth and Space (intro)"] }
        }
      },
      "Class 6": {
        notes: "Assam History introduced as a SEPARATE mandatory subject.",
        subjects: {
          "অসমীয়া": { chapters: ["বৰগীত পৰিচয়", "লোকসাহিত্য", "গদ্য", "পদ্য", "ব্যাকৰণ", "ৰচনা"] },
          "English": { chapters: ["Prose and Poetry", "Grammar: All parts of speech, Tenses", "Essay and Letter Writing", "Comprehension"] },
          "Mathematics": { chapters: ["Patterns in Mathematics", "Lines and Angles", "Number Play", "Data Handling", "Prime Time", "Perimeter and Area", "Fractions", "Symmetry", "Integers"] },
          "Science (Lab-based)": { chapters: ["Food: Sources and Components", "Fibre to Fabric", "Sorting Materials", "Separation of Substances", "The Living World", "Body Movements", "Water", "Air", "Garbage"] },
          "Social Science": { chapters: ["Geography: Earth, Globe, Landforms", "History: Timeline, Sources", "History: India — Early Civilisations", "Civics: Governance", "Economics: Economic Activities"] },
          "Assam History (Separate Subject)": {
            notes: "UNIQUE to Jatiya Vidyalaya. Mandatory subject not found in SEBA/CBSE.",
            chapters: [
              "প্ৰাচীন অসমৰ ইতিহাস: প্ৰত্নতাত্ত্বিক প্ৰমাণ",
              "অসমৰ প্ৰাচীন ৰাজ্যবোৰ",
              "আহোম ৰাজ্যৰ স্থাপনা",
              "অসমৰ ভূগোল আৰু নদ-নদী",
              "অসমৰ লোকসংস্কৃতি আৰু উৎসৱ"
            ]
          }
        }
      },
      "Class 7": {
        subjects: {
          "অসমীয়া": { chapters: ["গদ্য আৰু পদ্য", "ভক্তি সাহিত্য", "ব্যাকৰণ: সন্ধি, সমাস (প্ৰাথমিক)", "ৰচনা আৰু পত্ৰ"] },
          "English": { chapters: ["Prose: Honeycomb-equivalent chapters", "Poetry", "Grammar: Advanced Tenses, Passive Voice", "Essay and Letter Writing"] },
          "Mathematics": { chapters: ["Integers", "Fractions and Decimals", "Equations", "Lines and Angles", "Triangles", "Comparing Quantities", "Algebraic Expressions", "Exponents and Powers", "Pre-algebra emphasis (advanced vs standard schools)"] },
          "Science (Lab-based)": { chapters: ["Nutrition in Plants and Animals", "Fibre to Fabric", "Heat", "Acids/Bases/Salts", "Physical and Chemical Changes", "Weather and Climate", "Winds and Storms", "Soil", "Respiration", "Transportation", "Reproduction in Plants", "Motion and Time", "Light"] },
          "Social Science": { chapters: ["History: Medieval Period", "Geography: Earth, Air, Water, Vegetation", "Civics: State Government, Equality", "Economics: Markets and Trade"] },
          "Assam History (Separate Subject)": {
            chapters: [
              "আহোম ৰাজ্যৰ বিস্তাৰ আৰু শাসনব্যৱস্থা",
              "বড়ো আৰু কছাৰী ৰাজ্য",
              "মোৱামৰীয়া বিদ্ৰোহ",
              "ব্ৰিটিছ শাসনৰ প্ৰাৰম্ভিক পৰ্যায়",
              "অসমীয়া সমাজ আৰু সংস্কৃতিৰ বিকাশ"
            ]
          }
        }
      },
      "Class 8": {
        subjects: {
          "অসমীয়া": { chapters: ["বৰগীত", "মধ্যযুগীয় সাহিত্য", "আধুনিক কবিতা", "চন্দ্ৰপ্ৰভা শইকীয়ানী", "ব্যাকৰণ", "ৰচনা"] },
          "English": { chapters: ["Prose: Honeydew/SEBA-equivalent", "Poetry", "Grammar", "Writing: Reports, Letters, Applications"] },
          "Mathematics": { chapters: ["Rational Numbers", "Linear Equations", "Quadrilaterals", "Data Handling", "Squares/Square Roots", "Cubes/Cube Roots", "Comparing Quantities", "Algebraic Expressions", "Mensuration", "Factorisation", "Exponents", "Graphs"] },
          "Science (Lab-based)": { chapters: ["Crop Production", "Microorganisms", "Synthetic Fibres", "Metals/Non-Metals", "Coal and Petroleum", "Combustion", "Conservation", "Cell", "Reproduction in Animals", "Adolescence", "Force and Pressure", "Friction", "Sound", "Electricity", "Light", "Stars and Solar System"] },
          "Social Science": { chapters: ["History: Colonial India, National Movement", "Geography: Resources, Agriculture, Industries", "Civics: Constitution, Parliament, Laws"] },
          "Assam History (Separate Subject)": {
            chapters: [
              "ব্ৰিটিছ শাসনৰ বিস্তাৰ",
              "অসমত জাতীয়তাবাদ",
              "অসম আন্দোলন ১৯৭৯–৮৫",
              "অসমৰ স্বাধীনতা সংগ্ৰামী",
              "স্বাধীনতা পিছৰ অসম"
            ]
          }
        }
      },
      "Class 9": {
        notes: "Follows SEBA syllabus exactly. Refer to SEBA Class 9 for all subjects.",
        reference: "Use SEBA Class 9 subject chapters for all subjects (Assamese MIL, English, Mathematics, Science, Social Science)."
      },
      "Class 10": {
        notes: "HSLC exam via SEBA. Follows SEBA syllabus exactly.",
        reference: "Use SEBA Class 10 subject chapters for all subjects."
      },
      "Class 11": {
        notes: "Follows AHSEC syllabus. Students choose Science/Commerce/Arts stream.",
        reference: "Use AHSEC Class 11 stream-specific chapters."
      },
      "Class 12": {
        notes: "HS exam via AHSEC. Follows AHSEC syllabus.",
        reference: "Use AHSEC Class 12 stream-specific chapters."
      }
    }
  }, // end JATIYA_VIDYALAYA


  // ============================================================
  // BOARD 6: SHANKARDEV (Shankardev Shishu/Vidya Niketan)
  // Schools run by Shishu Shiksha Samiti, Assam (Vidya Bharati affiliate)
  // 470+ schools across Assam | Private, unaided
  // ============================================================
  SHANKARDEV: {
    fullName: "Shankardev Shishu/Vidya Niketan (শংকৰদেৱ শিশু/বিদ্যা নিকেতন)",
    classesOffered: "1–12",
    examBoard: "SEBA (Class 10), AHSEC (Class 12)",
    notes: [
      "Classes 9–10: Follow NCERT books + SEBA syllabus.",
      "Classes 11–12: Follow NCERT books + AHSEC syllabus.",
      "Classes 1–8: Use proprietary SSS (Shishu Shiksha Samiti) textbooks with content equivalent to SCERT/NCERT.",
      "Key features: Zero Period (Sunya Kalamsh) daily — stories of freedom fighters and Indian history.",
      "Strong emphasis on Hindutva, nationalism, Indian culture, and Sanskrit.",
      "Sanskrit is taught as an additional language (Third Language) from Class 1.",
      "Classes 6–8 Assamese textbook: SSS proprietary — chapters have Assamese cultural and patriotic themes.",
      "FOR EXAM PURPOSES (Class 9+): Use SEBA chapters. For Classes 1–8: Use SCERT-equivalent content below.",
      "Assamese chapters for Classes 6–8 are from SSS books — distinct from standard SCERT chapters."
    ],

    classes: {
      "Class 1": {
        subjects: {
          "অসমীয়া (MIL)": { chapters: ["আখৰ পৰিচয়", "সৰল শব্দ", "ছড়া আৰু কবিতা", "পৰিয়াল আৰু বন্ধু", "আমাৰ দেশ (পৰিচয়)"] },
          "English": { chapters: ["Alphabet and Phonics", "Simple Words and Sentences", "Rhymes", "My Family"] },
          "Mathematics": { chapters: ["Numbers 1–100", "Basic Shapes", "Addition (single digit)", "Subtraction"] },
          "Sanskrit (Third Language)": { chapters: ["वर्णमाला परिचय", "सरल शब्द", "श्लोक एवं मंत्र (प्रारम्भिक)"] }
        }
      },
      "Class 2": {
        subjects: {
          "অসমীয়া": { chapters: ["শব্দ আৰু বাক্য", "ছড়া-কবিতা", "চুটি গল্প", "প্ৰকৃতি পৰিচয়"] },
          "English": { chapters: ["Simple Sentences", "Rhymes", "Basic Grammar", "Reading"] },
          "Mathematics": { chapters: ["Numbers up to 1000", "Addition, Subtraction", "Multiplication (tables 2–5)", "Time, Money"] },
          "Sanskrit": { chapters: ["वर्णमाला", "सरल शब्द-अभ्यास", "श्लोक"] }
        }
      },
      "Class 3": {
        subjects: {
          "অসমীয়া": { chapters: ["গদ্য অংশ", "পদ্য অংশ", "ব্যাকৰণ: বিশেষ্য, সৰ্বনাম", "ৰচনা (চুটি)"] },
          "English": { chapters: ["Prose and Poetry", "Grammar: Nouns, Verbs, Tenses", "Writing: Paragraphs"] },
          "Mathematics": { chapters: ["Numbers up to 10,000", "All four operations", "Fractions (intro)", "Measurement", "Mental Math (tables up to 15)"] },
          "EVS": { chapters: ["Plants", "Animals", "Water and Air", "Food", "Our Body", "Our Country"] },
          "Sanskrit": { chapters: ["सरल गद्य-पद्य", "व्याकरण: संज्ञा, क्रिया", "श्लोक"] }
        }
      },
      "Class 4": {
        subjects: {
          "অসমীয়া": { chapters: ["গদ্য", "পদ্য", "ব্যাকৰণ: বিশেষণ, ক্ৰিয়া", "ৰচনা"] },
          "English": { chapters: ["Reading", "Grammar", "Writing: Letters and Paragraphs"] },
          "Mathematics": { chapters: ["Large Numbers", "All Operations", "Fractions", "Geometry", "Mental Math (tables up to 20)"] },
          "EVS / Science": { chapters: ["Plants and Animals", "Food and Health", "Earth and Environment", "Simple Machines", "Our Country Geography"] },
          "Sanskrit": { chapters: ["गद्य-पद्य", "व्याकरण", "कथाएँ"] }
        }
      },
      "Class 5": {
        subjects: {
          "অসমীয়া": { chapters: ["গদ্য", "পদ্য", "অসমৰ ইতিহাস-সংস্কৃতি (প্ৰাৰম্ভিক)", "ব্যাকৰণ", "ৰচনা আৰু পত্ৰ"] },
          "English": { chapters: ["Prose", "Poetry", "Grammar", "Letter Writing", "Essay Writing"] },
          "Mathematics": { chapters: ["Large Numbers", "HCF/LCM", "Fractions, Decimals, Percentage", "Geometry", "Perimeter, Area", "Data Handling"] },
          "Science": { chapters: ["Plants", "Animals", "Human Body", "Matter", "Earth and Environment", "Simple Practicals"] },
          "Sanskrit": { chapters: ["गद्य-पद्य (advanced)", "व्याकरण: संधि, समास (प्रारम्भिक)", "कहानियाँ"] }
        }
      },
      "Class 6": {
        subjects: {
          "অসমীয়া (SSS Textbook)": {
            textbook: "SSS proprietary Assamese textbook",
            chapters: [
              "বৰগীত আৰু ভক্তি সাহিত্য",
              "ভাৰতীয় বীৰত্বৰ কাহিনী",
              "অসমৰ প্ৰকৃতি আৰু সংস্কৃতি",
              "দেশপ্ৰেমমূলক কবিতা",
              "মহাপুৰুষীয়া সাহিত্য পৰিচয়",
              "শংকৰদেৱৰ জীৱন আৰু কাৰ্য",
              "ব্যাকৰণ: সন্ধি, সমাস, কাৰক",
              "ৰচনা, পত্ৰ আৰু প্ৰতিবেদন"
            ]
          },
          "English": { chapters: ["Prose and Poetry", "Grammar", "Writing: Letters, Essays, Comprehension"] },
          "Mathematics": { chapters: ["Patterns in Mathematics", "Lines and Angles", "Number Play", "Data Handling", "Prime Time", "Perimeter and Area", "Fractions", "Symmetry", "Integers"] },
          "Science": { chapters: ["Food: Sources", "Components of Food", "Fibre to Fabric", "Sorting Materials", "Separation", "The Living World", "Body Movements", "Water", "Air", "Garbage"] },
          "Social Science": { chapters: ["Geography: Earth, Globe, Landforms, Continents", "History: Timeline, India early history", "Civics: Governance", "Economics: Economic Activities"] },
          "Sanskrit (Third Language)": { chapters: ["गद्य-पद्य", "व्याकरण: संधि, कारक, समास", "वाक्य-निर्माण", "कहानियाँ"] }
        }
      },
      "Class 7": {
        subjects: {
          "অসমীয়া (SSS Textbook)": {
            chapters: [
              "বৰগীত সংকলন",
              "ভৰত চৰাই আৰু তাইৰ পোৱালিবিলাক",
              "ভাৰতীয় সভ্যতা আৰু সংস্কৃতি",
              "অসমৰ বীৰ পুৰুষ",
              "আধুনিক অসমীয়া কবিতা",
              "পণ্ডিত প্ৰবৰ কৃষ্ণকান্ত সন্দিকৈ",
              "ব্যাকৰণ: বাচ্য, অলংকাৰ (পৰিচয়)",
              "ৰচনা আৰু পত্ৰ"
            ]
          },
          "English": { chapters: ["Honeycomb-equivalent Prose", "Poetry", "Grammar", "Writing Skills"] },
          "Mathematics": { chapters: ["Integers", "Fractions and Decimals", "Simple Equations", "Lines and Angles", "Triangles", "Congruence", "Comparing Quantities", "Rational Numbers", "Algebraic Expressions", "Exponents", "Symmetry", "Solid Shapes"] },
          "Science": { chapters: ["Nutrition", "Fibre to Fabric", "Heat", "Acids/Bases/Salts", "Physical/Chemical Changes", "Climate", "Winds/Storms", "Soil", "Respiration", "Transportation", "Reproduction in Plants", "Motion and Time", "Electricity", "Light", "Water", "Forests", "Wastewater"] },
          "Social Science": { chapters: ["History: Medieval India", "Geography: Environment, Earth, Climate", "Civics: Government, Equality", "Economics: Markets"] },
          "Sanskrit": { chapters: ["गद्य-पद्य", "व्याकरण: धातु, काल, उपसर्ग-प्रत्यय", "रामायण/महाभारत कथा"] }
        }
      },
      "Class 8": {
        subjects: {
          "অসমীয়া (SSS Textbook)": {
            chapters: [
              "বৰগীত (ৰাগ – আশৌৱাৰী: তাৰ-পৰি)",
              "ভাৰতৰ স্বাধীনতা সংগ্ৰাম আৰু অসম",
              "ব্ৰহ্মপুত্ৰ আৰু আমাৰ পৰিৱেশ",
              "অগ্নিকন্যা চন্দ্ৰপ্ৰভা শইকীয়ানী",
              "আধুনিক অসমীয়া সাহিত্য",
              "ব্যাকৰণ: উচ্চতৰ ব্যাকৰণ",
              "ৰচনা: আনুষ্ঠানিক পত্ৰ, প্ৰতিবেদন"
            ]
          },
          "English": { chapters: ["Prose: SSS or Honeydew-equivalent", "Poetry", "Grammar", "Writing: Applications, Reports"] },
          "Mathematics": { chapters: ["Rational Numbers", "Linear Equations", "Quadrilaterals", "Data Handling", "Squares/Square Roots", "Cubes/Cube Roots", "Comparing Quantities", "Algebraic Expressions", "Mensuration", "Exponents", "Factorisation", "Graphs", "Playing with Numbers"] },
          "Science": { chapters: ["Crop Production", "Microorganisms", "Synthetic Fibres", "Metals/Non-Metals", "Coal/Petroleum", "Combustion", "Conservation", "Cell", "Reproduction in Animals", "Adolescence", "Force/Pressure", "Friction", "Sound", "Electricity", "Light", "Stars/Solar System", "Pollution"] },
          "Social Science": { chapters: ["History: Colonial Period, National Movement, India After Independence", "Geography: Resources, Agriculture", "Civics: Constitution, Parliament, Laws"] },
          "Sanskrit": { chapters: ["उच्च गद्य-पद्य", "व्याकरण: अलंकार, छन्द (परिचय)", "निबन्ध और पत्र-लेखन"] }
        }
      },
      "Class 9": {
        notes: "Follows SEBA syllabus (NCERT books). For all subjects, refer to SEBA Class 9.",
        reference: "Use SEBA Class 9 subject chapters. Sanskrit continues as 3rd language."
      },
      "Class 10": {
        notes: "HSLC via SEBA. Follows SEBA syllabus exactly.",
        reference: "Use SEBA Class 10 subject chapters."
      },
      "Class 11": {
        notes: "Follows AHSEC syllabus (NCERT books). Students choose Science/Commerce/Arts.",
        reference: "Use AHSEC Class 11 stream-specific chapters."
      },
      "Class 12": {
        notes: "HS exam via AHSEC.",
        reference: "Use AHSEC Class 12 stream-specific chapters."
      }
    }
  } // end SHANKARDEV

}; // end CURRICULUM_DATA

window.CURRICULUM_DATA = CURRICULUM_DATA;


// ============================================================
//  QUICK REFERENCE: Board Summary Table
// ============================================================
//
//  Board              | Short Name    | Classes | Exam Board          | Primary Language
//  -------------------|---------------|---------|---------------------|------------------
//  SEBA/ASSEB         | SEBA          | 1–10    | ASSEB (HSLC/Cl.10)  | Assamese/Multi
//  AHSEC              | AHSEC         | 11–12   | AHSEC (HS/Cl.12)    | Assamese/English
//  CBSE               | CBSE          | 1–12    | CBSE (AISSE/AISSCE) | English/Hindi
//  ICSE/ISC           | ICSE          | 1–12    | CISCE               | English
//  Jatiya Vidyalaya   | AJBEC         | 1–12    | SEBA(9-10)/AHSEC    | Assamese
//  Shankardev         | SHANKARDEV    | 1–12    | SEBA(9-10)/AHSEC    | Assamese
//
// ============================================================
//  KEY CRITICAL AI RULES:
//
//  1. LANGUAGE: Never translate chapter names.
//     - Hindi chapters → Devanagari (e.g., दो बैलों की कथा)
//     - Assamese chapters → Assamese script (e.g., বৰগীত)
//     - All other subjects → English
//
//  2. SCIENCE (Class 10):
//     - CBSE: Chapters 5, 14, 16 are DELETED. Never generate questions from them.
//     - SEBA: ALL chapters including 5, 14, 16 are ACTIVE.
//
//  3. SHANKARDEV & JATIYA VIDYALAYA (Class 9–12):
//     - For exams, use SEBA chapters (Cl.9-10) or AHSEC chapters (Cl.11-12).
//
//  4. ICSE SCIENCE (Class 6+):
//     - Physics, Chemistry, Biology are SEPARATE subjects (not combined "Science").
//
//  5. CBSE HINDI:
//     - Course A uses Kshitij + Kritika
//     - Course B uses Sparsh + Sanchayan
//     - Both courses exist for Class 9 AND Class 10.
//
//  6. AHSEC / CBSE Class 12 CHEMISTRY:
//     - Do NOT generate questions on deleted chapters:
//       The Solid State, Surface Chemistry, p-Block Elements, Polymers, Chemistry in Everyday Life
//
// ============================================================

// Export for use in the app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CURRICULUM_DATA;
}
