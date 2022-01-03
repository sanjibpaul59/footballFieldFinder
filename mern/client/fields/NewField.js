import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Chip from "@material-ui/core/Chip"
import FileUpload from "@material-ui/icons/AddPhotoAlternate"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import auth from "../auth/auth-helper"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { create } from "./api-field.js"
import { Link, Redirect } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 700,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(12),
    paddingBottom: theme.spacing(4),
  },
  error: {
    verticalAlign: "middle",
  },
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  input: {
    display: "none",
  },
  filename: {
    marginLeft: "10px",
  },
  btn: {
    backgroundColor: "#00796b",
    marginBottom: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 400,
  },
  chips: {
    display: "flex",
    flexWrap: "noWrap",
  },
  chip: {
    margin: 2,
  },
}))
const ITEM_HEIGHT = 40
const ITEM_PADDING_TOP = 4
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
}
let names = [
  "Flood Light",
  "Water",
  "Locker",
  "Shower Facility",
  "Dressing Room",
  "Parking Space",
  "Sitting Arrangement",
  "Store",
  "Cafe",
  "First Aid",
]

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

export default function NewField() {
  const classes = useStyles()
  const theme = useTheme()

  const [values, setValues] = useState({
    bin: "",
    fieldName: "",
    location: "",
    description: "",
    fieldType: "",
    fieldSize: "",
    image: "",
    facilities: [],
    redirect: false,
    error: "",
  })

  const jwt = auth.isAuthenticated()

  const handleChange = (name) => (event) => {
    const value = name === "image" ? event.target.files[0] : event.target.value
    setValues({ ...values, [name]: value })
  }

  const clickSubmit = () => {
    let fieldData = new FormData()
    values.bin && fieldData.append("bin", values.bin)
    values.fieldName && fieldData.append("fieldName", values.fieldName)
    values.location && fieldData.append("location", values.location)
    values.description && fieldData.append("description", values.description)
    values.fieldType && fieldData.append("fieldType", values.fieldType)
    values.fieldSize && fieldData.append("fieldSize", values.fieldSize)
    values.image && fieldData.append("image", values.image)
    fieldData.append("facilities", JSON.stringify(values.facilities))
    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      fieldData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, error: "", redirect: true })
      }
    })
  }

  if (values.redirect) {
    return <Redirect to={"/owner/my-fields"} />
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Add Field
          </Typography>
          <br />
          <input
            accept="image/*"
            onChange={handleChange("image")}
            className={classes.input}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <Button
              variant="contained"
              component="span"
              className={classes.btn}
            >
              Upload Photo
              <FileUpload />
            </Button>
          </label>
          <span className={classes.filename}>
            {values.image ? values.image.name : ""}
          </span>
          <br />
          <TextField
            id="bin"
            label="Business Identification Number"
            className={classes.textField}
            value={values.bin}
            onChange={handleChange("bin")}
            margin="normal"
          />
          <br />
          <TextField
            id="fieldName"
            label="Field Name"
            className={classes.textField}
            value={values.fieldName}
            onChange={handleChange("fieldName")}
            margin="normal"
          />
          <br />
          <TextField
            id="location"
            label="Field Location"
            className={classes.textField}
            value={values.location}
            onChange={handleChange("location")}
            margin="normal"
          />
          <br />
          <TextField
            id="description"
            label="Field Details"
            multiline
            rows="2"
            className={classes.textField}
            value={values.description}
            onChange={handleChange("description")}
            margin="normal"
          />
          <br />
          <FormControl className={classes.formControl}>
            <InputLabel id="field-type" margin="dense">
              Field Type
            </InputLabel>
            <Select
              labelId="field-type"
              name="fieldType"
              id="fieldType"
              value={values.fieldType}
              onChange={handleChange("fieldType")}
            >
              <MenuItem value={"Grass Field"}>Grass Field</MenuItem>
              <MenuItem value={"Turf"}>Artificial Grass/Turf</MenuItem>
              <MenuItem value={"Indoor"}>Indoor</MenuItem>
            </Select>
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <InputLabel id="field-size" margin="dense">
              Field Size
            </InputLabel>
            <Select
              labelId="field-size"
              name="fieldSize"
              id="fieldSize"
              value={values.fieldSize}
              onChange={handleChange("fieldSize")}
            >
              <MenuItem value={"small"}>Small </MenuItem>
              <MenuItem value={"medium"}>Medium </MenuItem>
              <MenuItem value={"large"}>Large</MenuItem>
            </Select>
          </FormControl>
          <br />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-chip-label">Facilities</InputLabel>
            <Select
              labelId="demo-mutiple-chip-label"
              id="demo-mutiple-chip"
              multiple
              value={values.facilities}
              onChange={(event) =>
                setValues({
                  ...values,
                  facilities: event.target.value,
                })
              }
              input={<Input id="select-multiple-chip" />}
              renderValue={(selected) => (
                <div className={classes.chips}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, values.facilities, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />

          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
          >
            Submit
          </Button>
          <Link to="/owner/my-fields" className={classes.submit}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  )
}
