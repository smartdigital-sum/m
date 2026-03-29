const SYLLABUS_DATA = {
  SEBA: {
    name: "SEBA (Assam Board)",
    fullName: "Board of Secondary Education, Assam",
    classes: {
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
  }
};

window.SYLLABUS_DATA = SYLLABUS_DATA;
