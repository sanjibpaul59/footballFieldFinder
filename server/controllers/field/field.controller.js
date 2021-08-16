import Field from '../../models/field.model'
import extend from 'lodash/extend'
import errorHandler from './../../helpers/dbErrorHandler'

import fs from 'fs'
import formidable from 'formidable'
import defaultImg from './../../../client/assets/images/default-field.jpg'

const create = (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      })
    }
    let field = new Field(fields)
    field.fieldOwner = req.profile
    if (files.image) {
      field.image.data = fs.readFileSync(files.image.path)
      field.image.contentType = files.image.type
    }
    try {
      let result = await field.save()
      res.json(result)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      })
    }
  })
}

const fieldByID = async (req, res, next, id) => {
  try {
    let field = await Field.fieldByID(id).populate('fieldOwner', '_id name')
    if (!field) {
      return res.status(400).json({
        error: 'Field not found',
      })
    }
    req.field = field
    next()
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve field',
    })
  }
}
const read = (req, res) => {
  req.field.image = undefined
  return res.json(req.field)
}

const list = async (req, res) => {
  try {
    let fields = await Field.find().select(
      'fieldName fieldLocation updated created',
    )
    res.json(fields)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const update = async (req, res) => {
  let form = new formidable.IncomingForm()
  form.keepExtensions = true
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded',
      })
    }
    let field = req.field
    field = extend(field, fields)
    if (fields.facilities) {
      field.facilities = JSON.parse(fields.facilities)
    }
    field.updated = Date.now()
    if (files.image) {
      field.image.data = fs.readFileSync(files.image.path)
      field.image.contentType = files.image.type
    }
    try {
      await field.save()
      res.json(field)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      })
    }
  })
}

const newFacility = async (req, res) => {
  try {
    let facility = req.body.facility
    let result = await Course.findByIdAndUpdate(
      req.field._id,
      { $push: { facilities: facility }, updated: Date.now() },
      { new: true },
    )
      .populate('fieldOwner', '_id name')
      .exec()
    res.json(result)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const remove = async (req, res) => {
  try {
    let field = req.field
    let deleteField = await field.remove()
    res.json(deleteField)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    })
  }
}

const isOwner = (req, res, next) => {
  const isOwner =
    req.field && req.auth && req.field.fieldOwner._id == req.auth._id
  if (!isOwner) {
    return res.status('403').json({
      error: 'User is not authorized',
    })
  }
  next()
}

const listByOwner = (req, res) => {
  Field.find({ fieldOwner: req.profile._id }, (err, fields) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      })
    }
    res.json(fields)
  }).populate('fieldOwner', '_id name')
}

const listOpenFields = (req, res) => {
  Field.find({ openForBooking: true }, (err, fields) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      })
    }
    res.json(fields)
  }).populate('owner', '_id name')
}

const image = (req, res, next) => {
  if (req.field.image.data) {
    res.set('Content-Type', req.field.image.contentType)
    return res.send(req.field.image.data)
  }
  next()
}

const defaultImage = (req, res) => {
  return res.sendFile(process.cwd() + defaultImg)
}

export default {
  create,
  read,
  update,
  remove,
  list,
  listOpenFields,
  listByOwner,
  image,
  defaultImage,
  isOwner,
  newFacility,
  fieldByID,
}
