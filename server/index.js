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
import lobbyController from './controllers/lobbyController.js';

import { getTokenData } from "./utils/tokenAuthentication.js";


// require('dotenv').config()
import {} from 'dotenv/config'
import { log } from 'console';




var corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.1.114:3000'],
    credentials: true
}

const app = express();
const port = process.env.PORT || 3001;
const httpServer = http.createServer(app)
const io = new Server(httpServer, {cors: corsOptions}); //cookie: true

const lobbies = []

app.use(express.json()) 
app.use(cors(corsOptions));
app.use(cookieParser())

discordController(app)
lobbyController(app, lobbies)

const onSocketConnection = (socket) =>{
    console.log(socket.id, ' connected');

    try {
        let token = socket.handshake.headers.authorization?.split(' ')[1]
        if (!token) throw new Error("No token provided")

        var userData = getTokenData(token)
        userData.lobbies=null;
        if(!userData) throw new Error("Invalid token")
    } catch (error) {
        socket.disconnect();
        return
    }

    socket.user = userData
    
    socketHandler(io, socket, lobbies)
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