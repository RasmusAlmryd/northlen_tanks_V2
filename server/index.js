// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser')
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http'
import { Server } from "socket.io";
import discordController from './controllers/discordController.js';
import socketHandler from './socketHandler.js';
import lobbyController from './controllers/lobbyController.js';


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
    socketHandler(io, socket, lobbies)
}

io.on('connection', onSocketConnection)

httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})