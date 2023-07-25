import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuth } from './AuthContext'


const SocketContext = React.createContext()


var socket = null

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({children }) {
  // const [socket, setSocket] = useState()
  const {currentUser, token} = useAuth()
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    console.log(currentUser);
    if(!currentUser) {
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
    });

    console.log('connecting socket');
    
    // setSocket(newSocket)
    setLoading(false)

    return () => socket.close()
  }, [currentUser])

  return (
    <SocketContext.Provider value={{socket, connected}}>
      {loading ? <div>Loading socket...</div> : children}
    </SocketContext.Provider>
  )
}