
let gamble = {
  time: Number.MIN_SAFE_INTEGER,
  odds: 50,
  victory: -1
};

const sexyDieData = 'iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAAAXNSR0IArs4c6QAAAHVJREFUOI3Vk80KwCAMg9Pqq20PvWcTsssYtaz+4WW5lcSPElXwiCQxKRERAJBVgAWpB5w5Nw95nyT1KxCBIl99YGV+IVcpVWhqptOR0tRMktK6Gbuy38RKI6PXyRCk10ml7Z30Ooj8H72TEX/LLxa70QoAAG7cEf5/l+pBZwAAAABJRU5ErkJggg==';
let sexyDie;

const cardBackData = 'iVBORw0KGgoAAAANSUhEUgAAAHgAAAC0CAYAAABfTugdAAAAAXNSR0IArs4c6QAAAklJREFUeJzt1stt4zAUQFG/wLWlwekmfaQbA5qVs/BYHgb56uKcnWVCIHDxKM5px7Zt295//D4zM3ef3z4Q9thuQ7/9ELblGnpOJ3GrZmaefnoTfK3zexY/n9+1nC/0crksrZuV41nY32kl8sPAwh7Do9C732Bxj+NRK5esOIHj7gZ2PB/PXjMTHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHCdwnMBxAscJHHc38Mvl8t374IP2mpngOIHjdgM7po/jUavZtm373wuez+dP3RCfY2UIn2ZmVl60OtF/Xl+X1vExKz3mGndlijmemRmXrLi349kUt1xP53++v0If2+2daveCJfSx7F2W/wJ1gk+v4JeBCgAAAABJRU5ErkJggg==';
let cardBack;

const cardLoseData = 'iVBORw0KGgoAAAANSUhEUgAAAHgAAAC0CAYAAABfTugdAAAAAXNSR0IArs4c6QAAA1NJREFUeJzt3VFum0AURuG5ldeWRXttSPSJlCLGMEDCncP5nhqHWKlOfmLXTYhSMY7jWHuf8omIWL19eYNh+7YM/f2GYVmm0FGKcakiIv7c/UnoZxkYLjw9s7lgOAPDGRju1XLw1+v/w9/DcOgY/Z7dC16GW7ttzzH6XadP0VNAQ+a0K/DZeMa/zyUPsr5eL7/XJuWjaLjLArvinFww3K7Ae5b5HobqgymXfR8XDLc78KcVut68XDBcU+C1Nbre3FwwXHPg+Spdb36nFuw/buR3KPBWVKPnccnLhQbN63DgWlRj5+LLhXCnAk9Rp0fTRs7H58Fwl/xkg+vNyx9dgfMUDWdgOAPDGRjOwHAGhjMwnIHhDAxnYDgDwxkYzsBwBoYzMJyB4QwMZ2A4A8MZGM7AcAaGMzCcgeEMDGdgOAPDGRjOwHAGhjMwnIHhDAxnYDgDwxkYzsBwBoYzMJyB4QwMZ2A4A8OlvbDv/GIf/qLT41wwnIHhDAxnYDgDwxkYzsBwaZ8Ht6pdJLOU9efRLce33ncmiAV/CrD2/pbjW+87G0Rg1eX+8jtgfsrcs66W41vvOwMXDNfHl+EPml+1LfsDpiMeH7iUf6fbrcC9nJbnHnmKfg9D81OnXvH+Rg2my+LOfVpzj6fwRy54rrZmikcueO1/i6ytufU+Mnr8gum6WPDasmqraX2gdHS1vXDBcIjAW98Dl+9vOb71vrPxEu9wiAWrzsBwBoYzMJyB4QwMZ2A4A8MZGM7AcAaGMzCcgeEMDGdgOAPDGRjOwHAGhjMwnIHhDAxnYDgDwxkYzsBwBoYzMJyB4QwMZ2A4A8MZGM7AcAaGMzCcgeEMDGdgOAPDGRjOwHAGhjMwnIHhDAxn4KSu+u3yBk5ouhrbFZENDGfgZJbrPbtiAyc0v2DmWQZOpLbWMys2cFJXrdjASWyt9OiKDZzYFSs2cAK1dS6fCx9ZsYHhDHyzvevdOr7GwHAGvlHrerc+bo2B4Qx8k6Pr3fr4JQPDGTiZK19oKMXAeAZOyJcLAc4G3PvxBk5oiufLhZ1bC7i8bc8xn8Q4jmP7p6ZeuGA4A8MZGC5KKcXvw0wRES4YzsBwMf3B0zRLREQps8ATQ/dtCvv9du1AQ/dlGXbyFz3KELcr2cs5AAAAAElFTkSuQmCC';
let cardLose;

const cardWinData = 'iVBORw0KGgoAAAANSUhEUgAAAHgAAAC0CAYAAABfTugdAAAAAXNSR0IArs4c6QAAAzpJREFUeJzt3V1uGkEUBeG+EWvzolkb0uRpLDRh6L9xuF2u7yk2ECGVzoBtiY5yYtu27ew25RMR8fL7x28Ydm3H0N9fGJZlDx2lGJcqIuLPp5+EfpaB4cLLM5sLhjMwnIHhDAw3FfjrdrvqeeiHDAfe4xo5Ny/RcEOBj6t1xXm5YLjuwGdrdcU5uWC4rsC1lbrifFwwXHPg1nW64lxcMFxT4N5VuuI8XDBcNfDoGl1xDi4Y7m3g2RW64s9zwXBvA98fj6n/fPbxmueC4aqBR1foenNwwXBNgXvX6HrzcMFwzYFbV+l6c3HBcF2Ba+t0vfm4YLjuwGcrdb05uWC4ocDHtbrevFww3HDgfbWuNzc/hAXOSzScgeEMDGdgOAPDGRjOwHAGhjMwnIHhDAxnYDgDwxkYzsBwBoYzMJyB4QwMZ2A4A8MZGM7AcAaGMzCcgeEMDGdgOAPDGRjOwHAGhjMwXPrP3H8+FuDVx0XM3k7nguHQgT0UZIHAz5fVK06B+W3R0wd+x6Pm65YOrDoDwyGuaffHo3p5/o0/IpWyYOCv260p1rvX5+PjX91G+fl5iUv0/zyB7dU77ZXfvC0RWOMMfGLly/KzZQOfXTZnL6f3xwMTt5RFA9cirvyaebVlAtcOA/GwkNeWCawxBoYzMJyB4QwMt1Tg2oFcHtj1r6UCq5+B4TwYC84FwxkYzsBwBoYzMJyB4QwMZ2A4A8MZGM7AcAaGMzCcgeEMDGdgOAPDGRjOwHAGhjMwnIHhDAxnYDgDwxkYzsBwBoYzMJyB4QwMZ2A4A8MZGM7AcAaGM3Bysx+NbODE9rgzkQ0MZ+Ckrjr5xcBwBk7oygNHDAxn4GSuPlHGwHAGTqR1nT0rNjCcgZPofW1tvb+B4QycwOhvqVoeZ2A4A3/Y7J8Da483MJyBP2z28K7a4w0MZ+AERlfc8jgDwxk4id4Vt97fwHAGTqR1lT1rNzCcgZOprbP3tdrAcAZO6GylIz8vGxjOwEkd1zr62y4Dwxk4sX21M39xim3btquekPJxwXAGhjMwnIHhopRSfKPFFBHhguEMDBf7P7xMs0RElPIUeGfote1hv78+u6Oh13IMu/sLbYfWoUeMawwAAAAASUVORK5CYII=';
let cardWin;


let scrollbar;

const ROLL_TIME = 1200;
const HANG_TIME = 2*ROLL_TIME;

function preload() {
  loadBase64Image(sexyDieData, img => {
    sexyDie = img;
  });
  loadBase64Image(cardBackData, img => {
    cardBack = img;
  });
  loadBase64Image(cardLoseData, img => {
    cardLose = img;
  });
  loadBase64Image(cardWinData, img => {
    cardWin = img;
  });
}

function loadBase64Image(data, callback) {
  let raw = new Image();
  raw.src='data:image/png;base64,' + data; // base64 data here
  raw.onload = function() {
    let img;
    img = createImage(raw.width, raw.height);
    img.drawingContext.drawImage(raw, 0, 0);
    callback(img);
  }
}

function setup() {
  createCanvas(400, 400);
  scrollbar = {
    left : width * 0.2,
    right : width * 0.8,
    y : height * 0.78
  };
  setupButton();
  textAlign(CENTER,CENTER);
  rectMode(CENTER,CENTER);
  imageMode(CENTER,CENTER);
  textSize(20);
  fill(255);
  stroke(255);
}

function draw() {
  background(40);
  drawOdds();
  drawWizard();
  drawRoll();
  controlScrollbar();
}

function setupButton() {
  let btn = document.getElementById('gamble-btn');
  btn.style.left = (width - btn.style.width.replace('px', '')) * 0.5 + 'px';
  btn.style.top = scrollbar.y + 44 + 'px';
  btn.onclick = drawCard;
}

function drawCard() {
  gamble = {
    time: millis(),
    odds: gamble.odds,
    victory: isVictory()
  };
}

function isVictory() {
  return Math.random() < getOdds();
}

function getOdds() {
  return gamble.odds / 100;
}

function getOddsText() {
  return simplifyFraction(Math.round(gamble.odds) + '/100');
}

function simplifyFraction(frac) {
  let result = '';
  let data = frac.split('/'); 
  let numerator = Number(data[0]);
  let denominator = Number(data[1]);
  for (let i = max(numerator, denominator); i > 1; i--) {
    if ((numerator % i == 0) && (denominator % i == 0)) {
        numerator /= i;
        denominator /= i;
    }
  }
  if (denominator === 1) {
    result = numerator.toString();
  } else {
    result = numerator.toString() + '/' + denominator.toString();
  }
  return result
}

function drawWizard() {

}

function drawRoll() {
  push();
  translate(width/2, height/2);
  rotate(PI*0.02);
  scale(cos(getScaleTheta()), 1);
  if (cardIsShowing()) {
    if (gamble.victory) {
      safeImage(cardWin, 0, 0);
    } else {
      safeImage(cardLose, 0, 0);
    }
  } else {
    safeImage(cardBack, 0, 0);
  }
  pop();

}

function isRevealed() {
  return getGambleTimeElapsed() > ROLL_TIME * 0.5;
}


function getGambleTimeElapsed() {
  return millis() - gamble.time;
}


function isRolling() {
  return getGambleTimeElapsed() < ROLL_TIME;
}

function isRevealing() {
  return getGambleTimeElapsed() < ROLL_TIME + HANG_TIME;
}

function isHidden() {
  return getGambleTimeElapsed() > ROLL_TIME + HANG_TIME + ROLL_TIME;
}

function cardIsShowing() {
  if (isRolling()) {
    return getGambleTimeElapsed() > ROLL_TIME * 0.5;
  }
  return getGambleTimeElapsed() < ROLL_TIME + HANG_TIME + ROLL_TIME * 0.5;
}

function getScaleTheta() {
  if (isRolling()) {
    return PI - PI * (getGambleTimeElapsed()) / ROLL_TIME;
  }
  if (isRevealing()) {
    return 0;
  }
  if (!isHidden()) {
    return PI - PI * (getGambleTimeElapsed() - HANG_TIME) / ROLL_TIME;
  }
  return 0;
}

function drawOdds() {
  drawScrollbar();
  drawOddsThumb();
  drawOddsText();
}

function drawScrollbar() {
  strokeWeight(12);
  line(scrollbar.left, scrollbar.y, scrollbar.right, scrollbar.y);
}

function drawOddsThumb() {
  push();
  translate(getThumbX(), scrollbar.y);
  rotate(getThumbRotation());
  safeImage(sexyDie, 0, 0);
  pop();
}

function getThumbRotation() {
  return gamble.odds / 100 * 5 * PI;
}

function getThumbX() {
  return scrollbar.left + gamble.odds / 100 * (scrollbar.right - scrollbar.left);
}

function drawOddsText() {
  strokeWeight(0);
  text(getOddsText(), width*0.5, scrollbar.y + 30);
}

function controlScrollbar() {
  if (!mouseIsPressed) {
    return;
  }
  const MOUSE_RANGE = 15;
  if (abs(mouseY - scrollbar.y) > MOUSE_RANGE) {
    return;
  }
  if (mouseX - MOUSE_RANGE > scrollbar.right) {
    return;
  }
  if (mouseX + MOUSE_RANGE < scrollbar.left) {
    return;
  }

  let thumbX = constrain(mouseX, scrollbar.left, scrollbar.right);
  gamble.odds = 100 * (thumbX - scrollbar.left) / (scrollbar.right - scrollbar.left);
}

function safeImage(img, x, y) {
  if (img) {
    image(img, x, y);
  }
}