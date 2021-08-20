import express from "express";
import bookingCtrl from "../controllers/booking.controller";
import fieldCtrl from "../controllers/field.controller";
import authCtrl from "../controllers/auth.controller";

const router = express.Router();

router
  .route("/api/booking/booked")
  .get(authCtrl.requireSignin, bookingCtrl.listBooked);

router
  .route("/api/booking/new/:fieldId")
  .post(authCtrl.requireSignin, bookingCtrl.findBooked, bookingCtrl.create);

router.route("/api/booking/stats/:fieldId").get(bookingCtrl.bookingStats);

router
  .route("/api/booking/complete/:bookingId")
  .put(authCtrl.requireSignin, bookingCtrl.isPlayer, bookingCtrl.complete);

router
  .route("/api/booking/:bookingId")
  .get(authCtrl.requireSignin, bookingCtrl.isPlayer, bookingCtrl.read)
  .delete(authCtrl.requireSignin, bookingCtrl.isPlayer, bookingCtrl.remove);

router.param("fieldId", fieldCtrl.fieldByID);
router.param("bookingId", bookingCtrl.bookingByID);

export default router;
