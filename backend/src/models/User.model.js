import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        minLength: 6,
    },
    gender: {
        type:String,
        default:"male",
    },
    bio:{
        type:String,
        default: "",
    },
    profilePic:{
        type:String,
        default:"",
    },
    nativeLanguage:{
        type:String,
        default:"",
    },
    learningLanguage:{
        type:String,
        default:"",
    },
    location:{
        type: String,
        default:"",
    },
    isOnboarded:{
        type: Boolean,
        default: false,
    },
    friends:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
},{timestamps:true}
);

//pre hook to encrypt password before saving
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        return;
    }
    try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(error){
         next(error);
    }
})

userSchema.methods.matchPassword = async function (enteredPassword){
    const isPaaswordCorrect = await bcrypt.compare(enteredPassword,this.password);
    return isPaaswordCorrect;
};
const User  = mongoose.model("User",userSchema);



export default User;