import Lobby from "../lobby.js"
import {tokenAuth} from "../utils/tokenAuthentication.js"
import { v4 as uuidv4 } from 'uuid';

export default function(app, lobbies){
    app.post('/create-lobby', tokenAuth, (req, res) => {
        let lobbyId = Math.floor(1000 + Math.random() * 9000)//uuidv4()
        lobbies.push(new Lobby(lobbyId, req.user.id))
        res.status(200)
        return res.json({lobby: lobbyId})
    })
}