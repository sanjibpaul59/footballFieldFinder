import React, { useState } from "react"
import PropTypes from "prop-types"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import { create } from "./api-booking"
import auth from "./../auth/auth-helper"
import { Redirect } from "react-router-dom"

const useStyles = makeStyles((theme) => ({
  form: {
    minWidth: 500,
  },
}))

export default function Book(props) {
  const classes = useStyles()
  const [values, setValues] = useState({
    bookingId: "",
    error: "",
    redirec: false,
  })
  const jwt = auth.isAuthenticated()

  const clickBook = () => {
    create(
      {
        fieldId: props.fieldId,
      },
      { t: jwt.token }
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, bookingId: data._id, redirect: true })
      }
    })
  }
  if (values.redirect) {
    return <Redirect to={"/play/" + values.bookingId} />
  }
  return (
    <Button variant="contained" color="secondary" onClick={clickBook}>
      Book
    </Button>
  )
}

Book.propTypes = {
  fieldId: PropTypes.string.isRequired,
}
