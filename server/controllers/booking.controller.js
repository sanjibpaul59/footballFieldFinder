import Booking from "../models/booking.model";
import errorHandler from "./../helpers/dbErrorHandler";

const create = async (req, res) => {
  let newBooking = {
    field: req.field,
    player: req.auth,
  };
  newBooking.bookingStatus = req.field.slots.map((slot) => {
    return { slot: slot, complete: false };
  });

  const booking = new Booking(newBooking);
  try {
    let result = await booking.save();
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const bookingByID = async (req, res, next, id) => {
  try {
    let booking = await Booking.findById(id)
      .populate({ path: "field", populate: { path: "fieldOwner" } })
      .populate("player", "_id name");
    if (!booking) {
      return res.status(400).json({
        error: "Booking not found",
      });
    }
    req.booking = booking;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve Booking Information",
    });
  }
};
const read = (req, res) => {
  return res.json(req.booking);
};

const complete = async (req, res) => {
  let updatedData = {};
  updatedData["bookingStatus.$.complete"] = req.body.complete;
  updatedData.updated = Date.now();
  if (req.body.bookingCompleted) {
    updatedData.completed = req.body.bookingCompleted;
    try {
      let booking = new Booking.updateOne(
        { "bookingStatus._id": req.body.bookingStatusId },
        { $set: updatedData }
      );
      res.json(booking);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  }
};
const remove = async (req, res) => {
  try {
    let booking = req.booking;
    let deletedBooking = await booking.remove();
    res.json(deletedBooking);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const isPlayer = (req, res, next) => {
  const isPlayer = req.auth && req.auth._id == req.booking.player._id;
  if (!isPlayer) {
    return res.status("403").json({
      error: "User is not player",
    });
  }
  next();
};

const listBooked = async (req, res) => {
  try {
    let bookings = await Booking.find({ player: req.auth._id })
      .sort({ completed: 1 })
      .populate("field", "_id name phone");
    res.json(bookings);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const findBooked = async (req, res, next) => {
  try {
    let bookings = await Booking.find({
      field: req.field._id,
      player: req.auth._id,
    });
    if (bookings.length == 0) {
      next();
    } else {
      res.json(bookings[0]);
    }
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const bookingStats = async (req, res) => {
  try {
    let stats = {};
    stats.totalBooked = await Booking.find({
      field: req.field._id,
    }).countDocuments();
    stats.totalCompleted = await Booking.find({ field: req.field._id })
      .exists("completed", true)
      .countDocuments();
    res.json(stats);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default {
  create,
  bookingByID,
  read,
  complete,
  remove,
  isPlayer,
  listBooked,
  findBooked,
  bookingStats,
};
