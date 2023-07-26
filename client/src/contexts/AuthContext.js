import React, { useContext, useState, useEffect } from "react"
import Cookies from 'universal-cookie';

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true);

    const cookies = new Cookies();


    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        const asyncAuthSequence = async () => {
            if(storedToken){
                setToken(storedToken);
                try {
                    await getUser(storedToken);
                    setLoggedIn(true);
                } catch (error) {
                    console.log('second');
                    handleLogout();
                    
                }
            }
            setLoading(false);
        }

        asyncAuthSequence();
    }, []);



    const handleLogin = async (authCode) => {
        let response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/oauth2-token`, {
            method: 'POST',
            body: JSON.stringify({code: authCode}),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if(!response.ok){
            throw new Error ({code: 500, message: "unable to retrieve token"})
        }

        let data = await response.json()

        localStorage.setItem('token', data.token);
        setToken(data.token);

        try {
            await getUser(data.token);
            setLoggedIn(true);
        } catch (error) {
            console.log('second');
            handleLogout();
            
        }
        // await getUser(data.token);
        // if(currentUser) {
        //     setLoggedIn(true);
        // }else{
        //     console.log('second');
        //     handleLogout();
        // }
        
    }

    
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken('');
        setLoggedIn(false);
        setCurrentUser(null);
    };



    const getUser = async (token) =>{
        if(!token) return;

        let response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })

        if(!response.ok) {
            throw new Error({code: response.status, message: "unable to retrieve token"})
        }

        let data = await response.json()

        console.log('setting user');
        setCurrentUser(data.user)

    }



    function authenticate() {
        generateState();
        window.location.href = process.env.REACT_APP_DICORD_OAUTH_URL;
    }

    function generateState(){
        if (!cookies.get('state')) {
            const generateRandomString = function (length, randomString = "") {
                randomString += Math.random().toString(20).substr(2, length);
                if (randomString.length > length) return randomString.slice(0, length);
                return generateRandomString(length, randomString);
            };
            cookies.set('state', generateRandomString(20), { path: '/' });
        }
    }

    const value = {
        currentUser,
        login: handleLogin,
        logout: handleLogout,
        loggedIn,
        authenticate,
        generateState,
        token
    }

    return (
        <AuthContext.Provider value={value}>
          {loading ? <div>Loading authentication...</div> : children} {/* Render children only after authentication check */}
        </AuthContext.Provider>
      );
}
