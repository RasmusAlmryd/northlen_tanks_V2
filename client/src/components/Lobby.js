import React, { useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { io } from "socket.io-client";
// import {useSocket} from "../socketProvider.js"
import { useLobby } from "../contexts/LobbyContext.js"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Clipboard, ClipboardCheck} from 'react-bootstrap-icons'


export default function Lobby() {
  const { currentUser } = useAuth();
  const lobbyCode = useRef();
  // const socket = useSocket();
  const { players, room, joinLobby } = useLobby();


  function onJoinSubmit(e) {
    e.preventDefault();
    console.log(lobbyCode.current.value);
    console.log(e.target);
    joinLobby(lobbyCode.current.value)
  }

  if(room){
    return (
      <div>
        <h1>Lobby</h1>
        <p >code: <span>{room.id}</span><Clipboard/></p>
      </div>
    )
  }

  const queryParams = new URLSearchParams(window.location.search);
  const queryCode = queryParams.get('code');
  if (queryCode) {
    joinLobby(queryCode);
  }

  return (
    <div>
      <Form onSubmit={onJoinSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Lobby code</Form.Label>
          <Form.Control type="text" placeholder="code" ref={lobbyCode}/>
        </Form.Group>
        <Button variant='primary' type='submit'>
          join
        </Button>
      </Form>
    </div>
  )
}
