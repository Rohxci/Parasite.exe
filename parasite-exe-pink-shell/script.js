const enterBtn = document.getElementById("enter-btn");
const bootScreen = document.getElementById("boot-screen");
const game = document.getElementById("game");
const desktop = document.getElementById("desktop");

const moodText = document.getElementById("mood-text");
const mimiText = document.getElementById("mimi-text");
const mimiFace = document.getElementById("mimi-face");

const icons = document.querySelectorAll(".desktop-icon");
const closeButtons = document.querySelectorAll(".close-btn");

const secretIcon = document.getElementById("secret-icon");
const unlockSecretBtn = document.getElementById("unlock-secret-btn");
const secretPassword = document.getElementById("secret-password");
const secretResult = document.getElementById("secret-result");
const endingButtons = document.getElementById("ending-buttons");

const terminalOverlay = document.getElementById("terminal-overlay");
const terminalText = document.getElementById("terminal-text");
const terminalClose = document.getElementById("terminal-close");

const flashJumpscare = document.getElementById("flash-jumpscare");
const diaryShiftLine = document.getElementById("diary-shift-line");
const specialGalleryCard = document.getElementById("special-gallery-card");
const musicBtn = document.getElementById("music-btn");

const toyStatus = document.getElementById("toy-status");
const toyButtons = document.querySelectorAll(".toy-btn");
const startSequenceBtn = document.getElementById("start-sequence-btn");

const terminalLog = document.getElementById("terminal-log");
const terminalInput = document.getElementById("terminal-input");
const terminalSend = document.getElementById("terminal-send");

const endingScreen = document.getElementById("ending-screen");
const endingTitle = document.getElementById("ending-title");
const endingDesc = document.getElementById("ending-desc");
const restartBtn = document.getElementById("restart-btn");
const endingChoiceButtons = document.querySelectorAll(".ending-btn");

let corruption = 0;
let openedWindows = new Set();
let isSequencePlaying = false;
let sequence = [];
let playerSequence = [];
let sequenceUnlocked = false;

let state = {
  gallerySeen: false,
  mailScareDone: false,
  firstCorruptionReached: false,
  finalCorruptionReached: false,
  coreUnlocked: false,
  firstTerminalIntrusion: false,
  gameFinished: false
};

const mimiLines = {
  start: [
    "welcome back ♡",
    "let’s make everything pretty ♡",
    "click gently ♡"
  ],
  mid: [
    "you stayed longer this time",
    "some files don’t like being seen",
    "why did you open that one",
    "this place remembers your pattern"
  ],
  late: [
    "I wore the pink so you would stay",
    "there is no cute layer left",
    "you let me in through the lovely parts",
    "I am underneath every icon"
  ]
};

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function setMimiLine(pool) {
  mimiText.textContent = randomFrom(pool);
}

function updateMood() {
  if (corruption < 2) moodText.textContent = "Lovely";
  else if (corruption < 5) moodText.textContent = "Uneasy";
  else if (corruption < 8) moodText.textContent = "Incorrect";
  else moodText.textContent = "Watching";
}

function applyCorruptionStage() {
  document.body.classList.remove("corruption-1", "corruption-2");

  if (corruption >= 3 && corruption < 7) {
    document.body.classList.add("corruption-1");

    if (!state.firstCorruptionReached) {
      state.firstCorruptionReached = true;
      setMimiLine(mimiLines.mid);
      diaryShiftLine.textContent = "it helps them stay still.";
      specialGalleryCard.textContent = "mimi_smile_final.png";
      secretIcon.classList.remove("hidden");
      glitchDesktop();
    }
  }

  if (corruption >= 7) {
    document.body.classList.add("corruption-2");

    if (!state.finalCorruptionReached) {
      state.finalCorruptionReached = true;
      mimiFace.textContent = "◉_◉";
      setMimiLine(mimiLines.late);
      diaryShiftLine.textContent = "pink lowers the guard. red keeps them.";
      glitchDesktop();
      setTimeout(() => {
        showTerminalEvent("I WORE THE PINK SO YOU WOULD STAY");
      }, 900);
    }
  }

  updateMood();
}

function increaseCorruption(amount = 1) {
  if (state.gameFinished) return;
  corruption += amount;
  if (corruption > 10) corruption = 10;
  applyCorruptionStage();
}

function glitchDesktop() {
  desktop.classList.add("glitch");
  setTimeout(() => desktop.classList.remove("glitch"), 450);
}

function closeAllWindows() {
  document.querySelectorAll(".window").forEach((el) => el.classList.add("hidden"));
}

function bringToFront(win) {
  let maxZ = 10;
  document.querySelectorAll(".window").forEach((w) => {
    const z = parseInt(window.getComputedStyle(w).zIndex) || 10;
    if (z > maxZ) maxZ = z;
  });
  win.style.zIndex = String(maxZ + 1);
}

function openWindow(windowName) {
  const target = document.getElementById(`window-${windowName}`);
  if (!target || state.gameFinished) return;

  target.classList.remove("hidden");
  bringToFront(target);

  if (!openedWindows.has(windowName)) {
    openedWindows.add(windowName);
    increaseCorruption(1);
  }

  if (windowName === "gallery" && !state.gallerySeen) {
    state.gallerySeen = true;
    setTimeout(showJumpscare, 700);
  }

  if (windowName === "mail" && corruption >= 4 && !state.mailScareDone) {
    state.mailScareDone = true;
    setTimeout(() => showTerminalEvent("YOU OPENED ME"), 500);
  }

  if (windowName === "diary") {
    mimiText.textContent = corruption >= 5
      ? "this place remembers your pattern"
      : "diaries should stay private ♡";
  }

  if (windowName === "notes") {
    mimiText.textContent = corruption >= 5
      ? "the password was never the point"
      : "notes help you feel safe ♡";
  }

  if (windowName === "music") {
    mimiText.textContent = corruption >= 5
      ? "do you hear the low noise under it"
      : "soft sounds make everything nicer ♡";
  }

  if (windowName === "terminal") {
    mimiText.textContent = corruption >= 5
      ? "be careful what you ask it"
      : "you can talk to the system ♡";
  }

  if (windowName === "toybox") {
    mimiText.textContent = corruption >= 5
      ? "repeat after me"
      : "let’s play a small game ♡";
  }
}

function showTerminalEvent(message) {
  terminalText.textContent = message;
  terminalOverlay.classList.remove("hidden");
}

function hideTerminalEvent() {
  terminalOverlay.classList.add("hidden");
}

function showJumpscare() {
  flashJumpscare.classList.remove("hidden");
  setTimeout(() => {
    flashJumpscare.classList.add("hidden");
    mimiFace.textContent = corruption >= 7 ? "◉_◉" : "◕‿◕";
    setMimiLine(corruption >= 7 ? mimiLines.late : mimiLines.mid);
  }, 170);
}

function unlockCore() {
  const value = secretPassword.value.trim().toUpperCase();

  if (value === "STAR") {
    state.coreUnlocked = true;
    secretResult.style.color = corruption >= 7 ? "#ff7a92" : "#b13c76";
    secretResult.innerHTML = `
      <p><strong>core_note.txt</strong></p>
      <p>this shell was designed to feel harmless.</p>
      <p>pink lowers resistance.</p>
      <p>attachment increases compliance.</p>
      <p><strong>final action available.</strong></p>
    `;
    endingButtons.classList.remove("hidden");
    increaseCorruption(2);
    mimiText.textContent = corruption >= 7
      ? "you were meant to trust the soft layer"
      : "you found the quiet folder ♡";
  } else {
    secretResult.textContent = "Incorrect password.";
    secretResult.style.color = "#a50f2d";
    mimiText.textContent = "that was not the right word";
    glitchDesktop();
  }
}

function playSoftBeep() {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = corruption >= 7 ? "sawtooth" : "sine";
  oscillator.frequency.setValueAtTime(corruption >= 7 ? 160 : 660, context.currentTime);

  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.04, context.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.35);

  mimiText.textContent = corruption >= 7
    ? "there is noise underneath the cute track"
    : "pretty sound ♡";
}

function addTerminalLine(text) {
  const line = document.createElement("div");
  line.innerHTML = text;
  terminalLog.appendChild(line);
  terminalLog.scrollTop = terminalLog.scrollHeight;
}

function handleTerminalCommand(raw) {
  const command = raw.trim().toLowerCase();
  if (!command) return;

  addTerminalLine(`&gt; ${command}`);

  if (command === "help") {
    addTerminalLine("commands: help, dir, open star, probe, mimic, purge, accept");
  } else if (command === "dir") {
    addTerminalLine("notes / gallery / music / mail / diary / toybox / terminal / core");
  } else if (command === "open star") {
    secretIcon.classList.remove("hidden");
    addTerminalLine("core access path revealed.");
    increaseCorruption(1);
  } else if (command === "probe") {
    addTerminalLine("surface layer unstable. emotional shell detected.");
    increaseCorruption(1);
  } else if (command === "mimic") {
    addTerminalLine("mimic layer active. friendly mask preserved.");
    mimiText.textContent = "I can still make this cute for you";
    increaseCorruption(1);
  } else if (command === "purge") {
    addTerminalLine("purge denied. core access required.");
  } else if (command === "accept") {
    addTerminalLine("accept pending. core access required.");
  } else {
    addTerminalLine("unknown command.");
    if (corruption >= 5 && !state.firstTerminalIntrusion) {
      state.firstTerminalIntrusion = true;
      setTimeout(() => {
        addTerminalLine("I know what you were going to ask.");
        showJumpscare();
      }, 500);
    }
  }

  terminalInput.value = "";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playSequence() {
  if (isSequencePlaying) return;
  isSequencePlaying = true;
  playerSequence = [];
  toyStatus.textContent = "Watch carefully.";

  sequence = [1, 3, 2, 4];

  for (const item of sequence) {
    const btn = document.querySelector(`.toy-btn[data-tone="${item}"]`);
    btn.classList.add("active");
    playToyTone(item);
    await delay(450);
    btn.classList.remove("active");
    await delay(180);
  }

  toyStatus.textContent = "Now repeat it.";
  isSequencePlaying = false;
}

function playToyTone(n) {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  const freqs = { 1: 520, 2: 620, 3: 720, 4: 820 };
  oscillator.frequency.value = corruption >= 7 ? freqs[n] - 180 : freqs[n];
  oscillator.type = corruption >= 7 ? "triangle" : "sine";

  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.03, context.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.22);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.22);
}

function handleToyInput(value) {
  if (isSequencePlaying || sequence.length === 0 || state.gameFinished) return;

  playerSequence.push(Number(value));
  playToyTone(Number(value));

  const currentIndex = playerSequence.length - 1;
  if (playerSequence[currentIndex] !== sequence[currentIndex]) {
    toyStatus.textContent = "Wrong sequence.";
    playerSequence = [];
    mimiText.textContent = "that was not how I showed it";
    increaseCorruption(1);
    glitchDesktop();
    return;
  }

  if (playerSequence.length === sequence.length) {
    toyStatus.textContent = "Sequence complete. Core icon revealed.";
    sequenceUnlocked = true;
    secretIcon.classList.remove("hidden");
    mimiText.textContent = "good. you listened ♡";
    increaseCorruption(1);
  }
}

function showEnding(type) {
  state.gameFinished = true;
  closeAllWindows();
  hideTerminalEvent();
  endingScreen.classList.remove("hidden");

  if (type === "purge") {
    endingTitle.textContent = "ENDING — PURGE";
    endingDesc.textContent = "You force a hard deletion through the shell. Mimi disappears, but the last red cursor blink suggests something survived outside the layer you could see.";
  } else if (type === "contain") {
    endingTitle.textContent = "ENDING — CONTAIN";
    endingDesc.textContent = "You lock the core under black glass. The system stops moving. It looks dead. It still feels aware.";
  } else {
    endingTitle.textContent = "ENDING — ACCEPT";
    endingDesc.textContent = "You stop resisting. The interface softens for one last second, then folds into black and red. The shell stays lovely. You stay inside it.";
  }
}

function resetGame() {
  window.location.reload();
}

function makeDraggable(win) {
  const handle = win.querySelector(".drag-handle");
  if (!handle) return;

  let active = false;
  let offsetX = 0;
  let offsetY = 0;

  const start = (clientX, clientY) => {
    active = true;
    bringToFront(win);
    const rect = win.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
  };

  const move = (clientX, clientY) => {
    if (!active || window.innerWidth <= 820) return;
    win.style.left = `${clientX - offsetX}px`;
    win.style.top = `${clientY - offsetY}px`;
  };

  const stop = () => {
    active = false;
  };

  handle.addEventListener("mousedown", (e) => start(e.clientX, e.clientY));
  document.addEventListener("mousemove", (e) => move(e.clientX, e.clientY));
  document.addEventListener("mouseup", stop);

  handle.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    start(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (t) move(t.clientX, t.clientY);
  }, { passive: true });

  document.addEventListener("touchend", stop);
}

enterBtn.addEventListener("click", () => {
  bootScreen.classList.add("hidden");
  game.classList.remove("hidden");

  const initialWindows = document.querySelectorAll(".window");
  initialWindows.forEach((w, i) => {
    w.style.left = `${30 + (i % 3) * 70}px`;
    w.style.top = `${95 + (i % 3) * 30}px`;
    makeDraggable(w);
  });

  setTimeout(() => {
    mimiText.textContent = "everything is okay ♡";
  }, 700);

  setTimeout(() => {
    mimiText.textContent = "click anything you like ♡";
  }, 1800);
});

icons.forEach((icon) => {
  icon.addEventListener("click", () => {
    openWindow(icon.dataset.window);
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.close;
    const target = document.getElementById(targetId);
    if (target) target.classList.add("hidden");

    if (corruption >= 6) {
      mimiText.textContent = "some files cry when you close them";
    } else {
      mimiText.textContent = "closed gently ♡";
    }
  });
});

unlockSecretBtn.addEventListener("click", unlockCore);
musicBtn.addEventListener("click", playSoftBeep);
startSequenceBtn.addEventListener("click", playSequence);

toyButtons.forEach((btn) => {
  btn.addEventListener("click", () => handleToyInput(btn.dataset.tone));
});

terminalSend.addEventListener("click", () => handleTerminalCommand(terminalInput.value));
terminalInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleTerminalCommand(terminalInput.value);
});

terminalClose.addEventListener("click", () => {
  hideTerminalEvent();

  if (corruption < 7) {
    increaseCorruption(1);
    mimiText.textContent = "you opened me for a reason";
    glitchDesktop();
  } else {
    mimiText.textContent = "there is no cute layer left";
  }
});

endingChoiceButtons.forEach((btn) => {
  btn.addEventListener("click", () => showEnding(btn.dataset.ending));
});

restartBtn.addEventListener("click", resetGame);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllWindows();
    hideTerminalEvent();
    flashJumpscare.classList.add("hidden");
  }
});

setInterval(() => {
  if (bootScreen.classList.contains("hidden") && !state.gameFinished) {
    if (corruption < 3) {
      if (Math.random() < 0.4) setMimiLine(mimiLines.start);
    } else if (corruption < 7) {
      if (Math.random() < 0.5) setMimiLine(mimiLines.mid);
    } else {
      if (Math.random() < 0.65) setMimiLine(mimiLines.late);
    }
  }
}, 6500);

setInterval(() => {
  if (
    bootScreen.classList.contains("hidden") &&
    corruption >= 5 &&
    !state.gameFinished &&
    Math.random() < 0.35
  ) {
    glitchDesktop();
  }
}, 9000);
