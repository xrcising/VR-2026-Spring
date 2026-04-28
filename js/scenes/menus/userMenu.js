import { G2 } from "../../util/g2.js";

export function initUserMenu(model, textureId) {
   let g2Menu = new G2(false, 1920, 360);
   model.txtrSrc(textureId, g2Menu.getCanvas());
   
   // Renders above the current three menus
   let objMenu = model.add('square').txtr(textureId).move(0, 3, -2.8).scale(1.6, .3, 1);
   
   g2Menu.render = function() {
      this.setColor('#1d1d1d').fillRect(-1,-1,2,2, .1);
      
      let username = (window.sharedState && window.sharedState.username) ? window.sharedState.username : "Guest";
      
      this.setColor('white').textHeight(.4);
      this.text(`Welcome, ${username}`, 0, 0, 'center');
   }

   g2Menu.setFont('Times New Roman, "Font Awesome 6 Free", "Font Awesome 5 Free", "FontAwesome"');
   g2Menu.value = [.5,.5];
   
   return {
      g2: g2Menu,
      obj: objMenu
   };
}
