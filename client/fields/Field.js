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
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
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
    maxWidth: 1000,
    margin: "auto",
    padding: theme.spacing(2),
    marginTop: theme.spacing(12),
  }),
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "20px 0px 40px",
  },
  table: {
    width: 970,
    padding: theme.spacing(2),
  },
  content: {
    maxWidth: 800,
    margin: "auto",
  },
  // list: {
  //   display: "flex",
  // },
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
    width: "50%",
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
    console.log(field.facilities)
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
          validSlots.push(slot)
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
          validSlots.push(slots)
        }
        return validSlots
      }, [])
      return allAvailableSlots.length
    }
  }
  const handleBooking = () => {
    console.log("It's a button!")
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

            {/* {field.openForBooking && (
              <div className={classes.enroll}>
                <Book fieldId={field._id} />
              </div>
            )} */}
          </div>
        </div>
        <Divider />

        <div className={classes.details}>
          <Typography className={classes.subheading} variant="body1">
            Facilities:
          </Typography>
          <List dense className={classes.list}>
            {field.facilities &&
              field.facilities.map((facility) => {
                return (
                  <ListItem key={facility}>
                    <ListItemText primary={facility} />
                  </ListItem>
                )
              })}
          </List>
        </div>

        <Divider />

        <div className={classes.table}>
          <MaterialTable
            style={{ fontSize: 15 }}
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
              {
                title: "Date",
                field: "ofDate",
                render: (rowData) =>
                  DateTime.fromISO(rowData.ofDate).toLocaleString(
                    DateTime.DATE_SHORT
                  ),
              },
              { title: "Day", field: "day" },
              {
                title: "Start Time",
                field: "startTime",
                render: (rowData) =>
                  DateTime.fromISO(rowData.startTime).toLocaleString(
                    DateTime.TIME_SIMPLE
                  ),
              },
              {
                title: "End Time",
                field: "endTime",
                render: (rowData) =>
                  DateTime.fromISO(rowData.endTime).toLocaleString(
                    DateTime.TIME_SIMPLE
                  ),
              },
              {
                title: "Duration",
                field: "duration",
                render: (rowData) => rowData.duration + " mins",
              },
              {
                title: "Cost",
                field: "price",
                render: (rowData) => "BDT " + rowData.price,
              },
              {
                title: "Status",
                field: "bookingStatus",
                render: (rowData) =>
                  rowData.bookingStatus == false ? (
                    <Button
                      color="primary"
                      size="small"
                      onClick={handleBooking}
                    >
                      Book
                    </Button>
                  ) : (
                    <Button color="secondary" size="small" disabled>
                      Booked
                    </Button>
                  ),
              },
            ]}
            data={handleSlotInfo(field.slots)}
            components={{
              Actions: () => {
                return (
                  auth.isAuthenticated().user &&
                  auth.isAuthenticated().user._id == field.fieldOwner._id &&
                  (!field.openForBooking ||
                    (field.openForBooking && (
                      <span className={classes.action}>
                        <NewSlot fieldId={field._id} addSlot={addSlot} />
                      </span>
                    )))
                )
              },
            }}
            options={{ actionsColumnIndex: -1, search: false }}
          />
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
