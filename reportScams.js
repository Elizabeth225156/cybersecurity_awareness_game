let currentLevel = 0; // tracking what stage user is at
let score = 0; // track of correct answers
let emailClicked = false; // when player clicks fake email link
let showFeedback = false; // controls if feedback should be shown
let feedbackMessage = ""; // stores feedback text()

function setup() {
  createCanvas(800, 520);
  textAlign(CENTER, CENTER);
}

// draw function based on currentLevel value (refers to functions made)
function draw() {
  drawGridBackground();
  drawHeader();
  drawMainCard();

 // logic for this drawing function
  if (currentLevel === 0) {
    drawStartPage();
  } else if (currentLevel === 1) {
    drawScenario1Screen();
  } else if (currentLevel === 2) {
    drawScenario2Screen();
  } else if (currentLevel === 3) {
    drawScenario3Screen();
  } else if (currentLevel === 4) {
    drawFinalScoreScreen();
  }
}


// overall drawing layouts
function drawGridBackground() {
  background(6, 16, 36); 
  stroke(15, 34, 71);    
  strokeWeight(1);

  // vertical grid lines
  for (let x = 0; x < width; x += 40) {
    line(x, 0, x, height);
  }
  //horizontal grid lines
  for (let y = 0; y < height; y += 40) {
    line(0, y, width, y);
  }
}

// draws title, subtitle, and progress Bar
function drawHeader() {
  noStroke();
  
  // title
  fill(255);
  textSize(22);
  textStyle(BOLD);
  text("CYBER SCAM DETECTIVE", width / 2, 32);
  
  // subtitle
  fill(0, 168, 235);
  textSize(11);
  textStyle(NORMAL);
  text("INTERACTIVE CYBERSECURITY SIMULATION", width / 2, 54);

  // progress bar track
  fill(15, 34, 71);
  rectMode(CENTER);
  rect(width / 2, 72, 500, 8, 4);

  // progress bar fill 
  fill(0, 168, 235);
  rectMode(CORNER);
  let progressWidth = (currentLevel / 4) * 500;
  rect(150, 68, progressWidth, 8, 4);
  
  rectMode(CENTER);
}

// navy box container
function drawMainCard() {
  stroke(0, 168, 235);     
  strokeWeight(2);
  fill(10, 25, 54);        
  rectMode(CENTER);
  rect(width / 2, 285, 560, 370, 16);
}

// displays "Start Mission"
function drawStartPage() {
  noStroke();
  
  // screen title
  fill(255);
  textSize(22);
  textStyle(BOLD);
  text("BRIEF MISSION DIRECTIONS", width / 2, 145);

  // description 
  fill(224, 242, 254);
  textSize(14);
  textStyle(NORMAL);
  text("Three suspicious messages have been detected!", width / 2, 190);
  text("Investigate each one, spot the warning signs,", width / 2, 215);
  text("and protect your accounts safely.", width / 2, 240);

  // rule box 
  fill(0, 168, 235, 25);
  stroke(0, 168, 235);
  strokeWeight(1);
  rect(width / 2, 295, 460, 44, 8);
  
  // rules 
  noStroke();
  fill(0, 168, 235);
  textSize(15);
  textStyle(BOLD);
  text("MAIN RULE: Stop, Think, Verify, and Report", width / 2, 295);

  
  drawButton(width / 2, 385, 220, 48, "START MISSION", "#2ecc71");
}

// SUSPICIOUS EMAIL
function drawScenario1Screen() {
  noStroke();
  
  
  fill(46, 204, 113);
  textSize(17);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("SCENARIO 1: SUSPICIOUS EMAIL DETECTED", width / 2, 128);

  // email window frame 
  stroke(70, 90, 120);
  strokeWeight(1);
  fill(248, 249, 250);
  rect(width / 2, 230, 500, 160, 8);

  // email header bar
  fill(230, 235, 240);
  rect(width / 2, 165, 500, 30, 8, 8, 0, 0);

  
  textAlign(LEFT, CENTER);
  
  noStroke();
  fill(100, 110, 120);
  textSize(11);
  textStyle(BOLD);
  text("FROM: security-alert@acc0unt-verify-service.com", 165, 165);

  fill(217, 48, 37);
  textSize(12);
  textStyle(BOLD);
  text("SUBJECT: URGENT: Account Closure Notice", 165, 190);

  stroke(220, 225, 230);
  strokeWeight(1);
  line(160, 204, 640, 204);

  noStroke();
  fill(40, 45, 50);
  textSize(11);
  textStyle(NORMAL);
  text("Dear User, we detected unusual activity on your account.", 165, 218);
  text("Your access will be PERMANENTLY CLOSED within 24 hours.", 165, 234);

  fill(217, 48, 37);
  textStyle(BOLD);
  text("Verify ownership immediately:", 165, 252);
  
  let isLinkHover = mouseInRect(350, 245, 250, 16);
  fill(isLinkHover ? "#a50e0e" : "#d93025");
  textStyle(BOLD);
  text("http://acc0unt-verify-service.com/login", 350, 252);
  strokeWeight(1);
  line(350, 258, 595, 258);

  textAlign(CENTER, CENTER);

  noStroke();
  fill(224, 242, 254);
  textSize(13);
  textStyle(BOLD);
  text("WHAT SHOULD YOU DO?", width / 2, 335);

  drawButton(width / 2 - 130, 385, 200, 40, "REPORT SCAM", "#2ecc71");
  drawButton(width / 2 + 130, 385, 200, 40, "CLICK LINK", "#d93025");

  // incorrect warning text
  if (emailClicked && !showFeedback) {
    noStroke();
    fill(231, 76, 60);
    textSize(12);
    textStyle(BOLD);
    text("⚠️ TRAP TRIGGERED: Never click links in unexpected urgent emails!", width / 2, 280);
  }

  // successful feedback
  if (showFeedback) {
    drawFeedbackOverlay();
  }
}

// FAKE PRIZE SMS
function drawScenario2Screen() {
  noStroke();
  fill(0, 168, 235);
  textSize(17);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("SCENARIO 2: FAKE PRIZE SMS DETECTED", width / 2, 128);

  // phone mockup text
  fill(20, 30, 50);
  stroke(0, 168, 235);
  strokeWeight(1);
  rect(width / 2, 225, 460, 140, 10);

  // text content
  textAlign(LEFT, CENTER);
  noStroke();
  fill(255, 204, 0);
  textSize(12);
  textStyle(BOLD);
  text("📱 SMS FROM: 555-9821", 185, 175);

  fill(255);
  textSize(12);
  textStyle(NORMAL);
  text("CONGRATS! You won a FREE $1,000 gift card!", 185, 205);
  text("Claim your prize now by paying a small $4.99 shipping fee.", 185, 225);
  
  fill(217, 48, 37);
  textStyle(BOLD);
  text("Pay here: http://bit.ly/claim-prize-now", 185, 250);

  // buttons
  textAlign(CENTER, CENTER);
  fill(224, 242, 254);
  textSize(13);
  textStyle(BOLD);
  text("WHAT SHOULD YOU DO?", width / 2, 335);

  drawButton(width / 2 - 130, 385, 200, 40, "IGNORE & REPORT", "#2ecc71");
  drawButton(width / 2 + 130, 385, 200, 40, "PAY $4.99 FEE", "#d93025");

  if (showFeedback) {
    drawFeedbackOverlay();
  }
}

// SCAREWARE POP-UP
function drawScenario3Screen() {
  noStroke();
  fill(0, 168, 235);
  textSize(17);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("SCENARIO 3: SCAREWARE POP-UP DETECTED", width / 2, 128);

  // brower mockup box
  fill(255, 243, 205);
  stroke(255, 193, 7);
  strokeWeight(2);
  rect(width / 2, 225, 460, 140, 8);

  // alert 
  noStroke();
  fill(133, 100, 4);
  textSize(14);
  textStyle(BOLD);
  text("⚠️ SYSTEM ALERT: VIRUS DETECTED!", width / 2, 180);

  fill(40);
  textSize(12);
  textStyle(NORMAL);
  text("Your PC is infected with 5 critical threats!", width / 2, 210);
  text("Download SecurityFixer.exe immediately to remove viruses.", width / 2, 235);

  // buttons
  fill(224, 242, 254);
  textSize(13);
  textStyle(BOLD);
  text("WHAT SHOULD YOU DO?", width / 2, 335);

  drawButton(width / 2 - 130, 385, 200, 40, "CLOSE & REPORT", "#2ecc71");
  drawButton(width / 2 + 130, 385, 200, 40, "DOWNLOAD FILE", "#d93025");

  if (showFeedback) {
    drawFeedbackOverlay();
  }
}

// FINAL SCORE SCREEN
function drawFinalScoreScreen() {
  noStroke();
  fill(46, 204, 113);
  textSize(22);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("MISSION ACCOMPLISHED!", width / 2, 140);

  fill(255);
  textSize(16);
  textStyle(NORMAL);
  text("Final Score: " + score + " / 3 Scams Identified", width / 2, 175);

  fill(0, 168, 235);
  textSize(18);
  textStyle(BOLD);
  text("TITLE AWARDED: CYBER SCAM DETECTIVE", width / 2, 210);

  // tips
  fill(6, 16, 36);
  stroke(15, 34, 71);
  strokeWeight(1);
  rect(width / 2, 290, 500, 110, 8);

  noStroke();
  fill(224, 242, 254);
  textSize(12);
  textStyle(NORMAL);
  text("1. Verify sender addresses before clicking links.", width / 2, 255);
  text("2. Never pay fees or share passwords for free prizes.", width / 2, 280);
  text("3. Browser security alerts are fake, close & report them!", width / 2, 305);
  text("4. Remember the rule: STOP, THINK, VERIFY, and REPORT.", width / 2, 330);

  drawButton(width / 2, 395, 200, 44, "RESTART MISSION", "#2ecc71");
}

// FEEDBACK 
function drawFeedbackOverlay() {
  fill(6, 16, 36, 245);
  stroke(0, 168, 235);
  strokeWeight(2);
  rect(width / 2, 285, 520, 170, 12);

  noStroke();
  fill(46, 204, 113);
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("INVESTIGATION FEEDBACK", width / 2, 225);

  fill(255);
  textSize(12);
  textStyle(NORMAL);
  rectMode(CORNER);
  text(feedbackMessage, 160, 245, 480, 60);
  rectMode(CENTER);

  drawButton(width / 2, 335, 170, 36, "NEXT MISSION >", "#2ecc71");
}

// Button Drawer Helper
function drawButton(cx, cy, w, h, label, colorHex) {
  let isHover = mouseInRect(cx - w / 2, cy - h / 2, w, h);
  fill(isHover ? (colorHex === "#2ecc71" ? "#27ae60" : "#a50e0e") : colorHex);
  stroke(255);
  strokeWeight(1);
  rectMode(CENTER);
  rect(cx, cy, w, h, 8);

  noStroke();
  fill(255);
  textSize(13);
  textStyle(BOLD);
  text(label, cx, cy);
}

// mouse poition checker
function mouseInRect(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

// mouse pressed clicker
function mousePressed() {
  // LEVEL 0: Start Page
  if (currentLevel === 0) {
    if (mouseInRect(width / 2 - 110, 385 - 24, 220, 48)) {
      currentLevel = 1;
      score = 0;
      emailClicked = false;
    }
  } 
  
  // LEVEL 1: Suspicious Email
  else if (currentLevel === 1) {
    if (showFeedback) {
      if (mouseInRect(width / 2 - 85, 335 - 18, 170, 36)) {
        showFeedback = false;
        emailClicked = false;
        currentLevel = 2;
      }
    } else {
      let linkClicked = mouseInRect(350, 245, 245, 16);
      let redButtonClicked = mouseInRect(width / 2 + 130 - 100, 385 - 20, 200, 40);
      let greenButtonClicked = mouseInRect(width / 2 - 130 - 100, 385 - 20, 200, 40);

      if (linkClicked || redButtonClicked) {
        emailClicked = true;
      }

      if (greenButtonClicked) {
        score++;
        feedbackMessage = "CORRECT! You safely reported the scam! The sender domain 'acc0unt-verify-service.com' is a fake address designed to steal credentials.";
        showFeedback = true;
      }
    }
  }

  // LEVEL 2: Fake Prize SMS
  else if (currentLevel === 2) {
    if (showFeedback) {
      if (mouseInRect(width / 2 - 85, 335 - 18, 170, 36)) {
        showFeedback = false;
        currentLevel = 3;
      }
    } else {
      let greenBtn = mouseInRect(width / 2 - 130 - 100, 385 - 20, 200, 40);
      let redBtn = mouseInRect(width / 2 + 130 - 100, 385 - 20, 200, 40);

      if (greenBtn) {
        score++;
        feedbackMessage = "CORRECT! Real rewards never require upfront payments. You successfully ignored and reported the fee trap!";
        showFeedback = true;
      } else if (redBtn) {
        feedbackMessage = "DANGER! Paying 'shipping fees' for unexpected free prizes is an advance-fee scam. Always report these messages. Pay close attention!";
        showFeedback = true;
      }
    }
  }

  // LEVEL 3: Security Alert Pop-Up
  else if (currentLevel === 3) {
    if (showFeedback) {
      if (mouseInRect(width / 2 - 85, 335 - 18, 170, 36)) {
        showFeedback = false;
        currentLevel = 4;
      }
    } else {
      let greenBtn = mouseInRect(width / 2 - 130 - 100, 385 - 20, 200, 40);
      let redBtn = mouseInRect(width / 2 + 130 - 100, 385 - 20, 200, 40);

      if (greenBtn) {
        score++;
        feedbackMessage = "CORRECT! Browser pop-ups cannot scan your device for real viruses. Closing and reporting the tab is the safest move!";
        showFeedback = true;
      } else if (redBtn) {
        feedbackMessage = "DANGER! Web pop-ups warning of viruses are fake scareware designed to trick you into downloading malware.";
        showFeedback = true;
      }
    }
  }

  // LEVEL 4: Final Score Screen
  else if (currentLevel === 4) {
    if (mouseInRect(width / 2 - 100, 395 - 22, 200, 44)) {
      currentLevel = 0;
      score = 0;
    }
  }
}
