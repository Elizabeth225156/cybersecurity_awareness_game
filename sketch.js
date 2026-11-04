//patch the system game — simple version
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

// Each question is scenario text + 3 plain choice buttons
const QUESTIONS = [
  {
    scenario: 'Your browser shows: "A security update is available." What do you do?',
    choices: [
      { label: "Open the browser's official Settings and install it", correct: true,
        feedback: "Correct! Browser settings route you to a verified update signed by the vendor, so you know it's genuine." },
      { label: "Ignore the notification and keep browsing", correct: false,
        feedback: "Risky! Delaying updates leaves a known, published vulnerability open for attackers to exploit." },
      { label: "Click a pop-up and download the update", correct: false,
        feedback: "Risky! Fake update pop-ups are a top way attackers deliver malware disguised as real software." }
    ]
  },
  {
    scenario: 'Your computer asks: "Turn on automatic updates?"',
    choices: [
      { label: "Turn them on", correct: true,
        feedback: "Correct! Automatic updates install patches the moment they're released, often within hours of discovery." },
      { label: "Turn them off, I'll remember later", correct: false,
        feedback: "Risky! Most breaches exploit flaws that already had a patch available — 'later' rarely happens." },
      { label: "Click a 'boost your PC' pop-up instead", correct: false,
        feedback: "Risky! Unrelated 'boost' pop-ups are almost always scams or adware, not real optimization tools." }
    ]
  },
  {
    scenario: 'Your antivirus shows: "Virus definitions are 45 days old."',
    choices: [
      { label: "Update it from the official antivirus app", correct: true,
        feedback: "Correct! Antivirus relies on a signature database — updating it daily is what catches brand-new threats." },
      { label: "Ignore the warning", correct: false,
        feedback: "Risky! Outdated antivirus can't recognize malware released after its last update — barely better than none." },
      { label: "Download a 'free booster' from a pop-up", correct: false,
        feedback: "Risky! Fake 'booster' tools are a classic malware disguise, sometimes even posing as antivirus itself." }
    ]
  }
];

let gameState = "TITLE"; // TITLE, BRIEFING, QUESTION, FEEDBACK, RESULTS
let score = 0;
let questionIndex = 0;
let pickedChoice = -1;

function setup() {
  createCanvas(900, 600);
  textAlign(CENTER, CENTER);
}

function draw() {
  drawBackground();

  if (gameState === "TITLE") drawTitle();
  else if (gameState === "BRIEFING") drawBriefing();
  else if (gameState === "QUESTION") drawQuestion();
  else if (gameState === "FEEDBACK") drawFeedback();
  else if (gameState === "RESULTS") drawResults();
}

function drawBackground() {
  background(PALETTE.bgNavy);
  stroke(PALETTE.gridLines);
  strokeWeight(1);
  for (let x = 0; x < width; x += 40) line(x, 0, x, height);
  for (let y = 0; y < height; y += 40) line(0, y, width, y);
}

function drawTitle() {
  noStroke();
  fill(PALETTE.textWhite);
  textSize(34);
  text("PATCH THE SYSTEM", width / 2, 140);

  fill(PALETTE.textIceBlue);
  textSize(14);
  text("Patch vulnerabilities. Protect your system.", width / 2, 175);

  fill(PALETTE.textYellow);
  textSize(12);
  text("2026 THEME: DON'T MAKE IT EASY FOR THEM", width / 2, 196);

  drawShield(width / 2, 300, 70);

  textSize(13);
  fill(PALETTE.textIceBlue);
  text("A simulation where you secure a computer through 3 real-world choices.", width / 2, 390);

  drawButton(width / 2 - 100, 430, 200, 50, "START MISSION");
}

function drawShield(cx, cy, s) {
  stroke(PALETTE.cardBorder);
  strokeWeight(3);
  noFill();
  beginShape();
  vertex(cx, cy - s * 0.55);
  vertex(cx + s * 0.4, cy - s * 0.35);
  vertex(cx + s * 0.4, cy + s * 0.1);
  bezierVertex(cx + s * 0.4, cy + s * 0.45, cx + s * 0.15, cy + s * 0.6, cx, cy + s * 0.6);
  bezierVertex(cx - s * 0.15, cy + s * 0.6, cx - s * 0.4, cy + s * 0.45, cx - s * 0.4, cy + s * 0.1);
  vertex(cx - s * 0.4, cy - s * 0.35);
  endShape(CLOSE);

  strokeWeight(4);
  line(cx - s * 0.18, cy, cx - s * 0.04, cy + s * 0.14);
  line(cx - s * 0.04, cy + s * 0.14, cx + s * 0.2, cy - s * 0.12);
}

function drawBriefing() {
  drawCard(150, 150, 600, 250);

  fill(PALETTE.textYellow);
  textSize(22);
  text("3 SECURITY VULNERABILITIES DETECTED", 180, 205, 540);

  fill(PALETTE.textIceBlue);
  textSize(14);
  text("Browser Updates  ·  Auto-Update Settings  ·  Antivirus Software", width / 2, 250);

  textSize(13);
  text("For each one, pick the safest action — watch out for flashy pop-ups.", 200, 280, 500);

  drawButton(width / 2 - 90, 340, 180, 50, "BEGIN");
}

function drawQuestion() {
  const q = QUESTIONS[questionIndex];

  fill(PALETTE.textIceBlue);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(13);
  text("Question " + (questionIndex + 1) + " of " + QUESTIONS.length, 150, 60);
  textAlign(RIGHT, CENTER);
  text("Score: " + score, 750, 60);
  textAlign(CENTER, CENTER);

  fill(PALETTE.textWhite);
  textSize(16);
  text(q.scenario, 150, 120, 600);

  for (let i = 0; i < q.choices.length; i++) {
    drawChoiceCard(150, 180 + i * 90, 600, 70, q.choices[i].label);
  }
}

function drawChoiceCard(x, y, w, h, label) {
  const hovering = pointInRect(mouseX, mouseY, x, y, w, h);
  stroke(PALETTE.cardBorder);
  strokeWeight(1.5);
  fill(hovering ? PALETTE.btnCardHover : PALETTE.btnCardBg);
  rect(x, y, w, h, 10);

  noStroke();
  fill(PALETTE.textWhite);
  textAlign(LEFT, CENTER);
  textSize(14);
  text(label, x + 20, y + h / 2, w - 40);
  textAlign(CENTER, CENTER);
}

function drawFeedback() {
  const q = QUESTIONS[questionIndex];
  const choice = q.choices[pickedChoice];

  fill(choice.correct ? PALETTE.btnMint : PALETTE.textYellow);
  noStroke();
  textSize(22);
  text(choice.correct ? "Correct!" : "Not Quite", width / 2, 220);

  fill(PALETTE.textIceBlue);
  textSize(14);
  text(choice.feedback, 150, 270, 600);

  drawButton(width / 2 - 100, 380, 200, 50, "CONTINUE");
}

function drawResults() {
  drawCard(150, 100, 600, 360);

  fill(PALETTE.btnMint);
  noStroke();
  textSize(28);
  text("SYSTEM SECURED!", width / 2, 160);

  fill(PALETTE.textIceBlue);
  textSize(16);
  text("Final Score: " + score + " / " + QUESTIONS.length * 10, width / 2, 210);

  fill(PALETTE.textYellow);
  textSize(18);
  text(getRank(), width / 2, 250);

  fill(PALETTE.textIceBlue);
  textSize(13);
  text("Install updates promptly · Enable auto-updates · Keep antivirus current", 200, 300, 500);

  fill(PALETTE.textYellow);
  textSize(13);
  text("Remember: don't make it easy for them.", width / 2, 325);

  drawButton(width / 2 - 100, 360, 200, 50, "PLAY AGAIN");
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

function mousePressed() {
  if (gameState === "TITLE") {
    if (pointInRect(mouseX, mouseY, width / 2 - 100, 430, 200, 50)) {
      gameState = "BRIEFING";
    }

  } else if (gameState === "BRIEFING") {
    if (pointInRect(mouseX, mouseY, width / 2 - 90, 340, 180, 50)) {
      gameState = "QUESTION";
    }

  } else if (gameState === "QUESTION") {
    const q = QUESTIONS[questionIndex];
    for (let i = 0; i < q.choices.length; i++) {
      if (pointInRect(mouseX, mouseY, 150, 180 + i * 90, 600, 70)) {
        pickedChoice = i;
        if (q.choices[i].correct) score += 10;
        gameState = "FEEDBACK";
      }
    }

  } else if (gameState === "FEEDBACK") {
    if (pointInRect(mouseX, mouseY, width / 2 - 100, 380, 200, 50)) {
      questionIndex++;
      pickedChoice = -1;
      gameState = questionIndex >= QUESTIONS.length ? "RESULTS" : "QUESTION";
    }

  } else if (gameState === "RESULTS") {
    if (pointInRect(mouseX, mouseY, width / 2 - 100, 360, 200, 50)) {
      gameState = "TITLE";
      score = 0;
      questionIndex = 0;
      pickedChoice = -1;
    }
  }
}
