import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { io } from "socket.io-client";
// import {useSocket} from "../socketProvider.js"
import { useLobby } from "../contexts/LobbyContext.js"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Clipboard, ClipboardCheck } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom';
import TankPreview from './TankPreview';


export default function Lobby() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const codeRef = useRef();
    const [code, setCode] = useState()
    // const socket = useSocket();
    const { players, room, joinLobby, leaveLobby } = useLobby();

    useEffect(() => {
        if(room) return
        console.log('lobby init');
        const queryParams = new URLSearchParams(window.location.search);
        const queryCode = queryParams.get('code');
        if (queryCode) {
            console.log(queryCode);
            joinLobby(queryCode);
        }
    }, [code])


    function onJoinSubmit(e) {
        e.preventDefault();
        console.log(codeRef.current.value);
        setCode(codeRef.current.value);
        navigate(`/lobby?code=${codeRef.current.value}`)
    }

    function onLeaveSubmit(e) {
        e.preventDefault();

        navigate('/lobby')
        leaveLobby(room.id)
        setCode(null)
    }

    if (room) {
        return (
            <div>
                <h1>Lobby</h1>
                <p >code: <span>{room.id}</span><Clipboard /></p>
                {players.map(player =>
                    (<li key={player.id}>
                        {player.username}
                        <TankPreview mainColor={'#191919'} size={200} />
                    </li>))}
                <Button variant='primary' size='lg' onClick={onLeaveSubmit}>Logout</Button>
            </div>
        )
    }

    return (
        <div>
            <Form onSubmit={onJoinSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Lobby code</Form.Label>
                    <Form.Control type="text" placeholder="code" ref={codeRef} />
                </Form.Group>
                <Button variant='primary' type='submit'>
                    join
                </Button>
            </Form>
        </div>
    )
}
