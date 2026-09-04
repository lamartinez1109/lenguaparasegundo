/* ============================================================
   EL EXPLORADOR DEL TIEMPO — lógica principal
   ============================================================ */

/* ============================================================
   0. UTILIDADES
   ============================================================ */
const $ = id => document.getElementById(id);
const $q = sel => document.querySelector(sel);
const $all = sel => document.querySelectorAll(sel);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(id) {
  $all('.screen').forEach(s => { s.style.display = 'none'; s.classList.remove('active'); });
  const el = $(id);
  el.style.display = 'flex';
  el.classList.add('active');
}

/* ============================================================
   1. ESTADO GLOBAL
   ============================================================ */
const STATE = {
  coins: 0,
  completedLevels: [],   // índices de niveles completados
  currentLevel: null,    // índice 0-4
};

const MEDALS = ['🥉','🥈','🥇','🏅','🏆'];
const COINS_PER_LEVEL = [8, 10, 12, 10, 15];

/* ============================================================
   2. BANCO DE DATOS
   ============================================================ */

/* ------ ACTIVIDAD 1: verbo en 3 tiempos → elegir el indicado ------ */
const ACT1_DATA = [
  { pasado:'corrió', presente:'corre', futuro:'correrá',   emoji:'🏃', ask:'futuro'  },
  { pasado:'saltó',  presente:'salta', futuro:'saltará',   emoji:'🐸', ask:'pasado'  },
  { pasado:'comió',  presente:'come',  futuro:'comerá',    emoji:'🍕', ask:'presente'},
  { pasado:'bailó',  presente:'baila', futuro:'bailará',   emoji:'💃', ask:'futuro'  },
  { pasado:'jugó',   presente:'juega', futuro:'jugará',    emoji:'⚽', ask:'pasado'  },
  { pasado:'leyó',   presente:'lee',   futuro:'leerá',     emoji:'📚', ask:'presente'},
  { pasado:'voló',   presente:'vuela', futuro:'volará',    emoji:'✈️', ask:'futuro'  },
  { pasado:'pintó',  presente:'pinta', futuro:'pintará',   emoji:'🎨', ask:'pasado'  },
  { pasado:'nadó',   presente:'nada',  futuro:'nadará',    emoji:'🏊', ask:'presente'},
  { pasado:'cantó',  presente:'canta', futuro:'cantará',   emoji:'🎤', ask:'futuro'  },
];

/* ------ ACTIVIDAD 2: verbo conjugado → identificar tiempo ------ */
const ACT2_DATA = [
  { verbo:'viajará',      tiempo:'futuro',   emoji:'🚀' },
  { verbo:'dibujó',       tiempo:'pasado',   emoji:'🖍️' },
  { verbo:'escribe',      tiempo:'presente', emoji:'✏️' },
  { verbo:'jugará',       tiempo:'futuro',   emoji:'🎮' },
  { verbo:'durmió',       tiempo:'pasado',   emoji:'😴' },
  { verbo:'come',         tiempo:'presente', emoji:'🍎' },
  { verbo:'corrió',       tiempo:'pasado',   emoji:'🏃' },
  { verbo:'construirá',   tiempo:'futuro',   emoji:'🏗️' },
  { verbo:'baila',        tiempo:'presente', emoji:'💃' },
  { verbo:'saldrá',       tiempo:'futuro',   emoji:'🌤️' },
];

/* ------ ACTIVIDAD 3: completar oración con verbo correcto ------ */
const ACT3_DATA = [
  {
    emoji: '☀️',
    partes: ['Ayer el sol ', null, ' toda la tarde.'],
    opciones: ['brilló','brilla','brillará'],
    correcta: 'brilló',
    hint: 'Ayer = pasado 🕰️'
  },
  {
    emoji: '🌧️',
    partes: ['Mañana ', null, ' mucho en la ciudad.'],
    opciones: ['llovió','llueve','lloverá'],
    correcta: 'lloverá',
    hint: 'Mañana = futuro 🚀'
  },
  {
    emoji: '🐶',
    partes: ['El perro ', null, ' en el parque todos los días.'],
    opciones: ['jugó','juega','jugará'],
    correcta: 'juega',
    hint: 'Todos los días = presente 🟢'
  },
  {
    emoji: '🎂',
    partes: ['La semana pasada ', null, ' en la fiesta.'],
    opciones: ['cantaré','canto','canté'],
    correcta: 'canté',
    hint: 'La semana pasada = pasado 🕰️'
  },
  {
    emoji: '🚌',
    partes: ['El autobús ', null, ' puntual cada mañana.'],
    opciones: ['llegó','llega','llegará'],
    correcta: 'llega',
    hint: 'Cada mañana = presente 🟢'
  },
  {
    emoji: '🎒',
    partes: ['Mañana ', null, ' mi mochila nueva.'],
    opciones: ['estrené','estreno','estrenaré'],
    correcta: 'estrenaré',
    hint: 'Mañana = futuro 🚀'
  },
  {
    emoji: '🍦',
    partes: ['El año pasado ', null, ' mucho helado en verano.'],
    opciones: ['comeremos','comemos','comimos'],
    correcta: 'comimos',
    hint: 'El año pasado = pasado 🕰️'
  },
  {
    emoji: '📺',
    partes: ['Gina ', null, ' su tutú en la próxima clase.'],
    opciones: ['estrenó','estrena','estrenará'],
    correcta: 'estrenará',
    hint: 'Próxima clase = futuro 🚀'
  },
  {
    emoji: '🧹',
    partes: ['El cuidador ', null, ' la cueva de los osos ayer.'],
    opciones: ['limpió','limpia','limpiará'],
    correcta: 'limpió',
    hint: 'Ayer = pasado 🕰️'
  },
  {
    emoji: '🐘',
    partes: ['Ahora mismo, mis compañeros ', null, ' el agua de los bebederos.'],
    opciones: ['cambiaron','cambian','cambiarán'],
    correcta: 'cambian',
    hint: 'Ahora mismo = presente 🟢'
  },
];

/* ------ ACTIVIDAD 4: oración → identificar tiempo verbal ------ */
const ACT4_DATA = [
  { emoji:'🐻', oracion:'En invierno, los osos se retiran a sus cuevas a hibernar.',   tiempo:'presente' },
  { emoji:'🌱', oracion:'Los osos devoran grandes cantidades de comida antes de hibernar.', tiempo:'presente' },
  { emoji:'🥶', oracion:'Durante su encierro, no comerán ni beberán agua.',             tiempo:'futuro'   },
  { emoji:'🧹', oracion:'Ayer bañé a los elefantes y limpié la cueva de los osos.',    tiempo:'pasado'   },
  { emoji:'🦒', oracion:'Mañana vacunaré a los monos.',                                 tiempo:'futuro'   },
  { emoji:'🎀', oracion:'Gina tiene 8 años y es bailarina.',                            tiempo:'presente' },
  { emoji:'👗', oracion:'La semana pasada regresó a casa con su tutú gastado.',         tiempo:'pasado'   },
  { emoji:'🛍️', oracion:'Mañana irán de compras para conseguir un tutú nuevo.',         tiempo:'futuro'   },
  { emoji:'🎵', oracion:'Ayer mi ayudante alimentaba a los patos y a los pavos reales.',tiempo:'pasado'   },
  { emoji:'⚖️', oracion:'Algunos compañeros miden, pesan y peinan al cachorro del tigre.',tiempo:'presente'},
];

/* ------ ACTIVIDAD 5: tres textos, clasificar verbos en tabla ------ */
const ACT5_TEXTOS = [
  {
    titulo: 'Los osos y el invierno 🐻',
    html: `En invierno, las fuentes de alimento de los osos <b>son</b> escasas. 
Estos animales <b>se retiran</b> a cuevas a dormir. Antes de hibernar, 
los osos <b>devoran</b> grandes cantidades de comida, ya que no <b>comerán</b> 
ni <b>beberán</b> agua y <b>se alimentarán</b> de sus reservas de grasa.`,
    verbos: [
      { v:'son',          tiempo:'presente' },
      { v:'se retiran',   tiempo:'presente' },
      { v:'devoran',      tiempo:'presente' },
      { v:'comerán',      tiempo:'futuro'   },
      { v:'beberán',      tiempo:'futuro'   },
      { v:'se alimentarán',tiempo:'futuro'  },
    ]
  },
  {
    titulo: 'Tareas del cuidador 🦁',
    html: `Los cuidadores del zoológico <b>trabajamos</b> mucho. 
Ayer <b>bañé</b> a los elefantes y <b>limpié</b> la cueva de los osos. 
Ahora mismo, algunos compañeros <b>cambian</b> el agua de los bebederos. 
Mañana <b>vacunaré</b> a los monos y me <b>divertiré</b> con sus monerías.`,
    verbos: [
      { v:'trabajamos',  tiempo:'presente' },
      { v:'bañé',        tiempo:'pasado'   },
      { v:'limpié',      tiempo:'pasado'   },
      { v:'cambian',     tiempo:'presente' },
      { v:'vacunaré',    tiempo:'futuro'   },
      { v:'divertiré',   tiempo:'futuro'   },
    ]
  },
  {
    titulo: 'Gina 💃',
    html: `Gina <b>tiene</b> 8 años y <b>es</b> bailarina. 
Le <b>gusta</b> ponerse su tutú y bailar todo el día. 
La semana pasada <b>vio</b> que su tutú estaba muy gastado y le <b>pidió</b> 
a su mamá que le compre uno nuevo. Mañana <b>irán</b> de compras 
y Gina <b>estrenará</b> tutú en su próxima clase de ballet.`,
    verbos: [
      { v:'tiene',     tiempo:'presente' },
      { v:'es',        tiempo:'presente' },
      { v:'gusta',     tiempo:'presente' },
      { v:'vio',       tiempo:'pasado'   },
      { v:'pidió',     tiempo:'pasado'   },
      { v:'irán',      tiempo:'futuro'   },
      { v:'estrenará', tiempo:'futuro'   },
    ]
  }
];

/* ============================================================
   3. PARTÍCULAS DE FONDO
   ============================================================ */
function initParticles() {
  const wrap = $('particles');
  const count = 40;
  const colors = ['#F5B800','#7B3FE4','#1A9E6E','#fff','#E4B0FF'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random() * 4;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      --dur:${3+Math.random()*5}s;
      --delay:${Math.random()*5}s;
      --op:${0.4+Math.random()*0.6};
    `;
    wrap.appendChild(p);
  }
}

/* ============================================================
   4. MAPA DE NIVELES (portada)
   ============================================================ */
const LEVELS_META = [
  { emoji:'🕐', name:'El verbo en 3 tiempos', desc:'Encontrá el tiempo verbal pedido · 10 ejercicios' },
  { emoji:'🔍', name:'¿Pasado, presente o futuro?', desc:'Identificá el tiempo de cada verbo · 10 ejercicios' },
  { emoji:'✏️', name:'Completá la oración', desc:'Elegí el verbo correcto para cada espacio · 10 oraciones' },
  { emoji:'🏷️', name:'¿Qué tiempo es?', desc:'Clasificá las oraciones según su tiempo verbal · 10 oraciones' },
  { emoji:'📖', name:'La gran clasificación', desc:'Organizá los verbos de 3 textos en una tabla · 18 verbos' },
];

function renderLevelMap() {
  const map = $('levelMap');
  map.innerHTML = '';
  LEVELS_META.forEach((lv, i) => {
    const done   = STATE.completedLevels.includes(i);
    const locked = i > 0 && !STATE.completedLevels.includes(i - 1);
    const unlocked = !locked;

    const node = document.createElement('div');
    node.className = 'level-node ' + (done ? 'done' : locked ? 'locked' : 'unlocked');

    node.innerHTML = `
      <div class="level-badge">${lv.emoji}</div>
      <div class="level-info">
        <div class="level-num">Nivel ${i + 1}${done ? ' ✓' : ''}</div>
        <div class="level-name">${lv.name}</div>
        <div class="level-desc">${lv.desc}</div>
      </div>
      <div class="level-status">${done ? '🏅' : locked ? '🔒' : '▶️'}</div>
      ${unlocked && !done ? '<div class="level-arrow">›</div>' : ''}
    `;

    if (unlocked) {
      node.addEventListener('click', () => startLevel(i));
    }
    map.appendChild(node);
  });

  $('homeCoinCount').textContent = STATE.coins;
}

/* ============================================================
   5. MECÁNICA GENERAL DE NIVEL
   ============================================================ */
let LVL = {
  idx: 0,           // índice del nivel actual (0-4)
  items: [],        // ítems del nivel
  step: 0,          // ítem actual
  attempts: 0,      // intentos en el ítem actual
  earnedCoins: 0,   // monedas ganadas en este nivel
  answered: false,  // ítem actual ya respondido correctamente
};

function startLevel(idx) {
  LVL.idx = idx;
  LVL.step = 0;
  LVL.attempts = 0;
  LVL.earnedCoins = 0;
  LVL.answered = false;

  switch(idx) {
    case 0: LVL.items = shuffle(ACT1_DATA); break;
    case 1: LVL.items = shuffle(ACT2_DATA); break;
    case 2: LVL.items = shuffle(ACT3_DATA); break;
    case 3: LVL.items = shuffle(ACT4_DATA); break;
    case 4: LVL.items = ACT5_TEXTOS;        break;
  }

  // cabecera
  const meta = LEVELS_META[idx];
  $('actEmoji').textContent  = meta.emoji;
  $('actTitle').textContent  = meta.name;
  $('liveCoins').textContent = STATE.coins;

  showScreen('screen-activity');
  memoSay('¡Listo para explorar! 🚀', 'think');
  renderStep();
}

function renderStep() {
  LVL.attempts = 0;
  LVL.answered = false;
  $('btnNext').style.display = 'none';

  const total = LVL.idx === 4 ? ACT5_TEXTOS.length : LVL.items.length;
  const cur   = LVL.step + 1;
  $('progressBar').style.width = ((cur - 1) / total * 100) + '%';
  $('progressLabel').textContent = cur + ' / ' + total;

  const zone = $('exerciseZone');
  zone.innerHTML = '';

  switch(LVL.idx) {
    case 0: renderAct1(zone); break;
    case 1: renderAct2(zone); break;
    case 2: renderAct3(zone); break;
    case 3: renderAct4(zone); break;
    case 4: renderAct5(zone); break;
  }
}

function advanceStep() {
  LVL.step++;
  const total = LVL.idx === 4 ? ACT5_TEXTOS.length : LVL.items.length;
  if (LVL.step >= total) {
    finishLevel();
  } else {
    renderStep();
    memoSay('¡Bien! ¿Seguimos? 💪', 'think');
  }
}

function handleCorrect(coinsEarned = 1) {
  if (LVL.answered) return;
  LVL.answered = true;
  STATE.coins += coinsEarned;
  LVL.earnedCoins += coinsEarned;
  $('liveCoins').textContent = STATE.coins;
  $('btnNext').style.display = 'flex';
  memoSay('¡Excelente! 🎉 +' + coinsEarned + ' 🪙', 'happy');
  spawnMiniConfetti();
}

function handleWrong() {
  LVL.attempts++;
  memoSay(LVL.attempts >= 2 ? '¡Casi! Fijate en la pista 👀' : '¡Ups! Intentá de nuevo 🤔', 'sad');
}

function finishLevel() {
  const base = COINS_PER_LEVEL[LVL.idx];
  STATE.coins += base;
  LVL.earnedCoins += base;
  if (!STATE.completedLevels.includes(LVL.idx)) {
    STATE.completedLevels.push(LVL.idx);
  }

  $('completeTitle').textContent =
    LVL.idx === 4 ? '¡Sos un Maestro del Tiempo! 🏆' : '¡Nivel superado! 🎉';
  $('completeSub').textContent =
    `Completaste el nivel ${LVL.idx + 1} con ${LVL.earnedCoins} monedas en este recorrido.`;
  $('medalEarned').textContent = MEDALS[LVL.idx];
  $('coinEarned').textContent = '+' + base + ' 🪙 de bonus · Total: ' + STATE.coins + ' 🪙';

  showScreen('screen-complete');
  launchConfetti(40);
}

/* ============================================================
   6. MASCOTA MEMO
   ============================================================ */
function memoSay(msg, mood = 'think') {
  const body = $('memoBody');
  const speech = $('memoSpeech');
  body.className = 'memo-body';
  void body.offsetWidth; // reflow para reiniciar animación
  body.classList.add(mood);
  speech.textContent = msg;
}

/* ============================================================
   7. ACTIVIDAD 1 — verbo en 3 tiempos → elegir el indicado
   ============================================================ */
function renderAct1(zone) {
  const item = LVL.items[LVL.step];
  const askLabel = { pasado:'🕰️ PASADO', presente:'🟢 PRESENTE', futuro:'🚀 FUTURO' };

  zone.innerHTML = `
    <div class="ex-card">
      <span class="ex-emoji-big">${item.emoji}</span>
      <p class="ex-question">¿Cuál es la forma en <strong>${askLabel[item.ask]}</strong>?</p>
      <div class="tres-tiempos" id="tresTiempos">
        <div class="verbo-card">
          <div class="vc-label">Pasado</div>
        </div>
        <div class="vc-arrow">→</div>
        <div class="verbo-card">
          <div class="vc-label">Presente</div>
        </div>
        <div class="vc-arrow">→</div>
        <div class="verbo-card">
          <div class="vc-label">Futuro</div>
        </div>
      </div>
      <div class="options-grid row" id="act1opts"></div>
      <div class="inline-feedback" id="act1fb"></div>
    </div>
  `;

  const correct = item[item.ask];
  const opts = shuffle([item.pasado, item.presente, item.futuro]);
  const container = $('act1opts');
  opts.forEach(op => {
    const b = document.createElement('button');
    b.className = 'opt-btn';
    b.textContent = op;
    b.addEventListener('click', () => {
      if (LVL.answered) return;
      const allBtns = $all('#act1opts .opt-btn');
      allBtns.forEach(x => x.disabled = true);
      if (op === correct) {
        b.classList.add('is-correct');
        $('act1fb').textContent = '✅ ¡Correcto!';
        $('act1fb').className = 'inline-feedback ok';
        handleCorrect(1);
      } else {
        b.classList.add('is-wrong');
        $('act1fb').textContent = '❌ No es ese. La respuesta era: ' + correct;
        $('act1fb').className = 'inline-feedback err';
        handleWrong();
        // desbloquear los demás menos el clickeado
        allBtns.forEach(x => { if (x !== b) x.disabled = false; });
        // mostrar pista si hace 2 intentos
        if (LVL.attempts >= 2 && !$('act1hint')) {
          const hint = document.createElement('div');
          hint.id = 'act1hint';
          hint.className = 'hint-box';
          hint.textContent = '💡 Pista: "' + correct + '" es la forma en ' + item.ask;
          $q('.ex-card').appendChild(hint);
        }
      }
    });
    container.appendChild(b);
  });
}

/* ============================================================
   8. ACTIVIDAD 2 — verbo conjugado → identificar tiempo
   ============================================================ */
function renderAct2(zone) {
  const item = LVL.items[LVL.step];
  const tiempos = ['pasado','presente','futuro'];
  const colors = { pasado:'past-btn', presente:'pres-btn', futuro:'fut-btn' };
  const labels = { pasado:'🕰️ Pasado', presente:'🟢 Presente', futuro:'🚀 Futuro' };

  zone.innerHTML = `
    <div class="ex-card">
      <span class="ex-emoji-big">${item.emoji}</span>
      <p class="ex-question">¿Este verbo está en pasado, presente o futuro?</p>
      <div class="tiempo-badges">
        <div class="act2-word-display">&ldquo;${item.verbo}&rdquo;</div>
      </div>
      <div class="options-grid" id="act2opts"></div>
      <div class="inline-feedback" id="act2fb"></div>
    </div>
  `;

  const container = $('act2opts');
  tiempos.forEach(t => {
    const b = document.createElement('button');
    b.className = 'opt-btn ' + colors[t];
    b.textContent = labels[t];
    b.addEventListener('click', () => {
      if (LVL.answered) return;
      const allBtns = $all('#act2opts .opt-btn');
      allBtns.forEach(x => x.disabled = true);
      if (t === item.tiempo) {
        b.classList.add('is-correct');
        $('act2fb').textContent = '✅ ¡Muy bien! "' + item.verbo + '" está en ' + t;
        $('act2fb').className = 'inline-feedback ok';
        handleCorrect(1);
      } else {
        b.classList.add('is-wrong');
        $('act2fb').textContent = '❌ Era ' + item.tiempo + '. Volvé a intentarlo.';
        $('act2fb').className = 'inline-feedback err';
        handleWrong();
        allBtns.forEach(x => { if (x !== b) x.disabled = false; });
      }
    });
    container.appendChild(b);
  });
}

/* ============================================================
   9. ACTIVIDAD 3 — completar oración con verbo correcto
   ============================================================ */
function renderAct3(zone) {
  const item = LVL.items[LVL.step];

  // construir la oración con el hueco
  let sentenceHTML = '';
  item.partes.forEach(part => {
    if (part === null) {
      sentenceHTML += `<span class="blank-slot" id="blankSlot">_____</span>`;
    } else {
      sentenceHTML += part;
    }
  });

  zone.innerHTML = `
    <div class="ex-card">
      <span class="ex-emoji-big">${item.emoji}</span>
      <p class="ex-question">Completá la oración con el verbo correcto:</p>
      <div class="sentence-blanked">${sentenceHTML}</div>
      <div class="options-grid" id="act3opts"></div>
      <div class="inline-feedback" id="act3fb"></div>
    </div>
  `;

  const container = $('act3opts');
  item.opciones.forEach(op => {
    const b = document.createElement('button');
    b.className = 'opt-btn';
    b.textContent = op;
    b.addEventListener('click', () => {
      if (LVL.answered) return;
      const allBtns = $all('#act3opts .opt-btn');
      allBtns.forEach(x => x.disabled = true);
      const slot = $('blankSlot');
      slot.textContent = op;
      if (op === item.correcta) {
        slot.className = 'blank-slot correct';
        b.classList.add('is-correct');
        $('act3fb').textContent = '✅ ¡Correcto!';
        $('act3fb').className = 'inline-feedback ok';
        handleCorrect(1);
      } else {
        slot.className = 'blank-slot wrong';
        b.classList.add('is-wrong');
        $('act3fb').textContent = '❌ Ese no es. Intentá con otra opción.';
        $('act3fb').className = 'inline-feedback err';
        handleWrong();
        slot.textContent = '_____';
        slot.className = 'blank-slot';
        allBtns.forEach(x => { if (x !== b) x.disabled = false; });
        if (LVL.attempts >= 2 && !$('act3hint')) {
          const hint = document.createElement('div');
          hint.id = 'act3hint';
          hint.className = 'hint-box';
          hint.textContent = '💡 Pista: ' + item.hint;
          $q('.ex-card').appendChild(hint);
        }
      }
    });
    container.appendChild(b);
  });
}

/* ============================================================
   10. ACTIVIDAD 4 — oraciones → identificar tiempo verbal
   ============================================================ */
function renderAct4(zone) {
  const item = LVL.items[LVL.step];
  const tiempos = ['pasado','presente','futuro'];
  const labels = { pasado:'🕰️ Pasado', presente:'🟢 Presente', futuro:'🚀 Futuro' };
  const tagClass = { pasado:'past-tag', presente:'pres-tag', futuro:'fut-tag' };

  zone.innerHTML = `
    <div class="ex-card">
      <span class="ex-emoji-big">${item.emoji}</span>
      <p class="ex-question">¿En qué tiempo está el verbo de esta oración?</p>
      <div class="sentence-row" id="act4row">
        <span class="sentence-text">${item.oracion}</span>
        <div class="sentence-tags" id="act4tags"></div>
      </div>
      <div class="inline-feedback" id="act4fb"></div>
    </div>
  `;

  const tagsWrap = $('act4tags');
  tiempos.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn ' + tagClass[t];
    btn.textContent = labels[t];
    btn.addEventListener('click', () => {
      if (LVL.answered) return;
      $all('#act4tags .tag-btn').forEach(x => x.disabled = true);
      if (t === item.tiempo) {
        btn.classList.add('selected');
        $('act4row').className = 'sentence-row correct';
        $('act4fb').textContent = '✅ ¡Exacto! Está en ' + t;
        $('act4fb').className = 'inline-feedback ok';
        handleCorrect(1);
      } else {
        btn.classList.add('selected');
        $('act4row').className = 'sentence-row wrong';
        $('act4fb').textContent = '❌ No es ese. Era: ' + labels[item.tiempo];
        $('act4fb').className = 'inline-feedback err';
        handleWrong();
        $('act4row').className = 'sentence-row';
        btn.classList.remove('selected');
        $all('#act4tags .tag-btn').forEach(x => x.disabled = false);
      }
    });
    tagsWrap.appendChild(btn);
  });
}

/* ============================================================
   11. ACTIVIDAD 5 — clasificar verbos de 3 textos en tabla
   ============================================================ */
function renderAct5(zone) {
  const texto = LVL.items[LVL.step];

  // envolver cada verbo del texto en un span seleccionable/arrastrable,
  // dejando en su lugar una "ranura" que queda vacía cuando se lo mueve
  let htmlConVerbos = texto.html;
  texto.verbos.forEach(({ v }, i) => {
    const slotId = `slot-${LVL.step}-${i}`;
    const original = `<b>${v}</b>`;
    const reemplazo = `<span class="verb-slot" id="${slotId}"><span class="verb-token" draggable="true" data-verb="${v}" data-slot="${slotId}">${v}</span></span>`;
    htmlConVerbos = htmlConVerbos.replace(original, reemplazo);
  });

  zone.innerHTML = `
    <div class="ex-card">
      <p class="ex-question">📖 ${texto.titulo}</p>
      <div class="texto-bloque" id="textoBloque">${htmlConVerbos}</div>
      <p class="instruccion-corta">
        Tocá un verbo del texto para seleccionarlo y luego tocá (o arrastrá) hasta la columna correcta:
      </p>
      <div class="clasificador-tabla" id="clasiTabla">
        <div class="col-tiempo pasado">
          <div class="col-header">🕰️ Pasado</div>
          <div class="col-drop" id="drop-pasado" data-tiempo="pasado"></div>
        </div>
        <div class="col-tiempo presente">
          <div class="col-header">🟢 Presente</div>
          <div class="col-drop" id="drop-presente" data-tiempo="presente"></div>
        </div>
        <div class="col-tiempo futuro">
          <div class="col-header">🚀 Futuro</div>
          <div class="col-drop" id="drop-futuro" data-tiempo="futuro"></div>
        </div>
      </div>
      <button class="btn-check-tabla" id="btnCheckTabla">Comprobar tabla ✔️</button>
      <div class="inline-feedback" id="act5fb"></div>
    </div>
  `;

  let selectedToken = null;
  const selectToken = tok => {
    if (selectedToken && selectedToken !== tok) selectedToken.classList.remove('selected');
    if (selectedToken === tok) {
      tok.classList.remove('selected');
      selectedToken = null;
      return;
    }
    selectedToken = tok;
    tok.classList.add('selected');
  };

  // cada verbo del texto: seleccionable con un toque y arrastrable
  $all('.verb-token').forEach(tok => {
    tok.addEventListener('dragstart', e => {
      tok.classList.remove('selected');
      selectedToken = null;
      e.dataTransfer.setData('text/plain', tok.dataset.verb);
    });
    tok.addEventListener('click', () => selectToken(tok));
    addTouchDrag(tok);
  });

  // columnas de destino: reciben por drag & drop o por toque (si hay un verbo seleccionado)
  $all('.col-drop').forEach(drop => {
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag-over'); });
    drop.addEventListener('dragleave', () => drop.classList.remove('drag-over'));
    drop.addEventListener('drop', e => {
      e.preventDefault();
      drop.classList.remove('drag-over');
      const verb = e.dataTransfer.getData('text/plain');
      const tok = $q(`.verb-token[data-verb="${CSS.escape(verb)}"]`);
      if (tok) drop.appendChild(tok);
    });
    drop.addEventListener('click', () => {
      if (selectedToken) {
        selectedToken.classList.remove('selected');
        drop.appendChild(selectedToken);
        selectedToken = null;
      }
    });
  });

  $('btnCheckTabla').addEventListener('click', checkTabla);
}

function addTouchDrag(chip) {
  let clone = null, offsetX = 0, offsetY = 0;

  chip.addEventListener('touchstart', e => {
    const t = e.touches[0];
    offsetX = t.clientX - chip.getBoundingClientRect().left;
    offsetY = t.clientY - chip.getBoundingClientRect().top;
    clone = chip.cloneNode(true);
    clone.style.cssText = `position:fixed;z-index:999;opacity:0.85;pointer-events:none;
      left:${t.clientX - offsetX}px;top:${t.clientY - offsetY}px;`;
    document.body.appendChild(clone);
  }, { passive: true });

  chip.addEventListener('touchmove', e => {
    e.preventDefault();
    const t = e.touches[0];
    if (clone) {
      clone.style.left = (t.clientX - offsetX) + 'px';
      clone.style.top  = (t.clientY - offsetY) + 'px';
    }
  }, { passive: false });

  chip.addEventListener('touchend', e => {
    if (clone) {
      const t = e.changedTouches[0];
      const target = document.elementFromPoint(t.clientX, t.clientY);
      const drop = target?.closest('.col-drop');
      if (drop) {
        chip.classList.remove('selected');
        drop.appendChild(chip);
      }
      clone.remove();
      clone = null;
    }
  });
}

function checkTabla() {
  const texto = LVL.items[LVL.step];
  let allOk = true;
  let unplaced = 0;

  texto.verbos.forEach(({ v, tiempo }) => {
    const tok = $q(`.verb-token[data-verb="${CSS.escape(v)}"]`);
    if (!tok) return;
    const parent = tok.parentElement;
    if (parent && parent.classList.contains('verb-slot')) {
      unplaced++;
      return;
    }
    if (parent && parent.dataset.tiempo === tiempo) {
      tok.classList.add('correct-token');
      tok.classList.remove('wrong-token');
    } else {
      tok.classList.add('wrong-token');
      tok.classList.remove('correct-token');
      allOk = false;
    }
  });

  const fb = $('act5fb');

  if (unplaced > 0) {
    fb.textContent = '⚠️ Todavía quedan verbos sin ubicar en el texto. ¡Seleccionalos y llevalos a una columna!';
    fb.className = 'inline-feedback err';
    // restaurar colores
    $all('.verb-token').forEach(t => t.classList.remove('correct-token', 'wrong-token'));
    return;
  }

  if (allOk) {
    fb.textContent = '✅ ¡Perfecto! Todos los verbos están en el lugar correcto. 🎉';
    fb.className = 'inline-feedback ok';
    $('btnCheckTabla').disabled = true;
    handleCorrect(3);
  } else {
    fb.textContent = '❌ Algunos están mal. Los rojos están en el lugar equivocado. Intentá moverlos.';
    fb.className = 'inline-feedback err';
    handleWrong();
    // devolver los verbos mal ubicados a su lugar original en el texto
    setTimeout(() => {
      $all('.verb-token.wrong-token').forEach(tok => {
        tok.classList.remove('wrong-token');
        const slot = $(tok.dataset.slot);
        if (slot) slot.appendChild(tok);
      });
    }, 1200);
  }
}

/* ============================================================
   12. CONFETI
   ============================================================ */
function launchConfetti(n = 25) {
  const pieces = ['⭐','🌟','✨','🎉','🪙','💫','🎊'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('span');
    p.className = 'confetti-piece';
    p.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (2 + Math.random() * 2) + 's';
    p.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 4500);
  }
}

function spawnMiniConfetti() {
  const pieces = ['⭐','✨','💫'];
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('span');
    p.className = 'confetti-piece';
    p.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    p.style.left = (20 + Math.random() * 60) + 'vw';
    p.style.animationDuration = (1 + Math.random()) + 's';
    p.style.fontSize = '1rem';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }
}

/* ============================================================
   13. EVENTOS GLOBALES
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  renderLevelMap();
  showScreen('screen-home');

  $('btnNext').addEventListener('click', advanceStep);

  $('btnHome').addEventListener('click', () => {
    renderLevelMap();
    showScreen('screen-home');
  });

  $('btnHome2').addEventListener('click', () => {
    renderLevelMap();
    showScreen('screen-home');
  });

  $('btnContinue').addEventListener('click', () => {
    renderLevelMap();
    showScreen('screen-home');
    // auto-abrir el siguiente nivel si existe y está desbloqueado
    const next = LVL.idx + 1;
    if (next < 5) {
      setTimeout(() => startLevel(next), 300);
    }
  });
});
