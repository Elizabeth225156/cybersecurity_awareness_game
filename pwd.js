let scene = 0;
let feedback = "";
let correct = false;
function setup() {
  createCanvas(800,550);
  textFont("Arial");
}

function draw() {
  background(9, 20, 45);
  //bg grid
  stroke(20, 60, 100);
  strokeWeight(1);

  for (let x = 0; x < 800; x += 40) {
    line(x, 0, x, 500);
  }

  for (let y = 0; y < 500; y += 40) {
    line(0, y, 800, y);
  }

  noStroke();
  textAlign(CENTER);

  //titlen for game
  fill(255);
  textStyle(BOLD);
  textSize(26);
  text("PASSWORD PROTOCOL", 400, 45);

  fill(120, 200, 255);
  textStyle(NORMAL);
  textSize(14);
  text("CYBERSECURITY TRAINING SIMULATION", 400, 72);

  //prog bar
  fill(35, 55, 85);
  rect(150, 90, 500, 8, 5);

  fill(0, 190, 255);
  rect(150, 90, 125 * scene, 8, 5);

  fill(15, 35, 70);
  stroke(0, 160, 255);
  strokeWeight(2);
  rect(140, 120, 520, 340, 18);
  noStroke();

  if (scene == 0) {
    startScreen();
  }

  if (scene == 1) {
    levelOne();
  }

  if (scene == 2) {
    levelTwo();
  }

  if (scene == 3) {
    levelThree();
  }

  if (scene == 4) {
    finishScreen();
  }
}

function button(x, y, w, h, words, color) {
  if (mouseX > x && mouseX < x + w &&
      mouseY > y && mouseY < y + h) {
    fill(20, 140, 255);
  } else {
    fill(color);
  }

  stroke(80, 200, 255);
  strokeWeight(1);
  rect(x, y, w, h, 10);
  noStroke();

  fill(255);
  textSize(15);
  textStyle(BOLD);
  text(words, x + w / 2, y + h / 2 + 5);
}

function startScreen() {
  fill(255);
  textSize(24);
  textStyle(BOLD);
  text("WELCOME, AGENT!", 400, 165);

  fill(175, 210, 235);
  textSize(16);
  textStyle(NORMAL);
  text("Your cybersecurity training starts from here.", 400, 200);

  fill(0, 195, 255);
  textSize(70);
  text("◆", 400, 300);

  fill(220);
  textSize(16);
  text("Complete all 3 challenges to safegaurd your accounts!", 400, 355);

  button(290, 385, 220, 48, "START SIMULATION", "#0755A8");
}


//lvl 1
function levelOne() {
  fill(255);
  textSize(23);
  textStyle(BOLD);
  text("LEVEL 1: STRONG PASSWORDS", 400, 165);

  fill(175, 210, 235);
  textSize(15);
  textStyle(NORMAL);
  text("Which password would be the hardest to guess?", 400, 195);

  button(250, 220, 300, 45, "Winter!2026#School", "#0755A8");
  button(250, 278, 300, 45, "vT9#qL4!mR8@pX2z", "#0755A8");
  button(250, 336, 300, 45, "IlikeCHIPOTLE!123", "#0755A8");

  showFeedback();

  if (correct == true) {
    button(315, 418, 170, 35, "NEXT LEVEL", "#168765");
  }
}

//lvl 2
function levelTwo() {
  fill(255);
  textSize(23);
  textStyle(BOLD);
  text("LEVEL 2: ACCOUNT SECURITY", 400, 165);

  fill(175, 210, 235);
  textSize(15);
  textStyle(NORMAL);
  text("Your gaming password was leaked online.", 400, 200);
  text("You use the same password for your email. What should you do?", 400, 225);

  button(200, 255, 400, 45, "Only change your gaming password", "#0755A8");

  button(200, 315, 400, 45, "Change both and make them unique", "#0755A8");

  button(200, 375, 400, 45, "Keep them because they are strong", "#0755A8");

  showFeedback();

  if (correct == true) {
    button(315, 425, 170, 30, "NEXT LEVEL", "#168765");
  }
}

//lvl 3
function levelThree() {
  fill(255);
  textSize(23);
  textStyle(BOLD);
  text("LEVEL 3: PASSWORD MANAGER", 400, 165);

  fill(175, 210, 235);
  textSize(15);
  textStyle(NORMAL);
  text("You have 10 different accounts.", 400, 195);
  text("What is the safest way to manage passwords?", 400, 220);

  button(190, 245, 420, 45, "Save all passwords in a notes app", "#0755A8");

  button(190, 305, 420, 45, "Use a manager with one master password", "#0755A8");

  button(190, 365, 420, 45, "Use one complicated password for all", "#0755A8");

  showFeedback();

  if (correct == true) {
    button(315, 425, 170, 30, "FINISH MISSION", "#168765");
  }
}

//finishh
function finishScreen() {
  fill(80, 255, 170);
  textSize(30);
  textStyle(BOLD);
  text("MISSION COMPLETE!", 400, 180);

  fill(0, 195, 255);
  textSize(80);
  text("★", 400, 290);

  fill(255);
  textSize(22);
  text("PASSWORD PROTECTOR", 400, 340);

  fill(180, 215, 240);
  textSize(15);
  textStyle(NORMAL);
  text("Strong & Unique Passwords using a Password Manager = Safer Accounts", 400, 375);

  button(285, 405, 230, 45, "RESTART SIMULATION", "#0755A8");
}

function showFeedback() {
  if (feedback != "") {
    fill(10, 25, 50);
    stroke(80, 200, 255);
    rect(155, 465, 490, 30, 8);
    noStroke();
    //color depending on right or wrong
    if (correct == true) {
      fill(80, 255, 170);
    } else {
      fill(255, 120, 140);
    }

    textStyle(NORMAL);
    textSize(13);
    textAlign(CENTER);
    text(feedback, 400, 485);
  }
}

function mousePressed() {

  //start buttin
  if (scene == 0) {
    if (mouseX > 290 && mouseX < 510 &&
        mouseY > 385 && mouseY < 433) {
      scene = 1;
      feedback = "";
      correct = false;
    }
  }

  //Level 1 feedback
  else if (scene == 1) {
    if (mouseX > 250 && mouseX < 550) {

      if (mouseY > 220 && mouseY < 265) {
        feedback = "Predictable words and dates are easier to guess!";
        correct = false;
      }

      if (mouseY > 278 && mouseY < 323) {
        feedback = "Correct! This password is long and random.";
        correct = true;
      }

      if (mouseY > 336 && mouseY < 381) {
        feedback = "Personal information can make passwords weaker!";
        correct = false;
      }
    }

    if (correct == true &&
        mouseX > 315 && mouseX < 485 &&
        mouseY > 418 && mouseY < 453) {
      scene = 2;
      feedback = "";
      correct = false;
    }
  }

  // feedback for lvl 2
  else if (scene == 2) {
    if (mouseX > 200 && mouseX < 600) {

      if (mouseY > 255 && mouseY < 300) {
        feedback = "Your email would still be at risk!";
        correct = false;
      }

      if (mouseY > 315 && mouseY < 360) {
        feedback = "Correct! Both accounts need new passwords.";
        correct = true;
      }

      if (mouseY > 375 && mouseY < 420) {
        feedback = "A leaked password is unsafe even if it is strong!";
        correct = false;
      }
    }

    if (correct == true &&
        mouseX > 315 && mouseX < 485 &&
        mouseY > 425 && mouseY < 455) {
      scene = 3;
      feedback = "";
      correct = false;
    }
  }

  //feedback fo lvl 3
  else if (scene == 3) {
    if (mouseX > 190 && mouseX < 610) {

      if (mouseY > 245 && mouseY < 290) {
        feedback = "A regular notes app may not protect passwords well.";
        correct = false;
      }

      if (mouseY > 305 && mouseY < 350) {
        feedback = "Correct! Managers securely store unique passwords.";
        correct = true;
      }

      if (mouseY > 365 && mouseY < 410) {
        feedback = "One leaked password could expose every account...";
        correct = false;
      }
    }

    if (correct == true &&
        mouseX > 315 && mouseX < 485 &&
        mouseY > 425 && mouseY < 455) {
      scene = 4;
      feedback = "";
      correct = false;
    }
  }

  //restart
  else if (scene == 4) {
    if (mouseX > 285 && mouseX < 515 &&
        mouseY > 405 && mouseY < 450) {
      scene = 0;
      feedback = "";
      correct = false;
    }
  }
}



