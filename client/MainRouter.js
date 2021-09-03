import React from "react"
import { Route, Switch } from "react-router-dom"
import Home from "./core/Home"
import Signup from "./user/Signup"
import Signin from "./auth/Signin"
import EditProfile from "./user/EditProfile"
import Profile from "./user/Profile"
import PrivateRoute from "./auth/PrivateRoute"
import Menu from "./core/Menu"
import NewField from "./fields/NewField"
import Myfields from "./fields/MyFields"
import Field from "./fields/Field"
import EditField from "./fields/EditField"
import Cart from "./cart/Cart"

const MainRouter = () => {
  return (
    <div>
      <Menu />
      <Switch>
        //User section
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route path="/user/:userId" component={Profile} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        //Open for all visitors
        <Route path="/cart" component={Cart} />
        <Route path="/field/:fieldId" component={Field} />
        //For the field owners
        <PrivateRoute path="/owner/my-fields" component={Myfields} />
        <PrivateRoute
          path="/owner/my-field/edit/:fieldId"
          component={EditField}
        />
        <PrivateRoute path="/owner/add-field" component={NewField} />
        <PrivateRoute path="/owner/field/:fieldId" component={Field} />
      </Switch>
    </div>
  )
}

export default MainRouter
