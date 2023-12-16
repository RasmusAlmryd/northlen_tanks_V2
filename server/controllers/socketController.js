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
        
        /*
        if(lobby.hasPlayer(socket.user.id)){
            socket.user.lobby = lobby.id;
            disconnectHandler.removeDisconnectEvent("" + socket.user.id + socket.user.lobby)
            socket.join(`lobby-${socket.user.lobby}`)
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
        */

        if(lobby.hasPlayer(socket.user.id)){
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
                color: lobby.getRandomColor()
            }
            lobby.addPlayer(player)
            socket.user.lobby = lobby.id;
        }catch(error){
            console.log(error);
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

    socket.on('leave-lobby', () => {
        // id = parseInt(id);
        if(!socket.user.lobby) return;
        leaveLobby(socket.user.lobby)
    })

    socket.on('set-state', (state) => {
        
        if(!socket.user.lobby) return;

        if(typeof state !== 'boolean') return;

        let lobby = lobbies.find(element => element.id === socket.user.lobby)

        lobby.setReady(socket.user.id, state);

        io.in(`lobby-${lobby.id}`).emit('player-update', {players: lobby.players});
    })

    socket.on('change-color', (color) =>{
        if(!socket.user.lobby) return;

        if(typeof color !== 'string') return;

        if(!supportedColors().includes(color)) return;


        let lobby = lobbies.find(element => element.id === socket.user.lobby)

        if(!lobby.setPlayerColor(socket.user.id, color)) return;
        
        io.in(`lobby-${lobby.id}`).emit('player-update', {players: lobby.players});
    })

    
    
    socket.on('disconnect', (reason) =>{
        console.log('socket: ', socket.id, ' disconnected');

        disconnectHandler.addDisconnectEvent(()=>{
            if(socket.user.lobby) leaveLobby(socket.user.lobby)
        },
        socket.user.id,
        2000,
        {'lobby': socket.user.lobby})
    } );

    // ("" + socket.user.id + socket.user.lobby)

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