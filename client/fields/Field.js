import React, { useState, useEffect } from "react"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardMedia from "@material-ui/core/CardMedia"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import Edit from "@material-ui/icons/Edit"
import PeopleIcon from "@material-ui/icons/Group"
import CompletedIcon from "@material-ui/icons/VerifiedUser"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import MaterialTable from "material-table"
import Chip from "@material-ui/core/Chip"
import { makeStyles } from "@material-ui/core"
import { read, update } from "./api-field.js"
import { Link, Redirect } from "react-router-dom"
import auth from "../auth/auth-helper"
import DeleteField from "./DeleteField"
import NewSlot from "./NewSlot.js"
import { bookingStats } from "./../booking/api-booking.js"
import Book from "./../booking/Book"
import { DateTime } from "luxon"

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(12),
  }),
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "24px 40px 40px",
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  media: {
    height: 190,
    display: "inline-block",
    width: "100%",
    marginLeft: "16px",
  },
  icon: {
    verticalAlign: "sub",
  },
  category: {
    color: "#5c5c5c",
    fontSize: "0.9em",
    padding: "3px 5px",
    backgroundColor: "#dbdbdb",
    borderRadius: "0.2em",
    marginTop: 5,
  },
  action: {
    margin: "10px 0px",
    display: "flex",
    justifyContent: "flex-end",
  },
  statSpan: {
    margin: "7px 10px 0 10px",
    alignItems: "center",
    color: "#616161",
    display: "inline-flex",
    "& svg": {
      marginRight: 10,
      color: "#b6ab9a",
    },
  },
  enroll: {
    float: "right",
  },
}))

export default function Field({ match }) {
  const classes = useStyles()
  const [stats, setStats] = useState({})
  const [field, setField] = useState({ fieldOwner: {} })
  const [values, setValues] = useState({
    error: "",
    redirect: false,
  })
  const [open, setOpen] = useState(false)
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    read(
      {
        fieldId: match.params.fieldId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setField(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.fieldId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    bookingStats(
      { fieldId: match.params.fieldId },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setStats(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.fieldId])

  const removeField = (field) => {
    setValues({ ...values, redirect: true })
  }
  const addSlot = (field) => {
    setField(field)
  }

  const clickOpenForBooking = () => {
    if (field.slots.length > 0) {
      setOpen(true)
    }
  }

  const openBooking = () => {
    let fieldData = new FormData()
    fieldData.append("openForBooking", true)
    update(
      {
        fieldId: match.params.fieldId,
      },
      {
        t: jwt.token,
      },
      fieldData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setField({ ...field, openForBooking: true })
        setOpen(false)
      }
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSlotInfo = (slots) => {
    if (slots != undefined) {
      let allAvailableSlots = slots.reduce(function (validSlots, slot) {
        if (DateTime.now() < DateTime.fromISO(slot.ofDate)) {
          let availbaleSlots = new Object()
          availbaleSlots.ofDate = DateTime.fromISO(slot.ofDate).toISODate()
          availbaleSlots.day = slot.day
          availbaleSlots.startTime = DateTime.fromISO(slot.startTime).toFormat(
            "hh':'mm a"
          )
          availbaleSlots.endTime = DateTime.fromISO(slot.endTime).toFormat(
            "hh':'mm a"
          )
          availbaleSlots.duration = slot.duration + " mins"
          availbaleSlots.price = slot.price
          availbaleSlots.status =
            slot.bookingStatus == false ? "Available for Booking" : "Booked"
          validSlots.push(availbaleSlots)
        }
        return validSlots
      }, [])
      return allAvailableSlots
    }
  }
  const handleAvailableSlots = (slots) => {
    if (slots != undefined) {
      let allAvailableSlots = slots.reduce(function (validSlots, slot) {
        if (DateTime.now() < DateTime.fromISO(slot.ofDate)) {
          let availbaleSlots = new Object()
          availbaleSlots.ofDate = DateTime.fromISO(slot.ofDate).toISODate()
          availbaleSlots.day = slot.day
          availbaleSlots.startTime = DateTime.fromISO(slot.startTime).toFormat(
            "hh':'mm a"
          )
          availbaleSlots.endTime = DateTime.fromISO(slot.endTime).toFormat(
            "hh':'mm a"
          )
          availbaleSlots.duration = slot.duration + " mins"
          availbaleSlots.price = slot.price
          validSlots.push(availbaleSlots)
        }
        return validSlots
      }, [])
      return allAvailableSlots.length
    }
  }

  if (values.redirect) {
    return <Redirect to={"/owner/my-fields"} />
  }

  const imageUrl = field._id
    ? `/api/fields/image/${field._id}?${new Date().getTime()}`
    : `/api/fields/defaultPhoto`

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          title={field.fieldName}
          subheader={
            <div>
              <Link
                to={"/user/" + field.fieldOwner._id}
                className={classes.sub}
              >
                {" "}
                By {field.fieldOwner.name}
              </Link>
              {/* <span className={classes.category}>
                Location: {field.location}
              </span> */}
              <span className={classes.category}>
                Contact: {field.fieldOwner.phone}
              </span>
            </div>
          }
          action={
            <>
              {auth.isAuthenticated().user &&
                auth.isAuthenticated().user._id == field.fieldOwner._id && (
                  <span className={classes.action}>
                    <Link to={"/owner/my-field/edit/" + field._id}>
                      <IconButton aria-label="Edit" color="secondary">
                        <Edit />
                      </IconButton>
                    </Link>
                    {!field.openForBooking ? (
                      <>
                        <Button
                          color="secondary"
                          variant="outlined"
                          onClick={clickOpenForBooking}
                        >
                          {field.slots.length == 0
                            ? "Add atleast 1 slot to open for Booking"
                            : "Open for Booking"}
                        </Button>
                        <DeleteField field={field} onRemove={removeField} />
                      </>
                    ) : (
                      <Button color="primary" variant="outlined">
                        Opened
                      </Button>
                    )}
                  </span>
                )}
              {field.openForBooking && (
                <div>
                  <span className={classes.statSpan}>
                    <PeopleIcon /> {stats.totalBooked} booked{" "}
                  </span>
                  <span className={classes.statSpan}>
                    <CompletedIcon /> {stats.totalPlayed} times{" "}
                  </span>
                </div>
              )}
            </>
          }
        />
        <div className={classes.flex}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={field.fieldName}
          />
          <div className={classes.details}>
            <Typography className={classes.subheading} variant="body1">
              {field.description}
            </Typography>
            {field.openForBooking && (
              <div className={classes.enroll}>
                <Book fieldId={field._id} />
              </div>
            )}
          </div>
        </div>
        <Divider />

        <div>
          <CardHeader />
          <MaterialTable
            title={
              <Typography variant="h6" className={classes.subheading}>
                Available Slots{" "}
                <Chip
                  label={handleAvailableSlots(field.slots)}
                  className={classes.subheading}
                />
              </Typography>
            }
            columns={[
              { title: "Date", field: "ofDate" },
              { title: "Day", field: "day" },
              { title: "Start Time", field: "startTime" },
              { title: "End Time", field: "endTime" },
              { title: "Duration", field: "duration" },
              { title: "Cost", field: "price" },
              { title: "Booking Status", field: "status" },
            ]}
            data={handleSlotInfo(field.slots)}
            components={{
              Actions: () => {
                return (
                  auth.isAuthenticated().user &&
                  auth.isAuthenticated().user._id == field.fieldOwner._id &&
                  !field.openForBooking && (
                    <span className={classes.action}>
                      <NewSlot fieldId={field._id} addSlot={addSlot} />
                    </span>
                  )
                )
              },
              // Toolbar: (props) => (
              //   <div>
              //     <MTableToolbar {...props} />
              //     <div style={{ padding: "0px 10px" }}>
              //       <Chip
              //         label={field.slots && field.slots.length}
              //         color="secondary"
              //         style={{ marginRight: 5, marginLeft: 10 }}
              //       />
              //     </div>
              //   </div>
              // ),
            }}
            //icons with error button in button
            // icons={{
            //   Add: () =>
            //     auth.isAuthenticated().user &&
            //     auth.isAuthenticated().user._id == field.fieldOwner._id &&
            //     !field.openForBooking && (
            //       <span className={classes.action}>
            //         <NewSlot fieldId={field._id} addSlot={addSlot} />
            //       </span>
            //     ),
            // }}
            //toolbar actions
            // actions={[
            //   auth.isAuthenticated().user &&
            //     auth.isAuthenticated().user._id == field.fieldOwner._id &&
            //     !field.openForBooking && {
            //       icon: () => <NewSlot fieldId={field._id} addSlot={addSlot} />,
            //       isFreeAction: true,
            //     },
            // ]}

            //row actions
            // actions={[
            //   {
            //     icon: "save",
            //     tooltip: "Book",
            //     onClick: (event, rowData) => alert("You booked" + rowData.time),
            //   },
            //   (rowData) => ({
            //     icon: "delete",
            //     tooltip: "Cancel Booking",
            //     onClick: (event, rowData) =>
            //       confirm("You want to delete " + rowData.price),
            //     disabled: rowData.day == null,
            //   }),
            // ]}
            options={{ actionsColumnIndex: -1, search: false }}
          />
          {/* <List>
            {field.slots &&
              field.slots.map((slot, index) => {
                return (
                  <span key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar>{index + 1}</Avatar>
                      </ListItemAvatar>
                      <ListItemText primary={slot.price} />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </span>
                )
              })}
          </List> */}
        </div>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Open Field For Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Opening Field for booking will make this field live to players for
            booking slots.
          </Typography>
          <Typography variant="body1">
            Make sure at least one slot is added
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Cancel
          </Button>
          <Button onClick={openBooking} color="primary" variant="contained">
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
