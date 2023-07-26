import React, { useEffect } from 'react'
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DiscordRedirect() {

    const cookies = new Cookies();
    const navigate = useNavigate();
    const {login} = useAuth();

    console.log('discordRedirect');

    useEffect(() =>{
        const queryParams = new URLSearchParams(window.location.search);
        const queryCode = queryParams.get('code');
        const queryState = queryParams.get('state');
        const cookieState = cookies.get('state');

        console.log(queryCode , queryState, cookieState);
        

        console.log(!queryCode || !queryState || !cookieState);
        if(!queryCode || !queryState || !cookieState){
            navigate('/');
            return;
        }

        if(queryState !== cookieState){
            navigate('/');
            return;
        }

        const loginAsync = async () =>{
            try {
                await login(queryCode)
            } catch (error) {
                navigate('/')
            }
            
            navigate('/menu')
        }

        loginAsync()
    }, [])

    return (
        <div>
            DiscordRedirect
        </div>
    )
}
