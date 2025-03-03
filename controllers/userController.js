import { ResponseError, ServerError } from "../utils/ErrorResponse.js"
import userModel from "../models/userModel.js";
import eventModel from "../models/eventModel.js";


export const getUser = async (req , resp , next) => {
    try {
        const {userId} = req.params;
        const user =  await userModel.findById(userId).select("name description picture");
        if(!user) return ResponseError(resp , 'user not found');
        
        const events = await eventModel.find({
            owner : user._id
        });

        resp.status(200).json({
            status : 'success',
            message : "user fetched successfully",
            user,
            events
        });

    } catch (error) {
        ServerError(resp)
    }
}


export const updateUser = async (req, resp, next) => {
    try {
        const { _id } = req.user;
        const user = await userModel.findByIdAndUpdate(_id, {
            name: req.body.name,
            picture: req.body.picture,
            description: req.body.description,
        }, { new: true });


        resp.status(200).json({
            status: 'success',
            message: "profile updated",
            user: {
                userId: user._id,
                description: user.description,
                name: user.name,
                picture: user.picture
            }
        });


    } catch (error) {
        console.log(error)
        ServerError(resp)
    }
}