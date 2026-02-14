/*
   This scene is an example of how to use procedural texture
   to animate the shape of an object. In this case the object
   is a waving flag. The noise function is used to animate
   the position of each vertex of the flag geometry.
*/

import * as cg from "../render/core/cg.js";
import * as pieceMeshBuilder from "./piece_mesh_builder.js"

export const init = async model => {

   // DEFINE A NEW TERRAIN OBJECT TYPE AS A 30x20 GRID.

   clay.defineMesh('myTerrain', clay.createGrid(30, 20));
   clay.defineMesh('queen', pieceMeshBuilder.queenMesh);
   clay.defineMesh('pawn', pieceMeshBuilder.pawnMesh);

   // LOAD A CHECKERBOARD TEXTURE FOR IT.

   model.txtrSrc(1, '../media/textures/chessboard.png');

   // INSTANTIATE THE NEW TERRAIN OBJECT.

   let terrain = model.add('myTerrain').txtr(1);
   

   let sphere = terrain.add('sphere');
   sphere.color('yellow');

   let queen = terrain.add('queen');//.color('green');
   queen.color('green');
   

   
   // MOVE THE OBJECT INTO PLACE.

   terrain.identity().move(-.4,1.5,0).scale(.4);
   //queen.identity().move(-.4,1.5,0).scale(.4);

   model.animate(() => {
      let sin = Math.sin;
      let cos = Math.cos;
      let t = model.time;

      // SIMULATE THE APPEARANCE OF A BILLOWING FLAG.

      terrain.setVertices((u,v) => {

         // 


         return [ 3*u,
                  2*v-1,
                  .4 * u * cg.noise(3*u-t,3*v,t)
                ];
      });

      sphere.identity()
      //.move(3*u,2*v-1,0)
      .scale(.05)
      .move(60/**Math.abs(sin(t))*/,0,0);

      //sphere.identity()
      //.move(-60,0,0);
      queen.identity()
         .scale(.4)
         .move(0,0,2)
         .turnX(t);
   });
}

