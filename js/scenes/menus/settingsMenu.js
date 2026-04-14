import { G2 } from "../../util/g2.js";
import { Router } from "../routes/routes.js";

export function initSettingsMenu(model, textureId, onColorChange) {
   let g2Menu = new G2(false, 1920, 1080);
   model.txtrSrc(textureId, g2Menu.getCanvas());
   let objMenu = model.add('square').txtr(textureId).move(0, 1.6, -2.8).scale(1.6, .9, 1);

   g2Menu.setFont('Times New Roman, "Font Awesome 6 Free", "Font Awesome 5 Free", "FontAwesome"');
   
   let leftColorPicker = g2Menu.addWidget(objMenu, 'colorpicker', -.5, -.1, '#ff8080', 'left_color:', value => {
      if (onColorChange) onColorChange('left', value);
   }, 1.5);

   let rightColorPicker = g2Menu.addWidget(objMenu, 'colorpicker', .5, -.1, '#ff8080', 'right_color:', value => {
      if (onColorChange) onColorChange('right', value);
   }, 1.5);

   let homeBtn = g2Menu.addWidget(objMenu, 'button', -.8, .8, '#f44336', ['\uf015'], value => {
      Router.navigate('startMenu');
   }, 1.2, .2);

   g2Menu.render = function() {
      this.setColor('#1d1d1d').fillRect(-1,-1,2,2, .1);
      this.setColor('white').textHeight(.15);
      this.text('SETTINGS', 0, .7, 'center');
   }

   return {
      g2: g2Menu,
      obj: objMenu
   };
}