import { getTokenData } from "./utils/tokenAuthentication.js";
import {cookieParser} from "./utils/cookieParser.js"

export default function(io, socket, lobbies){
    

    socket.on('join-lobby', (id) => {
        let lobby = lobbies.find(element => element.id === id)
        if(!lobby){
            socket.emit('join-lobby', ({err: 'lobby not found', data: null}))
            return;
        }

        // console.log(cookieParser(socket.handshake.headers.cookie));

        
        try {
            let token = socket.handshake.headers.authorization?.split(' ')[1]
            if (!token) throw new Error("Invalid")

            var userData = getTokenData(token)
            if(!userData) throw new Error("Invalid")
        } catch (error) {
            socket.emit('join-lobby', ({err: 'invalid user', data: null}))
            return
        }
        
        
        try {
            let user = {
                id: userData.id,
                username: userData.username,
                global_name: userData.global_name,
                avatar: userData.avatar,
            }
            lobby.addPlayer(user)
        }catch{
            console.log('full lobby');
            socket.emit('join-lobby', ({err: 'lobby is full', data: null}))
            return;
        }
        

        socket.join(`lobby-${lobby.id}`)
        socket.to(`lobby-${lobby.id}`).emit('player-update');

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

    socket.on('disconnect', (reason) =>{
        console.log('socket: ', socket.id, ' disconnected');
    } );
}