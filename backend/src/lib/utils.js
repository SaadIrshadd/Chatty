import jwt from "jsonwebtoken" 

export const generateToken = (userId, res) =>{

    //generating a token
    const token =  jwt.sign(
        {userId}, 
        process.env.JWT_SECRET, 
        { expiresIn: "7d"}
    )

    //sending token as cookie
    res.cookie("jwt", token, { 
        maxAge: 7 * 24 * 60 * 60 * 100, //MS
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV != "development"
    });

    return token;
}