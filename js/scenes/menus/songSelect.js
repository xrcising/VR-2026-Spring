import { G2 } from "../../util/g2.js";
import { Router } from "../routes/routes.js";

let truncateString = (str, maxLength) => {
   return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

export function initSongSelect(model, textureId, songs, onInspectSong) {
   let g2Menu = new G2(false, 1920, 1080);
   model.txtrSrc(textureId, g2Menu.getCanvas());
   let objMenu = model.add('square').txtr(textureId).move(0, 1.6, -2.8).scale(1.6, .9, 1);

   g2Menu.setFont('Times New Roman, "Font Awesome 6 Free", "Font Awesome 5 Free", "FontAwesome"');
   
   let pageLength = 3;
   let page = 0;
   
   let songButtons = [];
   for (let i = 0; i < pageLength; i++) {
      let btn = g2Menu.addWidget(objMenu, 'button', 0, .4 - i * .4, '#ffffff', [''], value => {
         let actualIndex = page * pageLength + i;
         if (actualIndex < songs.length) {
            onInspectSong(actualIndex);
            Router.navigate('songInspect');
         }
      }, 1.3, 1.3, .3);
      songButtons.push(btn);
   }

   let prevBtn = g2Menu.addWidget(objMenu, 'button', .8, .3, '#2196F3', ['\uf062'], value => {
      if (page > 0) page--;
   }, 1, .2, .5);

   let nextBtn = g2Menu.addWidget(objMenu, 'button', .8, -.3, '#2196F3', ['\uf063'], value => {
      if (page < Math.floor(songs.length / pageLength)) page++;
   }, 1, .2, .5);

   let homeBtn = g2Menu.addWidget(objMenu, 'button', -.8, .8, '#f44336', ['\uf015'], value => {
      Router.navigate('startMenu');
   }, 1.2, .2);

   g2Menu.render = function() {
      this.setColor('#1d1d1d').fillRect(-1,-1,2,2, .1);
      this.setColor('white').textHeight(.12);
      this.text('Select Song', 0, .77, 'center');

      for (let i = 0; i < pageLength; i++) {
         let actualIndex = page * pageLength + i;
         if (actualIndex < songs.length) {
            songButtons[i].setLabel([truncateString(songs[actualIndex], 40)]);
         } else {
            songButtons[i].setLabel(['']); // Hides the button
         }
      }

      //if (page === 0) prevBtn.setLabel(['']);
      //else prevBtn.setLabel(['\uf062']);

      //if (page >= Math.floor((songs.length - 1) / pageLength)) nextBtn.setLabel(['']);
      //else nextBtn.setLabel(['\uf063']);
   }

   return {
      g2: g2Menu,
      obj: objMenu
   };
}