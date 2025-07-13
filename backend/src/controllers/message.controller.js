import User from "../models/user.model.js";
import Message from "../models/message.model.js"

import cloudinary from "../lib/cloudinary.js"

export const getUserForSideBar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const fileredUser = await User.find({_id: {$ne: loggedInUser}}).select("-password");

        res.status(200).json(fileredUser)
    } catch (error) {
        console.log("Error in getUserForSideBar", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId:myId, receiverId:userToChatId },
                { senderId:userToChatId, receiverId:myId }
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessages controler", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessages = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: recieverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            //upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        res.status(200).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}