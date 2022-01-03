import React, { useState, useEffect } from "react"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import Avatar from "@material-ui/core/Avatar"
import FileUpload from "@material-ui/icons/AddPhotoAlternate"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import { makeStyles } from "@material-ui/core/styles"
import auth from "./../auth/auth-helper"
import { read, update } from "./api-user.js"
import { Redirect } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: "auto",
    textAlign: "center",
    marginTop: theme.spacing(12),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.protectedTitle,
  },
  error: {
    verticalAlign: "middle",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: "auto",
    marginBottom: theme.spacing(2),
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto",
  },
  input: {
    display: "none",
  },
  filename: {
    marginLeft: "10px",
  },
}))

export default function EditProfile({ match }) {
  const classes = useStyles()
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    phone: "",
    photo: "",
    owner: false,
    id: "",
    error: "",
    redirectToProfile: false,
  })
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read(
      {
        userId: match.params.userId,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({
          ...values,
          id: data._id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          owner: data.owner,
        })
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [match.params.userId])

  const clickSubmit = () => {
    const userData = new FormData()
    values.name && userData.append("name", values.name)
    values.email && userData.append("email", values.email)
    values.password && userData.append("password", values.password)
    values.phone && userData.append("phone", values.phone)
    values.photo && userData.append("photo", values.photo)
    userData.append("owner", values.owner)

    update(
      {
        userId: match.params.userId,
      },
      {
        t: jwt.token,
      },
      userData
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        auth.updateUser(data, () => {
          setValues({ ...values, userId: data._id, redirectToProfile: true })
        })
      }
    })
  }
  const handleChange = (name) => (event) => {
    const value = name === "photo" ? event.target.files[0] : event.target.value
    //user.set(name, value)
    setValues({ ...values, [name]: value })
  }

  const photoUrl = values.id
    ? `/api/users/photo/${values.id}?${new Date().getTime()}`
    : `/api/users/defaultphoto`

  const handleCheck = (event, checked) => {
    setValues({ ...values, owner: checked })
  }

  if (values.redirectToProfile) {
    return <Redirect to={"/user/" + values.id} />
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <Avatar src={photoUrl} className={classes.bigAvatar} />
        <br />
        <input
          accept="image/*"
          onChange={handleChange("photo")}
          style={{ display: "none" }}
          className={classes.input}
          id="icon-button-file"
          type="file"
        />
        <label htmlFor="icon-button-file">
          <Button variant="contained" color="default" component="span">
            Upload
            <FileUpload />
          </Button>
        </label>
        <span className={classes.filename}>
          {values.photo ? values.photo.name : ""}
        </span>
        <br />
        <TextField
          id="name"
          label="Name"
          className={classes.textField}
          value={values.name}
          onChange={handleChange("name")}
          margin="normal"
        />
        <br />
        <TextField
          id="email"
          type="email"
          label="Email"
          className={classes.textField}
          value={values.email}
          onChange={handleChange("email")}
          margin="normal"
        />
        <br />
        <TextField
          id="phone"
          type="phone"
          label="Phone"
          className={classes.textField}
          value={values.phone}
          onChange={handleChange("phone")}
          margin="normal"
        />
        <br />
        <TextField
          id="password"
          type="password"
          label="Password"
          className={classes.textField}
          value={values.password}
          onChange={handleChange("password")}
          margin="normal"
        />
        <br />
        <br />
        <Typography variant="subtitle1" className={classes.subheading}>
          I am a Field Owner
        </Typography>
        <FormControlLabel
          control={
            <Switch
              classes={{
                checked: classes.checked,
                bar: classes.bar,
              }}
              checked={values.owner}
              onChange={handleCheck}
              // value="owner"
            />
          }
          label={values.owner ? "Yes" : "No"}
        />
        <br />{" "}
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
      </CardActions>
    </Card>
  )
}