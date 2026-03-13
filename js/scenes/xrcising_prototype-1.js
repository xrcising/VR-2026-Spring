import * as cg from "../render/core/cg.js";
import { loadSound, playSoundAtPosition } from "../util/positional-audio.js";
import { controllerMatrix } from "../render/core/controllerInput.js";

// LOAD ALL THE SOUNDS THAT WILL BE MADE WHEN BALLS BOUNCE.

let soundBuffer = [], loadSounds = [];
for (let i = 0 ; i < 6 ; i++)
   loadSounds.push(loadSound('../../media/sound/bounce/'+i+'.wav', buffer => soundBuffer[i] = buffer));
Promise.all(loadSounds);

// CREATE AN INITIAL POSITION FOR EVERY BALL.

let N = 50, p = [], hit = [], r = .05, R = Math.random, v = [];
let lo = [-2.8,r,-2.8], hi = [2.8,3-r,2.8];
for (let i = 0 ; i < N ; i++) {
   p.push([ lo[0] + (hi[0] - lo[0]) * R(),
            lo[1] + (hi[1] - lo[1]) * R(),
	    lo[2] + (hi[2] - lo[2]) * R() ]);
   v.push([.05 * (R()-.5), .05 * (R()-.5), .05 * (R()-.5)]);
   hit.push(0);
}

let unlit = [[1,.0,.0],[.8,.0,.4],[.8,.8,.0],[0.,.4,.8]];
let   lit = [[1,.5,.5],[1,.5,.75],[1.,1.,.5],[.6,.8,1.]];

export const init = async model => {
   let  playSound = i => playSoundAtPosition(soundBuffer[6*Math.random()>>0], p[i]);
   for (let i = 0 ; i < N ; i++)
      model.add('sphere');

   // Tennis racket
   let racket_handle = model.add('tubeY').color([.2,.2,.2]);
   let racket_face_up = racket_handle.add('diskX').color('white').opacity(.5);
   let racket_face_down = racket_handle.add('diskX').color('white').opacity(.5);
   let racket_border = racket_face_up.add('torusX').color([.2,.2,.2]).opacity(1);
   
   
    
   model.animate(() => {
      let pos;
      let bounce = i => {
	 v[i] = cg.add(v[i], cg.scale(cg.subtract(p[i],pos), .03/r));
	 hit[i] = 10;
	 playSound(i);
      }

      racket_handle.identity().setMatrix(controllerMatrix.left).turnX(-Math.PI/2).scale(.2).scale(.1, 1, .1);
      racket_face_up.identity().scale(.5/.1,1,1/.1).move(0,2,0);
      racket_face_down.identity().scale(1/.1,1,1/.1).move(0,2,0).turnY(Math.PI);
      racket_border.identity();

      // Logic for racket collision
      let MH = racket_handle.getGlobalMatrix();
      let MF = racket_face_up.getGlobalMatrix();

      // Handle segment (Capsule from handle start to face center)
      let H0 = cg.mTransform(MH, [0, -1, 0]);
      let H1 = cg.mTransform(MH, [0,  2, 0]); 
      let H_rad = 0.05;

      // Face (Disk/Cylinder)
      let F_C = cg.mTransform(MF, [0, 0, 0]);
      let F_N = cg.normalize(cg.subtract(cg.mTransform(MF, [1, 0, 0]), F_C));
      let F_rad = 0.22; // Radius of racket head
      let F_th  = 0.04; // Thickness of racket head

      for (let i = 0; i < N; i++) {
         let P = p[i];

         // Check Handle Collision
         let AB = cg.subtract(H1, H0);
         let AP = cg.subtract(P, H0);
         let t = Math.max(0, Math.min(1, cg.dot(AP, AB) / cg.dot(AB, AB)));
         let Q = cg.add(H0, cg.scale(AB, t));
         
         if (cg.distance(P, Q) < H_rad + r) {
            pos = Q;
            bounce(i);
            continue;
         }

         // Check Face Collision
         let V = cg.subtract(P, F_C);
         let d_dot = cg.dot(V, F_N);
         let V_proj = cg.subtract(V, cg.scale(F_N, d_dot));
         let d_par = cg.norm(V_proj);

         if (Math.abs(d_dot) < F_th + r && d_par < F_rad + r) {
            // Closest point on the face plane
            pos = cg.add(F_C, d_par > F_rad ? cg.scale(cg.normalize(V_proj), F_rad) : V_proj);
            bounce(i);
         }
      }


      for (let hand in {left:0, right:0}) {   // BOUNCE OFF A HAND
         if (pos = clientState.finger(clientID,hand,1))
            for (let i = 0 ; i < N ; i++)
	       if (cg.distance(p[i],pos) < r)
	          bounce(i);
      }
      let head = clientState.head(clientID);  // BOUNCE OFF HEAD
      if (Array.isArray(head)) {
         pos = head.slice(12,15);
         for (let i = 0 ; i < N ; i++)
	    if (cg.distance(p[i],pos) < r+.15)
	       bounce(i);
      }
      for (let i = 0 ; i < N-1 ; i++)        // BOUNCE OFF ANOTHER BALL
      for (let j = i+1 ; j < N ; j++)
	 if (cg.distance(p[i],p[j]) < 2 * r) {
	    let a = cg.mix(v[i],v[j],.5);
            let d = cg.normalize(cg.subtract(p[j], p[i]));
	    v[i] = cg.add(v[i], cg.scale(d, -2 * cg.dot(v[i], d)));
	    v[j] = cg.add(v[j], cg.scale(d, -2 * cg.dot(v[j], d)));
	    let b = cg.mix(v[i],v[j],.5);
	    let c = cg.scale(cg.subtract(a,b),.5);
	    v[i] = cg.add(v[i], cg.add(c, cg.scale(d,-.01)));
	    v[j] = cg.add(v[j], cg.add(c, cg.scale(d, .01)));
            hit[i] = 10;
            hit[j] = 10;
	    if (Math.random() < 1/10)
	       playSound(i);
	 }
      for (let i = 0 ; i < N ; i++)         // BOUNCE OFF WALLS
         for (let j = 0 ; j < 3 ; j++) {
            if (p[i][j] < lo[j]) v[i][j] =  Math.abs(v[i][j]);
            if (p[i][j] > hi[j]) v[i][j] = -Math.abs(v[i][j]);
         }
      for (let i = 0 ; i < N ; i++) {       // MOVE EACH BALL BY ITS VELOCITY
         v[i][1] -= .02 * model.deltaTime;
         v[i] = cg.scale(v[i], .992);
         p[i] = cg.add(p[i], v[i]);
      }
      for (let i = 0 ; i < N ; i++)
         model.child(i).color(hit[i]-- > 0 ? lit[i&3] : unlit[i&3]).identity().move(p[i]).scale(r);
   });
}
