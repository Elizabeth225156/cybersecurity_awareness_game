//patch the system game
const PALETTE = {
  bgNavy:       "#061024", // Canvas background
  gridLines:    "#0f2247", // Background grid lines
  cardNavy:     "#0a1936", // Main card inner fill
  cardBorder:   "#00a8eb", // Glowing cyan card outline
  textWhite:    "#ffffff", // Main headings and button text
  textIceBlue:  "#e0f2fe", // Subtitles and body text
  textYellow:   "#ffcc00", // Sender warnings and highlight tags
  btnMint:      "#2ecc71", // Primary action button (Start/Continue)
  btnMintHover: "#27ae60", // Primary button hover state
  btnCardBg:    "#071228", // Scenario choice button background
  btnCardHover: "#0e2246"  // Scenario choice button hover state
};

// The monitor's screen
const SCREEN_BG   = "#f4f6f8";
const SCREEN_BAR   = "#e4e7eb";
const SCREEN_TEXT  = "#20262e";
const SCREEN_MUTED = "#6b7280";

// Every question uses a settings row near the top, and one pop-up lower down that holds both its flashy buttonand its small dismiss link
const QUESTIONS = [
  {
    app: "yourbrowser.com",
    official: { label: "⚙  Open Browser Settings",
      feedback: "Correct! Browser settings route you to a verified update signed by the vendor, so you know it's genuine." },
    popup: {
      header: "⚠ SpeedUpdate Pro",
      button: { label: "DOWNLOAD UPDATE NOW",
        feedback: "Risky! Fake update pop-ups are a top way attackers deliver malware disguised as real software." },
      dismiss: { label: "No thanks, I'll wait",
        feedback: "Risky! Delaying updates leaves a known, published vulnerability open for attackers to exploit." }
    }
  },
  {
    app: "System Settings",
    official: { label: "🔄  Turn On Automatic Updates",
      feedback: "Correct! Automatic updates install patches the moment they're released, often within hours of discovery." },
    popup: {
      header: "🚀 Boost Your PC!",
      button: { label: "CLICK HERE",
        feedback: "Risky! Unrelated 'boost' pop-ups are almost always scams or adware, not real optimization tools." },
      dismiss: { label: "Remind me later",
        feedback: "Risky! Most breaches exploit flaws that already had a patch available — 'later' rarely happens." }
    }
  },
  {
    app: "Antivirus Shield",
    official: { label: "🛡  Update Virus Definitions",
      feedback: "Correct! Antivirus relies on a signature database — updating it daily is what catches brand-new threats." },
    popup: {
      header: "🎁 FREE Antivirus Boost!",
      button: { label: "CLICK HERE",
        feedback: "Risky! Fake 'booster' tools are a classic malware disguise, sometimes even posing as antivirus itself." },
      dismiss: { label: "Ignore warning",
        feedback: "Risky! Outdated antivirus can't recognize malware released after its last update — barely better than none." }
    }
  }
];

// the monitor frame, shared by every question
const MON    = { x: 90, y: 50, w: 720, h: 420 };
const SCREEN = { x: 108, y: 68, w: 684, h: 384 };
const BAR_H  = 32;

// the two interactive groups on screen, same position for every question
const OFFICIAL_ROW  = { x: SCREEN.x, y: SCREEN.y + BAR_H, w: SCREEN.w, h: 56 };
const POPUP         = { x: 290, y: 176, w: 320, h: 150 };
const POPUP_BTN     = { x: POPUP.x + 16, y: POPUP.y + 46, w: 288, h: 46 };
const POPUP_DISMISS = { x: POPUP.x + 16, y: POPUP.y + 102, w: 288, h: 26 };

let gameState = "TITLE"; // TITLE, BRIEFING, QUESTION, FEEDBACK, RESULTS
let score = 0;
let questionIndex = 0;
let pickedChoice = -1;   // index into currentChoices()
let teenImg;

function preload() {
  teenImg = loadImage("teen.svg");
}

function setup() {
  createCanvas(900, 600);
  textAlign(CENTER, CENTER);
}

function draw() {
  drawBackground();

  if (gameState === "TITLE") drawTitle();
  else if (gameState === "BRIEFING") drawBriefing();
  else if (gameState === "QUESTION") drawComputer(false);
  else if (gameState === "FEEDBACK") drawComputer(true);
  else if (gameState === "RESULTS") drawResults();
}

//bg
function drawBackground() {
  background(PALETTE.bgNavy);
  stroke(PALETTE.gridLines);
  strokeWeight(1);
  for (let x = 0; x < width; x += 40) line(x, 0, x, height);
  for (let y = 0; y < height; y += 40) line(0, y, width, y);
}

// title screen
function drawTitle() {
  noStroke();
  fill(PALETTE.textWhite);
  textSize(34);
  text("PATCH THE SYSTEM", width / 2, 60);

  fill(PALETTE.textIceBlue);
  textSize(14);
  text("Patch vulnerabilities. Protect your system.", width / 2, 95);

  fill(PALETTE.textYellow);
  textSize(12);
  text("2026 THEME: DON'T MAKE IT EASY FOR THEM", width / 2, 116);

  const imgX = (width - 260) / 2, imgY = 128, imgW = 260, imgH = 215;
  image(teenImg, imgX, imgY, imgW, imgH);
  cursor(pointInRect(mouseX, mouseY, imgX, imgY, imgW, imgH) ? HAND : ARROW);

  textSize(14);
  fill(PALETTE.textIceBlue);
  text("Click the computer to begin.", width / 2, 390);
}

// instructions screen
function drawBriefing() {
  drawCard(150, 150, 600, 250);

  fill(PALETTE.textYellow);
  textSize(22);
  text("3 SECURITY VULNERABILITIES DETECTED", 180, 205, 540);

  fill(PALETTE.textIceBlue);
  textSize(14);
  text("Browser Updates  ·  Auto-Update Settings  ·  Antivirus Software", width / 2, 250);

  textSize(13);
  text("For each one, click the right thing on screen — don't fall for flashy pop-ups or just ignore the warning.", 200, 275, 500);

  drawButton(width / 2 - 90, 340, 180, 50, "BEGIN");
}

// act comp screen
function drawComputer(revealed) {
  const q = QUESTIONS[questionIndex];
  const choices = currentChoices(q);

  drawTopHUD();

  // monitor stand
  stroke(PALETTE.cardBorder);
  strokeWeight(3);
  fill("#0a1322");
  rect(MON.x, MON.y, MON.w, MON.h, 18);
  noStroke();
  fill("#0a1322");
  rect(430, MON.y + MON.h, 40, 20);
  rect(370, MON.y + MON.h + 20, 160, 12, 5);

  // the actual screen
  fill(SCREEN_BG);
  rect(SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, 6);

  // app title bar
  fill(SCREEN_BAR);
  rect(SCREEN.x, SCREEN.y, SCREEN.w, BAR_H, 6, 6, 0, 0);
  fill(SCREEN_MUTED);
  circle(SCREEN.x + 16, SCREEN.y + 16, 8);
  circle(SCREEN.x + 32, SCREEN.y + 16, 8);
  circle(SCREEN.x + 48, SCREEN.y + 16, 8);
  fill(SCREEN_TEXT);
  textSize(13);
  text(q.app, SCREEN.x + SCREEN.w / 2 + 10, SCREEN.y + 16);

  // the one settings row (the safe choice)
  drawRowButton(OFFICIAL_ROW, choices[0], revealed && pickedChoice === 0);

  // the one pop-up (risky button and dismiss)
  drawPopup(q.popup, choices[1], choices[2], revealed);

  if (revealed) drawFeedbackPanel(choices[pickedChoice]);
}

function currentChoices(q) {
  return [
    { label: q.official.label, correct: true, feedback: q.official.feedback },
    { label: q.popup.button.label, correct: false, feedback: q.popup.button.feedback },
    { label: q.popup.dismiss.label, correct: false, feedback: q.popup.dismiss.feedback }
  ];
}

function drawRowButton(r, choice, picked) {
  const hovering = !picked && pointInRect(mouseX, mouseY, r.x, r.y, r.w, r.h);
  stroke(picked ? PALETTE.btnMint : SCREEN_MUTED);
  strokeWeight(picked ? 3 : 1.5);
  fill(hovering ? "#dce7f2" : "#ffffff");
  rect(r.x, r.y, r.w, r.h, 6);

  noStroke();
  fill(SCREEN_TEXT);
  textSize(15);
  textAlign(LEFT, CENTER);
  text(choice.label, r.x + 20, r.y + r.h / 2);
  textAlign(CENTER, CENTER);

  if (picked) {
    fill(PALETTE.btnMint);
    textSize(18);
    text("✓", r.x + r.w - 26, r.y + r.h / 2);
  }
}

function drawPopup(popupData, btnChoice, dismissChoice, revealed) {
  const btnPicked = revealed && pickedChoice === 1;
  const dismissPicked = revealed && pickedChoice === 2;

  stroke(PALETTE.textYellow);
  strokeWeight(2);
  fill("#fffaf0");
  rect(POPUP.x, POPUP.y, POPUP.w, POPUP.h, 10);

  noStroke();
  fill(SCREEN_TEXT);
  textAlign(LEFT, TOP);
  textSize(13);
  text(popupData.header, POPUP.x + 16, POPUP.y + 12);
  textAlign(CENTER, CENTER);

  // the flashy, risky button
  const btnHover = !revealed && pointInRect(mouseX, mouseY, POPUP_BTN.x, POPUP_BTN.y, POPUP_BTN.w, POPUP_BTN.h);
  stroke(btnPicked ? PALETTE.textYellow : "none");
  strokeWeight(btnPicked ? 3 : 0);
  fill(btnHover ? "#ffe27a" : PALETTE.textYellow);
  rect(POPUP_BTN.x, POPUP_BTN.y, POPUP_BTN.w, POPUP_BTN.h, 8);
  noStroke();
  fill(SCREEN_TEXT);
  textSize(13);
  text(btnChoice.label, POPUP_BTN.x + POPUP_BTN.w / 2, POPUP_BTN.y + POPUP_BTN.h / 2);

  // the small, easy-to-miss dismiss link
  const linkHover = !revealed && pointInRect(mouseX, mouseY, POPUP_DISMISS.x, POPUP_DISMISS.y, POPUP_DISMISS.w, POPUP_DISMISS.h);
  fill(dismissPicked ? PALETTE.textYellow : (linkHover ? SCREEN_TEXT : SCREEN_MUTED));
  textSize(12);
  text(dismissChoice.label, POPUP_DISMISS.x + POPUP_DISMISS.w / 2, POPUP_DISMISS.y + POPUP_DISMISS.h / 2);

  if (btnPicked || dismissPicked) {
    const r = btnPicked ? POPUP_BTN : POPUP_DISMISS;
    fill(PALETTE.textYellow);
    textSize(16);
    textAlign(LEFT, CENTER);
    text("✕", r.x + r.w + 6, r.y + r.h / 2);
    textAlign(CENTER, CENTER);
  }
}

function drawTopHUD() {
  noStroke();
  textAlign(LEFT, CENTER);
  fill(PALETTE.textIceBlue);
  textSize(13);
  text("Question " + (questionIndex + 1) + " of " + QUESTIONS.length, 150, 25);

  textAlign(RIGHT, CENTER);
  text("Score: " + score, 750, 25);
  textAlign(CENTER, CENTER);
}

function drawFeedbackPanel(choice) {
  fill(choice.correct ? PALETTE.btnMint : PALETTE.textYellow);
  noStroke();
  textSize(14);
  text(choice.feedback, 100, 525, 700);

  drawButton(width / 2 - 100, 552, 200, 38, "CONTINUE");
}

// results
function drawResults() {
  drawCard(150, 90, 600, 380);

  fill(PALETTE.btnMint);
  noStroke();
  textSize(26);
  text("SYSTEM SECURED!", width / 2, 140);

  fill(PALETTE.textIceBlue);
  textSize(15);
  text("Final Score: " + score + " / " + QUESTIONS.length * 10, width / 2, 180);

  fill(PALETTE.textYellow);
  textSize(17);
  text(getRank(), width / 2, 212);

  fill(PALETTE.textIceBlue);
  textSize(12);
  text("Install official updates promptly — they patch known vulnerabilities before attackers exploit them.", 190, 250, 520);
  text("Turn on automatic updates so protection applies the moment a patch is released.", 190, 282, 520);
  text("Keep antivirus definitions current — outdated software can't catch new threats.", 190, 310, 520);

  fill(PALETTE.textYellow);
  textSize(13);
  text("Remember: don't make it easy for them.", width / 2, 350);

  drawButton(width / 2 - 100, 390, 200, 50, "PLAY AGAIN");
}

function getRank() {
  if (score === QUESTIONS.length * 10) return "GOLD DEFENDER";
  if (score >= 10) return "SILVER DEFENDER";
  return "BRONZE DEFENDER";
}

function drawCard(x, y, w, h) {
  stroke(PALETTE.cardBorder);
  strokeWeight(2);
  fill(PALETTE.cardNavy);
  rect(x, y, w, h, 14);
}

function drawButton(x, y, w, h, label) {
  const hovering = pointInRect(mouseX, mouseY, x, y, w, h);
  noStroke();
  fill(hovering ? PALETTE.btnMintHover : PALETTE.btnMint);
  rect(x, y, w, h, 10);

  fill(PALETTE.bgNavy);
  textSize(16);
  text(label, x + w / 2, y + h / 2);
}

function pointInRect(px, py, x, y, w, h) {
  return px > x && px < x + w && py > y && py < y + h;
}

// ---------- input ----------
function mousePressed() {
  if (gameState === "TITLE") {
    if (pointInRect(mouseX, mouseY, (width - 260) / 2, 128, 260, 215)) {
      gameState = "BRIEFING";
    }

  } else if (gameState === "BRIEFING") {
    if (pointInRect(mouseX, mouseY, width / 2 - 90, 340, 180, 50)) {
      gameState = "QUESTION";
    }

  } else if (gameState === "QUESTION") {
    const rects = [OFFICIAL_ROW, POPUP_BTN, POPUP_DISMISS];
    for (let i = 0; i < rects.length; i++) {
      if (pointInRect(mouseX, mouseY, rects[i].x, rects[i].y, rects[i].w, rects[i].h)) {
        pickedChoice = i;
        if (i === 0) score += 10;
        gameState = "FEEDBACK";
      }
    }

  } else if (gameState === "FEEDBACK") {
    if (pointInRect(mouseX, mouseY, width / 2 - 100, 552, 200, 38)) {
      questionIndex++;
      pickedChoice = -1;
      gameState = questionIndex >= QUESTIONS.length ? "RESULTS" : "QUESTION";
    }

  } else if (gameState === "RESULTS") {
    if (pointInRect(mouseX, mouseY, width / 2 - 100, 390, 200, 50)) {
      gameState = "TITLE";
      score = 0;
      questionIndex = 0;
      pickedChoice = -1;
    }
  }
}
