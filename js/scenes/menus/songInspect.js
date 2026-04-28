import { G2 } from "../../util/g2.js";
import { Router } from "../routes/routes.js";
import { songInfo, songs } from "../songInfo.js";

let truncateString = (str, maxLength) => {
   return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

export function initSongInspect(model, textureId, onPlay) {
   let g2Menu = new G2(false, 1920, 1080);
   model.txtrSrc(textureId, g2Menu.getCanvas());
   let objMenu = model.add('square').txtr(textureId).move(0, 1.6, -2.8).scale(1.6, .9, 1);

   g2Menu.setFont('Times New Roman, "Font Awesome 6 Free", "Font Awesome 5 Free", "FontAwesome"');

   let currentSongIndex = 0;

   let playBtn = g2Menu.addWidget(objMenu, 'button', 0.4, -0.6, '#4CAF50', ['Play'], value => {
      onPlay(currentSongIndex);
      Router.navigate('playingSong');
   }, 1);

   let backBtn = g2Menu.addWidget(objMenu, 'button', -0.4, -0.6, '#f44336', ['Back'], value => {
      Router.navigate('songSelect');
   }, 1);

   g2Menu.render = function() {
      this.setColor('#1d1d1d').fillRect(-1,-1,2,2, .1);
      this.setColor('white').textHeight(.12);
      
      let title = "Unknown Song";
      let bpm = "N/A";
      let speed = "N/A";
      let totalObstacles = 0;
      let bestScore = 0;

      if (currentSongIndex < songs.length) {
         let songKey = Object.keys(songInfo)[currentSongIndex];
         let songData = songInfo[songKey];
         if (songData) {
            title = songData.name || songs[currentSongIndex];
            bpm = songData.bpm || "N/A";
            
            if (songData.map && songData.map.length > 0) {
               totalObstacles = songData.map.length;
               speed = songData.map[0].speed || "N/A";
            }
            
            if (songData.leaderboard && songData.leaderboard.length > 0) {
               // Assuming leaderboard contains objects with score
               bestScore = songData.leaderboard[0].score || songData.leaderboard[0] || 0;
            }
         } else {
            title = songs[currentSongIndex];
         }
      }

      this.text(truncateString(title, 40), 0, 0.7, 'center');
      
      this.textHeight(.08);
      this.text(`BPM: ${bpm}`, 0, 0.4, 'center');
      this.text(`Speed: ${speed}`, 0, 0.2, 'center');
      this.text(`Total Obstacles: ${totalObstacles}`, 0, 0.0, 'center');
      this.text(`Best Score: ${bestScore}`, 0, -0.2, 'center');
   }

   return {
      g2: g2Menu,
      obj: objMenu,
      setSong: (index) => {
         currentSongIndex = index;
      }
   };
}