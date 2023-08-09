import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button, Card, Grid, Row, Col, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import { useLobby } from '../contexts/LobbyContext';
// import repeatingBg from './repeatingBg.png'

export default function Menu() {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const {joinLobby, createLobby} = useLobby();


    function hostGame(){
        createLobby()
        .then(async (response) => {
            if (response.status === 200) {
                let data = await response.json()
                // joinLobby(data.lobby)
                navigate(`/lobby?code=${data.lobby}`)
            }
        }).catch((error) => {
            console.log('could not create lobby');
        })
    }

    return (
        <div>
            <Container style={{width: '100%', maxWidth: '600px'}}>
                <Row>
                    <Col><BigButton title='Hoast Game' image={'./repeatingBg.png'} handleClick={hostGame}/></Col>
                    <Col><BigButton title='Join lobby' image={'./repeatingBg.png'} handleClick={() => navigate('/lobby')}/></Col>
                    <Col><BigButton title='Customize' image={'./repeatingBg.png'} handleClick={() => alert('no customization yet')}/></Col>
                </Row>
            </Container>
            <Button variant='primary' size='lg' onClick={logout}>Logout</Button>
        </div>
    )
}

const BigButton = ({title, image, handleClick}) => {
    return (
        <Card onClick={handleClick}>
            <Card.Img variant='top' src={image}/>
            <Card.Body>
                <Card.Title>{title}</Card.Title>
            </Card.Body>
        </Card>
    )
}
