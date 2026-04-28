import * as global from "../global.js";
import { Gltf2Node } from "../render/nodes/gltf2.js";

export default () => {
   global.scene().addNode(new Gltf2Node({
      url: ""
   })).name = "backGround";

   return {
      enableSceneReloading: true,
      scenes: [ 
         // Demo scenes
         { name: "shapes"          , path: "./shapes.js"          , public: false },
         { name: "joints"          , path: "./joints.js"          , public: false },
         { name: "inputTest1"      , path: "./inputTest1.js"      , public: false },
         { name: "flag"            , path: "./flag.js"            , public: false },
         { name: "bouncing"        , path: "./bouncing.js"        , public: false },
         { name: "multiplayer1"    , path: "./multiplayer1.js"    , public: false },
         { name: "text1"           , path: "./text1.js"           , public: false },
         { name: "text2"           , path: "./text2.js"           , public: false },
         { name: "text3"           , path: "./text3.js"           , public: false },
         { name: "text4"        , path: "./text4.js"        , public: false },
         { name: "text5"        , path: "./text5.js"        , public: false },
         { name: "text6"        , path: "./text6.js"        , public: false },
         { name: "text6WithAI"  , path: "./text6WithAI.js"  , public: true },
         { name: "text7"        , path: "./text7.js"        , public: true },
         { name: "text8"        , path: "./text8.js"        , public: true },
         { name: "dissolve"     , path: "./dissolve.js"     , public: true },
         { name: "master1"      , path: "./master1.js"      , public: true },
         { name: "bouncing"     , path: "./bouncing.js"     , public: true },
         { name: "parse1"       , path: "./parse1.js"       , public: true },
         { name: "beam"         , path: "./beam.js"         , public: true },
         { name: "headGaze"     , path: "./headGaze.js"     , public: true },
         { name: "reading"      , path: "./reading.js"      , public: true },
         { name: "parse2"       , path: "./parse2.js"       , public: true },

         { name: "aiHelper"     , path: "./aiQuery.js"      , public: true },
         { name: "parse3"       , path: "./parse3.js"       , public: true },
         { name: "arrange"      , path: "./arrange.js"      , public: true },
         { name: "arrange2"     , path: "./arrange2.js"     , public: true },
         { name: "widgets"      , path: "./widgets.js"      , public: true },
         { name: "transfer"     , path: "./transfer.js"     , public: true },

         // My scenes
         { name: "text_world"      , path: "./text_world.js"      , public: true },
         { name: "knots"           , path: "./knots.js"           , public: true },
         { name: "airplane"        , path: "./airplane.js"        , public: true }, // This scene is for HW 1 and its interactability with controllers is for HW 2
         { name: "forest"          , path: "./forest.js"          , public: true }, // This scene is for HW 2 as well
         { name: "custom_flag"     , path: "./custom_flag.js"     , public: true },
         { name: "custom_bouncing" , path: "./custom_bouncing.js" , public: true },
         { name: "chess"           , path: "./chess.js"           , public: true }, // This scene is for HW 3, 4, and 5
         { name: "clock"           , path: "./clock.js"           , public: true }, // This scene is for HW 5 as well
         { name: "xrcising_prototype-1" , path: "./xrcising_prototype-1.js" , public: true }, // This scene is for HW 6
         { name: "xrcising_prototype-2" , path: "./xrcising_prototype-2.js" , public: true },
         { name: "xrcising_prototype-3" , path: "./xrcising_prototype-3.js" , public: true }
         
      ]
   };
}
