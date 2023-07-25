import React, {useEffect, useState, useSearchParams} from 'react'
import { useNavigate } from 'react-router-dom';
import {Button} from 'react-bootstrap'
import {useAuth} from '../contexts/AuthContext'
import Alert from 'react-bootstrap/Alert';
import Cookies from 'universal-cookie';



export default function Login() {
    const {loggedIn, authenticate, login} = useAuth();
    const navigate = useNavigate();
    const cookies = new Cookies()

    
    function devAuth(){
        navigate('/discord-oauth-redirect?code=1234&state='+cookies.get('state'))
    }


    useEffect(() => {
        if(loggedIn){
            navigate('/menu')
        }
    }, [loggedIn])

    return (
        <div>
            <Button variant='primary' size='lg' onClick={authenticate}>Discord authentication</Button>
            <br/>
            <Button variant='primary' size='lg' onClick={devAuth}>DEV! authentication</Button>
        </div>
    )

}
