import { Chess } from "../lib/chess.js";

// Helper to convert piece name from pieceInfo (e.g. "wpawn1") to standard chess notation piece type and color
function getPieceDetails(pieceName) {
    // pieceName is like "wpawn1", "bking1"
    const color = pieceName.charAt(0); // 'w' or 'b'
    let type = pieceName.slice(1).replace(/[0-9]/g, ''); // "pawn", "king", "knight"
    
    // Convert to single letter
    const typeMap = {
        'pawn': 'p',
        'knight': 'n',
        'bishop': 'b',
        'rook': 'r',
        'queen': 'q',
        'king': 'k'
    };
    
    return { color, type: typeMap[type] || 'p' };
}

export function constructFEN(pieceInfo) {
    // 1. Create 8x8 grid
    let board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // 2. Populate grid from pieceInfo
    for (let key in pieceInfo) {
        if (key === 'capturedWhiteCount' || key === 'capturedBlackCount') continue;
        
        let piece = pieceInfo[key];
        if (piece.square && piece.square !== 'captured' && piece.square !== null) {
            // square is "a2" -> col 0, row 6 (rank 2)
            // standard FEN rank 8 is row 0, rank 1 is row 7
            
            // "a" is charCode 97
            let col = piece.square.charCodeAt(0) - 97; 
            let rank = parseInt(piece.square.slice(1));
            // FEN row 0 is rank 8. row 7 is rank 1.
            let row = 8 - rank;
            
            if (row >= 0 && row < 8 && col >= 0 && col < 8) {
                let details = getPieceDetails(key);
                let char = details.type;
                if (details.color === 'w') char = char.toUpperCase();
                board[row][col] = char;
            }
        }
    }
    
    // 3. Generate FEN piece placement
    let fenRows = [];
    for (let i = 0; i < 8; i++) {
        let emptyCount = 0;
        let rowStr = "";
        for (let j = 0; j < 8; j++) {
            if (board[i][j] === null) {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    rowStr += emptyCount;
                    emptyCount = 0;
                }
                rowStr += board[i][j];
            }
        }
        if (emptyCount > 0) rowStr += emptyCount;
        fenRows.push(rowStr);
    }
    
    // 4. Assemble full FEN
    // We default to White to move, all castling enabled, no en passant, 0 halfmove, 1 fullmove
    // This is a simplification if we only have pieceInfo.
    // If pieceInfo has 'fen', we should prefer that, but this function specifically constructs from pieces.
    return fenRows.join('/') + " w KQkq - 0 1";
}

// Check if a move is legal given the *current* FEN (before move)
export function isMoveLegal(currentFen, fromSquare, toSquare) {
    try {
        const chess = new Chess(currentFen);
        
        // Try to make the move
        // chess.js move() can take { from, to, promotion: 'q' }
        // We assume promotion to queen for simplicity if it's a pawn reaching end rank
        
        const moveAttempt = { from: fromSquare, to: toSquare, promotion: 'q' };
        const result = chess.move(moveAttempt);
        
        return result !== null; // valid move returns a move object, invalid returns null
    } catch (e) {
        console.error("Error validating move:", e);
        return false;
    }
}

// Get the new FEN after a move
export function getNewFEN(currentFen, fromSquare, toSquare) {
    try {
        const chess = new Chess(currentFen);
        const result = chess.move({ from: fromSquare, to: toSquare, promotion: 'q' });
        if (result) {
            return chess.fen();
        }
        return currentFen; // Return original if move failed
    } catch (e) {
        console.error("Error getting new FEN:", e);
        return currentFen;
    }
}

// Get details about the move (e.g. is it a capture, is it en passant)
export function getMoveDetails(currentFen, fromSquare, toSquare) {
    try {
        const chess = new Chess(currentFen);
        const result = chess.move({ from: fromSquare, to: toSquare, promotion: 'q' });
        return result; // Returns null if invalid, otherwise the move object
    } catch (e) {
        console.error("Error getting move details:", e);
        return null;
    }
}
