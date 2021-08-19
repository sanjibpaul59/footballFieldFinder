import Field from "../../models/field.model";
import extend from "lodash/extend";
import errorHandler from "./../../helpers/dbErrorHandler";
import fs from "fs";
import formidable from "formidable";
import defaultImg from "./../../../client/assets/images/default-field.jpg";

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.multiples = true;
  form.parse(req, async (err, inputs, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    let field = new Field(inputs);
    field.fieldOwner = req.profile;
    if (files.image) {
      field.image.data = fs.readFileSync(files.image.path);
      field.image.contentType = files.image.type;
    }
    if (files.facilities) {
    }
    try {
      let result = await field.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const fieldByID = async (req, res, next, id) => {
  try {
    const field = await Field.findById(req.params.fieldId);
    if (!field) {
      return res.status(400).json({
        error: "Field not found",
      });
    }
    req.field = field;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve field",
    });
  }
};
const read = (req, res) => {
  req.field.image = undefined;
  return res.json(req.field);
};

const list = async (req, res) => {
  try {
    let fields = await Field.find().select("name email phone updated created");
    res.json(fields);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    let field = req.field;
    field = extend(field, fields);
    if (fields.slots) {
      field.slots = JSON.parse(fields.slots);
    }
    field.updated = Date.now();
    if (files.image) {
      field.image.data = fs.readFileSync(files.image.path);
      field.image.contentType = files.image.type;
    }
    try {
      await field.save();
      res.json(field);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const newSlot = async (req, res) => {
  try {
    let slot = req.body.slot;
    let result = await Course.findByIdAndUpdate(
      req.field._id,
      { $push: { slots: slot }, updated: Date.now() },
      { new: true }
    )
      .populate("fieldOwner", "_id name email phone")
      .exec();
    res.json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let field = req.field;
    let deleteField = await field.remove();
    res.json(deleteField);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isOwner = (req, res, next) => {
  const isOwner =
    req.field && req.auth && req.field.fieldOwner._id == req.auth._id;
  if (!isOwner) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

const listByOwner = (req, res) => {
  Field.find({ fieldOwner: req.profile._id }, (err, fields) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(fields);
  }).populate("fieldOwner", "_id name email phone");
};

const listOpenFields = (req, res) => {
  Field.find({ openForBooking: true }, (err, fields) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(fields);
  }).populate("fieldOwner", "_id name email phone");
};

const image = (req, res, next) => {
  if (req.field.image.data) {
    res.set("Content-Type", req.field.image.contentType);
    return res.send(req.field.image.data);
  }
  next();
};

const defaultImage = (req, res) => {
  return res.sendFile(process.cwd() + defaultImg);
};

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
  newSlot,
  fieldByID,
};
