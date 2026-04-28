// Homework 1: Cubes moving on the ground with plane flying around
// Homework 2: Allow the user to grab and throw the plane in XR mode

import * as cg from "../render/core/cg.js";
import { controllerMatrix } from "../render/core/controllerInput.js";

export const init = async model => {
  
    let ground = model.add('square');
    let plane = model.add('coneZ');
    let planeBody = plane.add('tubeZ');
    let planeWings = planeBody.add('diskY');

    // trying to change wing color if controllers point at them
    // let lHit = lcb.hitLabel(planeWings);
    // let rHit = rcb.hitLabel(planeWings);

    //let box = ground.add('cube'); // box laying on the ground
    //let treeTrunk = ground.add('tubeX');
    for ( let n = 0; n < 64; n++) {
      ground.add('cube');
    }
    for ( let n = 0; n < 64; n++) {
      ground.child(n).color(.2+.2*n%2,.2+.2*n%2,1);
      //ground.child(n).txtr(2);
      // ground.child(n).add('sphere');
      // ground.child(n).child(0).color(.2,.2,.2);
    }

    //plane.color(0,1,2);
    //planeBody.color(0,1,2);
    //planeWings.color(0,1,2);

    // Assign grass texture to texture slot 1
    //model.txtrSrc(1, '../media/textures/green-grass-background-debug.jpg');
    model.txtrSrc(1, '../media/textures/chessboard.png');
    model.txtrSrc(2, '../media/gltf/box-gltf/andrey-haimin-q2Fyzn-KJOQ-unsplash.jpg')
    model.txtrSrc(3, '../media/textures/')

    // Create ground as a square
    //ground.add('square');
    ground.txtr(1);
    //ground.color(.2, .2, .2);

    // Create box as a cube
    //box.add('cube');
    //box.txtr(2);
    //box.color(.5, .2, .5);

    //treeTrunk.txtr(2);

    let isGreen = false;
    let isDragging = false;
    let isReleased = false;
    let xPos = 0, yPos = 0, zPos = 0;

    // every 100ms, calculate position of left hand
    let xPos1 = 0, yPos1 = 0, zPos1 = 0;
    let xPos2 = 0, yPos2 = 0, zPos2 = 0;
    let releaseSpeed = 0;
    let thrownMatrix = null;
    let thrownStartTime = null; // set when throw starts so we can use elapsed time
    
    let calculateSpeed = hand => {
      xPos1 = xPos2;
      yPos1 = yPos2;
      zPos1 = zPos2;
      xPos2 = inputEvents.pos(hand)[0];
      yPos2 = inputEvents.pos(hand)[1];
      zPos2 = inputEvents.pos(hand)[2];
      return Math.sqrt((xPos2 - xPos1)**2 + (yPos2 - yPos1)**2 + (zPos2 - zPos1)**2);
    }
    inputEvents.onMove    = hand => { }
    inputEvents.onPress   = hand => { 
      isGreen = true; 
      // reset plane flying
      if (hand == 'right') {
        isReleased = false;
        thrownStartTime = null;
      }
    }
    inputEvents.onDrag    = hand => {
      // calculate speed of left hand
      releaseSpeed = 250*calculateSpeed('left');
     
      if (hand == 'left') {
        isDragging = true;
        xPos = inputEvents.pos(hand)[0]; 
        yPos = inputEvents.pos(hand)[1]; 
        zPos = inputEvents.pos(hand)[2];
      }
    }
    inputEvents.onRelease = hand => { 
      isGreen = false; 
      isDragging = false;
      // throw plane
      if (hand == 'left') {
        isReleased = true;
        thrownStartTime = null; // next frame we'll set it to t
      }
    }
    inputEvents.onClick   = hand => { }

    // Render square
    model.move(0,0,0).scale(1).animate(() => {
      let sin = Math.sin;
      let cos = Math.cos;
      let t = model.time;

      plane.color(isGreen ? 0 : 1, isGreen ? 2 : 1, 0);
      planeBody.color(isGreen ? 0 : 1, isGreen ? 2 : 1, 0);
      planeWings.color(isGreen ? 0 : 1, isGreen ? 2 : 1, 0);

      ground.identity()
        .move(0,0,0)
        .turnX(-Math.PI/2)
        //.scale(2,1,1)
        //.turnZ(.5*model.time);
      
      var heights = [];
      
      // draw cubes on board
      for ( let n = 0; n < 64; n++) {
        heights[n] = .125*cg.noise(sin(t+n),cos(t+n),4);//sin(t+n));
        let row = n / 8 >> 0;
        let col = n % 8;
        ground.child(n).identity()
          .move(.25*(col+1)-1.125,.25*(row+1)-1.125,Math.abs(heights[n]))
          .scale(.125,.125,Math.abs(heights[n]))
        // ground.child(n).child(0).identity()
        //   .move(1,0,0)
        //   .scale(1,1,1);
      }
      // box.identity()
      //   .move(-.125,-.125,.4)
      //   .scale(.125,.125,.4);

      // treeTrunk.identity().turnZ(t)
      //   .move(1,0,.1)
      //   .scale(.17,.1,.1)
      //   .turnX(-5*t);

      // draw plane above ground (if not clicking)
      if (!isDragging && !isReleased) {
        plane.identity().turnY(-t)
          .move(1, .5, 0)//cg.noise(0,2.5*t,4))
          .turnZ(Math.PI/5)
          .scale(.01,.01,.1);
      } else if (isDragging) {
        // place plane at left controller position
          plane.identity()
            .setMatrix(controllerMatrix.left)
            .turnX(-Math.PI/5)
            .turnY(Math.PI)
            .move(0,0,.2)
            //.turnZ(Math.PI/3)
            .scale(.01,.01,.1);
          thrownMatrix = plane.getMatrix();
      } else if (isReleased) {
        if (thrownStartTime === null) thrownStartTime = t;
        let dt = t - thrownStartTime;
        //releaseSpeed = .5;
        let wind = cg.noise(0,0,dt)
        plane.setMatrix(thrownMatrix)
          .move(20*sin(.5*dt), 10*sin(dt), releaseSpeed * dt)
          .turnZ(wind)
          .move(0,-4.9*dt,0);
      }
      
      planeBody.identity()
          .move(0,0,-1)

      planeWings.identity()
        .scale(25,1,.5)
        //.turnY(Math.PI/2);

      //console.log(plane)


    });
}