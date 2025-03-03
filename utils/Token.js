import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const SignToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET)
}



export const sendToken = (resp, user, message) => {
    resp.status(200).json({
        status: 'success',
        message,
        token: SignToken(user._id),
        data: {
            userId: user._id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            description: user.description
        }
    })
}


export const VarifyToken = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(400).json({
            message: "You are not logged in! Please log in to get access.",
        });
    }
    const decoded = (jwt.verify)(token, process.env.JWT_SECRET);
    const this_user = await userModel.findById(decoded.userId);
    if (!this_user) {
        return res.status(401).json({
            message: "The user belonging to this token does no longer exists.",
        });
    }
    req.user = this_user;
    next();
};