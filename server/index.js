// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser')
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http'
import { Server } from "socket.io";
import discordController from './controllers/discordController.js';
import socketHandler from './controllers/socketController.js';
import gameController from './controllers/gameController.js';
import lobbyRouter from './routes/lobby.js';

import { getTokenData } from "./utils/tokenAuthentication.js";

import DisconnectHandler from "./utils/DisconnectHandler.js";


// require('dotenv').config()
import {} from 'dotenv/config'
import { log } from 'console';




var corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.10.131:3000'],
    credentials: true
}

const app = express();
const port = process.env.PORT || 3001;
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: corsOptions, 
}); //cookie: true

//connectionStateRecovery: {
    // the backup duration of the sessions and the packets
  //  maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
 //   skipMiddlewares: true,
//}

const lobbies = []

app.use(express.json()) 
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.static('public'))

discordController(app)
lobbyRouter(app, lobbies)


const disconnectHandler = DisconnectHandler.getInstance();


const onSocketConnection = (socket) =>{

    if (socket.recovered) {
        console.log(socket.id,'socket recovered');
    } else{
        console.log(socket.id, ' connected');
    }

    try {
        let token = socket.handshake.headers.authorization?.split(' ')[1]
        if (!token) throw new Error("No token provided")

        var userData = getTokenData(token)
        //userData.lobbies=null;

        if(!userData) throw new Error("Invalid token")

       
    } catch (error) {
        socket.disconnect();
        return
    }

    socket.user = userData;

    

    //if player refresh page
    let recoveredData = disconnectHandler.removeDisconnectEvent(socket.user.id)

    if(recoveredData){
        for(const [key, value] of Object.entries(recoveredData)){
            socket.user[key] = value;
        }
    }
    
    if(socket.user.lobby != null && lobbies.find(element => element.id === socket.user.lobby)){
        socket.join(`lobby-${socket.user.lobby}`)
    }
    
    socketHandler(io, socket, lobbies);
    gameController(io, socket, lobbies);
}

// io.use((socket, next) => {
//     // const err = new Error("not authorized");
//     // err.data = { content: "Please retry later" }; // additional details
//     // next(err);
//     try {
//         let token = socket.handshake.headers.authorization?.split(' ')[1]
//         if (!token){
//             const err = new Error("Invalid authorization")
//             err.data = { content: 'No token provided'}
//             return next(err);
//         }

//         var userData = getTokenData(token)
//         if(!userData){

//         } new Error("Invalid")
//     } catch (error) {
//         socket.emit('join-lobby', ({err: 'invalid user', data: null}))
//         return
//     }
//     socket.user = userData;
//     next();
// })

io.on('connection', onSocketConnection)

httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})