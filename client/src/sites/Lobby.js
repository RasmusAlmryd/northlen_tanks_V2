import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { useLobby } from "../contexts/LobbyContext.js"
import { useSocket } from '../contexts/SocketContext.js'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { Clipboard, ClipboardCheck } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom';

import TankPreview from '../components/TankPreview';
import ColorPicker from '../components/ColorPicker';
import '../styles/Lobby.css'



export default function Lobby() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const codeRef = useRef();
    const [code, setCode] = useState()
    // const socket = useSocket();
    const { players, room, joinLobby, leaveLobby, setState, startGame, setStartListener} = useLobby();
    const {connected} = useSocket();

    setStartListener((url) =>{
        navigate(url)
    })

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

    function toMenu(){
        if (room){
            leaveLobby()
            setCode(null)
        }
        navigate('/menu');
    }

    // render if user is in a lobby
    if (room) {
        return (
            <div>
                <Button variant='primary' size='lg' onClick={toMenu}>Menu</Button>
                <Button variant='primary' size='lg' onClick={startGame}>Start Game</Button>
                <h1>Lobby</h1>
                <p >code: <span>{room.id}</span><Clipboard /></p>
                <div className="card-container">
                    {players.map(player =><PlayerCard key={player.id} player={player} currentUser={currentUser} usedColors={players.map(player => player.color)}/>)}
                </div>
                
                <Button variant='primary' size='lg' onClick={onLeaveSubmit}>Logout</Button>
            </div>
        )
    }

    // (<li key={player.id}>
    //     <img src="https://cdn.discordapp.com/avatars/255356067779837954/9a1d5d60cd6553b96ae5f264fc39d94b.webp?size=128"/>
    //     {player.username}
    //     <TankPreview mainColor={player.color} size={200} />
    // </li>)

    // render if user is not in a lobby
    return (
        <div>
            <Button variant='primary' size='lg' onClick={toMenu}>Menu</Button>
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


const PlayerCard = ({player, currentUser, usedColors}) =>{

    const [colors, setColors] = useState([]);
    const {getPlayerColors, setPlayerColor, setPlayerState} = useLobby();

    function readyEvent(){
        setPlayerState(!player.ready)
    }

    function setColor(color){
        setPlayerColor(color)
    }

    function getColors(){
        getPlayerColors().then(response => response.json())
        .then(data => {
            setColors(data.colors)
        })
    }

    useEffect(() =>{
        getColors();
    },[])

    if(!player || !currentUser){
        return;
    }

    

    const bgStyle = player.ready ? {backgroundColor: 'green'} : {backgroundColor: 'transparent'}

    return (
        <div className="player-card" style={bgStyle}>
            <div className="player-title">
                <img src={"https://cdn.discordapp.com/avatars/255356067779837954/9a1d5d60cd6553b96ae5f264fc39d94b.webp?size=128"}/>
                <h3>{player.username}</h3>
            </div>
            <TankPreview mainColor={player.color} size={150} />
            {player.id === currentUser.id ? <Button variant={player.ready ? 'danger' : 'success'} onClick={readyEvent}>Ready</Button> : ''}
            {player.id === currentUser.id ? <ColorPicker colors={colors} usedColors={usedColors} setColor={setColor}/> : ''}
        </div>
    )
}

{/* <Card>
            <Card.Img variant='top' src="https://cdn.discordapp.com/avatars/255356067779837954/9a1d5d60cd6553b96ae5f264fc39d94b.webp?size=128"/>
            <Card.Body>
                <Card.Title>{player.username}</Card.Title>
                <TankPreview mainColor={player.color} size={200} />
            </Card.Body>
        </Card> */}