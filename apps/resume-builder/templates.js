// ================================================================
//  templates.js — Three resume templates
// ================================================================

function getTemplate(name, data) {
  switch (name) {
    case 'classic': return getBasicTemplate(data); // "classic" UI map -> Basic
    case 'minimal': return getStandardTemplate(data); // "minimal" UI map -> Standard
    default:        return getPremiumTemplate(data); // "modern" UI map -> Premium
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
  return [c.email, c.phone, c.permAddress, c.linkedin, c.github].filter(Boolean).map(esc).join(' &nbsp;|&nbsp; ');
}

// ═══════════════════════════════════════════════════════════════
//  TEMPLATE 1 — BASIC (Image 1 Style)
// ═══════════════════════════════════════════════════════════════
function getBasicTemplate(data) {
  const c = data.contact || {};
  const p = data.personal || {};
  const imgHtml = data.photo ? `<img src="${data.photo}" style="width:100px;height:120px;object-fit:cover;border:1px solid #000;display:block;" />` : `<div style="width:100px;height:120px;border:1px solid #000;"></div>`;

  return `
<div style="font-family:'Times New Roman',Times,serif;width:794px;min-height:1122px;background:#fff;padding:48px 56px;box-sizing:border-box;color:#000;">
  
  <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
    <div>
      <h1 style="margin:0 0 5px;font-size:24px;text-transform:uppercase;font-weight:bold;">${esc(data.name)}</h1>
      <div style="font-size:14px;font-weight:bold;margin-bottom:3px;font-style:italic;">Permanent Address:</div>
      <div style="font-size:13px;line-height:1.4;">
        ${esc(c.permAddress)}<br/>
        Contact no. ${esc(c.phone)}<br/>
        Email: ${esc(c.email)}
      </div>
    </div>
    <div style="flex-shrink:0;">
      ${imgHtml}
    </div>
  </div>

  <div style="text-align:center;font-weight:bold;text-decoration:underline;font-size:16px;margin-bottom:10px;">Career Objective</div>
  <p style="font-size:13px;line-height:1.5;margin:0 0 20px;">${esc(data.summary)}</p>

  <div style="text-align:center;font-weight:bold;font-size:14px;margin-bottom:10px;">Educational Qualifications</div>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px;text-align:center;">
    <tr>
      <th style="border:1px solid #000;padding:6px;font-weight:bold;">Degree</th>
      <th style="border:1px solid #000;padding:6px;font-weight:bold;">Institutions</th>
      <th style="border:1px solid #000;padding:6px;font-weight:bold;">Board/ University</th>
      <th style="border:1px solid #000;padding:6px;font-weight:bold;">Year of Passing</th>
    </tr>
    ${data.education?.map(e => `
    <tr>
      <td style="border:1px solid #000;padding:6px;">${esc(e.degree)}</td>
      <td style="border:1px solid #000;padding:6px;">${esc(e.institution)}</td>
      <td style="border:1px solid #000;padding:6px;">${esc(e.highlights?.[0] || '-')}</td>
      <td style="border:1px solid #000;padding:6px;">${esc(e.year)}</td>
    </tr>`).join('') || ''}
  </table>

  ${data.experience?.length ? `
  <div style="text-align:center;font-weight:bold;text-decoration:underline;font-size:16px;margin-bottom:10px;">Experience</div>
  <ul style="font-size:13px;line-height:1.6;margin:0 0 20px;padding-left:20px;">
    ${data.experience.map(e => `<li style="margin-bottom:6px;"><b>${esc(e.title)}</b> at ${esc(e.company)} (${esc(e.duration)})<br/>${esc(e.description || e.bullets?.join(' '))}</li>`).join('')}
  </ul>` : ''}

  ${data.projects?.length && !data.experience?.length ? `
  <div style="text-align:center;font-weight:bold;text-decoration:underline;font-size:16px;margin-bottom:10px;">Projects</div>
  <ul style="font-size:13px;line-height:1.6;margin:0 0 20px;padding-left:20px;">
    ${data.projects.map(p => `<li style="margin-bottom:6px;"><b>${esc(p.name)}</b> (${esc(p.technologies)})<br/>${esc(p.description)}</li>`).join('')}
  </ul>` : ''}

  ${data.skills?.technical?.length ? `
  <div style="text-align:center;font-weight:bold;text-decoration:underline;font-size:16px;margin-bottom:10px;">Software skills</div>
  <ul style="font-size:13px;line-height:1.6;margin:0 0 20px;padding-left:20px;">
    <li>${esc(data.skills.technical.join(', '))}</li>
  </ul>` : ''}

  <div style="text-align:center;font-weight:bold;text-decoration:underline;font-size:16px;margin-bottom:10px;">Personal Details</div>
  <table style="font-size:13px;line-height:1.6;margin-bottom:20px;">
    <tr><td style="width:140px;vertical-align:top;"><li>Date of Birth:</li></td><td>${esc(p.dob)}</td></tr>
    <tr><td style="vertical-align:top;"><li>Nationality:</li></td><td>${esc(p.nationality)}</td></tr>
    <tr><td style="vertical-align:top;"><li>Gender:</li></td><td>${esc(p.gender)}</td></tr>
    <tr><td style="vertical-align:top;"><li>Father's Name:</li></td><td>${esc(p.fatherName)}</td></tr>
    <tr><td style="vertical-align:top;"><li>Mother's Name:</li></td><td>${esc(p.motherName)}</td></tr>
    ${p.religion ? `<tr><td style="vertical-align:top;"><li>Religion:</li></td><td>${esc(p.religion)}</td></tr>` : ''}
    ${p.maritalStatus ? `<tr><td style="vertical-align:top;"><li>Marital Status:</li></td><td>${esc(p.maritalStatus)}</td></tr>` : ''}
    ${data.skills?.languages?.length ? `<tr><td style="vertical-align:top;"><li>Languages:</li></td><td>${esc(data.skills.languages.join(', '))}</td></tr>` : ''}
  </table>

  <div style="text-align:center;font-size:13px;margin-top:20px;">
    I do hereby declare that all the above-furnished details are true to the best of my knowledge & belief.
  </div>

  <div style="margin-top:40px;font-size:13px;display:flex;justify-content:space-between;">
    <div>Place: ...................</div>
    <div style="text-align:center;font-weight:bold;">SIGNATURE</div>
  </div>

</div>`;
}

// ═══════════════════════════════════════════════════════════════
//  TEMPLATE 2 — STANDARD (Image 2 Style)
// ═══════════════════════════════════════════════════════════════
function getStandardTemplate(data) {
  const c = data.contact || {};
  const p = data.personal || {};
  const imgHtml = data.photo ? `<img src="${data.photo}" style="width:100px;height:120px;object-fit:cover;display:block;" />` : `<div style="width:100px;height:120px;"></div>`;

  return `
<div style="font-family:'Times New Roman',Times,serif;width:794px;min-height:1122px;background:#fff;padding:40px;box-sizing:border-box;color:#000;">

  <div style="border:1px solid #000;background:#e5e5e5;text-align:center;font-weight:bold;padding:6px;font-size:16px;">CURRICULUM VITAE</div>
  
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:15px;font-size:13px;">
    <tr>
      <td colspan="3" style="border:1px solid #000;padding:6px;font-weight:bold;font-size:14px;">${esc(data.name)}</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:8px;width:40%;vertical-align:top;">
        <b>(Permanent Address)</b><br/>
        ${esc(c.permAddress)}<br/><br/>
        <b>M - ${esc(c.phone)}</b><br/>
        <b>Email Id - <br/>${esc(c.email)}</b>
      </td>
      <td style="border:1px solid #000;padding:8px;text-align:center;vertical-align:middle;width:40%;">
        <b>(Correspondence Address)</b><br/>
        ${c.corrAddress ? esc(c.corrAddress) : 'Same as Permanent address'}
      </td>
      <td style="border:1px solid #000;padding:4px;text-align:center;vertical-align:middle;width:20%;">
        ${imgHtml}
      </td>
    </tr>
  </table>

  <div style="border:1px solid #000;background:#e5e5e5;text-align:center;font-weight:bold;padding:4px;font-size:14px;margin-bottom:0;">CAREER OBJECTIVE</div>
  <div style="border:1px solid #000;border-top:none;padding:10px;font-size:13px;margin-bottom:15px;">
    <ul style="margin:0;padding-left:20px;"><li>${esc(data.summary)}</li></ul>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:15px;font-size:13px;text-align:center;border:1px solid #000;">
    <tr style="background:#e5e5e5;">
      <th style="border:1px solid #000;padding:6px;">Examination<br/>Passes</th>
      <th style="border:1px solid #000;padding:6px;">Board / University</th>
      <th style="border:1px solid #000;padding:6px;">Year of<br/>Passing</th>
      <th style="border:1px solid #000;padding:6px;">Division/CGPA</th>
    </tr>
    ${data.education?.map(e => `
    <tr>
      <td style="border:1px solid #000;padding:6px;">${esc(e.degree)}</td>
      <td style="border:1px solid #000;padding:6px;">${esc(e.institution)}</td>
      <td style="border:1px solid #000;padding:6px;">${esc(e.year)}</td>
      <td style="border:1px solid #000;padding:6px;">${esc(e.grade)}</td>
    </tr>`).join('') || ''}
  </table>

  <div style="border:1px solid #000;background:#e5e5e5;text-align:center;font-weight:bold;padding:4px;font-size:14px;">PROFESSIONAL QUALIFICATION / SKILLS</div>
  <div style="border:1px solid #000;border-top:none;padding:10px;font-size:13px;margin-bottom:15px;">
    <ul style="margin:0;padding-left:20px;"><li>${esc(data.skills?.technical?.join(', ') || 'NA')}</li></ul>
  </div>

  <div style="border:1px solid #000;background:#e5e5e5;text-align:center;font-weight:bold;padding:4px;font-size:14px;">Experience / Projects</div>
  <div style="border:1px solid #000;border-top:none;padding:10px;font-size:13px;margin-bottom:15px;">
    <ul style="margin:0;padding-left:20px;">
      ${data.experience?.length ? data.experience.map(e => `<li style="margin-bottom:4px;"><b>${esc(e.title)}</b>, ${esc(e.company)} (${esc(e.duration)})<br/>${esc(e.description || e.bullets?.join(' '))}</li>`).join('') : ''}
      ${data.projects?.length && !data.experience?.length ? data.projects.map(p => `<li style="margin-bottom:4px;"><b>${esc(p.name)}</b> (${esc(p.technologies)})<br/>${esc(p.description)}</li>`).join('') : ''}
      ${!data.experience?.length && !data.projects?.length ? '<li>NA</li>' : ''}
    </ul>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:15px;font-size:13px;border:1px solid #000;text-align:center;">
    <tr>
      <td rowspan="${(data.skills?.languages?.length || 1) + 1}" style="border:1px solid #000;width:20%;background:#e5e5e5;font-weight:bold;">LANGUAGES<br/>KNOWN</td>
    </tr>
    ${data.skills?.languages?.length ? data.skills.languages.map(l => `<tr><td style="border:1px solid #000;padding:4px;text-transform:uppercase;">${esc(l)}</td></tr>`).join('') : '<tr><td style="border:1px solid #000;padding:4px;">ENGLISH</td></tr>'}
  </table>

  <div style="border:1px solid #000;background:#e5e5e5;text-align:center;font-weight:bold;padding:4px;font-size:14px;">PERSONAL INFORMATION</div>
  <table style="width:100%;border-collapse:collapse;border:1px solid #000;font-size:13px;margin-bottom:20px;">
    <tr><td style="border:1px solid #000;padding:4px 8px;width:30%;">Name</td><td style="border:1px solid #000;padding:4px 8px;font-weight:bold;">${esc(data.name)}</td></tr>
    <tr><td style="border:1px solid #000;padding:4px 8px;">Father's Name</td><td style="border:1px solid #000;padding:4px 8px;font-weight:bold;">${esc(p.fatherName)}</td></tr>
    <tr><td style="border:1px solid #000;padding:4px 8px;">Mother's Name</td><td style="border:1px solid #000;padding:4px 8px;font-weight:bold;">${esc(p.motherName)}</td></tr>
    <tr><td style="border:1px solid #000;padding:4px 8px;">Date of Birth</td><td style="border:1px solid #000;padding:4px 8px;">${esc(p.dob)}</td></tr>
    <tr><td style="border:1px solid #000;padding:4px 8px;">Gender</td><td style="border:1px solid #000;padding:4px 8px;">${esc(p.gender)}</td></tr>
    <tr><td style="border:1px solid #000;padding:4px 8px;">Religion</td><td style="border:1px solid #000;padding:4px 8px;">${esc(p.religion)}</td></tr>
    <tr><td style="border:1px solid #000;padding:4px 8px;">Nationality</td><td style="border:1px solid #000;padding:4px 8px;">${esc(p.nationality)}</td></tr>
    <tr><td style="border:1px solid #000;padding:4px 8px;">Caste</td><td style="border:1px solid #000;padding:4px 8px;">${esc(p.caste)}</td></tr>
    <tr><td style="border:1px solid #000;padding:4px 8px;">Marital Status</td><td style="border:1px solid #000;padding:4px 8px;">${esc(p.maritalStatus)}</td></tr>
  </table>

  <div style="text-align:center;text-decoration:underline;font-weight:bold;font-size:14px;margin-bottom:10px;">DECLARATION</div>
  <div style="font-size:13px;font-style:italic;margin-bottom:40px;text-indent:40px;">
    I do hereby declare that the above facts and information are true and correct to the best of my knowledge & belief.
  </div>

  <div style="font-size:13px;display:flex;justify-content:space-between;">
    <div>Place :-<br/><br/>Date:-</div>
    <div style="text-align:center;display:flex;align-items:flex-end;">Signature</div>
  </div>

</div>`;
}

// ═══════════════════════════════════════════════════════════════
//  TEMPLATE 3 — PREMIUM (Modern)
// ═══════════════════════════════════════════════════════════════
function getPremiumTemplate(data) {
  const c = data.contact || {};
  const p = data.personal || {};
  const imgHtml = data.photo ? `<img src="${data.photo}" style="width:110px;height:110px;object-fit:cover;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 5px rgba(0,0,0,0.1);" />` : '';

  return `
<div style="font-family:Calibri,Arial,sans-serif;width:794px;min-height:1122px;background:#fff;box-sizing:border-box;color:#1a1a1a;">

  <!-- HEADER -->
  <div style="background:#0B3954;color:#fff;padding:32px 36px 28px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <h1 style="margin:0 0 4px;font-size:32px;letter-spacing:0.5px;font-weight:bold;">${esc(data.name)}</h1>
      <p style="margin:0 0 12px;font-size:16px;opacity:0.9;font-style:italic;">${esc(data.headline)}</p>
      <div style="font-size:12px;opacity:0.85;">${[c.email, c.phone, c.permAddress].filter(Boolean).map(esc).join(' &nbsp;|&nbsp; ')}</div>
      <div style="font-size:12px;opacity:0.85;margin-top:4px;">${[c.linkedin, c.github].filter(Boolean).map(esc).join(' &nbsp;|&nbsp; ')}</div>
    </div>
    ${imgHtml ? `<div style="flex-shrink:0;">${imgHtml}</div>` : ''}
  </div>

  <!-- BODY: sidebar + main -->
  <div style="display:flex;min-height:900px;">

    <!-- SIDEBAR -->
    <div style="width:248px;flex-shrink:0;background:#F0F4F8;padding:24px 20px;border-right:1px solid #dde3ea;">

      ${data.skills?.technical?.length ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Technical Skills</div>
        <div>${skillTags(data.skills.technical, '#E8A838')}</div>
      </div>` : ''}

      ${data.skills?.soft?.length ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Soft Skills</div>
        <div>${skillTags(data.skills.soft, '#dde8f0')}</div>
      </div>` : ''}

      ${data.skills?.languages?.length ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Languages</div>
        <div>${skillTags(data.skills.languages, '#e6f0e6')}</div>
      </div>` : ''}
      
      <!-- Premium uses some personal details if available to feel complete, but less prominent -->
      ${p.dob || p.nationality ? `
      <div style="margin-bottom:22px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Personal Info</div>
        <div style="font-size:12px;color:#444;line-height:1.6;">
          ${p.dob ? `<b>DOB:</b> ${esc(p.dob)}<br/>` : ''}
          ${p.nationality ? `<b>Nationality:</b> ${esc(p.nationality)}<br/>` : ''}
          ${p.gender ? `<b>Gender:</b> ${esc(p.gender)}<br/>` : ''}
        </div>
      </div>` : ''}

    </div>

    <!-- MAIN -->
    <div style="flex:1;padding:24px 28px;">

      ${data.summary ? `
      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:10px;">Professional Summary</div>
        <p style="font-size:13px;line-height:1.65;margin:0;color:#333;">${esc(data.summary)}</p>
      </div>` : ''}

      ${data.experience?.length ? `
      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Work Experience</div>
        ${data.experience.map(e => `
        <div style="margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;">
            <span style="font-size:14px;font-weight:700;color:#111;">${esc(e.title)}</span>
            <span style="font-size:12px;color:#666;font-style:italic;">${esc(e.duration)}</span>
          </div>
          <div style="font-size:13px;color:#0B3954;margin-bottom:6px;font-weight:600;">${esc(e.company)}</div>
          ${e.bullets?.length ? `<ul style="margin:0;padding-left:16px;font-size:12.5px;color:#333;line-height:1.6;">${bulletList(e.bullets)}</ul>` : ''}
        </div>`).join('')}
      </div>` : ''}

      ${data.projects?.length ? `
      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Projects</div>
        ${data.projects.map(p => `
        <div style="margin-bottom:16px;">
          <div style="font-size:14px;font-weight:700;color:#111;">${esc(p.name)}</div>
          ${p.technologies ? `<div style="font-size:12px;color:#0B3954;margin:3px 0;font-style:italic;">Tech: ${esc(p.technologies)}</div>` : ''}
          <div style="font-size:12.5px;color:#333;line-height:1.55;margin-top:4px;">${esc(p.description)}</div>
        </div>`).join('')}
      </div>` : ''}
      
      ${data.education?.length ? `
      <div style="margin-bottom:24px;">
        <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#0B3954;border-bottom:2px solid #E8A838;padding-bottom:6px;margin-bottom:12px;">Education</div>
        ${data.education.map(e => `
        <div style="margin-bottom:14px;">
          <div style="font-size:13px;font-weight:700;color:#111;">${esc(e.degree)}</div>
          <div style="font-size:12px;color:#444;margin:2px 0;">${esc(e.institution)}</div>
          <div style="font-size:12px;color:#666;">${esc(e.year)}${e.grade ? ' &nbsp;·&nbsp; ' + esc(e.grade) : ''}</div>
        </div>`).join('')}
      </div>` : ''}

    </div>
  </div>
</div>`;
}

// ─── Cover Letter Template ──────────────────────────────────────
function getCoverLetterHTML(data) {
  const c = data.contact || {};
  return `
<div style="font-family:Calibri,Arial,sans-serif;width:794px;min-height:1122px;padding:56px 60px;box-sizing:border-box;color:#1a1a1a;background:#fff;">
  <div style="text-align:right;margin-bottom:32px;font-size:12px;color:#555;">
    ${esc(c.permAddress || '')}<br/>
    ${new Date().toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}
  </div>
  <div style="margin-bottom:24px;">
    <strong style="font-size:14px;">${esc(data.name)}</strong><br/>
    <span style="font-size:12px;color:#555;">${[c.email,c.phone].filter(Boolean).join('  |  ')}</span>
  </div>
  <div style="white-space:pre-line;font-size:13px;line-height:1.85;color:#222;">${esc(data.coverLetter || '')}</div>
</div>`;
}
