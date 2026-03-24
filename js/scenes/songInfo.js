export let songs = [
  "Rocky Road to Dublin - Sinners (2025)", 
  "Rasputin - Love The Way You Move (Funk Overload)", 
  "The Grid", 
  "[Song 4]", 
  "[Song 5]",
  "[Song 6]",
  "[Song 7]"];

export let songInfo = {
  rocky_road_to_dublin: {
     name: "Rocky Road to Dublin - Sinners (2025)",
     bpm: 134,
     // ChatGPT generated map
     map: [
        // intro taps
        { beat: 4, track: 0, gridPos: 12, color: 'blue', dir: 'down', speed: 4 },
        { beat: 6, track: 0, gridPos: 3, color: 'red', dir: 'down', speed: 4 },
        { beat: 8, track: 0, gridPos: 12, color: 'blue', dir: 'down', speed: 4 },
        { beat: 10, track: 0, gridPos: 3, color: 'red', dir: 'down', speed: 4 },
  
        // jig rhythm
        { beat: 14, track: 0, gridPos: 0, color: 'blue', dir: 'right', speed: 4 },
        { beat: 16, track: 0, gridPos: 15, color: 'red', dir: 'left', speed: 4 },
        { beat: 18, track: 0, gridPos: 1, color: 'blue', dir: 'down_right', speed: 4 },
        { beat: 20, track: 0, gridPos: 14, color: 'red', dir: 'down_left', speed: 4 },
  
        // alternating swing
        { beat: 24, track: 0, gridPos: 15, color: 'blue', dir: 'left', speed: 4 },
        { beat: 26, track: 0, gridPos: 0, color: 'red', dir: 'right', speed: 4 },
        { beat: 28, track: 0, gridPos: 12, color: 'blue', dir: 'up', speed: 4 },
        { beat: 30, track: 0, gridPos: 3, color: 'red', dir: 'up', speed: 4 },
  
        // burst section
        { beat: 34, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 34, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },
  
        { beat: 35.5, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 35.5, track: 0, gridPos: 15, color: 'red', dir: 'up_right', speed: 4 },
  
        { beat: 37, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 37, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },
  
        // melodic swings
        { beat: 40, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 42, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 44, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 46, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
  
        // jig burst
        { beat: 50, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 50, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },
  
        { beat: 51, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        { beat: 51, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
  
        { beat: 52, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 52, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },
  
        // alternating
        { beat: 56, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 58, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 60, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 62, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
  
        // double hits
        { beat: 66, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 66, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },
  
        { beat: 67.5, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        { beat: 67.5, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
  
        // cross body pattern
        { beat: 72, track: 0, gridPos: 0, color: 'blue', dir: 'right', speed: 4 },
        { beat: 74, track: 0, gridPos: 15, color: 'red', dir: 'left', speed: 4 },
        { beat: 76, track: 0, gridPos: 1, color: 'blue', dir: 'down_right', speed: 4 },
        { beat: 78, track: 0, gridPos: 14, color: 'red', dir: 'down_left', speed: 4 },
  
        // fast jig section
        { beat: 82, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 82, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },
  
        { beat: 83, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 83, track: 0, gridPos: 15, color: 'red', dir: 'up_right', speed: 4 },
  
        { beat: 84, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 84, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },
  
        // final alternating
        { beat: 90, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 92, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 94, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 96, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
  
        // ending doubles
        { beat: 100, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 100, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },
  
        { beat: 102, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        { beat: 102, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
  
        { beat: 104, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 104, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },
  
        { beat: 108, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 110, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 112, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 114, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
  
        // ending accent
        { beat: 118, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 118, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        // verse acceleration
        { beat: 120, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 122, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 124, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 126, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },

        // jig burst
        { beat: 128, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 128, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 129, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        { beat: 129, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },

        { beat: 130, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 130, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        // melodic swings
        { beat: 134, track: 0, gridPos: 0, color: 'blue', dir: 'right', speed: 4 },
        { beat: 136, track: 0, gridPos: 15, color: 'red', dir: 'left', speed: 4 },
        { beat: 138, track: 0, gridPos: 1, color: 'blue', dir: 'down_right', speed: 4 },
        { beat: 140, track: 0, gridPos: 14, color: 'red', dir: 'down_left', speed: 4 },

        // fast alternating
        { beat: 144, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 145.5, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 147, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 148.5, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },

        // doubles
        { beat: 150, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 150, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 151.5, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 151.5, track: 0, gridPos: 15, color: 'red', dir: 'up_right', speed: 4 },

        // vocal phrase hits
        { beat: 156, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 158, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 160, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 162, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },

        // jig burst again
        { beat: 166, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 166, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 167, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        { beat: 167, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },

        { beat: 168, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 168, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        // cross-body phrase
        { beat: 174, track: 0, gridPos: 0, color: 'blue', dir: 'right', speed: 4 },
        { beat: 176, track: 0, gridPos: 15, color: 'red', dir: 'left', speed: 4 },
        { beat: 178, track: 0, gridPos: 1, color: 'blue', dir: 'down_right', speed: 4 },
        { beat: 180, track: 0, gridPos: 14, color: 'red', dir: 'down_left', speed: 4 },

        // high-energy ending
        { beat: 184, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 184, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 186, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        { beat: 186, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },

        { beat: 188, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 188, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        // closing swings
        { beat: 192, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 194, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 196, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 198, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },

        // final accent
        { beat: 202, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 202, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 204, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        { beat: 204, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
  
     ],
     leaderboard: []
  },
  rasputin: {
     name: "Rasputin - Love The Way You Move (Funk Overload)",
     bpm: 229,
     map: [
        // clap clap clap
        { beat: 7, track: 0, gridPos: 0, color: 'blue', dir: 'no_direction', speed: 4, bpm: 228 },
        { beat: 8, track: 0, gridPos: 1, color: 'red', dir: 'no_direction', speed: 4, bpm: 228 },
        { beat: 9, track: 0, gridPos: 0, color: 'blue', dir: 'no_direction', speed: 4, bpm: 228 },
        // clap clap clap
        { beat: 13, track: 0, gridPos: 2, color: 'blue', dir: 'no_direction', speed: 4, bpm: 228},
        { beat: 14, track: 0, gridPos: 3, color: 'red', dir: 'no_direction', speed: 4, bpm: 228 },
        { beat: 15, track: 0, gridPos: 2, color: 'blue', dir: 'no_direction', speed: 4, bpm: 228 },
        // clap clap clap
        { beat: 19, track: 0, gridPos: 0, color: 'blue', dir: 'no_direction', speed: 4, bpm: 230 },
        { beat: 20, track: 0, gridPos: 1, color: 'red', dir: 'no_direction', speed: 4, bpm: 228 },
        { beat: 21, track: 0, gridPos: 0, color: 'blue', dir: 'no_direction', speed: 4, bpm: 228 },
        // clap clap clap
        { beat: 25, track: 0, gridPos: 2, color: 'blue', dir: 'no_direction', speed: 4, bpm: 228},
        { beat: 26, track: 0, gridPos: 3, color: 'red', dir: 'no_direction', speed: 4, bpm: 228 },
        { beat: 27, track: 0, gridPos: 2, color: 'blue', dir: 'no_direction', speed: 4, bpm: 228 },
        // clap clap clap
        { beat: 31, track: 0, gridPos: 0, color: 'blue', dir: 'no_direction', speed: 4, bpm: 228 },
        { beat: 32, track: 0, gridPos: 1, color: 'red', dir: 'no_direction', speed: 4, bpm: 228 },
        { beat: 33, track: 0, gridPos: 0, color: 'blue', dir: 'no_direction', speed: 4, bpm: 228 },
        // alternating section
        { beat: 37, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 40, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 43, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 46, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 49, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 52, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 55, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 58, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 61, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 64, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 67, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 70, track: 0, gridPos: 12, color: 'blue', dir: 'left', speed: 4 },
        { beat: 73, track: 0, gridPos: 3, color: 'blue', dir: 'up_right', speed: 4 },
        { beat: 76, track: 0, gridPos: 0, color: 'red', dir: 'up_left', speed: 4 },
        { beat: 79, track: 0, gridPos: 15, color: 'red', dir: 'right', speed: 4 },
        { beat: 82, track: 0, gridPos: 12, color: 'blue', dir: 'left', speed: 4 },
        { beat: 85, track: 0, gridPos: 15, color: 'red', dir: 'right', speed: 4 },
        { beat: 88, track: 0, gridPos: 0, color: 'red', dir: 'up_left', speed: 4 },
        //{ beat: 91, track: 0, gridPos: 3, color: 'blue', dir: 'up_right', speed: 4 },

        // two together
        //{ beat: 91, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        //{ beat: 91, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        //{ beat: 92.5, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        //{ beat: 92.5, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },

        { beat: 94, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 94, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 95.5, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 95.5, track: 0, gridPos: 15, color: 'red', dir: 'down_right', speed: 4 },

        { beat: 97, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 97, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 98.5, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        { beat: 98.5, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },

        { beat: 100, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 100, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 101.5, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 101.5, track: 0, gridPos: 15, color: 'red', dir: 'down_right', speed: 4 },

        { beat: 103, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 103, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 104.5, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        { beat: 104.5, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },

        { beat: 106, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 106, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 107.5, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 107.5, track: 0, gridPos: 15, color: 'red', dir: 'down_right', speed: 4 },

        { beat: 109, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 109, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 110.5, track: 0, gridPos: 12, color: 'blue', dir: 'down_left', speed: 4 },
        { beat: 110.5, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },

        { beat: 112, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 4 },
        { beat: 112, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 4 },

        { beat: 113.5, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 113.5, track: 0, gridPos: 15, color: 'red', dir: 'down_right', speed: 4 },

        // alternating again
        // alternating section
        { beat: 115, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 118, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 121, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 124, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 127, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 130, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 133, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 136, track: 0, gridPos: 12, color: 'red', dir: 'left', speed: 4 },
        { beat: 139, track: 0, gridPos: 3, color: 'red', dir: 'up_right', speed: 4 },
        { beat: 142, track: 0, gridPos: 0, color: 'blue', dir: 'up_left', speed: 4 },
        { beat: 145, track: 0, gridPos: 15, color: 'blue', dir: 'right', speed: 4 },
        { beat: 148, track: 0, gridPos: 12, color: 'blue', dir: 'left', speed: 4 },
        { beat: 151, track: 0, gridPos: 3, color: 'blue', dir: 'up_right', speed: 4 },
        { beat: 154, track: 0, gridPos: 0, color: 'red', dir: 'up_left', speed: 4 },
        { beat: 157, track: 0, gridPos: 15, color: 'red', dir: 'right', speed: 4 },
        { beat: 160, track: 0, gridPos: 12, color: 'blue', dir: 'left', speed: 4 },
        { beat: 163, track: 0, gridPos: 15, color: 'red', dir: 'right', speed: 4 },
        { beat: 166, track: 0, gridPos: 0, color: 'red', dir: 'up_left', speed: 4 },
     ],
     leaderboard: []
  },
  the_grid: {
     name: "The Grid",
     bpm: 117, // beat # = 1.95 beats/s x timestamp (in seconds)
     map: [
        // (00:00:000 - 0:08:000) intro, no obstacles
        { beat: 16.575, track: 0, gridPos: 8, color: 'blue', dir: 'left', speed: 7},
        { beat: 16.575, track: 0, gridPos: 11, color: 'red', dir: 'right', speed: 7},

        { beat: 33.35, track: 1, gridPos: 13, color: 'blue', dir: 'down', speed: 7},
        { beat: 35.1, track: 1, gridPos: 7,  color: 'red', dir: 'right', speed: 7},

        
        // 00:51:500) the grid speech and buildup

        // (00:51:500 - XX:XX:XXX) first beat drop
        { beat: 100.425, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 7},
        { beat: 100.425, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 7},

        { beat: 101.425, track: 0, gridPos: 1, color: 'blue', dir: 'up', speed: 7},
        { beat: 101.425, track: 0, gridPos: 2, color: 'red', dir: 'up', speed: 7},

        { beat: 102.425, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 7},
        { beat: 102.425, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 7},

        { beat: 103.425, track: 0, gridPos: 1, color: 'blue', dir: 'up', speed: 7},
        { beat: 103.425, track: 0, gridPos: 2, color: 'red', dir: 'up', speed: 7},

        { beat: 104.425, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 7},
        { beat: 104.425, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 7},

        { beat: 105.425, track: 0, gridPos: 1, color: 'blue', dir: 'up', speed: 7},
        { beat: 105.425, track: 0, gridPos: 2, color: 'red', dir: 'up', speed: 7},

        { beat: 106.425, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 7},
        { beat: 106.425, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 7},

        { beat: 107.425, track: 0, gridPos: 1, color: 'blue', dir: 'up', speed: 7},
        { beat: 107.425, track: 0, gridPos: 2, color: 'red', dir: 'up', speed: 7},

        { beat: 108.425, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 7},
        { beat: 108.425, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 7},

        { beat: 109.425, track: 0, gridPos: 1, color: 'blue', dir: 'up', speed: 7},
        { beat: 109.425, track: 0, gridPos: 2, color: 'red', dir: 'up', speed: 7},

        { beat: 110.425, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 7},
        { beat: 110.425, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 7},

        { beat: 111.425, track: 0, gridPos: 1, color: 'blue', dir: 'up', speed: 7},
        { beat: 111.425, track: 0, gridPos: 2, color: 'red', dir: 'up', speed: 7},

        { beat: 112.425, track: 0, gridPos: 13, color: 'blue', dir: 'down', speed: 7},
        { beat: 112.425, track: 0, gridPos: 14, color: 'red', dir: 'down', speed: 7},
        

     ],
     leaderboard: []
  },
};