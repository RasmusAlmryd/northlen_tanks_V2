import React from 'react'
import Button from 'react-bootstrap/Button'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from "react-router-dom"

export default function Dashboard() {
  const {currentUser, logout} = useAuth()


  return (
    <div className='bg2'>
      Dashboard
      <br/>
      currentUser:
      <br/>
      <ul>
        {currentUser && JSON.stringify(currentUser)}
      </ul>
      <Button onClick={logout}>Sign out</Button>
    </div>
  )
}
