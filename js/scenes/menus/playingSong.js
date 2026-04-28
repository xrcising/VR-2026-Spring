import { G2 } from "../../util/g2.js";
import { Router } from "../routes/routes.js";

export function initPlayingSong(model, textureId, getGameState) {
   let g2Menu = new G2(false, 1920, 1080);
   model.txtrSrc(textureId, g2Menu.getCanvas());
   let objMenu = model.add('square').txtr(textureId).move(0, 2.2, -0.8).turnX(Math.PI/4).move(0,0,-.5).scale(.8, .45, 1);

   g2Menu.setFont('Times New Roman, "Font Awesome 6 Free", "Font Awesome 5 Free", "FontAwesome"');
   g2Menu.render = function() {
      if (Router.currentRoute !== 'playingSong' && Router.currentRoute !== 'pauseMenu') {
         this.clear();
         return;
      }
      this.setColor('#1d1d1d').fillRect(-1,-1,2,2, .1);
      
      let state = getGameState();
      
      let elapsedSeconds = Math.floor(state.elapsedMs / 1000);
      let m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
      let s = String(elapsedSeconds % 60).padStart(2, '0');
      let timeStr = `${m}:${s}`;
      
      this.setColor('white').textHeight(.15);
      this.text(`Score: ${state.score}`, 0, .6, 'center');
      this.text(`Combo: ${state.combo}x`, 0, .2, 'center');
      this.text(`Misses: ${state.misses}`, 0, -.2, 'center');
      this.text(`Time: ${timeStr}`, 0, -.6, 'center');
   }

   return {
      g2: g2Menu,
      obj: objMenu
   };
}