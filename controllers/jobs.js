const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors');
const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json( { jobs,count: jobs.length })
}

const getJob = async (req, res) => {
    const id = req.params.id
    const uid = req.user.userId
    const job = await Job.findOne({_id:id,createdBy:uid})
    if(!job) {
        throw new BadRequestError('Job not found')
    }
    res.status(StatusCodes.OK).json( { job })
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}
const updateJob = async (req, res) => {
    const {company, position} = req.body
    const id = req.params.id
    const uid = req.user.userId
  
    if(company === '' || position === '') {
        throw new BadRequestError('Company or Position fields connot be empty')
    }
    const job = await Job.findOneAndUpdate({_id:id,createdBy:uid},req.body, {new:true,runValidators:true})
    res.status(StatusCodes.OK).json( { job })
}
const deleteJob = async (req, res) => {
    const id = req.params.id
    const uid = req.user.userId
    const job = await Job.findOneAndRemove({_id:id,createdBy:uid},req.body)
    if(!job) {
        throw new ("no job found")
    }
    res.status(StatusCodes.OK).send( {message: "job delete succeessfully." })
}


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
}