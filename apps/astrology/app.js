/* ── APP.JS — UI Controller ── */
const A = window.AstroEngine;

/* ── Place autocomplete (uses free Nominatim API) ── */
let suggestTimeout = null;
const placeInput = document.getElementById('birth-place');
const suggestBox = document.getElementById('place-suggestions');

placeInput.addEventListener('input', function() {
  clearTimeout(suggestTimeout);
  const q = placeInput.value.trim();
  if (q.length < 3) { suggestBox.classList.remove('open'); return; }
  suggestTimeout = setTimeout(function() { fetchSuggestions(q); }, 350);
});

function fetchSuggestions(q) {
  const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + encodeURIComponent(q);
  fetch(url, { headers: { 'Accept-Language': 'en' } })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      suggestBox.innerHTML = '';
      if (!data.length) { suggestBox.classList.remove('open'); return; }
      data.forEach(function(p) {
        const d = document.createElement('div');
        d.className = 'suggestion-item';
        d.setAttribute('role', 'option');
        d.textContent = p.display_name;
        d.addEventListener('click', function() {
          placeInput.value = p.display_name;
          suggestBox.classList.remove('open');
        });
        suggestBox.appendChild(d);
      });
      suggestBox.classList.add('open');
    })
    .catch(function() { suggestBox.classList.remove('open'); });
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.form-group')) suggestBox.classList.remove('open');
});

/* ── Form Submit ── */
document.getElementById('birth-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const dateVal = document.getElementById('birth-date').value;
  const timeVal = document.getElementById('birth-time').value;
  const place   = document.getElementById('birth-place').value.trim();
  const name    = document.getElementById('user-name').value.trim();

  if (!dateVal || !place) {
    alert('Please enter your date of birth and place of birth.');
    return;
  }

  const btnText = document.querySelector('.btn-text');
  const btnLoad = document.querySelector('.btn-loader');
  btnText.classList.add('hidden');
  btnLoad.classList.remove('hidden');
  btnLoad.classList.add('visible');

  setTimeout(function() {
    const parts = dateVal.split('-').map(Number);
    const year = parts[0], month = parts[1], day = parts[2];
    let hour = null, min = null;
    if (timeVal) {
      const tp = timeVal.split(':').map(Number);
      hour = tp[0]; min = tp[1];
    }

    buildResults({ year, month, day, hour, min, place, name });

    btnText.classList.remove('hidden');
    btnLoad.classList.remove('visible');

    document.getElementById('app-landing').classList.remove('active');
    document.getElementById('app-results').classList.add('active');
    window.scrollTo(0, 0);
  }, 1200);
});

/* ── Back button ── */
document.getElementById('back-btn').addEventListener('click', function() {
  document.getElementById('app-results').classList.remove('active');
  document.getElementById('app-landing').classList.add('active');
  window.scrollTo(0, 0);
});

/* ── Build All Results ── */
function buildResults({ year, month, day, hour, min, place, name }) {
  const sun     = A.getSunSign(month, day);
  const moon    = A.getMoonSign(year, month, day);
  const rising  = A.getRisingSign(hour, min, month, day, year);
  const lp      = A.getLifePath(year, month, day);
  const lpData  = A.LP_DATA[lp] || A.LP_DATA[4];
  const sunData = A.SIGN_DATA[sun.name];
  const lucky   = A.LUCKY[sun.name];
  const longs   = A.getPlanetLongitudes(year, month, day, hour ?? 12, min ?? 0);
  const horoscope = A.getDailyHoroscope(sun.name);

  /* Header */
  document.getElementById('hdr-sign').textContent = sun.name;
  document.getElementById('hdr-lifepath').textContent = 'Life Path ' + lp;

  /* Birth chart */
  A.drawBirthChart(document.getElementById('chart-canvas'), longs);

  /* Planet legend */
  const legend = document.getElementById('planet-legend');
  legend.innerHTML = '';
  Object.entries(longs).forEach(([pName, deg]) => {
    const sign = A.signFromLongitude(deg);
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = '<span class="legend-dot" style="background:' + A.PLANET_COLORS[pName] + '"></span>' + pName + ' in ' + sign.name;
    legend.appendChild(item);
  });

  /* Horoscope */
  document.getElementById('horoscope-text').textContent = horoscope.main;
  document.getElementById('love-text').textContent      = horoscope.love;
  document.getElementById('career-text').textContent    = horoscope.career;
  document.getElementById('wellness-text').textContent  = horoscope.wellness;

  /* Refresh horoscope cycling */
  let horoIdx = 0;
  const allThemes = [
    horoscope,
    { main: "Today's energy invites reflection and inner work. Mercury retrograde echoes through your day, prompting you to revisit past decisions and learn from experience. Take time to journal, meditate, or simply sit in stillness with yourself.", love: "Old feelings may resurface, asking to be healed rather than re-lived. Compassion for yourself and your partner creates the space for genuine intimacy.", career: "Avoid signing important contracts or launching major initiatives today. Instead, research, prepare, and refine what already exists — this groundwork will bear fruit soon.", wellness: "Rest is productive. Your nervous system needs downtime to integrate recent experiences. A restorative yoga session or a warm bath will do wonders tonight." },
    { main: "A beautiful trine between Venus and Jupiter brings grace and expansion to your day. You are unusually magnetic today — people are drawn to your warmth and wisdom. Use this social energy to strengthen important relationships.", love: "This is one of the most romantic and heart-opening days of your month. If single, put yourself out there with genuine confidence. If partnered, plan something memorable together.", career: "Recognition for your efforts may come from an unexpected source today. Your reputation is quietly growing — continue to show up with integrity and excellence.", wellness: "Your heart chakra is wide open today. Acts of kindness toward others — and yourself — will multiply your joy exponentially. Spend time with those who uplift you." },
    { main: "Saturn's disciplined energy asks you to review your long-term commitments and assess whether your daily actions align with your deepest values. This is a powerful day for planning, strategic thinking, and making conscious choices.", love: "Honest conversations about the future of your relationships are favored today. Even if the discussion feels difficult, clarity now prevents misunderstanding later.", career: "Long-term thinking pays off today. Invest in skills, relationships, or tools that will serve you over years, not days. Your effort today compounds like interest.", wellness: "Structure is healing today. Following a consistent routine — even a simple morning ritual — will give your nervous system the anchor it needs to feel safe and grounded." },
    { main: "Jupiter's expansive energy graces your day with optimism and opportunity. Say yes to invitations, new experiences, and moments that push your comfort zone gently outward. Your confidence is contagious today.", love: "Romance and playfulness are favored today. Laughter, adventure, and shared exploration deepen connection more than serious conversations ever could. Let joy lead the way.", career: "An opportunity for growth — educational, professional, or creative — is presenting itself. Investigate it with open curiosity even if it seems outside your current path.", wellness: "Physical movement that feels like play — dancing, hiking, swimming — will amplify your energy and mood dramatically today. Follow what feels joyful in your body." },
  ];

  const refreshBtn = document.getElementById('refresh-horoscope');
  const newRefreshBtn = refreshBtn.cloneNode(true);
  refreshBtn.parentNode.replaceChild(newRefreshBtn, refreshBtn);
  newRefreshBtn.addEventListener('click', function() {
    horoIdx = (horoIdx + 1) % allThemes.length;
    const h = allThemes[horoIdx];
    document.getElementById('horoscope-text').textContent = h.main;
    document.getElementById('love-text').textContent      = h.love;
    document.getElementById('career-text').textContent    = h.career;
    document.getElementById('wellness-text').textContent  = h.wellness;
  });

  /* Life Path */
  document.getElementById('lp-heading').textContent          = 'Life Path ' + lp;
  document.getElementById('lp-personality-text').textContent = lpData.personality;
  document.getElementById('lp-strengths').textContent        = lpData.strengths;
  document.getElementById('lp-challenges').textContent       = lpData.challenges;
  document.getElementById('lp-quote').textContent            = lpData.quote;

  /* Zodiac Profile */
  document.getElementById('zodiac-glyph').textContent   = sun.glyph;
  document.getElementById('zodiac-heading').textContent = sun.name + ' Profile';
  document.getElementById('z-element').textContent      = '🜂 ' + sun.element;
  document.getElementById('z-ruling').textContent       = '⊙ ' + sun.ruling;
  document.getElementById('z-modality').textContent     = '◈ ' + sun.modality;
  document.getElementById('zodiac-desc').textContent    = sunData.desc;

  const strList = document.getElementById('z-strengths-list');
  strList.innerHTML = '<p class="traits-title" style="color:var(--green)">✦ STRENGTHS</p>';
  sunData.strengths.forEach(t => { strList.innerHTML += '<span class="trait-tag">' + t + '</span>'; });

  const wkList = document.getElementById('z-weaknesses-list');
  wkList.innerHTML = '<p class="traits-title" style="color:#f87171">✦ CHALLENGES</p>';
  sunData.weaknesses.forEach(t => { wkList.innerHTML += '<span class="trait-tag neg">' + t + '</span>'; });

  /* Moon Sign */
  document.getElementById('moon-sign-name').textContent = moon.name;
  const moonData = A.SIGN_DATA[moon.name];
  document.getElementById('moon-sign-desc').textContent =
    'Your Moon in ' + moon.name + ' reveals your emotional nature and subconscious patterns. ' +
    moonData.desc.split('.').slice(0, 2).join('.') + '. This placement shapes how you process feelings, seek security, and nurture those closest to you.';

  /* Rising Sign */
  if (rising) {
    const risingData = A.SIGN_DATA[rising.name];
    document.getElementById('rising-sign-name').textContent = rising.name;
    document.getElementById('rising-sign-desc').textContent =
      'Your ' + rising.name + ' Ascendant is the mask you wear for the world — the first impression you make and the lens through which you approach new experiences. ' +
      risingData.desc.split('.')[0] + '.';
    document.getElementById('rising-note').textContent = '';
  } else {
    document.getElementById('rising-sign-name').textContent = 'Unknown';
    document.getElementById('rising-sign-desc').textContent =
      'Your Rising Sign (Ascendant) requires your exact birth time to calculate accurately. It represents how the world perceives you and the energy you project in new situations.';
    document.getElementById('rising-note').textContent =
      '⚠ Enter your birth time for an accurate Rising Sign calculation.';
  }

  /* Lucky Details */
  document.getElementById('lucky-numbers').textContent = lucky.numbers;
  document.getElementById('lucky-colors').textContent  = lucky.colors;
  document.getElementById('lucky-day').textContent     = lucky.day;
  document.getElementById('lucky-stone').textContent   = lucky.stone;
}
