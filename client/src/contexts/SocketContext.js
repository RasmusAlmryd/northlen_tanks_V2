import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from './AuthContext'


const SocketContext = React.createContext()


var socket = null

export function useSocket() {
    return useContext(SocketContext)
}

export function SocketProvider({ children }) {
    // const [socket, setSocket] = useState()
    const { loggedIn,logout, currentUser, token } = useAuth()
    const [loading, setLoading] = useState(true)
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        if (!currentUser) {
            setLoading(false)
            return
        }

        socket = io(
            process.env.REACT_APP_API_ENDPOINT,
            {
                extraHeaders: {
                    authorization: 'Bearer ' + token
                },
                withCredentials: true
            }
        )

        socket.on('connect', () => {
            setConnected(true);
        });

        socket.on('disconnect', () => {
            setConnected(false);
            logout();
        });

        socket.on('connect_error', (err) => {
            console.log(err);
            socket.close();
            logout();
        });

        setLoading(false)

        return () => socket.close()
    }, [loggedIn])

    return (
        <SocketContext.Provider value={{ socket, connected }}>
            {loading ? <div>Loading socket...</div> : children}
        </SocketContext.Provider>
    )
}