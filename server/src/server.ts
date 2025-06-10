import { Socket,Server } from "socket.io";
import http from 'http'
import express from "express";
import { UserManager } from "./managers/userManager";
let userManagement = new UserManager()


let app = express()
const server = http.createServer(http);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection',(socket)=>{
    console.log("connection Created from socket")
    userManagement.addUser("bunny",socket)
    socket.on('disconnect',()=>{
        userManagement.removeUser(socket.id)
    })
})