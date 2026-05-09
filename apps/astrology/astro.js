/* ── ASTRO.JS — Genuine Western Astrology + Numerology Engine ── */

const SIGNS = [
  { name:'Aries',       glyph:'♈', start:[3,21], end:[4,19],  element:'Fire',  ruling:'Mars',    modality:'Cardinal' },
  { name:'Taurus',      glyph:'♉', start:[4,20], end:[5,20],  element:'Earth', ruling:'Venus',   modality:'Fixed'    },
  { name:'Gemini',      glyph:'♊', start:[5,21], end:[6,20],  element:'Air',   ruling:'Mercury', modality:'Mutable'  },
  { name:'Cancer',      glyph:'♋', start:[6,21], end:[7,22],  element:'Water', ruling:'Moon',    modality:'Cardinal' },
  { name:'Leo',         glyph:'♌', start:[7,23], end:[8,22],  element:'Fire',  ruling:'Sun',     modality:'Fixed'    },
  { name:'Virgo',       glyph:'♍', start:[8,23], end:[9,22],  element:'Earth', ruling:'Mercury', modality:'Mutable'  },
  { name:'Libra',       glyph:'♎', start:[9,23], end:[10,22], element:'Air',   ruling:'Venus',   modality:'Cardinal' },
  { name:'Scorpio',     glyph:'♏', start:[10,23],end:[11,21], element:'Water', ruling:'Pluto',   modality:'Fixed'    },
  { name:'Sagittarius', glyph:'♐', start:[11,22],end:[12,21], element:'Fire',  ruling:'Jupiter', modality:'Mutable'  },
  { name:'Capricorn',   glyph:'♑', start:[12,22],end:[1,19],  element:'Earth', ruling:'Saturn',  modality:'Cardinal' },
  { name:'Aquarius',    glyph:'♒', start:[1,20], end:[2,18],  element:'Air',   ruling:'Uranus',  modality:'Fixed'    },
  { name:'Pisces',      glyph:'♓', start:[2,19], end:[3,20],  element:'Water', ruling:'Neptune', modality:'Mutable'  },
];

const SIGN_DATA = {
  Aries:       { desc:'Aries individuals are natural-born leaders driven by passion, courage, and an unstoppable pioneering spirit. As the first sign of the zodiac, you embody new beginnings and fearless action. Your enthusiasm is infectious and your determination legendary.', strengths:['Courageous','Determined','Confident','Enthusiastic','Optimistic'], weaknesses:['Impulsive','Short-tempered','Impatient','Aggressive'] },
  Taurus:      { desc:'Taurus is the sign of earthly pleasures, steadfast loyalty, and quiet determination. You possess a remarkable ability to build lasting things — relationships, wealth, and beauty — through patient, persistent effort. Your grounded nature is your greatest gift.', strengths:['Reliable','Patient','Devoted','Responsible','Stable'], weaknesses:['Stubborn','Possessive','Uncompromising','Materialistic'] },
  Gemini:      { desc:'Gemini is the most intellectually curious sign, gifted with the ability to see multiple sides of any situation. You are a natural communicator, connector of ideas, and enthusiastic learner whose mind moves at lightning speed.', strengths:['Adaptable','Outgoing','Intelligent','Curious','Witty'], weaknesses:['Indecisive','Inconsistent','Anxious','Superficial'] },
  Cancer:      { desc:'Cancer is the most nurturing and emotionally intuitive sign of the zodiac. Your deep empathy, loyalty, and intuitive wisdom allow you to create homes and relationships filled with warmth. You feel deeply and love unconditionally.', strengths:['Loyal','Empathetic','Intuitive','Nurturing','Imaginative'], weaknesses:['Moody','Suspicious','Manipulative','Clingy'] },
  Leo:         { desc:'Leo radiates warmth, creativity, and royal confidence. Ruled by the Sun, you are born to shine and inspire others. Your generous heart, dramatic flair, and natural leadership make you unforgettable and deeply loved.', strengths:['Creative','Passionate','Generous','Warm-hearted','Cheerful'], weaknesses:['Arrogant','Stubborn','Self-centered','Inflexible'] },
  Virgo:       { desc:'Virgo is the most analytical, precise, and service-oriented sign. Your brilliant mind sees patterns and solutions that others miss. Your dedication to excellence and your deep desire to be helpful make you indispensable in any endeavor.', strengths:['Analytical','Hardworking','Practical','Diligent','Kind'], weaknesses:['Overly critical','Worry-prone','Perfectionist','Shy'] },
  Libra:       { desc:'Libra is the sign of harmony, beauty, and justice. You possess a rare gift for seeing both sides of every situation and an instinctive desire to create balance. Your diplomatic nature, aesthetic sensibility, and social grace make you a beloved presence.', strengths:['Diplomatic','Fair-minded','Gracious','Idealistic','Sociable'], weaknesses:['Indecisive','Avoids conflict','Shallow','Holds grudges'] },
  Scorpio:     { desc:'Scorpio is the most intense, magnetic, and transformative sign. You possess extraordinary depth, emotional intelligence, and the power to reinvent yourself completely. Your penetrating insight sees through all illusions and your loyalty runs bone-deep.', strengths:['Resourceful','Brave','Passionate','Determined','Insightful'], weaknesses:['Jealous','Secretive','Resentful','Distrusting'] },
  Sagittarius: { desc:'Sagittarius is the eternal adventurer, philosopher, and seeker of ultimate truth. Your boundless optimism, love of freedom, and philosophical mind take you to the farthest reaches of experience. You inspire others with your expansive vision.', strengths:['Generous','Idealistic','Humorous','Adventurous','Optimistic'], weaknesses:['Impatient','Tactless','Promise-breaker','Overconfident'] },
  Capricorn:   { desc:'Capricorn is the most disciplined, ambitious, and masterful builder of the zodiac. You possess an extraordinary ability to work patiently toward long-term goals with unwavering focus and strategic brilliance. Your success is always earned.', strengths:['Responsible','Disciplined','Self-controlled','Persistent','Ambitious'], weaknesses:['Know-it-all','Unforgiving','Pessimistic','Condescending'] },
  Aquarius:    { desc:'Aquarius is the visionary innovator, humanitarian, and revolutionary thinker. You see the future before others even imagine it, and your progressive ideals and brilliant mind position you as an agent of positive change in the world.', strengths:['Progressive','Original','Independent','Humanitarian','Inventive'], weaknesses:['Aloof','Temperamental','Uncompromising','Detached'] },
  Pisces:      { desc:'Pisces is the most spiritually attuned, compassionate, and creatively gifted sign. You live at the intersection of dreams and reality, possessing boundless empathy and an artistic soul that can transform raw feeling into sublime beauty.', strengths:['Compassionate','Artistic','Intuitive','Gentle','Wise'], weaknesses:['Fearful','Overly trusting','Sad','Escapist'] },
};

const LUCKY = {
  Aries:       { numbers:'1, 8, 17', colors:'Red, Orange',    day:'Tuesday',   stone:'Diamond'   },
  Taurus:      { numbers:'2, 6, 9',  colors:'Green, Pink',    day:'Friday',    stone:'Emerald'   },
  Gemini:      { numbers:'3, 7, 12', colors:'Yellow, Green',  day:'Wednesday', stone:'Agate'     },
  Cancer:      { numbers:'2, 7, 11', colors:'White, Silver',  day:'Monday',    stone:'Pearl'     },
  Leo:         { numbers:'1, 3, 10', colors:'Gold, Orange',   day:'Sunday',    stone:'Ruby'      },
  Virgo:       { numbers:'5, 6, 2',  colors:'Grey, Beige',    day:'Wednesday', stone:'Sapphire'  },
  Libra:       { numbers:'4, 6, 13', colors:'Pink, Blue',     day:'Friday',    stone:'Opal'      },
  Scorpio:     { numbers:'8, 11, 18',colors:'Black, Crimson', day:'Tuesday',   stone:'Topaz'     },
  Sagittarius: { numbers:'3, 7, 9',  colors:'Purple, Blue',   day:'Thursday',  stone:'Turquoise' },
  Capricorn:   { numbers:'4, 8, 22', colors:'Brown, Black',   day:'Saturday',  stone:'Garnet'    },
  Aquarius:    { numbers:'4, 7, 11', colors:'Blue, Silver',   day:'Saturday',  stone:'Amethyst'  },
  Pisces:      { numbers:'3, 7, 12', colors:'Sea Green, Aqua',day:'Thursday',  stone:'Aquamarine'},
};

function getSunSign(month, day) {
  for (const s of SIGNS) {
    const [sm, sd] = s.start, [em, ed] = s.end;
    if (sm === 12 && em === 1) {
      if ((month === 12 && day >= sd) || (month === 1 && day <= ed)) return s;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return s;
    }
  }
  return SIGNS[0];
}

/* Moon sign — simplified (lunar cycle approximation) */
function getMoonSign(year, month, day) {
  const base = new Date(2000, 0, 6); // known new moon reference
  const target = new Date(year, month - 1, day);
  const diffDays = Math.round((target - base) / 86400000);
  const moonCycleDays = 27.32;
  const moonDay = ((diffDays % moonCycleDays) + moonCycleDays) % moonCycleDays;
  const signIdx = Math.floor(moonDay / (moonCycleDays / 12)) % 12;
  return SIGNS[signIdx];
}

/* Rising sign — requires birth time; uses simplified house system */
function getRisingSign(hour, minute, month, day, year) {
  if (hour == null) return null;
  const sunSign = getSunSign(month, day);
  const sunIdx = SIGNS.indexOf(sunSign);
  const fractHour = hour + minute / 60;
  // Each sign rises for ~2 hours; offset from 6 AM baseline
  const offset = Math.floor(((fractHour - 6 + 24) % 24) / 2);
  return SIGNS[(sunIdx + offset) % 12];
}

/* ── Numerology: Life Path Number ── */
function reduceToSingle(n) {
  if (n === 11 || n === 22 || n === 33) return n; // master numbers
  while (n > 9) {
    let s = 0;
    while (n > 0) { s += n % 10; n = Math.floor(n / 10); }
    n = s;
    if (n === 11 || n === 22 || n === 33) return n;
  }
  return n;
}

function getLifePath(year, month, day) {
  const m = reduceToSingle(month);
  const d = reduceToSingle(day);
  const y = reduceToSingle([...String(year)].reduce((a, c) => a + +c, 0));
  return reduceToSingle(m + d + y);
}

const LP_DATA = {
  1: { personality:'As a Life Path 1, you are a natural-born leader and pioneer. Independence, originality, and ambition define your journey. You forge your own path and inspire others with your courage and drive. You thrive when you can stand out and take the initiative.',
       strengths:'Your greatest strengths include bold leadership, unwavering determination, and creative originality. You excel at initiating new projects and have the charisma to bring others along. When you believe in something, nothing can stop you.',
       challenges:'You may struggle with stubbornness, a tendency to dominate conversations, or difficulty accepting help. Learning to collaborate and listen as much as you speak will unlock your fullest potential.',
       quote:'"The path of the leader is never crowded. Forge ahead with conviction, for your uniqueness is your greatest power."' },
  2: { personality:'As a Life Path 2, you are a natural diplomat and peacemaker. Your greatest gift is your ability to understand others deeply and bring harmony to difficult situations. You thrive in partnerships and possess a rare sensitivity and emotional intelligence.',
       strengths:'Your empathy, patience, and cooperative spirit make you an extraordinary partner and mediator. You read emotional currents effortlessly and bring comfort to everyone around you. Your attention to detail is exceptional.',
       challenges:'You may need to guard against being overly self-sacrificing, indecisive, or too dependent on others\' approval. Building confidence in your own voice is the central work of your life.',
       quote:'"Your gift for harmony is rare and precious. Two notes played together create something no single note can — that is your power."' },
  3: { personality:'As a Life Path 3, you are a gifted communicator, artist, and inspirer. Life is your canvas and you paint it with words, laughter, creativity, and joy. You have a magnetic social presence and an extraordinary ability to lift the spirits of those around you.',
       strengths:'Your creativity, humor, expressiveness, and optimism are your superpowers. You bring ideas to life in ways others can\'t imagine and have a gift for making complex things feel simple and beautiful.',
       challenges:'Scattered energy, superficiality, and avoiding depth or commitment can hold you back. Channeling your creative gifts with focus and discipline will transform your potential into lasting achievement.',
       quote:'"You are a living spark of creative fire. The world needs your joy and your voice — let nothing dim what you were born to express."' },
  4: { personality:'As a Life Path 4, you are a practical, reliable, and hardworking builder. You possess a strong sense of responsibility and value structure, organization, and stability in all areas of your life. Your approach is methodical and grounded, preferring proven methods over risky ventures.',
       strengths:'Your incredible work ethic, dependability, and attention to detail are your greatest assets. You excel at creating systems, managing projects, and ensuring everything runs smoothly. People trust you completely because you follow through on your commitments.',
       challenges:'Your main challenges may include being too rigid or resistant to change. You might struggle with spontaneity and flexibility, preferring the comfort of routine. Learning to adapt to unexpected situations and embracing innovation can be areas for growth.',
       quote:'"Embrace your natural organizational skills but remain open to new approaches. Balance your need for stability with occasional calculated risks to experience personal and professional growth."' },
  5: { personality:'As a Life Path 5, you are a freedom-loving adventurer and agent of change. You thrive on variety, new experiences, and the full spectrum of human sensation. Your magnetic personality draws others to you and your adaptability is unmatched.',
       strengths:'Your versatility, curiosity, resourcefulness, and progressive thinking make you exceptional at navigating change. You inspire others with your sense of adventure and your ability to see opportunity everywhere.',
       challenges:'Commitment can feel like a cage and restlessness may lead you to abandon good things prematurely. Developing follow-through and learning that true freedom comes from within are your key lessons.',
       quote:'"The whole world is your classroom. Travel it, taste it, live it — but know that the deepest adventure is the one that unfolds within."' },
  6: { personality:'As a Life Path 6, you are the nurturer, healer, and guardian of the zodiac of numbers. You feel a deep sense of responsibility toward family, community, and the world at large. Your compassionate heart is your greatest treasure.',
       strengths:'Your capacity for unconditional love, your healing instincts, your sense of justice, and your remarkable ability to create beauty and harmony in any environment are what set you apart.',
       challenges:'You may sacrifice your own needs to the point of burnout, become controlling in your caregiving, or attract people who take advantage of your goodness. Setting healthy boundaries is essential for your wellbeing.',
       quote:'"You cannot pour from an empty cup. Care for yourself with the same unconditional love you offer the world, and your light will never go out."' },
  7: { personality:'As a Life Path 7, you are the seeker, philosopher, and mystic. You have a brilliant analytical mind and a deep spiritual hunger that drives you to penetrate beneath the surface of all things in search of ultimate truth and meaning.',
       strengths:'Your intellectual depth, intuitive insight, research ability, and capacity for introspection allow you to understand things at a level others rarely reach. You are a natural sage and truth-seeker.',
       challenges:'You may struggle with isolation, emotional unavailability, and secretiveness. Learning to balance your inner world with genuine human connection is the defining challenge of your path.',
       quote:'"The universe reveals its deepest secrets to those who ask the deepest questions. Your seeking is itself a form of sacred service."' },
  8: { personality:'As a Life Path 8, you are the powerhouse, executive, and master of the material world. You possess extraordinary drive, business acumen, and a natural understanding of how power and resources flow. You are built to achieve great things.',
       strengths:'Your ambition, organizational genius, leadership, and financial instincts are remarkable. You think big, act decisively, and have the endurance to see monumental projects through to completion.',
       challenges:'The pursuit of status or wealth can overshadow relationships and inner peace. Learning to use your power in service of others and recognizing that true abundance includes love and joy will complete you.',
       quote:'"True power is not the accumulation of things but the expansion of what is possible for yourself and others. Build something that outlasts you."' },
  9: { personality:'As a Life Path 9, you are the humanitarian, old soul, and wise elder of the number world. You carry within you the wisdom of all previous numbers and feel a deep, almost cosmic calling to serve, uplift, and heal the world.',
       strengths:'Your compassion, generosity, global thinking, artistic gifts, and ability to forgive are extraordinary. You see the sacred in all beings and inspire others to be their highest selves simply by being yourself.',
       challenges:'Difficulty letting go — of people, situations, or the past — can hold you back. Martyrdom and disappointment arise when others don\'t share your vision. Releasing attachment is your spiritual work.',
       quote:'"You came here not to receive the world\'s love but to offer yours unconditionally. In giving freely, you discover that you were always whole."' },
  11:{ personality:'Life Path 11 is a Master Number of spiritual illumination and intuition. You are an inspired visionary with an almost psychic sensitivity and a powerful mission to illuminate the world. You sense things before they happen and inspire others effortlessly.',
       strengths:'Your extraordinary intuition, spiritual insight, charisma, and idealism allow you to perceive and communicate truths that transform lives. You are a natural channel for higher wisdom.',
       challenges:'The 11 carries intense nervous energy and the gap between your ideals and reality can be crushing. Anxiety, self-doubt, and a tendency to live in your head must be managed with grounding practices.',
       quote:'"You are a bridge between worlds. Trust your inner light completely — it sees farther than your mind can currently imagine."' },
  22:{ personality:'Life Path 22 is the Master Builder — the most powerful number of all. You have the potential to turn the most ambitious dreams into concrete reality at a scale that benefits many. You carry enormous responsibility and equally enormous capability.',
       strengths:'Your combination of visionary thinking and practical ability is almost supernatural. You can plan, inspire, organize, and build structures — physical or otherwise — that last for generations.',
       challenges:'The weight of your potential can feel paralyzing. Fear of failure may cause you to play small. Trusting yourself to step fully into your power is the lifelong invitation.',
       quote:'"The world is waiting for what only you can build. Stop planning the blueprint and begin laying the foundation — one stone, one day, one act of courage at a time."' },
  33:{ personality:'Life Path 33 is the Master Teacher — the rarest and most spiritually significant path. You are here to embody the highest expression of love, compassion, and service and to help others understand that healing is always possible.',
       strengths:'Your selfless love, spiritual depth, healing presence, and ability to teach by example are extraordinary gifts that touch everyone you encounter.',
       challenges:'Taking on too much of others\' pain, self-sacrifice to the point of dissolution, and setting healthy boundaries are your central challenges on this demanding path.',
       quote:'"You teach not by what you say but by who you are. Live your highest truth, love without condition, and the world will learn from your example."' },
};

/* ── Daily Horoscope Generator (seed-based so it changes daily) ── */
const HOROSCOPE_THEMES = [
  { main: 'Today brings unexpected opportunities for growth and deep connection. Your innovative spirit is highlighted, making it an ideal day to brainstorm new ideas or collaborate with like-minded individuals. The cosmic energy encourages you to think outside the box and embrace your unique perspective. However, be mindful of overcommitting as Mercury\'s influence may create some communication challenges.', love: 'Venus illuminates your relationships with warm light. An honest conversation could deepen an existing bond or open the door to something new. Express appreciation for those who stand by you.', career: 'Your professional life receives a boost of creative energy. A mentor or senior colleague may offer valuable guidance today. Trust your instincts on a pending decision.', wellness: 'Your energy levels are high but channel them wisely. Gentle movement and mindful breathing will help you stay centered amid today\'s vibrant cosmic activity.' },
  { main: 'A powerful alignment of planets activates your ambitions today. The universe is urging you to take concrete steps toward a long-held dream. Your determination is your greatest asset right now — use it to break through a barrier that has held you back.', love: 'Emotional honesty opens new chapters in love today. Whether single or partnered, authenticity is your most magnetic quality. Let your guard down with someone you trust.', career: 'Financial matters may require your attention. Review your budget or financial plans with fresh eyes. A strategic partnership could yield significant rewards in the coming weeks.', wellness: 'Your body is asking for nourishment today. Prioritize sleep, water, and foods that fuel you. Even a brief walk in nature can recalibrate your energy field.' },
  { main: 'Mercury\'s influence sharpens your mind and tongue today, making communication your superpower. Share your ideas boldly — they are more original and valuable than you realize. Important information may reach you through unexpected channels.', love: 'Words carry special magic today. Write a heartfelt note, have the conversation you\'ve been postponing, or simply listen more deeply than usual. Connection deepens through presence.', career: 'Networking and collaboration are powerfully favored. Reach out to someone in your field whose work inspires you. A simple message today could open significant doors.', wellness: 'Your mind needs space to breathe. Journaling, meditation, or time in quiet nature will quiet the mental chatter and reconnect you with your inner wisdom.' },
  { main: 'The Moon\'s emotional currents run deep today, heightening your intuition and empathy. Trust the feelings that arise — they carry important messages from your subconscious. This is a powerful day for healing, releasing old patterns, and setting new intentions.', love: 'Vulnerability is your greatest strength in love today. Share something real about your inner world. Emotional intimacy created in moments of genuine openness creates bonds that last lifetimes.', career: 'Focus on completion rather than beginning new projects. Finishing what you started brings a deep sense of satisfaction and clears energy for your next phase of growth.', wellness: 'Water, rest, and emotional release are especially healing today. Allow yourself to feel fully whatever arises — tears, laughter, or quiet peace are all sacred expressions.' },
  { main: 'Jupiter\'s expansive energy graces your day with optimism and opportunity. Say yes to invitations, new experiences, and moments that push your comfort zone gently outward. Your confidence is contagious and you\'ll inspire others simply by showing up as your fullest self.', love: 'Romance and playfulness are favored today. Laughter, adventure, and shared exploration deepen connection more than serious conversations. Let joy lead the way.', career: 'An opportunity for growth — educational, professional, or creative — is presenting itself. Investigate it with open curiosity even if it initially seems outside your current path.', wellness: 'Physical movement that feels like play — dancing, hiking, swimming — will amplify your energy and mood dramatically today. Follow what feels joyful in your body.' },
];

function getDailyHoroscope(signName) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate() + signName.charCodeAt(0);
  return HOROSCOPE_THEMES[seed % HOROSCOPE_THEMES.length];
}

/* ── Planet Positions (simplified ecliptic longitude) ── */
const PLANET_COLORS = {
  Sun:    '#f59e0b', Moon:    '#e2e8f0', Mercury: '#a78bfa',
  Venus:  '#ec4899', Mars:    '#ef4444', Jupiter: '#818cf8', Saturn:  '#fbbf24',
};

function daysSinceJ2000(year, month, day, hour=12, min=0) {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a, m = month + 12 * a - 3;
  const jd = day + Math.floor((153*m+2)/5) + 365*y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) - 32045;
  return jd + (hour - 12) / 24 + min / 1440 - 2451545.0;
}

function getPlanetLongitudes(year, month, day, hour=12, min=0) {
  const d = daysSinceJ2000(year, month, day, hour, min);
  return {
    Sun:     (280.460 + 0.9856474 * d) % 360,
    Moon:    (218.316 + 13.176396 * d) % 360,
    Mercury: (252.251 + 4.0923344 * d) % 360,
    Venus:   (181.980 + 1.6021303 * d) % 360,
    Mars:    (355.433 + 0.5240207 * d) % 360,
    Jupiter: (34.351  + 0.0830853 * d) % 360,
    Saturn:  (50.077  + 0.0334442 * d) % 360,
  };
}

function normalizeDeg(d) { return ((d % 360) + 360) % 360; }

function signFromLongitude(deg) {
  return SIGNS[Math.floor(normalizeDeg(deg) / 30) % 12];
}

/* ── Draw Birth Chart Canvas ── */
function drawBirthChart(canvas, longs) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const R = Math.min(W, H) / 2 - 10;

  ctx.clearRect(0, 0, W, H);

  // Outer ring
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(139,92,246,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();

  // Inner ring
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.55, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(139,92,246,0.2)'; ctx.lineWidth = 1; ctx.stroke();

  // 12 spokes
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.55);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.strokeStyle = 'rgba(139,92,246,0.2)'; ctx.lineWidth = 1; ctx.stroke();
  }

  // Sign glyphs on outer ring
  SIGNS.forEach((s, i) => {
    const a = (i * 30 + 15 - 90) * Math.PI / 180;
    const rx = cx + Math.cos(a) * (R * 0.78);
    const ry = cy + Math.sin(a) * (R * 0.78);
    ctx.font = `${R * 0.09}px serif`;
    ctx.fillStyle = 'rgba(168,158,201,0.6)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(s.glyph, rx, ry);
  });

  // Draw planets
  const planetR = R * 0.38;
  const names = Object.keys(longs);
  names.forEach(name => {
    const deg = normalizeDeg(longs[name]);
    const a = (deg - 90) * Math.PI / 180;
    const px = cx + Math.cos(a) * planetR;
    const py = cy + Math.sin(a) * planetR;
    const radius = name === 'Sun' || name === 'Moon' ? R * 0.062 : R * 0.048;

    ctx.beginPath(); ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fillStyle = PLANET_COLORS[name];
    ctx.shadowBlur = 12; ctx.shadowColor = PLANET_COLORS[name];
    ctx.fill(); ctx.shadowBlur = 0;

    // Label
    ctx.font = `bold ${R * 0.065}px Inter, sans-serif`;
    ctx.fillStyle = '#e8e0ff';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(name[0] === 'S' && name === 'Saturn' ? 'Sa' : name[0], px, py + radius + 3);
  });

  // Center dot
  ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(139,92,246,0.8)'; ctx.fill();
}

window.AstroEngine = {
  getSunSign, getMoonSign, getRisingSign,
  getLifePath, LP_DATA, SIGN_DATA, LUCKY,
  PLANET_COLORS, getPlanetLongitudes, signFromLongitude,
  drawBirthChart, getDailyHoroscope, SIGNS,
};
