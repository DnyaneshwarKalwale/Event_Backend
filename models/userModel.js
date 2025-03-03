import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';



const GenerateRandomImage = () => {
    const arr = [
        'https://cdn-icons-png.flaticon.com/128/2202/2202112.png',
        'https://cdn-icons-png.flaticon.com/128/4333/4333609.png',
        'https://cdn-icons-png.flaticon.com/128/924/924915.png',
        'https://cdn-icons-png.flaticon.com/128/11498/11498793.png',
        'https://cdn-icons-png.flaticon.com/128/706/706830.png',
        'https://cdn-icons-png.flaticon.com/128/4140/4140061.png'
    ]

    return arr[Math.floor(Math.random() * arr.length)]
}





const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"]
    },
    password: {
        type: String
    },
    picture: {
        type: String,
        default: () => GenerateRandomImage()
    },
    description : {
        type : String
    }
}, {
    timestamps: true
});


userSchema.methods.campareOtp = async function (userotp, dbotp) {
    let result = await bcrypt.compare(userotp, dbotp);
    return result;
}



userSchema.methods.camparePassword = async function (userpassword, dbpassword) {
    let result = await bcrypt.compare(userpassword, dbpassword);
    return result;
}





const userModel = new mongoose.model("users", userSchema);
export default userModel;