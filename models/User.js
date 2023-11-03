const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name'],
        minlength: 3,
        maxlength: 20
    },
    email:{
        type:String,
        unique:true,
        required:[true,'please provide email'],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'please provide valid email'
        ],
    },
    password:{
        type:String,
        required:[true,'please provide password'],
        minlength: 6
    }
})


//hashing password
UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

//generating jwt token
UserSchema.methods.createJWT = function(){
    return jwt.sign({userID: this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePass = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password)
}

module.exports = mongoose.model('User',UserSchema)