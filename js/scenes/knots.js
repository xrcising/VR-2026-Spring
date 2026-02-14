import * as cg from "../render/core/cg.js";
export const init = async model => {
   let N = (t,a,b,c,d) =>
       cg.noise(.17 * a * Math.sin(2*Math.PI * t),
                .17 * b * Math.cos(2*Math.PI * t),
                .17 * c * Math.sin(2*Math.PI * (t + .2 * d * 4*model.time)));
   let f = t => [ N(t,3,3.3,3.6,.3), N(t,3.3,3.6,3,.25), N(t,3.6,3,3.3,.2) ];
   let wire = model.add(clay.wire(200,8)).move(0,1.6,0).scale(.7);
   model.animate(() => {
      clay.animateWire(wire, .025, f);
   });
}
