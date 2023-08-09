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
        if (!connected) return
        
        socket.on('join-lobby', ({err, data})=>{
            if (err) return console.log(err);
            console.log(data);

            const {players, room, map} = data;
            setPlayers(players)
            setRoom(room)
            setMap(map)
        })


        socket.on('map-update', (map) => setMap(map))
        socket.on('player-update', ({players}) => setPlayers(players))
        socket.on('room-update', (room) => setRoom(room))

        return () =>{
            resetValues();
            socket.off('map-update')
            socket.off('player-update')
            socket.off('room-update')
        }
    }, [connected]);

    const resetValues = useCallback(()=>{
        setPlayers(null);
        setMap(null);
        setRoom(null);
        
    })

    const joinLobby = useCallback((lobbyId) => {
        socket.emit('join-lobby', lobbyId)
    })

    const leaveLobby = useCallback((lobbyId) => {
        socket.emit('leave-lobby', lobbyId)
        resetValues();
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
        leaveLobby,
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
