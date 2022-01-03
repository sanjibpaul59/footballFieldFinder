import React, { useState, useEffect } from "react"
import Card from "@material-ui/core/Card"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Icon from "@material-ui/core/Icon"
import auth from "./../auth/auth-helper"
import cart from "./cart-helper.js"
import PlaceOrder from "./PlaceOrder"

const useStyles = makeStyles((theme) => ({
  card: {
    margin: "24px 0px",
    padding: "16px 40px 90px 40px",
    backgroundColor: "#80808017",
  },
  title: {
    margin: "24px 16px 8px 0px",
    color: theme.palette.openTitle,
  },
  subheading: {
    color: "rgba(88, 114, 128, 0.87)",
    marginTop: "20px",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "90%",
  },
}))

export default function Checkout() {
  const classes = useStyles()
  const user = auth.isAuthenticated().user
  const [values, setValues] = useState({
    checkoutDetails: {
      slots: cart.getCart(),
      customer_name: user.name,
      customer_email: user.email,
    },
    error: "",
  })

  const handleCustomerChange = (name) => (event) => {
    let checkoutDetails = values.checkoutDetails
    checkoutDetails[name] = event.target.value || undefined
    setValues({ ...values, checkoutDetails: checkoutDetails })
  }

  const getTotal = () => {
    return values.checkoutDetails.slots.reduce((a, b) => {
      return a + b.slot.price
    }, 0)
  }
  return (
    <Card className={classes.card}>
      <Typography type="title" className={classes.title}>
        Checkout
      </Typography>
      <TextField
        id="name"
        label="Name"
        className={classes.textField}
        value={values.checkoutDetails.customer_name}
        onChange={handleCustomerChange("customer_name")}
        margin="normal"
      />
      <br />
      <TextField
        id="email"
        type="email"
        label="Email"
        className={classes.textField}
        value={values.checkoutDetails.customer_email}
        onChange={handleCustomerChange("customer_email")}
        margin="normal"
      />
      <br />
      <TextField
        disabled
        className={classes.textField}
        label="Number of Slots"
        value={values.checkoutDetails.slots.length}
        margin="normal"
      />
      <TextField
        disabled
        className={classes.textField}
        label="Total Cost"
        value={getTotal()}
        margin="normal"
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
      <div>
        <PlaceOrder checkoutDetails={values.checkoutDetails} />
      </div>
    </Card>
  )
}
