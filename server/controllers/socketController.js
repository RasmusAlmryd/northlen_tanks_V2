import { getTokenData } from "../utils/tokenAuthentication.js";
import {cookieParser} from "../utils/cookieParser.js"
import DisconnectHandler from "../utils/DisconnectHandler.js";
import supportedColors from "../utils/supportedColors.js"

export default function(io, socket, lobbies){
    
    const disconnectHandler = DisconnectHandler.getInstance();

    socket.on('join-lobby', (id) => {

        id = parseInt(id);

        let lobby = lobbies.find(element => element.id === id)

        if(!lobby){
            socket.emit('join-lobby', ({err: 'lobby not found', data: null}))
            return;
        }
        
        if(lobby.hasPlayer(socket.user.id)){
            socket.user.lobby = lobby.id;
            disconnectHandler.removeDisconnectEvent("" + socket.user.id + socket.user.lobby)
            let data = {
                players: lobby.players,
                room: {
                    id: lobby.id,
                    host: lobby.host
                },
                map: lobby.map,
            }
            socket.emit('join-lobby', ({err: null, data}))
            return;
        }
        
        try {
            //adding player to lobbies
            let player = {
                id: socket.user.id,
                username: socket.user.username,
                global_name: socket.user.global_name,
                avatar: socket.user.avatar,
                ready: false,
                color: '#ffffff'
            }
            lobby.addPlayer(player)
            socket.user.lobby = lobby.id;
        }catch{
            console.log('full lobby');
            socket.emit('join-lobby', ({err: 'lobby is full', data: null}))
            return;
        }
        

        socket.join(`lobby-${lobby.id}`)
        socket.to(`lobby-${lobby.id}`).emit('player-update', {players: lobby.players});

        let data = {
            players: lobby.players,
            room: {
                id: lobby.id,
                host: lobby.host
            },
            map: lobby.map,
        }
        socket.emit('join-lobby', ({err: null, data}))
        
    })

    socket.on('leave-lobby', (id) => {
        id = parseInt(id);
        leaveLobby(id)
    })

    socket.on('set-ready', (id, state) => {
        let lobby = lobbies.find(element => element.id === id)

        lobby.setReady(id, state);
    })

    socket.on('change-color', (color) =>{
        if(!socket.user.lobby) return;

        if(!supportedColors.includes(color)) return;

        let lobby = lobbies.find(element => element.id === id)

        lobby.setPlayerColor(socket.user.id, color);

        socket.to(`lobby-${lobby.id}`).emit('player-update', {players: lobby.players});
    })

    socket.on('start-game', (id) => {
        
        let lobby = lobbies.find(element => element.id === id)

        if (!lobby){
            socket.emit('start-game', {err: 'lobby not found', data: null})
            return;
        }

        if(lobby.host !== socket.user.id){
            socket.emit('start-game', {err: 'action not allowed', data: null})
            return;
        }

        if(!lobby.allReady){
            socket.emit('start-game', {err: 'all players not ready', data: null})
        }

        lobby.game = 'GAME' // Create game object
        socket.to(`lobby-${lobby.id}`).emit('start-game', {err: null, data: id})
    })

    socket.on('disconnect', (reason) =>{
        console.log('socket: ', socket.id, ' disconnected');

        disconnectHandler.addDisconnectEvent(()=>{
            if(socket.user.lobby) leaveLobby(socket.user.lobby)
        },
        ("" + socket.user.id + socket.user.lobby),
        2000)
    } );

    async function leaveLobby(id){
        let lobby = lobbies.find(element => element.id === id)

        lobby.removePlayer(socket.user.id)
        socket.leave(`lobby-${id}`)
        socket.user.lobby = null

        if(lobby.players.length <= 0){
            let removeIndex = lobbies.indexOf(socket.user.lobby)
            lobbies.splice(removeIndex, 1)
        } 

        socket.to(`lobby-${id}`).emit('player-update', {players: lobby.players});
        
        
    }
}