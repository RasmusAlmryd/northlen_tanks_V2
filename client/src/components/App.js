// import {useState, useEffect} from 'react'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "../contexts/AuthContext"
import { SocketProvider } from "../contexts/SocketContext";
import {LobbyProvider } from "../contexts/LobbyContext"

import PrivateRoute from "./PrivateRoute";
import Menu from "./Menu";
import Lobby from "./Lobby";
import Login from "./Login";
import DiscordRedirect from "./DiscordRedirect";


function App() {
  return (
    // <Dashboard/>
    <AuthProvider>
      <SocketProvider>
        <LobbyProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/discord-oauth-redirect" element={<DiscordRedirect/>}/>
                <Route 
                  path="/menu" 
                  element={
                    <PrivateRoute redirectTo='/'>
                      <Menu/>
                    </PrivateRoute>}/>
                    <Route 
                  path="/lobby" 
                  element={
                    <PrivateRoute redirectTo='/'>
                      <Lobby/>
                    </PrivateRoute>}/>
              </Routes>
            </Router>
        </LobbyProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
