import * as global from "../global.js";
import { Gltf2Node } from "../render/nodes/gltf2.js";

export default () => {
   global.scene().addNode(new Gltf2Node({
      url: ""
   })).name = "backGround";

   return {
      enableSceneReloading: true,
      scenes: [ 
         { name: "shapes"          , path: "./shapes.js"          , public: true },
         { name: "joints"          , path: "./joints.js"          , public: true },
         { name: "inputTest1"      , path: "./inputTest1.js"      , public: true },
         { name: "flag"            , path: "./flag.js"            , public: true },
         { name: "bouncing"        , path: "./bouncing.js"        , public: true },
         { name: "multiplayer1"    , path: "./multiplayer1.js"    , public: true },
         { name: "text1"           , path: "./text1.js"           , public: true },
         { name: "text2"           , path: "./text2.js"           , public: true },
         { name: "text3"           , path: "./text3.js"           , public: true },
         { name: "text_world"      , path: "./text_world.js"      , public: true },
         { name: "knots"           , path: "./knots.js"           , public: true },
         { name: "airplane"        , path: "./airplane.js"        , public: true }, // This scene is for HW 1 and its interactability with controllers is for HW 2
         { name: "forest"          , path: "./forest.js"          , public: true }, // This scene is for HW 2 as well
         { name: "custom_flag"     , path: "./custom_flag.js"     , public: true },
         { name: "custom_bouncing" , path: "./custom_bouncing.js" , public: true },
         { name: "chess"           , path: "./chess.js"           , public: true }, // This scene is for HW 3
      ]
   };
}

