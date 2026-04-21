import * as cg from "../render/core/cg.js";
import { 
   loadSound, 
   playSoundAtPosition, 
   pauseAudio, 
   resumeAudio,
   playLoopingSoundAtPosition,
   playLoopingSoundAtPosition02,
   stopLoopingSound,
   stopLoopingSound02
} from "../util/positional-audio.js";
import { controllerMatrix, joyStickState, ControllerBeam, buttonState } from "../render/core/controllerInput.js";
import { songInfo, songs, startAt } from "./songInfo.js";
import { Router } from "./routes/routes.js";
import { initStartMenu } from "./menus/startMenu.js";
import { initSongSelect } from "./menus/songSelect.js";
import { initSongInspect } from "./menus/songInspect.js";
import { initPlayingSong } from "./menus/playingSong.js";
import { initPauseMenu } from "./menus/pauseMenu.js";
import { initSettingsMenu } from "./menus/settingsMenu.js";
import { initFitnessStudioMenu } from "./menus/fitnessStudioMenu.js";
import { initDancingMenu } from "./menus/dancingMenu.js";
import { initUserMenu } from "./menus/userMenu.js";

let lFanAngle = 0;
let rFanAngle = 0;
let turnSpeed = 0.1;

let rotations = {
   'up': Math.PI/2,
   'up_left': 3*Math.PI/4,
   'left': Math.PI,
   'down_left': -3*Math.PI/4,
   'down': -Math.PI/2,
   'down_right': -Math.PI/4,
   'right': 0,
   'up_right': Math.PI/4,
   'no_direction': 0
}

let dirVectors = {
   'up': [0, 1, 0],
   'down': [0, -1, 0],
   'left': [-1, 0, 0],
   'right': [1, 0, 0],
   'up_left': [-0.707, 0.707, 0],
   'up_right': [0.707, 0.707, 0],
   'down_left': [-0.707, -0.707, 0],
   'down_right': [0.707, -0.707, 0],
   'no_direction': [0, 0, 0]
};

let previousHands = { left: null, right: null };
// Safe vector math helpers
let vSub = (a, b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
let vAdd = (a, b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
let vScale = (v, s) => [v[0]*s, v[1]*s, v[2]*s];
let vDot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];

// Calculates distance from a point (p) to a line segment (v to w)
let distToSegment = (p, v, w) => {
   let l2 = cg.distance(v, w) ** 2;
   if (l2 === 0) return cg.distance(p, v);
   let t = Math.max(0, Math.min(1, vDot(vSub(p, v), vSub(w, v)) / l2));
   let projection = vAdd(v, vScale(vSub(w, v), t));
   return cg.distance(p, projection);
};

let truncateString = (str, maxLength) => {
   return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

// LOAD ALL THE SOUNDS THAT WILL BE MADE WHEN BALLS BOUNCE.

let soundBuffer = [], loadSounds = [];
let songBuffer = [], loadSongs = [];
//for (let i = 0 ; i < 6 ; i++)
   //loadSounds.push(loadSound('../../media/sound/bounce/'+i+'.wav', buffer => soundBuffer[i] = buffer));
loadSounds.push(loadSound('../../media/sound/xrcisingSounds/1_TYPE_05.WAV', buffer => soundBuffer[0] = buffer)); // hit sound
loadSounds.push(loadSound('../../media/sound/xrcisingSounds/1_BLIP_01.WAV', buffer => soundBuffer[1] = buffer)); // song scroll sound
loadSounds.push(loadSound('../../media/sound/xrcisingSounds/1_BLIP_04.WAV', buffer => soundBuffer[2] = buffer)); // start menu button sound
loadSounds.push(loadSound('../../media/sound/xrcisingSounds/1_LIGHT_03.WAV', buffer => soundBuffer[3] = buffer)); // hit miss sound
loadSounds.push(loadSound('../../media/sound/xrcisingSounds/DISC_SPAWN.WAV', buffer => soundBuffer[4] = buffer)); // song select sound

loadSongs.push(loadSound('../../media/sound/xrcisingSongs/Rocky Road to Dublin - Sinners (Original Motion Picture Soundtrack).mp3', buffer => songBuffer[0] = buffer));
loadSongs.push(loadSound('../../media/sound/xrcisingSongs/Rasputin - Love The Way You Move (Funk Overload).mp3', buffer => songBuffer[1] = buffer));
loadSongs.push(loadSound('../../media/sound/xrcisingSongs/thegrid.wav', buffer => songBuffer[2] = buffer));
loadSongs.push(loadSound('../../media/sound/xrcisingSongs/LOOP3.WAV', buffer => songBuffer[3] = buffer)); // main menu music
loadSongs.push(loadSound('../../media/sound/fitnessSongs/ambient-zen.mp3', buffer => songBuffer[4] = buffer)); // fitness studio music

Promise.all(loadSounds);
Promise.all(loadSongs);

let soundMap = {
   'hitSound': 0,
   'scrollSound': 1,
   'startButtonSound': 2,
   'missSound': 3,
   'songSelectSound': 4
}

let unlit = [[1,.0,.0],[.8,.0,.4],[.8,.8,.0],[0.,.4,.8]];
let   lit = [[1,.5,.5],[1,.5,.75],[1.,1.,.5],[.6,.8,1.]];

export const init = async model => {
   let playSong = i => playLoopingSoundAtPosition02(songBuffer[i], [0,0,0], startAt);
   let stopSong = () => stopLoopingSound02();
   let playCustomSound = (sound, pos = [0,0,0]) => {
      playSoundAtPosition(soundBuffer[soundMap[sound]], pos);
   }

   // fans
   let lfan_color = [0, 0, 1];
   let rfan_color = [1, 0, 0];

   let mat_color = [0, 0, 1];

   let lfan_front = model.add('halfDiskX').color(lfan_color);
   let lfan_back = model.add('halfDiskX').color(lfan_color);
   let rfan_front = model.add('halfDiskX').color(rfan_color);
   let rfan_back = model.add('halfDiskX').color(rfan_color);

   let lHitbox = model.add('tubeZ').color(lfan_color);//.opacity(0.75);
   let rHitbox = model.add('tubeZ').color(rfan_color);//.opacity(0.75);

   let fitnessMat = model.add('square').color(mat_color);

   // tracks
   let tracks = [];
   for (let i = 0; i < 8; i++) {
      let track = model.add('square').color(i === 0 ? 'green' : 'white');
      let ballGroup = track.add();
      tracks.push({
         track: track,
         ballGroup: ballGroup
      });
      track.opacity(0);
   }

   let activeBalls = [];

   let getGridPos = (pos) => {
      let col = pos % 4; // 0 to 3
      let row = Math.floor(pos / 4); // 0 to 3
      
      let x = -0.5 + (col / 3) * 1.2; // -0.3 to 0.3
      let y = 1.9 - (row / 3) * 1;  // 1.5 to 0.3 (top to bottom)
      return [x, y];
   };

   let addBall = (trackIndex, color = [0, 0, 0], direction = 'no_direction', 
      gridPos, beat, bpm, speed) => {
      if (trackIndex < 0 || trackIndex >= tracks.length) return;
      
      let secPerBeat = 60 / bpm;
      let arrivalTime = beat * secPerBeat;
      /*DEBUGGER CODE*/
      let timeRemaining = arrivalTime - startAt;
      if (timeRemaining < 0) return;
      /*END DEBUGGER CODE*/
      let zStart = -(speed * timeRemaining);

      let [x, y] = getGridPos(gridPos);
      let ballObj = tracks[trackIndex].ballGroup.add('sphere').opacity(0);

      let shape = direction === 'no_direction' ? 'diskZ' : 'halfDiskZ';
      ballObj.add(shape)
         .color('white')
         .opacity(null)
         .move(0,0,1.01)
         .turnZ(rotations[direction])
         .scale(.7);
      
      let ball = {
         trackIndex: trackIndex,
         obj: ballObj,
         p: [x, y, zStart],
         v: [0, 0, 0.35],
         speed: speed,
         hit: 0,
         r: 0.2, // radius
         color: color == 'blue' ? lfan_color : rfan_color,
         direction: direction
      };
      activeBalls.push(ball);
   };

   // Add some test balls to tracks to test the system
   // for (let i = 0; i < 200; i++) {
   //    let tIdx = Math.floor(Math.random() * 8);
   //    //let gPos1 = Math.floor(Math.random() * 16);
   //    //let gPos2 = (gPos1 + Math.floor(Math.random() * 16)) % 16;
   //    let color = Math.floor(Math.random() * 2)%2 == 0 ? 'blue' : 'red';
   //    //addBall(0, color, gPos1, -10 - i * 1.5);
   //    //addBall(0, color, gPos2, -10 - i * 1.5);
      
   //    addBall(0, color, color === 'blue' ? 'up_right' : 'up_left', 4, i, 76, 9.0);
      
   // }

   let playSound = (b) => {
      let globalPos = cg.mTransform(tracks[b.trackIndex].ballGroup.getGlobalMatrix(), b.p);
      playCustomSound('hitSound', globalPos);
   };

   let selectedSong = 3;
   let isSongPlaying = false;
   let lastSongChangeTime = 0; // timestamp of last song play/pause

   let currentScore = 0;
   let currentCombo = 0;
   let missedObjects = 0;
   let totalPausedTime = 0;
   let lastPauseTime = 0;
   let isPaused = false;
   let wasAPressed = false;

   let onSongSelect = (index) => {
      let currentTime = Date.now();
      if (currentTime - lastSongChangeTime > 500 && selectedSong !== index) {
         if (selectedSong !== -1) stopSong();
         playSong(index);
         playCustomSound('songSelectSound');
         for (let t of tracks) fadeIn(t.track);
         isSongPlaying = true;
         selectedSong = index;
         lastSongChangeTime = currentTime - (startAt * 1000);
         totalPausedTime = 0;
         isPaused = false;
         for (let b of activeBalls) { b.obj.opacity(0); b.obj.parent().remove(b.obj); }
         activeBalls = [];
         currentScore = 0;
         missedObjects = 0;
         currentCombo = 0;
         let songData = songInfo[Object.keys(songInfo)[index]];
         if (songData && songData.map) {
            for (let obstacle of songData.map) {
               addBall(obstacle.track, obstacle.color, obstacle.dir, obstacle.gridPos, obstacle.beat, obstacle.bpm || songData.bpm, obstacle.speed);
            }
         }
      }
   };

   let onResume = () => {
      isPaused = false;
      totalPausedTime += Date.now() - lastPauseTime;
      resumeAudio();
   };

   let onQuit = () => {
      isPaused = false;
      selectedSong = -1;
      isSongPlaying = false;
      stopSong();
      playSong(3);
      selectedSong = 3;
      for (let t of tracks) fadeOut(t.track);
      for (let b of activeBalls) { b.obj.opacity(0); b.obj.parent().remove(b.obj); }
      activeBalls = [];
   };

   let getGameState = () => {
      let elapsedMs = 0;
      if (isSongPlaying) {
         if (isPaused) elapsedMs = lastPauseTime - lastSongChangeTime - totalPausedTime;
         else elapsedMs = Date.now() - lastSongChangeTime - totalPausedTime;
      }
      return {
         score: currentScore,
         combo: currentCombo,
         misses: missedObjects,
         elapsedMs: elapsedMs
      };
   };

   let fadeOut = (object) => {
      let currentOpacity = object.get('opacity') ?? 1;
      object.animate(() => {
         currentOpacity -= model.deltaTime * 4; 
         if (currentOpacity <= 0) {
            currentOpacity = 0;
            object.animate(null);
         }
         object.opacity(currentOpacity);
      });
   };

   let fadeIn = (object) => {
      let currentOpacity = object.get('opacity') ?? 0;
      object.animate(() => {
         currentOpacity += model.deltaTime * 4; 
         if (currentOpacity >= 1) {
            currentOpacity = 1;
            object.animate(null);
         }
         object.opacity(currentOpacity);
      });
   };

   // 1. Initialize Menus
   let startMenu = initStartMenu(model, 3);
   let songSelect = initSongSelect(model, 4, songs, (index) => {
      songInspect.setSong(index);
   });
   let songInspect = initSongInspect(model, 7, onSongSelect);
   let playingSong = initPlayingSong(model, 5, getGameState);
   let pauseMenu = initPauseMenu(model, 6, onResume, onQuit, getGameState);
   let settingsMenu = initSettingsMenu(model, 8, (hand, value) => {
      // Map x, y [0..1] to an RGB color. Let x be hue, y be saturation, lightness=0.5
      let hue = value[0] * 6;
      let sat = value[1];
      let val = 1;
      let c = val * sat;
      let x = c * (1 - Math.abs((hue % 2) - 1));
      let m = val - c;
      let rgb = [0, 0, 0];
      if (hue < 1) rgb = [c, x, 0];
      else if (hue < 2) rgb = [x, c, 0];
      else if (hue < 3) rgb = [0, c, x];
      else if (hue < 4) rgb = [0, x, c];
      else if (hue < 5) rgb = [x, 0, c];
      else rgb = [c, 0, x];
      
      let mappedColor = [rgb[0] + m, rgb[1] + m, rgb[2] + m];
      
      if (hand === 'left') {
         lfan_color = mappedColor;
         lfan_front.color(lfan_color);
         lfan_back.color(lfan_color);
         lHitbox.color(lfan_color);
      } else if (hand === 'right') {
         rfan_color = mappedColor;
         rfan_front.color(rfan_color);
         rfan_back.color(rfan_color);
         rHitbox.color(rfan_color);
      }
   });

   let fitnessStudioMenu = initFitnessStudioMenu(model, 9, () => {
      if (selectedSong !== -1) stopSong();
      playSong(4);
      selectedSong = 4;
      isSongPlaying = true;
   });
   let dancingMenu = initDancingMenu(model, 10);
   let userMenu = initUserMenu(model, 11);

   for (let t of tracks) t.track.opacity(0);

   let lBeam = new ControllerBeam(model, 'left');
   let rBeam = new ControllerBeam(model, 'right');

   // start playing main menu music on load
   playSong(3);

   inputEvents.onPress = hand => {}
    
   model.animate(() => {
      let t = model.time;
      let sin = Math.sin;
      let cos = Math.cos;
      let pi = Math.PI;
      let pos;

      // Render left and right fans
      lfan_front.identity()
         .setMatrix(controllerMatrix.left)
         .turnX(-pi/4).scale(.2).move(0,.1,-.42).turnX(pi)
         .turnX(pi/4 + lFanAngle);
      lfan_back.identity()
         .setMatrix(controllerMatrix.left)
         .turnZ(pi).turnX(pi/4).scale(.2).move(0,-.1,-.42)
         .turnX(-pi/4 - lFanAngle);
      rfan_front.identity()
         .setMatrix(controllerMatrix.right)
         .turnX(-pi/4).scale(.2).move(0,.1,-.42).turnX(pi)
         .turnX(pi/4 + rFanAngle);
      rfan_back.identity()
         .setMatrix(controllerMatrix.right)
         .turnZ(pi).turnX(pi/4).scale(.2).move(0,-.1,-.42)
         .turnX(-pi/4 - rFanAngle);

      // Rotate fans when joy sticks pressed up/down
      if (Math.abs(joyStickState.left.y) > .1) {
         lFanAngle += joyStickState.left.y * turnSpeed;
      }

      if (Math.abs(joyStickState.right.y) > .1) {
         rFanAngle += joyStickState.right.y * turnSpeed;
      }

      if (controllerMatrix.left) {
         lHitbox.identity()
                .setMatrix(controllerMatrix.left)
                .move(0, 0, -0.5) // Shift it forward so it starts at the controller base
                .scale(0.04, 0.04, 0.5) // Thin it out, and scale length to 1 unit
                .opacity(isSongPlaying ? 1 : 0);
      }
      
      if (controllerMatrix.right) {
         rHitbox.identity()
                .setMatrix(controllerMatrix.right)
                .move(0, 0, -0.5)
                .scale(0.04, 0.04, 0.5)
                .opacity(isSongPlaying ? 1 : 0);
      }

      // Render mat in fitness studio
      fitnessMat.identity()
                .scale(1.2, .4, .5)
                .turnX(-Math.PI/2)
                .opacity(Router.currentRoute === 'fitnessStudio' ? .6 : 0);

      // Render tracks
      renderTracks(tracks);

      // Render menus:

      // 2. Manage Visibility
      startMenu.obj.opacity(Router.currentRoute === 'startMenu' ? 1 : 0);
      fitnessStudioMenu.obj.opacity(Router.currentRoute === 'startMenu' ? 1 : 0);
      dancingMenu.obj.opacity(Router.currentRoute === 'startMenu' ? 1 : 0);
      userMenu.obj.opacity(Router.currentRoute === 'startMenu' ? 1 : 0);
      songSelect.obj.opacity(Router.currentRoute === 'songSelect' ? 1 : 0);
      songInspect.obj.opacity(Router.currentRoute === 'songInspect' ? 1 : 0);
      playingSong.obj.opacity(Router.currentRoute === 'playingSong' ? 1 : 0);
      pauseMenu.obj.opacity(Router.currentRoute === 'pauseMenu' ? 1 : 0);
      settingsMenu.obj.opacity(Router.currentRoute === 'settingsMenu' ? 1 : 0);

      let isAPressed = buttonState.right[4] ? buttonState.right[4].pressed : false;
      if (isAPressed && !wasAPressed && Router.currentRoute === 'playingSong') {
         Router.navigate('pauseMenu');
         isPaused = true;
         lastPauseTime = Date.now();
         pauseAudio();
      }
      wasAPressed = isAPressed;

      // While playing a song, track hits
      renderHitTracking(tracks, activeBalls);

      for (let i = activeBalls.length - 1 ; i >= 0 ; i--) {       // MOVE EACH BALL BY ITS VELOCITY
         let b = activeBalls[i];
         
         if (!isPaused) {
            b.v[2] = b.speed * model.deltaTime;
         
            // fade in as balls get closer
            if (b.p[2] > -10) {
               let op = b.obj.get('opacity') ?? 0;
               if (op < 1) b.obj.opacity(Math.min(1, op + model.deltaTime * 4));
            }
            
            b.v = cg.scale(b.v, .992);
            b.p = cg.add(b.p, b.v);

            if (b.p[2] > 0) {
               b.obj.opacity(0);
               b.obj.parent().remove(b.obj);
               activeBalls.splice(i, 1);
               // keeping track of score
               missedObjects++;
               if (currentCombo > 5) playCustomSound('missSound'); // miss
               currentCombo = 0;
               continue;
            }

            if (b.hit > 0) b.hit--;
         }

         b.obj.color(b.color).identity().move(b.p).scale(b.r);
      }

      // 3. Update the active G2 canvas
      if (Router.currentRoute === 'startMenu') {
         startMenu.g2.update();
         fitnessStudioMenu.g2.update();
         dancingMenu.g2.update();
         userMenu.g2.update();
      } else if (Router.currentRoute === 'songSelect') {
         songSelect.g2.update();
      } else if (Router.currentRoute === 'songInspect') {
         songInspect.g2.update();
      } else if (Router.currentRoute === 'playingSong') {
         playingSong.g2.update();
      } else if (Router.currentRoute === 'pauseMenu') {
         pauseMenu.g2.update();
      } else if (Router.currentRoute === 'settingsMenu') {
         settingsMenu.g2.update();
      }
   });


   let renderTracks = (tracks) => {
      // Find which track (1-8) user is facing
      let pi = Math.PI;
      let nMin = -1;
      let dMin = 1000;
      let mm = cg.mMultiply(clay.root().viewMatrix(0), worldCoords);
      for (let i = 0; i < tracks.length; i++) {
         let m = cg.mMultiply(mm, tracks[i].track.getMatrix());
         let d = m[12] * m[12] + m[13] * m[13];

         if (m[14] < 0 && d < dMin) {
            dMin = d;
            nMin = i;
         }
      }
      // Render tracks
      for (let i = 0; i < tracks.length; i++) {
         let isGazed = (i === nMin);
         let opacity = isGazed ? .5 : .2;
         opacity = Router.currentRoute === 'playingSong' ? opacity : 0;
         let zOffset = isGazed ? 0.001 : -0.0001 * (i + 1);
         tracks[i].track.identity()
                  .turnX(-pi/2)
                  .turnZ(-i * pi/4) // Rotates track i by pi/4
                  .scale(1, 30, 1)
                  .move(0, 1, zOffset)
                  .opacity(opacity);
                  
         tracks[i].ballGroup.identity()
                  .move(0, -1, -0.001)
                  .scale(1, 1/30, 1)
                  .turnX(Math.PI/2);
      }
   }


   let renderHitTracking = (tracks, activeBalls) => {
      let trackInverses = tracks.map(t => cg.mInverse(t.ballGroup.getGlobalMatrix()));
      for (let hand in {left:0, right:0}) {
         let cMatrix = controllerMatrix[hand];
         if (!cMatrix) continue;
  
         // 1. Calculate the 1-meter blade
         let basePos = [cMatrix[12], cMatrix[13], cMatrix[14]];
         let forward = [-cMatrix[8], -cMatrix[9], -cMatrix[10]];
         let tipPos = vAdd(basePos, vScale(forward, 1.0));
  
         // Track the TIP's previous position instead of the base to capture wrist flicks
         let prevTipPos = previousHands[hand + '_tip'] || tipPos;
         let swingVelocity = vSub(tipPos, prevTipPos);
         let swingSpeed = cg.distance(tipPos, prevTipPos);
         
         // Transform global blade points into the local space of the tracks
         let localBases = trackInverses.map(inv => cg.mTransform(inv, basePos));
         let localTips  = trackInverses.map(inv => cg.mTransform(inv, tipPos));
         
         for (let i = activeBalls.length - 1; i >= 0; i--) {
            let b = activeBalls[i];
            let trackIdx = b.trackIndex;
            
            // 2. Point-to-Line collision check
            let dist = distToSegment(b.p, localBases[trackIdx], localTips[trackIdx]);
  
            // Anti-Tunneling: Expand the hit radius slightly based on how fast they swing
            let controllerRadius = 0.15;
            let hitRadius = b.r + controllerRadius + (swingSpeed * 0.8); 
  
            if (dist < hitRadius) {
               let hitValid = true;
  
               // 3. Direction Check 
               if (b.direction !== 'no_direction') {
                  // Figure out the local vector we are supposed to hit toward
                  let angle = rotations[b.direction];
                  let expectedDir = [Math.cos(angle), Math.sin(angle), 0];
  
                  // Convert our actual swing velocity into this track's local space
                  let globalSwingEnd = vAdd(basePos, swingVelocity);
                  let localSwingEnd = cg.mTransform(trackInverses[trackIdx], globalSwingEnd);
                  let localSwingDir = vSub(localSwingEnd, localBases[trackIdx]);
                  
                  let mag = Math.sqrt(vDot(localSwingDir, localSwingDir));
                  if (mag > 0.001) { // Prevents dividing by zero
                     localSwingDir = vScale(localSwingDir, 1/mag);
                     let alignment = vDot(localSwingDir, expectedDir);
                     
                     // alignment > 0 means the swing generally matches the target direction. 
                     // Require > 0.3 to ensure they actually slice with some accuracy.
                     if (alignment < 0.3) {
                        hitValid = false;
                     }
                  } else {
                     // If they are just holding the controller still inside the ball
                     hitValid = false; 
                  }
               }
  
               if (hitValid) {
                  playSound(b);
                  vibrate(hand, .4);
                  b.obj.opacity(0);
                  b.obj.parent().remove(b.obj);
                  activeBalls.splice(i, 1);
                  currentCombo++;
                  currentScore += 100 * currentCombo;
               }
            }
         }
         // Save current position for the next frame
         previousHands[hand + '_tip'] = tipPos;
      }
      // We are going to use the code below for some other exercise
      // Making the user move their head around to hit things might
      // encourage more dynamic movement
      let head = clientState.head(clientID);  // BOUNCE OFF HEAD
      if (Array.isArray(head)) {
         let pos = head.slice(12,15);
         let localHead = trackInverses.map(inv => cg.mTransform(inv, pos));
         for (let i = activeBalls.length - 1; i >= 0; i--) {
            let b = activeBalls[i];
	         if (cg.distance(b.p, localHead[b.trackIndex]) < b.r+.15) {
               playSound(b);
               b.obj.opacity(0);
               b.obj.parent().remove(b.obj);
               activeBalls.splice(i, 1);
            }
         }
      }
   }

   let renderFitnessStudio = () => {}

}
