import React, {useCallback, useContext, useEffect, useState} from 'react'
import { useSocket } from './SocketContext'
import { useAuth } from './AuthContext';


const LobbyContext = React.createContext()

export function useLobby() {
    return useContext(LobbyContext)
}

export function LobbyProvider({children}) {
    const {socket,connected, pending} = useSocket();
    const {token} = useAuth();
    // const [lobby, setLobby] = useState();
    const [players, setPlayers] = useState();
    const [room, setRoom] = useState();
    const [map, setMap] = useState();

    var onStartCallback = null

    useEffect(()=>{

        if (!connected) return
        console.log('connected');
        
        socket.on('join-lobby', ({err, data})=>{
            if (err) return console.log(err);
            console.log(data);

            const {players, room, map} = data;
            setPlayers(players)
            setRoom(room)
            setMap(map)
        })


        socket.on('map-update', (map) => setMap(map))
        socket.on('player-update', ({players}) => {setPlayers(players)})
        socket.on('room-update', (room) => setRoom(room))

        socket.on('game-launch', ({err, data}) =>{
            console.log(err, data);
            if(err) return;
            onStartCallback(`/game?code=${data}`)
        })

        return () =>{
            console.log('lobby context remove');
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

    const leaveLobby = useCallback(() => {
        socket.emit('leave-lobby')
        resetValues();
    })

    const setPlayerState = useCallback((state) =>{
        socket.emit('set-state', state);
    })

    const setPlayerColor = useCallback((color) =>{
        socket.emit('change-color', color);
    })

    const startGame = useCallback(() => {
        socket.emit('game-launch');
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

    function getPlayerColors(){
        return fetch(`${process.env.REACT_APP_API_ENDPOINT}/player-colors`, {
            method: 'GET', 
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            }
        })
    }

    function setStartListener(callback){
        onStartCallback = callback;
    }

    const value = {
        joinLobby,
        leaveLobby,
        createLobby,
        startGame,
        setPlayerState,
        players,
        room,
        map,
        getPlayerColors,
        setPlayerColor,
        setStartListener,
    }

    return (
        <LobbyContext.Provider value={value}>
            {children}
        </LobbyContext.Provider>
    )
}
