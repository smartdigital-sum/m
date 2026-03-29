const SYLLABUS_DATA = {
  SEBA: {
    name: "SEBA (Assam Board)",
    fullName: "Board of Secondary Education, Assam",
    classes: {
      "Class 1": {
        subjects: {
          "Mathematics": { chapters: [{ id: "s1m1", name: "Numbers 1-100" }, { id: "s1m2", name: "Addition & Subtraction" }, { id: "s1m3", name: "Shapes & Space" }] },
          "English": { chapters: [{ id: "s1e1", name: "Letters & Sounds" }, { id: "s1e2", name: "Simple Words" }, { id: "s1e3", name: "Poems & Rhymes" }] }
        }
      },
      "Class 2": {
        subjects: {
          "Mathematics": { chapters: [{ id: "s2m1", name: "Numbers up to 1000" }, { id: "s2m2", name: "Addition with Carry" }, { id: "s2m3", name: "Multiplication Intro" }] },
          "English": { chapters: [{ id: "s2e1", name: "Sentence Building" }, { id: "s2e2", name: "Nouns & Verbs" }, { id: "s2e3", name: "Short Stories" }] }
        }
      },
      "Class 3": {
        subjects: {
          "Mathematics": { chapters: [{ id: "s3m1", name: "Large Numbers" }, { id: "s3m2", name: "Division" }, { id: "s3m3", name: "Fractions Intro" }] },
          "Environmental Studies (EVS)": { chapters: [{ id: "s3v1", name: "Family & Friends" }, { id: "s3v2", name: "Plants & Animals" }, { id: "s3v3", name: "Food & Water" }] },
          "English": { chapters: [{ id: "s3e1", name: "Pronouns & Adjectives" }, { id: "s3e2", name: "Paragraph Writing" }, { id: "s3e3", name: "Literature - Prose" }] }
        }
      },
      "Class 4": {
        subjects: {
          "Mathematics": { chapters: [{ id: "s4m1", name: "Multiples & Factors" }, { id: "s4m2", name: "Decimals" }, { id: "s4m3", name: "Perimeter & Area" }] },
          "Environmental Studies (EVS)": { chapters: [{ id: "s4v1", name: "Shelter & Travel" }, { id: "s4v2", name: "Water & Sanitation" }, { id: "s4v3", name: "Things We Make" }] },
          "English": { chapters: [{ id: "s4e1", name: "Tenses Intro" }, { id: "s4e2", name: "Formal Letter" }, { id: "s4e3", name: "Comprehension" }] }
        }
      },
      "Class 5": {
        subjects: {
          "Mathematics": { chapters: [{ id: "s5m1", name: "Operations on Large Numbers" }, { id: "s5m2", name: "Volume & Capacity" }, { id: "s5m3", name: "Data Handling" }] },
          "Environmental Studies (EVS)": { chapters: [{ id: "s5v1", name: "Natural Resources" }, { id: "s5v2", name: "Health & Hygiene" }, { id: "s5v3", name: "Community Living" }] },
          "English": { chapters: [{ id: "s5e1", name: "Active/Passive Voice" }, { id: "s5e2", name: "Creative Writing" }, { id: "s5e3", name: "Advanced Grammar" }] }
        }
      },
      "Class 6": {
        subjects: {
          "Mathematics": { chapters: [{ id: "s6m1", name: "Knowing Our Numbers" }, { id: "s6m2", name: "Whole Numbers" }, { id: "s6m3", name: "Integers" }, { id: "s6m4", name: "Algebra Intro" }] },
          "Science": { chapters: [{ id: "s6s1", name: "Food & Components" }, { id: "s6s2", name: "Fibre to Fabric" }, { id: "s6s3", name: "Changes Around Us" }, { id: "s6s4", name: "The Living Organisms" }] },
          "Social Science": { chapters: [{ id: "s6ss1", name: "Earliest People" }, { id: "s6ss2", name: "The Earth in Solar System" }, { id: "s6ss3", name: "Understanding Diversity" }] },
          "English": { chapters: [{ id: "s6e1", name: "Parts of Speech" }, { id: "s6e2", name: "Reading Skills" }, { id: "s6e3", name: "Poetry Analysis" }] }
        }
      },
      "Class 7": {
        subjects: {
          "Mathematics": { chapters: [{ id: "s7m1", name: "Rational Numbers" }, { id: "s7m2", name: "Simple Equations" }, { id: "s7m3", name: "Triangle Properties" }, { id: "s7m4", name: "Exponents & Powers" }] },
          "Science": { chapters: [{ id: "s7s1", name: "Nutrition in Plants/Animals" }, { id: "s7s2", name: "Heat" }, { id: "s7s3", name: "Acids, Bases & Salts" }, { id: "s7s4", name: "Electric Current" }] },
          "Social Science": { chapters: [{ id: "s7ss1", name: "The Delhi Sultans" }, { id: "s7ss2", name: "Inside Our Earth" }, { id: "s7ss3", name: "Role of Govt in Health" }] },
          "English": { chapters: [{ id: "s7e1", name: "Direct/Indirect Speech" }, { id: "s7e2", name: "Essay Writing" }, { id: "s7e3", name: "Supplementary Reader" }] }
        }
      },
      "Class 8": {
        subjects: {
          "Mathematics": { chapters: [{ id: "s8m1", name: "Linear Equations One Var" }, { id: "s8m2", name: "Squares & Square Roots" }, { id: "s8m3", name: "Factorization" }, { id: "s8m4", name: "Direct & Inverse Proportion" }] },
          "Science": { chapters: [{ id: "s8s1", name: "Crop Production" }, { id: "s8s2", name: "Microorganisms" }, { id: "s8s3", name: "Metals & Non-metals" }, { id: "s8s4", name: "Force & Pressure" }, { id: "s8s5", name: "Stars & Solar System" }] },
          "Social Science": { chapters: [{ id: "s8ss1", name: "From Trade to Territory" }, { id: "s8ss2", name: "Agriculture" }, { id: "s8ss3", name: "The Indian Constitution" }] },
          "English": { chapters: [{ id: "s8e1", name: "Advanced Tenses" }, { id: "s8e2", name: "Report Writing" }, { id: "s8e3", name: "Literature Master" }] }
        }
      },
      "Class 9": {
        subjects: {
          "Mathematics": {
            chapters: [
              { id: "m1", name: "Number System" },
              { id: "m2", name: "Polynomials" },
              { id: "m3", name: "Coordinate Geometry" },
              { id: "m4", name: "Linear Equations in Two Variables" },
              { id: "m6", name: "Lines and Angles" },
              { id: "m7", name: "Triangles" },
              { id: "m8", name: "Quadrilaterals" },
              { id: "m9", name: "Areas of Parallelograms and Triangles" },
              { id: "m10", name: "Circles" },
              { id: "m11", name: "Constructions" },
              { id: "m12", name: "Heron's Formula" },
              { id: "m13", name: "Surface Area and Volume" },
              { id: "m14", name: "Statistics" },
              { id: "m15", name: "Probability" }
            ]
          },
          "Science": {
            chapters: [
              { id: "s1", name: "Motion", section: "Physics" },
              { id: "s2", name: "Force and Laws of Motion", section: "Physics" },
              { id: "s3", name: "Gravitation", section: "Physics" },
              { id: "s4", name: "Work, Energy and Power", section: "Physics" },
              { id: "s5", name: "Sound", section: "Physics" },
              { id: "s6", name: "Matter in Our Surroundings", section: "Chemistry" },
              { id: "s7", name: "Is Matter Around Us Pure", section: "Chemistry" },
              { id: "s8", name: "Atoms and Molecules", section: "Chemistry" },
              { id: "s9", name: "Structure of the Atom", section: "Chemistry" },
              { id: "s10", name: "The Fundamental Unit of Life", section: "Biology" },
              { id: "s11", name: "Tissues", section: "Biology" }
            ]
          },
          "English": {
            chapters: [
              { id: "e1", name: "Reading Comprehension", section: "General" },
              { id: "e2", name: "Writing Skills", section: "General" },
              { id: "e3", name: "Grammar", section: "General" },
              { id: "e4", name: "Literature - Prose", section: "Literature" },
              { id: "e5", name: "Literature - Poetry", section: "Literature" },
              { id: "e6", name: "Supplementary Reader", section: "Literature" }
            ]
          },
          "Social Science": {
            chapters: [
              { id: "ss1", name: "Partition of Bengal & Swadeshi Movement", section: "History" },
              { id: "ss2", name: "Rise of Gandhi & Freedom Movement", section: "History" },
              { id: "ss3", name: "Anti-British Uprising in Assam", section: "History" },
              { id: "ss4", name: "Geography of the World", section: "Geography" },
              { id: "ss5", name: "Geography of Assam", section: "Geography" },
              { id: "ss6", name: "Indian Democracy", section: "Political Science" },
              { id: "ss7", name: "Economic Development", section: "Economics" }
            ]
          }
        }
      },
      "Class 10": {
        subjects: {
          "Mathematics": {
            chapters: [
              { id: "cm1", name: "Real Numbers" },
              { id: "cm2", name: "Polynomials" },
              { id: "cm3", name: "Pair of Linear Equations in Two Variables" },
              { id: "cm4", name: "Quadratic Equations" },
              { id: "cm5", name: "Arithmetic Progressions" },
              { id: "cm6", name: "Triangles" },
              { id: "cm7", name: "Coordinate Geometry" },
              { id: "cm8", name: "Introduction to Trigonometry" },
              { id: "cm9", name: "Heights and Distances", note: "Learning Only" },
              { id: "cm10", name: "Circles" },
              { id: "cm11", name: "Constructions" },
              { id: "cm12", name: "Areas Related to Circles" },
              { id: "cm13", name: "Surface Areas and Volumes" },
              { id: "cm14", name: "Statistics" },
              { id: "cm15", name: "Probability" }
            ]
          },
          "Science": {
            chapters: [
              { id: "cs1", name: "Chemical Reactions and Equations", section: "Chemistry" },
              { id: "cs2", name: "Acids, Bases and Salts", section: "Chemistry" },
              { id: "cs3", name: "Metals and Non-metals", section: "Chemistry" },
              { id: "cs4", name: "Carbon and its Compounds", section: "Chemistry" },
              { id: "cs5", name: "Periodic Classification of Elements", section: "Chemistry" },
              { id: "cs6", name: "Life Processes", section: "Biology" },
              { id: "cs7", name: "Control and Coordination", section: "Biology" },
              { id: "cs8", name: "How do Organisms Reproduce?", section: "Biology" },
              { id: "cs9", name: "Heredity and Evolution", section: "Biology" },
              { id: "cs10", name: "Light - Reflection and Refraction", section: "Physics" },
              { id: "cs11", name: "Human Eye and Colourful World", section: "Physics" },
              { id: "cs12", name: "Electricity", section: "Physics" },
              { id: "cs13", name: "Magnetic Effects of Electric Current", section: "Physics" },
              { id: "cs14", name: "Sources of Energy", section: "Physics" },
              { id: "cs15", name: "Our Environment", section: "Biology" },
              { id: "cs16", name: "Management of Natural Resources", section: "Biology" }
            ]
          },
          "English": {
            chapters: [
              { id: "ce1", name: "Prose: A Letter to God", section: "First Flight" },
              { id: "ce2", name: "Prose: Nelson Mandela", section: "First Flight" },
              { id: "ce3", name: "Prose: Glimpses of India", section: "First Flight" },
              { id: "ce4", name: "Prose: Madam Rides the Bus", section: "First Flight" },
              { id: "ce5", name: "Poetry: A Tiger in the Zoo", section: "Poetry" },
              { id: "ce6", name: "Poetry: Amanda!", section: "Poetry" },
              { id: "ce7", name: "Poetry: Animals", section: "Poetry" },
              { id: "ce8", name: "Poetry: The Ball Poem", section: "Poetry" },
              { id: "ce9", name: "Supp: The Midnight Visitor", section: "Footprints without Feet" },
              { id: "ce10", name: "Supp: A Question of Trust", section: "Footprints without Feet" },
              { id: "ce11", name: "Supp: The Hack Driver", section: "Footprints without Feet" },
              { id: "cg1", name: "Reading Comprehension & Writing", section: "Grammar & Composition" },
              { id: "cg2", name: "Grammar (Tense, Voice, Prelim, Direct/Indirect)", section: "Grammar & Composition" }
            ]
          },
          "Social Science": {
            chapters: [
              { id: "css1", name: "Partition of Bengal", section: "History" },
              { id: "css2", name: "Rise of Gandhi Era", section: "History" },
              { id: "css3", name: "Role of Assam in Freedom Movement", section: "History" },
              { id: "css4", name: "Economic Geography", section: "Geography" },
              { id: "css5", name: "Environment and Problems", section: "Geography" },
              { id: "css6", name: "Geography of Assam", section: "Geography" },
              { id: "css7", name: "Indian Democracy", section: "Political Science" },
              { id: "css8", name: "Money and Banking", section: "Economics" }
            ]
          }
        }
      }
    }
  },
  CBSE: {
    name: "CBSE (NCERT)",
    fullName: "Central Board of Secondary Education",
    classes: {
      "Class 1": {
        subjects: {
          "Mathematics": { chapters: [{ id: "c1m1", name: "Shapes and Space" }, { id: "c1m2", name: "Numbers from 1 to 9" }, { id: "c1m3", name: "Addition" }, { id: "c1m4", name: "Subtraction" }] },
          "English": { chapters: [{ id: "c1e1", name: "A Happy Child (Poem)" }, { id: "c1e2", name: "Three Little Pigs" }, { id: "c1e3", name: "After a Bath" }] }
        }
      },
      "Class 2": {
        subjects: {
          "Mathematics": { chapters: [{ id: "c2m1", name: "What is Long, What is Round?" }, { id: "c2m2", name: "Counting in Groups" }, { id: "c2m3", name: "How Much Can You Carry?" }] },
          "English": { chapters: [{ id: "c2e1", name: "First Day at School" }, { id: "c2e2", name: "Haldi's Adventure" }, { id: "c2e3", name: "I am Lucky!" }] }
        }
      },
      "Class 3": {
        subjects: {
          "Mathematics": { chapters: [{ id: "c3m1", name: "Where to Look From" }, { id: "c3m2", name: "Fun with Numbers" }, { id: "c3m3", name: "Give and Take" }] },
          "Environmental Studies (EVS)": { chapters: [{ id: "c3v1", name: "Poonam's Day Out" }, { id: "c3v2", name: "The Plant Fairy" }, { id: "c3v3", name: "Water O' Water!" }] },
          "English": { chapters: [{ id: "c3e1", name: "Good Morning" }, { id: "c3e2", name: "The Enormous Turnip" }, { id: "c3e3", name: "Bird Talk" }] }
        }
      },
      "Class 4": {
        subjects: {
          "Mathematics": { chapters: [{ id: "c4m1", name: "Building with Bricks" }, { id: "c4m2", name: "Long and Short" }, { id: "c4m3", name: "A Trip to Bhopal" }] },
          "Environmental Studies (EVS)": { chapters: [{ id: "c4v1", name: "Going to School" }, { id: "c4v2", name: "The Valley of Flowers" }, { id: "c4v3", name: "Changing Families" }] },
          "English": { chapters: [{ id: "c4e1", name: "Wake Up!" }, { id: "c4e2", name: "Neha's Alarm Clock" }, { id: "c4e3", name: "Noses" }] }
        }
      },
      "Class 5": {
        subjects: {
          "Mathematics": { chapters: [{ id: "c5m1", name: "The Fish Tale" }, { id: "c5m2", name: "Shapes and Angles" }, { id: "c5m3", name: "How Many Squares?" }] },
          "Environmental Studies (EVS)": { chapters: [{ id: "c5v1", name: "Super Senses" }, { id: "c5v2", name: "A Snake Charmer's Story" }, { id: "c5v3", name: "From Tasting to Digesting" }] },
          "English": { chapters: [{ id: "c5e1", name: "Ice-cream Man" }, { id: "c5e2", name: "Wonderful Waste!" }, { id: "c5e3", name: "Bamboo Curry" }] }
        }
      },
      "Class 6": {
        subjects: {
          "Mathematics": { chapters: [{ id: "c6m1", name: "Knowing Our Numbers" }, { id: "c6m2", name: "Whole Numbers" }, { id: "c6m3", name: "Playing with Numbers" }] },
          "Science": { chapters: [{ id: "c6s1", name: "Food: Where does it come from?" }, { id: "c6s2", name: "Components of Food" }, { id: "c6s3", name: "Fibre to Fabric" }] },
          "Social Science": { chapters: [{ id: "c6ss1", name: "What, Where, How and When?" }, { id: "c6ss2", name: "The Earth in the Solar System" }, { id: "c6ss3", name: "Understanding Diversity" }] },
          "English": { chapters: [{ id: "c6e1", name: "Who Did Patrick's Homework?" }, { id: "c6e2", name: "A House, A Home" }, { id: "c6e3", name: "How the Dog Found Himself a New Master!" }] }
        }
      },
      "Class 7": {
        subjects: {
          "Mathematics": { chapters: [{ id: "c7m1", name: "Integers" }, { id: "c7m2", name: "Fractions and Decimals" }, { id: "c7m3", name: "Data Handling" }] },
          "Science": { chapters: [{ id: "c7s1", name: "Nutrition in Plants" }, { id: "c7s2", name: "Nutrition in Animals" }, { id: "c7s3", name: "Fibre to Fabric" }] },
          "Social Science": { chapters: [{ id: "c7ss1", name: "Tracing Changes Through A Thousand Years" }, { id: "c7ss2", name: "Environment" }, { id: "c7ss3", name: "On Equality" }] },
          "English": { chapters: [{ id: "c7e1", name: "Three Questions" }, { id: "c7e2", name: "The Squirrel" }, { id: "c7e3", name: "A Gift of Chappals" }] }
        }
      },
      "Class 8": {
        subjects: {
          "Mathematics": { chapters: [{ id: "c8m1", name: "Rational Numbers" }, { id: "c8m2", name: "Linear Equations in One Variable" }, { id: "c8m3", name: "Understanding Quadrilaterals" }] },
          "Science": { chapters: [{ id: "c8s1", name: "Crop Production and Management" }, { id: "c8s2", name: "Microorganisms: Friend and Foe" }, { id: "c8s3", name: "Synthetic Fibres and Plastics" }] },
          "Social Science": { chapters: [{ id: "c8ss1", name: "How, When and Where" }, { id: "c8ss2", name: "Resources" }, { id: "c8ss3", name: "The Indian Constitution" }] },
          "English": { chapters: [{ id: "c8e1", name: "The Best Christmas Present in the World" }, { id: "c8e2", name: "The Ant and the Cricket" }, { id: "c8e3", name: "The Tsunami" }] }
        }
      },
      "Class 9": {
        subjects: {
          "Mathematics": {
            chapters: [
              { id: "m1", name: "Number Systems" },
              { id: "m2", name: "Polynomials" },
              { id: "m3", name: "Coordinate Geometry" },
              { id: "m4", name: "Linear Equations in Two Variables" },
              { id: "m5", name: "Introduction to Euclid's Geometry" },
              { id: "m6", name: "Lines and Angles" },
              { id: "m7", name: "Triangles" },
              { id: "m8", name: "Quadrilaterals" },
              { id: "m10", name: "Circles" },
              { id: "m12", name: "Heron's Formula" },
              { id: "m13", name: "Surface Areas and Volumes" },
              { id: "m14", name: "Statistics" }
            ]
          },
          "Science": {
            chapters: [
              { id: "s1", name: "Matter in Our Surroundings", section: "Chemistry" },
              { id: "s2", name: "Is Matter Around Us Pure", section: "Chemistry" },
              { id: "s3", name: "Atoms and Molecules", section: "Chemistry" },
              { id: "s4", name: "Structure of the Atom", section: "Chemistry" },
              { id: "s5", name: "Cell - Basic Unit of Life", section: "Biology" },
              { id: "s6", name: "Tissues", section: "Biology" },
              { id: "s7", name: "Motion", section: "Physics" },
              { id: "s8", name: "Force and Laws of Motion", section: "Physics" },
              { id: "s9", name: "Gravitation", section: "Physics" },
              { id: "s10", name: "Work and Energy", section: "Physics" },
              { id: "s11", name: "Sound", section: "Physics" },
              { id: "s12", name: "Improvement in Food Resources", section: "Biology" }
            ]
          },
          "English": {
            chapters: [
              { id: "e1", name: "Reading Comprehension", section: "General" },
              { id: "e2", name: "Writing Skills", section: "General" },
              { id: "e3", name: "Grammar", section: "General" },
              { id: "e4", name: "Beehive (Prose)", section: "Literature" },
              { id: "e5", name: "Beehive (Poetry)", section: "Literature" },
              { id: "e6", name: "Moments (Supplementary)", section: "Literature" }
            ]
          },
          "Social Science": {
            chapters: [
              { id: "ss1", name: "French Revolution", section: "History" },
              { id: "ss2", name: "Socialism in Europe", section: "History" },
              { id: "ss3", name: "Nazism and Rise of Hitler", section: "History" },
              { id: "ss4", name: "India - Size and Location", section: "Geography" },
              { id: "ss5", name: "Physical Features of India", section: "Geography" },
              { id: "ss6", name: "Drainage", section: "Geography" },
              { id: "ss7", name: "Climate", section: "Geography" },
              { id: "ss8", name: "What is Democracy?", section: "Civics" },
              { id: "ss9", name: "Constitutional Design", section: "Civics" },
              { id: "ss10", name: "Story of Village Palampur", section: "Economics" }
            ]
          }
        }
      },
      "Class 10": {
        subjects: {
          "Mathematics": {
            chapters: [
              { id: "cm1", name: "Real Numbers" },
              { id: "cm2", name: "Polynomials" },
              { id: "cm3", name: "Pair of Linear Equations" },
              { id: "cm4", name: "Quadratic Equations" },
              { id: "cm5", name: "Arithmetic Progressions" },
              { id: "cm6", name: "Triangles" },
              { id: "cm7", name: "Coordinate Geometry" },
              { id: "cm8", name: "Introduction to Trigonometry" },
              { id: "cm9", name: "Some Applications of Trigonometry" },
              { id: "cm10", name: "Circles" },
              { id: "cm11", name: "Areas Related to Circles" },
              { id: "cm12", name: "Surface Areas and Volumes" },
              { id: "cm13", name: "Statistics" },
              { id: "cm14", name: "Probability" }
            ]
          },
          "Science": {
            chapters: [
              { id: "cs1", name: "Chemical Reactions and Equations", section: "Chemistry" },
              { id: "cs2", name: "Acids, Bases and Salts", section: "Chemistry" },
              { id: "cs3", name: "Metals and Non-metals", section: "Chemistry" },
              { id: "cs4", name: "Carbon and its Compounds", section: "Chemistry" },
              { id: "cs5", name: "Life Processes", section: "Biology" },
              { id: "cs6", name: "Control and Coordination", section: "Biology" },
              { id: "cs7", name: "How do Organisms Reproduce?", section: "Biology" },
              { id: "cs8", name: "Heredity and Evolution", section: "Biology" },
              { id: "cs9", name: "Light - Reflection and Refraction", section: "Physics" },
              { id: "cs10", name: "Human Eye and Colourful World", section: "Physics" },
              { id: "cs11", name: "Electricity", section: "Physics" },
              { id: "cs12", name: "Magnetic Effects of Electric Current", section: "Physics" },
              { id: "cs13", name: "Our Environment", section: "Biology" }
            ]
          },
          "English": {
            chapters: [
              { id: "ce1", name: "Reading Skills & Composition", section: "General" },
              { id: "ce2", name: "First Flight (Prose)", section: "First Flight" },
              { id: "ce3", name: "First Flight (Poetry)", section: "First Flight" },
              { id: "ce4", name: "Footprints without Feet", section: "Supplementary" },
              { id: "cg1", name: "Grammar", section: "General" }
            ]
          },
          "Social Science": {
            chapters: [
              { id: "css1", name: "Rise of Nationalism in Europe", section: "History" },
              { id: "css2", name: "Nationalism in India", section: "History" },
              { id: "css3", name: "Resources and Development", section: "Geography" },
              { id: "css4", name: "Agriculture", section: "Geography" },
              { id: "css5", name: "Power Sharing", section: "Civics" },
              { id: "css6", name: "Federalism", section: "Civics" },
              { id: "css7", name: "Development", section: "Economics" },
              { id: "css8", name: "Sectors of Indian Economy", section: "Economics" }
            ]
          }
        }
      }
    }
  },
  ICSE: {
    name: "ICSE",
    fullName: "Indian Certificate of Secondary Education",
    classes: {
      "Class 1": {
        subjects: {
          "Mathematics": { chapters: [{ id: "i1m1", name: "Numbers and Operations" }, { id: "i1m2", name: "Geometry" }, { id: "i1m3", name: "Measurement" }] },
          "English": { chapters: [{ id: "i1e1", name: "Language - Phonics" }, { id: "i1e2", name: "Literature - Short Poems" }] }
        }
      },
      "Class 2": {
        subjects: {
          "Mathematics": { chapters: [{ id: "i2m1", name: "Addition and Subtraction" }, { id: "i2m2", name: "Shapes and Patterns" }] },
          "English": { chapters: [{ id: "i2e1", name: "Grammar - Nouns/Verbs" }, { id: "i2e2", name: "Literature - Stories" }] }
        }
      },
      "Class 3": {
        subjects: {
          "Mathematics": { chapters: [{ id: "i3m1", name: "Number Systems" }, { id: "i3m2", name: "Basic Geometry" }] },
          "Environmental Studies (EVS)": { chapters: [{ id: "i3v1", name: "Human Body" }, { id: "i3v2", name: "Animals and Plants" }] },
          "English": { chapters: [{ id: "i3e1", name: "Language - Tenses" }, { id: "i3e2", name: "Literature - Prose" }] }
        }
      },
      "Class 6": {
        subjects: {
          "Mathematics": { chapters: [{ id: "i6m1", name: "Number System" }, { id: "i6m2", name: "Algebra" }, { id: "i6m3", name: "Geometry" }] },
          "Physics": { chapters: [{ id: "i6p1", name: "Matter" }, { id: "i6p2", name: "Physical Quantities" }, { id: "i6p3", name: "Force and Pressure" }] },
          "Chemistry": { chapters: [{ id: "i6c1", name: "Introduction to Chemistry" }, { id: "i6c2", name: "Elements, Compounds and Mixtures" }] },
          "Biology": { chapters: [{ id: "i6b1", name: "Leaf" }, { id: "i6b2", name: "Flower" }, { id: "i6b3", name: "Cell" }] },
          "History & Civics": { chapters: [{ id: "i6h1", name: "The River Valley Civilizations" }, { id: "i6h2", name: "The Vedic Resistance" }] }
        }
      },
      "Class 7": {
        subjects: {
          "Mathematics": { chapters: [{ id: "i7m1", name: "Rational Numbers" }, { id: "i7m2", name: "Ratio and Proportion" }] },
          "Physics": { chapters: [{ id: "i7p1", name: "Light Energy" }, { id: "i7p2", name: "Heat" }, { id: "i7p3", name: "Sound" }] },
          "Chemistry": { chapters: [{ id: "i7c1", name: "Matter and Its Composition" }, { id: "i7c2", name: "Atomic Structure" }] },
          "Biology": { chapters: [{ id: "i7b1", name: "Tissues" }, { id: "i7b2", name: "Kingdom Classification" }] }
        }
      },
      "Class 8": {
        subjects: {
          "Mathematics": { chapters: [{ id: "i8m1", name: "Rational Numbers" }, { id: "i8m2", name: "Squares and Square Roots" }] },
          "Physics": { chapters: [{ id: "i8p1", name: "Heat Transfer" }, { id: "i8p2", name: "Light Energy" }, { id: "i8p3", name: "Electricity" }] },
          "Chemistry": { chapters: [{ id: "i8c1", name: "Atomic Structure" }, { id: "i8c2", name: "Chemical Reactions" }] },
          "Biology": { chapters: [{ id: "i8b1", name: "Transport in Plants" }, { id: "i8b2", name: "Reproduction in Plants" }] }
        }
      },
      "Class 9": {
        subjects: {
          "Mathematics": {
            chapters: [
              { id: "im1", name: "Pure Arithmetic" },
              { id: "im2", name: "Commercial Mathematics" },
              { id: "im3", name: "Algebra (Expansions/Factorization)" },
              { id: "im4", name: "Geometry (Triangles, Pythagoras)" },
              { id: "im5", name: "Statistics" },
              { id: "im6", name: "Mensuration" },
              { id: "im7", name: "Trigonometry" },
              { id: "im8", name: "Coordinate Geometry" }
            ]
          },
          "Physics": {
            chapters: [
              { id: "ip1", name: "Measurements and Experimentation" },
              { id: "ip2", name: "Motion in One Dimension" },
              { id: "ip3", name: "Laws of Motion" },
              { id: "ip4", name: "Fluids" },
              { id: "ip5", name: "Heat and Energy" },
              { id: "ip6", name: "Light & Sound" },
              { id: "ip7", name: "Electricity and Magnetism" }
            ]
          },
          "Chemistry": {
            chapters: [
              { id: "ic1", name: "Language of Chemistry" },
              { id: "ic2", name: "Chemical Changes and Reactions" },
              { id: "ic3", name: "Water" },
              { id: "ic4", name: "Atomic Structure and Chemical Bonding" },
              { id: "ic5", name: "The Periodic Table" },
              { id: "ic6", name: "Study of Gas Laws" }
            ]
          },
          "Biology": {
            chapters: [
              { id: "ib1", name: "Basic Biology - Cell and Tissues" },
              { id: "ib2", name: "Plant Physiology" },
              { id: "ib3", name: "Diversity in Living Organisms" },
              { id: "ib4", name: "Human Anatomy and Physiology" },
              { id: "ib5", name: "Health and Hygiene" }
            ]
          },
          "English": {
            chapters: [
              { id: "ie1", name: "Literature - Merchant of Venice", section: "Literature" },
              { id: "ie2", name: "Poetry - Treasure Trove", section: "Literature" },
              { id: "ie3", name: "Short Stories - Treasure Trove", section: "Literature" },
              { id: "ie4", name: "Grammar & Comprehension", section: "Language" },
              { id: "ie5", name: "Composition & Letter Writing", section: "Language" }
            ]
          }
        }
      },
      "Class 10": {
        subjects: {
          "Mathematics": {
            chapters: [
              { id: "icm1", name: "GST, Banking, Shares" },
              { id: "icm2", name: "Linear Inequations, Quadratic Equations" },
              { id: "icm3", name: "Similarity, Loci, Circles" },
              { id: "icm4", name: "Mensuration (Cylinder, Cone, Sphere)" },
              { id: "icm5", name: "Trigonometry (Heights and Distances)" },
              { id: "icm6", name: "Statistics (Mean, Median, Mode)" },
              { id: "icm7", name: "Probability" }
            ]
          },
          "Physics": {
            chapters: [
              { id: "icp1", name: "Force, Work, Power and Energy" },
              { id: "icp2", name: "Light (Refraction, Lenses)" },
              { id: "icp3", name: "Sound" },
              { id: "icp4", name: "Electricity and Magnetism" },
              { id: "icp5", name: "Heat" },
              { id: "icp6", name: "Modern Physics (Radioactivity)" }
            ]
          },
          "Chemistry": {
            chapters: [
              { id: "icc1", name: "Periodic Properties" },
              { id: "icc2", name: "Chemical Bonding" },
              { id: "icc3", name: "Acids, Bases and Salts" },
              { id: "icc4", name: "Analytical Chemistry" },
              { id: "icc5", name: "Mole Concept and Stoichiometry" },
              { id: "icc6", name: "Electrolysis & Metallurgy" },
              { id: "icc7", name: "Study of Compounds" },
              { id: "icc8", name: "Organic Chemistry" }
            ]
          },
          "Biology": {
            chapters: [
              { id: "icb1", name: "Cell Cycle and Cell Division" },
              { id: "icb2", name: "Plant Physiology (Osmosis, Transpiration)" },
              { id: "icb3", name: "Photosynthesis" },
              { id: "icb4", name: "Human Anatomy and Physiology" },
              { id: "icb5", name: "Population & Human Evolution" },
              { id: "icb6", name: "Pollution" }
            ]
          },
          "English": {
            chapters: [
              { id: "ice1", name: "Literature - Merchant of Venice (Act III-V)", section: "Literature" },
              { id: "ice2", name: "Poetry - Treasure Trove (Later chapters)", section: "Literature" },
              { id: "ice3", name: "Short Stories - Treasure Trove (Later chapters)", section: "Literature" },
              { id: "ice4", name: "Grammar & Comprehension", section: "Language" },
              { id: "ice5", name: "Composition & Letter Writing", section: "Language" }
            ]
          }
        }
      }
    }
  },
  AJBEC: {
    name: "AJBEC (Jatiya Bidyalaya)",
    fullName: "Assam Jatiya Bidyalay Education Council",
    classes: {
      "Class 1": {
        subjects: {
          "Mathematics": { chapters: [{ id: "aj1m1", name: "Numbers & Counting" }, { id: "aj1m2", name: "Basic Shapes" }] },
          "English": { chapters: [{ id: "aj1e1", name: "Alphabet & Sounds" }, { id: "aj1e2", name: "Rhymes" }] }
        }
      },
      "Class 2": {
        subjects: {
          "Mathematics": { chapters: [{ id: "aj2m1", name: "Addition & Subtraction" }, { id: "aj2m2", name: "Patterns" }] },
          "English": { chapters: [{ id: "aj2e1", name: "Naming Words" }, { id: "aj2e2", name: "Action Words" }] }
        }
      },
      "Class 3": {
        subjects: {
          "Mathematics": { chapters: [{ id: "aj3m1", name: "Large Numbers" }, { id: "aj3m2", name: "Multiplication Table" }] },
          "General Science": { chapters: [{ id: "aj3s1", name: "Living Things" }, { id: "aj3s2", name: "Plants Around Us" }, { id: "aj3s3", name: "Science Practical Intro" }] },
          "English": { chapters: [{ id: "aj3e1", name: "Opposites" }, { id: "aj3e2", name: "Story Reading" }] }
        }
      },
      "Class 6": {
        subjects: {
          "Mathematics": { chapters: [{ id: "aj6m1", name: "Fractions" }, { id: "aj6m2", name: "Decimals" }, { id: "aj6m3", name: "Geometry" }] },
          "Science": { chapters: [{ id: "aj6s1", name: "Fibre to Fabric" }, { id: "aj6s2", name: "Changes Around Us" }, { id: "aj6s3", name: "Magnetism" }] },
          "Assam History": { chapters: [{ id: "aj6h1", name: "Ancient Assam" }, { id: "aj6h2", name: "Varman Dynasty" }] },
          "Social Science": { chapters: [{ id: "aj6ss1", name: "Our Environment" }, { id: "aj6ss2", name: "Local Government" }] },
          "English": { chapters: [{ id: "aj6e1", name: "Spoken English Skills" }, { id: "aj6e2", name: "Parts of Speech" }] }
        }
      },
      "Class 7": {
        subjects: {
          "Mathematics": { chapters: [{ id: "aj7m1", name: "Rational Numbers" }, { id: "aj7m2", name: "Simple Equations" }] },
          "Science": { chapters: [{ id: "aj7s1", name: "Heat" }, { id: "aj7s2", name: "Acids & Bases" }] },
          "Assam History": { chapters: [{ id: "aj7h1", name: "Medieval Assam" }, { id: "aj7h2", name: "Ahom Kingdom" }] },
          "English": { chapters: [{ id: "aj7e1", name: "Tenses" }, { id: "aj7e2", name: "Letter Writing" }] }
        }
      },
      "Class 8": {
        subjects: {
          "Mathematics": { chapters: [{ id: "aj8m1", name: "Algebraic Expressions" }, { id: "aj8m2", name: "Practical Geometry" }] },
          "Science": { chapters: [{ id: "aj8s1", name: "Conservation of Plants/Animals" }, { id: "aj8s2", name: "Cell Structure" }] },
          "Assam History": { chapters: [{ id: "aj8h1", name: "Modern Assam" }, { id: "aj8h2", name: "Assam's Freedom Struggle" }] },
          "Social Science": { chapters: [{ id: "aj8ss1", name: "Resources" }, { id: "aj8ss2", name: "The Constitution" }] },
          "English": { chapters: [{ id: "aj8e1", name: "Report Writing" }, { id: "aj8e2", name: "Voice & Narration" }] }
        }
      },
      "Class 9": {
        subjects: {
          "Mathematics": { chapters: [{ id: "aj9m1", name: "Number System" }, { id: "aj9m2", name: "Polynomials" }, { id: "aj9m3", name: "Coordinate Geometry" }] },
          "Science": { chapters: [{ id: "aj9s1", name: "Matter in Surroundings" }, { id: "aj9s2", name: "Fundamental Unit of Life" }] },
          "Social Science": { chapters: [{ id: "aj9ss1", name: "Geography of World" }, { id: "aj9ss2", name: "Indian Democracy" }] },
          "English": { chapters: [{ id: "aj9e1", name: "Reading & Writing" }, { id: "aj9e2", name: "Literature Review" }] }
        }
      },
      "Class 10": {
        subjects: {
          "Mathematics": { chapters: [{ id: "aj10m1", name: "Real Numbers" }, { id: "aj10m2", name: "Trigonometry Intro" }] },
          "Science": { chapters: [{ id: "aj10s1", name: "Chemical Reactions" }, { id: "aj10s2", name: "Life Processes" }] },
          "Social Science": { chapters: [{ id: "aj10ss1", name: "Role of Assam in Movement" }, { id: "aj10ss2", name: "Economic Geography" }] },
          "English": { chapters: [{ id: "aj10e1", name: "HSLC Practice Set" }, { id: "aj10e2", name: "Advanced Composition" }] }
        }
      }
    }
  }
};

window.SYLLABUS_DATA = SYLLABUS_DATA;
