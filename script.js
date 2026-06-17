/* =========================================================
   EL TALLER DE LETRAS — lógica de la app
   Actividad: Sonidos compuestos (br, bl, pl, pr, cr)
   ========================================================= */

/* -------------------------------------------------
   1. BANCO DE PALABRAS
   Cada palabra tiene: nombre completo, sonido compuesto,
   emoji que la representa, y la parte de la palabra que
   queda luego de quitar el sonido (para nivel 2).
   ------------------------------------------------- */
const WORD_BANK = [
  // br
  { word: "brazo",    sound: "br", emoji: "💪" },
  { word: "brocha",   sound: "br", emoji: "🖌️" },
  { word: "sombrero", sound: "br", emoji: "👒" },
  { word: "cabra",    sound: "br", emoji: "🐐" },
  { word: "libro",    sound: "br", emoji: "📕" },
  { word: "brócoli",  sound: "br", emoji: "🥦" },

  // bl
  { word: "blusa",    sound: "bl", emoji: "👚" },
  { word: "tabla",    sound: "bl", emoji: "🛹" },
  { word: "mueble",   sound: "bl", emoji: "🪑" },
  { word: "doble",    sound: "bl", emoji: "👯" },
  { word: "establo",  sound: "bl", emoji: "🐎" },
  { word: "bloque",   sound: "bl", emoji: "🧱" },

  // pl
  { word: "planta",   sound: "pl", emoji: "🌱" },
  { word: "pluma",    sound: "pl", emoji: "🖋️" },
  { word: "plato",    sound: "pl", emoji: "🍽️" },
  { word: "playa",    sound: "pl", emoji: "🏖️" },
  { word: "templo",   sound: "pl", emoji: "🛕" },
  { word: "plátano",  sound: "pl", emoji: "🍌" },

  // pr
  { word: "princesa", sound: "pr", emoji: "👸" },
  { word: "primo",    sound: "pr", emoji: "🧑" },
  { word: "premio",   sound: "pr", emoji: "🏆" },
  { word: "sorpresa", sound: "pr", emoji: "🎁" },
  { word: "prado",    sound: "pr", emoji: "🌾" },
  { word: "comprar",  sound: "pr", emoji: "🛒" },

  // cr
  { word: "cruz",     sound: "cr", emoji: "✝️" },
  { word: "cráter",   sound: "cr", emoji: "🌋" },
  { word: "escribir", sound: "cr", emoji: "✍️" },
  { word: "escritorio",sound: "cr", emoji: "🗄️" },
  { word: "secreto",  sound: "cr", emoji: "🤫" },
  { word: "crema",    sound: "cr", emoji: "🧴" },

  // distractores: palabras SIN ninguno de estos sonidos compuestos,
  // usadas en el nivel 3 para que el alumno descarte
  { word: "sol",      sound: null, emoji: "☀️" },
  { word: "gato",     sound: null, emoji: "🐱" },
  { word: "pez",      sound: null, emoji: "🐟" },
  { word: "luna",     sound: null, emoji: "🌙" },
  { word: "flor",     sound: null, emoji: "🌸" },
  { word: "casa",     sound: null, emoji: "🏠" },
  { word: "perro",    sound: null, emoji: "🐶" },
  { word: "manzana",  sound: null, emoji: "🍎" },
  { word: "globo",    sound: null, emoji: "🎈" },
  { word: "tren",     sound: null, emoji: "🚂" },
  { word: "nube",     sound: null, emoji: "☁️" },
  { word: "vaca",     sound: null, emoji: "🐄" },
  { word: "torta",    sound: null, emoji: "🎂" },
  { word: "diente",   sound: null, emoji: "🦷" },
  { word: "fresa",    sound: null, emoji: "🍓" }, // contiene "fr", no es nuestro sonido objetivo
];

const SOUNDS = ["br", "bl", "pl", "pr", "cr"];

function wordsWithSound(sound){
  return WORD_BANK.filter(w => w.sound === sound);
}
function wordsWithoutSound(){
  return WORD_BANK.filter(w => w.sound === null);
}

function shuffle(array){
  const arr = array.slice();
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function pickRandom(array, n){
  return shuffle(array).slice(0, n);
}

/* -------------------------------------------------
   2. ESTADO GLOBAL Y NAVEGACIÓN
   ------------------------------------------------- */
const state = {
  totalStars: 0,
  currentLevel: null,
};

function $(selector){ return document.querySelector(selector); }
function $all(selector){ return document.querySelectorAll(selector); }

function showScreen(id){
  $all(".screen").forEach(s => s.classList.remove("active"));
  $("#" + id).classList.add("active");
}

function showSonidosSubview(id){
  $all("#levelSelect, .level-screen, .level-complete").forEach(s => s.classList.remove("active"));
  $("#" + id).classList.add("active");
}

function addStars(n){
  state.totalStars += n;
  if(state.totalStars < 0) state.totalStars = 0;
  $("#starsCount").textContent = state.totalStars;
}

function launchConfetti(){
  const emojis = ["⭐", "🎉", "✨", "🌟"];
  for(let i = 0; i < 18; i++){
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.animationDuration = (2 + Math.random() * 1.5) + "s";
    piece.style.fontSize = (1.2 + Math.random() * 1.2) + "rem";
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 3600);
  }
}

function shakeMascot(selector){
  const el = $(selector);
  if(!el) return;
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 420);
}

/* -------------------------------------------------
   3. EVENTOS DE NAVEGACIÓN GENERAL
   ------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Tarjetas de la home
  $all(".activity-card[data-activity]").forEach(card => {
    card.querySelector(".btn-enter").addEventListener("click", () => {
      showScreen("screen-sonidos");
      showSonidosSubview("levelSelect");
    });
  });

  $("#btnBackHome").addEventListener("click", () => {
    showScreen("screen-home");
  });

  // Selector de nivel
  $all(".level-card").forEach(card => {
    card.addEventListener("click", () => {
      const level = card.dataset.level;
      startLevel(level);
    });
  });

  // Botones "← Niveles" dentro de cada nivel
  $all("[data-back-to]").forEach(btn => {
    btn.addEventListener("click", () => {
      showSonidosSubview(btn.dataset.backTo);
    });
  });

  $("#btnToLevels").addEventListener("click", () => {
    showSonidosSubview("levelSelect");
  });

  $("#btnRetryLevel").addEventListener("click", () => {
    startLevel(state.currentLevel);
  });

  // Formulario nivel 2
  $("#l2-form").addEventListener("submit", (e) => {
    e.preventDefault();
    checkLevel2Answer();
  });

  // Botón comprobar nivel 3
  $("#l3-submit").addEventListener("click", checkLevel3Row);
});

function startLevel(level){
  state.currentLevel = level;
  if(level === "1"){
    showSonidosSubview("level1");
    initLevel1();
  }else if(level === "2"){
    showSonidosSubview("level2");
    initLevel2();
  }else if(level === "3"){
    showSonidosSubview("level3");
    initLevel3();
  }
}

function showLevelComplete(correct, incorrect, title, text){
  $("#completeTitle").textContent = title;
  $("#completeText").textContent = text;
  $("#completeCorrect").textContent = correct;
  $("#completeIncorrect").textContent = incorrect;
  showSonidosSubview("levelComplete");
  if(correct > incorrect) launchConfetti();
}

/* =========================================================
   NIVEL 1 — Clasificar imágenes según el sonido compuesto
   El alumno ve una imagen y elige entre 3 sonidos cuál es
   el correcto. Se cuentan aciertos y errores; al fallar se
   muestra el nombre completo de la palabra.
   ========================================================= */
const L1_TOTAL = 10;
let l1 = { items: [], index: 0, correct: 0, incorrect: 0 };

function initLevel1(){
  const pool = WORD_BANK.filter(w => w.sound !== null);
  l1.items = pickRandom(pool, L1_TOTAL);
  l1.index = 0;
  l1.correct = 0;
  l1.incorrect = 0;
  $("#l1-total").textContent = L1_TOTAL;
  $("#l1-correct").textContent = 0;
  $("#l1-incorrect").textContent = 0;
  renderLevel1Question();
}

function renderLevel1Question(){
  const item = l1.items[l1.index];
  $("#l1-progress").textContent = l1.index + 1;
  $("#l1-image-stage").textContent = item.emoji;
  $("#l1-feedback").textContent = "";
  $("#l1-feedback").className = "feedback-box";

  // generar 3 opciones: el sonido correcto + 2 distractores
  const distractors = shuffle(SOUNDS.filter(s => s !== item.sound)).slice(0, 2);
  const options = shuffle([item.sound, ...distractors]);

  const wrap = $("#l1-options");
  wrap.innerHTML = "";
  options.forEach(sound => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = sound;
    btn.addEventListener("click", () => handleLevel1Answer(sound, item, btn));
    wrap.appendChild(btn);
  });
}

function handleLevel1Answer(chosenSound, item, btnEl){
  const buttons = $all("#l1-options .option-btn");
  buttons.forEach(b => b.disabled = true);

  const feedback = $("#l1-feedback");
  if(chosenSound === item.sound){
    l1.correct++;
    addStars(1);
    btnEl.classList.add("correct-flash");
    feedback.textContent = "¡Muy bien! Es correcto. 🎉";
    feedback.className = "feedback-box correct";
  }else{
    l1.incorrect++;
    btnEl.classList.add("incorrect-flash");
    feedback.textContent = `Esa no es. La palabra es "${item.word}", y empieza con "${item.sound}".`;
    feedback.className = "feedback-box incorrect";
    shakeMascot("#mascotHome"); // mascota no visible aquí, pero no genera error si no existe
  }
  $("#l1-correct").textContent = l1.correct;
  $("#l1-incorrect").textContent = l1.incorrect;

  setTimeout(() => {
    l1.index++;
    if(l1.index < l1.items.length){
      renderLevel1Question();
    }else{
      showLevelComplete(
        l1.correct, l1.incorrect,
        l1.incorrect === 0 ? "¡Perfecto!" : "¡Nivel completado!",
        `Clasificaste ${L1_TOTAL} imágenes. ¡Seguí practicando!`
      );
    }
  }, 1400);
}

/* =========================================================
   NIVEL 2 — Completar el nombre de las imágenes
   El alumno ve una imagen con el nombre incompleto (falta
   el sonido compuesto) y debe escribirlo en dos casilleros.
   ========================================================= */
const L2_TOTAL = 10;
let l2 = { items: [], index: 0, correct: 0, incorrect: 0, answered: false };

function initLevel2(){
  const pool = WORD_BANK.filter(w => w.sound !== null);
  l2.items = pickRandom(pool, L2_TOTAL);
  l2.index = 0;
  l2.correct = 0;
  l2.incorrect = 0;
  $("#l2-total").textContent = L2_TOTAL;
  $("#l2-correct").textContent = 0;
  $("#l2-incorrect").textContent = 0;
  renderLevel2Question();
}

function renderLevel2Question(){
  const item = l2.items[l2.index];
  l2.answered = false;
  $("#l2-progress").textContent = l2.index + 1;
  $("#l2-image-stage").textContent = item.emoji;
  $("#l2-feedback").textContent = "";
  $("#l2-feedback").className = "feedback-box";

  // localizar dónde aparece el sonido compuesto dentro de la palabra
  const word = item.word;
  const sound = item.sound;
  const pos = word.toLowerCase().indexOf(sound);
  const before = word.slice(0, pos);
  const after = word.slice(pos + sound.length);

  const blankWrap = $("#l2-word-blank");
  blankWrap.innerHTML = "";

  if(before){
    const span = document.createElement("span");
    span.className = "word-fixed";
    span.textContent = before;
    blankWrap.appendChild(span);
  }

  // dos inputs, uno por cada letra del sonido compuesto
  for(let i = 0; i < sound.length; i++){
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.className = "blank-input";
    input.dataset.idx = i;
    input.autocomplete = "off";
    input.addEventListener("input", () => {
      input.value = input.value.toLowerCase();
      if(input.value && input.nextElementSibling === null){
        // avanzar foco si hay otro input después
      }
      const inputs = $all("#l2-word-blank .blank-input");
      const nextInput = inputs[i + 1];
      if(input.value && nextInput){
        nextInput.focus();
      }
    });
    blankWrap.appendChild(input);
  }

  if(after){
    const span = document.createElement("span");
    span.className = "word-fixed";
    span.textContent = after;
    blankWrap.appendChild(span);
  }

  // enfocar primer input
  setTimeout(() => {
    const firstInput = $("#l2-word-blank .blank-input");
    if(firstInput) firstInput.focus();
  }, 50);
}

function checkLevel2Answer(){
  if(l2.answered) return;
  const item = l2.items[l2.index];
  const inputs = $all("#l2-word-blank .blank-input");
  const typed = Array.from(inputs).map(i => i.value.trim().toLowerCase()).join("");

  const feedback = $("#l2-feedback");

  if(typed.length < item.sound.length){
    feedback.textContent = "Completá los dos casilleros antes de comprobar.";
    feedback.className = "feedback-box";
    return;
  }

  l2.answered = true;

  if(typed === item.sound){
    l2.correct++;
    addStars(1);
    inputs.forEach(i => { i.classList.add("is-correct"); i.disabled = true; });
    feedback.textContent = `¡Correcto! "${item.word}" se escribe con "${item.sound}". 🎉`;
    feedback.className = "feedback-box correct";
  }else{
    l2.incorrect++;
    inputs.forEach(i => { i.classList.add("is-incorrect"); i.disabled = true; });
    feedback.textContent = `Casi. La palabra correcta es "${item.word}", con "${item.sound}".`;
    feedback.className = "feedback-box incorrect";
  }

  $("#l2-correct").textContent = l2.correct;
  $("#l2-incorrect").textContent = l2.incorrect;

  setTimeout(() => {
    l2.index++;
    if(l2.index < l2.items.length){
      renderLevel2Question();
    }else{
      showLevelComplete(
        l2.correct, l2.incorrect,
        l2.incorrect === 0 ? "¡Excelente escritura!" : "¡Nivel completado!",
        `Completaste ${L2_TOTAL} palabras. ¡Seguí así!`
      );
    }
  }, 1600);
}

/* =========================================================
   NIVEL 3 — Tablero tipo ficha: identificar imágenes correctas
   Cada fila corresponde a un sonido compuesto y mezcla
   imágenes que sí llevan ese sonido con otras que no.
   El alumno debe marcar únicamente las correctas.
   ========================================================= */
const L3_TOTAL_ROWS = 5; // una fila por cada sonido: br, bl, pl, pr, cr
const ITEMS_PER_ROW = 6;
const CORRECT_PER_ROW = 3; // cuántas de esas 6 imágenes sí llevan el sonido

let l3 = { rows: [], index: 0, correct: 0, incorrect: 0, selected: new Set() };

function buildLevel3Rows(){
  const rows = shuffle(SOUNDS).map(sound => {
    const withSound = pickRandom(wordsWithSound(sound), CORRECT_PER_ROW);
    const withoutSound = pickRandom(wordsWithoutSound(), ITEMS_PER_ROW - CORRECT_PER_ROW);
    const items = shuffle([...withSound, ...withoutSound]);
    return { sound, items };
  });
  return rows;
}

function initLevel3(){
  l3.rows = buildLevel3Rows();
  l3.index = 0;
  l3.correct = 0;
  l3.incorrect = 0;
  $("#l3-total").textContent = L3_TOTAL_ROWS;
  $("#l3-correct").textContent = 0;
  $("#l3-incorrect").textContent = 0;
  renderLevel3Row();
}

function renderLevel3Row(){
  const row = l3.rows[l3.index];
  l3.selected = new Set();
  $("#l3-progress").textContent = l3.index + 1;
  $("#l3-instruction").textContent = `Sonido a buscar: "${row.sound}"`;
  $("#l3-feedback").textContent = "";
  $("#l3-feedback").className = "feedback-box";
  $("#l3-submit").disabled = false;

  const board = $("#l3-board");
  board.innerHTML = "";

  const rowEl = document.createElement("div");
  rowEl.className = "board-row";

  const label = document.createElement("div");
  label.className = "row-label";
  label.textContent = row.sound;
  rowEl.appendChild(label);

  const itemsWrap = document.createElement("div");
  itemsWrap.className = "row-items";

  row.items.forEach((item, idx) => {
    const cell = document.createElement("button");
    cell.className = "cell-btn";
    cell.dataset.idx = idx;
    cell.innerHTML = `<span class="cell-emoji">${item.emoji}</span><span class="cell-name">${item.word}</span>`;
    cell.addEventListener("click", () => {
      if(cell.disabled) return;
      if(l3.selected.has(idx)){
        l3.selected.delete(idx);
        cell.classList.remove("selected");
      }else{
        l3.selected.add(idx);
        cell.classList.add("selected");
      }
    });
    itemsWrap.appendChild(cell);
  });

  rowEl.appendChild(itemsWrap);
  board.appendChild(rowEl);
}

function checkLevel3Row(){
  const row = l3.rows[l3.index];
  const cells = $all("#l3-board .cell-btn");
  $("#l3-submit").disabled = true;

  let rowCorrect = 0;
  let rowIncorrect = 0;

  cells.forEach((cell, idx) => {
    const item = row.items[idx];
    const isTarget = item.sound === row.sound;
    const wasSelected = l3.selected.has(idx);
    cell.disabled = true;
    cell.querySelector(".cell-name").classList.add("revealed");

    if(isTarget && wasSelected){
      cell.classList.add("correct-flash");
      rowCorrect++;
    }else if(!isTarget && wasSelected){
      cell.classList.add("incorrect-flash");
      rowIncorrect++;
    }else if(isTarget && !wasSelected){
      cell.classList.add("missed-flash");
      rowIncorrect++;
    }
  });

  l3.correct += rowCorrect;
  l3.incorrect += rowIncorrect;
  $("#l3-correct").textContent = l3.correct;
  $("#l3-incorrect").textContent = l3.incorrect;

  if(rowIncorrect === 0){
    addStars(2);
  }else if(rowCorrect > 0){
    addStars(1);
  }

  const feedback = $("#l3-feedback");
  if(rowIncorrect === 0){
    feedback.textContent = `¡Perfecto! Encontraste todas las palabras con "${row.sound}". 🎉`;
    feedback.className = "feedback-box correct";
  }else{
    feedback.textContent = `Revisá: las marcadas en amarillo también llevaban "${row.sound}", y las rojas no.`;
    feedback.className = "feedback-box incorrect";
  }

  setTimeout(() => {
    l3.index++;
    if(l3.index < l3.rows.length){
      renderLevel3Row();
    }else{
      showLevelComplete(
        l3.correct, l3.incorrect,
        l3.incorrect === 0 ? "¡Sos un experto!" : "¡Tablero completado!",
        `Revisaste ${L3_TOTAL_ROWS} filas de palabras. ¡Buen trabajo!`
      );
    }
  }, 2000);
}
