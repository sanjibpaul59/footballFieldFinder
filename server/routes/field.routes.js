import express from "express"
import fieldCtrl from "../controllers/field.controller"
import userCtrl from "../controllers/user.controller"
import authCtrl from "../controllers/auth.controller"

const router = express.Router()

router.route("/api/fields/openForBooking").get(fieldCtrl.listOpenFields)

router
  .route("/api/fields/by/:userId")
  .post(
    authCtrl.requireSignin,
    authCtrl.hasAuthorization,
    userCtrl.isOwner,
    fieldCtrl.create
  )
  .get(authCtrl.requireSignin, authCtrl.hasAuthorization, fieldCtrl.listByOwner)

router
  .route("/api/fields/image/:fieldId")
  .get(fieldCtrl.photo, fieldCtrl.defaultPhoto)

router.route("/api/fields/defaultPhoto").get(fieldCtrl.defaultPhoto)

router
  .route("/api/fields/:fieldId/slot/new")
  .put(authCtrl.requireSignin, fieldCtrl.isOwner, fieldCtrl.newSlot)

router
  .route("/api/fields/:fieldId")
  .get(fieldCtrl.read)
  .put(authCtrl.requireSignin, fieldCtrl.isOwner, fieldCtrl.update)
  .delete(authCtrl.requireSignin, fieldCtrl.isOwner, fieldCtrl.remove)

router.param("fieldId", fieldCtrl.fieldByID)
router.param("userId", userCtrl.userByID)

export default router
