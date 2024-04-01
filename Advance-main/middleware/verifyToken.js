const jwt =require("jsonwebtoken");

//verifyToken
function verifyToken( req,res,next){
    const token =req.headers.token;
    if(token){
        try{
          const decoded =jwt.verify(token,process.env.JWT_SECRET_KEY);
          req.user=decoded;
          next();
        }catch(error){
            res.status(401).json({message:"invalid token"});
        }

    }else{
        res.status(401).json({message:"no token provided"});
    }
} 


//verifyToken &authorization

function verifyTokenandAuthorization(req,res,next) {
    verifyToken(req, res,() => {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            return res.status(403).json({message:"you are not allowed"})
        }
    });
}


//verifyToken & Admin

function verifyTokenandAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if( req.user.isAdmin){
            next();
        }else{
            return res.status(403).json({message:"you are not allowed,only admin allowed"})
        }
    });
}



module.exports= {
    verifyToken,
    verifyTokenandAuthorization,
    verifyTokenandAdmin,
    
};