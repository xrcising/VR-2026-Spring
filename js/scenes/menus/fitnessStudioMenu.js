import { G2 } from "../../util/g2.js";
import { Router } from "../routes/routes.js";

export function initFitnessStudioMenu(model, textureId, onStart) {
   let g2Menu = new G2(false, 1920, 1080);
   model.txtrSrc(textureId, g2Menu.getCanvas());
   
   let objMenu = model.add('square').txtr(textureId).move(3.2, 1.6, -1.8).turnY(-Math.PI/5).scale(1.6, .9, 1);
   
   let gamePic = new Image();
   gamePic.src = 'media/thumbnails/fitness-studio.jpeg';

   g2Menu.render = function() {
      this.setColor('#1d1d1d').fillRect(-1,-1,2,2, .1);

      // Top half slot for a picture of the game
      this.setColor('#111').fillRect(-.9, .05, 1.8, .9, .05);
      if (gamePic.complete && gamePic.naturalWidth > 0) {
         this.drawImage(gamePic, 0, .5, 1.7, .8);
      } else {
         this.setColor('#555').textHeight(.05);
         this.text('[ Game Picture Slot ]', 0, .5, 'center');
      }

      // Title
      this.setColor('white').textHeight(.12);
      this.text('Fitness Studio, ver. 0.1', 0, -.15, 'center');

      //if (this.icon) {
      //   this.setColor('blue').icon('f70c', -.7, .15, .15, 'center'); // Running icon
      //   this.setColor('red').icon('f70c', .7, .15, .15, 'center');
      //}
   }

   g2Menu.setFont('Times New Roman, "Font Awesome 6 Free", "Font Awesome 5 Free", "FontAwesome"');
   g2Menu.value = [.5,.5];
   
   // Start button
   g2Menu.addWidget(objMenu, 'button', 0, -.45, '#ffffff', ['\uf04b'], value => {
      if (onStart) onStart();
      Router.navigate('fitnessStudio');
   }, 1.5);

   // Settings button
   g2Menu.addWidget(objMenu, 'button', 0, -.75, '#ffffff', ['\uf013'], value => {
      Router.navigate('settingsMenu');
   }, 1.5);

   return {
      g2: g2Menu,
      obj: objMenu
   };
}