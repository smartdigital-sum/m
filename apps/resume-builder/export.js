// ================================================================
//  export.js — Download helpers: PDF and Word (.docx)
// ================================================================

// ─── PDF Export ─────────────────────────────────────────────────

async function downloadPDF() {
  const data = window.generatedResumeData;
  const tpl  = window.selectedTemplate || 'modern';
  if (!data) return;
  _triggerHtml2PDF(getTemplate(tpl, data), `${data.name || 'Resume'}_Resume`);
}

async function downloadCoverLetterPDF() {
  const data = window.generatedResumeData;
  if (!data?.coverLetter) return;
  _triggerHtml2PDF(getCoverLetterHTML(data), `${data.name || 'Resume'}_Cover_Letter`);
}

function _triggerHtml2PDF(htmlString, filename) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = htmlString;
  wrapper.style.cssText = 'position:absolute;left:-9999px;top:0;';
  document.body.appendChild(wrapper);

  const opt = {
    margin:      0,
    filename:    `${filename}.pdf`,
    image:       { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF:       { unit: 'px', format: [794, 1122], orientation: 'portrait' }
  };

  html2pdf().set(opt).from(wrapper).save().then(() => {
    document.body.removeChild(wrapper);
  });
}

// ─── DOCX Export ─────────────────────────────────────────────────

async function downloadWord() {
  const data = window.generatedResumeData;
  if (!data) return;
  try {
    const doc  = _buildDocxDocument(data);
    const blob = await window.docx.Packer.toBlob(doc);
    saveAs(blob, `${data.name || 'Resume'}_Resume.docx`);
  } catch (e) {
    console.error('DOCX error:', e);
    alert('Word download failed. Please use PDF instead.');
  }
}

async function downloadCoverLetterWord() {
  const data = window.generatedResumeData;
  if (!data?.coverLetter) return;
  try {
    const doc  = _buildCoverLetterDocx(data);
    const blob = await window.docx.Packer.toBlob(doc);
    saveAs(blob, `${data.name || 'Resume'}_Cover_Letter.docx`);
  } catch (e) {
    console.error('DOCX error:', e);
    alert('Word download failed. Please use PDF instead.');
  }
}

// ─── DOCX Builder ───────────────────────────────────────────────

function _buildDocxDocument(d) {
  const { Document, Paragraph, TextRun, AlignmentType, BorderStyle, HeadingLevel } = window.docx;

  const HR = () => new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '0B3954' } },
    spacing: { after: 160 }
  });

  const SEC = (text) => new Paragraph({
    children: [new TextRun({ text, bold: true, size: 22, allCaps: true, color: '0B3954', font: 'Calibri' })],
    spacing: { before: 240, after: 100 }
  });

  const BODY_RUN = (text, opts={}) =>
    new TextRun({ text: text || '', size: 20, font: 'Calibri', color: '222222', ...opts });

  const children = [];
  const c = d.contact || {};

  // ── Name
  children.push(new Paragraph({
    children: [new TextRun({ text: d.name || '', bold: true, size: 36, font: 'Calibri', color: '0B3954' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 }
  }));

  // ── Headline
  if (d.headline) {
    children.push(new Paragraph({
      children: [new TextRun({ text: d.headline, size: 22, font: 'Calibri', italics: true, color: '555555' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 }
    }));
  }

  // ── Contact
  const ctParts = [c.email, c.phone, c.location, c.linkedin, c.github].filter(Boolean);
  children.push(new Paragraph({
    children: [new TextRun({ text: ctParts.join('  |  '), size: 18, font: 'Calibri', color: '555555' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 }
  }));

  children.push(HR());

  // ── Summary
  if (d.summary) {
    children.push(SEC('Professional Summary'));
    children.push(new Paragraph({ children: [BODY_RUN(d.summary)], spacing: { after: 160 } }));
    children.push(HR());
  }

  // ── Education
  if (d.education?.length) {
    children.push(SEC('Education'));
    d.education.forEach(e => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: e.degree || '', bold: true, size: 22, font: 'Calibri' }),
          new TextRun({ text: e.institution ? '  —  ' + e.institution : '', size: 22, font: 'Calibri' })
        ],
        spacing: { after: 50 }
      }));
      children.push(new Paragraph({
        children: [BODY_RUN([e.year, e.grade].filter(Boolean).join('  ·  '), { color: '666666', size: 18 })],
        spacing: { after: 120 }
      }));
    });
    children.push(HR());
  }

  // ── Experience
  if (d.experience?.length) {
    children.push(SEC('Work Experience'));
    d.experience.forEach(e => {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: e.title || '', bold: true, size: 22, font: 'Calibri' }),
          new TextRun({ text: e.company ? ' at ' + e.company : '', size: 22, font: 'Calibri' })
        ],
        spacing: { after: 50 }
      }));
      if (e.duration) {
        children.push(new Paragraph({
          children: [BODY_RUN(e.duration, { italics: true, color: '666666', size: 19 })],
          spacing: { after: 60 }
        }));
      }
      (e.bullets || []).forEach(b => {
        children.push(new Paragraph({
          children: [BODY_RUN('• ' + b)],
          indent: { left: 360 },
          spacing: { after: 40 }
        }));
      });
      children.push(new Paragraph({ spacing: { after: 80 } }));
    });
    children.push(HR());
  }

  // ── Projects
  if (d.projects?.length) {
    children.push(SEC('Projects'));
    d.projects.forEach(p => {
      children.push(new Paragraph({
        children: [new TextRun({ text: p.name || '', bold: true, size: 22, font: 'Calibri' })],
        spacing: { after: 50 }
      }));
      if (p.technologies) {
        children.push(new Paragraph({
          children: [BODY_RUN('Technologies: ' + p.technologies, { italics: true, color: '555555', size: 18 })],
          spacing: { after: 50 }
        }));
      }
      if (p.description) {
        children.push(new Paragraph({ children: [BODY_RUN(p.description)], spacing: { after: 120 } }));
      }
    });
    children.push(HR());
  }

  // ── Skills
  if (d.skills) {
    children.push(SEC('Skills'));
    if (d.skills.technical?.length) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Technical: ', bold: true, size: 20, font: 'Calibri' }),
          BODY_RUN(d.skills.technical.join(', '))
        ],
        spacing: { after: 80 }
      }));
    }
    if (d.skills.soft?.length) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Soft Skills: ', bold: true, size: 20, font: 'Calibri' }),
          BODY_RUN(d.skills.soft.join(', '))
        ],
        spacing: { after: 80 }
      }));
    }
    if (d.skills.languages?.length) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Languages: ', bold: true, size: 20, font: 'Calibri' }),
          BODY_RUN(d.skills.languages.join(', '))
        ],
        spacing: { after: 80 }
      }));
    }
  }

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 720, right: 864, bottom: 720, left: 864 } } },
      children
    }]
  });
}

function _buildCoverLetterDocx(d) {
  const { Document, Paragraph, TextRun, AlignmentType } = window.docx;
  const c = d.contact || {};

  const lines = (d.coverLetter || '').split('\n');

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 900, right: 900, bottom: 900, left: 900 } } },
      children: [
        new Paragraph({
          children: [new TextRun({ text: d.name || '', bold: true, size: 28, font: 'Calibri' })],
          spacing: { after: 80 }
        }),
        new Paragraph({
          children: [new TextRun({ text: [c.email, c.phone].filter(Boolean).join('  |  '), size: 18, font: 'Calibri', color: '555555' })],
          spacing: { after: 400 }
        }),
        ...lines.map(line => new Paragraph({
          children: [new TextRun({ text: line, size: 22, font: 'Calibri' })],
          spacing: { after: 80 }
        }))
      ]
    }]
  });
}
