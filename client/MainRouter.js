import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/Home'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import NewField from './fields/NewField'
import Fields from './fields/Fields'
import FieldByOwner from './fields/FieldByOwner'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'

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
        <Route path="/fields" component={Fields} />
        //For the field owners
        <PrivateRoute path="/owner/add-field" component={NewField} />
        <PrivateRoute path="/owner/my-fields" component={FieldByOwner} />
      </Switch>
    </div>
  )
}

export default MainRouter
