
import { loadSound, playSoundAtPosition } from "../util/positional-audio.js";
// THE MASTER CLIENT GIVES CONTROL OF THE BALL TO THE CONTROLLER THAT LAST PRESSED ITS TRIGGER.
let soundBuffer = [], loadSounds = [];
loadSounds.push(loadSound('../../media/sound/chessSounds/capture.mp3', buffer => soundBuffer[0] = buffer));
loadSounds.push(loadSound('../../media/sound/chessSounds/move-opponent.mp3', buffer => soundBuffer[1] = buffer));
loadSounds.push(loadSound('../../media/sound/chessSounds/move-self.mp3', buffer => soundBuffer[2] = buffer));
Promise.all(loadSounds);


window.sharedState = {  // STATE OBJECT THAT IS SHARED BETWEEN ALL CLIENTS:

  time: 0,                // THE CURRENT TIME ON THE MASTER CLIENT'S LOCAL CLOCK.
  pos: [0,1.5,0],         // THE CURRENT BALL POSITION.
  controller: { },        // A LIST OF WHICH CLIENT TRIGGERS ARE CURRENTLY PRESSED.

  blackTimeRemaining: 15 * 60,   // seconds (left clock), 15 min initial
  whiteTimeRemaining: 15 * 60,   // seconds (right clock), 15 min initial
  running: null,                  // Who is counting down?Can be 'left', 'right', or null
  runningSince: -1,               // model.time when current clock started (-1 = not set)
  remainingWhenStarted: 0,        // seconds remaining when we started the running clock
}

// Function to start the clock of left or right clock
let startClock = (clock) => {
  if (clock == 'left') {
    // start counting down from blackStartTime
    sharedState.running = 'left';
    sharedState.remainingWhenStarted = sharedState.blackTimeRemaining;
    sharedState.runningSince = -1;  // master will set to model.time next frame
  } else {
    // start counting down from whiteStartTime
    sharedState.running = 'right';
    sharedState.remainingWhenStarted = sharedState.whiteTimeRemaining;
    sharedState.runningSince = -1;
  }
}

let stopClock = (clock) => {
  if (clock == 'left') {
    // stop counting down
    if (sharedState.running === 'left') sharedState.running = null;
  } else {
    // stop counting down
    if (sharedState.running === 'right') sharedState.running = null;
  }
}

export const init = async model => {

  let base = model.add('cube').color([.59, .29, 0]);
  let button1 = model.add('tubeY').color([.02,.02,.02]);
  let button2 = model.add('tubeY').color([.02,.02,.02]);
  let clock1 = model.add('square').color('white');
  let clock2 = model.add('square').color('white');

  model.txtrSrc(1, '../media/textures/brown-wood-texture.png');
  base.txtr(1);

  // WHEN A CLIENT PRESSES A TRIGGER, THAT CLIENT SENDS A MESSAGE TO THE MASTER CLIENT TO TELL IT TO
  // ADD THAT CLIENT'S TRIGGER TO THE LIST OF TRIGGERS BEING DRAGGED, TOGETHER WITH A TIMESTAMP.

  inputEvents.onPress = hand => {
     sharedState.controller[hand + clientID] = { pos: [0,1.5,0], time: sharedState.time };
     if (hand == 'left') {
      startClock('right');
      button1.move(0,-.01,0);
      stopClock('left');
     }
     if (hand == 'right') {
      startClock('left');
      button2.move(0,-.01,0);
      stopClock('right');
     }
     playSoundAtPosition(soundBuffer[0], sharedState.pos);

     server.broadcastGlobal('sharedState');
  }

  // DRAG EVENTS ARE SENT TO THE MASTER CLIENT FOR PROCESSING. THEY DO NOT DIRECTLY MOVE THE BALL.

  inputEvents.onDrag = hand => {
     //sharedState.controller[hand + clientID].pos = inputEvents.pos(hand);
     //server.broadcastGlobal('sharedState');
  }

  // AN UP EVENT REMOVES THIS CLIENT FROM THE MASTER CLIENT'S LIST OF CLIENTS WHO ARE DRAGGING.

  inputEvents.onRelease = hand => {
     delete sharedState.controller[hand + clientID];
     server.broadcastGlobal('sharedState');
  }

  let getTimeString = (clock) => {
    if (clock == 'left') {
      // format as MM:SS (blackTimeRemaining is in seconds)
      const s = Math.max(0, Math.floor(Number(sharedState.blackTimeRemaining)));
      return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    } else {
      // format as MM:SS (whiteTimeRemaining is in seconds)
      const s = Math.max(0, Math.floor(Number(sharedState.whiteTimeRemaining)));
      return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    }
  }

  model.animate(() => {
    sharedState = server.synchronize('sharedState')

    if (clientID == clients[0]) {                // ONLY THE MASTER CLIENT MODIFIES THE SHARED STATE:
      sharedState.time = model.time;
      // Chess clock countdown: update the running clock's remaining time
      if (sharedState.running) {
        if (sharedState.runningSince < 0) sharedState.runningSince = model.time;
        const elapsed = model.time - sharedState.runningSince;
        const remaining = Math.max(0, sharedState.remainingWhenStarted - elapsed);
        if (sharedState.running === 'left') sharedState.blackTimeRemaining = remaining;
        else sharedState.whiteTimeRemaining = remaining;
      }
    let time = 0;                                                 // THE MASTER CLIENT DETERMINES
    for (let id in sharedState.controller)                        // WHICH CLIENT PRESSED THEIR
      if (sharedState.controller[id].time > time) {              // TRIGGER LAST. IT THEN USES
      time = sharedState.controller[id].time;                 // THE POSITION FROM THAT CLIENT
        sharedState.pos = sharedState.controller[id].pos;       // AS THE POSITION TO BROADCAST
      }                                                          // TO EVERY CLIENT.
    server.broadcastGlobal('sharedState');
    }

    let clockText1 = clay.text(getTimeString('left'));
    let clockText2 = clay.text(getTimeString('right'));
    while (model.nChildren() > 5) model.remove(5);
    let clockTime1 = model.add(clockText1);
    let clockTime2 = model.add(clockText2);

    let t = model.time;
    let sin = Math.sin;
    let cos = Math.cos;

    base.identity().move(sharedState.pos).scale(.15, .06, .07);
    button1.identity().move(sharedState.pos).move(-.07,.065,0).move(0, sharedState.running == 'right' ? -.01 : 0, 0).scale(.06,.01,.06);
    button2.identity().move(sharedState.pos).move(.07,.065,0).move(0, sharedState.running == 'left' ? -.01 : 0, 0).scale(.06,.01,.06);
    clock1.identity().move(-.07+sharedState.pos[0], sharedState.pos[1], .071+sharedState.pos[2]).scale(.06, .03, 1).color('white');
    clock2.identity().move(.07+sharedState.pos[0], sharedState.pos[1], .071+sharedState.pos[2]).scale(.06, .03, 1).color('white');
    clockTime1.identity().move(-.102+sharedState.pos[0], .01+sharedState.pos[1], .072+sharedState.pos[2]).scale(1).color('black');
    clockTime2.identity().move(.0398+sharedState.pos[0], .01+sharedState.pos[1], .072+sharedState.pos[2]).scale(1).color('black');
  });
}
