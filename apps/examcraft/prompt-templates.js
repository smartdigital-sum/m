const PROMPT_TEMPLATES = {
  SEBA: `
BOARD SPECIFIC RULES (SEBA / Assam State Board):
- Follow SEBA marking scheme guidelines.
- For English / Social Science, include Assamese cultural references or regional context where appropriate (e.g. History/Geography of Assam).
- Ensure format matches HSLC exam patterns for Classes 9-10.
- For Classes 1-8, use simplified language aligned with SCERT Assam textbooks.
`,
  CBSE: `
BOARD SPECIFIC RULES (CBSE / NCERT):
- Follow NCERT textbook sequence and terminology strictly.
- Include competency-based and application-oriented questions as per latest CBSE guidelines.
- For Class 10, include case-based or source-based questions if applicable.
- Adhere strictly to the CBSE marking scheme.
`,
  ICSE: `
BOARD SPECIFIC RULES (ICSE / CISCE):
- Provide comprehensive, in-depth coverage of topics.
- Include diagram-based or reason-based questions where applicable.
- Follow the CISCE exam pattern strictly (more detailed questions with sub-parts).
- Use formal and precise academic terminology.
`,
  AJBEC: `
BOARD SPECIFIC RULES (AJBEC / Jatiya Bidyalay):
- Focus on the vernacular (Assamese/English) pedagogical style of Jatiya Bidyalayas.
- For "Assam History", ensure deep historical accuracy regarding the Ahom Kingdom and local dynasties.
- For Science (Class 3+), include observation-based or "Science Practical" type questions.
- Maintain a balance between academic rigor and local cultural values.
`
};

/**
 * DIFFICULTY_RULES
 * These are injected based on the selected difficulty button.
 */
const DIFFICULTY_RULES = {
  Easy: "Direct questions, basic definitions, and simple recall. Lower complexity vocabulary.",
  Medium: "A mix of recall and conceptual understanding. Moderate problem-solving required.",
  Hard: "Higher-order thinking (HOTS), complex applications, and multi-step reasoning.",
  Mixed: "A balanced distribution: 30% Easy, 40% Medium, 30% Hard."
};

window.PROMPT_TEMPLATES = PROMPT_TEMPLATES;
window.DIFFICULTY_RULES = DIFFICULTY_RULES;
