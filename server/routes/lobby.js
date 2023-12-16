import Lobby from "../utils/lobby.js"
import supportedColors from "../utils/supportedColors.js";
import {tokenAuth} from "../utils/tokenAuthentication.js"
import { v4 as uuidv4 } from 'uuid';

export default function(app, lobbies){
    app.post('/create-lobby', tokenAuth, (req, res) => {
        let lobbyId = Math.floor(10 + Math.random() * 90)
        lobbies.push(new Lobby(lobbyId, req.user.id))
        res.status(200)
        return res.json({lobby: lobbyId})
    })

    app.get('/player-colors', (req, res) => {
        return res.json({colors: supportedColors()})
        //https://gamedev.stackexchange.com/questions/46463/how-can-i-find-an-optimum-set-of-colors-for-10-players
    })  
}