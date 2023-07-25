import React, {useCallback, useContext, useEffect, useState} from 'react'
import { useSocket } from './SocketContext'
import { useAuth } from './AuthContext';


const LobbyContext = React.createContext()

export function useLobby() {
    return useContext(LobbyContext)
}

export function LobbyProvider({children}) {
    const {socket,connected} = useSocket();
    const {token} = useAuth();
    // const [lobby, setLobby] = useState();
    const [players, setPlayers] = useState();
    const [room, setRoom] = useState();
    const [map, setMap] = useState();

    useEffect(()=>{
        console.log(socket);
        if (!connected) return
        
        socket.on('join-lobby', ({err, data})=>{
            console.log('trying to join');
            if (err) return console.log(err);
            console.log(data);

            const {players, room, map} = data;
            setPlayers(players)
            setRoom(room)
            setMap(map)
        })


        socket.on('map-update', (map) => setMap(map))
        socket.on('player-update', (player) => setPlayers(player))
        socket.on('room-update', (room) => setRoom(room))

        return () =>{
            socket.off('lobby-connect')
            socket.off('map-update')
            socket.off('player-update')
            socket.off('room-update')
        }
    }, [connected]);

    const joinLobby = useCallback((lobbyId) => {
        console.log(lobbyId);
        console.log('click join lobby');
        socket.emit('join-lobby', lobbyId)
    })

    function createLobby(){
        return fetch(`${process.env.REACT_APP_API_ENDPOINT}/create-lobby`, {
            method: 'POST', 
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            // signal: abortController.signal
        });
    }

    const value = {
        joinLobby,
        createLobby,
        players,
        room,
        map,
    }

    return (
        <LobbyContext.Provider value={value}>
            {children}
        </LobbyContext.Provider>
    )
}
