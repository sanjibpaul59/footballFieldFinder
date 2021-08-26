import React, { useState } from "react"
import PropTypes from "prop-types"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Add from "@material-ui/icons/AddBox"
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers"
import { makeStyles } from "@material-ui/core"
import { newSlot } from "./api-field"
import auth from "../auth/auth-helper"
import MomentUtils from "@date-io/moment"
import moment from "moment"

const useStyles = makeStyles((theme) => ({
  form: {
    minWidth: 500,
  },
}))

export default function NewSlot(props) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState({
    price: "",
    day: "",
    startDate: moment(),
    endDate: moment(),
    startTime: "",
    endTime: "",
  })
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value })
  }
  const handleDateChange = (name) => (date) => {
    // let current = moment()
    // let end = moment().add(6, "days")
    // while (current.isBefore(end, "day")) {
    //   console.log(`at ${current.format("MM-DD-YYYY")}`)
    //   current.add(1, "days")
    // }
    setValues({ ...values, [name]: date })
  }
  const jwt = auth.isAuthenticated()
  const clickCheck = () => {
    console.log()
    let startMoment = values.startDate
    let endMoment = values.endDate
    while (startMoment.isBefore(endMoment, "day")) {
      console.log(`${startMoment.format("MM-DD-YYYY")}`)
      startMoment.add(1, "days")
    }
  }
  const clickSubmit = () => {
    const slot = {
      price: values.price || undefined,
      day: values.day || undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
      startTime: values.startTime || undefined,
      endTime: values.endTime || undefined,
    }

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
          price: "",
          day: "",
          startTime: "",
          // redirect:true,
          endTime: "",
        })
        setOpen(false)
      }
    })
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
              margin="dense"
              label="Price"
              type="text"
              fullWidth
              value={values.price}
              onChange={handleChange("price")}
            />
            <br />
            <TextField
              margin="dense"
              label="Day"
              type="text"
              fullWidth
              value={values.day}
              onChange={handleChange("day")}
            />
            <br />
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                label="Start date"
                disablePast
                value={values.startDate}
                onChange={handleDateChange("start Date")}
                showTodayButton
                format="MM-DD-YYYY"
              />
            </MuiPickersUtilsProvider>
            <br />
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                label="End date"
                disablePast
                showTodayButton
                value={values.endDate}
                onChange={handleDateChange("end Date")}
                format="MM-DD-YYYY"
              />
            </MuiPickersUtilsProvider>
            <br />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={clickCheck} color="secondary" variant="contained">
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
