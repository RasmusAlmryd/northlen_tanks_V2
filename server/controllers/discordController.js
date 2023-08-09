
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken'
import {tokenAuth} from '../utils/tokenAuthentication.js'
import { response } from 'express';


export default function(app){
    app.get('/discord-oauth', (req, res) => {
        var state = req.cookies.state
        if (!state){
            res.status(400);
            return res.send('Bad Request: state parameter not set');
        }
    
        // console.log(encodeURIComponent(process.env.REDIRECT_URL));
        var redirectURL = `${process.env.DISCORD_API_ENDPOINT}/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URL)}&scope=identify&state=${state}`
        // var finalRedirectUrl = `${process.env.DISCORD_OAUTH2_URL}&state=${state}`
    
        return res.redirect(redirectURL)
    })

    // Generating and returning a JWT from discord data
    app.post('/oauth2-token', async (req, res) => {
        
        var code = req.body?.code;


        if(!code){
            res.status(400);
            return res.send('Bad Request: code parameter not set');
        }

        if(code === '1234'){
            let devToken = devAuthToken();
            res.json({token:devToken});
            return;
        }

        // exchanging code for access token
        var body = new URLSearchParams({
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': process.env.REDIRECT_URL,
            'scope': 'identify'
        })
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }


        try {
            var response = await fetch(`${process.env.DISCORD_API_ENDPOINT}/oauth2/token`,{
                method: 'post',
                body: body,
                headers: headers
            })
        } catch (error) {
            res.status(500);
            return res.send({error: err.message});
        }

        if(!response.ok){
            res.status(403);
            return res.send({error: 'ajajaj'});
        }

        let TokenData = await response.json();


        // retrieving user data from discord

        try {
            response = await fetch(`${process.env.DISCORD_API_ENDPOINT}/users/@me`,{
                method: 'GET',
                headers: {'Authorization': `Bearer ${TokenData.access_token}`}
            })
        } catch (error) {
            res.status(500);
            return res.send({error: err.message});
        }
    
        var userData = await response.json()
        
        let tokenPayload = {
            id: userData.id,
            username: userData.username,
            global_name: userData.global_name,
            avatar: userData.avatar
        }
    
        let expiresIn = 6000 // 10 minutes
    
        let token = jwt.sign(tokenPayload, process.env.JWT_SECRET,{
            algorithm: 'HS256',
            expiresIn: expiresIn,
            issuer: process.env.SERVER_ENDPOINT
        })
        
        res.json({token});

    })

    //route for temporary dev tokens
    function devAuthToken(){
        let sixDigit = Math.floor(100000 + Math.random() * 900000)
        let threeDigit = Math.floor(100 + Math.random() * 900)
        let tokenPayload = {
            id: sixDigit,
            username: 'Temp' + threeDigit,
            global_name: 'TEMPG' + threeDigit,
            avatar: '123456'
        } 

        let expiresIn = 6000 // 10 minutes
    
        let token = jwt.sign(tokenPayload, process.env.JWT_SECRET,{
            algorithm: 'HS256',
            expiresIn: expiresIn,
            issuer: process.env.SERVER_ENDPOINT
        })
        
        return token;
    }

    
    app.get('/discord-oauth-redirect', async (req, res) => {
    
        if (req.query.error && req.query.error === 'access_denied'){
            // res.status(403)
            // return res.json({ error: 'User terminated authentication'})
            return res.redirect(`${process.env.CLIENT_ENDPOINT}?error=terminated-authentication`);
        }
    
        var code = req.query.code;
        var state = req.query.state
    
        var userState = req.cookies.state
    
        if (!userState || userState !== state){
            // res.status(403)
            // return res.json({ error: 'Invalid state parameter'})
            return res.redirect(`${process.env.CLIENT_ENDPOINT}?error=invalid-state`);
        }
    
        
    
        var body = new URLSearchParams({
            'client_id': process.env.CLIENT_ID,
            'client_secret': process.env.CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': process.env.REDIRECT_URL,
            'scope': 'identify'
        })
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    
        var response = await fetch(`${process.env.DISCORD_API_ENDPOINT}/oauth2/token`,{
            method: 'post',
            body: body,
            headers: headers
        }) 
        var tokenResponse = await response.json()
    
        response = await fetch(`${process.env.DISCORD_API_ENDPOINT}/users/@me`,{
            method: 'GET',
            headers: {'Authorization': `Bearer ${tokenResponse.access_token}`}
        })
    
        var userData = await response.json()
        
        let tokenPayload = {
            id: userData.id,
            username: userData.username,
            global_name: userData.global_name,
            avatar: userData.avatar
        }
    
        let expiresIn = 600 // 10 minutes
    
        let token = jwt.sign(tokenPayload, process.env.JWT_SECRET,{
            algorithm: 'HS256',
            expiresIn: expiresIn,
            issuer: process.env.SERVER_ENDPOINT
        })
    
        res.cookie('token', token, {maxAge:expiresIn*1000, httpOnly: true});
        res.redirect(`${process.env.CLIENT_ENDPOINT}`);
    })
    
    app.get('/user', tokenAuth, (req, res) => {
        var data = {
            id: req.user.id,
            username: req.user.username,
            global_name: req.user.global_name,
            avatar: req.user.avatar
        }   
        return res.json({user: data})

        // var token = req.cookies.token
        // console.log(req.cookies.state);
    
        // if(!token){
        //     res.status(403)
        //     return res.json({ error: 'No token provided' })
        // }
    
        // try{
        //     var decoded = jwt.verify(token, process.env.JWT_SECRET)
        //     var data = {
        //         id: decoded.id,
        //         username: decoded.username,
        //         global_name: decoded.global_name,
        //         avatar: decoded.avatar
        //     }
        //     return res.json(data)
        // }catch{
        //     res.status(403)
        //     return res.json({ error: 'Invalid token'})
        // }
    });
    
    app.get('/test', (req, res) => {
        console.log(req.cookies.state);
        res.json({ success: true})
    })
}