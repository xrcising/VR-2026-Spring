import * as cg from "../render/core/cg.js";
import * as pieceMeshBuilder from "./piece_mesh_builder.js";
import { controllerMatrix } from "../render/core/controllerInput.js";
import { lcb, rcb } from "../handle_scenes.js";
import { loadSound, playSoundAtPosition } from "../util/positional-audio.js";

// LOAD ALL THE SOUNDS THAT WILL BE MADE WHEN BALLS BOUNCE.

let soundBuffer = [], loadSounds = [];
loadSounds.push(loadSound('../../media/sound/chessSounds/capture.mp3', buffer => soundBuffer[0] = buffer));
loadSounds.push(loadSound('../../media/sound/chessSounds/move-opponent.mp3', buffer => soundBuffer[1] = buffer));
loadSounds.push(loadSound('../../media/sound/chessSounds/move-self.mp3', buffer => soundBuffer[2] = buffer));
Promise.all(loadSounds);

// SHARED STATE IS A GLOBAL VARIABLE.
window.pieceInfo = {                             
   // White pieces
  wpawn1:   { xyz: [0,1,0], square: "a2", rgb: [1,1,1], isGrabbed: false }, 
  wpawn2:   { xyz: [0,1,0], square: "b2", rgb: [1,1,1], isGrabbed: false },
  wpawn3:   { xyz: [0,1,0], square: "c2", rgb: [1,1,1], isGrabbed: false }, 
  wpawn4:   { xyz: [0,1,0], square: "d2", rgb: [1,1,1], isGrabbed: false }, 
  wpawn5:   { xyz: [0,1,0], square: "e2", rgb: [1,1,1], isGrabbed: false }, 
  wpawn6:   { xyz: [0,1,0], square: "f2", rgb: [1,1,1], isGrabbed: false }, 
  wpawn7:   { xyz: [0,1,0], square: "g2", rgb: [1,1,1], isGrabbed: false }, 
  wpawn8:   { xyz: [0,1,0], square: "h2", rgb: [1,1,1], isGrabbed: false },
  wknight1: { xyz: [0,1,0], square: "b1", rgb: [1,1,1], isGrabbed: false }, 
  wknight2: { xyz: [0,1,0], square: "g1", rgb: [1,1,1], isGrabbed: false },
  wking1:   { xyz: [0,1,0], square: "e1", rgb: [1,1,1], isGrabbed: false },
  wrook1:   { xyz: [0,1,0], square: "a1", rgb: [1,1,1], isGrabbed: false }, 
  wrook2:   { xyz: [0,1,0], square: "h1", rgb: [1,1,1], isGrabbed: false },
  wbishop1: { xyz: [0,1,0], square: "c1", rgb: [1,1,1], isGrabbed: false }, 
  wbishop2: { xyz: [0,1,0], square: "f1", rgb: [1,1,1], isGrabbed: false },
  wqueen1:  { xyz: [0,1,0], square: "d1", rgb: [1,1,1], isGrabbed: false }, 
  wqueen2:  { xyz: [0,1,0], square: null, rgb: [1,1,1], isGrabbed: false },

  // Black pieces
  bpawn1:   { xyz: [0,1,0], square: "a7", rgb: [.02,.02,.02], isGrabbed: false }, 
  bpawn2:   { xyz: [0,1,0], square: "b7", rgb: [.02,.02,.02], isGrabbed: false }, 
  bpawn3:   { xyz: [0,1,0], square: "c7", rgb: [.02,.02,.02], isGrabbed: false }, 
  bpawn4:   { xyz: [0,1,0], square: "d7", rgb: [.02,.02,.02], isGrabbed: false }, 
  bpawn5:   { xyz: [0,1,0], square: "e7", rgb: [.02,.02,.02], isGrabbed: false }, 
  bpawn6:   { xyz: [0,1,0], square: "f7", rgb: [.02,.02,.02], isGrabbed: false }, 
  bpawn7:   { xyz: [0,1,0], square: "g7", rgb: [.02,.02,.02], isGrabbed: false }, 
  bpawn8:   { xyz: [0,1,0], square: "h7", rgb: [.02,.02,.02], isGrabbed: false },
  bknight1: { xyz: [0,1,0], square: "b8", rgb: [.02,.02,.02], isGrabbed: false }, 
  bknight2: { xyz: [0,1,0], square: "g8", rgb: [.02,.02,.02], isGrabbed: false },
  bking1:   { xyz: [0,1,0], square: "e8", rgb: [.02,.02,.02], isGrabbed: false },
  brook1:   { xyz: [0,1,0], square: "a8", rgb: [.02,.02,.02], isGrabbed: false }, 
  brook2:   { xyz: [0,1,0], square: "h8", rgb: [.02,.02,.02], isGrabbed: false },
  bbishop1: { xyz: [0,1,0], square: "c8", rgb: [.02,.02,.02], isGrabbed: false },
  bbishop2: { xyz: [0,1,0], square: "f8", rgb: [.02,.02,.02], isGrabbed: false },
  bqueen1:  { xyz: [0,1,0], square: "d8", rgb: [.02,.02,.02], isGrabbed: false }, 
  bqueen2:  { xyz: [0,1,0], square: null, rgb: [.02,.02,.02], isGrabbed: false },

  // Captured pieces
  capturedWhiteCount: 0,
  capturedBlackCount: 0,
};

  // convert 3d positions to chessboard squares (e.g. [0,0,0] -> "a1")
  // Board lies in XZ plane; only x and z determine the square (y is ignored).
  // Square centers: a1 = [-.875, *, .875], h8 = [.875, *, -.875]. Each square is 0.25 wide; left edge of 'a' is -1.
  // col from x: col = floor((x + 1) / 0.25); row from z: row = floor((0.875 - z) / 0.25)
  let xyzToSquare = (xyz) => {
    const x = xyz[0], z = xyz[2];
    if (x < -1.125 || x > 1.125 || z < -1.125 || z > 1.125) return null;
    const col = Math.floor((x + 1) / 0.25);
    const row = Math.floor((0.875 - z) / 0.25);
    if (col < 0 || col > 7 || row < 0 || row > 7) return null;
    return String.fromCharCode(97 + col) + (row + 1);
  };
  
  let squareToXYZ = (square) => {
    return [-.875 + (square.charCodeAt(0) - 97) * 0.25, .18, .875 - (parseInt(square.slice(1)) - 1) * 0.25];
  };

  // convert square to index 0-64
  // mapping:
  // a1 = 0, b1 = 1, c1 = 2, ..., g8 = 62, h8 = 63
  let squareToIndex = (square) => {
    const col = square.charCodeAt(0) - 97;
    const row = parseInt(square.slice(1)) - 1;
    return row * 8 + col;
  };

  // convert index 0-64 to square
  let indexToSquare = (index) => {
    return String.fromCharCode(97 + index % 8) + (Math.floor(index / 8) + 1);
  };

  let isSquareFree = (square) => {
    for (const piece in pieceInfo) {
      if (piece === 'capturedWhiteCount' || piece === 'capturedBlackCount') continue;
      if (pieceInfo[piece].square == square) {
        return false;
      }
    }
    return true;
  };

  // Predefined positions off the board: captured white pieces → left (negative x), captured black → right (positive x).
  // 16 slots per side in 2 rows of 8; y = .18 to match piece height.
  let capturedSlotXYZ = (color, index) => {
    const row = Math.floor(index / 8), col = index % 8;
    const y = 0;
    if (color === 'white') {
      const x = -1.5 - 0.25 * row;  // left of board
      const z = -.875 + 0.25 * col;
      return [x, y, z];
    } else {
      const x = 1.5 + 0.25 * row;   // right of board
      const z = .875 - 0.25 * col;
      return [x, y, z];
    }
  };

  let takePieceIfSquareNotFree = (square) => {
    if (!isSquareFree(square)) {
      for (const piece in pieceInfo) {
        if (piece === 'capturedWhiteCount' || piece === 'capturedBlackCount') continue;
        if (pieceInfo[piece].square == square) {
          const isWhite = piece.charAt(0) === 'w';
          const countKey = isWhite ? 'capturedWhiteCount' : 'capturedBlackCount';
          const count = (pieceInfo[countKey] ?? 0);
          pieceInfo[piece].square = 'captured';
          pieceInfo[piece].captureIndex = count;
          pieceInfo[piece].xyz = capturedSlotXYZ(isWhite ? 'white' : 'black', count);
          pieceInfo[countKey] = count + 1;
          break;
        }
      }
    }
  }

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
  let board = model.add('cube').color([.2,.2,.2]);

  for ( let n = 0; n < 64; n++) {
    ground.add('square');
  }
  for ( let n = 0; n < 64; n++) {
    let row = n / 8 >> 0;
    let col = n % 8;
    // start invisible
    ground.child(n).color('red').opacity(0.1);
  }

  // White piece models
  let wqueen1 = model.add('queen');
  // queen's crown
  wqueen1.add('sphere');
  let wpawn1 = model.add('pawn'), wpawn2 = model.add('pawn'), wpawn3 = model.add('pawn'),
      wpawn4 = model.add('pawn'), wpawn5 = model.add('pawn'), wpawn6 = model.add('pawn'),
      wpawn7 = model.add('pawn'), wpawn8 = model.add('pawn');
  let wpawnHead1 = wpawn1.add('sphere'), wpawnHead2 = wpawn2.add('sphere'), wpawnHead3 = wpawn3.add('sphere'),
      wpawnHead4 = wpawn4.add('sphere'), wpawnHead5 = wpawn5.add('sphere'), wpawnHead6 = wpawn6.add('sphere'),
      wpawnHead7 = wpawn7.add('sphere'), wpawnHead8 = wpawn8.add('sphere');

  let wknight1 = model.add('knight'), wknight2 = model.add('knight');
  let wking1 = model.add('king');
  for (let i = 0; i < 2; i++) {
    wking1.add('cube');
  }
  let wrook1 = model.add('rook'), wrook2 = model.add('rook');
  let wrookHead1 = wrook1.add('tubeY'), wrookHead2 = wrook2.add('tubeY');
  // rook crown
  for (let i = 0; i < 5; i++) {
    wrook1.add('cube');
    wrook2.add('cube');
  }
  let wbishop1 = model.add('bishop'), wbishop2 = model.add('bishop');
  let wbishopHead1 = wbishop1.add('sphere'), wbishopHead2 = wbishop2.add('sphere');
  wbishop1.add('sphere');
  wbishop2.add('sphere');

  // Black piece models
  let bqueen1 = model.add('queen');
  // queen's crown
  bqueen1.add('sphere');
  let bpawn1 = model.add('pawn'), bpawn2 = model.add('pawn'), bpawn3 = model.add('pawn'),
      bpawn4 = model.add('pawn'), bpawn5 = model.add('pawn'), bpawn6 = model.add('pawn'),
      bpawn7 = model.add('pawn'), bpawn8 = model.add('pawn');
  let bpawnHead1 = bpawn1.add('sphere'), bpawnHead2 = bpawn2.add('sphere'), bpawnHead3 = bpawn3.add('sphere'),
      bpawnHead4 = bpawn4.add('sphere'), bpawnHead5 = bpawn5.add('sphere'), bpawnHead6 = bpawn6.add('sphere'),
      bpawnHead7 = bpawn7.add('sphere'), bpawnHead8 = bpawn8.add('sphere');
  let bknight1 = model.add('knight'), bknight2 = model.add('knight');
  let bking1 = model.add('king');
  // king's crown
  for (let i = 0; i < 2; i++) {
    bking1.add('cube');
  }
  let brook1 = model.add('rook'), brook2 = model.add('rook');
  let brookHead1 = brook1.add('tubeY'), brookHead2 = brook2.add('tubeY');
  // rook crown
  for (let i = 0; i < 5; i++) {
    brook1.add('cube');
    brook2.add('cube');
  }
  let bbishop1 = model.add('bishop'), bbishop2 = model.add('bishop');
  let bbishopHead1 = bbishop1.add('sphere'), bbishopHead2 = bbishop2.add('sphere');
  bbishop1.add('sphere');
  bbishop2.add('sphere');

  // Map piece name (string) -> { name, node } so we can separate the name for a piece with its model
  // Maybe I shouldn't have used the same names...
  let pieceList = [
    // White pieces
    { name: 'wqueen1',  node: wqueen1 },
    { name: 'wpawn1',   node: wpawn1 },
    { name: 'wpawn2',   node: wpawn2 },
    { name: 'wpawn3',   node: wpawn3 },
    { name: 'wpawn4',   node: wpawn4 },
    { name: 'wpawn5',   node: wpawn5 },
    { name: 'wpawn6',   node: wpawn6 },
    { name: 'wpawn7',   node: wpawn7 },
    { name: 'wpawn8',   node: wpawn8 },
    { name: 'wknight1', node: wknight1 },
    { name: 'wknight2', node: wknight2 },
    { name: 'wking1',   node: wking1 },
    { name: 'wrook1',   node: wrook1 },
    { name: 'wrook2',   node: wrook2 },
    { name: 'wbishop1', node: wbishop1 },
    { name: 'wbishop2', node: wbishop2 },
    // Black pieces
    { name: 'bqueen1',  node: bqueen1 },
    { name: 'bpawn1',   node: bpawn1 },
    { name: 'bpawn2',   node: bpawn2 },
    { name: 'bpawn3',   node: bpawn3 },
    { name: 'bpawn4',   node: bpawn4 },
    { name: 'bpawn5',   node: bpawn5 },
    { name: 'bpawn6',   node: bpawn6 },
    { name: 'bpawn7',   node: bpawn7 },
    { name: 'bpawn8',   node: bpawn8 },
    { name: 'bknight1', node: bknight1 },
    { name: 'bknight2', node: bknight2 },
    { name: 'bking1',   node: bking1 },
    { name: 'brook1',   node: brook1 },
    { name: 'brook2',   node: brook2 },
    { name: 'bbishop1', node: bbishop1 },
    { name: 'bbishop2', node: bbishop2 },
  ];
  let selectedPiece = null; // Piece we have selected can be moved
  let pointedPiece = null; // Piece we are pointing at gets highlighted

  // Assign chessboard texture to ground
  model.txtrSrc(1, '../media/textures/chessboard.png');
  model.txtrSrc(2, '../media/textures/brown-wood-texture.png');

  ground.txtr(1);
  board.txtr(2);

  // Controller input handling
  inputEvents.onMove    = hand => { }
  inputEvents.onPress   = hand => {
    // Select the piece we're pointing at
    // it stays selected until we release
    selectedPiece = pointedPiece;
    if (selectedPiece && pieceInfo[selectedPiece.name]) {
      pieceInfo[selectedPiece.name].isGrabbed = true;
      pieceInfo[selectedPiece.name].xyz = inputEvents.pos(hand); // update location data
      pieceInfo[selectedPiece.name].rgb = selectedPiece.name.charAt(0) === 'w' ? [1,1,1] : [1,0,1]; // update color data
    }
    server.broadcastGlobal('pieceInfo');
  }
  
  inputEvents.onDrag    = hand => {
    // Move the grabbed piece with the controller
    if (selectedPiece && pieceInfo[selectedPiece.name].isGrabbed) {
      // since we scale by .2 in the animate function, we need to multiply x, y, and z by 5
      pieceInfo[selectedPiece.name].xyz = [inputEvents.pos(hand)[0] * 5, (inputEvents.pos(hand)[1]-1) * 5, inputEvents.pos(hand)[2] * 5];
      server.broadcastGlobal('pieceInfo');
    }
  }

  inputEvents.onRelease = hand => {
    for (const piece in pieceInfo) {
      if (pieceInfo[piece].isGrabbed) {
        const xyz = pieceInfo[piece].xyz;
        const square = xyzToSquare(xyz);
        if (square != null && !isSquareFree(square)) {
          takePieceIfSquareNotFree(square);
          pieceInfo[piece].xyz = squareToXYZ(square);
          pieceInfo[piece].square = square;
          playSoundAtPosition(soundBuffer[0], pieceInfo[piece].xyz);
        }
        else {
          //takePiece(square);
          pieceInfo[piece].xyz = squareToXYZ(square);
          pieceInfo[piece].square = square;
          // if piece is white, play move-self sound, otherwise play move-opponent sound
          if (piece.charAt(0) === 'w') {
            playSoundAtPosition(soundBuffer[2], pieceInfo[piece].xyz);
          } else {
            playSoundAtPosition(soundBuffer[1], pieceInfo[piece].xyz);
          }
        }
        selectedPiece = null;
        pieceInfo[piece].isGrabbed = false;
        pieceInfo[piece].rgb = piece.charAt(0) == 'w' ? [1,1,1] : [.02,.02,.02];
        server.broadcastGlobal('pieceInfo');
        break;
      }
    }
  }
  inputEvents.onClick   = hand => { }

  let piecePositions = { 
    // white pieces 
    wpawn1:   squareToXYZ("a2"), 
    wpawn2:   squareToXYZ("b2"),
    wpawn3:   squareToXYZ("c2"),
    wpawn4:   squareToXYZ("d2"),
    wpawn5:   squareToXYZ("e2"),
    wpawn6:   squareToXYZ("f2"),
    wpawn7:   squareToXYZ("g2"),
    wpawn8:   squareToXYZ("h2"),
    wknight1: squareToXYZ("b1"),
    wknight2: squareToXYZ("g1"),
    wqueen1:  squareToXYZ("d1"), 
    wking1:   squareToXYZ("e1"), 
    wrook1:   squareToXYZ("a1"),
    wrook2:   squareToXYZ("h1"),
    wbishop1: squareToXYZ("c1"),
    wbishop2: squareToXYZ("f1"),
    // black pieces
    bpawn1:   squareToXYZ("a7"), 
    bpawn2:   squareToXYZ("b7"),
    bpawn3:   squareToXYZ("c7"),
    bpawn4:   squareToXYZ("d7"),
    bpawn5:   squareToXYZ("e7"),
    bpawn6:   squareToXYZ("f7"),
    bpawn7:   squareToXYZ("g7"),
    bpawn8:   squareToXYZ("h7"),
    bknight1: squareToXYZ("b8"),
    bknight2: squareToXYZ("g8"),
    bqueen1:  squareToXYZ("d8"), 
    bking1:   squareToXYZ("e8"), 
    brook1:   squareToXYZ("a8"),
    brook2:   squareToXYZ("h8"),
    bbishop1: squareToXYZ("c8"),
    bbishop2: squareToXYZ("f8"),
  };

  let wboardHelperLetters = 
  `a   b   c   d   e   f   g   h`;
  let bboardHelperLetters = 
  `h   g   f   e   d   c   b   a`;
  let wboardHelperNumbers = 
  `
  8

  7

  6

  5 

  4 

  3

  2 

  1
  `;
  let bboardHelperNumbers = 
  `
  1

  2

  3

  4

  5

  6

  7

  8
  `;
  let wlettersMesh = clay.text(wboardHelperLetters);
  let wnumbersMesh = clay.text(wboardHelperNumbers);
  let blettersMesh = clay.text(bboardHelperLetters);
  let bnumbersMesh = clay.text(bboardHelperNumbers);
  let wletters = model.add(wlettersMesh);
  let wnumbers = model.add(wnumbersMesh);
  let bletters = model.add(blettersMesh);
  let bnumbers = model.add(bnumbersMesh);

  // Render board and pieces
  model.move(0,1,0).scale(.2).animate(() => {
    pieceInfo = server.synchronize('pieceInfo');

    
    wletters/*model.add(lettersMesh)*/.identity()
      //.scale(1/1.2, 1/0.08, 1/1.2)
      .move(-.915, 0, 1.04)
      .turnX(-Math.PI/2)
      .scale(4.95);
    wnumbers/*model.add(numbersMesh)*/.identity()
      .move(-1.26, 0, -1.065)
      .turnX(-Math.PI/2)
      .scale(4.95);
      //.scale(0.08);
    bletters/*model.add(lettersMesh)*/.identity()
      .turnY(Math.PI)
      .move(-.915, 0, 1.04)
      .turnX(-Math.PI/2)
      .scale(4.95);
    bnumbers/*model.add(numbersMesh)*/.identity()
      .turnY(Math.PI)
      .move(-1.26, 0, -1.065)
      .turnX(-Math.PI/2)
      .scale(4.95)
      

    let sin = Math.sin;
    let cos = Math.cos;
    let t = model.time;

    ground.identity()
      .move(0,0,0)
      .turnX(-Math.PI/2);
      //.scale(2,1,1)
      //.turnZ(.5*model.time);
    
    for ( let n = 0; n < 64; n++) {
      
      let row = n / 8 >> 0;
      let col = n % 8;
      ground.child(n).identity()
        .move(.25*(col+1)-1.125,.25*(row+1)-1.125,0.001)
        .scale(.125,.125,.1)
    }
    
    board.identity()
      //.turnZ(t)
      .move(0, -.081, 0)
      .scale(1.2, .08, 1.2)

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

    
    for (let { name, node } of pieceList) {
      let piece = pieceInfo[name];
      let xyz;
      if (piece && piece.isGrabbed) {
        xyz = piece.xyz;
      } else if (piece && piece.square == 'captured' && piece.captureIndex !== null) {
        xyz = capturedSlotXYZ(name.charAt(0) === 'w' ? 'white' : 'black', piece.captureIndex);
      } else {
        xyz = (squareToXYZ(piece?.square) || [0,1,0]);
      }
      // Red when holding this piece, or when pointing at it and not holding anything
      let isSelected = (selectedPiece && selectedPiece.name == name) ||
        (!selectedPiece && pointedPiece && pointedPiece.name == name);
      node.identity()
        .color(isSelected ? 'red' : (piece ? piece.rgb : [.8,.8,.8]))
        .move(xyz)
        .scale(0.18);
      const pieceColor = isSelected ? 'red' : (piece ? piece.rgb : [.8,.8,.8]);
      for (let i = 0; i < node.nChildren(); i++) {
        if (node.child(i) !== undefined) node.child(i).identity().color(pieceColor);
      }
      if (name == 'wknight1' || name == 'wknight2') node.turnY(Math.PI/2);
      if (name == 'bknight1' || name == 'bknight2') node.turnY(-Math.PI/2);
      //}
    }

    // Always highlight the square underneath the selected piece while holding it.
    // Reset all square opacities first, then highlight only the square under the piece (if on board).
    for (let n = 0; n < 64; n++) ground.child(n).color([.59,.29,0]).opacity(0.3);
    if (selectedPiece) {
      let xyz = pieceInfo[selectedPiece.name].xyz;
      let square = xyzToSquare(xyz);
      if (square != null) ground.child(squareToIndex(square)).color('red').opacity(1);
    }

    // Still need to fill in missing mesh data:
    //    - pawn's head
    //    - bishop's head
    //    - rook's head
    //    - king's crown
    //    - knight's body

    const headColor = (name) => {
      const isSelected = (selectedPiece && selectedPiece.name === name) || (!selectedPiece && pointedPiece && pointedPiece.name === name);
      return isSelected ? 'red' : (pieceInfo[name]?.rgb ?? [.8,.8,.8]);
    };
    wpawnHead1.identity()
      .color(headColor('wpawn1'))
      .scale(0.23)
      .move(0, -0.4, 0);
    wpawnHead2.identity()
      .color(headColor('wpawn2'))
      .scale(0.23)
      .move(0, -0.4, 0);
    wpawnHead3.identity()
      .color(headColor('wpawn3'))
      .scale(0.23)
      .move(0, -0.4, 0);
    wpawnHead4.identity()
      .color(headColor('wpawn4'))
      .scale(0.23)
      .move(0, -0.4, 0);
    wpawnHead5.identity()
      .color(headColor('wpawn5'))
      .scale(0.23)
      .move(0, -0.4, 0);
    wpawnHead6.identity()
      .color(headColor('wpawn6'))
      .scale(0.23)
      .move(0, -0.4, 0);
    wpawnHead7.identity()
      .color(headColor('wpawn7'))
      .scale(0.23)
      .move(0, -0.4, 0);
    wpawnHead8.identity()
      .color(headColor('wpawn8'))
      .scale(0.23)
      .move(0, -0.4, 0);

    wbishopHead1.identity()
      .color(headColor('wbishop1'))
      .scale(.23, .35, .23)
      .move(0, 1, 0);
    wbishop1.child(1).identity()
      .color(headColor('wbishop1'))
      .scale(.1, .05, .1)
      .move(0, 14, 0);
    wbishopHead2.identity()
      .color(headColor('wbishop2'))
      .scale(.23, .35, .23)
      .move(0, 1, 0);
    wbishop2.child(1).identity()
      .color(headColor('wbishop2'))
      .scale(.1, .05, .1)
      .move(0, 14, 0);
    // king's crown
    wking1.child(0).identity()
      .color(headColor('wking1'))
      .scale(.1, .25, .05)
      .move(0, 3, 0);
    // queen's crown
    wqueen1.child(0).identity()
      .color(headColor('wqueen1'))
      .scale(.1, .05, .1)
      .move(0, 13, 0);
    wking1.child(1).identity()
      .color(headColor('wking1'))
      .scale(.2, .10, .05)
      .move(0, 8, 0);
    wrookHead1.identity()
      .color(headColor('wrook1'))
      .scale(.33, .1, .33)
      .move(0, 0, 0);
    for (let i = 1; i < 6; i++) {
      wrook1.child(i).identity()
        .color(headColor('wrook1'))
        .turnX(Math.PI/2)
        .turnZ(i * (2 * Math.PI / 5))
        .move(0, -.2793, -.15)
        .scale(.08, .05, .05)
    }
    wrookHead2.identity()
      .color(headColor('wrook2'))
      .scale(.33, .1, .33)
      .move(0, 0, 0);
    for (let i = 1; i < 6; i++) {
      wrook2.child(i).identity()
        .color(headColor('wrook2'))
        .turnX(Math.PI/2)
        .turnZ(i * (2 * Math.PI / 5))
        .move(0, -.2793, -.15)
        .scale(.08, .05, .05)
    }
    bpawnHead1.identity()
      .color(headColor('bpawn1'))
      .scale(0.23)
      .move(0, -0.4, 0);
    bpawnHead2.identity()
      .color(headColor('bpawn2'))
      .scale(0.23)
      .move(0, -0.4, 0);
    bpawnHead3.identity()
      .color(headColor('bpawn3'))
      .scale(0.23)
      .move(0, -0.4, 0);
    bpawnHead4.identity()
      .color(headColor('bpawn4'))
      .scale(0.23)
      .move(0, -0.4, 0);
    bpawnHead5.identity()
      .color(headColor('bpawn5'))
      .scale(0.23)
      .move(0, -0.4, 0);
    bpawnHead6.identity()
      .color(headColor('bpawn6'))
      .scale(0.23)
      .move(0, -0.4, 0);
    bpawnHead7.identity()
      .color(headColor('bpawn7'))
      .scale(0.23)
      .move(0, -0.4, 0);
    bpawnHead8.identity()
      .color(headColor('bpawn8'))
      .scale(0.23)
      .move(0, -0.4, 0);
    bbishopHead1.identity()
      .color(headColor('bbishop1'))
      .scale(.23, .35, .23)
      .move(0, 1, 0);
    bbishopHead2.identity()
      .color(headColor('bbishop2'))
      .scale(.23, .35, .23)
      .move(0, 1, 0);
    // top of bishop's head
    bbishop1.child(1).identity()
      .color(headColor('bbishop1'))
      .scale(.1, .05, .1)
      .move(0, 14, 0);
    bbishop2.child(1).identity()
      .color(headColor('bbishop2'))
      .scale(.1, .05, .1)
      .move(0, 14, 0);
    // king's crown
    bking1.child(0).identity()
      .color(headColor('bking1'))
      .scale(.1, .25, .05)
      .move(0, 3, 0);
    // queen's crown
    bqueen1.child(0).identity()
      .color(headColor('bqueen1'))
      .scale(.1, .05, .1)
      .move(0, 13, 0);
    bking1.child(1).identity()
      .color(headColor('bking1'))
      .scale(.2, .10, .05)
      .move(0, 8, 0);
    brookHead1.identity()
      .color(headColor('brook1'))
      .scale(.33, .1, .33)
      .move(0, 0, 0);
    for (let i = 1; i < 6; i++) {
      brook1.child(i).identity()
        .color(headColor('brook1'))
        .turnX(Math.PI/2)
        .turnZ(i * (2 * Math.PI / 5))
        .move(0, -.2793, -.15)
        .scale(.08, .05, .05)
    }
    brookHead2.identity()
      .color(headColor('brook2'))
      .scale(.33, .1, .33)
      .move(0, 0, 0);
    for (let i = 1; i < 6; i++) {
      brook2.child(i).identity()
        .color(headColor('brook2'))
        .turnX(Math.PI/2)
        .turnZ(i * (2 * Math.PI / 5))
        .move(0, -.2793, -.15)
        .scale(.08, .05, .05)
    }

  });
}