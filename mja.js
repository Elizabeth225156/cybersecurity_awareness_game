//Elizabeth
const PALETTE = {
  bgNavy:      "#061024",
  gridLines:   "#0f2247",
  cardNavy:    "#0a1936",
  cardBorder:  "#00a8eb",
  textWhite:   "#ffffff",
  textIceBlue: "#e0f2fe",
  textYellow:  "#ffcc00",
  btnMint:     "#2ecc71",
  btnMintHover:"#27ae60",
  btnCardBg:   "#071228",
  btnCardHover:"#0e2246"
};

let state = "title";        // title, menu, login, done, verdict, result
let acct = "none";          // "none" (no MFA) or "mfa"
let step = 0;               // login steps: 0 ready, 1 password, 2 send code, 3 enter code
let typed = "";
let msg = "";
let target = "";            // password to type
let code = "";              // 6-digit code on the phone
let phoneOpen = false;
let startMs = 0;
let finalTime = 0;
let newBest = false;
let fastest = { none: null, mfa: null };   // resets when the game restarts

let verdict = null;         // "yes" or "no"
let resultType = "";        // "win", "lose", "retry"

const PASSWORDS = ["Blue7Sky", "Tiger42", "Maple9Leaf", "Rocket88", "Pixel25"];

const FACTS = [
  { text: "A faster login always means a safer account",       good: false },
  { text: "MFA makes access harder for others, but protects users", good: true },
  { text: "A password alone is enough to prove who you are",    good: false },
  { text: "Don't share your codes with other people",           good: true },
  { text: "MFA uses multiple sources to double-check the user", good: true }
];
let picked = [false, false, false, false, false];

let buttons = [];           // clickable buttons, rebuilt every frame

function setup() {
  createCanvas(800, 520);
  textAlign(CENTER, CENTER);
}

function draw() {
  buttons = [];
  drawGridBackground();
  drawHeader("MULTI-FACTOR AUTHENTICATION", getSubtitle(), getProgress());
  drawMainCard();

  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  if (state === "title") drawTitle();
  else if (state === "menu") drawMenu();
  else if (state === "login") drawLogin();
  else if (state === "done") drawDone();
  else if (state === "verdict") drawVerdict();
  else if (state === "result") drawResult();
}

function getSubtitle() {
  if (state === "verdict" || state === "result") return "GIVE YOUR ANSWER";
  return "GET THE FASTEST TIME";
}

function getProgress() {
  if (state === "title") return 0.0;
  if (state === "verdict") return 0.8;
  if (state === "result") return 1.0;
  let tested = (fastest.none !== null ? 1 : 0) + (fastest.mfa !== null ? 1 : 0);
  return 0.15 + 0.25 * tested;
}

function drawGridBackground() {
  background(PALETTE.bgNavy);
  stroke(PALETTE.gridLines);
  strokeWeight(1);
  for (let x = 0; x < width; x += 40) line(x, 0, x, height);
  for (let y = 0; y < height; y += 40) line(0, y, width, y);
}

function drawHeader(titleText, subtitleText, progressRatio) {
  noStroke();
  fill(PALETTE.textWhite);
  textSize(22);
  textStyle(BOLD);
  text(titleText, width / 2, 32);

  fill(PALETTE.cardBorder);
  textSize(11);
  textStyle(NORMAL);
  text(subtitleText, width / 2, 54);

  fill(PALETTE.gridLines);
  rectMode(CENTER);
  rect(width / 2, 72, 500, 8, 4);

  fill(PALETTE.cardBorder);
  rectMode(CORNER);
  let progressWidth = progressRatio * 500;
  rect(150, 68, progressWidth, 8, 4);

  rectMode(CENTER);
}

function drawMainCard() {
  stroke(PALETTE.cardBorder);
  strokeWeight(2);
  fill(PALETTE.cardNavy);
  rectMode(CENTER);
  rect(width / 2, 285, 560, 370, 16);
}

function drawPrimaryButton(cx, cy, w, h, label) {
  let isHover = mouseInRect(cx - w / 2, cy - h / 2, w, h);
  fill(isHover ? PALETTE.btnMintHover : PALETTE.btnMint);
  stroke(PALETTE.textWhite);
  strokeWeight(1);
  rectMode(CENTER);
  rect(cx, cy, w, h, 8);

  noStroke();
  fill(PALETTE.textWhite);
  textSize(14);
  textStyle(BOLD);
  text(label, cx, cy);
}

function drawChoiceButton(cx, cy, w, h, label) {
  let isHover = mouseInRect(cx - w / 2, cy - h / 2, w, h);
  fill(isHover ? PALETTE.btnCardHover : PALETTE.btnCardBg);
  stroke(PALETTE.cardBorder);
  strokeWeight(1);
  rectMode(CENTER);
  rect(cx, cy, w, h, 6);

  noStroke();
  fill(PALETTE.textWhite);
  textSize(13);
  textStyle(NORMAL);
  text(label, cx, cy);
}

function mouseInRect(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

function addButton(cx, cy, w, h, action) {
  buttons.push({ x: cx - w / 2, y: cy - h / 2, w: w, h: h, action: action });
}

function primaryBtn(cx, cy, w, h, label, action) {
  drawPrimaryButton(cx, cy, w, h, label);
  addButton(cx, cy, w, h, action);
}

function choiceBtn(cx, cy, w, h, label, action) {
  drawChoiceButton(cx, cy, w, h, label);
  addButton(cx, cy, w, h, action);
}

function drawDisabledButton(cx, cy, w, h, label) {
  fill(PALETTE.gridLines);
  stroke(PALETTE.btnCardHover);
  strokeWeight(1);
  rectMode(CENTER);
  rect(cx, cy, w, h, 8);
  noStroke();
  fill(PALETTE.cardBorder);
  textSize(14);
  textStyle(BOLD);
  text(label, cx, cy);
}

// Selectable button (verdict + fact checkboxes)
function toggleBtn(cx, cy, w, h, label, selected, hasBox, action) {
  let isHover = mouseInRect(cx - w / 2, cy - h / 2, w, h);
  fill(isHover || selected ? PALETTE.btnCardHover : PALETTE.btnCardBg);
  stroke(selected ? PALETTE.btnMint : PALETTE.cardBorder);
  strokeWeight(selected ? 3 : 1);
  rectMode(CENTER);
  rect(cx, cy, w, h, 6);

  if (hasBox) {
    stroke(PALETTE.cardBorder);
    strokeWeight(1);
    fill(selected ? PALETTE.btnMint : PALETTE.btnCardBg);
    rect(cx - w / 2 + 20, cy, 14, 14, 3);
  }

  noStroke();
  fill(PALETTE.textWhite);
  textSize(13);
  textStyle(NORMAL);
  text(label, cx + (hasBox ? 10 : 0), cy);
  addButton(cx, cy, w, h, action);
}

function cardTitle(str, y, col) {
  noStroke();
  fill(col || PALETTE.textWhite);
  textSize(20);
  textStyle(BOLD);
  text(str, width / 2, y);
}

function tagText(str, y) {
  noStroke();
  fill(PALETTE.textYellow);
  textSize(11);
  textStyle(BOLD);
  text(str, width / 2, y);
}

function bodyText(str, y, size, h, col, x, w) {
  noStroke();
  fill(col || PALETTE.textIceBlue);
  textSize(size || 13);
  textStyle(NORMAL);
  rectMode(CENTER);
  text(str, x || width / 2, y, w || 480, h || 40);
}

function inputBox(cx, cy, w, h, str) {
  stroke(PALETTE.cardBorder);
  strokeWeight(2);
  fill(PALETTE.bgNavy);
  rectMode(CENTER);
  rect(cx, cy, w, h, 6);
  noStroke();
  fill(PALETTE.textWhite);
  textSize(18);
  textStyle(NORMAL);
  text(str + (frameCount % 60 < 30 ? "|" : ""), cx, cy);
}

function fmt(t) {
  return t === null ? "--" : nf(t, 1, 2) + "s";
}

function drawTitle() {
  cardTitle("IS MFA WORTH IT?", 145);
  bodyText("A company wants to know if it should require multi-factor authentication (MFA) when people log in.", 210, 14, 60);
  bodyText("Your job: race to log in to two accounts, one without MFA and one with MFA. Then give the company your answer.", 280, 14, 60);
  bodyText("Beat your fastest time on each account!", 338, 13, 24, PALETTE.textYellow);
  primaryBtn(width / 2, 395, 200, 44, "PLAY", () => { state = "menu"; });
}

function drawMenu() {
  cardTitle("TEST THE ACCOUNTS", 135);
  bodyText("Log in as fast as you can. Run each test as many times as you like to beat your fastest time.", 185, 13, 44);
  choiceBtn(width / 2, 245, 460, 36, "WITHOUT MFA   |   Fastest: " + fmt(fastest.none), () => startLogin("none"));
  choiceBtn(width / 2, 300, 460, 36, "WITH MFA   |   Fastest: " + fmt(fastest.mfa), () => startLogin("mfa"));

  if (fastest.none !== null && fastest.mfa !== null) {
    primaryBtn(width / 2, 385, 260, 44, "GIVE YOUR ANSWER", () => {
      state = "verdict";
      verdict = null;
      picked = [false, false, false, false, false];
    });
  } else {
    drawDisabledButton(width / 2, 385, 260, 44, "GIVE YOUR ANSWER");
    bodyText("Test both accounts first", 428, 12, 24, PALETTE.textYellow);
  }
}

function startLogin(a) {
  acct = a;
  state = "login";
  step = 0;
  typed = "";
  msg = "";
  phoneOpen = false;
}

function beginRun() {
  step = 1;
  typed = "";
  msg = "";
  phoneOpen = false;
  target = random(PASSWORDS);
  code = String(floor(random(100000, 1000000)));
  startMs = millis();
}

function submitPassword() {
  if (typed === target) {
    if (acct === "none") {
      finishRun();
    } else {
      step = 2;
      typed = "";
      msg = "";
    }
  } else {
    msg = "Wrong password. Try again.";
    typed = "";
  }
}

function sendCode() {
  step = 3;
  typed = "";
  msg = "";
}

function submitCode() {
  if (typed === code) {
    finishRun();
  } else {
    msg = "Wrong code. Check your phone.";
    typed = "";
  }
}

function finishRun() {
  finalTime = (millis() - startMs) / 1000;
  newBest = fastest[acct] === null || finalTime < fastest[acct];
  if (newBest) fastest[acct] = finalTime;
  state = "done";
}

function drawLogin() {
  cardTitle("SIGN IN TO THE ACCOUNT", 135);
  tagText(acct === "mfa" ? "WITH MFA" : "WITHOUT MFA", 160);

  if (step === 0) {
    let info = acct === "mfa"
      ? "Type the password, send the code, open your phone, then type the code from the phone.\n\nThe timer starts when you press START."
      : "Type the password, then press SIGN IN.\n\nThe timer starts when you press START.";
    bodyText(info, 245, 14, 100);
    primaryBtn(width / 2, 385, 200, 44, "START", beginRun);
    choiceBtn(width / 2, 435, 160, 30, "BACK", () => { state = "menu"; });
    return;
  }

  // Timer
  let elapsed = (millis() - startMs) / 1000;
  noStroke();
  fill(PALETTE.textIceBlue);
  textSize(16);
  textStyle(BOLD);
  text("TIME  " + nf(elapsed, 1, 2) + "s", width / 2, 188);

  if (step === 1) {
    bodyText("Type this password:", 225, 13, 24);
    noStroke();
    fill(PALETTE.textYellow);
    textSize(24);
    textStyle(BOLD);
    text(target, width / 2, 255);
    inputBox(width / 2, 305, 320, 44, typed);
    bodyText(msg, 343, 12, 20, PALETTE.textYellow);
    primaryBtn(width / 2, 395, 200, 44, "SIGN IN", submitPassword);
  } else if (step === 2) {
    bodyText("Password accepted! Now verify it's you with a code.", 235, 14, 30);
    bodyText("The code will be sent to your phone.", 268, 13, 24);
    primaryBtn(width / 2, 340, 220, 44, "SEND CODE", sendCode);
  } else if (step === 3) {
    drawPhone(240, 305);
    if (!phoneOpen) {
      choiceBtn(240, 432, 150, 30, "OPEN PHONE", () => { phoneOpen = true; });
    }
    bodyText("Type the code from your phone:", 240, 13, 40, PALETTE.textIceBlue, 520, 200);
    inputBox(520, 292, 200, 44, typed);
    primaryBtn(520, 352, 160, 40, "VERIFY", submitCode);
    bodyText(msg, 395, 12, 30, PALETTE.textYellow, 520, 200);
  }
}

function drawPhone(cx, cy) {
  stroke(PALETTE.textIceBlue);
  strokeWeight(3);
  fill(PALETTE.btnCardBg);
  rectMode(CENTER);
  rect(cx, cy, 120, 180, 16);

  noStroke();
  fill(phoneOpen ? PALETTE.btnCardHover : PALETTE.bgNavy);
  rect(cx, cy, 102, 156, 8);

  textStyle(NORMAL);
  if (phoneOpen) {
    fill(PALETTE.textYellow);
    textSize(9);
    textStyle(BOLD);
    text("NEW MESSAGE", cx, cy - 60);
    fill(PALETTE.textIceBlue);
    textSize(11);
    textStyle(NORMAL);
    text("Your code:", cx, cy - 36);
    fill(PALETTE.textWhite);
    textSize(22);
    textStyle(BOLD);
    text(code.slice(0, 3) + " " + code.slice(3), cx, cy - 8);
    bodyText("Never share this code with anyone", cy + 38, 9, 30, PALETTE.textYellow, cx, 90);
  } else {
    fill(PALETTE.textIceBlue);
    textSize(11);
    text("Phone locked", cx, cy);
  }
}

function drawDone() {
  cardTitle("ACCESS GRANTED", 135, PALETTE.btnMint);
  tagText(acct === "mfa" ? "WITH MFA" : "WITHOUT MFA", 160);

  noStroke();
  fill(PALETTE.textIceBlue);
  textSize(12);
  textStyle(NORMAL);
  text("YOUR TIME", width / 2, 195);
  fill(PALETTE.textWhite);
  textSize(36);
  textStyle(BOLD);
  text(nf(finalTime, 1, 2) + "s", width / 2, 230);

  if (newBest) bodyText("NEW FASTEST TIME!", 272, 14, 24, PALETTE.textYellow);
  else bodyText("Fastest so far: " + fmt(fastest[acct]), 272, 14, 24);

  let fact = acct === "mfa"
    ? "That took extra steps. MFA makes it harder for people to get into accounts, but it protects them. Don't share your codes with other people."
    : "That was quick, but anyone who learns this password could get in. There is only one thing to double-check.";
  bodyText(fact, 335, 13, 70);

  primaryBtn(width / 2, 398, 220, 44, "BACK TO TESTS", () => { state = "menu"; });
  choiceBtn(width / 2, 442, 200, 30, "RUN AGAIN", () => startLogin(acct));
}

// ---------- Verdict ----------
function drawVerdict() {
  cardTitle("GIVE THE COMPANY YOUR ANSWER", 135);
  toggleBtn(290, 172, 220, 36, "MFA IS WORTH IT", verdict === "yes", false, () => { verdict = "yes"; });
  toggleBtn(510, 172, 220, 36, "MFA IS NOT WORTH IT", verdict === "no", false, () => { verdict = "no"; });

  bodyText("Which facts support your answer?", 208, 13, 22);

  for (let i = 0; i < FACTS.length; i++) {
    let idx = i;
    toggleBtn(width / 2, 240 + i * 36, 480, 30, FACTS[i].text, picked[i], true, () => { picked[idx] = !picked[idx]; });
  }

  if (verdict !== null && picked.some(p => p)) {
    primaryBtn(width / 2, 432, 240, 40, "SUBMIT ANSWER", submitVerdict);
  } else {
    drawDisabledButton(width / 2, 432, 240, 40, "SUBMIT ANSWER");
  }
}

function submitVerdict() {
  if (verdict === "no") {
    resultType = "lose";
  } else {
    let factsRight = FACTS.every((f, i) => f.good === picked[i]);
    resultType = factsRight ? "win" : "retry";
  }
  state = "result";
}

function drawResult() {
  if (resultType === "win") {
    cardTitle("YOU WIN!", 140, PALETTE.btnMint);
    bodyText("Right answer: MFA is worth it.", 180, 15, 24, PALETTE.textWhite);

    let diff = fastest.mfa - fastest.none;
    bodyText("Fastest without MFA: " + fmt(fastest.none) + "   |   Fastest with MFA: " + fmt(fastest.mfa), 220, 13, 24, PALETTE.textYellow);
    bodyText("MFA took " + nf(abs(diff), 1, 2) + "s " + (diff >= 0 ? "longer" : "less time") + ".", 246, 13, 24);

    bodyText("MFA makes it harder for people to get into accounts, but it protects them. It requires multiple sources to double-check the user. And don't share your codes with other people.", 322, 14, 90);
    primaryBtn(width / 2, 415, 220, 44, "PLAY AGAIN", () => { state = "menu"; });
  } else if (resultType === "lose") {
    cardTitle("NOT QUITE", 140, PALETTE.textYellow);
    bodyText("MFA is slower, and your times show it. But the extra steps are the point: they make it harder for people to get into accounts, and that protects the people who own them.", 255, 14, 120);
    primaryBtn(width / 2, 395, 220, 44, "TRY AGAIN", () => {
      state = "verdict";
      verdict = null;
      picked = [false, false, false, false, false];
    });
  } else {
    cardTitle("ALMOST!", 140, PALETTE.textYellow);
    bodyText("Your answer is right, but some of the facts you picked don't support it (or you missed one). Pick only the true facts about MFA and security.", 255, 14, 100);
    primaryBtn(width / 2, 395, 220, 44, "PICK AGAIN", () => { state = "verdict"; });
  }
}

function mousePressed() {
  for (let b of buttons) {
    if (mouseInRect(b.x, b.y, b.w, b.h)) {
      b.action();
      break;
    }
  }
}

function keyTyped() {
  if (state !== "login") return;
  if (step === 1 && key.length === 1 && key !== " " && typed.length < 14) {
    typed += key;
  } else if (step === 3 && /^\d$/.test(key) && typed.length < 6) {
    typed += key;
  }
}

function keyPressed() {
  if (state !== "login") return;
  if (keyCode === BACKSPACE) {
    typed = typed.slice(0, -1);
    return false;
  }
  if (keyCode === ENTER) {
    if (step === 0) beginRun();
    else if (step === 1) submitPassword();
    else if (step === 2) sendCode();
    else if (step === 3) submitCode();
    return false;
  }
}
