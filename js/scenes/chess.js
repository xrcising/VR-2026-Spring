import * as cg from "../render/core/cg.js";
import * as pieceMeshBuilder from "./piece_mesh_builder.js";
import { controllerMatrix } from "../render/core/controllerInput.js";
import { lcb, rcb } from "../handle_scenes.js";

window.pieceInfo = {   
                             // SHARED STATE IS A GLOBAL VARIABLE.
  wpawn1: {
    xyz: [0,1,0],
    rgb: [1,1,1],
    isGrabbed: false,
  },
  wknight1: {
    xyz: [0,1,0],
    rgb: [1,1,1],  
    isGrabbed: false,
  },
  wking1: {
    xyz: [0,1,0],
    rgb: [1,1,1],
    isGrabbed: false,
  },
  wrook1: {
    xyz: [0,1,0],
    rgb: [1,1,1],
    isGrabbed: false,
  },
  wbishop1: {
    xyz: [0,1,0],
    rgb: [1,1,1],
    isGrabbed: false,
  },
  wqueen1: {
    xyz: [0,1,0],
    rgb: [1,1,1],
    isGrabbed: false,
  },
};

export const init = async model => {

  // Build piece meshes from piece_mesh_builder.js
  clay.defineMesh('queen', pieceMeshBuilder.queenMesh);
  clay.defineMesh('pawn', pieceMeshBuilder.pawnMesh);
  clay.defineMesh('knight', pieceMeshBuilder.knightMesh);
  clay.defineMesh('king', pieceMeshBuilder.kingMesh);
  clay.defineMesh('rook', pieceMeshBuilder.rookMesh);
  clay.defineMesh('bishop', pieceMeshBuilder.bishopMesh);

  // Create a ground with chessboard texture
  let ground = model.add('square');

  let wqueen1 = model.add('queen').color([.2,.2,.2]);
  let wpawn1 = model.add('pawn');
  let wpawnHead1 = wpawn1.add('sphere');

  let wknight1 = model.add('knight');
  let wking1 = model.add('king');
  let wrook1 = model.add('rook');
  let wbishop1 = model.add('bishop');

  // Map piece name (string) -> { name, node } so we can separate the name for a piece with its model
  // Maybe I shouldn't have used the same names...
  let pieceList = [
    { name: 'wqueen1',  node: wqueen1 },
    { name: 'wpawn1',   node: wpawn1 },
    { name: 'wknight1', node: wknight1 },
    { name: 'wking1',   node: wking1 },
    { name: 'wrook1',   node: wrook1 },
    { name: 'wbishop1', node: wbishop1 },
  ];
  let selectedPiece = null; // Piece we have selected can be moved
  let pointedPiece = null; // Piece we are pointing at gets highlighted

  // Assign chessboard texture to ground
  model.txtrSrc(1, '../media/textures/chessboard.png');

  ground.txtr(1);

  // Controller input handling
  inputEvents.onMove    = hand => { }
  inputEvents.onPress   = hand => {
    // Select the piece we're pointing at
    // it stays selected until we release
    selectedPiece = pointedPiece;
    if (selectedPiece && pieceInfo[selectedPiece.name]) {
      pieceInfo[selectedPiece.name].isGrabbed = true;
      pieceInfo[selectedPiece.name].xyz = inputEvents.pos(hand); // update location data
      pieceInfo[selectedPiece.name].rgb = selectedPiece.name.charAt(0) === 'w' ? [1,1,1] : [1,0,0]; // update color data
    }
    server.broadcastGlobal('pieceInfo');
  }
  
  inputEvents.onDrag    = hand => {
    // Move the grabbed piece with the controller
    if (selectedPiece && pieceInfo[selectedPiece.name]?.isGrabbed) {
      pieceInfo[selectedPiece.name].xyz = inputEvents.pos(hand);
      server.broadcastGlobal('pieceInfo');
    }
  }

  inputEvents.onRelease = hand => { 
    // set isGrabbed to false for the piece that was grabbed
    for (const piece in pieceInfo) {
      if (pieceInfo[piece].isGrabbed) {
        selectedPiece = null;
        pieceInfo[piece].isGrabbed = false;
        pieceInfo[piece].rgb = piece.charAt(0) == 'w' ? [1,1,1] : [.2,.2,.2];
        server.broadcastGlobal('pieceInfo');
        break;
      }
    }
  }
  inputEvents.onClick   = hand => { }

  // Render board and pieces
  model.move(0,0,0).scale(1).animate(() => {
    pieceInfo = server.synchronize('pieceInfo');

    let sin = Math.sin;
    let cos = Math.cos;
    let t = model.time;

    ground.identity()
      .move(0,0,0)
      .turnX(-Math.PI/2);
      //.scale(2,1,1)
      //.turnZ(.5*model.time);

    let isPointedAt = (piece) => {
      if (!lcb || !rcb) return false;
      let world = cg.mMultiply(clay.root().getMatrix(), piece.getMatrixFromRoot());
      let hitBox = cg.mMultiply(world,
        cg.mMultiply(cg.mTranslate(0, -0.2, 0), cg.mScale(0.3, 0.8, 0.3)));
      return lcb.hitRect(hitBox) || rcb.hitRect(hitBox);
    };

    // Update what we're pointing at (for highlight and for onPress to grab); selectedPiece only changes on press/release
    pointedPiece = pieceList.find(entry => isPointedAt(entry.node)) || null;

    // Position and color each piece from pieceInfo[name]; highlight selected or pointed-at in red
    // This needs to be redone to make placing pieces on the board more intuitive for me
    // Something like "wrook1: [0,0]" that maps to the 'a1' square on the board
    let basePositions = { wqueen1: [.625+.25,.18,.125], wpawn1: [.625,.18,.125], wknight1: [.625-.25,.18,.125], wking1: [.625-2*.25,.18,.125], wrook1: [.625-3*.25,.18,.125], wbishop1: [.625-4*.25,.18,.125] };
    
    for (let { name, node } of pieceList) {
      let info = pieceInfo[name];
      let xyz = info && info.isGrabbed ? info.xyz : (basePositions[name] || [0,1,0]);
      // Red when holding this piece, or when pointing at it and not holding anything
      let isSelected = (selectedPiece && selectedPiece.name === name) ||
        (!selectedPiece && pointedPiece && pointedPiece.name === name);
      node.identity()
        .color(isSelected ? 'red' : (info ? info.rgb : [.8,.8,.8]))
        .move(xyz)
        .scale(0.18);
    }

    // Still need to fill in missing mesh data:
    //    - pawn's head
    //    - bishop's head
    //    - rook's head
    //    - king's crown
    //    - knight's body

    wpawnHead1.identity()
      .color(pieceInfo.wpawn1?.rgb ?? [.8,.8,.8])
      .scale(0.23)
      .move(0, -0.4, 0);
    
  });
}