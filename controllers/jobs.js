const JobSchema = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../errors')

const getAllJobs = async(req,res)=>{
    const jobs = await JobSchema.find({createdBy:req.user.userID}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}

const getJob = async(req,res)=>{
    const userId = req.user.userID
    const jobId= req.params.id
    // console.log(jobId)
    const job = await JobSchema.findOne({_id:jobId,createdBy:userId})
    if(!job){
        throw new NotFoundError("No job found")
    }
    res.status(StatusCodes.OK).json({job})
}

const createJob = async(req,res)=>{
    req.body.createdBy = req.user.userID
    const job = await JobSchema.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async(req,res)=>{
    const userId = req.user.userID
    const jobId = req.params.id
    const body = req.body
    const job = await JobSchema.findOneAndUpdate({_id:jobId,createdBy:userId},body,{new:true})
    if(!job){
        throw new NotFoundError("No job found")
    }
    // console.log(body)
    
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async(req,res)=>{
    const userId = req.user.userID
    const jobId = req.params.id
    const job = await JobSchema.findOneAndDelete({_id:jobId,createdBy:userId})
    if(!job){
        throw new NotFoundError("No job found")
    }
    res.status(StatusCodes.OK).json({job:job,msg:"deleted"})
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}