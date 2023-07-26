import jwt from 'jsonwebtoken'


export function tokenAuth(req, res, next) {
    var bearerToken = req.headers.authorization

    if(!bearerToken){
        return res.sendStatus(401)
    }

    let token = bearerToken.split(' ')[1]

    if(!token) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{

        if (err){
            return res.sendStatus(403)  
        } 

        req.user = user
        
        next()
    }) 
}

export function getTokenData(token){
    var data = null
    jwt.verify(token, process.env.JWT_SECRET, (err, response) =>{

        if (err) throw new Error(err)

        data = response
    });
    return data
}
