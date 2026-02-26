import fs from "fs";
import https from "https";
import express from "express";
import { Server } from "socket.io";
const app = express();

//secure server
const key = fs.readFileSync("./cert/cert.key");
const cert = fs.readFileSync("./cert/cert.crt");
const secureExpressServer = https.createServer(
  {
    key,
    cert,
  },
  app,
);

secureExpressServer.listen(9000, ()=>{
    console.log("Server started successfully")
})

const io = new Server(secureExpressServer,{
    cors: [
        "localhost:5173",
        "localhost:5174",
        "localhost:5175",
    ],
    methods: [
        "GET",
        "POST"
    ]
})


io.on("connection", (socket)=>{
    console.log(socket.id, "has joined")
})