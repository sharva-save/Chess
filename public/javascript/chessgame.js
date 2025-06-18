const socket = io();

// socket.emit("send")
// socket.on("churan papadddd" , function(){
//                console.log("churan papdi recevieddd");

// })

const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

let draggedPiece = null;
let sourceSquare = null;
let playeRole = null;

const renderBoard = () => {
  const board = chess.board();
  (boardElement.innerHTML = ""),
    board.forEach((row, rowindex) => {
      console.log("this is row", row, rowindex);
      row.forEach((square, squareindex) => {
        console.log("this is square ", square);

        //for the black and white pattern
        const squareElement = document.createElement("div");
        squareElement.classList.add(
          "square",
          (rowindex + squareindex) % 2 === 0 ? "light" : "dark"
        );

        squareElement.dataset.row = rowindex;
        squareElement.dataset.col = squareindex;

        //element is exist or not
        if (square) {
          const pieceElement = document.createElement("div");
          pieceElement.classList.add(
            "piece",
            square.color === "w" ? "white" : "black"
          );
          pieceElement.innerText = getPieceUniqueCode(square);

          pieceElement.draggable = playeRole === square.color;

          pieceElement.addEventListener("dragstart", (e) => {
            if (pieceElement.draggable) {
              draggedPiece = pieceElement;
              sourceSquare = { row: rowindex, col: squareindex };
              e.dataTransfer.setData("text/plain", "");
            }
          });
          pieceElement.addEventListener("dragend", (e) => {
            draggedPiece = null;
            sourceSquare = null;
          });

          squareElement.appendChild(pieceElement);
        }
        squareElement.addEventListener("dragover", function (e) {
          e.preventDefault();
        });

        squareElement.addEventListener("drop", function (e) {
          e.preventDefault();
          if (draggedPiece) {
            const targeSource = {
              row: parseInt(squareElement.dataset.row),
              col: parseInt(squareElement.dataset.col),
            };

            handleMove(sourceSquare, targeSource);
          }
        });
        boardElement.appendChild(squareElement);
      });
    });
    if(playeRole === 'b'){
               boardElement.classList.add('flipped')
    }
    else{
               boardElement.classList.remove('flipped')
    }
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    pramotion: "q",
  };
  socket.emit("move" ,move)
};

const getPieceUniqueCode = (piece) => {
  const unicodePiece = {
                 k: "♚", // King
      q: "♛", // Queen
      R: "♜", // Rook
      B: "♝", // Bishop
      N: "♞", // Knight
      P: "♟", // Pawn

    p: "♙",
    r: "♖",
    n: "♘",
    b: "♗",
    q: "♕",
    k: "♔",
  };

  return unicodePiece[piece.type || ""];
};

socket.on("playerRole", function (role) {
  playeRole = role;
  renderBoard();
});

socket.on("spectatorRole", function () {
  (playeRole = null), renderBoard();
});
socket.on("boardState", function (fen) {
  chess.load(fen)
  renderBoard()
});

socket.on("move", function (move) {
  chess.move(move)
  renderBoard()
});


renderBoard();
