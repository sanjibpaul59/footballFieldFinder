import React, { useState } from "react"
import PropTypes from "prop-types"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Add from "@material-ui/icons/AddBox"
import {
  DatePicker,
  TimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers"
import { makeStyles } from "@material-ui/core"
import { newSlot } from "./api-field"
import auth from "../auth/auth-helper"
import LuxonUtils from "@date-io/luxon"
import { DateTime } from "luxon"

const useStyles = makeStyles((theme) => ({
  form: {
    minWidth: 500,
  },
}))

export default function NewSlot(props) {
  const classes = useStyles()
  const jwt = auth.isAuthenticated()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState({
    ofDate: DateTime.now().toISODate(),
    day: "",
    startTime: DateTime.now().toISOTime(),
    endTime: DateTime.now().toISOTime(),
    duration: "",
    price: "",
    startDate: DateTime.now().toISODate(),
    endDate: DateTime.now().toISODate(),

    error: "",
  })
  // const clickCheck = () => {
  //   let startDate = DateTime.fromISO(values.startDate)
  //   let endDate = DateTime.fromISO(values.endDate)
  //   // let duration = endDate.diff(startDate).shiftTo("days").as("days")

  //   let startTime = DateTime.fromISO(values.startTime)
  //   let endTime = DateTime.fromISO(values.endTime)

  //   let startMoment = DateTime.fromISO(
  //     startDate.toISODate() + "T" + startTime.toISOTime()
  //   )

  //   let endMoment = DateTime.fromISO(
  //     endDate.toISODate() + "T" + endTime.toISOTime()
  //   )

  //   let slotStart = DateTime.fromISO(
  //     startDate.toISODate() + "T" + startTime.toISOTime()
  //   )
  //   let slotEnd = DateTime.fromISO(
  //     startDate.toISODate() + "T" + endTime.toISOTime()
  //   )

  //   let slotDay = startMoment.toFormat("EEEE")

  //   let slotDuration = slotEnd.diff(slotStart).toFormat("mm")

  //   while (endMoment > startMoment) {
  //     values.ofDate = startMoment
  //     values.startTime = startMoment
  //     values.endTime = startMoment.plus({ minutes: slotDuration })
  //     // console.log(
  //     //   DateTime.fromISO(values.ofDate).toLocaleString(DateTime.DATETIME_MED)
  //     // )
  //     // console.log(
  //     //   DateTime.fromISO(values.startTime).toLocaleString(DateTime.TIME_SIMPLE)
  //     // )
  //     // console.log(
  //     //   DateTime.fromISO(values.endTime).toLocaleString(DateTime.TIME_SIMPLE)
  //     // )
  //     startMoment = startMoment.plus({ days: 1 })
  //   }
  // }
  const clickSubmit = () => {
    let startDate = DateTime.fromISO(values.startDate)
    let endDate = DateTime.fromISO(values.endDate)

    let startTime = DateTime.fromISO(values.startTime)
    let endTime = DateTime.fromISO(values.endTime)

    let startMoment = DateTime.fromISO(
      startDate.toISODate() + "T" + startTime.toISOTime()
    )

    let endMoment = DateTime.fromISO(
      endDate.toISODate() + "T" + endTime.toISOTime()
    )

    let slotStart = DateTime.fromISO(
      startDate.toISODate() + "T" + startTime.toISOTime()
    )
    let slotEnd = DateTime.fromISO(
      startDate.toISODate() + "T" + endTime.toISOTime()
    )

    let slotDuration = slotEnd.diff(slotStart).toFormat("mm")

    while (endMoment >= startMoment) {
      values.ofDate = startMoment
      values.startTime = startMoment
      values.endTime = startMoment.plus({ minutes: slotDuration })
      values.day = startMoment.toFormat("EEEE")
      let slot = {
        ofDate: values.ofDate || undefined,
        day: values.day || undefined,
        startTime: values.startTime || undefined,
        endTime: values.endTime || undefined,
        duration: slotDuration || 0,
        price: values.price || undefined,
      }
      console.log(slot)
      newSlot(
        {
          fieldId: props.fieldId,
        },
        {
          t: jwt.token,
        },
        slot
      ).then((data) => {
        // console.log(data)
        if (data && data.error) {
          setValues({ ...values, error: data.error })
        } else {
          props.addSlot(data)
          setValues({
            ...values,
            ofDate: "",
            day: "",
            startTime: "",
            endTime: "",
            duration: "",
            price: "",
            ofField: "",
          })
          setOpen(false)
        }
      })

      startMoment = startMoment.plus({ days: 1 })
    }
  }

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Button
        aria-label="Add Slot"
        color="primary"
        variant="contained"
        onClick={handleClickOpen}
      >
        <Add /> &nbsp; New Slot
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div className={classes.form}>
          <DialogTitle id="form-dialog-title">Add New Slot</DialogTitle>
          <DialogContent>
            <TextField
              required
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              value={values.price}
              onChange={handleChange("price")}
            />
            <br />
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <DatePicker
                label="Start date"
                disablePast
                value={values.startDate}
                onChange={(date) =>
                  setValues({ ...values, startDate: date.toISODate() })
                }
                showTodayButton
              />
            </MuiPickersUtilsProvider>
            <br />
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <DatePicker
                label="End date"
                disablePast
                showTodayButton
                minDate={values.startDate}
                value={values.endDate}
                onChange={(date) =>
                  setValues({ ...values, endDate: date.toISODate() })
                }
              />
            </MuiPickersUtilsProvider>
            <br />
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <TimePicker
                label="Start Time"
                value={values.startTime}
                onChange={(date) =>
                  setValues({
                    ...values,
                    startTime: date.toISO(),
                  })
                }
              />
            </MuiPickersUtilsProvider>
            <br />
            <MuiPickersUtilsProvider utils={LuxonUtils}>
              <TimePicker
                label="End Time"
                value={values.endTime}
                onChange={(date) =>
                  setValues({
                    ...values,
                    endTime: date.toISO(),
                  })
                }
              />
            </MuiPickersUtilsProvider>
            <br />
          </DialogContent>
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}

          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={clickSubmit} color="secondary" variant="contained">
              Add
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  )
}
NewSlot.propTypes = {
  fieldId: PropTypes.string.isRequired,
  addSlot: PropTypes.func.isRequired,
}
