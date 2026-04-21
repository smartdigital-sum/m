const t = (en, as = en, hi = en) => ({ en, as, hi });
const ch = (...titles) => titles.map((title) => ({ names: t(title) }));

const makePrimaryClass = (n, subjects) => ({
  names: t(`Class ${n}`),
  subjects
});

const SYLLABUS_DATA = {
  SEBA: {
    names: { en: "SEBA (Assam Board)", as: "SEBA (অসম ব'ৰ্ড)", hi: "SEBA (असम बोर्ड)" },
    classes: {
      "Class 1": {
        names: { en: "Class 1", as: "প্ৰথম শ্ৰেণী", hi: "कक्षा 1" },
        subjects: {
          Language: { names: { en: "Language (Akanir Karmaputhi)", as: "অকণিৰ কৰ্মপুথি", hi: "भाषा (अकनिर कर्मपुथी)" }, chapters: ch("Alphabet Introduction", "Vowels and Consonants", "Picture Words", "Simple Rhymes", "Drawing and Expression") },
          English: { names: { en: "English", as: "ইংৰাজী", hi: "अंग्रेजी" }, chapters: ch("Fun with Letters", "My Body", "My Family", "My School", "Simple Words and Sentences") },
          Mathematics: { names: { en: "Mathematics (Amar Ganit)", as: "আমাৰ গণিত", hi: "गणित (अमार गणित)" }, chapters: ch("Shapes and Space", "Numbers 1 to 9", "Numbers up to 20", "Comparison (Big and Small)", "Addition Basics", "Subtraction Basics") }
        }
      },
      "Class 2": {
        names: { en: "Class 2", as: "দ্বিতীয় শ্ৰেণী", hi: "कक्षा 2" },
        subjects: {
          Language: { names: { en: "Language (Jhankara)", as: "ঝংকাৰ", hi: "भाषा (झंकार)" }, chapters: ch("Songs and Poems", "Our Village", "Stories from Daily Life", "Reading Practice", "Grammar Basics") },
          English: { names: { en: "English (NCERT)", as: "ইংৰাজী", hi: "अंग्रेजी" }, chapters: ch("My Bicycle", "Picture Reading", "It is Fun", "Seeing without Eyes", "Come Back Soon", "Between Home and School", "This is My Town", "A Show of Clouds", "My Name", "The Crow", "The Smart Monkey", "Little Drops of Water", "We are all Indians") },
          Mathematics: { names: { en: "Mathematics (Joyful Maths)", as: "আমাৰ গণিত", hi: "गणित (जॉयफुल गणित)" }, chapters: ch("A Day at the Beach", "Shapes Around Us", "Fun with Numbers", "Numbers 10 to 99", "Numbers up to 1000", "Addition and Subtraction", "Multiplication Tables", "Time", "Money", "Measurement") }
        }
      },
      "Class 3": {
        names: { en: "Class 3", as: "তৃতীয় শ্ৰেণী", hi: "कक्षा 3" },
        subjects: {
          Assamese: { names: { en: "Assamese (Spandan Bhag-I)", as: "স্পন্দন ভাগ-I", hi: "असमिया (स्पंदन भाग-I)" }, chapters: ch("Prose Selections", "Poetry Selections", "Language Practice", "Grammar and Composition", "Reading Comprehension") },
          English: { names: { en: "English (My Book of English-III)", as: "ইংৰাজী", hi: "अंग्रेजी" }, chapters: ch("Arun's Family", "The Monkey and the Elephant", "Lalu and Peelu", "The Mouse and the Pencil", "My Wish", "Bugs", "Our National Symbols", "Means of Transport", "Clean Clean", "Jamun Tree", "Hello Rain!", "Walking with Grandpa", "Traffic Rules", "What's in the Mailbox", "Clean Your Body") },
          Mathematics: { names: { en: "Mathematics (Our Mathematics-I / Math-Magic)", as: "গণিত", hi: "गणित" }, chapters: ch("Number Games", "Three-Digit Numbers", "Addition and Subtraction", "Multiplication", "Division", "Fractions (Intro)", "Measurement", "Time", "Money", "Data Handling", "Patterns", "Shapes") },
          EVS: { names: { en: "EVS (Environment Around Us)", as: "পৰিবেশ অধ্যয়ন", hi: "पर्यावरण अध्ययन" }, chapters: ch("Family and Friends", "Food and Nutrition", "Plants Around Us", "Animals Around Us", "Shelter", "Water", "Travel and Transport", "Things We Make and Do", "Our Environment", "Health and Hygiene") }
        }
      },
      "Class 4": {
        names: { en: "Class 4", as: "চতুৰ্থ শ্ৰেণী", hi: "कक्षा 4" },
        subjects: {
          Assamese: { names: { en: "Assamese (Ankuran Chaturtha Bhag)", as: "অঙ্কুৰণ চতুৰ্থ ভাগ", hi: "असमिया" }, chapters: ch("Courage", "Honesty", "Prose and Poetry", "Grammar and Composition", "Reading Comprehension") },
          English: { names: { en: "English (Santoor Textbook)", as: "ইংৰাজী", hi: "अंग्रेजी" }, chapters: ch("Together We Can", "The Tinkling Bells", "Be Smart Be Safe", "One Thing at a Time", "The Old Stag", "Braille", "Fit Body Fit Mind Fit Nation", "The Lagori Champions", "Hekko", "The Swing", "A Journey to the Magical Mountains", "Maheshwar") },
          Mathematics: { names: { en: "Mathematics (New Mathematics Part-IV)", as: "নতুন গণিত", hi: "नवीन गणित" }, chapters: ch("Large Numbers", "Roman Numerals", "Factors and Multiples", "Fractions", "Decimals", "Perimeter", "Time and Calendar", "Data Handling", "Geometric Shapes", "Measurement") },
          EVS: { names: { en: "EVS (We and Our Environment)", as: "পৰিবেশ অধ্যয়ন", hi: "पर्यावरण अध्ययन" }, chapters: ch("Family and Friends", "Food and Nutrition", "Shelter", "Water and Sanitation", "Transport", "Things We Make and Do", "Our Environment", "Natural Resources") }
        }
      },
      "Class 5": {
        names: { en: "Class 5", as: "পঞ্চম শ্ৰেণী", hi: "कक्षा 5" },
        subjects: {
          Assamese: { names: { en: "Assamese (Ankuran Pancham Bhag)", as: "অঙ্কুৰণ পঞ্চম ভাগ", hi: "असमिया" }, chapters: ch("My Country", "Stories and Poems", "Grammar and Writing", "Reading Comprehension", "Essay Writing") },
          English: { names: { en: "English (Santoor / My Book of English-V)", as: "ইংৰাজী", hi: "अंग्रेजी" }, chapters: ch("Papa's Spectacles", "Gone with the Scooter", "The Rainbow", "The Wise Parrot", "The Frog", "What a Tank!", "Gilli Danda", "The Decision of the Panchayat", "Vocation", "Glass Bangles", "The Lion King", "Flying Together", "Our Friend Computer", "The Little Fir Tree", "Opening Day!", "Do Your Best") },
          Mathematics: { names: { en: "Mathematics (New Mathematics Part-V)", as: "নতুন গণিত", hi: "नवीन गणित" }, chapters: ch("Large Numbers", "Operations on Large Numbers", "HCF and LCM", "Fractions", "Decimals", "Percentage", "Perimeter and Area", "Volume", "Data Handling", "Profit and Loss") },
          EVS: { names: { en: "EVS (We and Our Environment)", as: "পৰিবেশ অধ্যয়ন", hi: "पर्यावरण अध्ययन" }, chapters: ch("Family and Friends", "Plants and Animals", "Food and Nutrition", "Shelter", "Water", "Travel", "Things We Make and Do", "Natural Resources", "Conservation", "Health and Hygiene") }
        }
      },
      "Class 6": {
        names: { en: "Class 6", as: "ষষ্ঠ শ্ৰেণী", hi: "कक्षा 6" },
        subjects: {
          English: { names: { en: "English (Rainbow-I)", as: "ইংৰাজী", hi: "अंग्रेजी" }, chapters: ch("Prose and Poetry", "Grammar Practice", "Writing Skills", "Comprehension Skills", "Composition") },
          Mathematics: { names: { en: "Mathematics (Ganita Prakash / Natun Ganit)", as: "নতুন গণিত", hi: "नवीन गणित" }, chapters: ch("Patterns in Mathematics", "Lines and Angles", "Number Play", "Data Handling and Presentation", "Prime Time", "Perimeter and Area", "Fractions", "Playing with Constructions", "Symmetry", "The Other Side of Zero (Integers)") },
          Science: { names: { en: "Science (Amar Bijnan / Curiosity)", as: "বিজ্ঞান", hi: "विज्ञान" }, chapters: ch("Food: Where Does It Come From?", "Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "The Living Organisms and Their Surroundings", "Body Movements", "Motion and Measurement of Distances", "Light, Shadows and Reflections", "Electricity and Circuits", "Fun with Magnets", "Water", "Air Around Us", "Garbage In, Garbage Out") },
          "Social Science": { names: { en: "Social Science (Exploring Society: India and Beyond)", as: "সমাজ বিজ্ঞান", hi: "सामाजिक विज्ञान" }, chapters: ch("Locating Places on the Earth", "Oceans and Continents", "Landforms and Life", "Timeline and Sources of History", "India, That Is Bharat", "The Beginnings of Indian Civilisation", "India's Cultural Roots", "Unity in Diversity or Many in the One", "Family and Community", "Grassroots Democracy - Part 1: Governance", "Grassroots Democracy - Part 2: Local Government in Rural Areas", "Grassroots Democracy - Part 3: Local Government in Urban Areas", "The Value of Work", "Economic Activities Around Us") },
          "Value Education": { names: { en: "Value Education (Charitra Path)", as: "চৰিত্ৰ পাঠ", hi: "चरित्र पाठ" }, chapters: ch("Moral Values", "Honesty and Integrity", "Respect for Others", "Responsibility", "Kindness and Compassion", "Discipline", "Cooperation", "Patriotism") }
        }
      },
      "Class 7": {
        names: { en: "Class 7", as: "সপ্তম শ্ৰেণী", hi: "कक्षा 7" },
        subjects: {
          Assamese: { names: { en: "Assamese (Ankuran Saptam Bhag)", as: "অঙ্কুৰণ সপ্তম ভাগ", hi: "असमिया" }, chapters: ch("Prose", "Poetry", "Grammar", "Composition", "Comprehension") },
          English: { names: { en: "English (Sunbeam English Reader-II)", as: "ইংৰাজী", hi: "अंग्रेजी" }, chapters: ch("Prose Selections", "Poetry Selections", "Grammar Practice", "Writing Skills", "Comprehension") },
          Mathematics: { names: { en: "Mathematics", as: "গণিত", hi: "गणित" }, chapters: ch("Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and Its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Practical Geometry", "Perimeter and Area", "Algebraic Expressions", "Exponents and Powers", "Symmetry", "Visualising Solid Shapes") },
          Science: { names: { en: "Science (Bigyan)", as: "বিজ্ঞান", hi: "विज्ञान" }, chapters: ch("Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations", "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms", "Transportation in Animals and Plants", "Reproduction in Plants", "Motion and Time", "Electric Current and Its Effects", "Light", "Water: A Precious Resource", "Forests: Our Lifeline", "Wastewater Story") },
          "Social Science": { names: { en: "Social Science", as: "সমাজ বিজ্ঞান", hi: "सामाजिक विज्ञान" }, chapters: ch("Tracing Changes Through a Thousand Years", "New Kings and Kingdoms", "The Delhi Sultans", "The Mughal Empire", "Environment", "Inside Our Earth", "Our Changing Earth", "Air", "Water", "On Equality", "Role of the Government in Health", "How the State Government Works", "Markets Around Us", "Struggles for Equality") }
        }
      },
      "Class 8": {
        names: { en: "Class 8", as: "অষ্টম শ্ৰেণী", hi: "कक्षा 8" },
        subjects: {
          English: { names: { en: "English (Beginners' English-VIII)", as: "ইংৰাজী", hi: "अंग्रेजी" }, chapters: ch("The Prince of Panidihing", "My Native Land", "Explore India: Quiz Time", "Dokchory Learns about Panchayat", "Louis Pasteur", "A New Day, A New Way", "Sympathy", "Chandraprabha Saikiani") },
          Mathematics: { names: { en: "Mathematics", as: "নতুন গণিত", hi: "नवीन गणित" }, chapters: ch("Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions and Identities", "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions", "Factorisation", "Introduction to Graphs") },
          Science: { names: { en: "Science", as: "বিজ্ঞান", hi: "विज्ञान" }, chapters: ch("Crop Production and Management", "Microorganisms: Friend and Foe", "Synthetic Fibres and Plastics", "Materials: Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame", "Conservation of Plants and Animals", "Cell - Structure and Functions", "Reproduction in Animals", "Reaching the Age of Adolescence", "Force and Pressure", "Friction", "Sound", "Chemical Effects of Electric Current", "Some Natural Phenomena", "Light", "Stars and the Solar System", "Pollution of Air and Water") },
          "Social Science": { names: { en: "Social Science", as: "সমাজ বিজ্ঞান", hi: "सामाजिक विज्ञान" }, chapters: ch("The Making of the National Movement: 1870s-1947", "India After Independence", "Weavers, Iron Smelters and Factory Owners", "Mineral and Power Resources", "Agriculture", "Industries", "Human Resources", "The Indian Constitution", "Understanding Laws", "Judiciary", "Understanding Marginalisation", "Law and Social Justice") }
        }
      },
      "Class 9": {
        names: { en: "Class 9", as: "নৱম শ্ৰেণী", hi: "कक्षा 9" },
        subjects: {
          Mathematics: { names: { en: "Mathematics (General)", as: "সাধাৰণ গণিত", hi: "साधारण गणित" }, chapters: ch("Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles", "Constructions", "Heron's Formula", "Surface Areas and Volumes", "Statistics", "Probability") },
          Science: { names: { en: "Science (General)", as: "সাধাৰণ বিজ্ঞান", hi: "साधारण विज्ञान" }, chapters: ch("Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", "Why Do We Fall Ill", "Natural Resources", "Improvement in Food Resources") },
          "Social Science": { names: { en: "Social Science", as: "সমাজ বিজ্ঞান", hi: "सामाजिक विज्ञान" }, chapters: ch("Advent of Europeans into India", "Growth of Indian Nationalism", "The Moamoriya Rebellion", "Burmese Invasions of Assam", "Beginning of British Administration in Assam", "Changes of Earth's Surface", "Atmosphere: Structure, Pressure Belts and Wind System", "Geography of India", "Geography of Assam", "Political Parties in India", "Types of Government", "Basic Concepts of Economics", "Basic Economic Problems") },
          English: { names: { en: "English (Second Language)", as: "ইংৰাজী", hi: "अंग्रेजी" }, chapters: ch("Beehive", "Moments", "Writing and Grammar") }
        }
      },
      "Class 10": {
        names: { en: "Class 10", as: "দশম শ্ৰেণী", hi: "कक्षा 10" },
        subjects: {
          Mathematics: { names: { en: "Mathematics (General)", as: "সাধাৰণ গণিত", hi: "साधारण गणित" }, chapters: ch("Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Applications of Trigonometry", "Circles", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability") },
          Science: { names: { en: "Science (General)", as: "সাধাৰণ বিজ্ঞান", hi: "साधारण विज्ञान" }, chapters: ch("Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and Its Compounds", "Periodic Classification of Elements", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Light - Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Sources of Energy", "Our Environment", "Sustainable Management of Natural Resources") },
          "Social Science": { names: { en: "Social Science", as: "সমাজ বিজ্ঞান", hi: "सामाजिक विज्ञान" }, chapters: ch("Advent of Europeans into India", "Growth of Indian Nationalism", "The Moamoriya Rebellion", "Burmese Invasions of Assam", "Beginning of British Administration in Assam", "Changes of Earth's Surface", "Atmosphere: Structure, Pressure Belts and Wind System", "Geography of India", "Geography of Assam", "Political Parties in India", "Types of Government", "Basic Concepts of Economics", "Basic Economic Problems") },
          English: { names: { en: "English (Second Language)", as: "ইংৰাজী", hi: "अंग्रेजी" }, chapters: ch("A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Glimpses of India", "Madam Rides the Bus", "A Tiger in the Zoo", "Amanda!", "Animals", "The Ball Poem", "The Tale of Custard the Dragon", "The Midnight Visitor", "A Question of Trust", "Footprints without Feet", "The Hack Driver") }
        }
      }
    }
  },
  CBSE: {
    names: { en: "CBSE (National Board)", as: "CBSE (ৰাষ্ট্ৰীয় ব'ৰ্ড)", hi: "CBSE (राष्ट्रीय बोर्ड)" },
    classes: {
      "Class 1": makePrimaryClass(1, {
        English: { names: t("English (Joyful Series)"), chapters: ch("Fun with Letters", "My Family", "My School", "My Body", "Rhymes and Stories", "Simple Sentences") },
        Hindi: { names: t("Hindi (Rimjhim)"), chapters: ch("अक्षर ज्ञान", "मेरा घर", "मेरे दोस्त", "चित्र देखकर बोलो", "छोटी कविताएँ", "सरल शब्द") },
        Mathematics: { names: t("Mathematics (Joyful Maths)"), chapters: ch("Number Play", "Shapes Around Us", "Addition Basics", "Subtraction Basics", "Comparisons", "Patterns") },
        EVS: { names: t("EV Studies"), chapters: ch("My Family", "My Body", "Plants and Animals", "Food and Water", "Our Home", "Seasons") }
      }),
      "Class 2": makePrimaryClass(2, {
        English: { names: t("English (Mridang)"), chapters: ch("My Bicycle", "Picture Reading", "It is Fun", "Seeing without Eyes", "Come Back Soon", "Between Home and School", "This is My Town", "A Show of Clouds", "My Name", "The Crow", "The Smart Monkey", "Little Drops of Water", "We are all Indians") },
        Hindi: { names: t("Hindi (Rimjhim)"), chapters: ch("शब्द और वाक्य", "मेरा शहर", "पानी का महत्व", "कहानी पढ़ना", "व्याकरण परिचय", "पाठ समझ") },
        Mathematics: { names: t("Mathematics (Joyful Maths)"), chapters: ch("A Day at the Beach", "Shapes Around Us", "Fun with Numbers", "Numbers 10 to 99", "Numbers up to 1000", "Addition and Subtraction", "Multiplication Tables", "Time", "Money", "Measurement") }
      }),
      "Class 3": makePrimaryClass(3, {
        English: { names: t("English (My Book of English-III)"), chapters: ch("Arun's Family", "The Monkey and the Elephant", "Lalu and Peelu", "The Mouse and the Pencil", "My Wish", "Bugs", "Our National Symbols", "Means of Transport", "Clean Clean", "Jamun Tree", "Hello Rain!", "Walking with Grandpa", "Traffic Rules", "What's in the Mailbox", "Clean Your Body") },
        Hindi: { names: t("Hindi (Rimjhim)"), chapters: ch("कविता पाठ", "कहानी समय", "व्याकरण परिचय", "अनुच्छेद लेखन", "शब्द भंडार") },
        Mathematics: { names: t("Mathematics (Math-Magic)"), chapters: ch("Number Games", "Three-Digit Numbers", "Addition and Subtraction", "Multiplication", "Division", "Fractions (Intro)", "Measurement", "Time", "Money", "Data Handling", "Patterns", "Shapes") },
        EVS: { names: t("EVS (Looking Around)"), chapters: ch("Family and Friends", "Food We Eat", "Shelter", "Water", "Travel", "Things We Make and Do", "Plants and Animals") }
      }),
      "Class 4": makePrimaryClass(4, {
        English: { names: t("English (Santoor)"), chapters: ch("Together We Can", "The Tinkling Bells", "Be Smart Be Safe", "One Thing at a Time", "The Old Stag", "Braille", "Fit Body Fit Mind Fit Nation", "The Lagori Champions", "Hekko", "The Swing", "A Journey to the Magical Mountains", "Maheshwar") },
        Hindi: { names: t("Hindi (Rimjhim/Gyankranti)"), chapters: ch("पठन कौशल", "रचनात्मक लेखन", "अनुच्छेद लेखन", "पत्र लेखन", "मुहावरे और लोकोक्तियाँ") },
        Mathematics: { names: t("Mathematics (Math-Magic)"), chapters: ch("Large Numbers", "Roman Numerals", "Factors and Multiples", "Fractions", "Decimals", "Time and Calendar", "Perimeter", "Data Handling", "Geometric Shapes", "Measurement") },
        EVS: { names: t("EVS (Looking Around)"), chapters: ch("Family and Friends", "Food and Nutrition", "Shelter", "Water and Sanitation", "Transport", "Things We Make and Do", "Natural Resources") }
      }),
      "Class 5": makePrimaryClass(5, {
        English: { names: t("English (Santoor / Marigold)"), chapters: ch("Papa's Spectacles", "Gone with the Scooter", "The Rainbow", "The Wise Parrot", "The Frog", "What a Tank!", "Gilli Danda", "The Decision of the Panchayat", "Vocation", "Glass Bangles", "Ice-cream Man", "Teamwork", "My Shadow", "The Lazy Frog", "Class Discussion", "Topsy-turvy Land") },
        Hindi: { names: t("Hindi (Rimjhim/Gyankranti)"), chapters: ch("पाठ समझ", "पत्र लेखन", "मुहावरे", "रचनात्मक लेखन", "निबंध लेखन") },
        Mathematics: { names: t("Mathematics (Math-Magic)"), chapters: ch("Large Numbers", "HCF and LCM", "Fractions", "Decimals", "Percentage", "Perimeter and Area", "Volume", "Data Handling", "Profit and Loss", "Simple Interest") },
        EVS: { names: t("EVS (Looking Around)"), chapters: ch("Family and Friends", "Plants and Animals", "Food", "Shelter", "Water", "Travel", "Things We Make and Do", "Natural Resources") }
      }),
      "Class 6": makePrimaryClass(6, {
        English: { names: t("English (Poorvi)"), chapters: ch("Prose and Poetry Selections", "Grammar Practice", "Writing Skills", "Comprehension Skills", "Composition", "The Wit that Won Hearts", "A Concrete Example", "A Tale of Valour", "The Cherry Tree", "Magnifying Glass") },
        Hindi: { names: t("Hindi (Malhar)"), chapters: ch("वाचन कौशल", "व्याकरण", "लेखन कौशल", "पाठ समझ") },
        Mathematics: { names: t("Mathematics (Ganita Prakash)"), chapters: ch("Patterns in Mathematics", "Lines and Angles", "Number Play", "Data Handling and Presentation", "Prime Time", "Perimeter and Area", "Fractions", "Playing with Constructions", "Symmetry", "The Other Side of Zero") },
        Science: { names: t("Science (Curiosity)"), chapters: ch("Food: Where Does It Come From?", "Components of Food", "Fibre to Fabric", "Sorting Materials into Groups", "Separation of Substances", "Changes Around Us", "The Living Organisms and Their Surroundings", "Motion and Measurement of Distances", "Light, Shadows and Reflections", "Electricity and Circuits", "Water", "Air Around Us", "Garbage In, Garbage Out") },
        "Social Science": { names: t("Social Science (Exploring Society)"), chapters: ch("Locating Places on the Earth", "Oceans and Continents", "Landforms and Life", "Timeline and Sources of History", "India, That Is Bharat", "The Beginnings of Indian Civilisation", "India's Cultural Roots", "Unity in Diversity or Many in the One", "Family and Community", "Grassroots Democracy - Part 1: Governance", "Grassroots Democracy - Part 2: Local Government in Rural Areas", "Grassroots Democracy - Part 3: Local Government in Urban Areas", "The Value of Work", "Economic Activities Around Us") }
      }),
      "Class 7": makePrimaryClass(7, {
        English: { names: t("English (Honeycomb)"), chapters: ch("Three Questions", "The Squirrel", "The Invention of Vita-Wonk", "A Gift of Chappals", "Gopal and the Hilsa Fish", "The Ashes that Made Trees Bloom", "The Necklace", "An Indian-American Woman in Space", "Chivalry", "A Vision of the Future", "The Bear Story", "Daffodils", "Trees", "Meadow Surprises") },
        Hindi: { names: t("Hindi (Vasant/Durva)"), chapters: ch("वसंत पाठ", "दुर्वेद", "व्याकरण", "रचनात्मक लेखन") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and Its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Practical Geometry", "Perimeter and Area", "Algebraic Expressions", "Exponents and Powers", "Symmetry", "Visualising Solid Shapes") },
        Science: { names: t("Science"), chapters: ch("Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Weather, Climate and Adaptations", "Winds, Storms and Cyclones", "Soil", "Respiration in Organisms", "Transportation in Animals and Plants", "Reproduction in Plants", "Motion and Time", "Electric Current and Its Effects", "Light", "Water: A Precious Resource", "Forests: Our Lifeline", "Wastewater Story") },
        "Social Science": { names: t("Social Science"), chapters: ch("Tracing Changes Through a Thousand Years", "New Kings and Kingdoms", "The Delhi Sultans", "The Mughal Empire", "Environment", "Inside Our Earth", "Our Changing Earth", "Air", "Water", "On Equality", "How the State Government Works", "Markets Around Us", "Struggles for Equality") }
      }),
      "Class 8": makePrimaryClass(8, {
        English: { names: t("English (It So Happened / Honeydew)"), chapters: ch("The Wit that Won Hearts", "A Concrete Example", "A Tale of Valour", "The Cherry Tree", "Magnifying Glass", "The Best Christmas Present in the World", "The Tsunami", "Glimpses of the Past", "Bepin Choudhury's Lapse of Memory", "The Summit Within", "This is Jody's Fawn", "A Visit to Cambridge", "A Short Monsoon Diary", "The Ant and the Cricket") },
        Hindi: { names: t("Hindi (Kshitij)"), chapters: ch("पाठ संग्रह", "व्याकरण", "लेखन", "निबंध") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Practical Geometry", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions and Identities", "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions", "Factorisation", "Introduction to Graphs") },
        Science: { names: t("Science"), chapters: ch("Crop Production and Management", "Microorganisms: Friend and Foe", "Synthetic Fibres and Plastics", "Materials: Metals and Non-Metals", "Coal and Petroleum", "Combustion and Flame", "Conservation of Plants and Animals", "Cell - Structure and Functions", "Reproduction in Animals", "Reaching the Age of Adolescence", "Force and Pressure", "Friction", "Sound", "Chemical Effects of Electric Current", "Some Natural Phenomena", "Light", "Stars and the Solar System", "Pollution of Air and Water") },
        "Social Science": { names: t("Social Science"), chapters: ch("How, When and Where", "From Trade to Territory", "Ruling the Countryside", "Tribals, Dikus and the Vision of a Golden Age", "Rebels and the Raj of 1857", "The Making of the National Movement", "India After Independence", "Resources", "Land, Soil, Water, Natural Vegetation and Wildlife", "Mineral and Power Resources", "Agriculture", "Industries", "Human Resources", "The Indian Constitution", "Understanding Laws", "Judiciary", "Understanding Marginalisation", "Law and Social Justice") }
      }),
      "Class 9": makePrimaryClass(9, {
        English: { names: t("English (Beehive & Moments)"), chapters: ch("The Fun They Had", "The Sound of Music", "The Little Girl", "A Truly Beautiful Mind", "The Snake and the Mirror", "My Childhood", "From Mother Dear", "Mystery of the Missing Cap", "No Men Are Foreign", "A Legend of the North", "Wind", "The Road Not Taken", "Rain on the Roof", "The Lake Isle of Innisfree") },
        Hindi: { names: t("Hindi (Kshitij & Kritika)"), chapters: ch("क्षितिज पाठ", "कृतिका पाठ", "व्याकरण") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Areas of Parallelograms and Triangles", "Circles", "Constructions", "Heron's Formula", "Surface Areas and Volumes", "Statistics", "Probability") },
        Science: { names: t("Science"), chapters: ch("Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Diversity in Living Organisms", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", "Why Do We Fall Ill", "Natural Resources", "Improvement in Food Resources") },
        "Social Science": { names: t("Social Science"), chapters: ch("The French Revolution", "Socialism in Europe and the Russian Revolution", "Nazism and the Rise of Hitler", "Forest Society and Colonialism", "Pastoralists in the Modern World", "India - Size and Location", "Physical Features of India", "Drainage", "Climate", "Natural Vegetation and Wildlife", "Population", "Democratic Politics", "People as Resource", "Poverty as a Challenge", "Food Security in India") }
      }),
      "Class 10": makePrimaryClass(10, {
        English: { names: t("English (First Flight & Footprints)"), chapters: ch("A Letter to God", "Nelson Mandela: Long Walk to Freedom", "Two Tales of Flying", "Question from Travel", "Glimpses of India (Coorg)", "Glimpses of India (Tea from Assam)", "Glimpses of India (Baker from Goa)", "Mijbil the Otter", "Madam Rides the Bus", "The Serpent and the Eagle", "The Proposal", "The Thief's Story", "A Tiger in the Zoo", "Amanda!", "Animals", "The Ball Poem", "The Tale of Custard the Dragon", "The Midnight Visitor", "A Question of Trust", "Footprints without Feet", "The Hack Driver", "The Necklace", "The Hidden Teacher") },
        Hindi: { names: t("Hindi (Kshitij, Kritika, Sparsh & Sanchayan)"), chapters: ch("क्षितिज पाठ", "कृतिका पाठ", "स्पर्श पाठ", "संचयन भाग 2") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Applications of Trigonometry", "Circles", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability") },
        Science: { names: t("Science"), chapters: ch("Chemical Reactions and Equations", "Acids, Bases and Salts", "Metals and Non-metals", "Carbon and Its Compounds", "Life Processes", "Control and Coordination", "How do Organisms Reproduce?", "Heredity and Evolution", "Light - Reflection and Refraction", "The Human Eye and the Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment") },
        "Social Science": { names: t("Social Science"), chapters: ch("Rise of Nationalism in Europe", "Nationalism in India", "The Making of a Global World", "The Age of Industrialization", "Print Culture and the Modern World", "Novels, Society and History", "Resources and Development", "Agriculture", "Minerals and Energy Resources", "Manufacturing Industries", "Lifelines of National Economy", "Development", "Sectors of the Indian Economy", "Money and Credit", "Globalisation and the Indian Economy", "Power-sharing", "Federalism", "Gender, Religion and Caste", "Political Parties", "Outcomes of Democracy", "Popular Struggles and Movements") }
      })
    }
  },
  ICSE: {
    names: { en: "ICSE (CISCE)", as: "ICSE", hi: "ICSE" },
    classes: {
      "Class 1": makePrimaryClass(1, {
        English: { names: t("English"), chapters: ch("Phonics", "Simple Sentences", "Story Time", "Rhymes", "Picture Reading", "Alphabet Practice") },
        Hindi: { names: t("Hindi"), chapters: ch("वर्णमाला", "शब्द निर्माण", "चित्र वर्णन", "सरल वाक्य", "मात्राएँ") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Numbers 1-100", "Shapes", "Addition", "Subtraction", "Comparison", "Patterns") }
      }),
      "Class 2": makePrimaryClass(2, {
        English: { names: t("English"), chapters: ch("Reading Skills", "Rhymes", "Vocabulary", "Comprehension", "Sentence Building", "Creative Writing") },
        Hindi: { names: t("Hindi"), chapters: ch("पठन", "लेखन", "व्याकरण परिचय", "शब्द भंडार", "पाठ समझ") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Place Value", "Addition and Subtraction", "Multiplication Basics", "Time", "Money", "Measurement", "Shapes and Space") }
      }),
      "Class 3": makePrimaryClass(3, {
        English: { names: t("English"), chapters: ch("Comprehension", "Poetry", "Grammar", "Creative Writing", "Story Reading", "Essay Writing") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Numbers up to 9999", "Multiplication", "Division", "Fractions", "Measurement", "Time", "Money", "Data Handling", "Geometric Shapes") },
        EVS: { names: t("Environmental Studies"), chapters: ch("Our Body", "Plants", "Animals", "Our Neighborhood", "Transport", "Safety", "Air and Water", "Seasons") },
        "Computer Studies": { names: t("Computer Studies"), chapters: ch("Computer Basics", "Input Devices", "Paint Tools", "Keyboard Skills", "Parts of Computer") }
      }),
      "Class 4": makePrimaryClass(4, {
        English: { names: t("English"), chapters: ch("Prose", "Poetry", "Creative Writing", "Comprehension", "Grammar Practice", "Letter Writing") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Large Numbers", "Factors and Multiples", "Fractions", "Decimals", "Geometry", "Perimeter", "Area", "Data Handling", "Time and Calendar") },
        EVS: { names: t("Environmental Studies"), chapters: ch("Food and Digestion", "Plants and Animals", "Transport", "Pollution", "Water", "Natural Resources", "Our Environment", "Solar System") },
        "Computer Studies": { names: t("Computer Studies"), chapters: ch("Files and Folders", "Word Processing", "Internet Safety", "Presentations", "MS Paint") }
      }),
      "Class 5": makePrimaryClass(5, {
        English: { names: t("English"), chapters: ch("Comprehension", "Grammar", "Composition", "Poetry Appreciation", "Letter Writing", "Notice Writing", "Dialogue Writing") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Large Numbers", "Fractions", "Decimals", "Percentage", "Area and Perimeter", "Volume", "Data Interpretation", "Profit and Loss", "Average") },
        EVS: { names: t("Environmental Studies"), chapters: ch("Human Body Systems", "Natural Resources", "Energy", "Weather and Climate", "Conservation", "Indian Geography", "Solar System") },
        "Computer Studies": { names: t("Computer Studies"), chapters: ch("Algorithms", "Presentations", "Email Basics", "Internet and Communication", "Flowcharts") }
      }),
      "Class 6": makePrimaryClass(6, {
        English: { names: t("English"), chapters: ch("Language Skills", "Literature", "Grammar", "Composition", "Letter Writing", "Essay Writing") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Number System", "HCF and LCM", "Fractions", "Decimals", "Ratio and Proportion", "Basic Algebra", "Mensuration", "Practical Geometry", "Data Handling", "Integers", "Sets") },
        Science: { names: t("Science"), chapters: ch("Matter", "Physical Quantities and Measurement", "Force", "Energy", "Living Organisms", "Cell Structure", "Human Body Systems", "Air and Atmosphere", "Magnets") },
        "History & Civics": { names: t("History & Civics"), chapters: ch("River Valley Civilisations", "The Vedic Period", "Rise of Kingdoms", "Early Empires", "Understanding Government", "Fundamental Rights and Duties") },
        Geography: { names: t("Geography"), chapters: ch("Earth and Globe", "Maps", "Latitudes and Longitudes", "Major Landforms", "Climate", "Natural Vegetation", "Water Resources") },
        "Computer Studies": { names: t("Computer Studies"), chapters: ch("Programming Basics", "Spreadsheets", "Cyber Safety", "HTML Basics") }
      }),
      "Class 7": makePrimaryClass(7, {
        English: { names: t("English"), chapters: ch("Language", "Literature", "Composition", "Letter Writing", "Notice and Email", "Summary Writing") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Rational Numbers", "Algebraic Expressions", "Linear Equations", "Simple Interest", "Practical Geometry", "Perimeter and Area", "Data Handling", "Visualising Solid Shapes", "Exponents") },
        Science: { names: t("Science"), chapters: ch("Nutrition", "Heat", "Acids and Bases", "Physical and Chemical Changes", "Respiration", "Transportation in Plants and Animals", "Reproduction in Plants", "Light", "Electric Current", "Motion") },
        "History & Civics": { names: t("History & Civics"), chapters: ch("Medieval India", "The Delhi Sultanate", "The Mughal Empire", "The Constitution of India", "Role of Government", "Media and Democracy") },
        Geography: { names: t("Geography"), chapters: ch("Atmosphere", "Hydrosphere", "Natural Vegetation", "Human Environment", "Settlements", "Transport and Communication", "Maps") },
        "Computer Studies": { names: t("Computer Studies"), chapters: ch("Flowcharts", "Data Representation", "Ethical Computing", "Python Basics") }
      }),
      "Class 8": makePrimaryClass(8, {
        English: { names: t("English"), chapters: ch("Prose", "Poetry", "Drama", "Essay Writing", "Letter Writing", "Comprehension Skills") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Linear Equations", "Rational Numbers", "Comparing Quantities", "Algebraic Expressions and Identities", "Mensuration", "Data Handling", "Exponents and Powers", "Factorisation", "Squares and Cube Roots", "Direct and Inverse Proportion") },
        Science: { names: t("Science"), chapters: ch("Crop Production", "Microorganisms", "Metals and Non-metals", "Coal and Petroleum","Cell Structure", "Reproduction", "Force and Pressure", "Sound", "Light", "Chemical Effects of Electric Current", "Natural Phenomena", "Stars and Solar System") },
        "History & Civics": { names: t("History & Civics"), chapters: ch("Colonial India", "The Revolt of 1857", "National Movement", "Indian Constitution", "Parliament", "Judiciary", "Preamble and Fundamental Rights") },
        Geography: { names: t("Geography"), chapters: ch("Resources", "Agriculture", "Industries", "Mineral Resources", "Human Resources", "Natural Hazards", "Climate of India") },
        "Computer Studies": { names: t("Computer Studies"), chapters: ch("Object-Oriented Basics", "HTML Intro", "Networking", "Cyber Security") }
      }),
      "Class 9": makePrimaryClass(9, {
        "English Language": { names: t("English Language"), chapters: ch("Composition", "Letter Writing", "Notice and Email", "Grammar Practice", "Comprehension", "Summary Writing") },
        "English Literature": { names: t("English Literature"), chapters: ch("Prose", "Poetry", "Drama", "Character Analysis", "Theme-based Questions") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Rational and Irrational Numbers", "Compound Interest", "Expansions", "Factorisation", "Simultaneous Linear Equations", "Algebraic Fractions", "Indices", "Coordinate Geometry", "Geometry", "Mensuration", "Trigonometry", "Statistics", "Probability") },
        Physics: { names: t("Physics"), chapters: ch("Measurements and Experimentation", "Motion in One Dimension", "Laws of Motion", "Pressure in Fluids and Atmospheric Pressure", "Upthrust in Fluids", "Heat and Energy", "Light", "Sound", "Electricity and Magnetism") },
        Chemistry: { names: t("Chemistry"), chapters: ch("Matter and Its Composition", "Atomic Structure and Chemical Bonding", "Periodic Table", "Study of Gas Laws", "Electrolysis", "Metallurgy", "Acids, Bases and Salts") },
        Biology: { names: t("Biology"), chapters: ch("Cell", "Tissues", "Plant Physiology", "Human Anatomy", "Health and Hygiene", "Pollution and Conservation") },
        "History & Civics": { names: t("History & Civics"), chapters: ch("Harappan Civilisation", "The Mauryan Empire", "The Sangam Age", "The Constitution of India", "Fundamental Rights", "Directive Principles") },
        Geography: { names: t("Geography"), chapters: ch("Earth as a Planet", "Geographic Grid", "Rotation and Revolution", "Climate", "Natural Regions of the World", "Map Work") },
        "Computer Applications": { names: t("Computer Applications"), chapters: ch("Java Basics", "Control Structures", "Arrays", "Functions") }
      }),
      "Class 10": makePrimaryClass(10, {
        "English Language": { names: t("English Language"), chapters: ch("Essay and Letter", "Notice and Email", "Comprehension", "Functional Grammar", "Summary Writing", "Dialogue Writing") },
        "English Literature": { names: t("English Literature"), chapters: ch("Short Stories", "Poetry", "Drama Text", "Critical Appreciation", "Theme and Context Questions") },
        Mathematics: { names: t("Mathematics"), chapters: ch("GST", "Banking", "Shares and Dividends", "Linear Inequations", "Quadratic Equations", "Matrices", "Arithmetic and Geometric Progression", "Coordinate Geometry", "Similarity", "Circles", "Mensuration", "Trigonometry", "Statistics", "Probability") },
        Physics: { names: t("Physics"), chapters: ch("Force and Work", "Machines", "Refraction through Lens", "Spectrum", "Sound", "Current Electricity", "Household Circuits", "Electromagnetism", "Radioactivity") },
        Chemistry: { names: t("Chemistry"), chapters: ch("Periodic Properties", "Chemical Bonding", "Acids Bases and Salts", "Analytical Chemistry", "Mole Concept", "Electrolysis", "Metallurgy", "Organic Chemistry") },
        Biology: { names: t("Biology"), chapters: ch("Genetics", "Absorption and Assimilation", "Circulatory System", "Nervous System", "Sense Organs", "Human Evolution", "Population", "Pollution", "Excretory System") },
        "History & Civics": { names: t("History & Civics"), chapters: ch("First War of Independence", "Growth of Nationalism", "Freedom Movement", "The Union Parliament", "The Judiciary", "UN and International Agencies") },
        Geography: { names: t("Geography"), chapters: ch("Transport", "Waste Management", "India Agriculture", "Mineral and Energy Resources", "Manufacturing Industries", "Climate of India", "Map Work") },
        "Computer Applications": { names: t("Computer Applications"), chapters: ch("Classes and Objects", "String Handling", "Program Design", "Arrays", "Functions") }
      })
    }
  },
  AJBEC: {
    names: { en: "AJBEC (Assam Jatiya Bidyalay)", as: "AJBEC (অসম জাতীয় বিদ্যালয়)", hi: "AJBEC (असम जातीय विद्यालय)" },
    classes: {
      "Class 1": makePrimaryClass(1, {
        Assamese: { names: t("Assamese"), chapters: ch("Alphabet", "Simple Words", "Rhymes", "Picture Reading", "Listening and Speaking") },
        English: { names: t("English"), chapters: ch("Letters", "Basic Vocabulary", "My Home", "My School", "Simple Sentences") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Counting", "Shapes", "Addition", "Subtraction", "Patterns") }
      }),
      "Class 2": makePrimaryClass(2, {
        Assamese: { names: t("Assamese"), chapters: ch("Reading Practice", "Story Time", "Grammar Basics", "Poems", "Short Writing") },
        English: { names: t("English"), chapters: ch("Simple Sentences", "Reading Aloud", "Picture Description", "Vocabulary Building", "Everyday Conversation", "My Friends") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Numbers up to 100", "Addition and Subtraction", "Multiplication Basics", "Time", "Money", "Measurement", "Shapes") }
      }),
      "Class 3": makePrimaryClass(3, {
        Assamese: { names: t("Assamese"), chapters: ch("Prose", "Poetry", "Language Skills", "Grammar Practice", "Composition") },
        English: { names: t("English"), chapters: ch("Comprehension", "Poems", "Vocabulary", "Grammar", "Creative Writing", "Story Reading") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Multiplication", "Division", "Money", "Fractions", "Measurement", "Data Handling", "Time") },
        EVS: { names: t("EVS"), chapters: ch("Plants", "Food", "Water", "Family and Friends", "Shelter", "Travel", "Animals") }
      }),
      "Class 4": makePrimaryClass(4, {
        Assamese: { names: t("Assamese"), chapters: ch("Reading", "Writing", "Grammar", "Poetry", "Essay") },
        English: { names: t("English"), chapters: ch("Prose", "Poetry", "Grammar", "Letter Writing", "Comprehension", "Vocabulary") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Factors", "Fractions", "Decimals", "Geometry Basics", "Perimeter", "Data Handling", "Time and Calendar") },
        EVS: { names: t("EVS"), chapters: ch("Family and Community", "Food and Health", "Transport", "Clean Environment", "Water and Hygiene", "Natural Resources") }
      }),
      "Class 5": makePrimaryClass(5, {
        Assamese: { names: t("Assamese"), chapters: ch("Language and Literature", "Composition", "Grammar", "Poetry", "Story Writing") },
        English: { names: t("English"), chapters: ch("Reading Skills", "Creative Writing", "Grammar Practice", "Comprehension", "Vocabulary", "Essay Writing") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Decimals", "Percentage", "Fractions", "Area and Perimeter", "Volume", "Data Handling", "Profit and Loss") },
        EVS: { names: t("EVS"), chapters: ch("Natural Resources", "Health and Hygiene", "Travel", "Plants and Animals", "Work and Community", "Conservation") }
      }),
      "Class 6": makePrimaryClass(6, {
        Assamese: { names: t("Assamese"), chapters: ch("Ankuran Reader", "Grammar", "Essay Writing", "Poetry", "Comprehension") },
        English: { names: t("English (Rainbow Reader)"), chapters: ch("Prose Selections", "Poetry", "Writing Skills", "Grammar Practice", "Comprehension") },
        Mathematics: { names: t("Mathematics (Ganita Prakash)"), chapters: ch("Patterns in Mathematics", "Lines and Angles", "Number Play", "Data Handling and Presentation", "Prime Time", "Perimeter and Area", "Fractions", "Playing with Constructions", "Symmetry", "Integers") },
        Science: { names: t("Science"), chapters: ch("Food and Nutrition", "Separation of Substances", "Changes Around Us", "The Living World", "Body Movements", "Motion and Measurement", "Electricity and Circuits", "Water", "Air Around Us") },
        "Social Science": { names: t("Social Science"), chapters: ch("Locating Places on Earth", "Landforms and Life", "Timeline and Sources", "Family and Community", "Grassroots Democracy", "Economic Activities Around Us") },
        "Assam History": { names: t("Assam History"), chapters: ch("Early Assam", "Medieval Assam", "Culture of Assam", "People of Assam") }
      }),
      "Class 7": makePrimaryClass(7, {
        Assamese: { names: t("Assamese"), chapters: ch("Literature", "Grammar", "Creative Writing", "Poetry", "Comprehension") },
        English: { names: t("English (Sunbeam Reader)"), chapters: ch("Prose Selections", "Poetry", "Composition", "Grammar Practice", "Comprehension") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Integers", "Fractions and Decimals", "Data Handling", "Simple Equations", "Lines and Angles", "The Triangle and Its Properties", "Congruence of Triangles", "Comparing Quantities", "Rational Numbers", "Perimeter and Area", "Exponents and Powers") },
        Science: { names: t("Science"), chapters: ch("Nutrition in Plants", "Nutrition in Animals", "Fibre to Fabric", "Heat", "Acids, Bases and Salts", "Physical and Chemical Changes", "Soil", "Respiration", "Reproduction in Plants", "Motion and Time", "Light") },
        "Social Science": { names: t("Social Science"), chapters: ch("Tracing Changes Through a Thousand Years", "The Delhi Sultans", "The Mughal Empire", "Environment", "Our Changing Earth", "On Equality", "State Government", "Markets Around Us") },
        "Assam History": { names: t("Assam History"), chapters: ch("Ahom Era", "Colonial Assam", "Reformers of Assam", "Freedom Struggle in Assam") }
      }),
      "Class 8": makePrimaryClass(8, {
        Assamese: { names: t("Assamese"), chapters: ch("Assamese Reader", "Grammar", "Essay Writing", "Poetry", "Composition") },
        English: { names: t("English"), chapters: ch("The Prince of Panidihing", "My Native Land", "Explore India: Quiz Time", "Dokchory Learns about Panchayat", "Louis Pasteur", "A New Day, A New Way", "Sympathy", "Chandraprabha Saikiani") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Rational Numbers", "Linear Equations in One Variable", "Understanding Quadrilaterals", "Data Handling", "Squares and Square Roots", "Cubes and Cube Roots", "Comparing Quantities", "Algebraic Expressions and Identities", "Mensuration", "Exponents and Powers", "Direct and Inverse Proportions", "Factorisation", "Introduction to Graphs") },
        Science: { names: t("Science"), chapters: ch("Crop Production and Management", "Microorganisms", "Synthetic Fibres and Plastics", "Metals and Non-metals", "Coal and Petroleum", "Combustion and Flame", "Cell Structure", "Reproduction in Animals", "Force and Pressure", "Sound", "Light", "Pollution of Air and Water") },
        "Social Science": { names: t("Social Science"), chapters: ch("The Making of the National Movement", "India After Independence", "Weavers, Iron Smelters and Factory Owners", "Mineral and Power Resources", "Agriculture", "Industries", "The Indian Constitution", "Understanding Laws", "Judiciary", "Understanding Marginalisation") },
        "Assam History": { names: t("Assam History"), chapters: ch("Freedom Movement in Assam", "Modern Assam", "Regional Institutions", "Cultural Heritage of Assam") }
      }),
      "Class 9": makePrimaryClass(9, {
        Assamese: { names: t("Assamese"), chapters: ch("Language Paper", "Literature", "Grammar and Composition", "Poetry", "Essay Writing") },
        English: { names: t("English"), chapters: ch("English Reader", "Grammar", "Writing Skills", "Comprehension", "Composition") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Number System", "Polynomials", "Coordinate Geometry", "Linear Equations", "Lines and Angles", "Triangles", "Quadrilaterals", "Circles", "Heron's Formula", "Surface Areas and Volumes", "Probability") },
        Science: { names: t("Science"), chapters: ch("Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Cell", "Tissues", "Diversity in Living Organisms", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound") },
        "Social Science": { names: t("Social Science"), chapters: ch("Advent of Europeans into India", "Growth of Indian Nationalism", "The Moamoriya Rebellion", "Burmese Invasions of Assam", "Changes of Earth's Surface", "Atmosphere", "Political Parties in India", "Basic Economic Problems") }
      }),
      "Class 10": makePrimaryClass(10, {
        Assamese: { names: t("Assamese"), chapters: ch("MIL Assamese", "Literature", "Grammar", "Poetry", "Essay Writing") },
        English: { names: t("English"), chapters: ch("Reading Comprehension", "Grammar", "Letter and Essay", "Writing Skills", "Composition") },
        Mathematics: { names: t("Mathematics"), chapters: ch("Real Numbers", "Polynomials", "Linear Equations in Two Variables", "Triangles", "Trigonometry", "Circles", "Mensuration", "Statistics and Probability") },
        Science: { names: t("Science"), chapters: ch("Chemical Reactions", "Acids Bases and Salts", "Metals and Non-metals", "Carbon and Its Compounds", "Life Processes", "Control and Coordination", "Heredity and Evolution", "Electricity", "Magnetic Effects", "Our Environment") },
        "Social Science": { names: t("Social Science"), chapters: ch("Growth of Indian Nationalism", "Burmese Invasions of Assam", "Geography of India", "Geography of Assam", "Political Parties in India", "Types of Government", "Basic Concepts of Economics") }
      }),
      "Class 11": {
        names: { en: "Class 11 (HS 1st Year)", as: "একাদশ শ্ৰেণী (উচ্চ মাধ্যমিক ১ম বৰ্ষ)", hi: "कक्षा 11 (उच्च माध्यमिक प्रथम वर्ष)" },
        subjects: {
          Physics: { names: t("Physics"), chapters: ch("Physical World and Measurement", "Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion", "Work, Energy and Power", "Motion of a System of Particles and a Rigid Body", "Gravitation", "Properties of Bulk Matter", "Thermodynamics", "Kinetic Theory of Gases", "Oscillations and Waves") },
          Chemistry: { names: t("Chemistry"), chapters: ch("Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements and Periodicity in Properties", "Chemical Bonding and Molecular Structure", "Chemical Thermodynamics", "Equilibrium", "Redox Reactions", "Organic Chemistry: Some Basic Principles and Techniques", "Hydrocarbons") },
          Mathematics: { names: t("Mathematics"), chapters: ch("Sets and Functions", "Algebra (Sequences and Series, Binomial Theorem)", "Coordinate Geometry", "Calculus (Limits and Derivatives)", "Statistics and Probability", "Mathematical Reasoning") },
          Biology: { names: t("Biology"), chapters: ch("Diversity in the Living World", "Structural Organisation in Plants", "Cell: Structure and Function", "Plant Physiology", "Structural Organisation in Animals", "Human Physiology") },
          "Accountancy": { names: t("Accountancy"), chapters: ch("Introduction to Accounting", "Theory Base of Accounting", "Recording of Business Transactions", "Trial Balance and Rectification of Errors", "Depreciation, Provisions and Reserves", "Financial Statements") },
          "Business Studies": { names: t("Business Studies"), chapters: ch("Business, Trade and Commerce", "Forms of Business Organisation", "Public, Private, and Global Enterprises", "Business Services", "Emerging Modes of Business", "Social Responsibilities of Business and Business Ethics", "Formation of a Company", "Sources of Business Finance", "MSME and Business Entrepreneurship", "Internal Trade", "International Business") },
          "Economics": { names: t("Economics"), chapters: ch("Introduction to Microeconomics", "Consumer's Equilibrium and Demand", "Producer's Behaviour and Supply", "Market Equilibrium", "Introduction to Statistics", "Collection, Organisation and Presentation of Data", "Statistical Tools and Interpretation") }
        }
      },
      "Class 12": {
        names: { en: "Class 12 (HS 2nd Year)", as: "দ্বাদশ শ্ৰেণী (উচ্চ মাধ্যমিক ২য় বৰ্ষ)", hi: "कक्षा 12 (उच्च माध्यमिक द्वितीय वर्ष)" },
        subjects: {
          Physics: { names: t("Physics"), chapters: ch("Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics") },
          Chemistry: { names: t("Chemistry"), chapters: ch("Solutions", "Electrochemistry", "Chemical Kinetics", "d- and f-Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules", "Polymers") },
          Mathematics: { names: t("Mathematics"), chapters: ch("Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Application of Derivatives", "Integrals", "Application of Integrals", "Differential Equations", "Vector Algebra", "Three Dimensional Geometry", "Linear Programming", "Probability") },
          Biology: { names: t("Biology"), chapters: ch("Reproduction in Organisms", "Sexual Reproduction in Flowering Plants", "Human Reproduction", "Reproductive Health", "Principles of Inheritance and Variation", "Molecular Basis of Inheritance", "Evolution", "Human Health and Disease", "Strategies for Enhancement in Food Production", "Microbes in Human Welfare", "Biotechnology: Principles and Processes", "Biotechnology and Its Applications", "Organisms and Populations", "Ecosystem", "Biodiversity and Conservation", "Environmental Issues") },
          "Accountancy": { names: t("Accountancy"), chapters: ch("Accounting for Partnership: Fundamental Concepts", "Reconstitution of a Partnership Firm", "Dissolution of Partnership Firm", "Accounting for Share Capital", "Issue and Redemption of Debentures", "Financial Statement Analysis", "Cash Flow Statement") },
          "Business Studies": { names: t("Business Studies"), chapters: ch("Nature and Significance of Management", "Principles and Functions of Management", "Business Environment", "Planning", "Organising", "Staffing", "Directing", "Controlling", "Financial Management", "Financial Markets", "Marketing Management", "Consumer Protection") },
          "Economics": { names: t("Economics"), chapters: ch("Introduction to Microeconomics", "Theory of Consumer Behaviour", "Production and Costs", "Market Forms and Perfect Competition", "Simple Macro-Economics", "National Income Accounting", "Money and Banking", "Income and Employment", "Government Budget and the Economy", "Indian Economic Development", "Current Challenges of Indian Economy") },
          "English": { names: t("English"), chapters: ch("Prose Selections", "Poetry", "Drama", "Writing Skills", "Comprehension", "Composition", "Letter Writing") },
          "Political Science": { names: t("Political Science"), chapters: ch("The Cold War Era", "The End of Bipolarity", "US Hegemony in the World", "Contemporary South Asia", "International Organisations", "Environment and Natural Resources", "Politics in India Since Independence", "Challenges to and Restoration of the Congress System", "Popular Movements") },
          "History": { names: t("History"), chapters: ch("Kings and Chronicles: The Mughal Courts", "Colonial Cities: Urbanisation, Planning, and Architecture", "Mahatma Gandhi and the Nationalist Movement", "Understanding Partition", "Colonialism and the Countryside", "Rebels and the Raj", "Framing the Constitution") },
          "Geography": { names: t("Geography"), chapters: ch("Population Composition", "Human Settlements", "Manufacturing Industries", "Migration: Types, Causes and Consequences", "Transport, Communication, and Trade", "Natural Resources and Conservation", "Geography of India and Assam") },
          "Sociology": { names: t("Sociology"), chapters: ch("Introducing Sociology", "Social Institutions", "Change and Development", "Introducing Social Stratification", "Demographic Structure and Cultural Change") }
        }
      }
    }
  }
};

window.SYLLABUS_DATA = SYLLABUS_DATA;
