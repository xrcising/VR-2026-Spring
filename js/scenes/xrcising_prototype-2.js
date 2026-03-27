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
   let lfan_front = model.add('halfDiskX').color('blue');
   let lfan_back = model.add('halfDiskX').color('blue');
   let rfan_front = model.add('halfDiskX').color('red');
   let rfan_back = model.add('halfDiskX').color('red');

   let lHitbox = model.add('tubeZ').color('blue').opacity(0.5);
   let rHitbox = model.add('tubeZ').color('red').opacity(0.5);

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
         color: color,
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

   // menus
   let startMenu = model.add('roundedSquare').color('blue');
   startMenu.add('roundedSquare').color('white');
   startMenu.child(0).add(clay.text("Start XRCising!"));

   let songSelect = model.add('roundedSquare').color('white');
   let pageLength = 3;
   let page = 0;
   // buttons for songs
   for (let i = 0; i < songs.length; i++) {
      songSelect.add('roundedSquare').color('white'); // song button outline
      songSelect.child(i).add(clay.text(truncateString(songs[i], 40))).color('black'); // song text
   }

   // buttons for page navigation
   songSelect.add('roundedSquare').color('white'); // prev page button outline
   songSelect.add('roundedSquare').color('white'); // next page button outline
   songSelect.child(songs.length).add(clay.text('Prev')).color('black'); // prev page text
   songSelect.child(songs.length + 1).add(clay.text('Next')).color('black'); // next page text

   // playing ui
   let currentScore = 0;
   let currentCombo = 0;
   let missedObjects = 0;
   let playingSong = model.add('roundedSquare').color('blue');
   //playingSong.add('roundedSquare').color('white');
   //playingSong.child(0).add(clay.text("Score: 0"));

   let pauseMenu = model.add('roundedSquare').color('white');
   pauseMenu.add('roundedSquare').color('white'); // resume button outline
   pauseMenu.child(0).add(clay.text('Resume')).color('black');
   pauseMenu.add('roundedSquare').color('white'); // quit button outline
   pauseMenu.child(1).add(clay.text('Quit')).color('black');

   let isPaused = false;
   let totalPausedTime = 0;
   let lastPauseTime = 0;
   let wasAPressed = false;

   let menus = ['startMenu', 'songSelect', 'playingSong', 'pauseMenu'];
   let currentMenu = 'startMenu';
   startMenu.opacity(1);
   songSelect.opacity(0);
   playingSong.opacity(0);
   pauseMenu.opacity(0);
   for (let t of tracks) t.track.opacity(0);

   let lBeam = new ControllerBeam(model, 'left');
   let rBeam = new ControllerBeam(model, 'right');

   // start playing main menu music on load
   playSong(3);

   inputEvents.onPress = hand => {
      // Only use the left hand trigger since we only have a left beam right now
      if (hand === 'left' || hand === 'right') {
         switch (currentMenu) {
            case ('startMenu'):
               // if user clicks start button, fade startMenu out
               let startButton = startMenu.child(0);

               let lhit = lBeam.hitRect(startButton.getGlobalMatrix());
               let rhit = rBeam.hitRect(startButton.getGlobalMatrix());
               if (lhit && !isNaN(lhit[0]) || rhit && !isNaN(rhit[0])) {
                  playCustomSound('startButtonSound');
                  fadeOut(startMenu);
                  fadeIn(songSelect);
                  currentMenu = 'songSelect';
               }
               break;

            case ('songSelect'):
               // songSelect logic
               for (let i = 0; i < 2; i++) {
                  let button = songSelect.child(songs.length + i);
                  let lhit = lBeam.hitRect(button.getGlobalMatrix());
                  let rhit = rBeam.hitRect(button.getGlobalMatrix());
                  
                  // If the beam is hitting this button when the trigger is pressed
                  if (lhit && !isNaN(lhit[0]) || rhit && !isNaN(rhit[0])) {
                     if (i === 0 && page > 0) page--;      // 'Prev' button
                     else if (i === 1 && page < Math.floor(songs.length / pageLength)) page++; // 'Next' button
                     return;
                  }
               }
               // play song if selected
               for (let i = 0; i < songs.length; i++) {
                  if (i < page * pageLength || i >= (page + 1) * pageLength) continue; // Skip songs not on page
                  if (i > Object.keys(songInfo).length - 1) continue; // Skip selections if no key exists for it in songInfo

                  let button = songSelect.child(i);
                  let lhit = lBeam.hitRect(button.getGlobalMatrix());
                  let rhit = rBeam.hitRect(button.getGlobalMatrix());
                  if (lhit && !isNaN(lhit[0]) || rhit && !isNaN(rhit[0])) {
                     // Only trigger if selecting a NEW song
                     if (selectedSong !== i) {
                        console.log('SELECTED SONG:', i);
                        console.log('songInfo.length =', Object.keys(songInfo).length);
                        let currentTime = Date.now();
                        // Stop the currently playing song (if any)
                        if (currentTime - lastSongChangeTime > 500) {
                           if (selectedSong !== -1) {
                              stopSong();
                           }
                           
                           // Start the new song from the beginning
                           playSong(i);
                           playCustomSound('songSelectSound');
                           for (let t of tracks) fadeIn(t.track);
                           fadeOut(songSelect);
                           currentMenu = 'playingSong';
                           isSongPlaying = true;
                           selectedSong = i;
                           /*DEBUGGER CODE*/
                           lastSongChangeTime = currentTime - (startAt * 1000);
                           /*END DEBUGGER CODE*/
                           totalPausedTime = 0;
                           isPaused = false;

                           for (let b of activeBalls) {
                              b.obj.opacity(0);
                              b.obj.parent().remove(b.obj);
                           }
                           activeBalls = [];
                           currentScore = 0;
                           missedObjects = 0;

                           let songKey = Object.keys(songInfo)[i];
                           let songData = songInfo[songKey];

                           if (songData && songData.map) {
                              for (let obstacle of songData.map) {
                                 addBall(obstacle.track, obstacle.color, obstacle.dir,
                                    obstacle.gridPos, obstacle.beat, obstacle.bpm ||songData.bpm, obstacle.speed);
                              }
                           }
                        }
                     }
                     // If selectedSong === i, do nothing!
                  }
               }
               break;
            case ('pauseMenu'):
               let resumeButton = pauseMenu.child(0);
               let quitButton = pauseMenu.child(1);

               let lhitResume = lBeam.hitRect(resumeButton.getGlobalMatrix());
               let rhitResume = rBeam.hitRect(resumeButton.getGlobalMatrix());

               if (lhitResume && !isNaN(lhitResume[0]) || rhitResume && !isNaN(rhitResume[0])) {
                  isPaused = false;
                  currentMenu = 'playingSong';
                  totalPausedTime += Date.now() - lastPauseTime;
                  fadeOut(pauseMenu);
                  resumeAudio();
                  return;
               }

               let lhitQuit = lBeam.hitRect(quitButton.getGlobalMatrix());
               let rhitQuit = rBeam.hitRect(quitButton.getGlobalMatrix());

               if (lhitQuit && !isNaN(lhitQuit[0]) || rhitQuit && !isNaN(rhitQuit[0])) {
                  isPaused = false;
                  currentMenu = 'songSelect';
                  selectedSong = -1;
                  isSongPlaying = false;
                  stopSong();
                  playSong(3);
                  selectedSong = 3;
                  fadeOut(pauseMenu);
                  fadeIn(songSelect);
                  for (let t of tracks) fadeOut(t.track);
                  for (let b of activeBalls) {
                     b.obj.opacity(0);
                     b.obj.parent().remove(b.obj);
                  }
                  activeBalls = [];
                  return;
               }
               break;
         }
      }
   }
    
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
                .opacity(isSongPlaying ? .5 : 0);
      }
      
      if (controllerMatrix.right) {
         rHitbox.identity()
                .setMatrix(controllerMatrix.right)
                .move(0, 0, -0.5)
                .scale(0.04, 0.04, 0.5)
                .opacity(isSongPlaying ? .5 : 0);
      }

      // Render tracks
      renderTracks(tracks);

      // Render menus:

      // Menu 1: Start menu
      renderStartMenu(startMenu);

      // Menu 2: Song select
      renderSongSelect(songSelect, songs);

      // Menu 3: Playing UI
      renderPlayingSong(playingSong);

      // Menu 4: Pause menu
      renderPauseMenu(pauseMenu);

      let isAPressed = buttonState.right[4] ? buttonState.right[4].pressed : false;
      if (isAPressed && !wasAPressed && currentMenu === 'playingSong') {
         currentMenu = 'pauseMenu';
         isPaused = true;
         lastPauseTime = Date.now();
         pauseAudio();
         fadeIn(pauseMenu);
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

         //let color = b.hit > 0 ? lit[i&3] : unlit[i&3];
         //let color = b.hit > 0 ? lit[b.color&3] : unlit[b.color & 3]
         b.obj.color(b.color).identity().move(b.p).scale(b.r);
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
         opacity = currentMenu === 'playingSong' ? opacity : 0;
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

   let renderStartMenu = (startMenu) => {
      lBeam.update();
      rBeam.update();
      let pi = Math.PI;
      startMenu.identity().move(0,2.5,-1).scale(1,.5,1).turnY(pi).turnX(-pi/16);

      let button = startMenu.child(0);
      let text = button.child(0);

      // track aiming within start menu
      let lhit = lBeam.hitRect(button.getGlobalMatrix());
      let rhit = rBeam.hitRect(button.getGlobalMatrix());
      let isHitL = lhit && !isNaN(lhit[0]);
      let isHitR = rhit && !isNaN(rhit[0]);
      if (isHitL || isHitR) {
         button.color('yellow');
         if (isHitR) vibrate('right', .4);
         if (isHitL) vibrate('left', .4);
      }
      else button.color('white');

      // render button
      button.identity().move(0,0,-.001).scale(.9,.2,.9);

      let textScale = 3;
      let Sx = textScale / 0.9;
      let Sy = textScale / 0.1;
      let Sz = textScale / 0.9;
      let startMenuText = "Start XRCising"
      let textWidthInLocal = startMenuText.length * 0.0127 * Sx;
      let textHeightInLocal = 0.0254 * Sy;

      text.identity()
         .move(textWidthInLocal / 2, textHeightInLocal / 2, -.005)
         .turnY(pi)
         .scale(Sx, Sy, Sz)
         .color('black');
   }

   let renderSongSelect = (songSelect, songs) => {
      lBeam.update();
      rBeam.update();
      let pi = Math.PI;
      songSelect.identity().move(0,2.5,-1).scale(1,.5,1).turnY(pi).turnX(-pi/16)
         .color('red');
      
      // Color song button yellow if selected
      for (let i = 0; i < songs.length; i++) {
         if (i < page * pageLength || i >= (page + 1) * pageLength) {
            continue;
         }
         let button = songSelect.child(i);
         let text = button.child(0);

         let lhit = lBeam.hitRect(button.getGlobalMatrix());
         let rhit = rBeam.hitRect(button.getGlobalMatrix());

         if (lhit && !isNaN(lhit[0]) || rhit && !isNaN(rhit[0])) {
            button.color('yellow');
         }
         else {
            button.color('white');
         }
      }

      // Render song names
      for (let i = 0; i < songs.length; i++) {
         // Do not render songs that are not on the current page
         if (i < page * pageLength || i >= (page + 1) * pageLength) {
            songSelect.child(i).opacity(0);
            // TODO: move song button behind menu so that we cannot select it
            continue;
         }
         let button = songSelect.child(i).opacity(null);
         let text = button.child(0);
         // account for page offset
         button.identity().move(0,-.5*(i - page * pageLength)+.5,-.001).scale(.9,.2,.9);

         let textScale = 3;
         let Sx = textScale / 0.9;
         let Sy = textScale / 0.1;
         let Sz = textScale / 0.9;
         let songName = truncateString(songs[i], 40);
         let textWidthInLocal = songName.length * 0.0127 * Sx;
         let textHeightInLocal = 0.0254 * Sy;

         text.identity()
            .move(textWidthInLocal / 2, textHeightInLocal / 2, -.005)
            .turnY(pi)
            .scale(Sx, Sy, Sz)
            .color('black');
      }

      // Render page navigation buttons
      let prevPageButton = songSelect.child(songs.length);
      let nextPageButton = songSelect.child(songs.length + 1);
      prevPageButton.identity().move(0,.85,-.001).scale(.2,.1,.2)
         .color('blue');
      nextPageButton.identity().move(0,-.85,-.001).scale(.2,.1,1)
         .color('blue');
      
      for (let i = 0; i < 2; i++) {
         let button = songSelect.child(songs.length + i);
         let lhit = lBeam.hitRect(button.getGlobalMatrix());
         let rhit = rBeam.hitRect(button.getGlobalMatrix());

         if (lhit && !isNaN(lhit[0]) || rhit && !isNaN(rhit[0])) {
            button.color('yellow');
         }
         else button.color('blue');
      }
   }

   let renderPlayingSong = (playingSong) => {
      if (currentMenu !== 'playingSong' && currentMenu !== 'pauseMenu') {
         playingSong.opacity(0);
         return;
      }
      playingSong.opacity(1);
      let pi = Math.PI;
      
      // elapsed time
      let elapsedMs = 0;
      if (isSongPlaying) {
         if (isPaused) {
            elapsedMs = lastPauseTime - lastSongChangeTime - totalPausedTime;
         } else {
            elapsedMs = Date.now() - lastSongChangeTime - totalPausedTime;
         }
      }
      let elapsedSeconds = Math.floor(elapsedMs / 1000);
      let m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
      let s = String(elapsedSeconds % 60).padStart(2, '0');
      let timeStr = `${m}:${s}`;
      
      while (playingSong.nChildren() > 0) {
         playingSong.remove(0);
      }

      let panel = playingSong.add('roundedSquare').color('white');
      
      let scoreStr = `Score: ${currentScore}`;
      let comboStr = `Combo: ${currentCombo}x`;
      let missesStr = `Misses: ${missedObjects}`;
      let timeString = `Time: ${timeStr}`;

      let scoreText = panel.add(clay.text(scoreStr)).color('black');
      let comboText = panel.add(clay.text(comboStr)).color('black');
      let missesText = panel.add(clay.text(missesStr)).color('black');
      let timeText = panel.add(clay.text(timeString)).color('black');

      // 5. Position the menu to the left of Track 0
      // We add `pi` to flip it around to face the user, then subtract pi/8 to angle it inward
      playingSong.identity()
         .move(1.5, 2, -1.0) 
         .scale(0.8, 0.4, 1)    
         .turnY(pi - pi / 8);

      // Position the white inner panel
      panel.identity()
         .move(0, 0, -.001)
         .scale(0.9, 0.8, 0.9);

      // 6. Scale and position the text lines inside the panel
      let textScale = 3;
      let Sx = textScale / 0.9;
      let Sy = textScale / 0.8;
      let Sz = textScale / 0.9;

      // Helper to center the text by calculating its local width
      let getWidth = (str) => str.length * 0.0127 * Sx;

      scoreText.identity().move(getWidth(scoreStr) / 2,  0.3, -.005).turnY(pi).scale(Sx, Sy, Sz);
      comboText.identity().move(getWidth(comboStr) / 2,  0.1, -.005).turnY(pi).scale(Sx, Sy, Sz);
      missesText.identity().move(getWidth(missesStr) / 2,  0.0, -.005).turnY(pi).scale(Sx, Sy, Sz);
      timeText.identity().move(getWidth(timeString) / 2, -0.3, -.005).turnY(pi).scale(Sx, Sy, Sz);
   }

   let renderPauseMenu = (pauseMenu) => {
      if (currentMenu !== 'pauseMenu') {
         pauseMenu.opacity(0);
         for (let i = 0; i < pauseMenu.nChildren(); i++) pauseMenu.child(i).opacity(0);
         return;
      }
      pauseMenu.opacity(1);
      for (let i = 0; i < pauseMenu.nChildren(); i++) pauseMenu.child(i).opacity(1);
      lBeam.update();
      rBeam.update();

      let pi = Math.PI;
      // Position the pause menu in front of the user
      pauseMenu.identity().move(0, 1.5, -1).scale(1, 0.5, 1).turnY(pi);
      pauseMenu.color('blue');

      let resumeButton = pauseMenu.child(0);
      let quitButton = pauseMenu.child(1);

      let lhitResume = lBeam.hitRect(resumeButton.getGlobalMatrix());
      let rhitResume = rBeam.hitRect(resumeButton.getGlobalMatrix());
      if (lhitResume && !isNaN(lhitResume[0]) || rhitResume && !isNaN(rhitResume[0])) {
         resumeButton.color('yellow');
      } else {
         resumeButton.color('white');
      }

      let lhitQuit = lBeam.hitRect(quitButton.getGlobalMatrix());
      let rhitQuit = rBeam.hitRect(quitButton.getGlobalMatrix());
      if (lhitQuit && !isNaN(lhitQuit[0]) || rhitQuit && !isNaN(rhitQuit[0])) {
         quitButton.color('yellow');
      } else {
         quitButton.color('white');
      }

      resumeButton.identity().move(0, 0.4, -0.001).scale(0.8, 0.3, 0.9);
      quitButton.identity().move(0, -0.4, -0.001).scale(0.8, 0.3, 0.9);

      let textScale = 3;
      let Sx = textScale / 0.8;
      let Sy = textScale / 0.3;
      let Sz = textScale / 0.9;
      
      let getWidth = (str) => str.length * 0.0127 * Sx;

      let resumeT = resumeButton.child(0);
      resumeT.identity()
         .move(getWidth("Resume") / 2, 0.0254 * Sy / 2, -0.005)
         .turnY(pi)
         .scale(Sx, Sy, Sz)
         .color('black');

      let quitT = quitButton.child(0);
      quitT.identity()
         .move(getWidth("Quit") / 2, 0.0254 * Sy / 2, -0.005)
         .turnY(pi)
         .scale(Sx, Sy, Sz)
         .color('black');

      while (pauseMenu.nChildren() > 2) {
         pauseMenu.remove(2);
      }
      
      let elapsedMs = Math.max(0, lastPauseTime - lastSongChangeTime - totalPausedTime);
      let elapsedSeconds = Math.floor(elapsedMs / 1000);
      let m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
      let s = String(elapsedSeconds % 60).padStart(2, '0');
      let timeStr = `${m}:${s}`;

      let timeText = pauseMenu.add(clay.text(timeStr)).color('white');
      
      // text local size based on textScale
      let tSx = 2;
      let timeWidth = getWidth(timeStr) * (tSx / Sx); // approx width
      
      timeText.identity()
         .move(0.9, 0.8, -0.005) // top right
         .turnY(pi)
         .scale(tSx, tSx, tSx);
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

   let fadeOut = (object) => {
      let currentOpacity = object.get('opacity') ?? 1;
      
      object.animate(() => {
         // Use model.deltaTime continuously inside the loop
         currentOpacity -= model.deltaTime * 4; 
         
         if (currentOpacity <= 0) {
            currentOpacity = 0;
            object.animate(null); // Stop the animation
         }
         object.opacity(currentOpacity);
      });
   }

   let fadeIn = (object) => {
      let currentOpacity = object.get('opacity') ?? 0; // Better to start from 0 if undefined
      
      object.animate(() => {
         // Use model.deltaTime continuously inside the loop
         currentOpacity += model.deltaTime * 4; 
         
         if (currentOpacity >= 1) {
            currentOpacity = 1;
            object.animate(null); // Stop the animation
         }
         object.opacity(currentOpacity);
      });
   }
}
