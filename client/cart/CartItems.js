import React, { useState } from "react"
import auth from "./../auth/auth-helper"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardMedia from "@material-ui/core/CardMedia"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core/styles"
import cart from "./cart-helper.js"
import { Link } from "react-router-dom"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import { DateTime } from "luxon"

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: 800,
    margin: "24px 0px",
    padding: "16px 40px 60px 40px",
    backgroundColor: "#80808017",
  },
  table: {
    minWidth: 700,
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.openTitle,
    fontSize: "1.2em",
  },
  price: {
    color: theme.palette.text.secondary,
    display: "inline",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: 0,
    width: 50,
  },
  fieldTitle: {
    fontSize: "1.15em",
    marginBottom: "5px",
  },
  subheading: {
    color: "rgba(88, 114, 128, 0.67)",
    padding: "8px 10px 0",
    cursor: "pointer",
    display: "inline-block",
  },
  cart: {
    width: "100%",
    display: "inline-flex",
  },
  details: {
    display: "inline-block",
    width: "100%",
    padding: "4px",
  },
  content: {
    flex: "1 0 auto",
    padding: "16px 8px 0px",
  },
  cover: {
    width: 160,
    height: 125,
    margin: "8px",
  },
  itemTotal: {
    float: "right",
    marginRight: "40px",
    fontSize: "1.5em",
    color: "rgb(72, 175, 148)",
  },
  checkout: {
    float: "right",
    margin: "24px",
  },
  total: {
    fontSize: "1.2em",
    color: "rgb(53, 97, 85)",
    marginRight: "16px",
    fontWeight: "600",
    verticalAlign: "bottom",
  },
  continueBtn: {
    marginLeft: "10px",
  },
  itemShop: {
    display: "block",
    fontSize: "0.90em",
    color: "#78948f",
  },
  removeButton: {
    fontSize: "0.8em",
  },
}))

export default function CartItems(props) {
  const classes = useStyles()
  const [cartItems, setCartItems] = useState(cart.getCart())

  const handleChange = (index) => (event) => {
    let updatedCartItems = cartItems
    if (event.target.value == 0) {
      updatedCartItems[index].quantity = 1
    } else {
      updatedCartItems[index].quantity = event.target.value
    }
    setCartItems([...updatedCartItems])
    cart.updateCart(index, event.target.value)
  }

  const getTotal = () => {
    return cartItems.reduce((a, b) => {
      return a + b.slot.price
    }, 0)
  }

  const removeItem = (index) => (event) => {
    let updatedCartItems = cart.removeItem(index)
    if (updatedCartItems.length == 0) {
      props.setCheckout(false)
    }
    setCartItems(updatedCartItems)
  }

  const openCheckout = () => {
    props.setCheckout(true)
  }

  return (
    <Card className={classes.card}>
      <Typography type="title" className={classes.title}>
        Your Slots
      </Typography>
      {cartItems.length > 0 ? (
        <div>
          <TableContainer component={Paper}>
            <Table className={classes.table} arial-lable="spanning table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="right">Start Time</TableCell>
                  <TableCell align="right">End Time</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Options</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell align="right">
                      {DateTime.fromISO(item.slot.ofDate).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {DateTime.fromISO(item.slot.startTime).toLocaleString(
                        DateTime.TIME_SIMPLE
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {" "}
                      {DateTime.fromISO(item.slot.endTime).toLocaleString(
                        DateTime.TIME_SIMPLE
                      )}
                    </TableCell>
                    <TableCell align="right">{item.slot.duration}</TableCell>
                    <TableCell align="right">{item.slot.price}</TableCell>
                    <TableCell align="right">
                      <Button
                        className={classes.removeButton}
                        color="primary"
                        onClick={removeItem(i)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell align="right" colSpan={4}>
                    Sub Total
                  </TableCell>
                  <TableCell align="right">BDT {getTotal()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right" colSpan={4}>
                    Discount
                  </TableCell>
                  <TableCell align="right">0%</TableCell>
                </TableRow>
                <TableRow className={classes.total}>
                  <TableCell
                    className={classes.total}
                    align="right"
                    colSpan={4}
                  >
                    Total
                  </TableCell>
                  <TableCell align="right">BDT {getTotal()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div className={classes.checkout}>
            {!props.checkout &&
              (auth.isAuthenticated() ? (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={openCheckout}
                >
                  Checkout
                </Button>
              ) : (
                <Link to="/signin">
                  <Button color="primary" variant="contained">
                    Sign in to checkout
                  </Button>
                </Link>
              ))}
            <Link to="/" className={classes.continueBtn}>
              <Button variant="contained">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      ) : (
        <Typography variant="subtitle1" component="h3" color="primary">
          No items added to your cart.
        </Typography>
      )}

      {/* {cartItems.length > 0 ? (
        <span>
          {cartItems.map((item, i) => {
            return (
              <span key={i}>
                <Card className={classes.cart}>
                  <CardMedia
                    className={classes.cover}
                    image={"/api/field/image/" + item.ofField}
                    title={item.ofDate}
                  />
                  <div className={classes.details}>
                    <CardContent className={classes.content}>
                      <Link to={"/field/" + item._id}>
                        <Typography
                          type="title"
                          component="h3"
                          className={classes.fieldTitle}
                          color="primary"
                        >
                          {item.startTime}
                        </Typography>
                      </Link>
                      <div>
                        <Typography
                          type="subheading"
                          component="h3"
                          className={classes.price}
                          color="primary"
                        >
                          $ {item.price}
                        </Typography>

                        <span className={classes.itemShop}>
                          Shop: {item.endTime}
                        </span>
                      </div>
                    </CardContent>
                    <div className={classes.subheading}>
                      <Button
                        className={classes.removeButton}
                        color="primary"
                        onClick={removeItem(i)}
                      >
                        x Remove
                      </Button>
                    </div>
                  </div>
                </Card>
                <Divider />
              </span>
            )
          })}
          <div className={classes.checkout}>
            <span className={classes.total}>Total: ${getTotal()}</span>
            {!props.checkout &&
              (auth.isAuthenticated() ? (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={openCheckout}
                >
                  Checkout
                </Button>
              ) : (
                <Link to="/signin">
                  <Button color="primary" variant="contained">
                    Sign in to checkout
                  </Button>
                </Link>
              ))}
            <Link to="/" className={classes.continueBtn}>
              <Button variant="contained">Continue Shopping</Button>
            </Link>
          </div>
        </span>
      ) : (
        <Typography variant="subtitle1" component="h3" color="primary">
          No items added to your cart.
        </Typography>
      )} */}
    </Card>
  )
}

CartItems.propTypes = {
  checkout: PropTypes.bool.isRequired,
  setCheckout: PropTypes.func.isRequired,
}
