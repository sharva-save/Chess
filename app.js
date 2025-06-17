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

io.on("connection" , function(uniquesocket){
  console.log("connected");

  // uniquesocket.on("send",function(){
  //   io.emit("churan papadddd")
  //   // console.log("send recevied");
  // })
  // uniquesocket.on("disconnect" , function(){
  //   console.log("disconnectedddd");
    
  // })

});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
