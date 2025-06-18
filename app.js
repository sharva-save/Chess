const express = require("express");
const app = express();
const socket = require("socket.io");
const http = require("http");
const path = require("path");
const { Chess } = require("chess.js");
const port = 3000;

const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();

let player = {};
let currentPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

io.on("connection", function (uniquesocket) {
  console.log("connected");

  // uniquesocket.on("send",function(){
  //   io.emit("churan papadddd")
  //   // console.log("send recevied");
  // })
  // uniquesocket.on("disconnect" , function(){
  //   console.log("disconnectedddd");

  // })

  if (!player.white) {
    player.white = uniquesocket.id;
    console.log("white");
    uniquesocket.emit("playerRole", "w");
  } else if (!player.black) {
    player.black = uniquesocket.id;
    console.log("black");
    uniquesocket.emit("playerRole", "b");
  } else {
    console.log("spectactor");
    uniquesocket.emit("spectatorRole");
  }

  uniquesocket.on("disconnect", function () {
    if (uniquesocket.id === player.white) {
      delete player.white;
    } else if (uniquesocket.id === player.black) {
      delete player.black;
    }
  });


uniquesocket.on("move", (move) => {
  try {
    if (chess.turn() === "w" && uniquesocket.id !== player.white) {
      return;
    }
    if (chess.turn() === "b" && uniquesocket.id !== player.black) {
      return;
    }

    const result = chess.move(move)
    if(result){
      currentPlayer= chess.turn();
      io.emit("move",move)
      io.emit("boardState" ,chess.fen())
    }
    else{
      console.log("invalid  movee",move);
      uniquesocket.emit("invalid move",move)
      
    }
  } catch (error) {
    console.log(error);
    uniquesocket.emit("invalid movee",move);
    
  }
});
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
