const PROMPT_TEMPLATES = {
  SEBA: `
BOARD SPECIFIC RULES (SEBA / Assam State Board):
- Follow SEBA marking scheme guidelines.
- For English / Social Science, include Assamese cultural references or regional context where appropriate (e.g. History/Geography of Assam).
- Ensure format matches HSLC exam patterns.
- Keep the language completely aligned with the SEBA textbook syllabus.
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
- Follow the CISCE exam pattern strictly (more detailed questions with sub-parts compared to other boards).
`
};

window.PROMPT_TEMPLATES = PROMPT_TEMPLATES;
