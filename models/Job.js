const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,"please provide a company"],
        maxlength:50
    },
    position:{
        type:String,
        required:[true,"please provide a position"],
        maxlength:30
    },
    status:{
        type:String,
        enum:['interview','pending','declined'],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,"please provide an user"]
    }
},{timestamps:true})

module.exports = mongoose.model('Job',JobSchema)