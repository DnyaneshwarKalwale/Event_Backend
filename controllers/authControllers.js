


import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import { ResponseError, ServerError } from '../utils/ErrorResponse.js';
import { sendToken } from '../utils/Token.js';





const HashPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}


export const Signup = async (req, resp, next) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return ResponseError(resp, "all Fields are required")
        }

        const user = await userModel.findOne({ email });
        if (user) {
            return ResponseError(resp, "email already registered")
        }
        // if there is no user with given email
        const newUser = await userModel.create({
            email, password: await HashPassword(password), name
        });

        resp.status(200).json({
            status: 'success',
            message: 'user registered successfully'
        });

    } catch (error) {
        return ServerError(resp)
    }
}



export const Signin = async (req, resp, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        if (!email || !password) {
            return ResponseError(resp, "all Fields are required")
        }
        const user = await userModel.findOne({ email });
        if (!user || !(await user.camparePassword(password, user.password))) {
            return ResponseError(resp, "Invalid email or password")
        }
        sendToken(resp, user, "logged in successfully");

    } catch (error) {
        console.log(error)
        return ServerError(resp)
    }
}


