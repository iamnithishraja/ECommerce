import dotenv from "dotenv";
dotenv.config({ path: "backend/config/config.env" });
import User from "../models/userModel.js"
import jsonwebtoken from "jsonwebtoken";

async function isAuthenticatedUser(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.json({success: false,message:undefined});
        } else {
            const decoded_data = jsonwebtoken.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded_data.id);
            next();
        }
    } catch (error) {
        console.log(error);
    }
}

async function authoriseRoles(req,res,next,roles) {
    if (!roles.includes(req.user.role)) {
        res.json({ success: false, message: `only ${roles} can access this` });
    }else{
        next();
    }
}



export { isAuthenticatedUser, authoriseRoles };