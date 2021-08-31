import React, { useState, useEffect } from "react"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardMedia from "@material-ui/core/CardMedia"
import Typography from "@material-ui/core/Typography"
import FileUpload from "@material-ui/icons/AddPhotoAlternate"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import { read, update } from "./api-field.js"
import { Link, Redirect } from "react-router-dom"
import auth from "./../auth/auth-helper"
import Divider from "@material-ui/core/Divider"
import DeleteField from "./DeleteField"
import MaterialTable from "material-table"
import Chip from "@material-ui/core/Chip"
import Checkbox from "@material-ui/core/Checkbox"
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
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  upArrow: {
    border: "2px solid #f57c00",
    marginLeft: 3,
    marginTop: 10,
    padding: 4,
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  media: {
    height: 250,
    display: "inline-block",
    width: "50%",
    marginLeft: "16px",
  },
  icon: {
    verticalAlign: "sub",
  },
  textfield: {
    width: 350,
  },
  action: {
    margin: "8px 24px",
    display: "inline-block",
  },
  input: {
    display: "none",
  },
  filename: {
    marginLeft: "10px",
  },
  list: {
    backgroundColor: "#f3f3f3",
  },
}))

export default function EditField({ match }) {
  const classes = useStyles()
  const [field, setField] = useState({
    fieldName: "",
    location: "",
    description: "",
    image: "",
    fieldType: "",
    fieldSize: "",
    fieldOwner: {},
    slots: [],
    facilities: [],
  })
  const [values, setValues] = useState({
    redirect: false,
    error: "",
  })
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ fieldId: match.params.fieldId }, signal).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        data.image = ""
        setField(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.fieldId])
  const jwt = auth.isAuthenticated()
  const handleChange = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value
    setField({ ...field, [name]: value })
  }
  const handleSlotChange = (name, index) => (event) => {
    const slots = field.slots
    slots[index][name] = event.target.value
    setField({ ...field, slots: slots })
  }
  const deleteSlot = (index) => (event) => {
    const slots = field.slots
    slots.splice(index, 1)
    setField({ ...field, slots: slots })
  }
  const addSlot = (field) => {
    setField(field)
  }
  const removeField = (field) => {
    setValues({ ...values, redirect: true })
  }
  const moveUp = (index) => (event) => {
    const slots = field.slots
    const moveUp = slots[index]
    slots[index] = slots[index - 1]
    slots[index - 1] = moveUp
    setField({ ...field, slots: slots })
  }
  const handleSlotInfo = (slots) => {
    if (slots != undefined) {
      let allSlots
      allSlots = slots.map((slot) => {
        return slot
      })
      return allSlots
    }
  }
  const handleRowUpdate = (newData, oldData) => {
    const dataUpdate = [...field.slots]
    const index = oldData.tableData.id
    dataUpdate[index] = newData

    setField({ ...field, slots: dataUpdate })
  }
  const handleRowDelete = (oldData) => {
    const index = oldData.tableData.id
    const dataDelete = [...field.slots]
    dataDelete.splice(index, 1)
    setField({ ...field, slots: dataDelete })
  }
  const clickSubmit = () => {
    let fieldData = new FormData()
    field.fieldName && fieldData.append("fieldName", field.fieldName)
    field.fieldSize && fieldData.append("fieldSize", field.fieldSize)
    field.fieldType && fieldData.append("fieldType", field.fieldType)
    field.location && fieldData.append("location", field.location)
    field.description && fieldData.append("description", field.description)
    field.image && fieldData.append("image", field.image)
    fieldData.append("slots", JSON.stringify(field.slots))
    fieldData.append("facilities", JSON.stringify(field.facilities))
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
        console.log(data.error)
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, redirect: true })
      }
    })
  }
  const handleBooking = () => {
    console.log("It's a button!")
  }

  if (values.redirect) {
    return <Redirect to={"/owner/field/" + field._id} />
  }
  const imageUrl = field._id
    ? `/api/fields/image/${field._id}?${new Date().getTime()}`
    : "/api/fields/defaultphoto"
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader
          title={
            <TextField
              margin="dense"
              label="Field Name"
              type="text"
              fullWidth
              value={field.fieldName}
              onChange={handleChange("fieldName")}
            />
          }
          subheader={
            <div>
              <Link
                to={"/user/" + field.fieldOwner._id}
                className={classes.sub}
              >
                By {field.fieldOwner.name}
              </Link>
              {
                <TextField
                  margin="dense"
                  label="Location"
                  type="text"
                  fullWidth
                  value={field.location}
                  onChange={handleChange("location")}
                />
              }
            </div>
          }
          action={
            auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id == field.fieldOwner._id && (
              <span className={classes.action}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={clickSubmit}
                >
                  Save
                </Button>
                <DeleteField field={field} onRemove={removeField} />
              </span>
            )
          }
        />
        <div className={classes.flex}>
          <CardMedia
            className={classes.media}
            image={imageUrl}
            title={field.name}
          />
          <div className={classes.details}>
            <TextField
              margin="dense"
              multiline
              rows="5"
              label="Description"
              type="text"
              className={classes.textfield}
              value={field.description}
              onChange={handleChange("description")}
            />
            <br />
            <br />
            <input
              accept="image/*"
              onChange={handleChange("image")}
              className={classes.input}
              id="icon-button-file"
              type="file"
            />
            <label htmlFor="icon-button-file">
              <Button variant="outlined" color="secondary" component="span">
                Change Photo
                <FileUpload />
              </Button>
            </label>{" "}
            <span className={classes.filename}>
              {field.image ? field.image.name : ""}
            </span>
            <br />
          </div>
        </div>
        <Divider />
        <div className={classes.table}>
          <MaterialTable
            style={{ fontSize: 15 }}
            title={
              <Typography variant="h6" className={classes.subheading}>
                Slots - Edit and Rearrange
                <Chip
                  label={field.slots && field.slots.length}
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
                type: "datetime",
                render: (rowData) =>
                  DateTime.fromISO(rowData.endTime).toLocaleString(
                    DateTime.TIME_SIMPLE
                  ),
              },
              {
                title: "Duration",
                field: "duration",
                type: "numeric",
                render: (rowData) => rowData.duration + " mins",
              },
              {
                title: "Cost",
                field: "price",
                type: "numeric",
                render: (rowData) => "BDT " + rowData.price,
              },
              {
                title: "Status",
                field: "bookingStatus",
                type: "boolean",
                render: (rowData) =>
                  rowData.bookingStatus == false ? "Available" : "Booked",
              },
            ]}
            data={handleSlotInfo(field.slots)}
            editable={{
              isEditable: (rowData) =>
                DateTime.fromISO(rowData.ofDate) > DateTime.now(),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    handleRowUpdate(newData, oldData)
                    resolve()
                  }, 1000)
                }),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    handleRowDelete(oldData)
                    resolve()
                  }, 1000)
                }),
            }}
            options={{ actionsColumnIndex: -1, search: false }}
          />
          {/* <List>
            {field.slots &&
              field.slots.map((slot, index) => {
                return (
                  <span key={index}>
                    <ListItem className={classes.list}>
                      <ListItemAvatar>
                        <>
                          <Avatar>{index + 1}</Avatar>
                          {index != 0 && (
                            <IconButton
                              aria-label="up"
                              color="primary"
                              onClick={moveUp(index)}
                              className={classes.upArrow}
                            >
                              <ArrowUp />
                            </IconButton>
                          )}
                        </>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <>
                            <TextField
                              margin="dense"
                              label="Price"
                              type="text"
                              fullWidth
                              value={slot.price}
                              onChange={handleSlotChange("price", index)}
                            />
                            <br />
                            <TextField
                              margin="dense"
                              label="Day"
                              type="text"
                              fullWidth
                              value={slot.day}
                              onChange={handleSlotChange("day", index)}
                            />
                            <br />
                          </>
                        }
                      /> */}
          {/* {!field.openForBooking && ( */}
          {/* <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="up"
                          color="primary"
                          onClick={deleteSlot(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                      {/* )} */}
          {/* </ListItem>
                    <Divider
                      style={{ backgroundColor: "rgb(106, 106, 106)" }}
                      component="li"
                    />
                  </span>
                )
              })}
          </List>  */}
        </div>
      </Card>
    </div>
  )
}
