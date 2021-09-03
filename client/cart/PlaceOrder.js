import React, { useState } from "react"
import PropTypes from "prop-types"
import Button from "@material-ui/core/Button"
import auth from "./../auth/auth-helper"
import { makeStyles, Typography } from "@material-ui/core"
import cart from "./cart-helper"

const useStyles = makeStyles((theme) => ({
  orderBtn: {
    margin: "auto",
  },
  checkout: {
    float: "right",
    margin: "20px 30px",
  },
  success: {
    color: "#357a38",
    display: "inline",
    margin: "20px 30px",
  },
}))

export default function PlaceOrder(props) {
  const classes = useStyles()
  const [values, setValues] = useState({
    orderId: "",
    redirect: false,
    message: "",
  })
  const setMessage = () => {
    const message = "Successfully Booked!"
    setValues({ ...values, message: message })
    cart.emptyCart()
  }
  return (
    <div className={classes.checkout}>
      {" "}
      {values.message && (
        <Typography component="span" className={classes.success}>
          {" "}
          {values.message}{" "}
        </Typography>
      )}
      <Button onClick={setMessage} color="secondary" variant="contained">
        Place Order
      </Button>
    </div>
  )
}

PlaceOrder.propTypes = {
  checkoutDetails: PropTypes.object.isRequired,
}
