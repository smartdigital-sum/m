// ================================================================
//  templates.js — Three resume templates
//  Each function returns a standalone HTML string with embedded
//  CSS so it renders correctly in PDF export & browser preview.
// ================================================================

function getTemplate(name, data) {
  switch (name) {
    case 'classic': return getClassicTemplate(data);
    case 'minimal': return getMinimalTemplate(data);
    default:        return getModernTemplate(data);
  }
}

// ─── Helpers ───────────────────────────────────────────────────

function skillTags(arr, color) {
  if (!arr || !arr.length) return '';
  return arr.map(s => `<span style="display:inline-block;background:${color};padding:3px 10px;border-radius:20px;font-size:11px;margin:3px 3px 0 0;">${esc(s)}</span>`).join('');
}

function bulletList(arr) {
  if (!arr || !arr.length) return '';
  return arr.map(b => `<li style="margin-bottom:5px;">${esc(b)}</li>`).join('');
}

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function contactLine(c) {
  return [c.email, c.phone, c.location, c.linkedin, c.github].filter(Boolean).map(esc).join(' &nbsp;|&nbsp; ');
}

// ═══════════════════════════════════════════════════════════════
//  TEMPLATE 1 — MODERN (navy header + two-column)
// ═══════════════════════════════════════════════════════════════
function getModernTemplate(data) {
  const c = data.contact || {};
  return `
<div style="font-family:Calibri,Arial,sans-serif;width:794px;min-height:1122px;background:#fff;box-sizing:border-box;color:#1a1a1a;">

  <!-- HEADER -->
  <div style="background:#0B3954;color:#fff;padding:32px 36px 28px;">
    <h1 style="margin:0 0 4px;font-size:28px;letter-spacing:0.5px;">${esc(data.name)}</h1>
    <p style="margin:0 0 12px;font-size:14px;opacity:0.85;font-style:italic;">${esc(data.headline)}</p>
    <div style="font-size:12px;opacity:0.75;">${contactLine(c)}</div>
  </div>

  <!-- BODY: sidebar + main -->
  <div style="display:flex;min-height:900px;">

    <!-- SIDEBAR -->
    <div style="width:248px;flex-shrink:0;background:#F0F4F8;padding:24px 20px;border-right:1px solid #dde3ea;">

      ${data.skills?.technical?.length ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Technical Skills</div>
        <div>${skillTags(data.skills.technical, '#E8A838')}</div>
      </div>` : ''}

      ${data.skills?.soft?.length ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Soft Skills</div>
        <div>${skillTags(data.skills.soft, '#dde8f0')}</div>
      </div>` : ''}

      ${data.skills?.languages?.length ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Languages</div>
        <div>${skillTags(data.skills.languages, '#e6f0e6')}</div>
      </div>` : ''}

      ${data.education?.length ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Education</div>
        ${data.education.map(e => `
        <div style="margin-bottom:14px;">
          <div style="font-size:12px;font-weight:700;">${esc(e.degree)}</div>
          <div style="font-size:11px;color:#444;margin:2px 0;">${esc(e.institution)}</div>
          <div style="font-size:11px;color:#666;">${esc(e.year)}${e.grade ? ' &nbsp;·&nbsp; ' + esc(e.grade) : ''}</div>
        </div>`).join('')}
      </div>` : ''}

    </div>

    <!-- MAIN -->
    <div style="flex:1;padding:24px 28px;">

      ${data.summary ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:10px;">Professional Summary</div>
        <p style="font-size:12.5px;line-height:1.65;margin:0;color:#333;">${esc(data.summary)}</p>
      </div>` : ''}

      ${data.experience?.length ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Work Experience</div>
        ${data.experience.map(e => `
        <div style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <span style="font-size:13px;font-weight:700;">${esc(e.title)}</span>
            <span style="font-size:11px;color:#666;font-style:italic;">${esc(e.duration)}</span>
          </div>
          <div style="font-size:12px;color:#0B3954;margin-bottom:6px;font-weight:600;">${esc(e.company)}</div>
          ${e.bullets?.length ? `<ul style="margin:0;padding-left:16px;font-size:12px;color:#333;line-height:1.6;">${bulletList(e.bullets)}</ul>` : ''}
        </div>`).join('')}
      </div>` : ''}

      ${data.projects?.length ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Projects</div>
        ${data.projects.map(p => `
        <div style="margin-bottom:14px;">
          <div style="font-size:13px;font-weight:700;">${esc(p.name)}</div>
          ${p.technologies ? `<div style="font-size:11px;color:#0B3954;margin:3px 0;font-style:italic;">Tech: ${esc(p.technologies)}</div>` : ''}
          <div style="font-size:12px;color:#333;line-height:1.55;margin-top:4px;">${esc(p.description)}</div>
        </div>`).join('')}
      </div>` : ''}

    </div>
  </div>
</div>`;
}

// ═══════════════════════════════════════════════════════════════
//  TEMPLATE 2 — CLASSIC (centered name, single column, serif)
// ═══════════════════════════════════════════════════════════════
function getClassicTemplate(data) {
  const c = data.contact || {};
  return `
<div style="font-family:Georgia,'Times New Roman',serif;width:794px;min-height:1122px;background:#fff;padding:52px 60px;box-sizing:border-box;color:#111;">

  <!-- HEADER -->
  <div style="text-align:center;margin-bottom:18px;">
    <h1 style="margin:0 0 6px;font-size:30px;letter-spacing:1px;font-weight:700;">${esc(data.name)}</h1>
    ${data.headline ? `<p style="margin:0 0 8px;font-size:13px;font-style:italic;color:#444;">${esc(data.headline)}</p>` : ''}
    <div style="font-size:11.5px;color:#555;font-family:Arial,sans-serif;">${contactLine(c)}</div>
  </div>

  <hr style="border:none;border-top:2px solid #111;margin:0 0 18px;" />

  ${data.summary ? `
  <div style="margin-bottom:20px;">
    <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:8px;">Objective</div>
    <p style="margin:0;font-size:12.5px;line-height:1.7;color:#222;">${esc(data.summary)}</p>
    <hr style="border:none;border-top:1px solid #ccc;margin:18px 0 0;" />
  </div>` : ''}

  ${data.education?.length ? `
  <div style="margin-bottom:20px;">
    <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:10px;">Education</div>
    ${data.education.map(e => `
    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
      <div>
        <div style="font-size:13px;font-weight:700;">${esc(e.degree)}</div>
        <div style="font-size:12px;font-style:italic;color:#444;">${esc(e.institution)}</div>
        ${e.highlights?.length ? `<div style="font-size:11.5px;color:#555;">${e.highlights.join(' · ')}</div>` : ''}
      </div>
      <div style="text-align:right;flex-shrink:0;">
        <div style="font-size:12px;color:#333;">${esc(e.year)}</div>
        ${e.grade ? `<div style="font-size:12px;color:#555;">${esc(e.grade)}</div>` : ''}
      </div>
    </div>`).join('')}
    <hr style="border:none;border-top:1px solid #ccc;margin:10px 0 0;" />
  </div>` : ''}

  ${data.experience?.length ? `
  <div style="margin-bottom:20px;">
    <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:10px;">Work Experience</div>
    ${data.experience.map(e => `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;">
        <span style="font-size:13px;font-weight:700;">${esc(e.title)}, <span style="font-weight:400;font-style:italic;">${esc(e.company)}</span></span>
        <span style="font-size:11.5px;color:#555;font-family:Arial,sans-serif;">${esc(e.duration)}</span>
      </div>
      ${e.bullets?.length ? `<ul style="margin:6px 0 0;padding-left:18px;font-size:12.5px;line-height:1.65;">${bulletList(e.bullets)}</ul>` : ''}
    </div>`).join('')}
    <hr style="border:none;border-top:1px solid #ccc;margin:10px 0 0;" />
  </div>` : ''}

  ${data.projects?.length ? `
  <div style="margin-bottom:20px;">
    <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:10px;">Projects</div>
    ${data.projects.map(p => `
    <div style="margin-bottom:12px;">
      <div style="font-size:13px;font-weight:700;">${esc(p.name)}${p.technologies ? ` <span style="font-size:11px;font-weight:400;font-style:italic;color:#555;">  (${esc(p.technologies)})</span>` : ''}</div>
      <div style="font-size:12.5px;line-height:1.65;color:#222;margin-top:4px;">${esc(p.description)}</div>
    </div>`).join('')}
    <hr style="border:none;border-top:1px solid #ccc;margin:10px 0 0;" />
  </div>` : ''}

  ${(data.skills?.technical?.length || data.skills?.soft?.length) ? `
  <div style="margin-bottom:20px;">
    <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;font-family:Arial,sans-serif;margin-bottom:10px;">Skills</div>
    <table style="width:100%;font-size:12.5px;line-height:1.6;">
      ${data.skills.technical?.length ? `<tr><td style="font-weight:700;width:130px;vertical-align:top;">Technical</td><td>${data.skills.technical.map(esc).join(', ')}</td></tr>` : ''}
      ${data.skills.soft?.length ? `<tr><td style="font-weight:700;vertical-align:top;">Soft Skills</td><td>${data.skills.soft.map(esc).join(', ')}</td></tr>` : ''}
      ${data.skills.languages?.length ? `<tr><td style="font-weight:700;vertical-align:top;">Languages</td><td>${data.skills.languages.map(esc).join(', ')}</td></tr>` : ''}
    </table>
  </div>` : ''}

</div>`;
}

// ═══════════════════════════════════════════════════════════════
//  TEMPLATE 3 — MINIMAL (ultra-clean, lots of whitespace)
// ═══════════════════════════════════════════════════════════════
function getMinimalTemplate(data) {
  const c = data.contact || {};
  return `
<div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;width:794px;min-height:1122px;background:#fff;padding:56px 64px;box-sizing:border-box;color:#1a1a1a;">

  <!-- HEADER -->
  <div style="border-left:4px solid #1a1a1a;padding-left:20px;margin-bottom:32px;">
    <h1 style="margin:0 0 4px;font-size:26px;font-weight:700;letter-spacing:-0.5px;">${esc(data.name)}</h1>
    ${data.headline ? `<p style="margin:0 0 8px;font-size:13px;color:#666;font-weight:300;">${esc(data.headline)}</p>` : ''}
    <div style="font-size:11.5px;color:#888;">${contactLine(c)}</div>
  </div>

  ${data.summary ? `
  <div style="margin-bottom:28px;">
    <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#888;font-weight:600;margin-bottom:8px;">Summary</div>
    <p style="margin:0;font-size:13px;line-height:1.75;color:#333;font-weight:300;">${esc(data.summary)}</p>
  </div>
  <div style="height:1px;background:#e5e5e5;margin-bottom:28px;"></div>` : ''}

  ${data.experience?.length ? `
  <div style="margin-bottom:28px;">
    <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#888;font-weight:600;margin-bottom:14px;">Experience</div>
    ${data.experience.map(e => `
    <div style="margin-bottom:18px;">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;">
        <span style="font-size:14px;font-weight:600;">${esc(e.title)}</span>
        <span style="font-size:11.5px;color:#999;">${esc(e.duration)}</span>
      </div>
      <div style="font-size:12px;color:#666;margin-bottom:7px;">${esc(e.company)}</div>
      ${e.bullets?.length ? `<ul style="margin:0;padding-left:16px;font-size:12.5px;color:#444;line-height:1.7;font-weight:300;">${bulletList(e.bullets)}</ul>` : ''}
    </div>`).join('')}
  </div>
  <div style="height:1px;background:#e5e5e5;margin-bottom:28px;"></div>` : ''}

  ${data.projects?.length ? `
  <div style="margin-bottom:28px;">
    <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#888;font-weight:600;margin-bottom:14px;">Projects</div>
    ${data.projects.map(p => `
    <div style="margin-bottom:16px;">
      <div style="font-size:14px;font-weight:600;margin-bottom:3px;">${esc(p.name)}</div>
      ${p.technologies ? `<div style="font-size:11.5px;color:#888;margin-bottom:5px;">${esc(p.technologies)}</div>` : ''}
      <div style="font-size:12.5px;color:#444;line-height:1.7;font-weight:300;">${esc(p.description)}</div>
    </div>`).join('')}
  </div>
  <div style="height:1px;background:#e5e5e5;margin-bottom:28px;"></div>` : ''}

  ${data.education?.length ? `
  <div style="margin-bottom:28px;">
    <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#888;font-weight:600;margin-bottom:14px;">Education</div>
    ${data.education.map(e => `
    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
      <div>
        <div style="font-size:13.5px;font-weight:600;">${esc(e.degree)}</div>
        <div style="font-size:12px;color:#666;font-weight:300;">${esc(e.institution)}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px;color:#888;">${esc(e.year)}</div>
        ${e.grade ? `<div style="font-size:12px;color:#aaa;">${esc(e.grade)}</div>` : ''}
      </div>
    </div>`).join('')}
  </div>
  <div style="height:1px;background:#e5e5e5;margin-bottom:28px;"></div>` : ''}

  ${(data.skills?.technical?.length || data.skills?.soft?.length) ? `
  <div style="margin-bottom:20px;">
    <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#888;font-weight:600;margin-bottom:14px;">Skills</div>
    <div style="display:flex;flex-wrap:wrap;gap:20px;">
      ${data.skills.technical?.length ? `
      <div>
        <div style="font-size:11px;color:#aaa;margin-bottom:6px;">Technical</div>
        <div>${data.skills.technical.map(s => `<span style="display:inline-block;background:#f4f4f4;padding:4px 12px;font-size:11.5px;border-radius:3px;margin:3px 4px 0 0;">${esc(s)}</span>`).join('')}</div>
      </div>` : ''}
      ${data.skills.soft?.length ? `
      <div>
        <div style="font-size:11px;color:#aaa;margin-bottom:6px;">Soft Skills</div>
        <div style="font-size:12.5px;color:#555;font-weight:300;line-height:2;">${data.skills.soft.map(esc).join('  ·  ')}</div>
      </div>` : ''}
      ${data.skills.languages?.length ? `
      <div>
        <div style="font-size:11px;color:#aaa;margin-bottom:6px;">Languages</div>
        <div style="font-size:12.5px;color:#555;font-weight:300;line-height:2;">${data.skills.languages.map(esc).join('  ·  ')}</div>
      </div>` : ''}
    </div>
  </div>` : ''}

</div>`;
}

// ─── Cover Letter Template ──────────────────────────────────────
function getCoverLetterHTML(data) {
  const c = data.contact || {};
  return `
<div style="font-family:Calibri,Arial,sans-serif;width:794px;min-height:1122px;padding:56px 60px;box-sizing:border-box;color:#1a1a1a;background:#fff;">
  <div style="text-align:right;margin-bottom:32px;font-size:12px;color:#555;">
    ${esc(c.location || '')}<br/>
    ${new Date().toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}
  </div>
  <div style="margin-bottom:24px;">
    <strong style="font-size:14px;">${esc(data.name)}</strong><br/>
    <span style="font-size:12px;color:#555;">${[c.email,c.phone].filter(Boolean).join('  |  ')}</span>
  </div>
  <div style="white-space:pre-line;font-size:13px;line-height:1.85;color:#222;">${esc(data.coverLetter || '')}</div>
</div>`;
}
