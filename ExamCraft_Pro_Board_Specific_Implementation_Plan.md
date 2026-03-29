# ExamCraft Pro - Board-Specific Question Paper Generator
## Implementation Plan & Research Document

**Target Audience:** Teachers in Kampur, Nagaon, and rural Assam
**Goal:** Provide accurate, board-specific question papers that don't need human verification

---

## 📊 Research Summary: Assam Education System

### Boards Operating in Assam (Class 1-10)

| Board | Full Form | Classes | Key Characteristics |
|-------|-----------|---------|---------------------|
| **SEBA/ASSEB** | Board of Secondary Education, Assam / Assam State School Education Board | 9-10 (HSLC) | State board, regional language support, merged SEBA+AHSEC in 2024 |
| **CBSE** | Central Board of Secondary Education | 1-12 | NCERT-based, national competitive exam focus |
| **ICSE** | Indian Certificate of Secondary Education | 1-10 | CISCE, comprehensive curriculum, more subjects |

**Important:** AHSEC only handles Class 11-12 (Higher Secondary), not relevant for this project.

### Critical Syllabus Facts

**Class 1-8:**
- Different boards teach their own curriculum
- SCERT Assam provides state guidelines
- CBSE follows NCERT uniformly
- Many local schools follow mixed patterns

**Class 9-10 (Your Primary Target):**
- **SEBA HSLC:** All schools under SEBA follow the same syllabus
- **CBSE:** NCERT-based, common across India
- **ICSE:** More comprehensive, different subject groupings

---

## 📚 Detailed Board-wise Subject & Chapter Structure

### SEBA (ASSEB) - Class 9 & 10

#### Class 9 Mathematics (General Mathematics)
| Chapter | Topics |
|---------|--------|
| 1 | Number System |
| 2 | Polynomials |
| 3 | Coordinate Geometry |
| 4 | Linear Equations in Two Variables |
| 6 | Lines and Angles |
| 7 | Triangles |
| 8 | Quadrilaterals |
| 9 | Areas of Parallelograms and Triangles |
| 10 | Circles |
| 11 | Constructions |
| 12 | Heron's Formula |
| 13 | Surface Area and Volume |
| 14 | Statistics |
| 15 | Probability |

**Note:** Chapter 5 (Introduction to Euclid's Geometry) appears skipped in SEBA.

#### Class 10 Mathematics (General Mathematics)
| Chapter | Topics |
|---------|--------|
| 1 | Real Numbers |
| 2 | Polynomials |
| 3 | Pair of Linear Equations in Two Variables |
| 4 | Quadratic Equations |
| 5 | Arithmetic Progressions |
| 6 | Triangles |
| 7 | Coordinate Geometry |
| 8 | Introduction to Trigonometry |
| 9 | Heights and Distances (learning only, not in exam) |
| 10 | Circles |
| 11 | Constructions |
| 12 | Areas Related to Circles |
| 13 | Surface Areas and Volumes |
| 14 | Statistics |
| 15 | Probability |

#### Class 9 Science (General Science)
**Physics:**
- Motion
- Force and Laws of Motion
- Gravitation
- Work, Energy and Power
- Sound

**Chemistry:**
- Matter in Our Surroundings
- Is Matter Around Us Pure
- Atoms and Molecules
- Structure of the Atom

**Biology:**
- The Fundamental Unit of Life (Cell)
- Tissues

#### Class 10 Science (General Science)
**Chemistry:**
1. Chemical Reactions and Equations
2. Acids, Bases and Salts
3. Metals and Non-metals
4. Carbon and its Compounds
5. Periodic Classification of Elements

**Biology:**
6. Life Processes
7. Control and Coordination
8. How do Organisms Reproduce?
9. Heredity and Evolution
15. Our Environment
16. Management of Natural Resources

**Physics:**
10. Light - Reflection and Refraction
11. Human Eye and Colourful World
12. Electricity
13. Magnetic Effects of Electric Current
14. Sources of Energy

#### Class 9-10 English (SEBA)
**Class 9:**
- Grammar: Determiners, Tenses, Voice, Narration, Prepositions
- Literature: Prose, Poetry, Supplementary Reader

**Class 10 (First Flight - NCERT Based):**
**Prose:**
- A Letter to God
- Nelson Mandela: Long Walk to Freedom
- Glimpses of India (Coorg and Tea from Assam)
- Madam Rides the Bus

**Poetry:**
- A Tiger in the Zoo
- Amanda!
- Animals
- The Ball Poem
- The Tale of Custard the Dragon

**Supplementary (Footprints without Feet):**
- The Midnight Visitor
- A Question of Trust
- Footprints without Feet
- The Hack Driver

#### Class 9-10 Social Science (SEBA)
**History:**
- Partition of Bengal, Swadeshi Movement
- Rise of Gandhi Era and Freedom Movement
- Anti-British Uprising in Assam
- Agrarian Revolutions in Assam
- Role of Assam in Freedom Movement
- Cultural Heritage of India and North-East

**Geography:**
- Economic Geography
- Environment and Environmental Problems
- Geography of the World
- Geography of Assam (Special focus)

**Political Science:**
- Indian Democracy
- International Organisations
- World Peace and Human Rights

**Economics:**
- Money and Banking
- Economic Development

---

### CBSE - Class 9 & 10 (NCERT Based)

#### Class 9 Mathematics
**Units:**
1. Number Systems (10 marks) - Real Numbers
2. Algebra (20 marks) - Polynomials, Linear Equations
3. Coordinate Geometry (4 marks)
4. Geometry (27 marks) - Euclid's Geometry, Lines & Angles, Triangles, Quadrilaterals, Circles
5. Mensuration (13 marks) - Heron's Formula, Surface Areas & Volumes
6. Statistics & Probability (6 marks)

**Deleted from CBSE (present in SEBA):**
- Areas of Parallelograms and Triangles
- Constructions
- Probability

#### Class 10 Mathematics
1. Real Numbers
2. Polynomials
3. Pair of Linear Equations
4. Quadratic Equations
5. Arithmetic Progressions
6. Triangles
7. Coordinate Geometry
8. Introduction to Trigonometry
9. Some Applications of Trigonometry (Heights and Distances)
10. Circles
11. Areas Related to Circles
12. Surface Areas and Volumes
13. Statistics
14. Probability

#### Class 9 Science
**Matter - Its Nature and Behaviour:**
- Matter in Our Surroundings
- Is Matter Around Us Pure
- Atoms and Molecules
- Structure of the Atom

**Organization in the Living World:**
- Cell - Basic Unit of Life
- Tissues

**Motion, Force and Work:**
- Motion
- Force and Laws of Motion
- Gravitation
- Floatation
- Work, Energy and Power
- Sound

**Food Production:**
- Plant and animal breeding, fertilizers

#### Class 10 Science
**Chemical Substances - Nature and Behaviour:**
- Chemical Reactions and Equations
- Acids, Bases and Salts
- Metals and Non-metals
- Carbon and its Compounds
- Life Processes
- Control and Coordination
- How do Organisms Reproduce?
- Heredity and Evolution

**Natural Phenomenon:**
- Light - Reflection and Refraction
- Human Eye and Colourful World

**Effects of Current:**
- Electricity
- Magnetic Effects of Electric Current

**Natural Resources:**
- Sources of Energy
- Our Environment
- Management of Natural Resources

---

### ICSE - Class 9 & 10 (CISCE)

#### Class 9 Mathematics
1. Pure Arithmetic - Rational/Irrational numbers
2. Commercial Mathematics - Profit/Loss, Compound Interest
3. Algebra - Expansions, Factorization, Linear/Simultaneous Equations, Logarithms
4. Geometry - Triangles, Mid-Point Theorem, Pythagoras, Rectilinear Figures
5. Statistics - Data presentation, Mean, Median
6. Mensuration - Area, perimeter, volume
7. Trigonometry - Ratios, standard angles
8. Coordinate Geometry - Cartesian system, distance formula

#### Class 10 Mathematics
1. Commercial Mathematics - GST, Banking, Shares and Dividends
2. Algebra - Linear Inequations, Quadratic Equations, Matrices, AP
3. Geometry - Similarity, Loci, Circles, Constructions
4. Mensuration - Cylinder, Cone, Sphere
5. Trigonometry - Heights and distances
6. Statistics - Mean, Median, Mode, Histograms
7. Probability

#### Class 9 Science (Separate Subjects)

**Physics:**
1. Measurements and Experimentation
2. Motion in One Dimension
3. Laws of Motion
4. Gravitation
5. Fluids
6. Heat and Energy
7. Light (Reflection)
8. Sound
9. Electricity and Magnetism

**Chemistry:**
1. Language of Chemistry
2. Chemical Changes and Reactions
3. Water
4. Atomic Structure and Chemical Bonding
5. The Periodic Table
6. Study of First Element - Hydrogen
7. Study of Gas Laws
8. Atmospheric Pollution

**Biology:**
1. Basic Biology - Cell, tissues
2. Flowering Plants
3. Plant Physiology
4. Diversity in Living Organisms
5. Human Anatomy and Physiology
6. Health and Hygiene
7. Waste Generation and Management

#### Class 10 Science (Separate Subjects)

**Physics:**
1. Force, Work, Power and Energy
2. Light (Refraction, lenses)
3. Sound
4. Electricity and Magnetism
5. Heat
6. Modern Physics (Radioactivity)

**Chemistry:**
1. Periodic Properties
2. Chemical Bonding
3. Acids, Bases and Salts
4. Analytical Chemistry
5. Mole Concept and Stoichiometry
6. Electrolysis
7. Metallurgy
8. Study of Compounds (HCl, Ammonia, Nitric Acid, Sulphuric Acid)
9. Organic Chemistry

**Biology:**
1. Cell cycle and cell division
2. Plant Physiology (osmosis, transpiration, photosynthesis)
3. Human Anatomy and Physiology
4. Population
5. Human Evolution
6. Pollution

---

## 🎯 Implementation Plan

### Phase 1: Data Structure Design

Create a hierarchical data structure in a new file: `apps/examcraft/syllabus-data.js`

```javascript
const SYLLABUS_DATA = {
  boards: {
    SEBA: {
      name: "SEBA (Assam Board)",
      fullName: "Board of Secondary Education, Assam",
      classes: {
        "Class 9": {
          subjects: {
            "Mathematics": {
              chapters: [
                { id: "m1", name: "Number System", weightage: 8 },
                { id: "m2", name: "Polynomials", weightage: 7 },
                { id: "m3", name: "Coordinate Geometry", weightage: 5 },
                { id: "m4", name: "Linear Equations in Two Variables", weightage: 5 },
                { id: "m6", name: "Lines and Angles", weightage: 4 },
                { id: "m7", name: "Triangles", weightage: 6 },
                { id: "m8", name: "Quadrilaterals", weightage: 6 },
                { id: "m9", name: "Areas of Parallelograms and Triangles", weightage: 6 },
                { id: "m10", name: "Circles", weightage: 8 },
                { id: "m11", name: "Constructions", weightage: 4 },
                { id: "m12", name: "Heron's Formula", weightage: 4 },
                { id: "m13", name: "Surface Area and Volume", weightage: 8 },
                { id: "m14", name: "Statistics", weightage: 6 },
                { id: "m15", name: "Probability", weightage: 3 }
              ]
            },
            "Science": {
              chapters: [
                { id: "s1", name: "Motion", subject: "Physics" },
                { id: "s2", name: "Force and Laws of Motion", subject: "Physics" },
                { id: "s3", name: "Gravitation", subject: "Physics" },
                { id: "s4", name: "Work, Energy and Power", subject: "Physics" },
                { id: "s5", name: "Sound", subject: "Physics" },
                { id: "s6", name: "Matter in Our Surroundings", subject: "Chemistry" },
                { id: "s7", name: "Is Matter Around Us Pure", subject: "Chemistry" },
                { id: "s8", name: "Atoms and Molecules", subject: "Chemistry" },
                { id: "s9", name: "Structure of the Atom", subject: "Chemistry" },
                { id: "s10", name: "The Fundamental Unit of Life", subject: "Biology" },
                { id: "s11", name: "Tissues", subject: "Biology" }
              ]
            },
            "English": {
              chapters: [
                { id: "e1", name: "Reading Comprehension", type: "section" },
                { id: "e2", name: "Writing Skills", type: "section" },
                { id: "e3", name: "Grammar", type: "section" },
                { id: "e4", name: "Literature - Prose", type: "section" },
                { id: "e5", name: "Literature - Poetry", type: "section" }
              ]
            },
            "Social Science": {
              chapters: [
                { id: "ss1", name: "French Revolution", subject: "History" },
                { id: "ss2", name: "Socialism in Europe and Russian Revolution", subject: "History" },
                { id: "ss3", name: "Nazism and the Rise of Hitler", subject: "History" },
                { id: "ss4", name: "Forest Society and Colonialism", subject: "History" },
                { id: "ss5", name: "Pastoralists in the Modern World", subject: "History" },
                { id: "ss6", name: "India - Size and Location", subject: "Geography" },
                { id: "ss7", name: "Physical Features of India", subject: "Geography" },
                { id: "ss8", name: "Drainage", subject: "Geography" },
                { id: "ss9", name: "Climate", subject: "Geography" },
                { id: "ss10", name: "Natural Vegetation and Wildlife", subject: "Geography" },
                { id: "ss11", name: "Population", subject: "Geography" },
                { id: "ss12", name: "Democracy in the Contemporary World", subject: "Civics" },
                { id: "ss13", name: "What is Democracy? Why Democracy?", subject: "Civics" },
                { id: "ss14", name: "Constitutional Design", subject: "Civics" },
                { id: "ss15", name: "Electoral Politics", subject: "Civics" },
                { id: "ss16", name: "Working of Institutions", subject: "Civics" },
                { id: "ss17", name: "Democratic Rights", subject: "Civics" },
                { id: "ss18", name: "The Story of Village Palampur", subject: "Economics" },
                { id: "ss19", name: "People as Resource", subject: "Economics" },
                { id: "ss20", name: "Poverty as a Challenge", subject: "Economics" },
                { id: "ss21", name: "Food Security in India", subject: "Economics" }
              ]
            }
          }
        },
        "Class 10": {
          // Similar structure for Class 10
        }
      }
    },
    CBSE: {
      name: "CBSE",
      fullName: "Central Board of Secondary Education",
      classes: {
        // NCERT-based structure
      }
    },
    ICSE: {
      name: "ICSE",
      fullName: "Indian Certificate of Secondary Education",
      classes: {
        // CISCE-based structure
      }
    }
  }
};
```

### Phase 2: UI Flow Changes

**Current Flow:**
School → Class → Subject → Topic → Difficulty → Questions

**New Flow:**
1. School/Institution Name (text input)
2. Board Selection (SEBA/CBSE/ICSE) - **NEW**
3. Class Selection (filtered by board) - **NEW: Cascading dropdown**
4. Subject Selection (filtered by board+class) - **NEW: Dynamic options**
5. Chapter Selection (multi-select, filtered by subject) - **NEW: Dynamic options**
6. Difficulty Level (Easy/Medium/Hard/Mixed)
7. Question Types (MCQ, Short, Long, True/False, Fill Blank)
8. Total Questions & Marks
9. Time Allowed
10. Generate

### Phase 3: Key Implementation Details

#### 1. Board Selector Component
```html
<div class="form-section">
  <label class="field-label">Board</label>
  <select id="boardSelect" class="field-input" onchange="onBoardChange()">
    <option value="">— Select Board —</option>
    <option value="SEBA">SEBA (Assam Board)</option>
    <option value="CBSE">CBSE (NCERT)</option>
    <option value="ICSE">ICSE</option>
  </select>
  <p class="hint" id="boardHint"></p>
</div>
```

#### 2. Dynamic Cascading Dropdowns
- Board change → Updates Class dropdown
- Class change → Updates Subject dropdown
- Subject change → Updates Chapter dropdown (multi-select with checkboxes)

#### 3. Chapter Selection UI
Use a searchable multi-select dropdown or checkbox group for chapters:
- Allow teachers to select specific chapters
- Show "Select All" option
- Display chapter weightage if available
- Group by subject (for Science: Physics/Chemistry/Biology)

#### 4. AI Prompt Enhancement

**Current AI Prompt:** Generic subject-based questions

**Enhanced AI Prompt Structure:**
```
You are an expert question paper setter for {board} Board, {class}, {subject}.

STRICT SYLLABUS COMPLIANCE:
- Board: {board} (SEBA/CBSE/ICSE)
- Class: {class}
- Subject: {subject}
- Chapters: {selected_chapters}
- Difficulty: {difficulty}

CHAPTER-SPECIFIC QUESTIONS ONLY:
Generate questions STRICTLY from these chapters:
{chapter_list_with_topics}

QUESTION TYPE DISTRIBUTION:
- MCQ: {count} questions, {marks} marks each
- Short Answer: {count} questions, {marks} marks each
- Long Answer: {count} questions, {marks} marks each

DIFFICULTY LEVEL: {difficulty}

BOARD-SPECIFIC RULES:
{board_specific_instructions}

FORMAT:
1. Follow {board} board question paper format
2. Include clear instructions
3. Provide marking scheme
4. Include answer key at the end
```

#### 5. Board-Specific Instructions for AI

**For SEBA:**
- Use Assamese cultural references where appropriate
- Follow SEBA marking scheme (MCQ: 1 mark, Short: 2-3 marks, Long: 5 marks)
- Include questions on Assam-specific topics (History, Geography of Assam)
- Follow HSLC exam pattern

**For CBSE:**
- Follow NCERT textbook sequence
- Include competency-based questions
- Follow CBSE marking scheme
- Include case-based questions for Class 10

**For ICSE:**
- More comprehensive coverage
- Include diagram-based questions
- Follow CISCE pattern

### Phase 4: File Structure Changes

```
apps/examcraft/
├── index.html          (Modified - add board selector, dynamic dropdowns)
├── style.css           (Add styles for multi-select chapter picker)
├── app.js              (Modified - add cascading logic)
├── syllabus-data.js    (NEW - complete board-class-subject-chapter data)
└── prompt-templates.js (NEW - board-specific AI prompts)
```

---

## 📝 Claude Code Implementation Prompt

### Main Prompt for Claude Code:

```
Implement a board-specific question paper generator for ExamCraft Pro with the following requirements:

### CONTEXT:
Target users are teachers in Kampur, Nagaon, and rural Assam who need accurate, board-specific question papers without human verification.

### RESEARCH DATA PROVIDED:
I have provided complete syllabus data for SEBA (Assam Board), CBSE, and ICSE boards covering Classes 9-10 with detailed chapter lists for Mathematics, Science, English, and Social Science.

### IMPLEMENTATION REQUIREMENTS:

1. **UI CHANGES (index.html):**
   - Add Board selector dropdown (SEBA, CBSE, ICSE) AFTER school name
   - Make Class dropdown dynamic (populated based on board selection)
   - Make Subject dropdown dynamic (show only subjects available for selected board+class)
   - Replace "Topic / Chapter" text input with a multi-select chapter picker that shows chapters based on board+class+subject
   - Add chapter weightage display where available

2. **DATA STRUCTURE (syllabus-data.js):**
   Create a comprehensive JavaScript object containing:
   - All three boards (SEBA, CBSE, ICSE)
   - Classes 9 and 10 for each board
   - Subjects: Mathematics, Science, English, Social Science
   - Complete chapter lists with IDs and names
   - For Science, group chapters by Physics/Chemistry/Biology

3. **JAVASCRIPT LOGIC (app.js):**
   - Implement cascading dropdown functionality:
     * Board selection → Populate Class dropdown
     * Class selection → Populate Subject dropdown
     * Subject selection → Populate Chapter multi-select
   - Store selected chapters as an array
   - Update AI prompt generation to include:
     * Selected board name
     * Selected class
     * Selected subject
     * List of selected chapters
     * Board-specific instructions

4. **AI PROMPT ENHANCEMENT:**
   - Create board-specific system prompts that tell the AI:
     * Which board's syllabus to follow
     * Exact chapters to generate questions from
     * Board-specific question formats
     * Regional context (for SEBA - Assam-specific)

5. **VALIDATION:**
   - Ensure all dropdowns are populated before allowing generation
   - Validate at least one chapter is selected
   - Show appropriate error messages in English/Hindi/Assamese

### SYLLABUS DATA TO IMPLEMENT:

**SEBA Class 9 Mathematics Chapters:**
1. Number System, 2. Polynomials, 3. Coordinate Geometry, 4. Linear Equations in Two Variables, 6. Lines and Angles, 7. Triangles, 8. Quadrilaterals, 9. Areas of Parallelograms and Triangles, 10. Circles, 11. Constructions, 12. Heron's Formula, 13. Surface Area and Volume, 14. Statistics, 15. Probability

**SEBA Class 10 Mathematics Chapters:**
1. Real Numbers, 2. Polynomials, 3. Pair of Linear Equations, 4. Quadratic Equations, 5. Arithmetic Progressions, 6. Triangles, 7. Coordinate Geometry, 8. Introduction to Trigonometry, 9. Heights and Distances (learning only), 10. Circles, 11. Constructions, 12. Areas Related to Circles, 13. Surface Areas and Volumes, 14. Statistics, 15. Probability

**SEBA Class 9 Science Chapters (grouped by subject):**
Physics: Motion, Force and Laws of Motion, Gravitation, Work Energy and Power, Sound
Chemistry: Matter in Our Surroundings, Is Matter Around Us Pure, Atoms and Molecules, Structure of the Atom
Biology: The Fundamental Unit of Life, Tissues

**SEBA Class 10 Science Chapters:**
Chemistry (1-5): Chemical Reactions, Acids Bases Salts, Metals Non-metals, Carbon Compounds, Periodic Classification
Biology (6-9, 15-16): Life Processes, Control and Coordination, Reproduction, Heredity, Our Environment, Natural Resources
Physics (10-14): Light, Human Eye, Electricity, Magnetic Effects, Sources of Energy

**CBSE follows NCERT with these key differences from SEBA:**
- Class 9 Maths: Does NOT have Areas of Parallelograms, Constructions, Probability
- Class 9 Science: Different unit grouping
- Class 10 Maths: Has Applications of Trigonometry (Heights and Distances) in exam

**ICSE has separate Physics, Chemistry, Biology subjects from Class 9**

### FILES TO MODIFY:
1. apps/examcraft/index.html - Add board selector, dynamic dropdowns, chapter multi-select
2. apps/examcraft/app.js - Add cascading logic, chapter selection handling, enhanced AI prompts
3. apps/examcraft/style.css - Add styles for chapter picker UI

### FILES TO CREATE:
1. apps/examcraft/syllabus-data.js - Complete board-class-subject-chapter data structure
2. apps/examcraft/prompt-templates.js - Board-specific AI prompt templates

### KEY CONSTRAINTS:
- Maintain existing multilingual support (EN/HI/AS)
- Keep existing export functionality (PDF, Word)
- Don't break existing API configuration
- Ensure backward compatibility if possible
- Use existing CSS classes and styling patterns
- Validate all selections before generating

### SUCCESS CRITERIA:
1. Teacher can select board, then see only relevant classes
2. After selecting class, only relevant subjects appear
3. After selecting subject, all chapters for that board+class+subject appear
4. Teacher can multi-select chapters
5. Generated questions are strictly from selected chapters
6. Questions follow the selected board's pattern and difficulty
7. No code breakage in existing functionality
```

---

## 📋 Additional Notes for Implementation

### Important Differences Between Boards:

1. **SEBA vs CBSE Class 9 Maths:**
   - SEBA includes: Areas of Parallelograms and Triangles, Constructions, Probability
   - CBSE removed these topics
   - CBSE includes Euclid's Geometry more prominently

2. **Class 10 Maths - Trigonometry:**
   - SEBA: Heights and Distances NOT in exam (learning only)
   - CBSE: Heights and Distances IS in exam

3. **Science Subject Division:**
   - SEBA/CBSE: Combined "Science" subject until Class 10
   - ICSE: Separate Physics, Chemistry, Biology from Class 9

4. **English Literature:**
   - SEBA Class 10: Uses NCERT First Flight & Footprints (like CBSE)
   - ICSE: Different literature texts

### Regional Context for Kampur/Nagaon:

- Most schools in Kampur area follow SEBA (state board)
- Some private schools may follow CBSE
- ICSE is rare in rural Assam
- Many teachers prefer question papers in Assamese
- Focus should be on SEBA with CBSE as secondary option

### Data Maintenance:

- Syllabus data should be easily updatable
- Consider fetching from JSON file for easier updates
- Version control for syllabus changes
- Annual review process for new academic sessions

---

## 🔗 Research Sources

1. [SEBA vs CBSE: Which Board is Better - Careers360](https://school.careers360.com/boards/cbse/seba-vs-cbse)
2. [Assam Board Syllabus 2026 - AglaSem](https://schools.aglasem.com/assam-syllabus/)
3. [SEBA Syllabus 2025-26 - ASSEB News](https://asseb.org/seba-syllabus-2025-26/)
4. [SEBA Class 9 Syllabus 2025 - Assam Board Guide](https://assamnew.com/seba-class-9-syllabus/)
5. [CBSE Class 9 Maths Syllabus 2024-2025 - Jagran Josh](https://www.jagranjosh.com/articles/cbse-class-9-maths-syllabus-2024-2025-pdf-1712563731-1)
6. [ICSE Class 9 Syllabus 2025-26 - Careers360](https://school.careers360.com/boards/cisce/icse-class-9-syllabus)
7. [ICSE Class 10 Syllabus - Careers360](https://school.careers360.com/boards/cisce/icse-10th-syllabus)

---

**Document Created:** 2026-03-29
**For:** Smart Digital ExamCraft Pro Enhancement
**Target Region:** Kampur, Nagaon, Assam
