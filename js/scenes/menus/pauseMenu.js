import { G2 } from "../../util/g2.js";
import { Router } from "../routes/routes.js";

export function initPauseMenu(model, textureId, onResume, onQuit, getGameState) {
   let g2Menu = new G2(false, 1920, 1080);
   model.txtrSrc(textureId, g2Menu.getCanvas());
   let objMenu = model.add('square').txtr(textureId).move(0, 1.6, -1.8).scale(.8, .45, 1);

   g2Menu.setFont('Times New Roman, "Font Awesome 6 Free", "Font Awesome 5 Free", "FontAwesome"');
   
   g2Menu.addWidget(objMenu, 'button', 0, .2, '#4CAF50', ['Resume \uf04b'], value => {
      onResume();
      Router.navigate('playingSong');
   }, 1.5);

   g2Menu.addWidget(objMenu, 'button', 0, -.3, '#f44336', ['Quit \uf00d'], value => {
      onQuit();
      Router.navigate('songSelect');
   }, 1.5);

   g2Menu.render = function() {
      this.setColor('#1d1d1d').fillRect(-1,-1,2,2, .1);
      this.setColor('white').textHeight(.15);
      this.text('PAUSED', 0, .7, 'center');
      
      let state = getGameState();
      let elapsedSeconds = Math.floor(state.elapsedMs / 1000);
      let m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
      let s = String(elapsedSeconds % 60).padStart(2, '0');
      
      this.setColor('#aaa').textHeight(.08);
      this.text(`Time: ${m}:${s}`, .8, .8, 'right');
   }

   return {
      g2: g2Menu,
      obj: objMenu
   };
}