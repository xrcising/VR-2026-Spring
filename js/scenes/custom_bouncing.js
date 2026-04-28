// In class practice creating surfaces for ball to bounce on

/*
   This scene shows how to animate a ball with simple physics.
   The ball is affected by gravity, and whenever it hits a
   wall it bounces off the wall.
*/

export const init = async model => {

   // MAKE A RED BALL.

   model.txtrSrc(1, '../media/textures/chessboard.png');

   let ball = model.add('sphere').color('red');
   let surface1 = model.add('square').txtr(1);
   let surface2 = model.add('square').color('yellow');
   let surface3 = model.add('square').color('orange');

   // INITIALIZE POSITION, VELOCITY AND GRAVITY.

   let x = 0;
   let y = 0;

   let dx = .1;
   let dy = .1;

   let gravity = -.003;

   model.move(0,1.7,0).animate(() => {

      // PLACE THE BALL.

      ball.identity().move(.1*x,.1*y,0).scale(.1);

      surface1.identity()
         .turnX(-Math.PI/2)
         .move(0,0,-.5);
      
      surface2.identity()
         .turnY(Math.PI/2)
         .move(0,0,-.5);
      surface3.identity()
         .turnY(-Math.PI/2)
         .move(0,0,-.5);

      // MOVE THE BALL TO ITS NEXT POSITION.

      x += dx;
      y += dy;

      // APPLY GRAVITY.

      dy += gravity;

      // IF THE BALL HITS A WALL, REVERSE VELOCITY.

      if (x > 4 || x < -4)
        dx = -dx;
      if (y < -4)
        dy = -dy * .999;
   });
}

